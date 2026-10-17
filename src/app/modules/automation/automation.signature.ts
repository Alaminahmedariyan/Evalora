import { createHmac, timingSafeEqual } from "node:crypto";

export const signAutomationPayload = (
	body: string,
	secret: string,
	timestamp: string,
): string =>
	createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

export const safeEqual = (a: string, b: string): boolean => {
	const aBuffer = Buffer.from(a);
	const bBuffer = Buffer.from(b);

	return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
};