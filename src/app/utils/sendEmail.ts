import { resend } from "../../lib/resend";
import config from "../config";

type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailInput) => {
	try {
		await resend.emails.send({
			from: config.email.from ?? "onboarding@resend.dev",
			to,
			subject,
			html,
		});
	} catch (error) {
		console.error("[Email] Failed to send email:", error);
	}
};