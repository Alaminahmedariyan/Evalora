import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { constructStripeWebhookEvent } from "../payment/stripe.service";

const router = Router();

router.post("/stripe", express.raw({ type: "application/json" }), (req, res) => {
	const signature = req.headers["stripe-signature"];

	if (!signature || typeof signature !== "string") {
		return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing Stripe signature." });
	}

	try {
		const event = constructStripeWebhookEvent(req.body as Buffer, signature);

		switch (event.type) {
			case "checkout.session.completed":
				break;
			default:
				break;
		}

		res.status(StatusCodes.OK).json({ received: true });
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: (error as Error).message });
	}
});

export const webhookRoutes = router;