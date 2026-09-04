import express, { Router } from "express";

import { webhookController } from "./webhook.controller";

const router = Router();

// express.raw() keeps req.body as an unparsed Buffer for this route only —
// required for Stripe's signature check. This router is mounted in app.ts
// before the global express.json() middleware, so no JSON parsing has
// touched the body by the time it gets here.
router.post("/stripe", express.raw({ type: "application/json" }), webhookController.handleStripeWebhook);

export const webhookRoutes = router;