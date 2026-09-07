import Redis from "ioredis";

import config from "../app/config";

export const redis =
	config.app.env !== "production" || !config.redis.url
		? new Redis({ enableReadyCheck: false, maxRetriesPerRequest: 0 })
		: new Redis(config.redis.url, {
				enableReadyCheck: false,
				maxRetriesPerRequest: 3,
			});

if (config.app.env === "production") {
	redis.on("error", (error) => {
		console.error("[Redis] Connection error:", error.message);
	});
}
