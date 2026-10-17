import config from "../../config";

import { AUTOMATION_DISPATCH } from "./automation.const";
import { automationService } from "./automation.service";

export const startLocalDispatcher = (): NodeJS.Timeout | null => {
	if (config.app.env === "production" || !config.n8n.localDispatcher) {
		return null;
	}

	let running = false;

	const timer = setInterval(async () => {
		if (running) return;
		running = true;

		try {
			await automationService.dispatchPendingEvents();
		} catch (error) {
			console.error("Local automation dispatcher failed:", error);
		} finally {
			running = false;
		}
	}, AUTOMATION_DISPATCH.LOCAL_INTERVAL_MS);

	timer.unref();
	console.log("Local automation dispatcher started.");

	return timer;
};