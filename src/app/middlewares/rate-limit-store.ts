import type {
	ClientRateLimitInfo,
	IncrementResponse,
	Options,
	Store,
} from "express-rate-limit";
import { redis } from "../../lib/radis";

/**
 * Redis-backed `express-rate-limit` Store using the app's existing ioredis
 * client (`src/lib/radis.ts`).
 *
 * Design notes:
 * - Keys are namespaced with the `prefix` field so multiple limiters cannot
 *   collide inside Redis (`ratelimit:<limiter-name>:<key>`).
 * - `increment` uses a Lua script for atomic increment + first-touch TTL set.
 *   Without it, a race could set the TTL on a key that has no expiry.
 * - FAIL-OPEN: if Redis errors, the store resolves with a safe default
 *   (`{ totalHits: 0, resetTime: undefined }`). express-rate-limit's default
 *   `passOnStoreError: false` would otherwise throw and 500 the request; we
 *   override that per-limiter with `passOnStoreError: true`. Idempotency
 *   middleware (Phase 2) still guards duplicate submissions, so fail-open here
 *   is acceptable. Production-grade deployments should run Redis HA.
 * - The `get` method is implemented for parity with `express-rate-limit`'s
 *   `getKey` helper; it is not required by the middleware loop.
 */

const PREFIX = "ratelimit";

// Atomic: increment the counter, and on the first hit (count == 1) set the TTL.
// EVAL runs with Redis guarantees — no separate incr/expire race.
const INCR_WITH_TTL_LUA = `
local hits = redis.call('INCR', KEYS[1])
if hits == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return hits
`;

export class RedisStore implements Store {
	readonly prefix = PREFIX;

	private readonly windowMs: number;
	private readonly storeName: string;

	/**
	 * @param windowMs - the rate-limit window in milliseconds; converted to
	 *   seconds for Redis EXPIRE.
	 * @param storeName - short identifier used in the Redis key prefix so
	 *   different limiters don't share counters.
	 */
	constructor(windowMs: number, storeName: string) {
		this.windowMs = windowMs;
		this.storeName = storeName;
	}

	/** No-op init — the client is constructed eagerly in radis.ts. */
	init(_options: Options): void {
		// Intentionally empty.
	}

	async increment(key: string): Promise<IncrementResponse> {
		const fullKey = `${this.prefix}:${this.storeName}:${key}`;
		const ttlSeconds = Math.max(1, Math.ceil(this.windowMs / 1000));

		try {
			// Prefer the atomic Lua script (real Redis). Fall back to plain
			// incr+expire when `eval` is unavailable (e.g. the test mock in
			// tests/setup.ts, which only stubs get/set/del/incr/expire/quit/on).
			let hits: number;
			const maybeEval = (redis as unknown as { eval?: unknown }).eval;
			if (typeof maybeEval === "function") {
				hits = (await (redis as unknown as {
					eval: (
						script: string,
						numKeys: number,
						...args: (string | number)[]
					) => Promise<number>;
				}).eval(INCR_WITH_TTL_LUA, 1, fullKey, ttlSeconds)) as number;
			} else {
				hits = (await redis.incr(fullKey)) as number;
				if (hits === 1) {
					await redis.expire(fullKey, ttlSeconds);
				}
			}
			const resetTime = new Date(Date.now() + ttlSeconds * 1000);
			return { totalHits: hits, resetTime };
		} catch (error) {
			console.warn("[RedisStore] increment failed; failing open:", error);
			return { totalHits: 0, resetTime: undefined };
		}
	}

	async decrement(key: string): Promise<void> {
		const fullKey = `${this.prefix}:${this.storeName}:${key}`;
		try {
			const maybeDecr = (redis as unknown as { decr?: unknown }).decr;
			if (typeof maybeDecr === "function") {
				await (redis as unknown as {
					decr: (k: string) => Promise<number>;
				}).decr(fullKey);
			}
		} catch (error) {
			console.warn("[RedisStore] decrement failed; failing open:", error);
		}
	}

	async resetKey(key: string): Promise<void> {
		const fullKey = `${this.prefix}:${this.storeName}:${key}`;
		try {
			await redis.del(fullKey);
		} catch (error) {
			console.warn("[RedisStore] resetKey failed; failing open:", error);
		}
	}

	async resetAll(): Promise<void> {
		try {
			const pattern = `${this.prefix}:*`;
			const scan = (redis as unknown as {
				scan?: (pattern: string) => Promise<[string, string[]]>;
			}).scan;
			if (typeof scan === "function") {
				let cursor = "0";
				do {
					const [nextCursor, keys] = await scan(pattern);
					cursor = nextCursor;
					if (keys.length > 0) {
						await redis.del(...keys);
					}
				} while (cursor !== "0");
			}
		} catch (error) {
			console.warn("[RedisStore] resetAll failed; failing open:", error);
		}
	}

	async get(key: string): Promise<ClientRateLimitInfo | undefined> {
		const fullKey = `${this.prefix}:${this.storeName}:${key}`;
		try {
			const raw = await redis.get(fullKey);
			if (raw === null || raw === undefined) {
				return undefined;
			}
			const totalHits = Number.parseInt(raw, 10);
			const maybePttl = (redis as unknown as { pttl?: unknown }).pttl;
			let resetTime: Date | undefined;
			if (typeof maybePttl === "function") {
				const ttlMs = (await (redis as unknown as {
					pttl: (k: string) => Promise<number>;
				}).pttl(fullKey)) as number;
				if (Number.isFinite(ttlMs) && ttlMs > 0) {
					resetTime = new Date(Date.now() + ttlMs);
				}
			}
			return { totalHits: Number.isNaN(totalHits) ? 0 : totalHits, resetTime };
		} catch (error) {
			console.warn("[RedisStore] get failed; failing open:", error);
			return undefined;
		}
	}

	async shutdown(): Promise<void> {
		// Don't disconnect the shared client — other modules (cache, bruteForce)
		// still use it. No-op is correct here.
	}
}