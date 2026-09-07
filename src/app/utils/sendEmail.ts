import { resend } from "../../lib/resend";
import config from "../config";

type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailInput) => {
	if (config.app.env !== "production") {
		console.log(`[Email] Dev-mode email: to=${to}, subject=${subject}`);
		console.log(`[Email] Body preview: ${html.slice(0, 200)}...`);
	}

	try {
		const result = await resend.emails.send({
			from: config.email.from ?? "onboarding@resend.dev",
			to,
			subject,
			html,
		});

		if (config.app.env !== "production") {
			console.log(`[Email] Resend accepted:`, result);
		}
	} catch (error) {
		console.error("[Email] Failed to send email:", error);

		if (config.app.env !== "production") {
			console.log(
				"[Email] Hint: In Resend test mode, only verified domains can receive emails. Verify your domain at https://resend.com/domains",
			);
			console.log(
				"[Email] The OTP is logged above — use it directly for testing.",
			);
		}
	}
};
