import { resend } from "../../lib/resend";
import config from "../config";
import { sendEmailSmtp } from "./sendEmailSmtp";

type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
};

// Resend only delivers to arbitrary recipients once a domain is verified and
// EMAIL_FROM uses it. Until then (the default sender is Resend's sandbox
// address) every email goes through SMTP, the same path the OTP and welcome
// emails already use.
const SANDBOX_SENDER = "onboarding@resend.dev";
const useResend =
	Boolean(config.email.resendApiKey) && config.email.from !== SANDBOX_SENDER;

export const sendEmail = async ({ to, subject, html }: SendEmailInput) => {
	if (!useResend) {
		await sendEmailSmtp({ to, subject, html });
		return;
	}

	if (config.app.env !== "production") {
		console.log(`[Email] Dev-mode email: to=${to}, subject=${subject}`);
		console.log(`[Email] Body preview: ${html.slice(0, 200)}...`);
	}

	try {
		const result = await resend.emails.send({
			from: config.email.from,
			to,
			subject,
			html,
		});

		if (config.app.env !== "production") {
			console.log("[Email] Resend accepted:", result);
		}
	} catch (error) {
		console.error("[Email] Failed to send email:", error);
	}
};