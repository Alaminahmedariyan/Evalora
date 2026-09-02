import { Resend } from "resend";

import config from "../app/config";

export const resend = new Resend(config.email.resendApiKey ?? "");