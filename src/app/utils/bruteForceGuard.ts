import { redis } from "../../lib/radis";

import config from "../config";


const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;
const ATTEMPT_WINDOW_SECONDS = 15 * 60;

const attemptsKey = (identifier: string) => `login:attempts:${identifier}`;
const lockKey = (identifier: string) => `login:locked:${identifier}`;

export const isLocked = async (identifier: string): Promise<boolean> => {
	if (config.app.env !== "production") {
		return false;
	}

	try {
		const locked = await redis.get(lockKey(identifier));
		return Boolean(locked);
	} catch {
		return false;
	}
};

export const recordFailedAttempt = async (identifier: string) => {
	if (config.app.env !== "production") {
		return;
	}

	try {
		const key = attemptsKey(identifier);
		const attempts = await redis.incr(key);

		if (attempts === 1) {
			await redis.expire(key, ATTEMPT_WINDOW_SECONDS);
		}

		if (attempts >= MAX_ATTEMPTS) {
			await redis.set(lockKey(identifier), "1", "EX", LOCKOUT_SECONDS);
			await redis.del(key);
		}
	} catch {
		// Silently ignore Redis failures — brute-force protection is a
		// nice-to-have, not a hard requirement for the app to function.
	}
};

export const clearFailedAttempts = async (identifier: string) => {
	if (config.app.env !== "production") {
		return;
	}

	try {
		await redis.del(attemptsKey(identifier));
	} catch {
		// Ignore Redis failures.
	}
};