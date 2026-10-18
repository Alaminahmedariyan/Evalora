import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),

  BETTER_AUTH_SECRET: z.string().min(16).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  REDIS_URL: z.string().optional(),

  STRIPE_PRODUCT_ID: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  BKASH_BASE_URL: z.string().optional(),
  BKASH_USERNAME: z.string().optional(),
  BKASH_PASSWORD: z.string().optional(),
  BKASH_APP_KEY: z.string().optional(),
  BKASH_APP_SECRET: z.string().optional(),
  BKASH_CALLBACK_URL: z.string().url().optional().or(z.literal("")),

  SSLCOMMERZ_STORE_ID: z.string().optional(),
  SSLCOMMERZ_STORE_PASSWORD: z.string().optional(),
  SSLCOMMERZ_IS_LIVE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),

  SUPER_ADMIN_NAME: z.string().optional(),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8),

  HCAPTCHA_SECRET_KEY: z.string().optional(),
  INTERNAL_API_SECRET: z.string().min(32).optional(),

  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(32).optional(),
  N8N_API_KEY: z.string().min(32).optional(),

  AUTOMATION_LOCAL_DISPATCHER: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  GEMINI_API_KEY: z.string().min(20).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid or missing environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

const config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL,
  },

  database: {
    url: env.DATABASE_URL,
  },

  betterAuth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
  },

  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },

  email: {
    resendApiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM ?? "onboarding@resend.dev",
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD,
  },

  redis: {
    url: env.REDIS_URL,
  },

  stripe: {
    productId: env.STRIPE_PRODUCT_ID,
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },

  bkash: {
    baseUrl: env.BKASH_BASE_URL,
    username: env.BKASH_USERNAME,
    password: env.BKASH_PASSWORD,
    appKey: env.BKASH_APP_KEY,
    appSecret: env.BKASH_APP_SECRET,
    callbackUrl: env.BKASH_CALLBACK_URL,
  },

  sslcommerz: {
    storeId: env.SSLCOMMERZ_STORE_ID,
    storePassword: env.SSLCOMMERZ_STORE_PASSWORD,
    isLive: env.SSLCOMMERZ_IS_LIVE,
  },

  superAdmin: {
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
    name: env.SUPER_ADMIN_NAME ?? "Super Admin",
  },

  hcaptcha: {
    secretKey: env.HCAPTCHA_SECRET_KEY,
  },

  internalApi: {
    secret: env.INTERNAL_API_SECRET,
  },

  n8n: {
    webhookUrl: env.N8N_WEBHOOK_URL,
    webhookSecret: env.N8N_WEBHOOK_SECRET,
    apiKey: env.N8N_API_KEY,
    localDispatcher: env.AUTOMATION_LOCAL_DISPATCHER,
  },
  gemini: {
    apiKey: env.GEMINI_API_KEY,
  },
} as const;

export default config;
