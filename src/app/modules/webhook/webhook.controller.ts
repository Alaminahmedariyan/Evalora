import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "../payment/payment.service";

/**
 * `req.body` here is a raw Buffer, not parsed JSON — this route is
 * mounted with `express.raw()` (see webhook.routes.ts) and, critically,
 * BEFORE `express.json()` in app.ts. Stripe's signature is computed over
 * the exact raw bytes; parsing the body first would make verification
 * always fail.
 */
const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"] as string | undefined;

	const result = await paymentService.handleStripeWebhook(req.body as Buffer, signature);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Webhook processed.",
		data: result,
	});
});

export const webhookController = {
	handleStripeWebhook,
};