import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../errors/appError";

// TODO: Phase 9 (BullMQ) — purge expired rows via a scheduled job

export const idempotency = () => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const keyHeader = req.headers["idempotency-key"];
		const key = Array.isArray(keyHeader) ? keyHeader[0] : keyHeader;

		if (!key || key.trim() === "") {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Idempotency-Key header is required",
				"MISSING_IDEMPOTENCY_KEY",
			);
		}

		if (key.length > 255) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				"Idempotency-Key too long",
				"INVALID_IDEMPOTENCY_KEY",
			);
		}

		if (!req.user?.id) {
			throw new AppError(
				StatusCodes.INTERNAL_SERVER_ERROR,
				"Idempotency middleware requires auth",
				"INTERNAL_MISCONFIGURATION",
			);
		}

		const userId = req.user.id;
		const rawBody = JSON.stringify(req.body ?? {});
		const requestHash = crypto
			.createHash("sha256")
			.update(`${rawBody}|${userId}`)
			.digest("hex");

		const existing = await prisma.idempotencyKey.findUnique({
			where: { key_userId: { key, userId } },
		});

		const now = new Date();

		if (existing) {
			if (existing.expiresAt > now) {
				if (existing.requestHash === requestHash) {
					res.setHeader("X-Idempotent-Replay", "true");
					res.status(existing.statusCode).json(existing.response);
					return;
				}
				throw new AppError(
					StatusCodes.CONFLICT,
					"Idempotency-Key already used with a different request body",
					"IDEMPOTENCY_CONFLICT",
				);
			}

			// Expired key: delete the row and fall through to persist a fresh one.
			await prisma.idempotencyKey.delete({
				where: { key_userId: { key, userId } },
			});
		}

		const originalJson = res.json.bind(res);

		// Await persistence so the row is committed before the response finishes.
		// The app-level `res.json` wrapper (stringify + res.send) is captured as
		// `originalJson`, so this override is the last hop before the bytes go out.
		//
		// `res.json` is typed as `Send` (returns `Response`, not `Promise`), so
		// the async override is cast through `unknown` — the async return is
		// awaited by Express's response machinery when the handler resolves.
		const persist = async (body: unknown): Promise<Response> => {
			const statusCode = res.statusCode;

			// Do NOT persist 5xx errors or non-JSON-serializable responses.
			if (statusCode < 500 && body !== undefined) {
				const endpointPath = `${req.method} ${req.baseUrl}${req.route?.path ?? req.path}`;
				const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

				try {
					await prisma.idempotencyKey.create({
						data: {
							key,
							userId,
							endpoint: endpointPath,
							requestHash,
							response: body as Prisma.InputJsonValue,
							statusCode,
							expiresAt,
						},
					});
				} catch (error: unknown) {
					// Best-effort race handling: a concurrent request may have
					// inserted the same (key, userId) first. Re-fetch and replay
					// only if the stored hash matches; otherwise let the original
					// response stand (both writers already committed their own
					// side effects — full atomicity would require SERIALIZABLE).
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						error.code === "P2002"
					) {
						const replay = await prisma.idempotencyKey.findUnique({
							where: { key_userId: { key, userId } },
						});
						if (replay && replay.requestHash === requestHash) {
							if (!res.headersSent) {
								res.setHeader("X-Idempotent-Replay", "true");
								res.status(replay.statusCode);
								return originalJson(replay.response);
							}
						}
					}
				}
			}

			return originalJson(body);
		};

		(res as unknown as { json: typeof persist }).json = persist;

		next();
	};
};
