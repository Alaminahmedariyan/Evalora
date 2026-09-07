
		import { createRequire } from "module";
		const require = createRequire(import.meta.url);
		
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_node3 = require("better-auth/node");
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_express17 = __toESM(require("express"), 1);
var import_helmet = __toESM(require("helmet"), 1);

// src/app/config/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  // ============================================================
  // Core App
  // ============================================================
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(5e3),
  CLIENT_URL: import_zod.z.string().url(),
  // ============================================================
  // Database
  // ============================================================
  DATABASE_URL: import_zod.z.string().min(1, "DATABASE_URL is required."),
  // ============================================================
  // Authentication - Better Auth
  // ============================================================
  BETTER_AUTH_SECRET: import_zod.z.string().min(16).optional(),
  BETTER_AUTH_URL: import_zod.z.string().url().optional(),
  // ============================================================
  // Authentication - JWT (Alternative)
  // ============================================================
  // JWT_ACCESS_SECRET: z.string().min(16).optional(),
  // JWT_REFRESH_SECRET: z.string().min(16).optional(),
  // JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
  // JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  // BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
  // ============================================================
  // OAuth
  // ============================================================
  GOOGLE_CLIENT_ID: import_zod.z.string().optional(),
  GOOGLE_CLIENT_SECRET: import_zod.z.string().optional(),
  GITHUB_CLIENT_ID: import_zod.z.string().optional(),
  GITHUB_CLIENT_SECRET: import_zod.z.string().optional(),
  // ============================================================
  // Cloudinary
  // ============================================================
  CLOUDINARY_CLOUD_NAME: import_zod.z.string().optional(),
  CLOUDINARY_API_KEY: import_zod.z.string().optional(),
  CLOUDINARY_API_SECRET: import_zod.z.string().optional(),
  // ============================================================
  // Email - Resend
  // ============================================================
  RESEND_API_KEY: import_zod.z.string().optional(),
  EMAIL_FROM: import_zod.z.string().email().optional(),
  // ============================================================
  // Email - SMTP / Nodemailer (Alternative)
  // ============================================================
  SMTP_USER: import_zod.z.string().optional(),
  SMTP_PASSWORD: import_zod.z.string().optional(),
  // ============================================================
  // Redis
  // ============================================================
  REDIS_URL: import_zod.z.string().optional(),
  // ============================================================
  // Stripe
  // ============================================================
  STRIPE_SECRET_KEY: import_zod.z.string().optional(),
  STRIPE_WEBHOOK_SECRET: import_zod.z.string().optional(),
  // ============================================================
  // bKash
  // ============================================================
  BKASH_BASE_URL: import_zod.z.string().optional(),
  BKASH_USERNAME: import_zod.z.string().optional(),
  BKASH_PASSWORD: import_zod.z.string().optional(),
  BKASH_APP_KEY: import_zod.z.string().optional(),
  BKASH_APP_SECRET: import_zod.z.string().optional(),
  BKASH_CALLBACK_URL: import_zod.z.string().optional(),
  // ============================================================
  // SSLCommerz
  // ============================================================
  SSLCOMMERZ_STORE_ID: import_zod.z.string().optional(),
  SSLCOMMERZ_STORE_PASSWORD: import_zod.z.string().optional(),
  SSLCOMMERZ_IS_LIVE: import_zod.z.coerce.boolean().default(false),
  // ============================================================
  // Super Admin
  // ============================================================
  SUPER_ADMIN_NAME: import_zod.z.string().optional(),
  SUPER_ADMIN_EMAIL: import_zod.z.string().email(),
  SUPER_ADMIN_PASSWORD: import_zod.z.string().min(8),
  // ============================================================
  // hCaptcha
  // ============================================================
  HCAPTCHA_SECRET_KEY: import_zod.z.string().optional()
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("\u274C Invalid or missing environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}
var env = parsed.data;
var config = {
  // ============================================================
  // App
  // ============================================================
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL
  },
  // ============================================================
  // Database
  // ============================================================
  database: {
    url: env.DATABASE_URL
  },
  // ============================================================
  // Better Auth
  // ============================================================
  betterAuth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL
  },
  // ============================================================
  // OAuth
  // ============================================================
  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },
  // ============================================================
  // Cloudinary
  // ============================================================
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET
  },
  // ============================================================
  // Email
  // ============================================================
  email: {
    resendApiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM ?? "onboarding@resend.dev",
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD
  },
  // ============================================================
  // Redis
  // ============================================================
  redis: {
    url: env.REDIS_URL
  },
  // ============================================================
  // Stripe
  // ============================================================
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET
  },
  // ============================================================
  // bKash
  // ============================================================
  bkash: {
    baseUrl: env.BKASH_BASE_URL,
    username: env.BKASH_USERNAME,
    password: env.BKASH_PASSWORD,
    appKey: env.BKASH_APP_KEY,
    appSecret: env.BKASH_APP_SECRET,
    callbackUrl: env.BKASH_CALLBACK_URL
  },
  // ============================================================
  // SSLCommerz
  // ============================================================
  sslcommerz: {
    storeId: env.SSLCOMMERZ_STORE_ID,
    storePassword: env.SSLCOMMERZ_STORE_PASSWORD,
    isLive: env.SSLCOMMERZ_IS_LIVE
  },
  // ============================================================
  // Super Admin
  // ============================================================
  superAdmin: {
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
    name: env.SUPER_ADMIN_NAME ?? "Super Admin"
  },
  // ============================================================
  // hCaptcha
  // ============================================================
  captcha: {
    hcaptchaSecretKey: env.HCAPTCHA_SECRET_KEY
  }
};
var config_default = config;

// src/app/middlewares/forceHttps.ts
var forceHttps = (req, res, next) => {
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
  if (!isSecure) {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  next();
};

// src/app/middlewares/globalErrorHandler.ts
var import_http_status_codes3 = require("http-status-codes");
var import_zod2 = require("zod");

// src/app/errors/appError.ts
var AppError = class extends Error {
  statusCode;
  errorCode;
  details;
  isOperational;
  constructor(statusCode, message, errorCode, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    if (errorCode !== void 0) {
      this.errorCode = errorCode;
    }
    if (details !== void 0) {
      this.details = details;
    }
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var appError_default = AppError;

// src/app/errors/handlePrismaError.ts
var import_http_status_codes = require("http-status-codes");

// src/generated/prisma/client.ts
var path = __toESM(require("path"), 1);
var process2 = require("process");
var import_node_url = require("url");
var runtime3 = require("@prisma/client/runtime/client");

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"), 1);
var config2 = {
  previewFeatures: [],
  clientVersion: "7.10.0",
  engineVersion: "0edf323efd1d98336f3f0a68684b56f689b900d3",
  activeProvider: "postgresql",
  inlineSchema: `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  ADMIN
  RECRUITER
  CANDIDATE
}

enum AuthProvider {
  EMAIL
  GOOGLE
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  PENDING
}

enum AssessmentStatus {
  DRAFT
  PUBLISHED
  ACTIVE
  CLOSED
  ARCHIVED
}

enum ProblemType {
  MCQ
  CODING
  WRITTEN
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum McqType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
  COMPLETED
}

enum AttemptStatus {
  NOT_STARTED
  IN_PROGRESS
  SUBMITTED
  AUTO_SUBMITTED
  EVALUATED
  EXPIRED
}

enum SubmissionStatus {
  DRAFT
  SUBMITTED
  EVALUATING
  EVALUATED
  FAILED
}

enum EvaluationStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}

enum ResultStatus {
  PENDING
  PASSED
  FAILED
}

enum SubscriptionPlan {
  FREE
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PAST_DUE
}

enum PaymentProvider {
  STRIPE
  BKASH
  SSLCOMMERZ
}

enum PaymentStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
  CANCELLED
  REFUNDED
}

enum NotificationType {
  ASSESSMENT_INVITATION
  ASSESSMENT_REMINDER
  ASSESSMENT_RESULT
  ATTEMPT_SUBMITTED
  ATTEMPT_EVALUATED
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  SYSTEM
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  STATUS_CHANGE
  ROLE_CHANGE
  PAYMENT
  SUBMISSION
  EVALUATION
  SECURITY
}

enum ProctoringEventType {
  TAB_SWITCH
  FULLSCREEN_EXIT
  COPY
  PASTE
  DEVTOOLS_DETECTED
  CAMERA_BLOCKED
  MICROPHONE_BLOCKED
  WINDOW_BLUR
  WINDOW_FOCUS
  OTHER
}

enum ConsentType {
  MARKETING
  ANALYTICS
  THIRD_PARTY
  PRIVACY_POLICY
  TERMS_OF_SERVICE
}

// Better Auth is the single source of truth for credentials, sessions, and
// verification tokens (Account / Session / Verification below). Do not add
// password fields back onto User.
model User {
  id    String  @id @default(cuid())
  name  String
  email String  @unique @db.VarChar(320)
  image String?
  phone String?

  role     UserRole     @default(CANDIDATE)
  status   UserStatus   @default(ACTIVE)
  provider AuthProvider @default(EMAIL)

  emailVerified Boolean @default(false)

  // Set/read exclusively by the Better Auth twoFactor plugin \u2014 do not toggle manually.
  twoFactorEnabled Boolean @default(false)

  lastLoginAt DateTime? @db.Timestamptz(3)

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  company Company?

  accounts   Account[]
  sessions   Session[]
  twoFactors TwoFactor[]

  consents UserConsent[]

  candidateProfile CandidateProfile?

  assessmentsCreated Assessment[] @relation("AssessmentCreator")

  invitations AssessmentInvitation[] @relation("CandidateInvitations")
  attempts    AssessmentAttempt[]    @relation("CandidateAttempts")

  problemsCreated Problem[] @relation("ProblemCreator")

  evaluations SubmissionEvaluation[] @relation("SubmissionEvaluator")

  payments      Payment[]
  notifications Notification[]
  auditLogs     AuditLog[]

  @@index([role])
  @@index([status])
  @@index([deletedAt])
  @@map("users")
}

// providerId is a plain string ("credential", "google", ...) \u2014 matches what
// the Better Auth adapter writes, so do not replace it with an enum.
// issuer is required by Better Auth 1.7+ (e.g. "local:credential",
// "local:oauth:google"); uniqueness is on (issuer, accountId).
model Account {
  id         String @id @default(cuid())
  userId     String
  accountId  String
  providerId String
  issuer     String

  password String?

  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([issuer, accountId])
  @@index([userId])
  @@index([providerId])
  @@map("accounts")
}

model TwoFactor {
  id          String  @id @default(cuid())
  userId      String
  secret      String
  backupCodes String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId])
  @@map("two_factors")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime @db.Timestamptz(3)
  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("sessions")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@unique([identifier, value])
  @@index([identifier])
  @@index([expiresAt])
  @@map("verifications")
}

// ownerId is required + Restrict: a company must always have an owner.
// To delete an owner, transfer ownership first, then delete the old user.
// Do not switch this to SetNull.
model Company {
  id String @id @default(cuid())

  name        String
  slug        String  @unique
  description String?

  website  String?
  industry String?
  logo     String?

  isVerified Boolean @default(false)

  ownerId String @unique
  owner   User   @relation(fields: [ownerId], references: [id], onDelete: Restrict)

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  assessments  Assessment[]
  problems     Problem[]
  subscription Subscription?
  payments     Payment[]

  @@index([deletedAt])
  @@map("companies")
}

model CandidateProfile {
  id String @id @default(cuid())

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  headline     String?
  bio          String?
  phone        String?
  location     String?
  resumeUrl    String?
  linkedinUrl  String?
  githubUrl    String?
  portfolioUrl String?

  skills          Json?
  experienceYears Int?

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([deletedAt])
  @@map("candidate_profiles")
}

model Assessment {
  id String @id @default(cuid())

  title String
  slug  String

  description  String?
  instructions String?

  durationMinutes Int

  totalMarks   Int
  passingMarks Int

  maxAttempts Int @default(1)

  status AssessmentStatus @default(DRAFT)

  startAt     DateTime? @db.Timestamptz(3)
  endAt       DateTime? @db.Timestamptz(3)
  publishedAt DateTime? @db.Timestamptz(3)

  shuffleQuestions      Boolean @default(false)
  showResultImmediately Boolean @default(false)
  allowReview           Boolean @default(true)

  version         Int     @default(1)
  isLatestVersion Boolean @default(true)

  parentAssessmentId String?
  parentAssessment   Assessment?  @relation("AssessmentVersions", fields: [parentAssessmentId], references: [id], onDelete: SetNull)
  childVersions      Assessment[] @relation("AssessmentVersions")

  companyId String
  company   Company @relation(fields: [companyId], references: [id], onDelete: Restrict)

  createdById String
  createdBy   User   @relation("AssessmentCreator", fields: [createdById], references: [id], onDelete: Restrict)

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  assessmentProblems AssessmentProblem[]
  invitations        AssessmentInvitation[]
  attempts           AssessmentAttempt[]
  results            Result[]

  @@unique([companyId, slug, version])
  @@index([companyId, createdAt])
  @@index([companyId, status])
  @@index([companyId, isLatestVersion])
  @@index([createdById])
  @@index([status, startAt, endAt])
  @@index([deletedAt])
  @@map("assessments")
}

// Multi-tenant: companyId scopes every private problem. Application layer
// must verify problem.companyId === assessment.companyId before creating an
// AssessmentProblem row; this is not enforced by the schema.
model Problem {
  id String @id @default(cuid())

  title       String
  slug        String
  description String

  type       ProblemType
  difficulty Difficulty  @default(MEDIUM)

  defaultMarks     Int  @default(10)
  timeLimitSeconds Int?

  companyId String
  company   Company @relation(fields: [companyId], references: [id], onDelete: Restrict)

  createdById String
  createdBy   User   @relation("ProblemCreator", fields: [createdById], references: [id], onDelete: Restrict)

  isPublic Boolean @default(false)

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  mcqProblem McqProblem?
  testCases  TestCase[]

  assessmentProblems AssessmentProblem[]
  submissions        Submission[]

  @@unique([companyId, slug])
  @@index([companyId])
  @@index([companyId, type])
  @@index([companyId, difficulty])
  @@index([companyId, isPublic])
  @@index([createdById])
  @@index([type])
  @@index([difficulty])
  @@index([isPublic])
  @@index([deletedAt])
  @@map("problems")
}

model McqProblem {
  id String @id @default(cuid())

  problemId String  @unique
  problem   Problem @relation(fields: [problemId], references: [id], onDelete: Cascade)

  type        McqType
  explanation String?

  options McqOption[]

  @@map("mcq_problems")
}

model McqOption {
  id String @id @default(cuid())

  mcqProblemId String
  mcqProblem   McqProblem @relation(fields: [mcqProblemId], references: [id], onDelete: Cascade)

  optionText String
  order      Int
  isCorrect  Boolean @default(false)

  submissionAnswers SubmissionAnswer[]

  @@unique([mcqProblemId, order])
  @@index([mcqProblemId])
  @@index([mcqProblemId, isCorrect])
  @@map("mcq_options")
}

model TestCase {
  id String @id @default(cuid())

  problemId String
  problem   Problem @relation(fields: [problemId], references: [id], onDelete: Cascade)

  input          String?
  expectedOutput String

  isSample Boolean @default(false)
  points   Int     @default(0)

  timeLimitMs   Int?
  memoryLimitMb Int?

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  results TestCaseResult[]

  @@index([problemId])
  @@index([problemId, isSample])
  @@map("test_cases")
}

model AssessmentProblem {
  id String @id @default(cuid())

  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  problemId String
  problem   Problem @relation(fields: [problemId], references: [id], onDelete: Restrict)

  order Int
  marks Int

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@unique([assessmentId, problemId])
  @@unique([assessmentId, order])
  @@index([problemId])
  @@map("assessment_problems")
}

// onDelete on assessment is Restrict (not Cascade), consistent with
// AssessmentAttempt.assessment \u2014 assessments with real attempt/invitation
// history cannot be hard-deleted. Archive instead of deleting.
model AssessmentInvitation {
  id String @id @default(cuid())

  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Restrict)

  // Nullable because an invitation can be created by email before the
  // candidate has an account.
  candidateId String?
  candidate   User?   @relation("CandidateInvitations", fields: [candidateId], references: [id], onDelete: SetNull)

  email String @db.VarChar(320)

  status InvitationStatus @default(PENDING)

  tokenHash String @unique @db.VarChar(64)

  invitedAt   DateTime  @default(now()) @db.Timestamptz(3)
  acceptedAt  DateTime? @db.Timestamptz(3)
  expiresAt   DateTime? @db.Timestamptz(3)
  completedAt DateTime? @db.Timestamptz(3)

  attempts AssessmentAttempt[]

  @@unique([assessmentId, email])
  @@index([email])
  @@index([candidateId])
  @@index([assessmentId, status])
  @@index([status, expiresAt])
  @@map("assessment_invitations")
}

// invitationId is optional and NOT unique: when maxAttempts > 1 the same
// invitation legitimately backs multiple attempts. Uniqueness of an
// individual attempt is enforced via [assessmentId, candidateId, attemptNumber].
model AssessmentAttempt {
  id String @id @default(cuid())

  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Restrict)

  candidateId String
  candidate   User   @relation("CandidateAttempts", fields: [candidateId], references: [id], onDelete: Cascade)

  invitationId String?
  invitation   AssessmentInvitation? @relation(fields: [invitationId], references: [id], onDelete: SetNull)

  attemptNumber Int @default(1)

  status AttemptStatus @default(NOT_STARTED)

  startedAt       DateTime? @db.Timestamptz(3)
  submittedAt     DateTime? @db.Timestamptz(3)
  expiresAt       DateTime  @db.Timestamptz(3)
  autoSubmittedAt DateTime? @db.Timestamptz(3)

  // Must be incremented in the same transaction as the matching ProctoringEvent insert.
  tabSwitchCount Int @default(0)

  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  submissions      Submission[]
  result           Result?
  proctoringEvents ProctoringEvent[]

  @@unique([assessmentId, candidateId, attemptNumber])
  @@index([assessmentId, candidateId])
  @@index([candidateId, createdAt])
  @@index([status, expiresAt])
  @@index([candidateId, status, expiresAt])
  @@index([assessmentId, status, expiresAt])
  @@index([invitationId])
  @@map("assessment_attempts")
}

// One submission per problem per attempt.
model Submission {
  id String @id @default(cuid())

  attemptId String
  attempt   AssessmentAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  problemId String
  problem   Problem @relation(fields: [problemId], references: [id], onDelete: Restrict)

  answerText String?

  code     String?
  language String?

  status SubmissionStatus @default(DRAFT)

  submittedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  answers SubmissionAnswer[]

  evaluation SubmissionEvaluation?

  testCaseResults TestCaseResult[]

  @@unique([attemptId, problemId])
  @@index([attemptId, status, createdAt])
  @@index([problemId])
  @@index([submittedAt])
  @@map("submissions")
}

model SubmissionAnswer {
  id String @id @default(cuid())

  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  optionId String
  option   McqOption @relation(fields: [optionId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@unique([submissionId, optionId])
  @@index([submissionId])
  @@index([optionId])
  @@map("submission_answers")
}

// Single source of truth for a submission's score.
model SubmissionEvaluation {
  id String @id @default(cuid())

  submissionId String     @unique
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  evaluatorId String?
  evaluator   User?   @relation("SubmissionEvaluator", fields: [evaluatorId], references: [id], onDelete: SetNull)

  score    Int @default(0)
  maxScore Int

  feedback String?

  status          EvaluationStatus @default(PENDING)
  isAutoEvaluated Boolean          @default(false)

  evaluatedAt DateTime? @db.Timestamptz(3)

  metadata Json?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([evaluatorId])
  @@index([status, evaluatedAt])
  @@index([isAutoEvaluated])
  @@map("submission_evaluations")
}

model TestCaseResult {
  id String @id @default(cuid())

  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  testCaseId String
  testCase   TestCase @relation(fields: [testCaseId], references: [id], onDelete: Restrict)

  passed Boolean @default(false)

  actualOutput   String?
  expectedOutput String?

  executionTimeMs Int?
  memoryUsedMb    Int?

  points Int @default(0)

  errorMessage String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@unique([submissionId, testCaseId])
  @@index([submissionId])
  @@index([testCaseId])
  @@index([submissionId, passed])
  @@map("test_case_results")
}

// Attempt-level source of truth.
model Result {
  id String @id @default(cuid())

  attemptId String            @unique
  attempt   AssessmentAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Restrict)

  totalScore Int   @default(0)
  totalMarks Int
  percentage Float @default(0)

  status ResultStatus @default(PENDING)

  rank Int?

  evaluatedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([assessmentId, totalScore])
  @@index([assessmentId, rank])
  @@index([assessmentId, status])
  @@index([status])
  @@index([percentage])
  @@map("results")
}

model ProctoringEvent {
  id String @id @default(cuid())

  attemptId String
  attempt   AssessmentAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  eventType ProctoringEventType

  timestamp DateTime @default(now()) @db.Timestamptz(3)

  metadata Json?

  @@index([attemptId, timestamp])
  @@index([attemptId, eventType, timestamp])
  @@index([eventType])
  @@map("proctoring_events")
}

model Subscription {
  id String @id @default(cuid())

  companyId String  @unique
  company   Company @relation(fields: [companyId], references: [id], onDelete: Restrict)

  plan   SubscriptionPlan   @default(FREE)
  status SubscriptionStatus @default(ACTIVE)

  stripeCustomerId     String? @unique
  stripeSubscriptionId String? @unique

  currentPeriodStart DateTime? @db.Timestamptz(3)
  currentPeriodEnd   DateTime? @db.Timestamptz(3)

  cancelAtPeriodEnd Boolean   @default(false)
  cancelledAt       DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  payments Payment[]

  @@index([plan])
  @@index([status])
  @@index([currentPeriodEnd])
  @@map("subscriptions")
}

model Payment {
  id String @id @default(cuid())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Restrict)

  companyId String?
  company   Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)

  subscriptionId String?
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)

  provider PaymentProvider
  status   PaymentStatus   @default(PENDING)

  amountMinor BigInt
  currency    String @default("USD") @db.VarChar(3)

  transactionId     String? @unique
  providerPaymentId String? @unique
  idempotencyKey    String? @unique

  metadata Json?

  paidAt   DateTime? @db.Timestamptz(3)
  failedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([userId, createdAt])
  @@index([companyId, createdAt])
  @@index([subscriptionId])
  @@index([status, createdAt])
  @@index([provider])
  @@map("payments")
}

model PaymentWebhookEvent {
  id String @id @default(cuid())

  provider PaymentProvider

  eventId   String
  eventType String

  payload Json

  processed   Boolean   @default(false)
  processedAt DateTime? @db.Timestamptz(3)

  retryCount Int @default(0)
  maxRetries Int @default(3)

  lastRetryAt DateTime? @db.Timestamptz(3)
  nextRetryAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@unique([provider, eventId])
  @@index([provider])
  @@index([processed])
  @@index([processed, nextRetryAt])
  @@index([createdAt])
  @@map("payment_webhook_events")
}

model Notification {
  id String @id @default(cuid())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  title   String
  message String

  type NotificationType

  isRead Boolean @default(false)

  metadata Json?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([userId, type, createdAt])
  @@index([userId, isRead, createdAt])
  @@map("notifications")
}

model AuditLog {
  id String @id @default(cuid())

  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)

  action AuditAction

  entity   String
  entityId String?

  oldValue Json?
  newValue Json?
  metadata Json?

  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@index([userId])
  @@index([action])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

model UserConsent {
  id String @id @default(cuid())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  consentType ConsentType
  granted     Boolean     @default(true)

  grantedAt DateTime  @default(now()) @db.Timestamptz(3)
  revokedAt DateTime? @db.Timestamptz(3)

  @@unique([userId, consentType])
  @@index([userId])
  @@map("user_consents")
}
`,
  runtimeDataModel: {
    models: {},
    enums: {},
    types: {}
  },
  parameterizationSchema: {
    strings: [],
    graph: ""
  }
};
config2.runtimeDataModel = JSON.parse(
  '{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"provider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"twoFactors","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"consents","kind":"object","type":"UserConsent","relationName":"UserToUserConsent"},{"name":"candidateProfile","kind":"object","type":"CandidateProfile","relationName":"CandidateProfileToUser"},{"name":"assessmentsCreated","kind":"object","type":"Assessment","relationName":"AssessmentCreator"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"CandidateInvitations"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"CandidateAttempts"},{"name":"problemsCreated","kind":"object","type":"Problem","relationName":"ProblemCreator"},{"name":"evaluations","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionEvaluator"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"}],"dbName":"users","schema":null},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"issuer","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"accounts","schema":null},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"two_factors","schema":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"sessions","schema":null},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verifications","schema":null},"Company":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"industry","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"CompanyToUser"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessments","kind":"object","type":"Assessment","relationName":"AssessmentToCompany"},{"name":"problems","kind":"object","type":"Problem","relationName":"CompanyToProblem"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"CompanyToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"CompanyToPayment"}],"dbName":"companies","schema":null},"CandidateProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CandidateProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"Json"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"candidate_profiles","schema":null},"Assessment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"passingMarks","kind":"scalar","type":"Int"},{"name":"maxAttempts","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AssessmentStatus"},{"name":"startAt","kind":"scalar","type":"DateTime"},{"name":"endAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"shuffleQuestions","kind":"scalar","type":"Boolean"},{"name":"showResultImmediately","kind":"scalar","type":"Boolean"},{"name":"allowReview","kind":"scalar","type":"Boolean"},{"name":"version","kind":"scalar","type":"Int"},{"name":"isLatestVersion","kind":"scalar","type":"Boolean"},{"name":"parentAssessmentId","kind":"scalar","type":"String"},{"name":"parentAssessment","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"childVersions","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"AssessmentToCompany"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"AssessmentCreator"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentToAssessmentProblem"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentToAssessmentInvitation"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentToAssessmentAttempt"},{"name":"results","kind":"object","type":"Result","relationName":"AssessmentToResult"}],"dbName":"assessments","schema":null},"Problem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ProblemType"},{"name":"difficulty","kind":"enum","type":"Difficulty"},{"name":"defaultMarks","kind":"scalar","type":"Int"},{"name":"timeLimitSeconds","kind":"scalar","type":"Int"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToProblem"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"ProblemCreator"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqProblemToProblem"},{"name":"testCases","kind":"object","type":"TestCase","relationName":"ProblemToTestCase"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentProblemToProblem"},{"name":"submissions","kind":"object","type":"Submission","relationName":"ProblemToSubmission"}],"dbName":"problems","schema":null},"McqProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"McqProblemToProblem"},{"name":"type","kind":"enum","type":"McqType"},{"name":"explanation","kind":"scalar","type":"String"},{"name":"options","kind":"object","type":"McqOption","relationName":"McqOptionToMcqProblem"}],"dbName":"mcq_problems","schema":null},"McqOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mcqProblemId","kind":"scalar","type":"String"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqOptionToMcqProblem"},{"name":"optionText","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"submissionAnswers","kind":"object","type":"SubmissionAnswer","relationName":"McqOptionToSubmissionAnswer"}],"dbName":"mcq_options","schema":null},"TestCase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToTestCase"},{"name":"input","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"isSample","kind":"scalar","type":"Boolean"},{"name":"points","kind":"scalar","type":"Int"},{"name":"timeLimitMs","kind":"scalar","type":"Int"},{"name":"memoryLimitMb","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"results","kind":"object","type":"TestCaseResult","relationName":"TestCaseToTestCaseResult"}],"dbName":"test_cases","schema":null},"AssessmentProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentProblem"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"AssessmentProblemToProblem"},{"name":"order","kind":"scalar","type":"Int"},{"name":"marks","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"assessment_problems","schema":null},"AssessmentInvitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentInvitation"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateInvitations"},{"name":"email","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"tokenHash","kind":"scalar","type":"String"},{"name":"invitedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToAssessmentInvitation"}],"dbName":"assessment_invitations","schema":null},"AssessmentAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentAttempt"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateAttempts"},{"name":"invitationId","kind":"scalar","type":"String"},{"name":"invitation","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentAttemptToAssessmentInvitation"},{"name":"attemptNumber","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AttemptStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"autoSubmittedAt","kind":"scalar","type":"DateTime"},{"name":"tabSwitchCount","kind":"scalar","type":"Int"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"submissions","kind":"object","type":"Submission","relationName":"AssessmentAttemptToSubmission"},{"name":"result","kind":"object","type":"Result","relationName":"AssessmentAttemptToResult"},{"name":"proctoringEvents","kind":"object","type":"ProctoringEvent","relationName":"AssessmentAttemptToProctoringEvent"}],"dbName":"assessment_attempts","schema":null},"Submission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToSubmission"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToSubmission"},{"name":"answerText","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SubmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"answers","kind":"object","type":"SubmissionAnswer","relationName":"SubmissionToSubmissionAnswer"},{"name":"evaluation","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionToSubmissionEvaluation"},{"name":"testCaseResults","kind":"object","type":"TestCaseResult","relationName":"SubmissionToTestCaseResult"}],"dbName":"submissions","schema":null},"SubmissionAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionAnswer"},{"name":"optionId","kind":"scalar","type":"String"},{"name":"option","kind":"object","type":"McqOption","relationName":"McqOptionToSubmissionAnswer"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_answers","schema":null},"SubmissionEvaluation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionEvaluation"},{"name":"evaluatorId","kind":"scalar","type":"String"},{"name":"evaluator","kind":"object","type":"User","relationName":"SubmissionEvaluator"},{"name":"score","kind":"scalar","type":"Int"},{"name":"maxScore","kind":"scalar","type":"Int"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"EvaluationStatus"},{"name":"isAutoEvaluated","kind":"scalar","type":"Boolean"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_evaluations","schema":null},"TestCaseResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToTestCaseResult"},{"name":"testCaseId","kind":"scalar","type":"String"},{"name":"testCase","kind":"object","type":"TestCase","relationName":"TestCaseToTestCaseResult"},{"name":"passed","kind":"scalar","type":"Boolean"},{"name":"actualOutput","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"executionTimeMs","kind":"scalar","type":"Int"},{"name":"memoryUsedMb","kind":"scalar","type":"Int"},{"name":"points","kind":"scalar","type":"Int"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"test_case_results","schema":null},"Result":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToResult"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToResult"},{"name":"totalScore","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"ResultStatus"},{"name":"rank","kind":"scalar","type":"Int"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"results","schema":null},"ProctoringEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToProctoringEvent"},{"name":"eventType","kind":"enum","type":"ProctoringEventType"},{"name":"timestamp","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"}],"dbName":"proctoring_events","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToSubscription"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToPayment"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amountMinor","kind":"scalar","type":"BigInt"},{"name":"currency","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"providerPaymentId","kind":"scalar","type":"String"},{"name":"idempotencyKey","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments","schema":null},"PaymentWebhookEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"processed","kind":"scalar","type":"Boolean"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"retryCount","kind":"scalar","type":"Int"},{"name":"maxRetries","kind":"scalar","type":"Int"},{"name":"lastRetryAt","kind":"scalar","type":"DateTime"},{"name":"nextRetryAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment_webhook_events","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications","schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"enum","type":"AuditAction"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs","schema":null},"UserConsent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserConsent"},{"name":"consentType","kind":"enum","type":"ConsentType"},{"name":"granted","kind":"scalar","type":"Boolean"},{"name":"grantedAt","kind":"scalar","type":"DateTime"},{"name":"revokedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_consents","schema":null}},"enums":{},"types":{}}'
);
config2.parameterizationSchema = {
  strings: JSON.parse(
    '["where","owner","orderBy","cursor","parentAssessment","childVersions","company","createdBy","assessment","problem","mcqProblem","candidate","attempts","_count","invitation","submissions","attempt","result","proctoringEvents","answers","submission","evaluator","evaluation","results","testCase","testCaseResults","option","submissionAnswers","options","testCases","assessmentProblems","invitations","assessments","problems","user","subscription","payments","accounts","sessions","twoFactors","consents","candidateProfile","assessmentsCreated","problemsCreated","evaluations","notifications","auditLogs","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Company.findUnique","Company.findUniqueOrThrow","Company.findFirst","Company.findFirstOrThrow","Company.findMany","Company.createOne","Company.createMany","Company.createManyAndReturn","Company.updateOne","Company.updateMany","Company.updateManyAndReturn","Company.upsertOne","Company.deleteOne","Company.deleteMany","Company.groupBy","Company.aggregate","CandidateProfile.findUnique","CandidateProfile.findUniqueOrThrow","CandidateProfile.findFirst","CandidateProfile.findFirstOrThrow","CandidateProfile.findMany","CandidateProfile.createOne","CandidateProfile.createMany","CandidateProfile.createManyAndReturn","CandidateProfile.updateOne","CandidateProfile.updateMany","CandidateProfile.updateManyAndReturn","CandidateProfile.upsertOne","CandidateProfile.deleteOne","CandidateProfile.deleteMany","_avg","_sum","CandidateProfile.groupBy","CandidateProfile.aggregate","Assessment.findUnique","Assessment.findUniqueOrThrow","Assessment.findFirst","Assessment.findFirstOrThrow","Assessment.findMany","Assessment.createOne","Assessment.createMany","Assessment.createManyAndReturn","Assessment.updateOne","Assessment.updateMany","Assessment.updateManyAndReturn","Assessment.upsertOne","Assessment.deleteOne","Assessment.deleteMany","Assessment.groupBy","Assessment.aggregate","Problem.findUnique","Problem.findUniqueOrThrow","Problem.findFirst","Problem.findFirstOrThrow","Problem.findMany","Problem.createOne","Problem.createMany","Problem.createManyAndReturn","Problem.updateOne","Problem.updateMany","Problem.updateManyAndReturn","Problem.upsertOne","Problem.deleteOne","Problem.deleteMany","Problem.groupBy","Problem.aggregate","McqProblem.findUnique","McqProblem.findUniqueOrThrow","McqProblem.findFirst","McqProblem.findFirstOrThrow","McqProblem.findMany","McqProblem.createOne","McqProblem.createMany","McqProblem.createManyAndReturn","McqProblem.updateOne","McqProblem.updateMany","McqProblem.updateManyAndReturn","McqProblem.upsertOne","McqProblem.deleteOne","McqProblem.deleteMany","McqProblem.groupBy","McqProblem.aggregate","McqOption.findUnique","McqOption.findUniqueOrThrow","McqOption.findFirst","McqOption.findFirstOrThrow","McqOption.findMany","McqOption.createOne","McqOption.createMany","McqOption.createManyAndReturn","McqOption.updateOne","McqOption.updateMany","McqOption.updateManyAndReturn","McqOption.upsertOne","McqOption.deleteOne","McqOption.deleteMany","McqOption.groupBy","McqOption.aggregate","TestCase.findUnique","TestCase.findUniqueOrThrow","TestCase.findFirst","TestCase.findFirstOrThrow","TestCase.findMany","TestCase.createOne","TestCase.createMany","TestCase.createManyAndReturn","TestCase.updateOne","TestCase.updateMany","TestCase.updateManyAndReturn","TestCase.upsertOne","TestCase.deleteOne","TestCase.deleteMany","TestCase.groupBy","TestCase.aggregate","AssessmentProblem.findUnique","AssessmentProblem.findUniqueOrThrow","AssessmentProblem.findFirst","AssessmentProblem.findFirstOrThrow","AssessmentProblem.findMany","AssessmentProblem.createOne","AssessmentProblem.createMany","AssessmentProblem.createManyAndReturn","AssessmentProblem.updateOne","AssessmentProblem.updateMany","AssessmentProblem.updateManyAndReturn","AssessmentProblem.upsertOne","AssessmentProblem.deleteOne","AssessmentProblem.deleteMany","AssessmentProblem.groupBy","AssessmentProblem.aggregate","AssessmentInvitation.findUnique","AssessmentInvitation.findUniqueOrThrow","AssessmentInvitation.findFirst","AssessmentInvitation.findFirstOrThrow","AssessmentInvitation.findMany","AssessmentInvitation.createOne","AssessmentInvitation.createMany","AssessmentInvitation.createManyAndReturn","AssessmentInvitation.updateOne","AssessmentInvitation.updateMany","AssessmentInvitation.updateManyAndReturn","AssessmentInvitation.upsertOne","AssessmentInvitation.deleteOne","AssessmentInvitation.deleteMany","AssessmentInvitation.groupBy","AssessmentInvitation.aggregate","AssessmentAttempt.findUnique","AssessmentAttempt.findUniqueOrThrow","AssessmentAttempt.findFirst","AssessmentAttempt.findFirstOrThrow","AssessmentAttempt.findMany","AssessmentAttempt.createOne","AssessmentAttempt.createMany","AssessmentAttempt.createManyAndReturn","AssessmentAttempt.updateOne","AssessmentAttempt.updateMany","AssessmentAttempt.updateManyAndReturn","AssessmentAttempt.upsertOne","AssessmentAttempt.deleteOne","AssessmentAttempt.deleteMany","AssessmentAttempt.groupBy","AssessmentAttempt.aggregate","Submission.findUnique","Submission.findUniqueOrThrow","Submission.findFirst","Submission.findFirstOrThrow","Submission.findMany","Submission.createOne","Submission.createMany","Submission.createManyAndReturn","Submission.updateOne","Submission.updateMany","Submission.updateManyAndReturn","Submission.upsertOne","Submission.deleteOne","Submission.deleteMany","Submission.groupBy","Submission.aggregate","SubmissionAnswer.findUnique","SubmissionAnswer.findUniqueOrThrow","SubmissionAnswer.findFirst","SubmissionAnswer.findFirstOrThrow","SubmissionAnswer.findMany","SubmissionAnswer.createOne","SubmissionAnswer.createMany","SubmissionAnswer.createManyAndReturn","SubmissionAnswer.updateOne","SubmissionAnswer.updateMany","SubmissionAnswer.updateManyAndReturn","SubmissionAnswer.upsertOne","SubmissionAnswer.deleteOne","SubmissionAnswer.deleteMany","SubmissionAnswer.groupBy","SubmissionAnswer.aggregate","SubmissionEvaluation.findUnique","SubmissionEvaluation.findUniqueOrThrow","SubmissionEvaluation.findFirst","SubmissionEvaluation.findFirstOrThrow","SubmissionEvaluation.findMany","SubmissionEvaluation.createOne","SubmissionEvaluation.createMany","SubmissionEvaluation.createManyAndReturn","SubmissionEvaluation.updateOne","SubmissionEvaluation.updateMany","SubmissionEvaluation.updateManyAndReturn","SubmissionEvaluation.upsertOne","SubmissionEvaluation.deleteOne","SubmissionEvaluation.deleteMany","SubmissionEvaluation.groupBy","SubmissionEvaluation.aggregate","TestCaseResult.findUnique","TestCaseResult.findUniqueOrThrow","TestCaseResult.findFirst","TestCaseResult.findFirstOrThrow","TestCaseResult.findMany","TestCaseResult.createOne","TestCaseResult.createMany","TestCaseResult.createManyAndReturn","TestCaseResult.updateOne","TestCaseResult.updateMany","TestCaseResult.updateManyAndReturn","TestCaseResult.upsertOne","TestCaseResult.deleteOne","TestCaseResult.deleteMany","TestCaseResult.groupBy","TestCaseResult.aggregate","Result.findUnique","Result.findUniqueOrThrow","Result.findFirst","Result.findFirstOrThrow","Result.findMany","Result.createOne","Result.createMany","Result.createManyAndReturn","Result.updateOne","Result.updateMany","Result.updateManyAndReturn","Result.upsertOne","Result.deleteOne","Result.deleteMany","Result.groupBy","Result.aggregate","ProctoringEvent.findUnique","ProctoringEvent.findUniqueOrThrow","ProctoringEvent.findFirst","ProctoringEvent.findFirstOrThrow","ProctoringEvent.findMany","ProctoringEvent.createOne","ProctoringEvent.createMany","ProctoringEvent.createManyAndReturn","ProctoringEvent.updateOne","ProctoringEvent.updateMany","ProctoringEvent.updateManyAndReturn","ProctoringEvent.upsertOne","ProctoringEvent.deleteOne","ProctoringEvent.deleteMany","ProctoringEvent.groupBy","ProctoringEvent.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentWebhookEvent.findUnique","PaymentWebhookEvent.findUniqueOrThrow","PaymentWebhookEvent.findFirst","PaymentWebhookEvent.findFirstOrThrow","PaymentWebhookEvent.findMany","PaymentWebhookEvent.createOne","PaymentWebhookEvent.createMany","PaymentWebhookEvent.createManyAndReturn","PaymentWebhookEvent.updateOne","PaymentWebhookEvent.updateMany","PaymentWebhookEvent.updateManyAndReturn","PaymentWebhookEvent.upsertOne","PaymentWebhookEvent.deleteOne","PaymentWebhookEvent.deleteMany","PaymentWebhookEvent.groupBy","PaymentWebhookEvent.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","UserConsent.findUnique","UserConsent.findUniqueOrThrow","UserConsent.findFirst","UserConsent.findFirstOrThrow","UserConsent.findMany","UserConsent.createOne","UserConsent.createMany","UserConsent.createManyAndReturn","UserConsent.updateOne","UserConsent.updateMany","UserConsent.updateManyAndReturn","UserConsent.upsertOne","UserConsent.deleteOne","UserConsent.deleteMany","UserConsent.groupBy","UserConsent.aggregate","AND","OR","NOT","id","userId","ConsentType","consentType","granted","grantedAt","revokedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","AuditAction","action","entity","entityId","oldValue","newValue","metadata","ipAddress","userAgent","createdAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","message","NotificationType","type","isRead","updatedAt","PaymentProvider","provider","eventId","eventType","payload","processed","processedAt","retryCount","maxRetries","lastRetryAt","nextRetryAt","provider_eventId","companyId","subscriptionId","PaymentStatus","status","amountMinor","currency","transactionId","providerPaymentId","idempotencyKey","paidAt","failedAt","SubscriptionPlan","plan","SubscriptionStatus","stripeCustomerId","stripeSubscriptionId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","cancelledAt","every","some","none","attemptId","ProctoringEventType","timestamp","assessmentId","totalScore","totalMarks","percentage","ResultStatus","rank","evaluatedAt","submissionId","testCaseId","passed","actualOutput","expectedOutput","executionTimeMs","memoryUsedMb","points","errorMessage","evaluatorId","score","maxScore","feedback","EvaluationStatus","isAutoEvaluated","optionId","problemId","answerText","code","language","SubmissionStatus","submittedAt","candidateId","invitationId","attemptNumber","AttemptStatus","startedAt","expiresAt","autoSubmittedAt","tabSwitchCount","email","InvitationStatus","tokenHash","invitedAt","acceptedAt","completedAt","order","marks","input","isSample","timeLimitMs","memoryLimitMb","mcqProblemId","optionText","isCorrect","McqType","explanation","slug","description","ProblemType","Difficulty","difficulty","defaultMarks","timeLimitSeconds","createdById","isPublic","deletedAt","instructions","durationMinutes","passingMarks","maxAttempts","AssessmentStatus","startAt","endAt","publishedAt","shuffleQuestions","showResultImmediately","allowReview","version","isLatestVersion","parentAssessmentId","headline","bio","phone","location","resumeUrl","linkedinUrl","githubUrl","portfolioUrl","skills","experienceYears","name","website","industry","logo","isVerified","ownerId","identifier","value","identifier_value","token","secret","backupCodes","accountId","providerId","issuer","password","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","image","UserRole","role","UserStatus","AuthProvider","emailVerified","twoFactorEnabled","lastLoginAt","userId_consentType","issuer_accountId","companyId_slug","assessmentId_email","submissionId_testCaseId","attemptId_problemId","assessmentId_candidateId_attemptNumber","submissionId_optionId","mcqProblemId_order","assessmentId_problemId","assessmentId_order","companyId_slug_version","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'
  ),
  graph: "_A78AbADHwYAAKUHACAMAAC2BwAgHwAA0gcAICQAAMIGACAlAADNBwAgJgAAzgcAICcAAM8HACAoAADQBwAgKQAA0QcAICoAAIAHACArAACBBwAgLAAA0wcAIC0AANQHACAuAADVBwAg5wMAAMkHADDoAwAAGwAQ6QMAAMkHADDqAwEAAAABhQRAAK4GACGRBEAArgYAIZMEAADMB6sFIqEEAADLB6oFIt0EAQAAAAH3BEAArAYAIYgFAQDrBgAhkAUBAKgGACGmBQEA6wYAIagFAADKB6gFIqsFIACrBgAhrAUgAKsGACGtBUAArAYAIQEAAAABACAUAQAA_QYAICAAAIAHACAhAACBBwAgIwAAggcAICQAAMIGACDnAwAA_wYAMOgDAAADABDpAwAA_wYAMOoDAQCoBgAhhQRAAK4GACGRBEAArgYAIe4EAQCoBgAh7wQBAOsGACH3BEAArAYAIZAFAQCoBgAhkQUBAOsGACGSBQEA6wYAIZMFAQDrBgAhlAUgAKsGACGVBQEAqAYAIQEAAAADACAjBAAA4gcAIAUAAIAHACAGAADBBgAgBwAA_QYAIAwAALYHACAXAADjBwAgHgAArAcAIB8AANIHACDnAwAA4AcAMOgDAAAFABDpAwAA4AcAMOoDAQCoBgAhhQRAAK4GACGMBAEAqAYAIZEEQACuBgAhngQBAKgGACGhBAAA4Qf9BCK6BAIArQYAIe4EAQCoBgAh7wQBAOsGACH1BAEAqAYAIfcEQACsBgAh-AQBAOsGACH5BAIArQYAIfoEAgCtBgAh-wQCAK0GACH9BEAArAYAIf4EQACsBgAh_wRAAKwGACGABSAAqwYAIYEFIACrBgAhggUgAKsGACGDBQIArQYAIYQFIACrBgAhhQUBAOsGACEPBAAAlQ0AIAUAAMMLACAGAAClCAAgBwAAkgsAIAwAAIsNACAXAACeDQAgHgAAkg0AIB8AAIoNACDvBAAA5AcAIPcEAADkBwAg-AQAAOQHACD9BAAA5AcAIP4EAADkBwAg_wQAAOQHACCFBQAA5AcAICQEAADiBwAgBQAAgAcAIAYAAMEGACAHAAD9BgAgDAAAtgcAIBcAAOMHACAeAACsBwAgHwAA0gcAIOcDAADgBwAw6AMAAAUAEOkDAADgBwAw6gMBAAAAAYUEQACuBgAhjAQBAKgGACGRBEAArgYAIZ4EAQCoBgAhoQQAAOEH_QQiugQCAK0GACHuBAEAqAYAIe8EAQDrBgAh9QQBAKgGACH3BEAArAYAIfgEAQDrBgAh-QQCAK0GACH6BAIArQYAIfsEAgCtBgAh_QRAAKwGACH-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_BwAw6AMAACIAEOkDAAC_BwAw6gMBAAAAAYUEQACuBgAhkQRAAK4GACGhBAAAwAfUBCK1BAEAqAYAIc8EAQCoBgAh0AQBAOsGACHRBAEA6wYAIdIEAQDrBgAh1ARAAKwGACGzBQAAvgcAIAMAAAAiACACAAAjADADAAAkACAQCAAAsgcAIBAAALEHACDnAwAArgcAMOgDAAAmABDpAwAArgcAMOoDAQCoBgAhhQRAAK4GACGRBEAArgYAIaEEAACwB70EIrUEAQCoBgAhuAQBAKgGACG5BAIArQYAIboEAgCtBgAhuwQIAK8HACG9BAIA_AYAIb4EQACsBgAhAQAAACYAIAkQAACxBwAg5wMAALwHADDoAwAAKAAQ6QMAALwHADDqAwEAqAYAIYIEAAD7BgAglQQAAL0HtwQitQQBAKgGACG3BEAArgYAIQIQAACUDQAgggQAAOQHACAJEAAAsQcAIOcDAAC8BwAw6AMAACgAEOkDAAC8BwAw6gMBAAAAAYIEAAD7BgAglQQAAL0HtwQitQQBAKgGACG3BEAArgYAIQMAAAAoACACAAApADADAAAqACABAAAAIgAgAQAAACgAIAMAAAAVACACAAAWADADAAAXACARFAAAmgcAIBUAAJUHACDnAwAAmAcAMOgDAAAvABDpAwAAmAcAMOoDAQCoBgAhggQAAPsGACCFBEAArgYAIZEEQACuBgAhoQQAAJkHzQQivgRAAKwGACG_BAEAqAYAIcgEAQDrBgAhyQQCAK0GACHKBAIArQYAIcsEAQDrBgAhzQQgAKsGACEBAAAALwAgAQAAABsAIBAUAACaBwAgGAAAuwcAIOcDAAC6BwAw6AMAADIAEOkDAAC6BwAw6gMBAKgGACGFBEAArgYAIb8EAQCoBgAhwAQBAKgGACHBBCAAqwYAIcIEAQDrBgAhwwQBAOsGACHEBAIA_AYAIcUEAgD8BgAhxgQCAK0GACHHBAEA6wYAIQcUAACPDQAgGAAAlw0AIMIEAADkBwAgwwQAAOQHACDEBAAA5AcAIMUEAADkBwAgxwQAAOQHACARFAAAmgcAIBgAALsHACDnAwAAugcAMOgDAAAyABDpAwAAugcAMOoDAQAAAAGFBEAArgYAIb8EAQCoBgAhwAQBAKgGACHBBCAAqwYAIcIEAQDrBgAhwwQBAOsGACHEBAIA_AYAIcUEAgD8BgAhxgQCAK0GACHHBAEA6wYAIbIFAAC5BwAgAwAAADIAIAIAADMAMAMAADQAIAMAAAAyACACAAAzADADAAA0ACABAAAAMgAgAQAAABUAIAEAAAAyACABAAAAFQAgAQAAABEAIA4JAADsBgAgFwAAuAcAIOcDAAC3BwAw6AMAADwAEOkDAAC3BwAw6gMBAKgGACGFBEAArgYAIcMEAQCoBgAhxgQCAK0GACHPBAEAqAYAIeUEAQDrBgAh5gQgAKsGACHnBAIA_AYAIegEAgD8BgAhBQkAAIQKACAXAACWDQAg5QQAAOQHACDnBAAA5AcAIOgEAADkBwAgDgkAAOwGACAXAAC4BwAg5wMAALcHADDoAwAAPAAQ6QMAALcHADDqAwEAAAABhQRAAK4GACHDBAEAqAYAIcYEAgCtBgAhzwQBAKgGACHlBAEA6wYAIeYEIACrBgAh5wQCAPwGACHoBAIA_AYAIQMAAAA8ACACAAA9ADADAAA-ACADAAAACwAgAgAADAAwAwAADQAgAwAAACIAIAIAACMAMAMAACQAIAEAAAA8ACABAAAACwAgAQAAACIAIAcIAACVDQAgCwAAkgsAIAwAAIsNACDVBAAA5AcAINoEAADkBwAg4QQAAOQHACDiBAAA5AcAIBEIAACyBwAgCwAAlQcAIAwAALYHACDnAwAAtAcAMOgDAAAZABDpAwAAtAcAMOoDAQAAAAGhBAAAtQffBCK4BAEAqAYAIdUEAQDrBgAh2gRAAKwGACHdBAEAqAYAId8EAQAAAAHgBEAArgYAIeEEQACsBgAh4gRAAKwGACGxBQAAswcAIAMAAAAZACACAABFADADAABGACADAAAAHQAgAgAAHgAwAwAAHwAgBAgAAJUNACAQAACUDQAgvQQAAOQHACC-BAAA5AcAIBAIAACyBwAgEAAAsQcAIOcDAACuBwAw6AMAACYAEOkDAACuBwAw6gMBAAAAAYUEQACuBgAhkQRAAK4GACGhBAAAsAe9BCK1BAEAAAABuAQBAKgGACG5BAIArQYAIboEAgCtBgAhuwQIAK8HACG9BAIA_AYAIb4EQACsBgAhAwAAACYAIAIAAEkAMAMAAEoAIAEAAAAFACABAAAACwAgAQAAABkAIAEAAAAdACABAAAAJgAgFwYAAMEGACAHAAD9BgAgCgAAqgcAIA8AAK0HACAdAACrBwAgHgAArAcAIOcDAACnBwAw6AMAAFEAEOkDAACnBwAw6gMBAKgGACGFBEAArgYAIYwEAQCoBgAhjwQAAKgH8QQikQRAAK4GACGeBAEAqAYAIe4EAQCoBgAh7wQBAKgGACHyBAAAqQfyBCLzBAIArQYAIfQEAgD8BgAh9QQBAKgGACH2BCAAqwYAIfcEQACsBgAhCAYAAKUIACAHAACSCwAgCgAAkA0AIA8AAJMNACAdAACRDQAgHgAAkg0AIPQEAADkBwAg9wQAAOQHACAYBgAAwQYAIAcAAP0GACAKAACqBwAgDwAArQcAIB0AAKsHACAeAACsBwAg5wMAAKcHADDoAwAAUQAQ6QMAAKcHADDqAwEAAAABhQRAAK4GACGMBAEAqAYAIY8EAACoB_EEIpEEQACuBgAhngQBAKgGACHuBAEAqAYAIe8EAQCoBgAh8gQAAKkH8gQi8wQCAK0GACH0BAIA_AYAIfUEAQCoBgAh9gQgAKsGACH3BEAArAYAIbAFAACmBwAgAwAAAFEAIAIAAFIAMAMAAFMAIBEGAADBBgAgJAAAwgYAIOcDAAC-BgAw6AMAAFUAEOkDAAC-BgAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhngQBAKgGACGhBAAAwAasBCKqBAAAvwaqBCKsBAEA6wYAIa0EAQDrBgAhrgRAAKwGACGvBEAArAYAIbAEIACrBgAhsQRAAKwGACEBAAAAVQAgFgYAAKUHACAiAAD9BgAgIwAAggcAIOcDAACiBwAw6AMAAFcAEOkDAACiBwAw6gMBAKgGACHrAwEAqAYAIYIEAAD7BgAghQRAAK4GACGRBEAArgYAIZMEAACpBpMEIp4EAQDrBgAhnwQBAOsGACGhBAAAowehBCKiBAQApAcAIaMEAQCoBgAhpAQBAOsGACGlBAEA6wYAIaYEAQDrBgAhpwRAAKwGACGoBEAArAYAIQsGAAClCAAgIgAAkgsAICMAAMULACCCBAAA5AcAIJ4EAADkBwAgnwQAAOQHACCkBAAA5AcAIKUEAADkBwAgpgQAAOQHACCnBAAA5AcAIKgEAADkBwAgFgYAAKUHACAiAAD9BgAgIwAAggcAIOcDAACiBwAw6AMAAFcAEOkDAACiBwAw6gMBAAAAAesDAQCoBgAhggQAAPsGACCFBEAArgYAIZEEQACuBgAhkwQAAKkGkwQingQBAOsGACGfBAEA6wYAIaEEAACjB6EEIqIEBACkBwAhowQBAKgGACGkBAEAAAABpQQBAAAAAaYEAQAAAAGnBEAArAYAIagEQACsBgAhAwAAAFcAIAIAAFgAMAMAAFkAIAEAAAADACABAAAAVQAgAQAAAFcAIAMAAABXACACAABYADADAABZACABAAAABQAgAQAAAFEAIAEAAABXACASIgAA_QYAIOcDAAChBwAw6AMAAGIAEOkDAAChBwAw6gMBAKgGACHrAwEAqAYAIYUEQACuBgAhkQRAAK4GACGcBQEAqAYAIZ0FAQCoBgAhngUBAKgGACGfBQEA6wYAIaAFAQDrBgAhoQUBAOsGACGiBQEA6wYAIaMFQACsBgAhpAVAAKwGACGlBQEA6wYAIQgiAACSCwAgnwUAAOQHACCgBQAA5AcAIKEFAADkBwAgogUAAOQHACCjBQAA5AcAIKQFAADkBwAgpQUAAOQHACATIgAA_QYAIOcDAAChBwAw6AMAAGIAEOkDAAChBwAw6gMBAAAAAesDAQCoBgAhhQRAAK4GACGRBEAArgYAIZwFAQCoBgAhnQUBAKgGACGeBQEAqAYAIZ8FAQDrBgAhoAUBAOsGACGhBQEA6wYAIaIFAQDrBgAhowVAAKwGACGkBUAArAYAIaUFAQDrBgAhrwUAAKAHACADAAAAYgAgAgAAYwAwAwAAZAAgDCIAAP0GACDnAwAAnwcAMOgDAABmABDpAwAAnwcAMOoDAQCoBgAh6wMBAKgGACGDBAEA6wYAIYQEAQDrBgAhhQRAAK4GACGRBEAArgYAIdoEQACuBgAhmQUBAKgGACEDIgAAkgsAIIMEAADkBwAghAQAAOQHACAMIgAA_QYAIOcDAACfBwAw6AMAAGYAEOkDAACfBwAw6gMBAAAAAesDAQCoBgAhgwQBAOsGACGEBAEA6wYAIYUEQACuBgAhkQRAAK4GACHaBEAArgYAIZkFAQAAAAEDAAAAZgAgAgAAZwAwAwAAaAAgCCIAAP0GACDnAwAAngcAMOgDAABqABDpAwAAngcAMOoDAQCoBgAh6wMBAKgGACGaBQEAqAYAIZsFAQDrBgAhAiIAAJILACCbBQAA5AcAIAgiAAD9BgAg5wMAAJ4HADDoAwAAagAQ6QMAAJ4HADDqAwEAAAAB6wMBAAAAAZoFAQCoBgAhmwUBAOsGACEDAAAAagAgAgAAawAwAwAAbAAgCiIAAP0GACDnAwAAnAcAMOgDAABuABDpAwAAnAcAMOoDAQCoBgAh6wMBAKgGACHtAwAAnQftAyLuAyAAqwYAIe8DQACuBgAh8ANAAKwGACECIgAAkgsAIPADAADkBwAgCyIAAP0GACDnAwAAnAcAMOgDAABuABDpAwAAnAcAMOoDAQAAAAHrAwEAqAYAIe0DAACdB-0DIu4DIACrBgAh7wNAAK4GACHwA0AArAYAIa4FAACbBwAgAwAAAG4AIAIAAG8AMAMAAHAAIBMiAAD9BgAg5wMAAPoGADDoAwAAcgAQ6QMAAPoGADDqAwEAqAYAIesDAQCoBgAhhQRAAK4GACGRBEAArgYAIfcEQACsBgAhhgUBAOsGACGHBQEA6wYAIYgFAQDrBgAhiQUBAOsGACGKBQEA6wYAIYsFAQDrBgAhjAUBAOsGACGNBQEA6wYAIY4FAAD7BgAgjwUCAPwGACEBAAAAcgAgAwAAAAUAIAIAAAYAMAMAAAcAIAMAAAAZACACAABFADADAABGACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAFEAIAIAAFIAMAMAAFMAIAYUAACPDQAgFQAAkgsAIIIEAADkBwAgvgQAAOQHACDIBAAA5AcAIMsEAADkBwAgERQAAJoHACAVAACVBwAg5wMAAJgHADDoAwAALwAQ6QMAAJgHADDqAwEAAAABggQAAPsGACCFBEAArgYAIZEEQACuBgAhoQQAAJkHzQQivgRAAKwGACG_BAEAAAAByAQBAOsGACHJBAIArQYAIcoEAgCtBgAhywQBAOsGACHNBCAAqwYAIQMAAAAvACACAAB4ADADAAB5ACADAAAAVwAgAgAAWAAwAwAAWQAgDSIAAP0GACDnAwAAlgcAMOgDAAB8ABDpAwAAlgcAMOoDAQCoBgAh6wMBAKgGACGCBAAA-wYAIIUEQACuBgAhjAQBAKgGACGNBAEAqAYAIY8EAACXB48EIpAEIACrBgAhkQRAAK4GACECIgAAkgsAIIIEAADkBwAgDSIAAP0GACDnAwAAlgcAMOgDAAB8ABDpAwAAlgcAMOoDAQAAAAHrAwEAqAYAIYIEAAD7BgAghQRAAK4GACGMBAEAqAYAIY0EAQCoBgAhjwQAAJcHjwQikAQgAKsGACGRBEAArgYAIQMAAAB8ACACAAB9ADADAAB-ACAPIgAAlQcAIOcDAACTBwAw6AMAAIABABDpAwAAkwcAMOoDAQCoBgAh6wMBAOsGACH9AwAAlAf9AyL-AwEAqAYAIf8DAQDrBgAhgAQAAPsGACCBBAAA-wYAIIIEAAD7BgAggwQBAOsGACGEBAEA6wYAIYUEQACuBgAhCCIAAJILACDrAwAA5AcAIP8DAADkBwAggAQAAOQHACCBBAAA5AcAIIIEAADkBwAggwQAAOQHACCEBAAA5AcAIA8iAACVBwAg5wMAAJMHADDoAwAAgAEAEOkDAACTBwAw6gMBAAAAAesDAQDrBgAh_QMAAJQH_QMi_gMBAKgGACH_AwEA6wYAIYAEAAD7BgAggQQAAPsGACCCBAAA-wYAIIMEAQDrBgAhhAQBAOsGACGFBEAArgYAIQMAAACAAQAgAgAAgQEAMAMAAIIBACABAAAAGwAgAQAAAGIAIAEAAABmACABAAAAagAgAQAAAG4AIAEAAAAFACABAAAAGQAgAQAAAB0AIAEAAABRACABAAAALwAgAQAAAFcAIAEAAAB8ACABAAAAgAEAIAEAAAABACASBgAApQgAIAwAAIsNACAfAACKDQAgJAAApggAICUAAIUNACAmAACGDQAgJwAAhw0AICgAAIgNACApAACJDQAgKgAAwwsAICsAAMQLACAsAACMDQAgLQAAjQ0AIC4AAI4NACD3BAAA5AcAIIgFAADkBwAgpgUAAOQHACCtBQAA5AcAIAMAAAAbACACAACSAQAwAwAAAQAgAwAAABsAIAIAAJIBADADAAABACADAAAAGwAgAgAAkgEAMAMAAAEAIBwGAAD3DAAgDAAA_wwAIB8AAP4MACAkAACCDQAgJQAA-AwAICYAAPkMACAnAAD6DAAgKAAA-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_gEAMEAAAP8BACADAAAA7AEAIAIAAO0BADADAADpAQAgFAEAAP0GACAgAACABwAgIQAAgQcAICMAAIIHACAkAADCBgAg5wMAAP8GADDoAwAAAwAQ6QMAAP8GADDqAwEAAAABhQRAAK4GACGRBEAArgYAIe4EAQAAAAHvBAEA6wYAIfcEQACsBgAhkAUBAKgGACGRBQEA6wYAIZIFAQDrBgAhkwUBAOsGACGUBSAAqwYAIZUFAQAAAAEBAAAAggIAIAEAAACCAgAgCgEAAJILACAgAADDCwAgIQAAxAsAICMAAMULACAkAACmCAAg7wQAAOQHACD3BAAA5AcAIJEFAADkBwAgkgUAAOQHACCTBQAA5AcAIAMAAAADACACAACFAgAwAwAAggIAIAMAAAADACACAACFAgAwAwAAggIAIAMAAAADACACAACFAgAwAwAAggIAIBEBAAC-CwAgIAAAvwsAICEAAMALACAjAADBCwAgJAAAwgsAIOoDAQAAAAGFBEAAAAABkQRAAAAAAe4EAQAAAAHvBAEAAAAB9wRAAAAAAZAFAQAAAAGRBQEAAAABkgUBAAAAAZMFAQAAAAGUBSAAAAABlQUBAAAAAQE0AACJAgAgDOoDAQAAAAGFBEAAAAABkQRAAAAAAe4EAQAAAAHvBAEAAAAB9wRAAAAAAZAFAQAAAAGRBQEAAAABkgUBAAAAAZMFAQAAAAGUBSAAAAABlQUBAAAAAQE0AACLAgAwATQAAIsCADARAQAAlgsAICAAAJcLACAhAACYCwAgIwAAmQsAICQAAJoLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACHuBAEA6AcAIe8EAQDzBwAh9wRAAOwHACGQBQEA6AcAIZEFAQDzBwAhkgUBAPMHACGTBQEA8wcAIZQFIADqBwAhlQUBAOgHACECAAAAggIAIDQAAI4CACAM6gMBAOgHACGFBEAA6wcAIZEEQADrBwAh7gQBAOgHACHvBAEA8wcAIfcEQADsBwAhkAUBAOgHACGRBQEA8wcAIZIFAQDzBwAhkwUBAPMHACGUBSAA6gcAIZUFAQDoBwAhAgAAAAMAIDQAAJACACACAAAAAwAgNAAAkAIAIAMAAACCAgAgOwAAiQIAIDwAAI4CACABAAAAggIAIAEAAAADACAIDQAAkwsAIEEAAJULACBCAACUCwAg7wQAAOQHACD3BAAA5AcAIJEFAADkBwAgkgUAAOQHACCTBQAA5AcAIA_nAwAA_gYAMOgDAACXAgAQ6QMAAP4GADDqAwEAgAYAIYUEQACDBgAhkQRAAIMGACHuBAEAgAYAIe8EAQCSBgAh9wRAAIQGACGQBQEAgAYAIZEFAQCSBgAhkgUBAJIGACGTBQEAkgYAIZQFIACCBgAhlQUBAIAGACEDAAAAAwAgAgAAlgIAMEAAAJcCACADAAAAAwAgAgAAhQIAMAMAAIICACATIgAA_QYAIOcDAAD6BgAw6AMAAHIAEOkDAAD6BgAw6gMBAAAAAesDAQAAAAGFBEAArgYAIZEEQACuBgAh9wRAAKwGACGGBQEA6wYAIYcFAQDrBgAhiAUBAOsGACGJBQEA6wYAIYoFAQDrBgAhiwUBAOsGACGMBQEA6wYAIY0FAQDrBgAhjgUAAPsGACCPBQIA_AYAIQEAAACaAgAgAQAAAJoCACAMIgAAkgsAIPcEAADkBwAghgUAAOQHACCHBQAA5AcAIIgFAADkBwAgiQUAAOQHACCKBQAA5AcAIIsFAADkBwAgjAUAAOQHACCNBQAA5AcAII4FAADkBwAgjwUAAOQHACADAAAAcgAgAgAAnQIAMAMAAJoCACADAAAAcgAgAgAAnQIAMAMAAJoCACADAAAAcgAgAgAAnQIAMAMAAJoCACAQIgAAkQsAIOoDAQAAAAHrAwEAAAABhQRAAAAAAZEEQAAAAAH3BEAAAAABhgUBAAAAAYcFAQAAAAGIBQEAAAABiQUBAAAAAYoFAQAAAAGLBQEAAAABjAUBAAAAAY0FAQAAAAGOBYAAAAABjwUCAAAAAQE0AAChAgAgD-oDAQAAAAHrAwEAAAABhQRAAAAAAZEEQAAAAAH3BEAAAAABhgUBAAAAAYcFAQAAAAGIBQEAAAABiQUBAAAAAYoFAQAAAAGLBQEAAAABjAUBAAAAAY0FAQAAAAGOBYAAAAABjwUCAAAAAQE0AACjAgAwATQAAKMCADAQIgAAkAsAIOoDAQDoBwAh6wMBAOgHACGFBEAA6wcAIZEEQADrBwAh9wRAAOwHACGGBQEA8wcAIYcFAQDzBwAhiAUBAPMHACGJBQEA8wcAIYoFAQDzBwAhiwUBAPMHACGMBQEA8wcAIY0FAQDzBwAhjgWAAAAAAY8FAgC0CAAhAgAAAJoCACA0AACmAgAgD-oDAQDoBwAh6wMBAOgHACGFBEAA6wcAIZEEQADrBwAh9wRAAOwHACGGBQEA8wcAIYcFAQDzBwAhiAUBAPMHACGJBQEA8wcAIYoFAQDzBwAhiwUBAPMHACGMBQEA8wcAIY0FAQDzBwAhjgWAAAAAAY8FAgC0CAAhAgAAAHIAIDQAAKgCACACAAAAcgAgNAAAqAIAIAMAAACaAgAgOwAAoQIAIDwAAKYCACABAAAAmgIAIAEAAAByACAQDQAAiwsAIEEAAI4LACBCAACNCwAgowEAAIwLACCkAQAAjwsAIPcEAADkBwAghgUAAOQHACCHBQAA5AcAIIgFAADkBwAgiQUAAOQHACCKBQAA5AcAIIsFAADkBwAgjAUAAOQHACCNBQAA5AcAII4FAADkBwAgjwUAAOQHACAS5wMAAPkGADDoAwAArwIAEOkDAAD5BgAw6gMBAIAGACHrAwEAgAYAIYUEQACDBgAhkQRAAIMGACH3BEAAhAYAIYYFAQCSBgAhhwUBAJIGACGIBQEAkgYAIYkFAQCSBgAhigUBAJIGACGLBQEAkgYAIYwFAQCSBgAhjQUBAJIGACGOBQAAlAYAII8FAgDKBgAhAwAAAHIAIAIAAK4CADBAAACvAgAgAwAAAHIAIAIAAJ0CADADAACaAgAgAQAAAAcAIAEAAAAHACADAAAABQAgAgAABgAwAwAABwAgAwAAAAUAIAIAAAYAMAMAAAcAIAMAAAAFACACAAAGADADAAAHACAgBAAAigsAIAUAAIMLACAGAACECwAgBwAAhQsAIAwAAIgLACAXAACJCwAgHgAAhgsAIB8AAIcLACDqAwEAAAABhQRAAAAAAYwEAQAAAAGRBEAAAAABngQBAAAAAaEEAAAA_QQCugQCAAAAAe4EAQAAAAHvBAEAAAAB9QQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAGFBQEAAAABATQAALcCACAY6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQE0AAC5AgAwATQAALkCADABAAAABQAgIAQAAMUKACAFAADGCgAgBgAAxwoAIAcAAMgKACAMAADLCgAgFwAAzAoAIB4AAMkKACAfAADKCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIQIAAAAHACA0AAC9AgAgGOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACECAAAABQAgNAAAvwIAIAIAAAAFACA0AAC_AgAgAQAAAAUAIAMAAAAHACA7AAC3AgAgPAAAvQIAIAEAAAAHACABAAAABQAgDA0AAL8KACBBAADCCgAgQgAAwQoAIKMBAADACgAgpAEAAMMKACDvBAAA5AcAIPcEAADkBwAg-AQAAOQHACD9BAAA5AcAIP4EAADkBwAg_wQAAOQHACCFBQAA5AcAIBvnAwAA9QYAMOgDAADHAgAQ6QMAAPUGADDqAwEAgAYAIYUEQACDBgAhjAQBAIAGACGRBEAAgwYAIZ4EAQCABgAhoQQAAPYG_QQiugQCAKEGACHuBAEAgAYAIe8EAQCSBgAh9QQBAIAGACH3BEAAhAYAIfgEAQCSBgAh-QQCAKEGACH6BAIAoQYAIfsEAgChBgAh_QRAAIQGACH-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_QIAIAXqAwEAAAAB4wQCAAAAAekEAQAAAAHqBAEAAAAB6wQgAAAAAQE0AAD_AgAwATQAAP8CADAHCgAA4wkAIBsAAOQJACDqAwEA6AcAIeMEAgCCCAAh6QQBAOgHACHqBAEA6AcAIesEIADqBwAhAgAAABMAIDQAAIIDACAF6gMBAOgHACHjBAIAgggAIekEAQDoBwAh6gQBAOgHACHrBCAA6gcAIQIAAAARACA0AACEAwAgAgAAABEAIDQAAIQDACADAAAAEwAgOwAA_QIAIDwAAIIDACABAAAAEwAgAQAAABEAIAUNAADeCQAgQQAA4QkAIEIAAOAJACCjAQAA3wkAIKQBAADiCQAgCOcDAADkBgAw6AMAAIsDABDpAwAA5AYAMOoDAQCABgAh4wQCAKEGACHpBAEAgAYAIeoEAQCABgAh6wQgAIIGACEDAAAAEQAgAgAAigMAMEAAAIsDACADAAAAEQAgAgAAEgAwAwAAEwAgAQAAAD4AIAEAAAA-ACADAAAAPAAgAgAAPQAwAwAAPgAgAwAAADwAIAIAAD0AMAMAAD4AIAMAAAA8ACACAAA9ADADAAA-ACALCQAA3AkAIBcAAN0JACDqAwEAAAABhQRAAAAAAcMEAQAAAAHGBAIAAAABzwQBAAAAAeUEAQAAAAHmBCAAAAAB5wQCAAAAAegEAgAAAAEBNAAAkwMAIAnqAwEAAAABhQRAAAAAAcMEAQAAAAHGBAIAAAABzwQBAAAAAeUEAQAAAAHmBCAAAAAB5wQCAAAAAegEAgAAAAEBNAAAlQMAMAE0AACVAwAwCwkAANEJACAXAADSCQAg6gMBAOgHACGFBEAA6wcAIcMEAQDoBwAhxgQCAIIIACHPBAEA6AcAIeUEAQDzBwAh5gQgAOoHACHnBAIAtAgAIegEAgC0CAAhAgAAAD4AIDQAAJgDACAJ6gMBAOgHACGFBEAA6wcAIcMEAQDoBwAhxgQCAIIIACHPBAEA6AcAIeUEAQDzBwAh5gQgAOoHACHnBAIAtAgAIegEAgC0CAAhAgAAADwAIDQAAJoDACACAAAAPAAgNAAAmgMAIAMAAAA-ACA7AACTAwAgPAAAmAMAIAEAAAA-ACABAAAAPAAgCA0AAMwJACBBAADPCQAgQgAAzgkAIKMBAADNCQAgpAEAANAJACDlBAAA5AcAIOcEAADkBwAg6AQAAOQHACAM5wMAAOMGADDoAwAAoQMAEOkDAADjBgAw6gMBAIAGACGFBEAAgwYAIcMEAQCABgAhxgQCAKEGACHPBAEAgAYAIeUEAQCSBgAh5gQgAIIGACHnBAIAygYAIegEAgDKBgAhAwAAADwAIAIAAKADADBAAAChAwAgAwAAADwAIAIAAD0AMAMAAD4AIAEAAAANACABAAAADQAgAwAAAAsAIAIAAAwAMAMAAA0AIAMAAAALACACAAAMADADAAANACADAAAACwAgAgAADAAwAwAADQAgCAgAAMoJACAJAADLCQAg6gMBAAAAAYUEQAAAAAG4BAEAAAABzwQBAAAAAeMEAgAAAAHkBAIAAAABATQAAKkDACAG6gMBAAAAAYUEQAAAAAG4BAEAAAABzwQBAAAAAeMEAgAAAAHkBAIAAAABATQAAKsDADABNAAAqwMAMAgIAADICQAgCQAAyQkAIOoDAQDoBwAhhQRAAOsHACG4BAEA6AcAIc8EAQDoBwAh4wQCAIIIACHkBAIAgggAIQIAAAANACA0AACuAwAgBuoDAQDoBwAhhQRAAOsHACG4BAEA6AcAIc8EAQDoBwAh4wQCAIIIACHkBAIAgggAIQIAAAALACA0AACwAwAgAgAAAAsAIDQAALADACADAAAADQAgOwAAqQMAIDwAAK4DACABAAAADQAgAQAAAAsAIAUNAADDCQAgQQAAxgkAIEIAAMUJACCjAQAAxAkAIKQBAADHCQAgCecDAADiBgAw6AMAALcDABDpAwAA4gYAMOoDAQCABgAhhQRAAIMGACG4BAEAgAYAIc8EAQCABgAh4wQCAKEGACHkBAIAoQYAIQMAAAALACACAAC2AwAwQAAAtwMAIAMAAAALACACAAAMADADAAANACABAAAARgAgAQAAAEYAIAMAAAAZACACAABFADADAABGACADAAAAGQAgAgAARQAwAwAARgAgAwAAABkAIAIAAEUAMAMAAEYAIA0IAADACQAgCwAAwQkAIAwAAMIJACDqAwEAAAABoQQAAADfBAK4BAEAAAAB1QQBAAAAAdoEQAAAAAHdBAEAAAAB3wQBAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAQE0AAC_AwAgCuoDAQAAAAGhBAAAAN8EArgEAQAAAAHVBAEAAAAB2gRAAAAAAd0EAQAAAAHfBAEAAAAB4ARAAAAAAeEEQAAAAAHiBEAAAAABATQAAMEDADABNAAAwQMAMAEAAAAbACANCAAAsQkAIAsAALIJACAMAACzCQAg6gMBAOgHACGhBAAAsAnfBCK4BAEA6AcAIdUEAQDzBwAh2gRAAOwHACHdBAEA6AcAId8EAQDoBwAh4ARAAOsHACHhBEAA7AcAIeIEQADsBwAhAgAAAEYAIDQAAMUDACAK6gMBAOgHACGhBAAAsAnfBCK4BAEA6AcAIdUEAQDzBwAh2gRAAOwHACHdBAEA6AcAId8EAQDoBwAh4ARAAOsHACHhBEAA7AcAIeIEQADsBwAhAgAAABkAIDQAAMcDACACAAAAGQAgNAAAxwMAIAEAAAAbACADAAAARgAgOwAAvwMAIDwAAMUDACABAAAARgAgAQAAABkAIAcNAACtCQAgQQAArwkAIEIAAK4JACDVBAAA5AcAINoEAADkBwAg4QQAAOQHACDiBAAA5AcAIA3nAwAA3gYAMOgDAADPAwAQ6QMAAN4GADDqAwEAgAYAIaEEAADfBt8EIrgEAQCABgAh1QQBAJIGACHaBEAAhAYAId0EAQCABgAh3wQBAIAGACHgBEAAgwYAIeEEQACEBgAh4gRAAIQGACEDAAAAGQAgAgAAzgMAMEAAAM8DACADAAAAGQAgAgAARQAwAwAARgAgAQAAAB8AIAEAAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIAMAAAAdACACAAAeADADAAAfACAVCAAApwkAIAsAAKgJACAOAACpCQAgDwAAqgkAIBEAAKsJACASAACsCQAg6gMBAAAAAYMEAQAAAAGEBAEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANkEArgEAQAAAAHUBEAAAAAB1QQBAAAAAdYEAQAAAAHXBAIAAAAB2QRAAAAAAdoEQAAAAAHbBEAAAAAB3AQCAAAAAQE0AADXAwAgD-oDAQAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADZBAK4BAEAAAAB1ARAAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAdkEQAAAAAHaBEAAAAAB2wRAAAAAAdwEAgAAAAEBNAAA2QMAMAE0AADZAwAwAQAAABkAIBUIAACECQAgCwAAhQkAIA4AAIYJACAPAACHCQAgEQAAiAkAIBIAAIkJACDqAwEA6AcAIYMEAQDzBwAhhAQBAPMHACGFBEAA6wcAIZEEQADrBwAhoQQAAIMJ2QQiuAQBAOgHACHUBEAA7AcAIdUEAQDoBwAh1gQBAPMHACHXBAIAgggAIdkEQADsBwAh2gRAAOsHACHbBEAA7AcAIdwEAgCCCAAhAgAAAB8AIDQAAN0DACAP6gMBAOgHACGDBAEA8wcAIYQEAQDzBwAhhQRAAOsHACGRBEAA6wcAIaEEAACDCdkEIrgEAQDoBwAh1ARAAOwHACHVBAEA6AcAIdYEAQDzBwAh1wQCAIIIACHZBEAA7AcAIdoEQADrBwAh2wRAAOwHACHcBAIAgggAIQIAAAAdACA0AADfAwAgAgAAAB0AIDQAAN8DACABAAAAGQAgAwAAAB8AIDsAANcDACA8AADdAwAgAQAAAB8AIAEAAAAdACALDQAA_ggAIEEAAIEJACBCAACACQAgowEAAP8IACCkAQAAggkAIIMEAADkBwAghAQAAOQHACDUBAAA5AcAINYEAADkBwAg2QQAAOQHACDbBAAA5AcAIBLnAwAA2gYAMOgDAADnAwAQ6QMAANoGADDqAwEAgAYAIYMEAQCSBgAhhAQBAJIGACGFBEAAgwYAIZEEQACDBgAhoQQAANsG2QQiuAQBAIAGACHUBEAAhAYAIdUEAQCABgAh1gQBAJIGACHXBAIAoQYAIdkEQACEBgAh2gRAAIMGACHbBEAAhAYAIdwEAgChBgAhAwAAAB0AIAIAAOYDADBAAADnAwAgAwAAAB0AIAIAAB4AMAMAAB8AIAEAAAAkACABAAAAJAAgAwAAACIAIAIAACMAMAMAACQAIAMAAAAiACACAAAjADADAAAkACADAAAAIgAgAgAAIwAwAwAAJAAgDwkAAPoIACAQAAD5CAAgEwAA-wgAIBYAAPwIACAZAAD9CAAg6gMBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADUBAK1BAEAAAABzwQBAAAAAdAEAQAAAAHRBAEAAAAB0gQBAAAAAdQEQAAAAAEBNAAA7wMAIArqAwEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANQEArUEAQAAAAHPBAEAAAAB0AQBAAAAAdEEAQAAAAHSBAEAAAAB1ARAAAAAAQE0AADxAwAwATQAAPEDADAPCQAA2AgAIBAAANcIACATAADZCAAgFgAA2ggAIBkAANsIACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAA1gjUBCK1BAEA6AcAIc8EAQDoBwAh0AQBAPMHACHRBAEA8wcAIdIEAQDzBwAh1ARAAOwHACECAAAAJAAgNAAA9AMAIArqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAA1gjUBCK1BAEA6AcAIc8EAQDoBwAh0AQBAPMHACHRBAEA8wcAIdIEAQDzBwAh1ARAAOwHACECAAAAIgAgNAAA9gMAIAIAAAAiACA0AAD2AwAgAwAAACQAIDsAAO8DACA8AAD0AwAgAQAAACQAIAEAAAAiACAHDQAA0wgAIEEAANUIACBCAADUCAAg0AQAAOQHACDRBAAA5AcAINIEAADkBwAg1AQAAOQHACAN5wMAANYGADDoAwAA_QMAEOkDAADWBgAw6gMBAIAGACGFBEAAgwYAIZEEQACDBgAhoQQAANcG1AQitQQBAIAGACHPBAEAgAYAIdAEAQCSBgAh0QQBAJIGACHSBAEAkgYAIdQEQACEBgAhAwAAACIAIAIAAPwDADBAAAD9AwAgAwAAACIAIAIAACMAMAMAACQAIAEAAAAXACABAAAAFwAgAwAAABUAIAIAABYAMAMAABcAIAMAAAAVACACAAAWADADAAAXACADAAAAFQAgAgAAFgAwAwAAFwAgBhQAANEIACAaAADSCAAg6gMBAAAAAYUEQAAAAAG_BAEAAAABzgQBAAAAAQE0AACFBAAgBOoDAQAAAAGFBEAAAAABvwQBAAAAAc4EAQAAAAEBNAAAhwQAMAE0AACHBAAwBhQAAM8IACAaAADQCAAg6gMBAOgHACGFBEAA6wcAIb8EAQDoBwAhzgQBAOgHACECAAAAFwAgNAAAigQAIATqAwEA6AcAIYUEQADrBwAhvwQBAOgHACHOBAEA6AcAIQIAAAAVACA0AACMBAAgAgAAABUAIDQAAIwEACADAAAAFwAgOwAAhQQAIDwAAIoEACABAAAAFwAgAQAAABUAIAMNAADMCAAgQQAAzggAIEIAAM0IACAH5wMAANUGADDoAwAAkwQAEOkDAADVBgAw6gMBAIAGACGFBEAAgwYAIb8EAQCABgAhzgQBAIAGACEDAAAAFQAgAgAAkgQAMEAAAJMEACADAAAAFQAgAgAAFgAwAwAAFwAgAQAAAHkAIAEAAAB5ACADAAAALwAgAgAAeAAwAwAAeQAgAwAAAC8AIAIAAHgAMAMAAHkAIAMAAAAvACACAAB4ADADAAB5ACAOFAAAyggAIBUAAMsIACDqAwEAAAABggSAAAAAAYUEQAAAAAGRBEAAAAABoQQAAADNBAK-BEAAAAABvwQBAAAAAcgEAQAAAAHJBAIAAAABygQCAAAAAcsEAQAAAAHNBCAAAAABATQAAJsEACAM6gMBAAAAAYIEgAAAAAGFBEAAAAABkQRAAAAAAaEEAAAAzQQCvgRAAAAAAb8EAQAAAAHIBAEAAAAByQQCAAAAAcoEAgAAAAHLBAEAAAABzQQgAAAAAQE0AACdBAAwATQAAJ0EADABAAAAGwAgDhQAAMgIACAVAADJCAAg6gMBAOgHACGCBIAAAAABhQRAAOsHACGRBEAA6wcAIaEEAADHCM0EIr4EQADsBwAhvwQBAOgHACHIBAEA8wcAIckEAgCCCAAhygQCAIIIACHLBAEA8wcAIc0EIADqBwAhAgAAAHkAIDQAAKEEACAM6gMBAOgHACGCBIAAAAABhQRAAOsHACGRBEAA6wcAIaEEAADHCM0EIr4EQADsBwAhvwQBAOgHACHIBAEA8wcAIckEAgCCCAAhygQCAIIIACHLBAEA8wcAIc0EIADqBwAhAgAAAC8AIDQAAKMEACACAAAALwAgNAAAowQAIAEAAAAbACADAAAAeQAgOwAAmwQAIDwAAKEEACABAAAAeQAgAQAAAC8AIAkNAADCCAAgQQAAxQgAIEIAAMQIACCjAQAAwwgAIKQBAADGCAAgggQAAOQHACC-BAAA5AcAIMgEAADkBwAgywQAAOQHACAP5wMAANEGADDoAwAAqwQAEOkDAADRBgAw6gMBAIAGACGCBAAAlAYAIIUEQACDBgAhkQRAAIMGACGhBAAA0gbNBCK-BEAAhAYAIb8EAQCABgAhyAQBAJIGACHJBAIAoQYAIcoEAgChBgAhywQBAJIGACHNBCAAggYAIQMAAAAvACACAACqBAAwQAAAqwQAIAMAAAAvACACAAB4ADADAAB5ACABAAAANAAgAQAAADQAIAMAAAAyACACAAAzADADAAA0ACADAAAAMgAgAgAAMwAwAwAANAAgAwAAADIAIAIAADMAMAMAADQAIA0UAADACAAgGAAAwQgAIOoDAQAAAAGFBEAAAAABvwQBAAAAAcAEAQAAAAHBBCAAAAABwgQBAAAAAcMEAQAAAAHEBAIAAAABxQQCAAAAAcYEAgAAAAHHBAEAAAABATQAALMEACAL6gMBAAAAAYUEQAAAAAG_BAEAAAABwAQBAAAAAcEEIAAAAAHCBAEAAAABwwQBAAAAAcQEAgAAAAHFBAIAAAABxgQCAAAAAccEAQAAAAEBNAAAtQQAMAE0AAC1BAAwDRQAAL4IACAYAAC_CAAg6gMBAOgHACGFBEAA6wcAIb8EAQDoBwAhwAQBAOgHACHBBCAA6gcAIcIEAQDzBwAhwwQBAPMHACHEBAIAtAgAIcUEAgC0CAAhxgQCAIIIACHHBAEA8wcAIQIAAAA0ACA0AAC4BAAgC-oDAQDoBwAhhQRAAOsHACG_BAEA6AcAIcAEAQDoBwAhwQQgAOoHACHCBAEA8wcAIcMEAQDzBwAhxAQCALQIACHFBAIAtAgAIcYEAgCCCAAhxwQBAPMHACECAAAAMgAgNAAAugQAIAIAAAAyACA0AAC6BAAgAwAAADQAIDsAALMEACA8AAC4BAAgAQAAADQAIAEAAAAyACAKDQAAuQgAIEEAALwIACBCAAC7CAAgowEAALoIACCkAQAAvQgAIMIEAADkBwAgwwQAAOQHACDEBAAA5AcAIMUEAADkBwAgxwQAAOQHACAO5wMAANAGADDoAwAAwQQAEOkDAADQBgAw6gMBAIAGACGFBEAAgwYAIb8EAQCABgAhwAQBAIAGACHBBCAAggYAIcIEAQCSBgAhwwQBAJIGACHEBAIAygYAIcUEAgDKBgAhxgQCAKEGACHHBAEAkgYAIQMAAAAyACACAADABAAwQAAAwQQAIAMAAAAyACACAAAzADADAAA0ACABAAAASgAgAQAAAEoAIAMAAAAmACACAABJADADAABKACADAAAAJgAgAgAASQAwAwAASgAgAwAAACYAIAIAAEkAMAMAAEoAIA0IAAC4CAAgEAAAtwgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAAvQQCtQQBAAAAAbgEAQAAAAG5BAIAAAABugQCAAAAAbsECAAAAAG9BAIAAAABvgRAAAAAAQE0AADJBAAgC-oDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAAvQQCtQQBAAAAAbgEAQAAAAG5BAIAAAABugQCAAAAAbsECAAAAAG9BAIAAAABvgRAAAAAAQE0AADLBAAwATQAAMsEADANCAAAtggAIBAAALUIACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAAswi9BCK1BAEA6AcAIbgEAQDoBwAhuQQCAIIIACG6BAIAgggAIbsECACyCAAhvQQCALQIACG-BEAA7AcAIQIAAABKACA0AADOBAAgC-oDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAACzCL0EIrUEAQDoBwAhuAQBAOgHACG5BAIAgggAIboEAgCCCAAhuwQIALIIACG9BAIAtAgAIb4EQADsBwAhAgAAACYAIDQAANAEACACAAAAJgAgNAAA0AQAIAMAAABKACA7AADJBAAgPAAAzgQAIAEAAABKACABAAAAJgAgBw0AAK0IACBBAACwCAAgQgAArwgAIKMBAACuCAAgpAEAALEIACC9BAAA5AcAIL4EAADkBwAgDucDAADHBgAw6AMAANcEABDpAwAAxwYAMOoDAQCABgAhhQRAAIMGACGRBEAAgwYAIaEEAADJBr0EIrUEAQCABgAhuAQBAIAGACG5BAIAoQYAIboEAgChBgAhuwQIAMgGACG9BAIAygYAIb4EQACEBgAhAwAAACYAIAIAANYEADBAAADXBAAgAwAAACYAIAIAAEkAMAMAAEoAIAEAAAAqACABAAAAKgAgAwAAACgAIAIAACkAMAMAACoAIAMAAAAoACACAAApADADAAAqACADAAAAKAAgAgAAKQAwAwAAKgAgBhAAAKwIACDqAwEAAAABggSAAAAAAZUEAAAAtwQCtQQBAAAAAbcEQAAAAAEBNAAA3wQAIAXqAwEAAAABggSAAAAAAZUEAAAAtwQCtQQBAAAAAbcEQAAAAAEBNAAA4QQAMAE0AADhBAAwBhAAAKsIACDqAwEA6AcAIYIEgAAAAAGVBAAAqgi3BCK1BAEA6AcAIbcEQADrBwAhAgAAACoAIDQAAOQEACAF6gMBAOgHACGCBIAAAAABlQQAAKoItwQitQQBAOgHACG3BEAA6wcAIQIAAAAoACA0AADmBAAgAgAAACgAIDQAAOYEACADAAAAKgAgOwAA3wQAIDwAAOQEACABAAAAKgAgAQAAACgAIAQNAACnCAAgQQAAqQgAIEIAAKgIACCCBAAA5AcAIAjnAwAAwwYAMOgDAADtBAAQ6QMAAMMGADDqAwEAgAYAIYIEAACUBgAglQQAAMQGtwQitQQBAIAGACG3BEAAgwYAIQMAAAAoACACAADsBAAwQAAA7QQAIAMAAAAoACACAAApADADAAAqACARBgAAwQYAICQAAMIGACDnAwAAvgYAMOgDAABVABDpAwAAvgYAMOoDAQAAAAGFBEAArgYAIZEEQACuBgAhngQBAAAAAaEEAADABqwEIqoEAAC_BqoEIqwEAQAAAAGtBAEAAAABrgRAAKwGACGvBEAArAYAIbAEIACrBgAhsQRAAKwGACEBAAAA8AQAIAEAAADwBAAgBwYAAKUIACAkAACmCAAgrAQAAOQHACCtBAAA5AcAIK4EAADkBwAgrwQAAOQHACCxBAAA5AcAIAMAAABVACACAADzBAAwAwAA8AQAIAMAAABVACACAADzBAAwAwAA8AQAIAMAAABVACACAADzBAAwAwAA8AQAIA4GAACjCAAgJAAApAgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAKwEAqoEAAAAqgQCrAQBAAAAAa0EAQAAAAGuBEAAAAABrwRAAAAAAbAEIAAAAAGxBEAAAAABATQAAPcEACAM6gMBAAAAAYUEQAAAAAGRBEAAAAABngQBAAAAAaEEAAAArAQCqgQAAACqBAKsBAEAAAABrQQBAAAAAa4EQAAAAAGvBEAAAAABsAQgAAAAAbEEQAAAAAEBNAAA-QQAMAE0AAD5BAAwDgYAAJUIACAkAACWCAAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhngQBAOgHACGhBAAAlAisBCKqBAAAkwiqBCKsBAEA8wcAIa0EAQDzBwAhrgRAAOwHACGvBEAA7AcAIbAEIADqBwAhsQRAAOwHACECAAAA8AQAIDQAAPwEACAM6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhngQBAOgHACGhBAAAlAisBCKqBAAAkwiqBCKsBAEA8wcAIa0EAQDzBwAhrgRAAOwHACGvBEAA7AcAIbAEIADqBwAhsQRAAOwHACECAAAAVQAgNAAA_gQAIAIAAABVACA0AAD-BAAgAwAAAPAEACA7AAD3BAAgPAAA_AQAIAEAAADwBAAgAQAAAFUAIAgNAACQCAAgQQAAkggAIEIAAJEIACCsBAAA5AcAIK0EAADkBwAgrgQAAOQHACCvBAAA5AcAILEEAADkBwAgD-cDAAC3BgAw6AMAAIUFABDpAwAAtwYAMOoDAQCABgAhhQRAAIMGACGRBEAAgwYAIZ4EAQCABgAhoQQAALkGrAQiqgQAALgGqgQirAQBAJIGACGtBAEAkgYAIa4EQACEBgAhrwRAAIQGACGwBCAAggYAIbEEQACEBgAhAwAAAFUAIAIAAIQFADBAAACFBQAgAwAAAFUAIAIAAPMEADADAADwBAAgAQAAAFkAIAEAAABZACADAAAAVwAgAgAAWAAwAwAAWQAgAwAAAFcAIAIAAFgAMAMAAFkAIAMAAABXACACAABYADADAABZACATBgAAjggAICIAAI0IACAjAACPCAAg6gMBAAAAAesDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGTBAAAAJMEAp4EAQAAAAGfBAEAAAABoQQAAAChBAKiBAQAAAABowQBAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEQAAAAAGoBEAAAAABATQAAI0FACAQ6gMBAAAAAesDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGTBAAAAJMEAp4EAQAAAAGfBAEAAAABoQQAAAChBAKiBAQAAAABowQBAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEQAAAAAGoBEAAAAABATQAAI8FADABNAAAjwUAMAEAAAADACABAAAAVQAgEwYAAIsIACAiAACKCAAgIwAAjAgAIOoDAQDoBwAh6wMBAOgHACGCBIAAAAABhQRAAOsHACGRBEAA6wcAIZMEAACBCJMEIp4EAQDzBwAhnwQBAPMHACGhBAAAiAihBCKiBAQAiQgAIaMEAQDoBwAhpAQBAPMHACGlBAEA8wcAIaYEAQDzBwAhpwRAAOwHACGoBEAA7AcAIQIAAABZACA0AACUBQAgEOoDAQDoBwAh6wMBAOgHACGCBIAAAAABhQRAAOsHACGRBEAA6wcAIZMEAACBCJMEIp4EAQDzBwAhnwQBAPMHACGhBAAAiAihBCKiBAQAiQgAIaMEAQDoBwAhpAQBAPMHACGlBAEA8wcAIaYEAQDzBwAhpwRAAOwHACGoBEAA7AcAIQIAAABXACA0AACWBQAgAgAAAFcAIDQAAJYFACABAAAAAwAgAQAAAFUAIAMAAABZACA7AACNBQAgPAAAlAUAIAEAAABZACABAAAAVwAgDQ0AAIMIACBBAACGCAAgQgAAhQgAIKMBAACECAAgpAEAAIcIACCCBAAA5AcAIJ4EAADkBwAgnwQAAOQHACCkBAAA5AcAIKUEAADkBwAgpgQAAOQHACCnBAAA5AcAIKgEAADkBwAgE-cDAACwBgAw6AMAAJ8FABDpAwAAsAYAMOoDAQCABgAh6wMBAIAGACGCBAAAlAYAIIUEQACDBgAhkQRAAIMGACGTBAAAnwaTBCKeBAEAkgYAIZ8EAQCSBgAhoQQAALEGoQQiogQEALIGACGjBAEAgAYAIaQEAQCSBgAhpQQBAJIGACGmBAEAkgYAIacEQACEBgAhqARAAIQGACEDAAAAVwAgAgAAngUAMEAAAJ8FACADAAAAVwAgAgAAWAAwAwAAWQAgEOcDAACnBgAw6AMAAKUFABDpAwAApwYAMOoDAQAAAAGFBEAArgYAIZMEAACpBpMEIpQEAQCoBgAhlQQBAKgGACGWBAAAqgYAIJcEIACrBgAhmARAAKwGACGZBAIArQYAIZoEAgCtBgAhmwRAAKwGACGcBEAArAYAIZ0EAACvBgAgAQAAAKIFACABAAAAogUAIA_nAwAApwYAMOgDAAClBQAQ6QMAAKcGADDqAwEAqAYAIYUEQACuBgAhkwQAAKkGkwQilAQBAKgGACGVBAEAqAYAIZYEAACqBgAglwQgAKsGACGYBEAArAYAIZkEAgCtBgAhmgQCAK0GACGbBEAArAYAIZwEQACsBgAhA5gEAADkBwAgmwQAAOQHACCcBAAA5AcAIAMAAAClBQAgAgAApgUAMAMAAKIFACADAAAApQUAIAIAAKYFADADAACiBQAgAwAAAKUFACACAACmBQAwAwAAogUAIAzqAwEAAAABhQRAAAAAAZMEAAAAkwQClAQBAAAAAZUEAQAAAAGWBIAAAAABlwQgAAAAAZgEQAAAAAGZBAIAAAABmgQCAAAAAZsEQAAAAAGcBEAAAAABATQAAKoFACAM6gMBAAAAAYUEQAAAAAGTBAAAAJMEApQEAQAAAAGVBAEAAAABlgSAAAAAAZcEIAAAAAGYBEAAAAABmQQCAAAAAZoEAgAAAAGbBEAAAAABnARAAAAAAQE0AACsBQAwATQAAKwFADAM6gMBAOgHACGFBEAA6wcAIZMEAACBCJMEIpQEAQDoBwAhlQQBAOgHACGWBIAAAAABlwQgAOoHACGYBEAA7AcAIZkEAgCCCAAhmgQCAIIIACGbBEAA7AcAIZwEQADsBwAhAgAAAKIFACA0AACvBQAgDOoDAQDoBwAhhQRAAOsHACGTBAAAgQiTBCKUBAEA6AcAIZUEAQDoBwAhlgSAAAAAAZcEIADqBwAhmARAAOwHACGZBAIAgggAIZoEAgCCCAAhmwRAAOwHACGcBEAA7AcAIQIAAAClBQAgNAAAsQUAIAIAAAClBQAgNAAAsQUAIAMAAACiBQAgOwAAqgUAIDwAAK8FACABAAAAogUAIAEAAAClBQAgCA0AAPwHACBBAAD_BwAgQgAA_gcAIKMBAAD9BwAgpAEAAIAIACCYBAAA5AcAIJsEAADkBwAgnAQAAOQHACAP5wMAAJ4GADDoAwAAuAUAEOkDAACeBgAw6gMBAIAGACGFBEAAgwYAIZMEAACfBpMEIpQEAQCABgAhlQQBAIAGACGWBAAAoAYAIJcEIACCBgAhmARAAIQGACGZBAIAoQYAIZoEAgChBgAhmwRAAIQGACGcBEAAhAYAIQMAAAClBQAgAgAAtwUAMEAAALgFACADAAAApQUAIAIAAKYFADADAACiBQAgAQAAAH4AIAEAAAB-ACADAAAAfAAgAgAAfQAwAwAAfgAgAwAAAHwAIAIAAH0AMAMAAH4AIAMAAAB8ACACAAB9ADADAAB-ACAKIgAA-wcAIOoDAQAAAAHrAwEAAAABggSAAAAAAYUEQAAAAAGMBAEAAAABjQQBAAAAAY8EAAAAjwQCkAQgAAAAAZEEQAAAAAEBNAAAwAUAIAnqAwEAAAAB6wMBAAAAAYIEgAAAAAGFBEAAAAABjAQBAAAAAY0EAQAAAAGPBAAAAI8EApAEIAAAAAGRBEAAAAABATQAAMIFADABNAAAwgUAMAoiAAD6BwAg6gMBAOgHACHrAwEA6AcAIYIEgAAAAAGFBEAA6wcAIYwEAQDoBwAhjQQBAOgHACGPBAAA-QePBCKQBCAA6gcAIZEEQADrBwAhAgAAAH4AIDQAAMUFACAJ6gMBAOgHACHrAwEA6AcAIYIEgAAAAAGFBEAA6wcAIYwEAQDoBwAhjQQBAOgHACGPBAAA-QePBCKQBCAA6gcAIZEEQADrBwAhAgAAAHwAIDQAAMcFACACAAAAfAAgNAAAxwUAIAMAAAB-ACA7AADABQAgPAAAxQUAIAEAAAB-ACABAAAAfAAgBA0AAPYHACBBAAD4BwAgQgAA9wcAIIIEAADkBwAgDOcDAACaBgAw6AMAAM4FABDpAwAAmgYAMOoDAQCABgAh6wMBAIAGACGCBAAAlAYAIIUEQACDBgAhjAQBAIAGACGNBAEAgAYAIY8EAACbBo8EIpAEIACCBgAhkQRAAIMGACEDAAAAfAAgAgAAzQUAMEAAAM4FACADAAAAfAAgAgAAfQAwAwAAfgAgAQAAAIIBACABAAAAggEAIAMAAACAAQAgAgAAgQEAMAMAAIIBACADAAAAgAEAIAIAAIEBADADAACCAQAgAwAAAIABACACAACBAQAwAwAAggEAIAwiAAD1BwAg6gMBAAAAAesDAQAAAAH9AwAAAP0DAv4DAQAAAAH_AwEAAAABgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABATQAANYFACAL6gMBAAAAAesDAQAAAAH9AwAAAP0DAv4DAQAAAAH_AwEAAAABgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABATQAANgFADABNAAA2AUAMAEAAAAbACAMIgAA9AcAIOoDAQDoBwAh6wMBAPMHACH9AwAA8gf9AyL-AwEA6AcAIf8DAQDzBwAhgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhAgAAAIIBACA0AADcBQAgC-oDAQDoBwAh6wMBAPMHACH9AwAA8gf9AyL-AwEA6AcAIf8DAQDzBwAhgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhAgAAAIABACA0AADeBQAgAgAAAIABACA0AADeBQAgAQAAABsAIAMAAACCAQAgOwAA1gUAIDwAANwFACABAAAAggEAIAEAAACAAQAgCg0AAO8HACBBAADxBwAgQgAA8AcAIOsDAADkBwAg_wMAAOQHACCABAAA5AcAIIEEAADkBwAgggQAAOQHACCDBAAA5AcAIIQEAADkBwAgDucDAACRBgAw6AMAAOYFABDpAwAAkQYAMOoDAQCABgAh6wMBAJIGACH9AwAAkwb9AyL-AwEAgAYAIf8DAQCSBgAhgAQAAJQGACCBBAAAlAYAIIIEAACUBgAggwQBAJIGACGEBAEAkgYAIYUEQACDBgAhAwAAAIABACACAADlBQAwQAAA5gUAIAMAAACAAQAgAgAAgQEAMAMAAIIBACABAAAAcAAgAQAAAHAAIAMAAABuACACAABvADADAABwACADAAAAbgAgAgAAbwAwAwAAcAAgAwAAAG4AIAIAAG8AMAMAAHAAIAciAADuBwAg6gMBAAAAAesDAQAAAAHtAwAAAO0DAu4DIAAAAAHvA0AAAAAB8ANAAAAAAQE0AADuBQAgBuoDAQAAAAHrAwEAAAAB7QMAAADtAwLuAyAAAAAB7wNAAAAAAfADQAAAAAEBNAAA8AUAMAE0AADwBQAwByIAAO0HACDqAwEA6AcAIesDAQDoBwAh7QMAAOkH7QMi7gMgAOoHACHvA0AA6wcAIfADQADsBwAhAgAAAHAAIDQAAPMFACAG6gMBAOgHACHrAwEA6AcAIe0DAADpB-0DIu4DIADqBwAh7wNAAOsHACHwA0AA7AcAIQIAAABuACA0AAD1BQAgAgAAAG4AIDQAAPUFACADAAAAcAAgOwAA7gUAIDwAAPMFACABAAAAcAAgAQAAAG4AIAQNAADlBwAgQQAA5wcAIEIAAOYHACDwAwAA5AcAIAnnAwAA_wUAMOgDAAD8BQAQ6QMAAP8FADDqAwEAgAYAIesDAQCABgAh7QMAAIEG7QMi7gMgAIIGACHvA0AAgwYAIfADQACEBgAhAwAAAG4AIAIAAPsFADBAAAD8BQAgAwAAAG4AIAIAAG8AMAMAAHAAIAnnAwAA_wUAMOgDAAD8BQAQ6QMAAP8FADDqAwEAgAYAIesDAQCABgAh7QMAAIEG7QMi7gMgAIIGACHvA0AAgwYAIfADQACEBgAhDg0AAIkGACBBAACQBgAgQgAAkAYAIPEDAQAAAAHyAwEAAAAE8wMBAAAABPQDAQAAAAH1AwEAAAAB9gMBAAAAAfcDAQAAAAH4AwEAjwYAIfkDAQAAAAH6AwEAAAAB-wMBAAAAAQcNAACJBgAgQQAAjgYAIEIAAI4GACDxAwAAAO0DAvIDAAAA7QMI8wMAAADtAwj4AwAAjQbtAyIFDQAAiQYAIEEAAIwGACBCAACMBgAg8QMgAAAAAfgDIACLBgAhCw0AAIkGACBBAACKBgAgQgAAigYAIPEDQAAAAAHyA0AAAAAE8wNAAAAABPQDQAAAAAH1A0AAAAAB9gNAAAAAAfcDQAAAAAH4A0AAiAYAIQsNAACGBgAgQQAAhwYAIEIAAIcGACDxA0AAAAAB8gNAAAAABfMDQAAAAAX0A0AAAAAB9QNAAAAAAfYDQAAAAAH3A0AAAAAB-ANAAIUGACELDQAAhgYAIEEAAIcGACBCAACHBgAg8QNAAAAAAfIDQAAAAAXzA0AAAAAF9ANAAAAAAfUDQAAAAAH2A0AAAAAB9wNAAAAAAfgDQACFBgAhCPEDAgAAAAHyAwIAAAAF8wMCAAAABfQDAgAAAAH1AwIAAAAB9gMCAAAAAfcDAgAAAAH4AwIAhgYAIQjxA0AAAAAB8gNAAAAABfMDQAAAAAX0A0AAAAAB9QNAAAAAAfYDQAAAAAH3A0AAAAAB-ANAAIcGACELDQAAiQYAIEEAAIoGACBCAACKBgAg8QNAAAAAAfIDQAAAAATzA0AAAAAE9ANAAAAAAfUDQAAAAAH2A0AAAAAB9wNAAAAAAfgDQACIBgAhCPEDAgAAAAHyAwIAAAAE8wMCAAAABPQDAgAAAAH1AwIAAAAB9gMCAAAAAfcDAgAAAAH4AwIAiQYAIQjxA0AAAAAB8gNAAAAABPMDQAAAAAT0A0AAAAAB9QNAAAAAAfYDQAAAAAH3A0AAAAAB-ANAAIoGACEFDQAAiQYAIEEAAIwGACBCAACMBgAg8QMgAAAAAfgDIACLBgAhAvEDIAAAAAH4AyAAjAYAIQcNAACJBgAgQQAAjgYAIEIAAI4GACDxAwAAAO0DAvIDAAAA7QMI8wMAAADtAwj4AwAAjQbtAyIE8QMAAADtAwLyAwAAAO0DCPMDAAAA7QMI-AMAAI4G7QMiDg0AAIkGACBBAACQBgAgQgAAkAYAIPEDAQAAAAHyAwEAAAAE8wMBAAAABPQDAQAAAAH1AwEAAAAB9gMBAAAAAfcDAQAAAAH4AwEAjwYAIfkDAQAAAAH6AwEAAAAB-wMBAAAAAQvxAwEAAAAB8gMBAAAABPMDAQAAAAT0AwEAAAAB9QMBAAAAAfYDAQAAAAH3AwEAAAAB-AMBAJAGACH5AwEAAAAB-gMBAAAAAfsDAQAAAAEO5wMAAJEGADDoAwAA5gUAEOkDAACRBgAw6gMBAIAGACHrAwEAkgYAIf0DAACTBv0DIv4DAQCABgAh_wMBAJIGACGABAAAlAYAIIEEAACUBgAgggQAAJQGACCDBAEAkgYAIYQEAQCSBgAhhQRAAIMGACEODQAAhgYAIEEAAJkGACBCAACZBgAg8QMBAAAAAfIDAQAAAAXzAwEAAAAF9AMBAAAAAfUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDAQCYBgAh-QMBAAAAAfoDAQAAAAH7AwEAAAABBw0AAIkGACBBAACXBgAgQgAAlwYAIPEDAAAA_QMC8gMAAAD9AwjzAwAAAP0DCPgDAACWBv0DIg8NAACGBgAgQQAAlQYAIEIAAJUGACDxA4AAAAAB9AOAAAAAAfUDgAAAAAH2A4AAAAAB9wOAAAAAAfgDgAAAAAGGBAEAAAABhwQBAAAAAYgEAQAAAAGJBIAAAAABigSAAAAAAYsEgAAAAAEM8QOAAAAAAfQDgAAAAAH1A4AAAAAB9gOAAAAAAfcDgAAAAAH4A4AAAAABhgQBAAAAAYcEAQAAAAGIBAEAAAABiQSAAAAAAYoEgAAAAAGLBIAAAAABBw0AAIkGACBBAACXBgAgQgAAlwYAIPEDAAAA_QMC8gMAAAD9AwjzAwAAAP0DCPgDAACWBv0DIgTxAwAAAP0DAvIDAAAA_QMI8wMAAAD9Awj4AwAAlwb9AyIODQAAhgYAIEEAAJkGACBCAACZBgAg8QMBAAAAAfIDAQAAAAXzAwEAAAAF9AMBAAAAAfUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDAQCYBgAh-QMBAAAAAfoDAQAAAAH7AwEAAAABC_EDAQAAAAHyAwEAAAAF8wMBAAAABfQDAQAAAAH1AwEAAAAB9gMBAAAAAfcDAQAAAAH4AwEAmQYAIfkDAQAAAAH6AwEAAAAB-wMBAAAAAQznAwAAmgYAMOgDAADOBQAQ6QMAAJoGADDqAwEAgAYAIesDAQCABgAhggQAAJQGACCFBEAAgwYAIYwEAQCABgAhjQQBAIAGACGPBAAAmwaPBCKQBCAAggYAIZEEQACDBgAhBw0AAIkGACBBAACdBgAgQgAAnQYAIPEDAAAAjwQC8gMAAACPBAjzAwAAAI8ECPgDAACcBo8EIgcNAACJBgAgQQAAnQYAIEIAAJ0GACDxAwAAAI8EAvIDAAAAjwQI8wMAAACPBAj4AwAAnAaPBCIE8QMAAACPBALyAwAAAI8ECPMDAAAAjwQI-AMAAJ0GjwQiD-cDAACeBgAw6AMAALgFABDpAwAAngYAMOoDAQCABgAhhQRAAIMGACGTBAAAnwaTBCKUBAEAgAYAIZUEAQCABgAhlgQAAKAGACCXBCAAggYAIZgEQACEBgAhmQQCAKEGACGaBAIAoQYAIZsEQACEBgAhnARAAIQGACEHDQAAiQYAIEEAAKYGACBCAACmBgAg8QMAAACTBALyAwAAAJMECPMDAAAAkwQI-AMAAKUGkwQiDw0AAIkGACBBAACkBgAgQgAApAYAIPEDgAAAAAH0A4AAAAAB9QOAAAAAAfYDgAAAAAH3A4AAAAAB-AOAAAAAAYYEAQAAAAGHBAEAAAABiAQBAAAAAYkEgAAAAAGKBIAAAAABiwSAAAAAAQ0NAACJBgAgQQAAiQYAIEIAAIkGACCjAQAAowYAIKQBAACJBgAg8QMCAAAAAfIDAgAAAATzAwIAAAAE9AMCAAAAAfUDAgAAAAH2AwIAAAAB9wMCAAAAAfgDAgCiBgAhDQ0AAIkGACBBAACJBgAgQgAAiQYAIKMBAACjBgAgpAEAAIkGACDxAwIAAAAB8gMCAAAABPMDAgAAAAT0AwIAAAAB9QMCAAAAAfYDAgAAAAH3AwIAAAAB-AMCAKIGACEI8QMIAAAAAfIDCAAAAATzAwgAAAAE9AMIAAAAAfUDCAAAAAH2AwgAAAAB9wMIAAAAAfgDCACjBgAhDPEDgAAAAAH0A4AAAAAB9QOAAAAAAfYDgAAAAAH3A4AAAAAB-AOAAAAAAYYEAQAAAAGHBAEAAAABiAQBAAAAAYkEgAAAAAGKBIAAAAABiwSAAAAAAQcNAACJBgAgQQAApgYAIEIAAKYGACDxAwAAAJMEAvIDAAAAkwQI8wMAAACTBAj4AwAApQaTBCIE8QMAAACTBALyAwAAAJMECPMDAAAAkwQI-AMAAKYGkwQiD-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_QYAICAAAIAHACAhAACBBwAgIwAAggcAICQAAMIGACDnAwAA_wYAMOgDAAADABDpAwAA_wYAMOoDAQCoBgAhhQRAAK4GACGRBEAArgYAIe4EAQCoBgAh7wQBAOsGACH3BEAArAYAIZAFAQCoBgAhkQUBAOsGACGSBQEA6wYAIZMFAQDrBgAhlAUgAKsGACGVBQEAqAYAIboFAAADACC7BQAAAwAgA7IEAABXACCzBAAAVwAgtAQAAFcAIAjnAwAAwwYAMOgDAADtBAAQ6QMAAMMGADDqAwEAgAYAIYIEAACUBgAglQQAAMQGtwQitQQBAIAGACG3BEAAgwYAIQcNAACJBgAgQQAAxgYAIEIAAMYGACDxAwAAALcEAvIDAAAAtwQI8wMAAAC3BAj4AwAAxQa3BCIHDQAAiQYAIEEAAMYGACBCAADGBgAg8QMAAAC3BALyAwAAALcECPMDAAAAtwQI-AMAAMUGtwQiBPEDAAAAtwQC8gMAAAC3BAjzAwAAALcECPgDAADGBrcEIg7nAwAAxwYAMOgDAADXBAAQ6QMAAMcGADDqAwEAgAYAIYUEQACDBgAhkQRAAIMGACGhBAAAyQa9BCK1BAEAgAYAIbgEAQCABgAhuQQCAKEGACG6BAIAoQYAIbsECADIBgAhvQQCAMoGACG-BEAAhAYAIQ0NAACJBgAgQQAAowYAIEIAAKMGACCjAQAAowYAIKQBAACjBgAg8QMIAAAAAfIDCAAAAATzAwgAAAAE9AMIAAAAAfUDCAAAAAH2AwgAAAAB9wMIAAAAAfgDCADPBgAhBw0AAIkGACBBAADOBgAgQgAAzgYAIPEDAAAAvQQC8gMAAAC9BAjzAwAAAL0ECPgDAADNBr0EIg0NAACGBgAgQQAAhgYAIEIAAIYGACCjAQAAzAYAIKQBAACGBgAg8QMCAAAAAfIDAgAAAAXzAwIAAAAF9AMCAAAAAfUDAgAAAAH2AwIAAAAB9wMCAAAAAfgDAgDLBgAhDQ0AAIYGACBBAACGBgAgQgAAhgYAIKMBAADMBgAgpAEAAIYGACDxAwIAAAAB8gMCAAAABfMDAgAAAAX0AwIAAAAB9QMCAAAAAfYDAgAAAAH3AwIAAAAB-AMCAMsGACEI8QMIAAAAAfIDCAAAAAXzAwgAAAAF9AMIAAAAAfUDCAAAAAH2AwgAAAAB9wMIAAAAAfgDCADMBgAhBw0AAIkGACBBAADOBgAgQgAAzgYAIPEDAAAAvQQC8gMAAAC9BAjzAwAAAL0ECPgDAADNBr0EIgTxAwAAAL0EAvIDAAAAvQQI8wMAAAC9BAj4AwAAzga9BCINDQAAiQYAIEEAAKMGACBCAACjBgAgowEAAKMGACCkAQAAowYAIPEDCAAAAAHyAwgAAAAE8wMIAAAABPQDCAAAAAH1AwgAAAAB9gMIAAAAAfcDCAAAAAH4AwgAzwYAIQ7nAwAA0AYAMOgDAADBBAAQ6QMAANAGADDqAwEAgAYAIYUEQACDBgAhvwQBAIAGACHABAEAgAYAIcEEIACCBgAhwgQBAJIGACHDBAEAkgYAIcQEAgDKBgAhxQQCAMoGACHGBAIAoQYAIccEAQCSBgAhD-cDAADRBgAw6AMAAKsEABDpAwAA0QYAMOoDAQCABgAhggQAAJQGACCFBEAAgwYAIZEEQACDBgAhoQQAANIGzQQivgRAAIQGACG_BAEAgAYAIcgEAQCSBgAhyQQCAKEGACHKBAIAoQYAIcsEAQCSBgAhzQQgAIIGACEHDQAAiQYAIEEAANQGACBCAADUBgAg8QMAAADNBALyAwAAAM0ECPMDAAAAzQQI-AMAANMGzQQiBw0AAIkGACBBAADUBgAgQgAA1AYAIPEDAAAAzQQC8gMAAADNBAjzAwAAAM0ECPgDAADTBs0EIgTxAwAAAM0EAvIDAAAAzQQI8wMAAADNBAj4AwAA1AbNBCIH5wMAANUGADDoAwAAkwQAEOkDAADVBgAw6gMBAIAGACGFBEAAgwYAIb8EAQCABgAhzgQBAIAGACEN5wMAANYGADDoAwAA_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_QQiugQCAKEGACHuBAEAgAYAIe8EAQCSBgAh9QQBAIAGACH3BEAAhAYAIfgEAQCSBgAh-QQCAKEGACH6BAIAoQYAIfsEAgChBgAh_QRAAIQGACH-BEAAhAYAIf8EQACEBgAhgAUgAIIGACGBBSAAggYAIYIFIACCBgAhgwUCAKEGACGEBSAAggYAIYUFAQCSBgAhBw0AAIkGACBBAAD4BgAgQgAA-AYAIPEDAAAA_QQC8gMAAAD9BAjzAwAAAP0ECPgDAAD3Bv0EIgcNAACJBgAgQQAA-AYAIEIAAPgGACDxAwAAAP0EAvIDAAAA_QQI8wMAAAD9BAj4AwAA9wb9BCIE8QMAAAD9BALyAwAAAP0ECPMDAAAA_QQI-AMAAPgG_QQiEucDAAD5BgAw6AMAAK8CABDpAwAA-QYAMOoDAQCABgAh6wMBAIAGACGFBEAAgwYAIZEEQACDBgAh9wRAAIQGACGGBQEAkgYAIYcFAQCSBgAhiAUBAJIGACGJBQEAkgYAIYoFAQCSBgAhiwUBAJIGACGMBQEAkgYAIY0FAQCSBgAhjgUAAJQGACCPBQIAygYAIRMiAAD9BgAg5wMAAPoGADDoAwAAcgAQ6QMAAPoGADDqAwEAqAYAIesDAQCoBgAhhQRAAK4GACGRBEAArgYAIfcEQACsBgAhhgUBAOsGACGHBQEA6wYAIYgFAQDrBgAhiQUBAOsGACGKBQEA6wYAIYsFAQDrBgAhjAUBAOsGACGNBQEA6wYAIY4FAAD7BgAgjwUCAPwGACEM8QOAAAAAAfQDgAAAAAH1A4AAAAAB9gOAAAAAAfcDgAAAAAH4A4AAAAABhgQBAAAAAYcEAQAAAAGIBAEAAAABiQSAAAAAAYoEgAAAAAGLBIAAAAABCPEDAgAAAAHyAwIAAAAF8wMCAAAABfQDAgAAAAH1AwIAAAAB9gMCAAAAAfcDAgAAAAH4AwIAhgYAISEGAAClBwAgDAAAtgcAIB8AANIHACAkAADCBgAgJQAAzQcAICYAAM4HACAnAADPBwAgKAAA0AcAICkAANEHACAqAACABwAgKwAAgQcAICwAANMHACAtAADUBwAgLgAA1QcAIOcDAADJBwAw6AMAABsAEOkDAADJBwAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhkwQAAMwHqwUioQQAAMsHqgUi3QQBAKgGACH3BEAArAYAIYgFAQDrBgAhkAUBAKgGACGmBQEA6wYAIagFAADKB6gFIqsFIACrBgAhrAUgAKsGACGtBUAArAYAIboFAAAbACC7BQAAGwAgD-cDAAD-BgAw6AMAAJcCABDpAwAA_gYAMOoDAQCABgAhhQRAAIMGACGRBEAAgwYAIe4EAQCABgAh7wQBAJIGACH3BEAAhAYAIZAFAQCABgAhkQUBAJIGACGSBQEAkgYAIZMFAQCSBgAhlAUgAIIGACGVBQEAgAYAIRQBAAD9BgAgIAAAgAcAICEAAIEHACAjAACCBwAgJAAAwgYAIOcDAAD_BgAw6AMAAAMAEOkDAAD_BgAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAh7gQBAKgGACHvBAEA6wYAIfcEQACsBgAhkAUBAKgGACGRBQEA6wYAIZIFAQDrBgAhkwUBAOsGACGUBSAAqwYAIZUFAQCoBgAhA7IEAAAFACCzBAAABQAgtAQAAAUAIAOyBAAAUQAgswQAAFEAILQEAABRACATBgAAwQYAICQAAMIGACDnAwAAvgYAMOgDAABVABDpAwAAvgYAMOoDAQCoBgAhhQRAAK4GACGRBEAArgYAIZ4EAQCoBgAhoQQAAMAGrAQiqgQAAL8GqgQirAQBAOsGACGtBAEA6wYAIa4EQACsBgAhrwRAAKwGACGwBCAAqwYAIbEEQACsBgAhugUAAFUAILsFAABVACAJ5wMAAIMHADDoAwAA_wEAEOkDAACDBwAw6gMBAIAGACGFBEAAgwYAIZEEQACDBgAh2gRAAIMGACGWBQEAgAYAIZcFAQCABgAhCecDAACEBwAw6AMAAOwBABDpAwAAhAcAMOoDAQCoBgAhhQRAAK4GACGRBEAArgYAIdoEQACuBgAhlgUBAKgGACGXBQEAqAYAIQKWBQEAAAABlwUBAAAAAQvnAwAAhgcAMOgDAADmAQAQ6QMAAIYHADDqAwEAgAYAIesDAQCABgAhgwQBAJIGACGEBAEAkgYAIYUEQACDBgAhkQRAAIMGACHaBEAAgwYAIZkFAQCABgAhB-cDAACHBwAw6AMAANABABDpAwAAhwcAMOoDAQCABgAh6wMBAIAGACGaBQEAgAYAIZsFAQCSBgAhEecDAACIBwAw6AMAALoBABDpAwAAiAcAMOoDAQCABgAh6wMBAIAGACGFBEAAgwYAIZEEQACDBgAhnAUBAIAGACGdBQEAgAYAIZ4FAQCABgAhnwUBAJIGACGgBQEAkgYAIaEFAQCSBgAhogUBAJIGACGjBUAAhAYAIaQFQACEBgAhpQUBAJIGACER5wMAAIkHADDoAwAApAEAEOkDAACJBwAw6gMBAIAGACGFBEAAgwYAIZEEQACDBgAhkwQAAIwHqwUioQQAAIsHqgUi3QQBAIAGACH3BEAAhAYAIYgFAQCSBgAhkAUBAIAGACGmBQEAkgYAIagFAACKB6gFIqsFIACCBgAhrAUgAIIGACGtBUAAhAYAIQcNAACJBgAgQQAAkgcAIEIAAJIHACDxAwAAAKgFAvIDAAAAqAUI8wMAAACoBQj4AwAAkQeoBSIHDQAAiQYAIEEAAJAHACBCAACQBwAg8QMAAACqBQLyAwAAAKoFCPMDAAAAqgUI-AMAAI8HqgUiBw0AAIkGACBBAACOBwAgQgAAjgcAIPEDAAAAqwUC8gMAAACrBQjzAwAAAKsFCPgDAACNB6sFIgcNAACJBgAgQQAAjgcAIEIAAI4HACDxAwAAAKsFAvIDAAAAqwUI8wMAAACrBQj4AwAAjQerBSIE8QMAAACrBQLyAwAAAKsFCPMDAAAAqwUI-AMAAI4HqwUiBw0AAIkGACBBAACQBwAgQgAAkAcAIPEDAAAAqgUC8gMAAACqBQjzAwAAAKoFCPgDAACPB6oFIgTxAwAAAKoFAvIDAAAAqgUI8wMAAACqBQj4AwAAkAeqBSIHDQAAiQYAIEEAAJIHACBCAACSBwAg8QMAAACoBQLyAwAAAKgFCPMDAAAAqAUI-AMAAJEHqAUiBPEDAAAAqAUC8gMAAACoBQjzAwAAAKgFCPgDAACSB6gFIg8iAACVBwAg5wMAAJMHADDoAwAAgAEAEOkDAACTBwAw6gMBAKgGACHrAwEA6wYAIf0DAACUB_0DIv4DAQCoBgAh_wMBAOsGACGABAAA-wYAIIEEAAD7BgAgggQAAPsGACCDBAEA6wYAIYQEAQDrBgAhhQRAAK4GACEE8QMAAAD9AwLyAwAAAP0DCPMDAAAA_QMI-AMAAJcG_QMiIQYAAKUHACAMAAC2BwAgHwAA0gcAICQAAMIGACAlAADNBwAgJgAAzgcAICcAAM8HACAoAADQBwAgKQAA0QcAICoAAIAHACArAACBBwAgLAAA0wcAIC0AANQHACAuAADVBwAg5wMAAMkHADDoAwAAGwAQ6QMAAMkHADDqAwEAqAYAIYUEQACuBgAhkQRAAK4GACGTBAAAzAerBSKhBAAAyweqBSLdBAEAqAYAIfcEQACsBgAhiAUBAOsGACGQBQEAqAYAIaYFAQDrBgAhqAUAAMoHqAUiqwUgAKsGACGsBSAAqwYAIa0FQACsBgAhugUAABsAILsFAAAbACANIgAA_QYAIOcDAACWBwAw6AMAAHwAEOkDAACWBwAw6gMBAKgGACHrAwEAqAYAIYIEAAD7BgAghQRAAK4GACGMBAEAqAYAIY0EAQCoBgAhjwQAAJcHjwQikAQgAKsGACGRBEAArgYAIQTxAwAAAI8EAvIDAAAAjwQI8wMAAACPBAj4AwAAnQaPBCIRFAAAmgcAIBUAAJUHACDnAwAAmAcAMOgDAAAvABDpAwAAmAcAMOoDAQCoBgAhggQAAPsGACCFBEAArgYAIZEEQACuBgAhoQQAAJkHzQQivgRAAKwGACG_BAEAqAYAIcgEAQDrBgAhyQQCAK0GACHKBAIArQYAIcsEAQDrBgAhzQQgAKsGACEE8QMAAADNBALyAwAAAM0ECPMDAAAAzQQI-AMAANQGzQQiFAkAAOwGACAQAACxBwAgEwAAwQcAIBYAAMIHACAZAAC4BwAg5wMAAL8HADDoAwAAIgAQ6QMAAL8HADDqAwEAqAYAIYUEQACuBgAhkQRAAK4GACGhBAAAwAfUBCK1BAEAqAYAIc8EAQCoBgAh0AQBAOsGACHRBAEA6wYAIdIEAQDrBgAh1ARAAKwGACG6BQAAIgAguwUAACIAIALrAwEAAAAB7QMAAADtAwIKIgAA_QYAIOcDAACcBwAw6AMAAG4AEOkDAACcBwAw6gMBAKgGACHrAwEAqAYAIe0DAACdB-0DIu4DIACrBgAh7wNAAK4GACHwA0AArAYAIQTxAwAAAO0DAvIDAAAA7QMI8wMAAADtAwj4AwAAjgbtAyIIIgAA_QYAIOcDAACeBwAw6AMAAGoAEOkDAACeBwAw6gMBAKgGACHrAwEAqAYAIZoFAQCoBgAhmwUBAOsGACEMIgAA_QYAIOcDAACfBwAw6AMAAGYAEOkDAACfBwAw6gMBAKgGACHrAwEAqAYAIYMEAQDrBgAhhAQBAOsGACGFBEAArgYAIZEEQACuBgAh2gRAAK4GACGZBQEAqAYAIQKcBQEAAAABngUBAAAAARIiAAD9BgAg5wMAAKEHADDoAwAAYgAQ6QMAAKEHADDqAwEAqAYAIesDAQCoBgAhhQRAAK4GACGRBEAArgYAIZwFAQCoBgAhnQUBAKgGACGeBQEAqAYAIZ8FAQDrBgAhoAUBAOsGACGhBQEA6wYAIaIFAQDrBgAhowVAAKwGACGkBUAArAYAIaUFAQDrBgAhFgYAAKUHACAiAAD9BgAgIwAAggcAIOcDAACiBwAw6AMAAFcAEOkDAACiBwAw6gMBAKgGACHrAwEAqAYAIYIEAAD7BgAghQRAAK4GACGRBEAArgYAIZMEAACpBpMEIp4EAQDrBgAhnwQBAOsGACGhBAAAowehBCKiBAQApAcAIaMEAQCoBgAhpAQBAOsGACGlBAEA6wYAIaYEAQDrBgAhpwRAAKwGACGoBEAArAYAIQTxAwAAAKEEAvIDAAAAoQQI8wMAAAChBAj4AwAAtgahBCII8QMEAAAAAfIDBAAAAATzAwQAAAAE9AMEAAAAAfUDBAAAAAH2AwQAAAAB9wMEAAAAAfgDBAC0BgAhFgEAAP0GACAgAACABwAgIQAAgQcAICMAAIIHACAkAADCBgAg5wMAAP8GADDoAwAAAwAQ6QMAAP8GADDqAwEAqAYAIYUEQACuBgAhkQRAAK4GACHuBAEAqAYAIe8EAQDrBgAh9wRAAKwGACGQBQEAqAYAIZEFAQDrBgAhkgUBAOsGACGTBQEA6wYAIZQFIACrBgAhlQUBAKgGACG6BQAAAwAguwUAAAMAIAKeBAEAAAAB7gQBAAAAARcGAADBBgAgBwAA_QYAIAoAAKoHACAPAACtBwAgHQAAqwcAIB4AAKwHACDnAwAApwcAMOgDAABRABDpAwAApwcAMOoDAQCoBgAhhQRAAK4GACGMBAEAqAYAIY8EAACoB_EEIpEEQACuBgAhngQBAKgGACHuBAEAqAYAIe8EAQCoBgAh8gQAAKkH8gQi8wQCAK0GACH0BAIA_AYAIfUEAQCoBgAh9gQgAKsGACH3BEAArAYAIQTxAwAAAPEEAvIDAAAA8QQI8wMAAADxBAj4AwAA9AbxBCIE8QMAAADyBALyAwAAAPIECPMDAAAA8gQI-AMAAPIG8gQiCwkAAOwGACAcAADtBgAg5wMAAOkGADDoAwAADwAQ6QMAAOkGADDqAwEAqAYAIY8EAADqBu0EIs8EAQCoBgAh7QQBAOsGACG6BQAADwAguwUAAA8AIAOyBAAAPAAgswQAADwAILQEAAA8ACADsgQAAAsAILMEAAALACC0BAAACwAgA7IEAAAiACCzBAAAIgAgtAQAACIAIBAIAACyBwAgEAAAsQcAIOcDAACuBwAw6AMAACYAEOkDAACuBwAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhoQQAALAHvQQitQQBAKgGACG4BAEAqAYAIbkEAgCtBgAhugQCAK0GACG7BAgArwcAIb0EAgD8BgAhvgRAAKwGACEI8QMIAAAAAfIDCAAAAATzAwgAAAAE9AMIAAAAAfUDCAAAAAH2AwgAAAAB9wMIAAAAAfgDCACjBgAhBPEDAAAAvQQC8gMAAAC9BAjzAwAAAL0ECPgDAADOBr0EIhoIAACyBwAgCwAA_QYAIA4AAMYHACAPAACtBwAgEQAAxwcAIBIAAMgHACDnAwAAxAcAMOgDAAAdABDpAwAAxAcAMOoDAQCoBgAhgwQBAOsGACGEBAEA6wYAIYUEQACuBgAhkQRAAK4GACGhBAAAxQfZBCK4BAEAqAYAIdQEQACsBgAh1QQBAKgGACHWBAEA6wYAIdcEAgCtBgAh2QRAAKwGACHaBEAArgYAIdsEQACsBgAh3AQCAK0GACG6BQAAHQAguwUAAB0AICUEAADiBwAgBQAAgAcAIAYAAMEGACAHAAD9BgAgDAAAtgcAIBcAAOMHACAeAACsBwAgHwAA0gcAIOcDAADgBwAw6AMAAAUAEOkDAADgBwAw6gMBAKgGACGFBEAArgYAIYwEAQCoBgAhkQRAAK4GACGeBAEAqAYAIaEEAADhB_0EIroEAgCtBgAh7gQBAKgGACHvBAEA6wYAIfUEAQCoBgAh9wRAAKwGACH4BAEA6wYAIfkEAgCtBgAh-gQCAK0GACH7BAIArQYAIf0EQACsBgAh_gRAAKwGACH_BEAArAYAIYAFIACrBgAhgQUgAKsGACGCBSAAqwYAIYMFAgCtBgAhhAUgAKsGACGFBQEA6wYAIboFAAAFACC7BQAABQAgArgEAQAAAAHdBAEAAAABEAgAALIHACALAACVBwAgDAAAtgcAIOcDAAC0BwAw6AMAABkAEOkDAAC0BwAw6gMBAKgGACGhBAAAtQffBCK4BAEAqAYAIdUEAQDrBgAh2gRAAKwGACHdBAEAqAYAId8EAQCoBgAh4ARAAK4GACHhBEAArAYAIeIEQACsBgAhBPEDAAAA3wQC8gMAAADfBAjzAwAAAN8ECPgDAADhBt8EIgOyBAAAHQAgswQAAB0AILQEAAAdACAOCQAA7AYAIBcAALgHACDnAwAAtwcAMOgDAAA8ABDpAwAAtwcAMOoDAQCoBgAhhQRAAK4GACHDBAEAqAYAIcYEAgCtBgAhzwQBAKgGACHlBAEA6wYAIeYEIACrBgAh5wQCAPwGACHoBAIA_AYAIQOyBAAAMgAgswQAADIAILQEAAAyACACvwQBAAAAAcAEAQAAAAEQFAAAmgcAIBgAALsHACDnAwAAugcAMOgDAAAyABDpAwAAugcAMOoDAQCoBgAhhQRAAK4GACG_BAEAqAYAIcAEAQCoBgAhwQQgAKsGACHCBAEA6wYAIcMEAQDrBgAhxAQCAPwGACHFBAIA_AYAIcYEAgCtBgAhxwQBAOsGACEQCQAA7AYAIBcAALgHACDnAwAAtwcAMOgDAAA8ABDpAwAAtwcAMOoDAQCoBgAhhQRAAK4GACHDBAEAqAYAIcYEAgCtBgAhzwQBAKgGACHlBAEA6wYAIeYEIACrBgAh5wQCAPwGACHoBAIA_AYAIboFAAA8ACC7BQAAPAAgCRAAALEHACDnAwAAvAcAMOgDAAAoABDpAwAAvAcAMOoDAQCoBgAhggQAAPsGACCVBAAAvQe3BCK1BAEAqAYAIbcEQACuBgAhBPEDAAAAtwQC8gMAAAC3BAjzAwAAALcECPgDAADGBrcEIgK1BAEAAAABzwQBAAAAARIJAADsBgAgEAAAsQcAIBMAAMEHACAWAADCBwAgGQAAuAcAIOcDAAC_BwAw6AMAACIAEOkDAAC_BwAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhoQQAAMAH1AQitQQBAKgGACHPBAEAqAYAIdAEAQDrBgAh0QQBAOsGACHSBAEA6wYAIdQEQACsBgAhBPEDAAAA1AQC8gMAAADUBAjzAwAAANQECPgDAADZBtQEIgOyBAAAFQAgswQAABUAILQEAAAVACATFAAAmgcAIBUAAJUHACDnAwAAmAcAMOgDAAAvABDpAwAAmAcAMOoDAQCoBgAhggQAAPsGACCFBEAArgYAIZEEQACuBgAhoQQAAJkHzQQivgRAAKwGACG_BAEAqAYAIcgEAQDrBgAhyQQCAK0GACHKBAIArQYAIcsEAQDrBgAhzQQgAKsGACG6BQAALwAguwUAAC8AIAO4BAEAAAAB1QQBAAAAAdcEAgAAAAEYCAAAsgcAIAsAAP0GACAOAADGBwAgDwAArQcAIBEAAMcHACASAADIBwAg5wMAAMQHADDoAwAAHQAQ6QMAAMQHADDqAwEAqAYAIYMEAQDrBgAhhAQBAOsGACGFBEAArgYAIZEEQACuBgAhoQQAAMUH2QQiuAQBAKgGACHUBEAArAYAIdUEAQCoBgAh1gQBAOsGACHXBAIArQYAIdkEQACsBgAh2gRAAK4GACHbBEAArAYAIdwEAgCtBgAhBPEDAAAA2QQC8gMAAADZBAjzAwAAANkECPgDAADdBtkEIhIIAACyBwAgCwAAlQcAIAwAALYHACDnAwAAtAcAMOgDAAAZABDpAwAAtAcAMOoDAQCoBgAhoQQAALUH3wQiuAQBAKgGACHVBAEA6wYAIdoEQACsBgAh3QQBAKgGACHfBAEAqAYAIeAEQACuBgAh4QRAAKwGACHiBEAArAYAIboFAAAZACC7BQAAGQAgEggAALIHACAQAACxBwAg5wMAAK4HADDoAwAAJgAQ6QMAAK4HADDqAwEAqAYAIYUEQACuBgAhkQRAAK4GACGhBAAAsAe9BCK1BAEAqAYAIbgEAQCoBgAhuQQCAK0GACG6BAIArQYAIbsECACvBwAhvQQCAPwGACG-BEAArAYAIboFAAAmACC7BQAAJgAgA7IEAAAoACCzBAAAKAAgtAQAACgAIB8GAAClBwAgDAAAtgcAIB8AANIHACAkAADCBgAgJQAAzQcAICYAAM4HACAnAADPBwAgKAAA0AcAICkAANEHACAqAACABwAgKwAAgQcAICwAANMHACAtAADUBwAgLgAA1QcAIOcDAADJBwAw6AMAABsAEOkDAADJBwAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhkwQAAMwHqwUioQQAAMsHqgUi3QQBAKgGACH3BEAArAYAIYgFAQDrBgAhkAUBAKgGACGmBQEA6wYAIagFAADKB6gFIqsFIACrBgAhrAUgAKsGACGtBUAArAYAIQTxAwAAAKgFAvIDAAAAqAUI8wMAAACoBQj4AwAAkgeoBSIE8QMAAACqBQLyAwAAAKoFCPMDAAAAqgUI-AMAAJAHqgUiBPEDAAAAqwUC8gMAAACrBQjzAwAAAKsFCPgDAACOB6sFIgOyBAAAYgAgswQAAGIAILQEAABiACADsgQAAGYAILMEAABmACC0BAAAZgAgA7IEAABqACCzBAAAagAgtAQAAGoAIAOyBAAAbgAgswQAAG4AILQEAABuACAVIgAA_QYAIOcDAAD6BgAw6AMAAHIAEOkDAAD6BgAw6gMBAKgGACHrAwEAqAYAIYUEQACuBgAhkQRAAK4GACH3BEAArAYAIYYFAQDrBgAhhwUBAOsGACGIBQEA6wYAIYkFAQDrBgAhigUBAOsGACGLBQEA6wYAIYwFAQDrBgAhjQUBAOsGACGOBQAA-wYAII8FAgD8BgAhugUAAHIAILsFAAByACADsgQAABkAILMEAAAZACC0BAAAGQAgA7IEAAAvACCzBAAALwAgtAQAAC8AIAOyBAAAfAAgswQAAHwAILQEAAB8ACADsgQAAIABACCzBAAAgAEAILQEAACAAQAgAr8EAQAAAAHOBAEAAAABCRQAAJoHACAaAADYBwAg5wMAANcHADDoAwAAFQAQ6QMAANcHADDqAwEAqAYAIYUEQACuBgAhvwQBAKgGACHOBAEAqAYAIQwKAADbBwAgGwAAwQcAIOcDAADaBwAw6AMAABEAEOkDAADaBwAw6gMBAKgGACHjBAIArQYAIekEAQCoBgAh6gQBAKgGACHrBCAAqwYAIboFAAARACC7BQAAEQAgAuMEAgAAAAHpBAEAAAABCgoAANsHACAbAADBBwAg5wMAANoHADDoAwAAEQAQ6QMAANoHADDqAwEAqAYAIeMEAgCtBgAh6QQBAKgGACHqBAEAqAYAIesEIACrBgAhCwkAAOwGACAcAADtBgAg5wMAAOkGADDoAwAADwAQ6QMAAOkGADDqAwEAqAYAIY8EAADqBu0EIs8EAQCoBgAh7QQBAOsGACG6BQAADwAguwUAAA8AIAK4BAEAAAABzwQBAAAAAQK4BAEAAAAB4wQCAAAAAQsIAACyBwAgCQAA7AYAIOcDAADeBwAw6AMAAAsAEOkDAADeBwAw6gMBAKgGACGFBEAArgYAIbgEAQCoBgAhzwQBAKgGACHjBAIArQYAIeQEAgCtBgAhA54EAQAAAAHuBAEAAAABgwUCAAAAASMEAADiBwAgBQAAgAcAIAYAAMEGACAHAAD9BgAgDAAAtgcAIBcAAOMHACAeAACsBwAgHwAA0gcAIOcDAADgBwAw6AMAAAUAEOkDAADgBwAw6gMBAKgGACGFBEAArgYAIYwEAQCoBgAhkQRAAK4GACGeBAEAqAYAIaEEAADhB_0EIroEAgCtBgAh7gQBAKgGACHvBAEA6wYAIfUEAQCoBgAh9wRAAKwGACH4BAEA6wYAIfkEAgCtBgAh-gQCAK0GACH7BAIArQYAIf0EQACsBgAh_gRAAKwGACH_BEAArAYAIYAFIACrBgAhgQUgAKsGACGCBSAAqwYAIYMFAgCtBgAhhAUgAKsGACGFBQEA6wYAIQTxAwAAAP0EAvIDAAAA_QQI8wMAAAD9BAj4AwAA-Ab9BCIlBAAA4gcAIAUAAIAHACAGAADBBgAgBwAA_QYAIAwAALYHACAXAADjBwAgHgAArAcAIB8AANIHACDnAwAA4AcAMOgDAAAFABDpAwAA4AcAMOoDAQCoBgAhhQRAAK4GACGMBAEAqAYAIZEEQACuBgAhngQBAKgGACGhBAAA4Qf9BCK6BAIArQYAIe4EAQCoBgAh7wQBAOsGACH1BAEAqAYAIfcEQACsBgAh-AQBAOsGACH5BAIArQYAIfoEAgCtBgAh-wQCAK0GACH9BEAArAYAIf4EQACsBgAh_wRAAKwGACGABSAAqwYAIYEFIACrBgAhggUgAKsGACGDBQIArQYAIYQFIACrBgAhhQUBAOsGACG6BQAABQAguwUAAAUAIAOyBAAAJgAgswQAACYAILQEAAAmACAAAAAAAb8FAQAAAAEBvwUAAADtAwIBvwUgAAAAAQG_BUAAAAABAb8FQAAAAAEFOwAA-A4AIDwAAPsOACC8BQAA-Q4AIL0FAAD6DgAgwgUAAAEAIAM7AAD4DgAgvAUAAPkOACDCBQAAAQAgAAAAAb8FAAAA_QMCAb8FAQAAAAEHOwAA8w4AIDwAAPYOACC8BQAA9A4AIL0FAAD1DgAgwAUAABsAIMEFAAAbACDCBQAAAQAgAzsAAPMOACC8BQAA9A4AIMIFAAABACAAAAABvwUAAACPBAIFOwAA7g4AIDwAAPEOACC8BQAA7w4AIL0FAADwDgAgwgUAAAEAIAM7AADuDgAgvAUAAO8OACDCBQAAAQAgAAAAAAABvwUAAACTBAIFvwUCAAAAAcUFAgAAAAHGBQIAAAABxwUCAAAAAcgFAgAAAAEAAAAAAAG_BQAAAKEEAgW_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_AYAIcUEAgD8BgAhxgQCAK0GACHHBAEA6wYAIbIFAAC5BwAgAgAAADQAIDQAAOYIACACAAAA5AgAIDQAAOUIACAO5wMAAOMIADDoAwAA5AgAEOkDAADjCAAw6gMBAKgGACGFBEAArgYAIb8EAQCoBgAhwAQBAKgGACHBBCAAqwYAIcIEAQDrBgAhwwQBAOsGACHEBAIA_AYAIcUEAgD8BgAhxgQCAK0GACHHBAEA6wYAIQ7nAwAA4wgAMOgDAADkCAAQ6QMAAOMIADDqAwEAqAYAIYUEQACuBgAhvwQBAKgGACHABAEAqAYAIcEEIACrBgAhwgQBAOsGACHDBAEA6wYAIcQEAgD8BgAhxQQCAPwGACHGBAIArQYAIccEAQDrBgAhCuoDAQDoBwAhhQRAAOsHACHABAEA6AcAIcEEIADqBwAhwgQBAPMHACHDBAEA8wcAIcQEAgC0CAAhxQQCALQIACHGBAIAgggAIccEAQDzBwAhCxgAAL8IACDqAwEA6AcAIYUEQADrBwAhwAQBAOgHACHBBCAA6gcAIcIEAQDzBwAhwwQBAPMHACHEBAIAtAgAIcUEAgC0CAAhxgQCAIIIACHHBAEA8wcAIQsYAADBCAAg6gMBAAAAAYUEQAAAAAHABAEAAAABwQQgAAAAAcIEAQAAAAHDBAEAAAABxAQCAAAAAcUEAgAAAAHGBAIAAAABxwQBAAAAAQwVAADLCAAg6gMBAAAAAYIEgAAAAAGFBEAAAAABkQRAAAAAAaEEAAAAzQQCvgRAAAAAAcgEAQAAAAHJBAIAAAABygQCAAAAAcsEAQAAAAHNBCAAAAABAgAAAHkAIDsAAOgIACADAAAALwAgOwAA6AgAIDwAAOwIACAOAAAALwAgFQAAyQgAIDQAAOwIACDqAwEA6AcAIYIEgAAAAAGFBEAA6wcAIZEEQADrBwAhoQQAAMcIzQQivgRAAOwHACHIBAEA8wcAIckEAgCCCAAhygQCAIIIACHLBAEA8wcAIc0EIADqBwAhDBUAAMkIACDqAwEA6AcAIYIEgAAAAAGFBEAA6wcAIZEEQADrBwAhoQQAAMcIzQQivgRAAOwHACHIBAEA8wcAIckEAgCCCAAhygQCAIIIACHLBAEA8wcAIc0EIADqBwAhBBoAANIIACDqAwEAAAABhQRAAAAAAc4EAQAAAAECAAAAFwAgOwAA-AgAIAMAAAAXACA7AAD4CAAgPAAA9wgAIAE0AACkDgAwChQAAJoHACAaAADYBwAg5wMAANcHADDoAwAAFQAQ6QMAANcHADDqAwEAAAABhQRAAK4GACG_BAEAqAYAIc4EAQCoBgAhtQUAANYHACACAAAAFwAgNAAA9wgAIAIAAAD1CAAgNAAA9ggAIAfnAwAA9AgAMOgDAAD1CAAQ6QMAAPQIADDqAwEAqAYAIYUEQACuBgAhvwQBAKgGACHOBAEAqAYAIQfnAwAA9AgAMOgDAAD1CAAQ6QMAAPQIADDqAwEAqAYAIYUEQACuBgAhvwQBAKgGACHOBAEAqAYAIQPqAwEA6AcAIYUEQADrBwAhzgQBAOgHACEEGgAA0AgAIOoDAQDoBwAhhQRAAOsHACHOBAEA6AcAIQQaAADSCAAg6gMBAAAAAYUEQAAAAAHOBAEAAAABAzsAAKIOACC8BQAAow4AIMIFAAAfACADOwAAoA4AILwFAAChDgAgwgUAAFMAIAQ7AADtCAAwvAUAAO4IADC-BQAA8AgAIMIFAADxCAAwAzsAAOgIACC8BQAA6QgAIMIFAAB5ACAEOwAA3AgAMLwFAADdCAAwvgUAAN8IACDCBQAA4AgAMAAAAAAAAb8FAAAA2QQCBTsAAJMOACA8AACeDgAgvAUAAJQOACC9BQAAnQ4AIMIFAAAHACAFOwAAkQ4AIDwAAJsOACC8BQAAkg4AIL0FAACaDgAgwgUAAAEAIAc7AACPDgAgPAAAmA4AILwFAACQDgAgvQUAAJcOACDABQAAGQAgwQUAABkAIMIFAABGACALOwAAmwkAMDwAAKAJADC8BQAAnAkAML0FAACdCQAwvgUAAJ4JACC_BQAAnwkAMMAFAACfCQAwwQUAAJ8JADDCBQAAnwkAMMMFAAChCQAwxAUAAKIJADAHOwAAlgkAIDwAAJkJACC8BQAAlwkAIL0FAACYCQAgwAUAACYAIMEFAAAmACDCBQAASgAgCzsAAIoJADA8AACPCQAwvAUAAIsJADC9BQAAjAkAML4FAACNCQAgvwUAAI4JADDABQAAjgkAMMEFAACOCQAwwgUAAI4JADDDBQAAkAkAMMQFAACRCQAwBOoDAQAAAAGCBIAAAAABlQQAAAC3BAK3BEAAAAABAgAAACoAIDsAAJUJACADAAAAKgAgOwAAlQkAIDwAAJQJACABNAAAlg4AMAkQAACxBwAg5wMAALwHADDoAwAAKAAQ6QMAALwHADDqAwEAAAABggQAAPsGACCVBAAAvQe3BCK1BAEAqAYAIbcEQACuBgAhAgAAACoAIDQAAJQJACACAAAAkgkAIDQAAJMJACAI5wMAAJEJADDoAwAAkgkAEOkDAACRCQAw6gMBAKgGACGCBAAA-wYAIJUEAAC9B7cEIrUEAQCoBgAhtwRAAK4GACEI5wMAAJEJADDoAwAAkgkAEOkDAACRCQAw6gMBAKgGACGCBAAA-wYAIJUEAAC9B7cEIrUEAQCoBgAhtwRAAK4GACEE6gMBAOgHACGCBIAAAAABlQQAAKoItwQitwRAAOsHACEE6gMBAOgHACGCBIAAAAABlQQAAKoItwQitwRAAOsHACEE6gMBAAAAAYIEgAAAAAGVBAAAALcEArcEQAAAAAELCAAAuAgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAAvQQCuAQBAAAAAbkEAgAAAAG6BAIAAAABuwQIAAAAAb0EAgAAAAG-BEAAAAABAgAAAEoAIDsAAJYJACADAAAAJgAgOwAAlgkAIDwAAJoJACANAAAAJgAgCAAAtggAIDQAAJoJACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAAswi9BCK4BAEA6AcAIbkEAgCCCAAhugQCAIIIACG7BAgAsggAIb0EAgC0CAAhvgRAAOwHACELCAAAtggAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAACzCL0EIrgEAQDoBwAhuQQCAIIIACG6BAIAgggAIbsECACyCAAhvQQCALQIACG-BEAA7AcAIQ0JAAD6CAAgEwAA-wgAIBYAAPwIACAZAAD9CAAg6gMBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADUBALPBAEAAAAB0AQBAAAAAdEEAQAAAAHSBAEAAAAB1ARAAAAAAQIAAAAkACA7AACmCQAgAwAAACQAIDsAAKYJACA8AAClCQAgATQAAJUOADATCQAA7AYAIBAAALEHACATAADBBwAgFgAAwgcAIBkAALgHACDnAwAAvwcAMOgDAAAiABDpAwAAvwcAMOoDAQAAAAGFBEAArgYAIZEEQACuBgAhoQQAAMAH1AQitQQBAKgGACHPBAEAqAYAIdAEAQDrBgAh0QQBAOsGACHSBAEA6wYAIdQEQACsBgAhswUAAL4HACACAAAAJAAgNAAApQkAIAIAAACjCQAgNAAApAkAIA3nAwAAogkAMOgDAACjCQAQ6QMAAKIJADDqAwEAqAYAIYUEQACuBgAhkQRAAK4GACGhBAAAwAfUBCK1BAEAqAYAIc8EAQCoBgAh0AQBAOsGACHRBAEA6wYAIdIEAQDrBgAh1ARAAKwGACEN5wMAAKIJADDoAwAAowkAEOkDAACiCQAw6gMBAKgGACGFBEAArgYAIZEEQACuBgAhoQQAAMAH1AQitQQBAKgGACHPBAEAqAYAIdAEAQDrBgAh0QQBAOsGACHSBAEA6wYAIdQEQACsBgAhCeoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAADWCNQEIs8EAQDoBwAh0AQBAPMHACHRBAEA8wcAIdIEAQDzBwAh1ARAAOwHACENCQAA2AgAIBMAANkIACAWAADaCAAgGQAA2wgAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAADWCNQEIs8EAQDoBwAh0AQBAPMHACHRBAEA8wcAIdIEAQDzBwAh1ARAAOwHACENCQAA-ggAIBMAAPsIACAWAAD8CAAgGQAA_QgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAA1AQCzwQBAAAAAdAEAQAAAAHRBAEAAAAB0gQBAAAAAdQEQAAAAAEDOwAAkw4AILwFAACUDgAgwgUAAAcAIAM7AACRDgAgvAUAAJIOACDCBQAAAQAgAzsAAI8OACC8BQAAkA4AIMIFAABGACAEOwAAmwkAMLwFAACcCQAwvgUAAJ4JACDCBQAAnwkAMAM7AACWCQAgvAUAAJcJACDCBQAASgAgBDsAAIoJADC8BQAAiwkAML4FAACNCQAgwgUAAI4JADAAAAABvwUAAADfBAIFOwAAhg4AIDwAAI0OACC8BQAAhw4AIL0FAACMDgAgwgUAAAcAIAc7AACEDgAgPAAAig4AILwFAACFDgAgvQUAAIkOACDABQAAGwAgwQUAABsAIMIFAAABACALOwAAtAkAMDwAALkJADC8BQAAtQkAML0FAAC2CQAwvgUAALcJACC_BQAAuAkAMMAFAAC4CQAwwQUAALgJADDCBQAAuAkAMMMFAAC6CQAwxAUAALsJADATCAAApwkAIAsAAKgJACAPAACqCQAgEQAAqwkAIBIAAKwJACDqAwEAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAA2QQCuAQBAAAAAdQEQAAAAAHVBAEAAAAB1wQCAAAAAdkEQAAAAAHaBEAAAAAB2wRAAAAAAdwEAgAAAAECAAAAHwAgOwAAvwkAIAMAAAAfACA7AAC_CQAgPAAAvgkAIAE0AACIDgAwGQgAALIHACALAAD9BgAgDgAAxgcAIA8AAK0HACARAADHBwAgEgAAyAcAIOcDAADEBwAw6AMAAB0AEOkDAADEBwAw6gMBAAAAAYMEAQDrBgAhhAQBAOsGACGFBEAArgYAIZEEQACuBgAhoQQAAMUH2QQiuAQBAKgGACHUBEAArAYAIdUEAQCoBgAh1gQBAOsGACHXBAIArQYAIdkEQACsBgAh2gRAAK4GACHbBEAArAYAIdwEAgCtBgAhtAUAAMMHACACAAAAHwAgNAAAvgkAIAIAAAC8CQAgNAAAvQkAIBLnAwAAuwkAMOgDAAC8CQAQ6QMAALsJADDqAwEAqAYAIYMEAQDrBgAhhAQBAOsGACGFBEAArgYAIZEEQACuBgAhoQQAAMUH2QQiuAQBAKgGACHUBEAArAYAIdUEAQCoBgAh1gQBAOsGACHXBAIArQYAIdkEQACsBgAh2gRAAK4GACHbBEAArAYAIdwEAgCtBgAhEucDAAC7CQAw6AMAALwJABDpAwAAuwkAMOoDAQCoBgAhgwQBAOsGACGEBAEA6wYAIYUEQACuBgAhkQRAAK4GACGhBAAAxQfZBCK4BAEAqAYAIdQEQACsBgAh1QQBAKgGACHWBAEA6wYAIdcEAgCtBgAh2QRAAKwGACHaBEAArgYAIdsEQACsBgAh3AQCAK0GACEO6gMBAOgHACGDBAEA8wcAIYQEAQDzBwAhhQRAAOsHACGRBEAA6wcAIaEEAACDCdkEIrgEAQDoBwAh1ARAAOwHACHVBAEA6AcAIdcEAgCCCAAh2QRAAOwHACHaBEAA6wcAIdsEQADsBwAh3AQCAIIIACETCAAAhAkAIAsAAIUJACAPAACHCQAgEQAAiAkAIBIAAIkJACDqAwEA6AcAIYMEAQDzBwAhhAQBAPMHACGFBEAA6wcAIZEEQADrBwAhoQQAAIMJ2QQiuAQBAOgHACHUBEAA7AcAIdUEAQDoBwAh1wQCAIIIACHZBEAA7AcAIdoEQADrBwAh2wRAAOwHACHcBAIAgggAIRMIAACnCQAgCwAAqAkAIA8AAKoJACARAACrCQAgEgAArAkAIOoDAQAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADZBAK4BAEAAAAB1ARAAAAAAdUEAQAAAAHXBAIAAAAB2QRAAAAAAdoEQAAAAAHbBEAAAAAB3AQCAAAAAQM7AACGDgAgvAUAAIcOACDCBQAABwAgAzsAAIQOACC8BQAAhQ4AIMIFAAABACAEOwAAtAkAMLwFAAC1CQAwvgUAALcJACDCBQAAuAkAMAAAAAAABTsAAPwNACA8AACCDgAgvAUAAP0NACC9BQAAgQ4AIMIFAAAHACAFOwAA-g0AIDwAAP8NACC8BQAA-w0AIL0FAAD-DQAgwgUAAFMAIAM7AAD8DQAgvAUAAP0NACDCBQAABwAgAzsAAPoNACC8BQAA-w0AIMIFAABTACAAAAAAAAU7AAD0DQAgPAAA-A0AILwFAAD1DQAgvQUAAPcNACDCBQAAUwAgCzsAANMJADA8AADXCQAwvAUAANQJADC9BQAA1QkAML4FAADWCQAgvwUAAOAIADDABQAA4AgAMMEFAADgCAAwwgUAAOAIADDDBQAA2AkAMMQFAADjCAAwCxQAAMAIACDqAwEAAAABhQRAAAAAAb8EAQAAAAHBBCAAAAABwgQBAAAAAcMEAQAAAAHEBAIAAAABxQQCAAAAAcYEAgAAAAHHBAEAAAABAgAAADQAIDsAANsJACADAAAANAAgOwAA2wkAIDwAANoJACABNAAA9g0AMAIAAAA0ACA0AADaCQAgAgAAAOQIACA0AADZCQAgCuoDAQDoBwAhhQRAAOsHACG_BAEA6AcAIcEEIADqBwAhwgQBAPMHACHDBAEA8wcAIcQEAgC0CAAhxQQCALQIACHGBAIAgggAIccEAQDzBwAhCxQAAL4IACDqAwEA6AcAIYUEQADrBwAhvwQBAOgHACHBBCAA6gcAIcIEAQDzBwAhwwQBAPMHACHEBAIAtAgAIcUEAgC0CAAhxgQCAIIIACHHBAEA8wcAIQsUAADACAAg6gMBAAAAAYUEQAAAAAG_BAEAAAABwQQgAAAAAcIEAQAAAAHDBAEAAAABxAQCAAAAAcUEAgAAAAHGBAIAAAABxwQBAAAAAQM7AAD0DQAgvAUAAPUNACDCBQAAUwAgBDsAANMJADC8BQAA1AkAML4FAADWCQAgwgUAAOAIADAAAAAAAAU7AADuDQAgPAAA8g0AILwFAADvDQAgvQUAAPENACDCBQAA4AIAIAs7AADlCQAwPAAA6QkAMLwFAADmCQAwvQUAAOcJADC-BQAA6AkAIL8FAADxCAAwwAUAAPEIADDBBQAA8QgAMMIFAADxCAAwwwUAAOoJADDEBQAA9AgAMAQUAADRCAAg6gMBAAAAAYUEQAAAAAG_BAEAAAABAgAAABcAIDsAAO0JACADAAAAFwAgOwAA7QkAIDwAAOwJACABNAAA8A0AMAIAAAAXACA0AADsCQAgAgAAAPUIACA0AADrCQAgA-oDAQDoBwAhhQRAAOsHACG_BAEA6AcAIQQUAADPCAAg6gMBAOgHACGFBEAA6wcAIb8EAQDoBwAhBBQAANEIACDqAwEAAAABhQRAAAAAAb8EAQAAAAEDOwAA7g0AILwFAADvDQAgwgUAAOACACAEOwAA5QkAMLwFAADmCQAwvgUAAOgJACDCBQAA8QgAMAAAAAG_BQAAAO0EAgU7AADoDQAgPAAA7A0AILwFAADpDQAgvQUAAOsNACDCBQAAUwAgCzsAAPYJADA8AAD7CQAwvAUAAPcJADC9BQAA-AkAML4FAAD5CQAgvwUAAPoJADDABQAA-gkAMMEFAAD6CQAwwgUAAPoJADDDBQAA_AkAMMQFAAD9CQAwBRsAAO8JACDqAwEAAAAB4wQCAAAAAeoEAQAAAAHrBCAAAAABAgAAABMAIDsAAIEKACADAAAAEwAgOwAAgQoAIDwAAIAKACABNAAA6g0AMAsKAADbBwAgGwAAwQcAIOcDAADaBwAw6AMAABEAEOkDAADaBwAw6gMBAAAAAeMEAgCtBgAh6QQBAKgGACHqBAEAqAYAIesEIACrBgAhtgUAANkHACACAAAAEwAgNAAAgAoAIAIAAAD-CQAgNAAA_wkAIAjnAwAA_QkAMOgDAAD-CQAQ6QMAAP0JADDqAwEAqAYAIeMEAgCtBgAh6QQBAKgGACHqBAEAqAYAIesEIACrBgAhCOcDAAD9CQAw6AMAAP4JABDpAwAA_QkAMOoDAQCoBgAh4wQCAK0GACHpBAEAqAYAIeoEAQCoBgAh6wQgAKsGACEE6gMBAOgHACHjBAIAgggAIeoEAQDoBwAh6wQgAOoHACEFGwAA5AkAIOoDAQDoBwAh4wQCAIIIACHqBAEA6AcAIesEIADqBwAhBRsAAO8JACDqAwEAAAAB4wQCAAAAAeoEAQAAAAHrBCAAAAABAzsAAOgNACC8BQAA6Q0AIMIFAABTACAEOwAA9gkAMLwFAAD3CQAwvgUAAPkJACDCBQAA-gkAMAgGAAClCAAgBwAAkgsAIAoAAJANACAPAACTDQAgHQAAkQ0AIB4AAJINACD0BAAA5AcAIPcEAADkBwAgAAAAAAAAAb8FAAAA8QQCAb8FAAAA8gQCBTsAAN0NACA8AADmDQAgvAUAAN4NACC9BQAA5Q0AIMIFAACCAgAgBTsAANsNACA8AADjDQAgvAUAANwNACC9BQAA4g0AIMIFAAABACAHOwAAtAoAIDwAALcKACC8BQAAtQoAIL0FAAC2CgAgwAUAAA8AIMEFAAAPACDCBQAA4AIAIAs7AACoCgAwPAAArQoAMLwFAACpCgAwvQUAAKoKADC-BQAAqwoAIL8FAACsCgAwwAUAAKwKADDBBQAArAoAMMIFAACsCgAwwwUAAK4KADDEBQAArwoAMAs7AACcCgAwPAAAoQoAMLwFAACdCgAwvQUAAJ4KADC-BQAAnwoAIL8FAACgCgAwwAUAAKAKADDBBQAAoAoAMMIFAACgCgAwwwUAAKIKADDEBQAAowoAMAs7AACTCgAwPAAAlwoAMLwFAACUCgAwvQUAAJUKADC-BQAAlgoAIL8FAACfCQAwwAUAAJ8JADDBBQAAnwkAMMIFAACfCQAwwwUAAJgKADDEBQAAogkAMA0QAAD5CAAgEwAA-wgAIBYAAPwIACAZAAD9CAAg6gMBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADUBAK1BAEAAAAB0AQBAAAAAdEEAQAAAAHSBAEAAAAB1ARAAAAAAQIAAAAkACA7AACbCgAgAwAAACQAIDsAAJsKACA8AACaCgAgATQAAOENADACAAAAJAAgNAAAmgoAIAIAAACjCQAgNAAAmQoAIAnqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAA1gjUBCK1BAEA6AcAIdAEAQDzBwAh0QQBAPMHACHSBAEA8wcAIdQEQADsBwAhDRAAANcIACATAADZCAAgFgAA2ggAIBkAANsIACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAA1gjUBCK1BAEA6AcAIdAEAQDzBwAh0QQBAPMHACHSBAEA8wcAIdQEQADsBwAhDRAAAPkIACATAAD7CAAgFgAA_AgAIBkAAP0IACDqAwEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANQEArUEAQAAAAHQBAEAAAAB0QQBAAAAAdIEAQAAAAHUBEAAAAABBggAAMoJACDqAwEAAAABhQRAAAAAAbgEAQAAAAHjBAIAAAAB5AQCAAAAAQIAAAANACA7AACnCgAgAwAAAA0AIDsAAKcKACA8AACmCgAgATQAAOANADANCAAAsgcAIAkAAOwGACDnAwAA3gcAMOgDAAALABDpAwAA3gcAMOoDAQAAAAGFBEAArgYAIbgEAQCoBgAhzwQBAKgGACHjBAIArQYAIeQEAgCtBgAhtwUAANwHACC4BQAA3QcAIAIAAAANACA0AACmCgAgAgAAAKQKACA0AAClCgAgCecDAACjCgAw6AMAAKQKABDpAwAAowoAMOoDAQCoBgAhhQRAAK4GACG4BAEAqAYAIc8EAQCoBgAh4wQCAK0GACHkBAIArQYAIQnnAwAAowoAMOgDAACkCgAQ6QMAAKMKADDqAwEAqAYAIYUEQACuBgAhuAQBAKgGACHPBAEAqAYAIeMEAgCtBgAh5AQCAK0GACEF6gMBAOgHACGFBEAA6wcAIbgEAQDoBwAh4wQCAIIIACHkBAIAgggAIQYIAADICQAg6gMBAOgHACGFBEAA6wcAIbgEAQDoBwAh4wQCAIIIACHkBAIAgggAIQYIAADKCQAg6gMBAAAAAYUEQAAAAAG4BAEAAAAB4wQCAAAAAeQEAgAAAAEJFwAA3QkAIOoDAQAAAAGFBEAAAAABwwQBAAAAAcYEAgAAAAHlBAEAAAAB5gQgAAAAAecEAgAAAAHoBAIAAAABAgAAAD4AIDsAALMKACADAAAAPgAgOwAAswoAIDwAALIKACABNAAA3w0AMA4JAADsBgAgFwAAuAcAIOcDAAC3BwAw6AMAADwAEOkDAAC3BwAw6gMBAAAAAYUEQACuBgAhwwQBAKgGACHGBAIArQYAIc8EAQCoBgAh5QQBAOsGACHmBCAAqwYAIecEAgD8BgAh6AQCAPwGACECAAAAPgAgNAAAsgoAIAIAAACwCgAgNAAAsQoAIAznAwAArwoAMOgDAACwCgAQ6QMAAK8KADDqAwEAqAYAIYUEQACuBgAhwwQBAKgGACHGBAIArQYAIc8EAQCoBgAh5QQBAOsGACHmBCAAqwYAIecEAgD8BgAh6AQCAPwGACEM5wMAAK8KADDoAwAAsAoAEOkDAACvCgAw6gMBAKgGACGFBEAArgYAIcMEAQCoBgAhxgQCAK0GACHPBAEAqAYAIeUEAQDrBgAh5gQgAKsGACHnBAIA_AYAIegEAgD8BgAhCOoDAQDoBwAhhQRAAOsHACHDBAEA6AcAIcYEAgCCCAAh5QQBAPMHACHmBCAA6gcAIecEAgC0CAAh6AQCALQIACEJFwAA0gkAIOoDAQDoBwAhhQRAAOsHACHDBAEA6AcAIcYEAgCCCAAh5QQBAPMHACHmBCAA6gcAIecEAgC0CAAh6AQCALQIACEJFwAA3QkAIOoDAQAAAAGFBEAAAAABwwQBAAAAAcYEAgAAAAHlBAEAAAAB5gQgAAAAAecEAgAAAAHoBAIAAAABBBwAAIMKACDqAwEAAAABjwQAAADtBALtBAEAAAABAgAAAOACACA7AAC0CgAgAwAAAA8AIDsAALQKACA8AAC4CgAgBgAAAA8AIBwAAPUJACA0AAC4CgAg6gMBAOgHACGPBAAA8wntBCLtBAEA8wcAIQQcAAD1CQAg6gMBAOgHACGPBAAA8wntBCLtBAEA8wcAIQM7AADdDQAgvAUAAN4NACDCBQAAggIAIAM7AADbDQAgvAUAANwNACDCBQAAAQAgAzsAALQKACC8BQAAtQoAIMIFAADgAgAgBDsAAKgKADC8BQAAqQoAML4FAACrCgAgwgUAAKwKADAEOwAAnAoAMLwFAACdCgAwvgUAAJ8KACDCBQAAoAoAMAQ7AACTCgAwvAUAAJQKADC-BQAAlgoAIMIFAACfCQAwAAAAAAABvwUAAAD9BAIHOwAAxw0AIDwAANkNACC8BQAAyA0AIL0FAADYDQAgwAUAAAUAIMEFAAAFACDCBQAABwAgCzsAAPcKADA8AAD8CgAwvAUAAPgKADC9BQAA-QoAML4FAAD6CgAgvwUAAPsKADDABQAA-woAMMEFAAD7CgAwwgUAAPsKADDDBQAA_QoAMMQFAAD-CgAwBTsAAMsNACA8AADWDQAgvAUAAMwNACC9BQAA1Q0AIMIFAACCAgAgBTsAAMkNACA8AADTDQAgvAUAAMoNACC9BQAA0g0AIMIFAAABACALOwAA7goAMDwAAPIKADC8BQAA7woAML0FAADwCgAwvgUAAPEKACC_BQAAoAoAMMAFAACgCgAwwQUAAKAKADDCBQAAoAoAMMMFAADzCgAwxAUAAKMKADALOwAA4goAMDwAAOcKADC8BQAA4woAML0FAADkCgAwvgUAAOUKACC_BQAA5goAMMAFAADmCgAwwQUAAOYKADDCBQAA5goAMMMFAADoCgAwxAUAAOkKADALOwAA2QoAMDwAAN0KADC8BQAA2goAML0FAADbCgAwvgUAANwKACC_BQAAuAkAMMAFAAC4CQAwwQUAALgJADDCBQAAuAkAMMMFAADeCgAwxAUAALsJADALOwAAzQoAMDwAANIKADC8BQAAzgoAML0FAADPCgAwvgUAANAKACC_BQAA0QoAMMAFAADRCgAwwQUAANEKADDCBQAA0QoAMMMFAADTCgAwxAUAANQKADALEAAAtwgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAAvQQCtQQBAAAAAbkEAgAAAAG6BAIAAAABuwQIAAAAAb0EAgAAAAG-BEAAAAABAgAAAEoAIDsAANgKACADAAAASgAgOwAA2AoAIDwAANcKACABNAAA0Q0AMBAIAACyBwAgEAAAsQcAIOcDAACuBwAw6AMAACYAEOkDAACuBwAw6gMBAAAAAYUEQACuBgAhkQRAAK4GACGhBAAAsAe9BCK1BAEAAAABuAQBAKgGACG5BAIArQYAIboEAgCtBgAhuwQIAK8HACG9BAIA_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-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABAgAAAAcAIDsAAIILACADAAAABwAgOwAAggsAIDwAAIELACABNAAAzQ0AMCQEAADiBwAgBQAAgAcAIAYAAMEGACAHAAD9BgAgDAAAtgcAIBcAAOMHACAeAACsBwAgHwAA0gcAIOcDAADgBwAw6AMAAAUAEOkDAADgBwAw6gMBAAAAAYUEQACuBgAhjAQBAKgGACGRBEAArgYAIZ4EAQCoBgAhoQQAAOEH_QQiugQCAK0GACHuBAEAqAYAIe8EAQDrBgAh9QQBAKgGACH3BEAArAYAIfgEAQDrBgAh-QQCAK0GACH6BAIArQYAIfsEAgCtBgAh_QRAAKwGACH-BEAArAYAIf8EQACsBgAhgAUgAKsGACGBBSAAqwYAIYIFIACrBgAhgwUCAK0GACGEBSAAqwYAIYUFAQDrBgAhuQUAAN8HACACAAAABwAgNAAAgQsAIAIAAAD_CgAgNAAAgAsAIBvnAwAA_goAMOgDAAD_CgAQ6QMAAP4KADDqAwEAqAYAIYUEQACuBgAhjAQBAKgGACGRBEAArgYAIZ4EAQCoBgAhoQQAAOEH_QQiugQCAK0GACHuBAEAqAYAIe8EAQDrBgAh9QQBAKgGACH3BEAArAYAIfgEAQDrBgAh-QQCAK0GACH6BAIArQYAIfsEAgCtBgAh_QRAAKwGACH-BEAArAYAIf8EQACsBgAhgAUgAKsGACGBBSAAqwYAIYIFIACrBgAhgwUCAK0GACGEBSAAqwYAIYUFAQDrBgAhG-cDAAD-CgAw6AMAAP8KABDpAwAA_goAMOoDAQCoBgAhhQRAAK4GACGMBAEAqAYAIZEEQACuBgAhngQBAKgGACGhBAAA4Qf9BCK6BAIArQYAIe4EAQCoBgAh7wQBAOsGACH1BAEAqAYAIfcEQACsBgAh-AQBAOsGACH5BAIArQYAIfoEAgCtBgAh-wQCAK0GACH9BEAArAYAIf4EQACsBgAh_wRAAKwGACGABSAAqwYAIYEFIACrBgAhggUgAKsGACGDBQIArQYAIYQFIACrBgAhhQUBAOsGACEX6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACEeBQAAxgoAIAYAAMcKACAHAADICgAgDAAAywoAIBcAAMwKACAeAADJCgAgHwAAygoAIOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhHgUAAIMLACAGAACECwAgBwAAhQsAIAwAAIgLACAXAACJCwAgHgAAhgsAIB8AAIcLACDqAwEAAAABhQRAAAAAAYwEAQAAAAGRBEAAAAABngQBAAAAAaEEAAAA_QQCugQCAAAAAe4EAQAAAAHvBAEAAAAB9QQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAEEOwAA9woAMLwFAAD4CgAwvgUAAPoKACDCBQAA-woAMAM7AADLDQAgvAUAAMwNACDCBQAAggIAIAM7AADJDQAgvAUAAMoNACDCBQAAAQAgBDsAAO4KADC8BQAA7woAML4FAADxCgAgwgUAAKAKADAEOwAA4goAMLwFAADjCgAwvgUAAOUKACDCBQAA5goAMAQ7AADZCgAwvAUAANoKADC-BQAA3AoAIMIFAAC4CQAwBDsAAM0KADC8BQAAzgoAML4FAADQCgAgwgUAANEKADADOwAAxw0AILwFAADIDQAgwgUAAAcAIAAAAAAABTsAAMINACA8AADFDQAgvAUAAMMNACC9BQAAxA0AIMIFAAABACADOwAAwg0AILwFAADDDQAgwgUAAAEAIBIGAAClCAAgDAAAiw0AIB8AAIoNACAkAACmCAAgJQAAhQ0AICYAAIYNACAnAACHDQAgKAAAiA0AICkAAIkNACAqAADDCwAgKwAAxAsAICwAAIwNACAtAACNDQAgLgAAjg0AIPcEAADkBwAgiAUAAOQHACCmBQAA5AcAIK0FAADkBwAgAAAABTsAALoNACA8AADADQAgvAUAALsNACC9BQAAvw0AIMIFAAABACALOwAAtQsAMDwAALkLADC8BQAAtgsAML0FAAC3CwAwvgUAALgLACC_BQAA-woAMMAFAAD7CgAwwQUAAPsKADDCBQAA-woAMMMFAAC6CwAwxAUAAP4KADALOwAAqQsAMDwAAK4LADC8BQAAqgsAML0FAACrCwAwvgUAAKwLACC_BQAArQsAMMAFAACtCwAwwQUAAK0LADDCBQAArQsAMMMFAACvCwAwxAUAALALADAHOwAApAsAIDwAAKcLACC8BQAApQsAIL0FAACmCwAgwAUAAFUAIMEFAABVACDCBQAA8AQAIAs7AACbCwAwPAAAnwsAMLwFAACcCwAwvQUAAJ0LADC-BQAAngsAIL8FAACbCAAwwAUAAJsIADDBBQAAmwgAMMIFAACbCAAwwwUAAKALADDEBQAAnggAMBEiAACNCAAgIwAAjwgAIOoDAQAAAAHrAwEAAAABggSAAAAAAYUEQAAAAAGRBEAAAAABkwQAAACTBAKfBAEAAAABoQQAAAChBAKiBAQAAAABowQBAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEQAAAAAGoBEAAAAABAgAAAFkAIDsAAKMLACADAAAAWQAgOwAAowsAIDwAAKILACABNAAAvg0AMAIAAABZACA0AACiCwAgAgAAAJ8IACA0AAChCwAgD-oDAQDoBwAh6wMBAOgHACGCBIAAAAABhQRAAOsHACGRBEAA6wcAIZMEAACBCJMEIp8EAQDzBwAhoQQAAIgIoQQiogQEAIkIACGjBAEA6AcAIaQEAQDzBwAhpQQBAPMHACGmBAEA8wcAIacEQADsBwAhqARAAOwHACERIgAAiggAICMAAIwIACDqAwEA6AcAIesDAQDoBwAhggSAAAAAAYUEQADrBwAhkQRAAOsHACGTBAAAgQiTBCKfBAEA8wcAIaEEAACICKEEIqIEBACJCAAhowQBAOgHACGkBAEA8wcAIaUEAQDzBwAhpgQBAPMHACGnBEAA7AcAIagEQADsBwAhESIAAI0IACAjAACPCAAg6gMBAAAAAesDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGTBAAAAJMEAp8EAQAAAAGhBAAAAKEEAqIEBAAAAAGjBAEAAAABpAQBAAAAAaUEAQAAAAGmBAEAAAABpwRAAAAAAagEQAAAAAEMJAAApAgAIOoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAArAQCqgQAAACqBAKsBAEAAAABrQQBAAAAAa4EQAAAAAGvBEAAAAABsAQgAAAAAbEEQAAAAAECAAAA8AQAIDsAAKQLACADAAAAVQAgOwAApAsAIDwAAKgLACAOAAAAVQAgJAAAlggAIDQAAKgLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGhBAAAlAisBCKqBAAAkwiqBCKsBAEA8wcAIa0EAQDzBwAhrgRAAOwHACGvBEAA7AcAIbAEIADqBwAhsQRAAOwHACEMJAAAlggAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAACUCKwEIqoEAACTCKoEIqwEAQDzBwAhrQQBAPMHACGuBEAA7AcAIa8EQADsBwAhsAQgAOoHACGxBEAA7AcAIRIHAAC6CgAgCgAAuwoAIA8AAL4KACAdAAC8CgAgHgAAvQoAIOoDAQAAAAGFBEAAAAABjAQBAAAAAY8EAAAA8QQCkQRAAAAAAe4EAQAAAAHvBAEAAAAB8gQAAADyBALzBAIAAAAB9AQCAAAAAfUEAQAAAAH2BCAAAAAB9wRAAAAAAQIAAABTACA7AAC0CwAgAwAAAFMAIDsAALQLACA8AACzCwAgATQAAL0NADAYBgAAwQYAIAcAAP0GACAKAACqBwAgDwAArQcAIB0AAKsHACAeAACsBwAg5wMAAKcHADDoAwAAUQAQ6QMAAKcHADDqAwEAAAABhQRAAK4GACGMBAEAqAYAIY8EAACoB_EEIpEEQACuBgAhngQBAKgGACHuBAEAqAYAIe8EAQCoBgAh8gQAAKkH8gQi8wQCAK0GACH0BAIA_AYAIfUEAQCoBgAh9gQgAKsGACH3BEAArAYAIbAFAACmBwAgAgAAAFMAIDQAALMLACACAAAAsQsAIDQAALILACAR5wMAALALADDoAwAAsQsAEOkDAACwCwAw6gMBAKgGACGFBEAArgYAIYwEAQCoBgAhjwQAAKgH8QQikQRAAK4GACGeBAEAqAYAIe4EAQCoBgAh7wQBAKgGACHyBAAAqQfyBCLzBAIArQYAIfQEAgD8BgAh9QQBAKgGACH2BCAAqwYAIfcEQACsBgAhEecDAACwCwAw6AMAALELABDpAwAAsAsAMOoDAQCoBgAhhQRAAK4GACGMBAEAqAYAIY8EAACoB_EEIpEEQACuBgAhngQBAKgGACHuBAEAqAYAIe8EAQCoBgAh8gQAAKkH8gQi8wQCAK0GACH0BAIA_AYAIfUEAQCoBgAh9gQgAKsGACH3BEAArAYAIQ3qAwEA6AcAIYUEQADrBwAhjAQBAOgHACGPBAAAiwrxBCKRBEAA6wcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9QQBAOgHACH2BCAA6gcAIfcEQADsBwAhEgcAAI4KACAKAACPCgAgDwAAkgoAIB0AAJAKACAeAACRCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACHuBAEA6AcAIe8EAQDoBwAh8gQAAIwK8gQi8wQCAIIIACH0BAIAtAgAIfUEAQDoBwAh9gQgAOoHACH3BEAA7AcAIRIHAAC6CgAgCgAAuwoAIA8AAL4KACAdAAC8CgAgHgAAvQoAIOoDAQAAAAGFBEAAAAABjAQBAAAAAY8EAAAA8QQCkQRAAAAAAe4EAQAAAAHvBAEAAAAB8gQAAADyBALzBAIAAAAB9AQCAAAAAfUEAQAAAAH2BCAAAAAB9wRAAAAAAR4EAACKCwAgBQAAgwsAIAcAAIULACAMAACICwAgFwAAiQsAIB4AAIYLACAfAACHCwAg6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAaEEAAAA_QQCugQCAAAAAe4EAQAAAAHvBAEAAAAB9QQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAGFBQEAAAABAgAAAAcAIDsAAL0LACADAAAABwAgOwAAvQsAIDwAALwLACABNAAAvA0AMAIAAAAHACA0AAC8CwAgAgAAAP8KACA0AAC7CwAgF-oDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhoQQAAMQK_QQiugQCAIIIACHuBAEA6AcAIe8EAQDzBwAh9QQBAOgHACH3BEAA7AcAIfgEAQDzBwAh-QQCAIIIACH6BAIAgggAIfsEAgCCCAAh_QRAAOwHACH-BEAA7AcAIf8EQADsBwAhgAUgAOoHACGBBSAA6gcAIYIFIADqBwAhgwUCAIIIACGEBSAA6gcAIYUFAQDzBwAhHgQAAMUKACAFAADGCgAgBwAAyAoAIAwAAMsKACAXAADMCgAgHgAAyQoAIB8AAMoKACDqAwEA6AcAIYUEQADrBwAhjAQBAOgHACGRBEAA6wcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIR4EAACKCwAgBQAAgwsAIAcAAIULACAMAACICwAgFwAAiQsAIB4AAIYLACAfAACHCwAg6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAaEEAAAA_QQCugQCAAAAAe4EAQAAAAHvBAEAAAAB9QQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAGFBQEAAAABAzsAALoNACC8BQAAuw0AIMIFAAABACAEOwAAtQsAMLwFAAC2CwAwvgUAALgLACDCBQAA-woAMAQ7AACpCwAwvAUAAKoLADC-BQAArAsAIMIFAACtCwAwAzsAAKQLACC8BQAApQsAIMIFAADwBAAgBDsAAJsLADC8BQAAnAsAML4FAACeCwAgwgUAAJsIADAAAAcGAAClCAAgJAAApggAIKwEAADkBwAgrQQAAOQHACCuBAAA5AcAIK8EAADkBwAgsQQAAOQHACAAAAAAAAAFOwAAtQ0AIDwAALgNACC8BQAAtg0AIL0FAAC3DQAgwgUAAAEAIAM7AAC1DQAgvAUAALYNACDCBQAAAQAgAAAABTsAALANACA8AACzDQAgvAUAALENACC9BQAAsg0AIMIFAAABACADOwAAsA0AILwFAACxDQAgwgUAAAEAIAAAAAU7AACrDQAgPAAArg0AILwFAACsDQAgvQUAAK0NACDCBQAAAQAgAzsAAKsNACC8BQAArA0AIMIFAAABACAAAAABvwUAAACoBQIBvwUAAACqBQIBvwUAAACrBQIHOwAA8gwAIDwAAPUMACC8BQAA8wwAIL0FAAD0DAAgwAUAAAMAIMEFAAADACDCBQAAggIAIAs7AADmDAAwPAAA6wwAMLwFAADnDAAwvQUAAOgMADC-BQAA6QwAIL8FAADqDAAwwAUAAOoMADDBBQAA6gwAMMIFAADqDAAwwwUAAOwMADDEBQAA7QwAMAs7AADaDAAwPAAA3wwAMLwFAADbDAAwvQUAANwMADC-BQAA3QwAIL8FAADeDAAwwAUAAN4MADDBBQAA3gwAMMIFAADeDAAwwwUAAOAMADDEBQAA4QwAMAs7AADODAAwPAAA0wwAMLwFAADPDAAwvQUAANAMADC-BQAA0QwAIL8FAADSDAAwwAUAANIMADDBBQAA0gwAMMIFAADSDAAwwwUAANQMADDEBQAA1QwAMAs7AADCDAAwPAAAxwwAMLwFAADDDAAwvQUAAMQMADC-BQAAxQwAIL8FAADGDAAwwAUAAMYMADDBBQAAxgwAMMIFAADGDAAwwwUAAMgMADDEBQAAyQwAMAc7AAC9DAAgPAAAwAwAILwFAAC-DAAgvQUAAL8MACDABQAAcgAgwQUAAHIAIMIFAACaAgAgCzsAALQMADA8AAC4DAAwvAUAALUMADC9BQAAtgwAML4FAAC3DAAgvwUAAPsKADDABQAA-woAMMEFAAD7CgAwwgUAAPsKADDDBQAAuQwAMMQFAAD-CgAwCzsAAKsMADA8AACvDAAwvAUAAKwMADC9BQAArQwAML4FAACuDAAgvwUAAOYKADDABQAA5goAMMEFAADmCgAwwgUAAOYKADDDBQAAsAwAMMQFAADpCgAwCzsAAKIMADA8AACmDAAwvAUAAKMMADC9BQAApAwAML4FAAClDAAgvwUAALgJADDABQAAuAkAMMEFAAC4CQAwwgUAALgJADDDBQAApwwAMMQFAAC7CQAwCzsAAJkMADA8AACdDAAwvAUAAJoMADC9BQAAmwwAML4FAACcDAAgvwUAAK0LADDABQAArQsAMMEFAACtCwAwwgUAAK0LADDDBQAAngwAMMQFAACwCwAwCzsAAI0MADA8AACSDAAwvAUAAI4MADC9BQAAjwwAML4FAACQDAAgvwUAAJEMADDABQAAkQwAMMEFAACRDAAwwgUAAJEMADDDBQAAkwwAMMQFAACUDAAwCzsAAIQMADA8AACIDAAwvAUAAIUMADC9BQAAhgwAML4FAACHDAAgvwUAAJsIADDABQAAmwgAMMEFAACbCAAwwgUAAJsIADDDBQAAiQwAMMQFAACeCAAwCzsAAPgLADA8AAD9CwAwvAUAAPkLADC9BQAA-gsAML4FAAD7CwAgvwUAAPwLADDABQAA_AsAMMEFAAD8CwAwwgUAAPwLADDDBQAA_gsAMMQFAAD_CwAwCzsAAOwLADA8AADxCwAwvAUAAO0LADC9BQAA7gsAML4FAADvCwAgvwUAAPALADDABQAA8AsAMMEFAADwCwAwwgUAAPALADDDBQAA8gsAMMQFAADzCwAwCuoDAQAAAAH9AwAAAP0DAv4DAQAAAAH_AwEAAAABgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABAgAAAIIBACA7AAD3CwAgAwAAAIIBACA7AAD3CwAgPAAA9gsAIAE0AACqDQAwDyIAAJUHACDnAwAAkwcAMOgDAACAAQAQ6QMAAJMHADDqAwEAAAAB6wMBAOsGACH9AwAAlAf9AyL-AwEAqAYAIf8DAQDrBgAhgAQAAPsGACCBBAAA-wYAIIIEAAD7BgAggwQBAOsGACGEBAEA6wYAIYUEQACuBgAhAgAAAIIBACA0AAD2CwAgAgAAAPQLACA0AAD1CwAgDucDAADzCwAw6AMAAPQLABDpAwAA8wsAMOoDAQCoBgAh6wMBAOsGACH9AwAAlAf9AyL-AwEAqAYAIf8DAQDrBgAhgAQAAPsGACCBBAAA-wYAIIIEAAD7BgAggwQBAOsGACGEBAEA6wYAIYUEQACuBgAhDucDAADzCwAw6AMAAPQLABDpAwAA8wsAMOoDAQCoBgAh6wMBAOsGACH9AwAAlAf9AyL-AwEAqAYAIf8DAQDrBgAhgAQAAPsGACCBBAAA-wYAIIIEAAD7BgAggwQBAOsGACGEBAEA6wYAIYUEQACuBgAhCuoDAQDoBwAh_QMAAPIH_QMi_gMBAOgHACH_AwEA8wcAIYAEgAAAAAGBBIAAAAABggSAAAAAAYMEAQDzBwAhhAQBAPMHACGFBEAA6wcAIQrqAwEA6AcAIf0DAADyB_0DIv4DAQDoBwAh_wMBAPMHACGABIAAAAABgQSAAAAAAYIEgAAAAAGDBAEA8wcAIYQEAQDzBwAhhQRAAOsHACEK6gMBAAAAAf0DAAAA_QMC_gMBAAAAAf8DAQAAAAGABIAAAAABgQSAAAAAAYIEgAAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAEI6gMBAAAAAYIEgAAAAAGFBEAAAAABjAQBAAAAAY0EAQAAAAGPBAAAAI8EApAEIAAAAAGRBEAAAAABAgAAAH4AIDsAAIMMACADAAAAfgAgOwAAgwwAIDwAAIIMACABNAAAqQ0AMA0iAAD9BgAg5wMAAJYHADDoAwAAfAAQ6QMAAJYHADDqAwEAAAAB6wMBAKgGACGCBAAA-wYAIIUEQACuBgAhjAQBAKgGACGNBAEAqAYAIY8EAACXB48EIpAEIACrBgAhkQRAAK4GACECAAAAfgAgNAAAggwAIAIAAACADAAgNAAAgQwAIAznAwAA_wsAMOgDAACADAAQ6QMAAP8LADDqAwEAqAYAIesDAQCoBgAhggQAAPsGACCFBEAArgYAIYwEAQCoBgAhjQQBAKgGACGPBAAAlwePBCKQBCAAqwYAIZEEQACuBgAhDOcDAAD_CwAw6AMAAIAMABDpAwAA_wsAMOoDAQCoBgAh6wMBAKgGACGCBAAA-wYAIIUEQACuBgAhjAQBAKgGACGNBAEAqAYAIY8EAACXB48EIpAEIACrBgAhkQRAAK4GACEI6gMBAOgHACGCBIAAAAABhQRAAOsHACGMBAEA6AcAIY0EAQDoBwAhjwQAAPkHjwQikAQgAOoHACGRBEAA6wcAIQjqAwEA6AcAIYIEgAAAAAGFBEAA6wcAIYwEAQDoBwAhjQQBAOgHACGPBAAA-QePBCKQBCAA6gcAIZEEQADrBwAhCOoDAQAAAAGCBIAAAAABhQRAAAAAAYwEAQAAAAGNBAEAAAABjwQAAACPBAKQBCAAAAABkQRAAAAAAREGAACOCAAgIwAAjwgAIOoDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGTBAAAAJMEAp4EAQAAAAGfBAEAAAABoQQAAAChBAKiBAQAAAABowQBAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEQAAAAAGoBEAAAAABAgAAAFkAIDsAAIwMACADAAAAWQAgOwAAjAwAIDwAAIsMACABNAAAqA0AMAIAAABZACA0AACLDAAgAgAAAJ8IACA0AACKDAAgD-oDAQDoBwAhggSAAAAAAYUEQADrBwAhkQRAAOsHACGTBAAAgQiTBCKeBAEA8wcAIZ8EAQDzBwAhoQQAAIgIoQQiogQEAIkIACGjBAEA6AcAIaQEAQDzBwAhpQQBAPMHACGmBAEA8wcAIacEQADsBwAhqARAAOwHACERBgAAiwgAICMAAIwIACDqAwEA6AcAIYIEgAAAAAGFBEAA6wcAIZEEQADrBwAhkwQAAIEIkwQingQBAPMHACGfBAEA8wcAIaEEAACICKEEIqIEBACJCAAhowQBAOgHACGkBAEA8wcAIaUEAQDzBwAhpgQBAPMHACGnBEAA7AcAIagEQADsBwAhEQYAAI4IACAjAACPCAAg6gMBAAAAAYIEgAAAAAGFBEAAAAABkQRAAAAAAZMEAAAAkwQCngQBAAAAAZ8EAQAAAAGhBAAAAKEEAqIEBAAAAAGjBAEAAAABpAQBAAAAAaUEAQAAAAGmBAEAAAABpwRAAAAAAagEQAAAAAEMFAAAyggAIOoDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGhBAAAAM0EAr4EQAAAAAG_BAEAAAAByQQCAAAAAcoEAgAAAAHLBAEAAAABzQQgAAAAAQIAAAB5ACA7AACYDAAgAwAAAHkAIDsAAJgMACA8AACXDAAgATQAAKcNADARFAAAmgcAIBUAAJUHACDnAwAAmAcAMOgDAAAvABDpAwAAmAcAMOoDAQAAAAGCBAAA-wYAIIUEQACuBgAhkQRAAK4GACGhBAAAmQfNBCK-BEAArAYAIb8EAQAAAAHIBAEA6wYAIckEAgCtBgAhygQCAK0GACHLBAEA6wYAIc0EIACrBgAhAgAAAHkAIDQAAJcMACACAAAAlQwAIDQAAJYMACAP5wMAAJQMADDoAwAAlQwAEOkDAACUDAAw6gMBAKgGACGCBAAA-wYAIIUEQACuBgAhkQRAAK4GACGhBAAAmQfNBCK-BEAArAYAIb8EAQCoBgAhyAQBAOsGACHJBAIArQYAIcoEAgCtBgAhywQBAOsGACHNBCAAqwYAIQ_nAwAAlAwAMOgDAACVDAAQ6QMAAJQMADDqAwEAqAYAIYIEAAD7BgAghQRAAK4GACGRBEAArgYAIaEEAACZB80EIr4EQACsBgAhvwQBAKgGACHIBAEA6wYAIckEAgCtBgAhygQCAK0GACHLBAEA6wYAIc0EIACrBgAhC-oDAQDoBwAhggSAAAAAAYUEQADrBwAhkQRAAOsHACGhBAAAxwjNBCK-BEAA7AcAIb8EAQDoBwAhyQQCAIIIACHKBAIAgggAIcsEAQDzBwAhzQQgAOoHACEMFAAAyAgAIOoDAQDoBwAhggSAAAAAAYUEQADrBwAhkQRAAOsHACGhBAAAxwjNBCK-BEAA7AcAIb8EAQDoBwAhyQQCAIIIACHKBAIAgggAIcsEAQDzBwAhzQQgAOoHACEMFAAAyggAIOoDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGhBAAAAM0EAr4EQAAAAAG_BAEAAAAByQQCAAAAAcoEAgAAAAHLBAEAAAABzQQgAAAAARIGAAC5CgAgCgAAuwoAIA8AAL4KACAdAAC8CgAgHgAAvQoAIOoDAQAAAAGFBEAAAAABjAQBAAAAAY8EAAAA8QQCkQRAAAAAAZ4EAQAAAAHuBAEAAAAB7wQBAAAAAfIEAAAA8gQC8wQCAAAAAfQEAgAAAAH2BCAAAAAB9wRAAAAAAQIAAABTACA7AAChDAAgAwAAAFMAIDsAAKEMACA8AACgDAAgATQAAKYNADACAAAAUwAgNAAAoAwAIAIAAACxCwAgNAAAnwwAIA3qAwEA6AcAIYUEQADrBwAhjAQBAOgHACGPBAAAiwrxBCKRBEAA6wcAIZ4EAQDoBwAh7gQBAOgHACHvBAEA6AcAIfIEAACMCvIEIvMEAgCCCAAh9AQCALQIACH2BCAA6gcAIfcEQADsBwAhEgYAAI0KACAKAACPCgAgDwAAkgoAIB0AAJAKACAeAACRCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACGeBAEA6AcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9gQgAOoHACH3BEAA7AcAIRIGAAC5CgAgCgAAuwoAIA8AAL4KACAdAAC8CgAgHgAAvQoAIOoDAQAAAAGFBEAAAAABjAQBAAAAAY8EAAAA8QQCkQRAAAAAAZ4EAQAAAAHuBAEAAAAB7wQBAAAAAfIEAAAA8gQC8wQCAAAAAfQEAgAAAAH2BCAAAAAB9wRAAAAAARMIAACnCQAgDgAAqQkAIA8AAKoJACARAACrCQAgEgAArAkAIOoDAQAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADZBAK4BAEAAAAB1ARAAAAAAdYEAQAAAAHXBAIAAAAB2QRAAAAAAdoEQAAAAAHbBEAAAAAB3AQCAAAAAQIAAAAfACA7AACqDAAgAwAAAB8AIDsAAKoMACA8AACpDAAgATQAAKUNADACAAAAHwAgNAAAqQwAIAIAAAC8CQAgNAAAqAwAIA7qAwEA6AcAIYMEAQDzBwAhhAQBAPMHACGFBEAA6wcAIZEEQADrBwAhoQQAAIMJ2QQiuAQBAOgHACHUBEAA7AcAIdYEAQDzBwAh1wQCAIIIACHZBEAA7AcAIdoEQADrBwAh2wRAAOwHACHcBAIAgggAIRMIAACECQAgDgAAhgkAIA8AAIcJACARAACICQAgEgAAiQkAIOoDAQDoBwAhgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhkQRAAOsHACGhBAAAgwnZBCK4BAEA6AcAIdQEQADsBwAh1gQBAPMHACHXBAIAgggAIdkEQADsBwAh2gRAAOsHACHbBEAA7AcAIdwEAgCCCAAhEwgAAKcJACAOAACpCQAgDwAAqgkAIBEAAKsJACASAACsCQAg6gMBAAAAAYMEAQAAAAGEBAEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANkEArgEAQAAAAHUBEAAAAAB1gQBAAAAAdcEAgAAAAHZBEAAAAAB2gRAAAAAAdsEQAAAAAHcBAIAAAABCwgAAMAJACAMAADCCQAg6gMBAAAAAaEEAAAA3wQCuAQBAAAAAdoEQAAAAAHdBAEAAAAB3wQBAAAAAeAEQAAAAAHhBEAAAAAB4gRAAAAAAQIAAABGACA7AACzDAAgAwAAAEYAIDsAALMMACA8AACyDAAgATQAAKQNADACAAAARgAgNAAAsgwAIAIAAADqCgAgNAAAsQwAIAnqAwEA6AcAIaEEAACwCd8EIrgEAQDoBwAh2gRAAOwHACHdBAEA6AcAId8EAQDoBwAh4ARAAOsHACHhBEAA7AcAIeIEQADsBwAhCwgAALEJACAMAACzCQAg6gMBAOgHACGhBAAAsAnfBCK4BAEA6AcAIdoEQADsBwAh3QQBAOgHACHfBAEA6AcAIeAEQADrBwAh4QRAAOwHACHiBEAA7AcAIQsIAADACQAgDAAAwgkAIOoDAQAAAAGhBAAAAN8EArgEAQAAAAHaBEAAAAAB3QQBAAAAAd8EAQAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAEeBAAAigsAIAUAAIMLACAGAACECwAgDAAAiAsAIBcAAIkLACAeAACGCwAgHwAAhwsAIOoDAQAAAAGFBEAAAAABjAQBAAAAAZEEQAAAAAGeBAEAAAABoQQAAAD9BAK6BAIAAAAB7gQBAAAAAe8EAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQIAAAAHACA7AAC8DAAgAwAAAAcAIDsAALwMACA8AAC7DAAgATQAAKMNADACAAAABwAgNAAAuwwAIAIAAAD_CgAgNAAAugwAIBfqAwEA6AcAIYUEQADrBwAhjAQBAOgHACGRBEAA6wcAIZ4EAQDoBwAhoQQAAMQK_QQiugQCAIIIACHuBAEA6AcAIe8EAQDzBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIR4EAADFCgAgBQAAxgoAIAYAAMcKACAMAADLCgAgFwAAzAoAIB4AAMkKACAfAADKCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACEeBAAAigsAIAUAAIMLACAGAACECwAgDAAAiAsAIBcAAIkLACAeAACGCwAgHwAAhwsAIOoDAQAAAAGFBEAAAAABjAQBAAAAAZEEQAAAAAGeBAEAAAABoQQAAAD9BAK6BAIAAAAB7gQBAAAAAe8EAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_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_QYAIOcDAAChBwAw6AMAAGIAEOkDAAChBwAw6gMBAAAAAesDAQCoBgAhhQRAAK4GACGRBEAArgYAIZwFAQCoBgAhnQUBAKgGACGeBQEAqAYAIZ8FAQDrBgAhoAUBAOsGACGhBQEA6wYAIaIFAQDrBgAhowVAAKwGACGkBUAArAYAIaUFAQDrBgAhrwUAAKAHACACAAAAZAAgNAAA8AwAIAIAAADuDAAgNAAA7wwAIBHnAwAA7QwAMOgDAADuDAAQ6QMAAO0MADDqAwEAqAYAIesDAQCoBgAhhQRAAK4GACGRBEAArgYAIZwFAQCoBgAhnQUBAKgGACGeBQEAqAYAIZ8FAQDrBgAhoAUBAOsGACGhBQEA6wYAIaIFAQDrBgAhowVAAKwGACGkBUAArAYAIaUFAQDrBgAhEecDAADtDAAw6AMAAO4MABDpAwAA7QwAMOoDAQCoBgAh6wMBAKgGACGFBEAArgYAIZEEQACuBgAhnAUBAKgGACGdBQEAqAYAIZ4FAQCoBgAhnwUBAOsGACGgBQEA6wYAIaEFAQDrBgAhogUBAOsGACGjBUAArAYAIaQFQACsBgAhpQUBAOsGACEN6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhnAUBAOgHACGdBQEA6AcAIZ4FAQDoBwAhnwUBAPMHACGgBQEA8wcAIaEFAQDzBwAhogUBAPMHACGjBUAA7AcAIaQFQADsBwAhpQUBAPMHACEN6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhnAUBAOgHACGdBQEA6AcAIZ4FAQDoBwAhnwUBAPMHACGgBQEA8wcAIaEFAQDzBwAhogUBAPMHACGjBUAA7AcAIaQFQADsBwAhpQUBAPMHACEN6gMBAAAAAYUEQAAAAAGRBEAAAAABnAUBAAAAAZ0FAQAAAAGeBQEAAAABnwUBAAAAAaAFAQAAAAGhBQEAAAABogUBAAAAAaMFQAAAAAGkBUAAAAABpQUBAAAAAQ8gAAC_CwAgIQAAwAsAICMAAMELACAkAADCCwAg6gMBAAAAAYUEQAAAAAGRBEAAAAAB7gQBAAAAAe8EAQAAAAH3BEAAAAABkAUBAAAAAZEFAQAAAAGSBQEAAAABkwUBAAAAAZQFIAAAAAECAAAAggIAIDsAAPIMACADAAAAAwAgOwAA8gwAIDwAAPYMACARAAAAAwAgIAAAlwsAICEAAJgLACAjAACZCwAgJAAAmgsAIDQAAPYMACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACHuBAEA6AcAIe8EAQDzBwAh9wRAAOwHACGQBQEA6AcAIZEFAQDzBwAhkgUBAPMHACGTBQEA8wcAIZQFIADqBwAhDyAAAJcLACAhAACYCwAgIwAAmQsAICQAAJoLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACHuBAEA6AcAIe8EAQDzBwAh9wRAAOwHACGQBQEA6AcAIZEFAQDzBwAhkgUBAPMHACGTBQEA8wcAIZQFIADqBwAhAzsAAPIMACC8BQAA8wwAIMIFAACCAgAgBDsAAOYMADC8BQAA5wwAML4FAADpDAAgwgUAAOoMADAEOwAA2gwAMLwFAADbDAAwvgUAAN0MACDCBQAA3gwAMAQ7AADODAAwvAUAAM8MADC-BQAA0QwAIMIFAADSDAAwBDsAAMIMADC8BQAAwwwAML4FAADFDAAgwgUAAMYMADADOwAAvQwAILwFAAC-DAAgwgUAAJoCACAEOwAAtAwAMLwFAAC1DAAwvgUAALcMACDCBQAA-woAMAQ7AACrDAAwvAUAAKwMADC-BQAArgwAIMIFAADmCgAwBDsAAKIMADC8BQAAowwAML4FAAClDAAgwgUAALgJADAEOwAAmQwAMLwFAACaDAAwvgUAAJwMACDCBQAArQsAMAQ7AACNDAAwvAUAAI4MADC-BQAAkAwAIMIFAACRDAAwBDsAAIQMADC8BQAAhQwAML4FAACHDAAgwgUAAJsIADAEOwAA-AsAMLwFAAD5CwAwvgUAAPsLACDCBQAA_AsAMAQ7AADsCwAwvAUAAO0LADC-BQAA7wsAIMIFAADwCwAwAAAAAAwiAACSCwAg9wQAAOQHACCGBQAA5AcAIIcFAADkBwAgiAUAAOQHACCJBQAA5AcAIIoFAADkBwAgiwUAAOQHACCMBQAA5AcAII0FAADkBwAgjgUAAOQHACCPBQAA5AcAIAAAAAAACQkAAIQKACAQAACUDQAgEwAAmA0AIBYAAJkNACAZAACWDQAg0AQAAOQHACDRBAAA5AcAINIEAADkBwAg1AQAAOQHACADCQAAhAoAIBwAAIUKACDtBAAA5AcAIAAAAAwIAACVDQAgCwAAkgsAIA4AAJoNACAPAACTDQAgEQAAmw0AIBIAAJwNACCDBAAA5AcAIIQEAADkBwAg1AQAAOQHACDWBAAA5AcAINkEAADkBwAg2wQAAOQHACAPBAAAlQ0AIAUAAMMLACAGAAClCAAgBwAAkgsAIAwAAIsNACAXAACeDQAgHgAAkg0AIB8AAIoNACDvBAAA5AcAIPcEAADkBwAg-AQAAOQHACD9BAAA5AcAIP4EAADkBwAg_wQAAOQHACCFBQAA5AcAIAAFCQAAhAoAIBcAAJYNACDlBAAA5AcAIOcEAADkBwAg6AQAAOQHACAABhQAAI8NACAVAACSCwAgggQAAOQHACC-BAAA5AcAIMgEAADkBwAgywQAAOQHACAHCAAAlQ0AIAsAAJILACAMAACLDQAg1QQAAOQHACDaBAAA5AcAIOEEAADkBwAg4gQAAOQHACAECAAAlQ0AIBAAAJQNACC9BAAA5AcAIL4EAADkBwAgAAIKAACQDQAgGwAAmA0AIAAN6gMBAAAAAYUEQAAAAAGRBEAAAAABnAUBAAAAAZ0FAQAAAAGeBQEAAAABnwUBAAAAAaAFAQAAAAGhBQEAAAABogUBAAAAAaMFQAAAAAGkBUAAAAABpQUBAAAAAQfqAwEAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABkQRAAAAAAdoEQAAAAAGZBQEAAAABA-oDAQAAAAGaBQEAAAABmwUBAAAAAQXqAwEAAAAB7QMAAADtAwLuAyAAAAAB7wNAAAAAAfADQAAAAAEX6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAGFBQEAAAABCeoDAQAAAAGhBAAAAN8EArgEAQAAAAHaBEAAAAAB3QQBAAAAAd8EAQAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAEO6gMBAAAAAYMEAQAAAAGEBAEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANkEArgEAQAAAAHUBEAAAAAB1gQBAAAAAdcEAgAAAAHZBEAAAAAB2gRAAAAAAdsEQAAAAAHcBAIAAAABDeoDAQAAAAGFBEAAAAABjAQBAAAAAY8EAAAA8QQCkQRAAAAAAZ4EAQAAAAHuBAEAAAAB7wQBAAAAAfIEAAAA8gQC8wQCAAAAAfQEAgAAAAH2BCAAAAAB9wRAAAAAAQvqAwEAAAABggSAAAAAAYUEQAAAAAGRBEAAAAABoQQAAADNBAK-BEAAAAABvwQBAAAAAckEAgAAAAHKBAIAAAABywQBAAAAAc0EIAAAAAEP6gMBAAAAAYIEgAAAAAGFBEAAAAABkQRAAAAAAZMEAAAAkwQCngQBAAAAAZ8EAQAAAAGhBAAAAKEEAqIEBAAAAAGjBAEAAAABpAQBAAAAAaUEAQAAAAGmBAEAAAABpwRAAAAAAagEQAAAAAEI6gMBAAAAAYIEgAAAAAGFBEAAAAABjAQBAAAAAY0EAQAAAAGPBAAAAI8EApAEIAAAAAGRBEAAAAABCuoDAQAAAAH9AwAAAP0DAv4DAQAAAAH_AwEAAAABgASAAAAAAYEEgAAAAAGCBIAAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABGwYAAPcMACAMAAD_DAAgHwAA_gwAICQAAIINACAmAAD5DAAgJwAA-gwAICgAAPsMACApAAD8DAAgKgAA_QwAICsAAIANACAsAACBDQAgLQAAgw0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AACrDQAgAwAAABsAIDsAAKsNACA8AACvDQAgHQAAABsAIAYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAmAADgCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACA0AACvDQAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJgAA4AsAICcAAOELACAoAADiCwAgKQAA4wsAICoAAOQLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAAD3DAAgDAAA_wwAIB8AAP4MACAkAACCDQAgJQAA-AwAICYAAPkMACAoAAD7DAAgKQAA_AwAICoAAP0MACArAACADQAgLAAAgQ0AIC0AAIMNACAuAACEDQAg6gMBAAAAAYUEQAAAAAGRBEAAAAABkwQAAACrBQKhBAAAAKoFAt0EAQAAAAH3BEAAAAABiAUBAAAAAZAFAQAAAAGmBQEAAAABqAUAAACoBQKrBSAAAAABrAUgAAAAAa0FQAAAAAECAAAAAQAgOwAAsA0AIAMAAAAbACA7AACwDQAgPAAAtA0AIB0AAAAbACAGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAoAADiCwAgKQAA4wsAICoAAOQLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAgNAAAtA0AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEbBgAA3gsAIAwAAOYLACAfAADlCwAgJAAA6QsAICUAAN8LACAmAADgCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEbBgAA9wwAIAwAAP8MACAfAAD-DAAgJAAAgg0AICUAAPgMACAnAAD6DAAgKAAA-wwAICkAAPwMACAqAAD9DAAgKwAAgA0AICwAAIENACAtAACDDQAgLgAAhA0AIOoDAQAAAAGFBEAAAAABkQRAAAAAAZMEAAAAqwUCoQQAAACqBQLdBAEAAAAB9wRAAAAAAYgFAQAAAAGQBQEAAAABpgUBAAAAAagFAAAAqAUCqwUgAAAAAawFIAAAAAGtBUAAAAABAgAAAAEAIDsAALUNACADAAAAGwAgOwAAtQ0AIDwAALkNACAdAAAAGwAgBgAA3gsAIAwAAOYLACAfAADlCwAgJAAA6QsAICUAAN8LACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIDQAALkNACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwwAAP8MACAfAAD-DAAgJAAAgg0AICUAAPgMACAmAAD5DAAgJwAA-gwAICgAAPsMACApAAD8DAAgKgAA_QwAICsAAIANACAsAACBDQAgLQAAgw0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AAC6DQAgF-oDAQAAAAGFBEAAAAABjAQBAAAAAZEEQAAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQ3qAwEAAAABhQRAAAAAAYwEAQAAAAGPBAAAAPEEApEEQAAAAAHuBAEAAAAB7wQBAAAAAfIEAAAA8gQC8wQCAAAAAfQEAgAAAAH1BAEAAAAB9gQgAAAAAfcEQAAAAAEP6gMBAAAAAesDAQAAAAGCBIAAAAABhQRAAAAAAZEEQAAAAAGTBAAAAJMEAp8EAQAAAAGhBAAAAKEEAqIEBAAAAAGjBAEAAAABpAQBAAAAAaUEAQAAAAGmBAEAAAABpwRAAAAAAagEQAAAAAEDAAAAGwAgOwAAug0AIDwAAMENACAdAAAAGwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIDQAAMENACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwwAAOYLACAfAADlCwAgJAAA6QsAICUAAN8LACAmAADgCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwYAAPcMACAMAAD_DAAgHwAA_gwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKgAA_QwAICsAAIANACAsAACBDQAgLQAAgw0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AADCDQAgAwAAABsAIDsAAMINACA8AADGDQAgHQAAABsAIAYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACAoAADiCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACA0AADGDQAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICoAAOQLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIR8EAACKCwAgBgAAhAsAIAcAAIULACAMAACICwAgFwAAiQsAIB4AAIYLACAfAACHCwAg6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQIAAAAHACA7AADHDQAgGwYAAPcMACAMAAD_DAAgHwAA_gwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKQAA_AwAICsAAIANACAsAACBDQAgLQAAgw0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AADJDQAgEAEAAL4LACAhAADACwAgIwAAwQsAICQAAMILACDqAwEAAAABhQRAAAAAAZEEQAAAAAHuBAEAAAAB7wQBAAAAAfcEQAAAAAGQBQEAAAABkQUBAAAAAZIFAQAAAAGTBQEAAAABlAUgAAAAAZUFAQAAAAECAAAAggIAIDsAAMsNACAX6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABBeoDAQAAAAGFBEAAAAABzwQBAAAAAeMEAgAAAAHkBAIAAAABCeoDAQAAAAGhBAAAAN8EAtUEAQAAAAHaBEAAAAAB3QQBAAAAAd8EAQAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAEO6gMBAAAAAYMEAQAAAAGEBAEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANkEAtQEQAAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAHZBEAAAAAB2gRAAAAAAdsEQAAAAAHcBAIAAAABCuoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAAvQQCtQQBAAAAAbkEAgAAAAG6BAIAAAABuwQIAAAAAb0EAgAAAAG-BEAAAAABAwAAABsAIDsAAMkNACA8AADUDQAgHQAAABsAIAYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACAoAADiCwAgKQAA4wsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACA0AADUDQAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIQMAAAADACA7AADLDQAgPAAA1w0AIBIAAAADACABAACWCwAgIQAAmAsAICMAAJkLACAkAACaCwAgNAAA1w0AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIe4EAQDoBwAh7wQBAPMHACH3BEAA7AcAIZAFAQDoBwAhkQUBAPMHACGSBQEA8wcAIZMFAQDzBwAhlAUgAOoHACGVBQEA6AcAIRABAACWCwAgIQAAmAsAICMAAJkLACAkAACaCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAh7gQBAOgHACHvBAEA8wcAIfcEQADsBwAhkAUBAOgHACGRBQEA8wcAIZIFAQDzBwAhkwUBAPMHACGUBSAA6gcAIZUFAQDoBwAhAwAAAAUAIDsAAMcNACA8AADaDQAgIQAAAAUAIAQAAMUKACAGAADHCgAgBwAAyAoAIAwAAMsKACAXAADMCgAgHgAAyQoAIB8AAMoKACA0AADaDQAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIR8EAADFCgAgBgAAxwoAIAcAAMgKACAMAADLCgAgFwAAzAoAIB4AAMkKACAfAADKCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIRsGAAD3DAAgDAAA_wwAIB8AAP4MACAkAACCDQAgJQAA-AwAICYAAPkMACAnAAD6DAAgKAAA-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_QQCugQCAAAAAe4EAQAAAAHvBAEAAAAB9QQBAAAAAfcEQAAAAAH4BAEAAAAB-QQCAAAAAfoEAgAAAAH7BAIAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAUgAAAAAYEFIAAAAAGCBSAAAAABgwUCAAAAAYQFIAAAAAGFBQEAAAABAgAAAAcAIDsAAPwNACADAAAAUQAgOwAA-g0AIDwAAIAOACAVAAAAUQAgBgAAjQoAIAcAAI4KACAKAACPCgAgDwAAkgoAIB0AAJAKACA0AACADgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACGeBAEA6AcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9QQBAOgHACH2BCAA6gcAIfcEQADsBwAhEwYAAI0KACAHAACOCgAgCgAAjwoAIA8AAJIKACAdAACQCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACGeBAEA6AcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9QQBAOgHACH2BCAA6gcAIfcEQADsBwAhAwAAAAUAIDsAAPwNACA8AACDDgAgIQAAAAUAIAQAAMUKACAFAADGCgAgBgAAxwoAIAcAAMgKACAMAADLCgAgFwAAzAoAIB8AAMoKACA0AACDDgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIR8EAADFCgAgBQAAxgoAIAYAAMcKACAHAADICgAgDAAAywoAIBcAAMwKACAfAADKCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhkQRAAOsHACGeBAEA6AcAIaEEAADECv0EIroEAgCCCAAh7gQBAOgHACHvBAEA8wcAIfUEAQDoBwAh9wRAAOwHACH4BAEA8wcAIfkEAgCCCAAh-gQCAIIIACH7BAIAgggAIf0EQADsBwAh_gRAAOwHACH_BEAA7AcAIYAFIADqBwAhgQUgAOoHACGCBSAA6gcAIYMFAgCCCAAhhAUgAOoHACGFBQEA8wcAIRsGAAD3DAAgDAAA_wwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKQAA_AwAICoAAP0MACArAACADQAgLAAAgQ0AIC0AAIMNACAuAACEDQAg6gMBAAAAAYUEQAAAAAGRBEAAAAABkwQAAACrBQKhBAAAAKoFAt0EAQAAAAH3BEAAAAABiAUBAAAAAZAFAQAAAAGmBQEAAAABqAUAAACoBQKrBSAAAAABrAUgAAAAAa0FQAAAAAECAAAAAQAgOwAAhA4AIB8EAACKCwAgBQAAgwsAIAYAAIQLACAHAACFCwAgDAAAiAsAIBcAAIkLACAeAACGCwAg6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQIAAAAHACA7AACGDgAgDuoDAQAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADZBAK4BAEAAAAB1ARAAAAAAdUEAQAAAAHXBAIAAAAB2QRAAAAAAdoEQAAAAAHbBEAAAAAB3AQCAAAAAQMAAAAbACA7AACEDgAgPAAAiw4AIB0AAAAbACAGAADeCwAgDAAA5gsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACAoAADiCwAgKQAA4wsAICoAAOQLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAgNAAAiw4AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEbBgAA3gsAIAwAAOYLACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEDAAAABQAgOwAAhg4AIDwAAI4OACAhAAAABQAgBAAAxQoAIAUAAMYKACAGAADHCgAgBwAAyAoAIAwAAMsKACAXAADMCgAgHgAAyQoAIDQAAI4OACDqAwEA6AcAIYUEQADrBwAhjAQBAOgHACGRBEAA6wcAIZ4EAQDoBwAhoQQAAMQK_QQiugQCAIIIACHuBAEA6AcAIe8EAQDzBwAh9QQBAOgHACH3BEAA7AcAIfgEAQDzBwAh-QQCAIIIACH6BAIAgggAIfsEAgCCCAAh_QRAAOwHACH-BEAA7AcAIf8EQADsBwAhgAUgAOoHACGBBSAA6gcAIYIFIADqBwAhgwUCAIIIACGEBSAA6gcAIYUFAQDzBwAhHwQAAMUKACAFAADGCgAgBgAAxwoAIAcAAMgKACAMAADLCgAgFwAAzAoAIB4AAMkKACDqAwEA6AcAIYUEQADrBwAhjAQBAOgHACGRBEAA6wcAIZ4EAQDoBwAhoQQAAMQK_QQiugQCAIIIACHuBAEA6AcAIe8EAQDzBwAh9QQBAOgHACH3BEAA7AcAIfgEAQDzBwAh-QQCAIIIACH6BAIAgggAIfsEAgCCCAAh_QRAAOwHACH-BEAA7AcAIf8EQADsBwAhgAUgAOoHACGBBSAA6gcAIYIFIADqBwAhgwUCAIIIACGEBSAA6gcAIYUFAQDzBwAhDAgAAMAJACALAADBCQAg6gMBAAAAAaEEAAAA3wQCuAQBAAAAAdUEAQAAAAHaBEAAAAAB3QQBAAAAAd8EAQAAAAHgBEAAAAAB4QRAAAAAAeIEQAAAAAECAAAARgAgOwAAjw4AIBsGAAD3DAAgHwAA_gwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKQAA_AwAICoAAP0MACArAACADQAgLAAAgQ0AIC0AAIMNACAuAACEDQAg6gMBAAAAAYUEQAAAAAGRBEAAAAABkwQAAACrBQKhBAAAAKoFAt0EAQAAAAH3BEAAAAABiAUBAAAAAZAFAQAAAAGmBQEAAAABqAUAAACoBQKrBSAAAAABrAUgAAAAAa0FQAAAAAECAAAAAQAgOwAAkQ4AIB8EAACKCwAgBQAAgwsAIAYAAIQLACAHAACFCwAgFwAAiQsAIB4AAIYLACAfAACHCwAg6gMBAAAAAYUEQAAAAAGMBAEAAAABkQRAAAAAAZ4EAQAAAAGhBAAAAP0EAroEAgAAAAHuBAEAAAAB7wQBAAAAAfUEAQAAAAH3BEAAAAAB-AQBAAAAAfkEAgAAAAH6BAIAAAAB-wQCAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFIAAAAAGBBSAAAAABggUgAAAAAYMFAgAAAAGEBSAAAAABhQUBAAAAAQIAAAAHACA7AACTDgAgCeoDAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAA1AQCzwQBAAAAAdAEAQAAAAHRBAEAAAAB0gQBAAAAAdQEQAAAAAEE6gMBAAAAAYIEgAAAAAGVBAAAALcEArcEQAAAAAEDAAAAGQAgOwAAjw4AIDwAAJkOACAOAAAAGQAgCAAAsQkAIAsAALIJACA0AACZDgAg6gMBAOgHACGhBAAAsAnfBCK4BAEA6AcAIdUEAQDzBwAh2gRAAOwHACHdBAEA6AcAId8EAQDoBwAh4ARAAOsHACHhBEAA7AcAIeIEQADsBwAhDAgAALEJACALAACyCQAg6gMBAOgHACGhBAAAsAnfBCK4BAEA6AcAIdUEAQDzBwAh2gRAAOwHACHdBAEA6AcAId8EAQDoBwAh4ARAAOsHACHhBEAA7AcAIeIEQADsBwAhAwAAABsAIDsAAJEOACA8AACcDgAgHQAAABsAIAYAAN4LACAfAADlCwAgJAAA6QsAICUAAN8LACAmAADgCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACA0AACcDgAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAADeCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACAoAADiCwAgKQAA4wsAICoAAOQLACArAADnCwAgLAAA6AsAIC0AAOoLACAuAADrCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIQMAAAAFACA7AACTDgAgPAAAnw4AICEAAAAFACAEAADFCgAgBQAAxgoAIAYAAMcKACAHAADICgAgFwAAzAoAIB4AAMkKACAfAADKCgAgNAAAnw4AIOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACEfBAAAxQoAIAUAAMYKACAGAADHCgAgBwAAyAoAIBcAAMwKACAeAADJCgAgHwAAygoAIOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACETBgAAuQoAIAcAALoKACAKAAC7CgAgHQAAvAoAIB4AAL0KACDqAwEAAAABhQRAAAAAAYwEAQAAAAGPBAAAAPEEApEEQAAAAAGeBAEAAAAB7gQBAAAAAe8EAQAAAAHyBAAAAPIEAvMEAgAAAAH0BAIAAAAB9QQBAAAAAfYEIAAAAAH3BEAAAAABAgAAAFMAIDsAAKAOACAUCAAApwkAIAsAAKgJACAOAACpCQAgEQAAqwkAIBIAAKwJACDqAwEAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAA2QQCuAQBAAAAAdQEQAAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAHZBEAAAAAB2gRAAAAAAdsEQAAAAAHcBAIAAAABAgAAAB8AIDsAAKIOACAD6gMBAAAAAYUEQAAAAAHOBAEAAAABCuoDAQAAAAGFBEAAAAABwAQBAAAAAcEEIAAAAAHCBAEAAAABwwQBAAAAAcQEAgAAAAHFBAIAAAABxgQCAAAAAccEAQAAAAEDAAAAUQAgOwAAoA4AIDwAAKgOACAVAAAAUQAgBgAAjQoAIAcAAI4KACAKAACPCgAgHQAAkAoAIB4AAJEKACA0AACoDgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACGeBAEA6AcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9QQBAOgHACH2BCAA6gcAIfcEQADsBwAhEwYAAI0KACAHAACOCgAgCgAAjwoAIB0AAJAKACAeAACRCgAg6gMBAOgHACGFBEAA6wcAIYwEAQDoBwAhjwQAAIsK8QQikQRAAOsHACGeBAEA6AcAIe4EAQDoBwAh7wQBAOgHACHyBAAAjAryBCLzBAIAgggAIfQEAgC0CAAh9QQBAOgHACH2BCAA6gcAIfcEQADsBwAhAwAAAB0AIDsAAKIOACA8AACrDgAgFgAAAB0AIAgAAIQJACALAACFCQAgDgAAhgkAIBEAAIgJACASAACJCQAgNAAAqw4AIOoDAQDoBwAhgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhkQRAAOsHACGhBAAAgwnZBCK4BAEA6AcAIdQEQADsBwAh1QQBAOgHACHWBAEA8wcAIdcEAgCCCAAh2QRAAOwHACHaBEAA6wcAIdsEQADsBwAh3AQCAIIIACEUCAAAhAkAIAsAAIUJACAOAACGCQAgEQAAiAkAIBIAAIkJACDqAwEA6AcAIYMEAQDzBwAhhAQBAPMHACGFBEAA6wcAIZEEQADrBwAhoQQAAIMJ2QQiuAQBAOgHACHUBEAA7AcAIdUEAQDoBwAh1gQBAPMHACHXBAIAgggAIdkEQADsBwAh2gRAAOsHACHbBEAA7AcAIdwEAgCCCAAhBgoAAO4JACDqAwEAAAAB4wQCAAAAAekEAQAAAAHqBAEAAAAB6wQgAAAAAQIAAAATACA7AACsDgAgDgkAAPoIACAQAAD5CAAgFgAA_AgAIBkAAP0IACDqAwEAAAABhQRAAAAAAZEEQAAAAAGhBAAAANQEArUEAQAAAAHPBAEAAAAB0AQBAAAAAdEEAQAAAAHSBAEAAAAB1ARAAAAAAQIAAAAkACA7AACuDgAgAwAAABEAIDsAAKwOACA8AACyDgAgCAAAABEAIAoAAOMJACA0AACyDgAg6gMBAOgHACHjBAIAgggAIekEAQDoBwAh6gQBAOgHACHrBCAA6gcAIQYKAADjCQAg6gMBAOgHACHjBAIAgggAIekEAQDoBwAh6gQBAOgHACHrBCAA6gcAIQMAAAAiACA7AACuDgAgPAAAtQ4AIBAAAAAiACAJAADYCAAgEAAA1wgAIBYAANoIACAZAADbCAAgNAAAtQ4AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIaEEAADWCNQEIrUEAQDoBwAhzwQBAOgHACHQBAEA8wcAIdEEAQDzBwAh0gQBAPMHACHUBEAA7AcAIQ4JAADYCAAgEAAA1wgAIBYAANoIACAZAADbCAAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhoQQAANYI1AQitQQBAOgHACHPBAEA6AcAIdAEAQDzBwAh0QQBAPMHACHSBAEA8wcAIdQEQADsBwAhGwYAAPcMACAMAAD_DAAgHwAA_gwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKQAA_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-gQCAAAAAfsEAgAAAAH9BEAAAAAB_gRAAAAAAf8EQAAAAAGABSAAAAABgQUgAAAAAYIFIAAAAAGDBQIAAAABhAUgAAAAAYUFAQAAAAECAAAABwAgOwAAyg4AIBQIAACnCQAgCwAAqAkAIA4AAKkJACAPAACqCQAgEgAArAkAIOoDAQAAAAGDBAEAAAABhAQBAAAAAYUEQAAAAAGRBEAAAAABoQQAAADZBAK4BAEAAAAB1ARAAAAAAdUEAQAAAAHWBAEAAAAB1wQCAAAAAdkEQAAAAAHaBEAAAAAB2wRAAAAAAdwEAgAAAAECAAAAHwAgOwAAzA4AIAMAAAAFACA7AADKDgAgPAAA0A4AICEAAAAFACAEAADFCgAgBQAAxgoAIAYAAMcKACAHAADICgAgDAAAywoAIB4AAMkKACAfAADKCgAgNAAA0A4AIOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACEfBAAAxQoAIAUAAMYKACAGAADHCgAgBwAAyAoAIAwAAMsKACAeAADJCgAgHwAAygoAIOoDAQDoBwAhhQRAAOsHACGMBAEA6AcAIZEEQADrBwAhngQBAOgHACGhBAAAxAr9BCK6BAIAgggAIe4EAQDoBwAh7wQBAPMHACH1BAEA6AcAIfcEQADsBwAh-AQBAPMHACH5BAIAgggAIfoEAgCCCAAh-wQCAIIIACH9BEAA7AcAIf4EQADsBwAh_wRAAOwHACGABSAA6gcAIYEFIADqBwAhggUgAOoHACGDBQIAgggAIYQFIADqBwAhhQUBAPMHACEDAAAAHQAgOwAAzA4AIDwAANMOACAWAAAAHQAgCAAAhAkAIAsAAIUJACAOAACGCQAgDwAAhwkAIBIAAIkJACA0AADTDgAg6gMBAOgHACGDBAEA8wcAIYQEAQDzBwAhhQRAAOsHACGRBEAA6wcAIaEEAACDCdkEIrgEAQDoBwAh1ARAAOwHACHVBAEA6AcAIdYEAQDzBwAh1wQCAIIIACHZBEAA7AcAIdoEQADrBwAh2wRAAOwHACHcBAIAgggAIRQIAACECQAgCwAAhQkAIA4AAIYJACAPAACHCQAgEgAAiQkAIOoDAQDoBwAhgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhkQRAAOsHACGhBAAAgwnZBCK4BAEA6AcAIdQEQADsBwAh1QQBAOgHACHWBAEA8wcAIdcEAgCCCAAh2QRAAOwHACHaBEAA6wcAIdsEQADsBwAh3AQCAIIIACEUCAAApwkAIAsAAKgJACAOAACpCQAgDwAAqgkAIBEAAKsJACDqAwEAAAABgwQBAAAAAYQEAQAAAAGFBEAAAAABkQRAAAAAAaEEAAAA2QQCuAQBAAAAAdQEQAAAAAHVBAEAAAAB1gQBAAAAAdcEAgAAAAHZBEAAAAAB2gRAAAAAAdsEQAAAAAHcBAIAAAABAgAAAB8AIDsAANQOACADAAAAHQAgOwAA1A4AIDwAANgOACAWAAAAHQAgCAAAhAkAIAsAAIUJACAOAACGCQAgDwAAhwkAIBEAAIgJACA0AADYDgAg6gMBAOgHACGDBAEA8wcAIYQEAQDzBwAhhQRAAOsHACGRBEAA6wcAIaEEAACDCdkEIrgEAQDoBwAh1ARAAOwHACHVBAEA6AcAIdYEAQDzBwAh1wQCAIIIACHZBEAA7AcAIdoEQADrBwAh2wRAAOwHACHcBAIAgggAIRQIAACECQAgCwAAhQkAIA4AAIYJACAPAACHCQAgEQAAiAkAIOoDAQDoBwAhgwQBAPMHACGEBAEA8wcAIYUEQADrBwAhkQRAAOsHACGhBAAAgwnZBCK4BAEA6AcAIdQEQADsBwAh1QQBAOgHACHWBAEA8wcAIdcEAgCCCAAh2QRAAOwHACHaBEAA6wcAIdsEQADsBwAh3AQCAIIIACEQAQAAvgsAICAAAL8LACAhAADACwAgJAAAwgsAIOoDAQAAAAGFBEAAAAABkQRAAAAAAe4EAQAAAAHvBAEAAAAB9wRAAAAAAZAFAQAAAAGRBQEAAAABkgUBAAAAAZMFAQAAAAGUBSAAAAABlQUBAAAAAQIAAACCAgAgOwAA2Q4AIA_qAwEAAAAB6wMBAAAAAYIEgAAAAAGFBEAAAAABkQRAAAAAAZMEAAAAkwQCngQBAAAAAaEEAAAAoQQCogQEAAAAAaMEAQAAAAGkBAEAAAABpQQBAAAAAaYEAQAAAAGnBEAAAAABqARAAAAAAQMAAAADACA7AADZDgAgPAAA3g4AIBIAAAADACABAACWCwAgIAAAlwsAICEAAJgLACAkAACaCwAgNAAA3g4AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIe4EAQDoBwAh7wQBAPMHACH3BEAA7AcAIZAFAQDoBwAhkQUBAPMHACGSBQEA8wcAIZMFAQDzBwAhlAUgAOoHACGVBQEA6AcAIRABAACWCwAgIAAAlwsAICEAAJgLACAkAACaCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAh7gQBAOgHACHvBAEA8wcAIfcEQADsBwAhkAUBAOgHACGRBQEA8wcAIZIFAQDzBwAhkwUBAPMHACGUBSAA6gcAIZUFAQDoBwAhDQYAAKMIACDqAwEAAAABhQRAAAAAAZEEQAAAAAGeBAEAAAABoQQAAACsBAKqBAAAAKoEAqwEAQAAAAGtBAEAAAABrgRAAAAAAa8EQAAAAAGwBCAAAAABsQRAAAAAAQIAAADwBAAgOwAA3w4AIBABAAC-CwAgIAAAvwsAICEAAMALACAjAADBCwAg6gMBAAAAAYUEQAAAAAGRBEAAAAAB7gQBAAAAAe8EAQAAAAH3BEAAAAABkAUBAAAAAZEFAQAAAAGSBQEAAAABkwUBAAAAAZQFIAAAAAGVBQEAAAABAgAAAIICACA7AADhDgAgGwYAAPcMACAMAAD_DAAgHwAA_gwAICUAAPgMACAmAAD5DAAgJwAA-gwAICgAAPsMACApAAD8DAAgKgAA_QwAICsAAIANACAsAACBDQAgLQAAgw0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AADjDgAgAwAAAFUAIDsAAN8OACA8AADnDgAgDwAAAFUAIAYAAJUIACA0AADnDgAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhngQBAOgHACGhBAAAlAisBCKqBAAAkwiqBCKsBAEA8wcAIa0EAQDzBwAhrgRAAOwHACGvBEAA7AcAIbAEIADqBwAhsQRAAOwHACENBgAAlQgAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZ4EAQDoBwAhoQQAAJQIrAQiqgQAAJMIqgQirAQBAPMHACGtBAEA8wcAIa4EQADsBwAhrwRAAOwHACGwBCAA6gcAIbEEQADsBwAhAwAAAAMAIDsAAOEOACA8AADqDgAgEgAAAAMAIAEAAJYLACAgAACXCwAgIQAAmAsAICMAAJkLACA0AADqDgAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAh7gQBAOgHACHvBAEA8wcAIfcEQADsBwAhkAUBAOgHACGRBQEA8wcAIZIFAQDzBwAhkwUBAPMHACGUBSAA6gcAIZUFAQDoBwAhEAEAAJYLACAgAACXCwAgIQAAmAsAICMAAJkLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACHuBAEA6AcAIe8EAQDzBwAh9wRAAOwHACGQBQEA6AcAIZEFAQDzBwAhkgUBAPMHACGTBQEA8wcAIZQFIADqBwAhlQUBAOgHACEDAAAAGwAgOwAA4w4AIDwAAO0OACAdAAAAGwAgBgAA3gsAIAwAAOYLACAfAADlCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIDQAAO0OACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwYAAN4LACAMAADmCwAgHwAA5QsAICUAAN8LACAmAADgCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwYAAPcMACAMAAD_DAAgHwAA_gwAICQAAIINACAlAAD4DAAgJgAA-QwAICcAAPoMACAoAAD7DAAgKQAA_AwAICoAAP0MACArAACADQAgLAAAgQ0AIC4AAIQNACDqAwEAAAABhQRAAAAAAZEEQAAAAAGTBAAAAKsFAqEEAAAAqgUC3QQBAAAAAfcEQAAAAAGIBQEAAAABkAUBAAAAAaYFAQAAAAGoBQAAAKgFAqsFIAAAAAGsBSAAAAABrQVAAAAAAQIAAAABACA7AADuDgAgAwAAABsAIDsAAO4OACA8AADyDgAgHQAAABsAIAYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACAoAADiCwAgKQAA4wsAICoAAOQLACArAADnCwAgLAAA6AsAIC4AAOsLACA0AADyDgAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAuAADrCwAg6gMBAOgHACGFBEAA6wcAIZEEQADrBwAhkwQAAN0LqwUioQQAANwLqgUi3QQBAOgHACH3BEAA7AcAIYgFAQDzBwAhkAUBAOgHACGmBQEA8wcAIagFAADbC6gFIqsFIADqBwAhrAUgAOoHACGtBUAA7AcAIRsGAAD3DAAgDAAA_wwAIB8AAP4MACAkAACCDQAgJQAA-AwAICYAAPkMACAnAAD6DAAgKAAA-wwAICkAAPwMACAqAAD9DAAgKwAAgA0AICwAAIENACAtAACDDQAg6gMBAAAAAYUEQAAAAAGRBEAAAAABkwQAAACrBQKhBAAAAKoFAt0EAQAAAAH3BEAAAAABiAUBAAAAAZAFAQAAAAGmBQEAAAABqAUAAACoBQKrBSAAAAABrAUgAAAAAa0FQAAAAAECAAAAAQAgOwAA8w4AIAMAAAAbACA7AADzDgAgPAAA9w4AIB0AAAAbACAGAADeCwAgDAAA5gsAIB8AAOULACAkAADpCwAgJQAA3wsAICYAAOALACAnAADhCwAgKAAA4gsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgNAAA9w4AIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEbBgAA3gsAIAwAAOYLACAfAADlCwAgJAAA6QsAICUAAN8LACAmAADgCwAgJwAA4QsAICgAAOILACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIOoDAQDoBwAhhQRAAOsHACGRBEAA6wcAIZMEAADdC6sFIqEEAADcC6oFIt0EAQDoBwAh9wRAAOwHACGIBQEA8wcAIZAFAQDoBwAhpgUBAPMHACGoBQAA2wuoBSKrBSAA6gcAIawFIADqBwAhrQVAAOwHACEbBgAA9wwAIAwAAP8MACAfAAD-DAAgJAAAgg0AICUAAPgMACAmAAD5DAAgJwAA-gwAICkAAPwMACAqAAD9DAAgKwAAgA0AICwAAIENACAtAACDDQAgLgAAhA0AIOoDAQAAAAGFBEAAAAABkQRAAAAAAZMEAAAAqwUCoQQAAACqBQLdBAEAAAAB9wRAAAAAAYgFAQAAAAGQBQEAAAABpgUBAAAAAagFAAAAqAUCqwUgAAAAAawFIAAAAAGtBUAAAAABAgAAAAEAIDsAAPgOACADAAAAGwAgOwAA-A4AIDwAAPwOACAdAAAAGwAgBgAA3gsAIAwAAOYLACAfAADlCwAgJAAA6QsAICUAAN8LACAmAADgCwAgJwAA4QsAICkAAOMLACAqAADkCwAgKwAA5wsAICwAAOgLACAtAADqCwAgLgAA6wsAIDQAAPwOACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhGwYAAN4LACAMAADmCwAgHwAA5QsAICQAAOkLACAlAADfCwAgJgAA4AsAICcAAOELACApAADjCwAgKgAA5AsAICsAAOcLACAsAADoCwAgLQAA6gsAIC4AAOsLACDqAwEA6AcAIYUEQADrBwAhkQRAAOsHACGTBAAA3QurBSKhBAAA3AuqBSLdBAEA6AcAIfcEQADsBwAhiAUBAPMHACGQBQEA6AcAIaYFAQDzBwAhqAUAANsLqAUiqwUgAOoHACGsBSAA6gcAIa0FQADsBwAhDwYEAgx2Cg0AJB91CyR7GiVlHSZpHidtHyhxIClzISp0Ayt3BSx6EC1_Ii6DASMGAQABDQAcIAgDIVQFI1YZJF4aCQQJAwUKAwYAAgcAAQxICg0AGBdLDR4OBB9HCwIIAAMJAAUHBgACBwABChAGDQAXD0EJHT8SHkAEAwkABQ0AFhwUBwMKAAYNABUbGAgCFAAJGgAHBgkABQ0AFBAAChMuCBYwEBk1EQcIAAMLAAENAA8OGgsPJQkRJw0SKw4ECAADCxwBDCAKDQAMAQwhAAIIAAMQAAoBEAAKAg8sABItAAIUAAkVMQECFAAJGAASAwkABQ0AExc2EQEXNwACEzgAGTkAARs6AAEcOwADD0QAHUIAHkMABQVMAAxPABdQAB5NAB9OAAMGAAINABskWhoDBlsCIgABI1wZASRdAAMgXwAhYAAkYQABIgABASIAAQEiAAEBIgABASIAAQEiAAEBIoQBAQwMiwEAH4oBACSOAQAlhQEAJoYBACeHAQAoiAEAKokBACuMAQAsjQEALY8BAC6QAQAAAAADDQApQQAqQgArAAAAAw0AKUEAKkIAKwEiAAEBIgABAw0AMEEAMUIAMgAAAAMNADBBADFCADIBIgABASIAAQMNADdBADhCADkAAAADDQA3QQA4QgA5ASIAAQEiAAEDDQA-QQA_QgBAAAAAAw0APkEAP0IAQAAAAAMNAEZBAEdCAEgAAAADDQBGQQBHQgBIAQEAAQEBAAEDDQBNQQBOQgBPAAAAAw0ATUEATkIATwEiAAEBIgABBQ0AVEEAV0IAWKMBAFWkAQBWAAAAAAAFDQBUQQBXQgBYowEAVaQBAFYDBLwCAwYAAgcAAQMEwgIDBgACBwABBQ0AXUEAYEIAYaMBAF6kAQBfAAAAAAAFDQBdQQBgQgBhowEAXqQBAF8CBgACBwABAgYAAgcAAQUNAGZBAGlCAGqjAQBnpAEAaAAAAAAABQ0AZkEAaUIAaqMBAGekAQBoAQkABQEJAAUDDQBvQQBwQgBxAAAAAw0Ab0EAcEIAcQEKAAYBCgAGBQ0AdkEAeUIAeqMBAHekAQB4AAAAAAAFDQB2QQB5QgB6owEAd6QBAHgBCQAFAQkABQUNAH9BAIIBQgCDAaMBAIABpAEAgQEAAAAAAAUNAH9BAIIBQgCDAaMBAIABpAEAgQECCAADCQAFAggAAwkABQUNAIgBQQCLAUIAjAGjAQCJAaQBAIoBAAAAAAAFDQCIAUEAiwFCAIwBowEAiQGkAQCKAQIIAAMLxAMBAggAAwvKAwEDDQCRAUEAkgFCAJMBAAAAAw0AkQFBAJIBQgCTAQMIAAMLAAEO3AMLAwgAAwsAAQ7iAwsFDQCYAUEAmwFCAJwBowEAmQGkAQCaAQAAAAAABQ0AmAFBAJsBQgCcAaMBAJkBpAEAmgECCQAFEAAKAgkABRAACgMNAKEBQQCiAUIAowEAAAADDQChAUEAogFCAKMBAhQACRoABwIUAAkaAAcDDQCoAUEAqQFCAKoBAAAAAw0AqAFBAKkBQgCqAQIUAAkVoAQBAhQACRWmBAEFDQCvAUEAsgFCALMBowEAsAGkAQCxAQAAAAAABQ0ArwFBALIBQgCzAaMBALABpAEAsQECFAAJGAASAhQACRgAEgUNALgBQQC7AUIAvAGjAQC5AaQBALoBAAAAAAAFDQC4AUEAuwFCALwBowEAuQGkAQC6AQIIAAMQAAoCCAADEAAKBQ0AwQFBAMQBQgDFAaMBAMIBpAEAwwEAAAAAAAUNAMEBQQDEAUIAxQGjAQDCAaQBAMMBARAACgEQAAoDDQDKAUEAywFCAMwBAAAAAw0AygFBAMsBQgDMAQEGAAIBBgACAw0A0QFBANIBQgDTAQAAAAMNANEBQQDSAUIA0wEDBpIFAiIAASOTBRkDBpkFAiIAASOaBRkFDQDYAUEA2wFCANwBowEA2QGkAQDaAQAAAAAABQ0A2AFBANsBQgDcAaMBANkBpAEA2gEAAAAFDQDiAUEA5QFCAOYBowEA4wGkAQDkAQAAAAAABQ0A4gFBAOUBQgDmAaMBAOMBpAEA5AEBIgABASIAAQMNAOsBQQDsAUIA7QEAAAADDQDrAUEA7AFCAO0BASLbBQEBIuEFAQMNAPIBQQDzAUIA9AEAAAADDQDyAUEA8wFCAPQBASIAAQEiAAEDDQD5AUEA-gFCAPsBAAAAAw0A-QFBAPoBQgD7AS8CATCRAQExkwEBMpQBATOVAQE1lwEBNpkBJTeaASY4nAEBOZ4BJTqfASc9oAEBPqEBAT-iASVDpQEoRKYBLEWnAR1GqAEdR6kBHUiqAR1JqwEdSq0BHUuvASVMsAEtTbIBHU60ASVPtQEuULYBHVG3AR1SuAElU7sBL1S8ATNVvQEfVr4BH1e_AR9YwAEfWcEBH1rDAR9bxQElXMYBNF3IAR9eygElX8sBNWDMAR9hzQEfYs4BJWPRATZk0gE6ZdMBHmbUAR5n1QEeaNYBHmnXAR5q2QEea9sBJWzcATtt3gEebuABJW_hATxw4gEeceMBHnLkASVz5wE9dOgBQXXqAUJ26wFCd-4BQnjvAUJ58AFCevIBQnv0ASV89QFDffcBQn75ASV_-gFEgAH7AUKBAfwBQoIB_QElgwGAAkWEAYECSYUBgwIChgGEAgKHAYYCAogBhwICiQGIAgKKAYoCAosBjAIljAGNAkqNAY8CAo4BkQIljwGSAkuQAZMCApEBlAICkgGVAiWTAZgCTJQBmQJQlQGbAiGWAZwCIZcBngIhmAGfAiGZAaACIZoBogIhmwGkAiWcAaUCUZ0BpwIhngGpAiWfAaoCUqABqwIhoQGsAiGiAa0CJaUBsAJTpgGxAlmnAbICA6gBswIDqQG0AgOqAbUCA6sBtgIDrAG4AgOtAboCJa4BuwJarwG-AgOwAcACJbEBwQJbsgHDAgOzAcQCA7QBxQIltQHIAly2AckCYrcBygIFuAHLAgW5AcwCBboBzQIFuwHOAgW8AdACBb0B0gIlvgHTAmO_AdUCBcAB1wIlwQHYAmTCAdkCBcMB2gIFxAHbAiXFAd4CZcYB3wJrxwHhAgbIAeICBskB5AIGygHlAgbLAeYCBswB6AIGzQHqAiXOAesCbM8B7QIG0AHvAiXRAfACbdIB8QIG0wHyAgbUAfMCJdUB9gJu1gH3AnLXAfgCB9gB-QIH2QH6AgfaAfsCB9sB_AIH3AH-AgfdAYADJd4BgQNz3wGDAwfgAYUDJeEBhgN04gGHAwfjAYgDB-QBiQMl5QGMA3XmAY0De-cBjgMS6AGPAxLpAZADEuoBkQMS6wGSAxLsAZQDEu0BlgMl7gGXA3zvAZkDEvABmwMl8QGcA33yAZ0DEvMBngMS9AGfAyX1AaIDfvYBowOEAfcBpAME-AGlAwT5AaYDBPoBpwME-wGoAwT8AaoDBP0BrAMl_gGtA4UB_wGvAwSAArEDJYECsgOGAYICswMEgwK0AwSEArUDJYUCuAOHAYYCuQONAYcCugMLiAK7AwuJArwDC4oCvQMLiwK-AwuMAsADC40CwgMljgLDA44BjwLGAwuQAsgDJZECyQOPAZICywMLkwLMAwuUAs0DJZUC0AOQAZYC0QOUAZcC0gMKmALTAwqZAtQDCpoC1QMKmwLWAwqcAtgDCp0C2gMlngLbA5UBnwLeAwqgAuADJaEC4QOWAaIC4wMKowLkAwqkAuUDJaUC6AOXAaYC6QOdAacC6gMJqALrAwmpAuwDCaoC7QMJqwLuAwmsAvADCa0C8gMlrgLzA54BrwL1AwmwAvcDJbEC-AOfAbIC-QMJswL6Awm0AvsDJbUC_gOgAbYC_wOkAbcCgAQIuAKBBAi5AoIECLoCgwQIuwKEBAi8AoYECL0CiAQlvgKJBKUBvwKLBAjAAo0EJcECjgSmAcICjwQIwwKQBAjEApEEJcUClASnAcYClQSrAccClgQQyAKXBBDJApgEEMoCmQQQywKaBBDMApwEEM0CngQlzgKfBKwBzwKiBBDQAqQEJdECpQStAdICpwQQ0wKoBBDUAqkEJdUCrASuAdYCrQS0AdcCrgQR2AKvBBHZArAEEdoCsQQR2wKyBBHcArQEEd0CtgQl3gK3BLUB3wK5BBHgArsEJeECvAS2AeICvQQR4wK-BBHkAr8EJeUCwgS3AeYCwwS9AecCxAQN6ALFBA3pAsYEDeoCxwQN6wLIBA3sAsoEDe0CzAQl7gLNBL4B7wLPBA3wAtEEJfEC0gS_AfIC0wQN8wLUBA30AtUEJfUC2ATAAfYC2QTGAfcC2gQO-ALbBA75AtwEDvoC3QQO-wLeBA78AuAEDv0C4gQl_gLjBMcB_wLlBA6AA-cEJYED6ATIAYID6QQOgwPqBA6EA-sEJYUD7gTJAYYD7wTNAYcD8QQZiAPyBBmJA_QEGYoD9QQZiwP2BBmMA_gEGY0D-gQljgP7BM4BjwP9BBmQA_8EJZEDgAXPAZIDgQUZkwOCBRmUA4MFJZUDhgXQAZYDhwXUAZcDiAUamAOJBRqZA4oFGpoDiwUamwOMBRqcA44FGp0DkAUlngORBdUBnwOVBRqgA5cFJaEDmAXWAaIDmwUaowOcBRqkA50FJaUDoAXXAaYDoQXdAacDowXeAagDpAXeAakDpwXeAaoDqAXeAasDqQXeAawDqwXeAa0DrQUlrgOuBd8BrwOwBd4BsAOyBSWxA7MF4AGyA7QF3gGzA7UF3gG0A7YFJbUDuQXhAbYDugXnAbcDuwUiuAO8BSK5A70FIroDvgUiuwO_BSK8A8EFIr0DwwUlvgPEBegBvwPGBSLAA8gFJcEDyQXpAcIDygUiwwPLBSLEA8wFJcUDzwXqAcYD0AXuAccD0QUjyAPSBSPJA9MFI8oD1AUjywPVBSPMA9cFI80D2QUlzgPaBe8BzwPdBSPQA98FJdED4AXwAdID4gUj0wPjBSPUA-QFJdUD5wXxAdYD6AX1AdcD6QUg2APqBSDZA-sFINoD7AUg2wPtBSDcA-8FIN0D8QUl3gPyBfYB3wP0BSDgA_YFJeED9wX3AeID-AUg4wP5BSDkA_oFJeUD_QX4AeYD_gX8AQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AssessmentAttemptScalarFieldEnum: () => AssessmentAttemptScalarFieldEnum,
  AssessmentInvitationScalarFieldEnum: () => AssessmentInvitationScalarFieldEnum,
  AssessmentProblemScalarFieldEnum: () => AssessmentProblemScalarFieldEnum,
  AssessmentScalarFieldEnum: () => AssessmentScalarFieldEnum,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  CandidateProfileScalarFieldEnum: () => CandidateProfileScalarFieldEnum,
  CompanyScalarFieldEnum: () => CompanyScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  McqOptionScalarFieldEnum: () => McqOptionScalarFieldEnum,
  McqProblemScalarFieldEnum: () => McqProblemScalarFieldEnum,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PaymentWebhookEventScalarFieldEnum: () => PaymentWebhookEventScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProblemScalarFieldEnum: () => ProblemScalarFieldEnum,
  ProctoringEventScalarFieldEnum: () => ProctoringEventScalarFieldEnum,
  QueryMode: () => QueryMode,
  ResultScalarFieldEnum: () => ResultScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubmissionAnswerScalarFieldEnum: () => SubmissionAnswerScalarFieldEnum,
  SubmissionEvaluationScalarFieldEnum: () => SubmissionEvaluationScalarFieldEnum,
  SubmissionScalarFieldEnum: () => SubmissionScalarFieldEnum,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TestCaseResultScalarFieldEnum: () => TestCaseResultScalarFieldEnum,
  TestCaseScalarFieldEnum: () => TestCaseScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TwoFactorScalarFieldEnum: () => TwoFactorScalarFieldEnum,
  UserConsentScalarFieldEnum: () => UserConsentScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
var runtime2 = __toESM(require("@prisma/client/runtime/client"), 1);
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Account: "Account",
  TwoFactor: "TwoFactor",
  Session: "Session",
  Verification: "Verification",
  Company: "Company",
  CandidateProfile: "CandidateProfile",
  Assessment: "Assessment",
  Problem: "Problem",
  McqProblem: "McqProblem",
  McqOption: "McqOption",
  TestCase: "TestCase",
  AssessmentProblem: "AssessmentProblem",
  AssessmentInvitation: "AssessmentInvitation",
  AssessmentAttempt: "AssessmentAttempt",
  Submission: "Submission",
  SubmissionAnswer: "SubmissionAnswer",
  SubmissionEvaluation: "SubmissionEvaluation",
  TestCaseResult: "TestCaseResult",
  Result: "Result",
  ProctoringEvent: "ProctoringEvent",
  Subscription: "Subscription",
  Payment: "Payment",
  PaymentWebhookEvent: "PaymentWebhookEvent",
  Notification: "Notification",
  AuditLog: "AuditLog",
  UserConsent: "UserConsent"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  image: "image",
  phone: "phone",
  role: "role",
  status: "status",
  provider: "provider",
  emailVerified: "emailVerified",
  twoFactorEnabled: "twoFactorEnabled",
  lastLoginAt: "lastLoginAt",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AccountScalarFieldEnum = {
  id: "id",
  userId: "userId",
  accountId: "accountId",
  providerId: "providerId",
  issuer: "issuer",
  password: "password",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TwoFactorScalarFieldEnum = {
  id: "id",
  userId: "userId",
  secret: "secret",
  backupCodes: "backupCodes"
};
var SessionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  token: "token",
  expiresAt: "expiresAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CompanyScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  website: "website",
  industry: "industry",
  logo: "logo",
  isVerified: "isVerified",
  ownerId: "ownerId",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CandidateProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  headline: "headline",
  bio: "bio",
  phone: "phone",
  location: "location",
  resumeUrl: "resumeUrl",
  linkedinUrl: "linkedinUrl",
  githubUrl: "githubUrl",
  portfolioUrl: "portfolioUrl",
  skills: "skills",
  experienceYears: "experienceYears",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AssessmentScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  description: "description",
  instructions: "instructions",
  durationMinutes: "durationMinutes",
  totalMarks: "totalMarks",
  passingMarks: "passingMarks",
  maxAttempts: "maxAttempts",
  status: "status",
  startAt: "startAt",
  endAt: "endAt",
  publishedAt: "publishedAt",
  shuffleQuestions: "shuffleQuestions",
  showResultImmediately: "showResultImmediately",
  allowReview: "allowReview",
  version: "version",
  isLatestVersion: "isLatestVersion",
  parentAssessmentId: "parentAssessmentId",
  companyId: "companyId",
  createdById: "createdById",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProblemScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  description: "description",
  type: "type",
  difficulty: "difficulty",
  defaultMarks: "defaultMarks",
  timeLimitSeconds: "timeLimitSeconds",
  companyId: "companyId",
  createdById: "createdById",
  isPublic: "isPublic",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var McqProblemScalarFieldEnum = {
  id: "id",
  problemId: "problemId",
  type: "type",
  explanation: "explanation"
};
var McqOptionScalarFieldEnum = {
  id: "id",
  mcqProblemId: "mcqProblemId",
  optionText: "optionText",
  order: "order",
  isCorrect: "isCorrect"
};
var TestCaseScalarFieldEnum = {
  id: "id",
  problemId: "problemId",
  input: "input",
  expectedOutput: "expectedOutput",
  isSample: "isSample",
  points: "points",
  timeLimitMs: "timeLimitMs",
  memoryLimitMb: "memoryLimitMb",
  createdAt: "createdAt"
};
var AssessmentProblemScalarFieldEnum = {
  id: "id",
  assessmentId: "assessmentId",
  problemId: "problemId",
  order: "order",
  marks: "marks",
  createdAt: "createdAt"
};
var AssessmentInvitationScalarFieldEnum = {
  id: "id",
  assessmentId: "assessmentId",
  candidateId: "candidateId",
  email: "email",
  status: "status",
  tokenHash: "tokenHash",
  invitedAt: "invitedAt",
  acceptedAt: "acceptedAt",
  expiresAt: "expiresAt",
  completedAt: "completedAt"
};
var AssessmentAttemptScalarFieldEnum = {
  id: "id",
  assessmentId: "assessmentId",
  candidateId: "candidateId",
  invitationId: "invitationId",
  attemptNumber: "attemptNumber",
  status: "status",
  startedAt: "startedAt",
  submittedAt: "submittedAt",
  expiresAt: "expiresAt",
  autoSubmittedAt: "autoSubmittedAt",
  tabSwitchCount: "tabSwitchCount",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubmissionScalarFieldEnum = {
  id: "id",
  attemptId: "attemptId",
  problemId: "problemId",
  answerText: "answerText",
  code: "code",
  language: "language",
  status: "status",
  submittedAt: "submittedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubmissionAnswerScalarFieldEnum = {
  id: "id",
  submissionId: "submissionId",
  optionId: "optionId",
  createdAt: "createdAt"
};
var SubmissionEvaluationScalarFieldEnum = {
  id: "id",
  submissionId: "submissionId",
  evaluatorId: "evaluatorId",
  score: "score",
  maxScore: "maxScore",
  feedback: "feedback",
  status: "status",
  isAutoEvaluated: "isAutoEvaluated",
  evaluatedAt: "evaluatedAt",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TestCaseResultScalarFieldEnum = {
  id: "id",
  submissionId: "submissionId",
  testCaseId: "testCaseId",
  passed: "passed",
  actualOutput: "actualOutput",
  expectedOutput: "expectedOutput",
  executionTimeMs: "executionTimeMs",
  memoryUsedMb: "memoryUsedMb",
  points: "points",
  errorMessage: "errorMessage",
  createdAt: "createdAt"
};
var ResultScalarFieldEnum = {
  id: "id",
  attemptId: "attemptId",
  assessmentId: "assessmentId",
  totalScore: "totalScore",
  totalMarks: "totalMarks",
  percentage: "percentage",
  status: "status",
  rank: "rank",
  evaluatedAt: "evaluatedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProctoringEventScalarFieldEnum = {
  id: "id",
  attemptId: "attemptId",
  eventType: "eventType",
  timestamp: "timestamp",
  metadata: "metadata"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  companyId: "companyId",
  plan: "plan",
  status: "status",
  stripeCustomerId: "stripeCustomerId",
  stripeSubscriptionId: "stripeSubscriptionId",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  cancelledAt: "cancelledAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  companyId: "companyId",
  subscriptionId: "subscriptionId",
  provider: "provider",
  status: "status",
  amountMinor: "amountMinor",
  currency: "currency",
  transactionId: "transactionId",
  providerPaymentId: "providerPaymentId",
  idempotencyKey: "idempotencyKey",
  metadata: "metadata",
  paidAt: "paidAt",
  failedAt: "failedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentWebhookEventScalarFieldEnum = {
  id: "id",
  provider: "provider",
  eventId: "eventId",
  eventType: "eventType",
  payload: "payload",
  processed: "processed",
  processedAt: "processedAt",
  retryCount: "retryCount",
  maxRetries: "maxRetries",
  lastRetryAt: "lastRetryAt",
  nextRetryAt: "nextRetryAt",
  createdAt: "createdAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  message: "message",
  type: "type",
  isRead: "isRead",
  metadata: "metadata",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AuditLogScalarFieldEnum = {
  id: "id",
  userId: "userId",
  action: "action",
  entity: "entity",
  entityId: "entityId",
  oldValue: "oldValue",
  newValue: "newValue",
  metadata: "metadata",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt"
};
var UserConsentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  consentType: "consentType",
  granted: "granted",
  grantedAt: "grantedAt",
  revokedAt: "revokedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
var import_meta = {};
globalThis["__dirname"] = path.dirname((0, import_node_url.fileURLToPath)(import_meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/errors/handlePrismaError.ts
var handlePrismaError = (error) => {
  if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    return {
      statusCode: import_http_status_codes.StatusCodes.BAD_REQUEST,
      message: "Invalid request data.",
      errorCode: "PRISMA_VALIDATION_ERROR"
    };
  }
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          statusCode: import_http_status_codes.StatusCodes.CONFLICT,
          message: "Resource already exists.",
          errorCode: error.code
        };
      case "P2003":
        return {
          statusCode: import_http_status_codes.StatusCodes.BAD_REQUEST,
          message: "Foreign key constraint failed.",
          errorCode: error.code
        };
      case "P2025":
        return {
          statusCode: import_http_status_codes.StatusCodes.NOT_FOUND,
          message: "Resource not found.",
          errorCode: error.code
        };
      default:
        return {
          statusCode: import_http_status_codes.StatusCodes.BAD_REQUEST,
          message: "Database request failed.",
          errorCode: error.code
        };
    }
  }
  if (error instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (error.errorCode === "P1000") {
      return {
        statusCode: import_http_status_codes.StatusCodes.UNAUTHORIZED,
        message: "Database authentication failed.",
        errorCode: "P1000"
      };
    }
    if (error.errorCode === "P1001") {
      return {
        statusCode: import_http_status_codes.StatusCodes.SERVICE_UNAVAILABLE,
        message: "Can't reach database server.",
        errorCode: "P1001"
      };
    }
    return {
      statusCode: import_http_status_codes.StatusCodes.SERVICE_UNAVAILABLE,
      message: "Database connection failed.",
      errorCode: error.errorCode ?? "PRISMA_INIT_ERROR"
    };
  }
  if (error instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    return {
      statusCode: import_http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Database query failed.",
      errorCode: "PRISMA_UNKNOWN_ERROR"
    };
  }
  return null;
};

// src/app/errors/handleZodError.ts
var import_http_status_codes2 = require("http-status-codes");
var handleZodError = (error) => {
  return {
    statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
    message: "Validation failed",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }))
  };
};

// src/app/middlewares/globalErrorHandler.ts
var globalErrorHandler = (error, _req, res, _next) => {
  let statusCode = import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorCode;
  let errors = [];
  if (error instanceof appError_default) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode;
    errors = Array.isArray(error.details) ? error.details : error.details !== void 0 ? [error.details] : [];
  } else if (error instanceof import_zod2.ZodError) {
    const zodError = handleZodError(error);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.details;
  } else {
    const prismaError = handlePrismaError(error);
    if (prismaError) {
      statusCode = prismaError.statusCode;
      message = prismaError.message;
      errorCode = prismaError.errorCode;
    } else if (error instanceof Error) {
      message = error.message;
    }
  }
  const response = { success: false, message, errors };
  if (errorCode) response.errorCode = errorCode;
  if (config_default.app.env === "development") {
    response.stack = error instanceof Error ? error.stack : void 0;
  }
  res.status(statusCode).json(response);
};

// src/app/middlewares/notFound.ts
var import_http_status_codes4 = require("http-status-codes");
var notFound = (req, res) => {
  res.status(import_http_status_codes4.StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found.",
    errors: [{ path: req.originalUrl }]
  });
};

// src/app/middlewares/rateLimiters.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_http_status_codes5 = require("http-status-codes");
var makeLimiter = (windowMs, limit, message) => (0, import_express_rate_limit.default)({
  windowMs,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: import_http_status_codes5.StatusCodes.TOO_MANY_REQUESTS,
    message
  }
});
var generalRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  300,
  "Too many requests. Please try again later."
);
var authRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  10,
  "Too many login attempts. Please try again in 15 minutes."
);
var publicRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  20,
  "Too many requests. Please try again later."
);

// src/app/middlewares/sanitizeBody.ts
var UNSAFE_KEYS = ["__proto__", "constructor", "prototype"];
var stripUnsafeKeys = (value) => {
  if (Array.isArray(value)) return value.map(stripUnsafeKeys);
  if (value !== null && typeof value === "object") {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (UNSAFE_KEYS.includes(key)) continue;
      clean[key] = stripUnsafeKeys(val);
    }
    return clean;
  }
  return value;
};
var sanitizeBody = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = stripUnsafeKeys(req.body);
  }
  next();
};

// src/app/modules/webhook/webhook.routes.ts
var import_express = __toESM(require("express"), 1);

// src/app/modules/webhook/webhook.controller.ts
var import_http_status_codes8 = require("http-status-codes");

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/payment/payment.service.ts
var import_http_status_codes7 = require("http-status-codes");

// src/lib/prisma.ts
var import_adapter_pg = require("@prisma/adapter-pg");
var adapter = new import_adapter_pg.PrismaPg({ connectionString: config_default.database.url });
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (config_default.app.env !== "production") {
  globalForPrisma.prisma = prisma;
}

// src/lib/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);
var stripe = config_default.stripe.secretKey ? new import_stripe.default(config_default.stripe.secretKey) : null;
var getStripe = () => {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in your .env file."
    );
  }
  return stripe;
};

// src/app/queryBuilder/constants.ts
var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 10;
var DEFAULT_MAX_LIMIT = 100;
var DEFAULT_SORT_FIELD = "createdAt";
var DEFAULT_MAX_INCLUDE = 5;
var DEFAULT_MAX_NESTED_DEPTH = 2;
var DEFAULT_MAX_SEARCH_LENGTH = 150;
var RESERVED_QUERY_KEYS = [
  "page",
  "limit",
  "search",
  "sortBy",
  "sortOrder",
  "sort",
  "fields",
  "include"
];
var OPERATOR_MAP = {
  eq: "equals",
  not: "not",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  in: "in",
  notIn: "notIn",
  contains: "contains",
  startsWith: "startsWith",
  endsWith: "endsWith"
};
var VALID_OPERATORS = Object.keys(OPERATOR_MAP);
var OPERATORS_BY_TYPE = {
  string: ["eq", "not", "in", "notIn", "contains", "startsWith", "endsWith"],
  number: ["eq", "not", "gt", "gte", "lt", "lte", "in", "notIn"],
  decimal: ["eq", "not", "gt", "gte", "lt", "lte", "in", "notIn"],
  date: ["eq", "not", "gt", "gte", "lt", "lte", "in", "notIn"],
  boolean: ["eq", "not"],
  enum: ["eq", "not", "in", "notIn"]
};
var UNSAFE_KEYS2 = ["__proto__", "constructor", "prototype"];
var DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

// src/app/queryBuilder/marge.ts
var buildNestedField = (path2, condition) => {
  const segments = path2.split(".");
  for (const segment of segments) {
    if (UNSAFE_KEYS2.includes(segment)) return {};
  }
  return segments.reduceRight(
    (acc, part) => ({ [part]: acc }),
    condition
  );
};
var deepMerge = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    if (UNSAFE_KEYS2.includes(key)) continue;
    const isPlainObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
    if (isPlainObj(value) && isPlainObj(target[key])) {
      deepMerge(
        target[key],
        value
      );
    } else {
      target[key] = value;
    }
  }
  return target;
};
var buildWhereFromFilters = (filters) => {
  const grouped = {};
  for (const { field, operator, value } of filters) {
    const prismaOp = OPERATOR_MAP[operator];
    if (!prismaOp) continue;
    grouped[field] = { ...grouped[field] ?? {}, [prismaOp]: value };
  }
  const where = {};
  for (const [field, condition] of Object.entries(grouped)) {
    deepMerge(where, buildNestedField(field, condition));
  }
  return where;
};
var buildSearchWhere = (search, searchableFields = []) => {
  if (!search || searchableFields.length === 0) return void 0;
  return {
    OR: searchableFields.map(
      (field) => buildNestedField(field, { contains: search, mode: "insensitive" })
    )
  };
};
var buildWhere = (parsed2, config3, tenantScope) => {
  const conditions = [];
  const filterWhere = buildWhereFromFilters(parsed2.filters);
  if (Object.keys(filterWhere).length > 0) conditions.push(filterWhere);
  const searchWhere = buildSearchWhere(parsed2.search, config3.searchableFields);
  if (searchWhere) conditions.push(searchWhere);
  if (config3.softDelete) conditions.push({ deletedAt: null });
  if (tenantScope) conditions.push(tenantScope);
  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0] ?? {};
  return { AND: conditions };
};
var buildOrderBy = (parsed2, config3) => {
  if (parsed2.sorts.length === 0) {
    return [{ [config3.defaultSortField ?? DEFAULT_SORT_FIELD]: "desc" }];
  }
  return parsed2.sorts.map(({ field, order }) => buildNestedField(field, order));
};
var buildDynamicSelect = (fields) => {
  if (!fields || fields.length === 0) return void 0;
  const safeFields = fields.filter((f) => !UNSAFE_KEYS2.includes(f));
  return safeFields.length > 0 ? Object.fromEntries(safeFields.map((f) => [f, true])) : void 0;
};
var buildInclude = (requested, defaultInclude) => {
  const include = { ...defaultInclude ?? {} };
  for (const relation of requested ?? []) {
    if (UNSAFE_KEYS2.includes(relation)) continue;
    include[relation] = true;
  }
  return Object.keys(include).length > 0 ? include : void 0;
};
var buildSelectOrInclude = (parsed2, config3) => {
  const dynamicSelect = buildDynamicSelect(parsed2.fields);
  if (dynamicSelect) return { select: dynamicSelect };
  if (config3.defaultSelect) return { select: config3.defaultSelect };
  const include = buildInclude(parsed2.include, config3.defaultInclude);
  return include ? { include } : {};
};
var buildPrismaArgs = (parsed2, config3, tenantScope) => {
  const { select, include } = buildSelectOrInclude(parsed2, config3);
  return {
    where: buildWhere(parsed2, config3, tenantScope),
    orderBy: buildOrderBy(parsed2, config3),
    skip: parsed2.skip,
    take: parsed2.limit,
    ...select && { select },
    ...include && { include }
  };
};

// src/app/queryBuilder/parser.ts
var import_http_status_codes6 = require("http-status-codes");
var getBaseType = (config3) => typeof config3 === "string" ? config3 : "enum";
var assertValidDepth = (field, maxDepth) => {
  if (field.split(".").length > maxDepth) {
    throw new appError_default(
      import_http_status_codes6.StatusCodes.BAD_REQUEST,
      `Field "${field}" exceeds the maximum allowed nesting depth of ${maxDepth}.`
    );
  }
};
var assertOperatorAllowedForType = (field, operator, type) => {
  const allowed = OPERATORS_BY_TYPE[type] ?? [];
  if (!allowed.includes(operator)) {
    throw new appError_default(
      import_http_status_codes6.StatusCodes.BAD_REQUEST,
      `Operator "${operator}" is not allowed on field "${field}" (type: ${type}).`
    );
  }
};
var isValidCalendarDate = (raw3) => {
  const datePart = raw3.split("T")[0];
  const match = datePart?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};
var castSingleValue = (raw3, field, config3) => {
  if (typeof config3 === "object" && config3.type === "enum") {
    const validValues = Object.values(config3.enum);
    if (!validValues.includes(raw3)) {
      throw new appError_default(
        import_http_status_codes6.StatusCodes.BAD_REQUEST,
        `Invalid value "${raw3}" for "${field}". Expected one of: ${validValues.join(", ")}.`
      );
    }
    return raw3;
  }
  switch (config3) {
    case "number": {
      const num = Number(raw3);
      if (raw3.trim() === "" || Number.isNaN(num)) {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `Invalid number value for "${field}": "${raw3}"`
        );
      }
      return num;
    }
    case "decimal": {
      try {
        return new prismaNamespace_exports.Decimal(raw3);
      } catch {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `Invalid decimal value for "${field}": "${raw3}"`
        );
      }
    }
    case "boolean": {
      if (raw3 !== "true" && raw3 !== "false") {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `"${field}" must be "true" or "false".`
        );
      }
      return raw3 === "true";
    }
    case "date": {
      if (!DATE_STRING_PATTERN.test(raw3)) {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `Invalid date value for "${field}": "${raw3}". Expected format YYYY-MM-DD.`
        );
      }
      if (!isValidCalendarDate(raw3)) {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `"${raw3}" is not a real calendar date for "${field}".`
        );
      }
      const date = new Date(raw3);
      if (Number.isNaN(date.getTime())) {
        throw new appError_default(
          import_http_status_codes6.StatusCodes.BAD_REQUEST,
          `Invalid date value for "${field}": "${raw3}"`
        );
      }
      return date;
    }
    default:
      return raw3;
  }
};
var castValue = (raw3, field, config3, operator) => {
  const str = String(raw3);
  if (operator === "in" || operator === "notIn") {
    return str.split(",").map((v) => castSingleValue(v.trim(), field, config3));
  }
  return castSingleValue(str, field, config3);
};
var parsePagination = (query, maxLimit) => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const requestedLimit = Number(query.limit) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
var parseFilters = (query, config3, maxNestedDepth) => {
  const filters = [];
  for (const [key, rawValue] of Object.entries(query)) {
    if (RESERVED_QUERY_KEYS.includes(key)) continue;
    const fieldConfig = config3.filterableFields[key];
    if (!fieldConfig) continue;
    assertValidDepth(key, maxNestedDepth);
    const baseType = getBaseType(fieldConfig);
    if (rawValue !== null && typeof rawValue === "object" && !Array.isArray(rawValue)) {
      for (const [op, val] of Object.entries(
        rawValue
      )) {
        if (!VALID_OPERATORS.includes(op)) continue;
        assertOperatorAllowedForType(key, op, baseType);
        filters.push({
          field: key,
          operator: op,
          value: castValue(val, key, fieldConfig, op)
        });
      }
    } else {
      assertOperatorAllowedForType(key, "eq", baseType);
      filters.push({
        field: key,
        operator: "eq",
        value: castValue(rawValue, key, fieldConfig, "eq")
      });
    }
  }
  return filters;
};
var parseSort = (query, config3, maxNestedDepth) => {
  const sorts = [];
  const seenFields = /* @__PURE__ */ new Set();
  const pushSort = (field, order) => {
    if (seenFields.has(field)) return;
    seenFields.add(field);
    assertValidDepth(field, maxNestedDepth);
    sorts.push({ field, order });
  };
  if (typeof query.sort === "string" && query.sort.trim() !== "") {
    for (const raw3 of query.sort.split(",")) {
      const trimmed = raw3.trim();
      const desc = trimmed.startsWith("-");
      const field = desc ? trimmed.slice(1) : trimmed;
      if (config3.sortableFields.includes(field))
        pushSort(field, desc ? "desc" : "asc");
    }
    return sorts;
  }
  if (typeof query.sortBy === "string" && config3.sortableFields.includes(query.sortBy)) {
    pushSort(query.sortBy, query.sortOrder === "desc" ? "desc" : "asc");
  }
  return sorts;
};
var parseCsvWhitelisted = (value, allowed, maxItems) => {
  if (typeof value !== "string" || value.trim() === "") return void 0;
  const requested = value.split(",").map((v) => v.trim()).filter(Boolean);
  const filtered = allowed ? requested.filter((f) => allowed.includes(f)) : requested;
  const unique = Array.from(new Set(filtered));
  if (unique.length === 0) return void 0;
  if (maxItems && unique.length > maxItems) {
    throw new appError_default(
      import_http_status_codes6.StatusCodes.BAD_REQUEST,
      `A maximum of ${maxItems} items can be requested at once.`
    );
  }
  return unique;
};
var parseSearch = (query, maxSearchLength) => {
  if (typeof query.search !== "string") return void 0;
  const trimmed = query.search.trim();
  if (trimmed === "") return void 0;
  if (trimmed.length > maxSearchLength) {
    throw new appError_default(
      import_http_status_codes6.StatusCodes.BAD_REQUEST,
      `Search query is too long (max ${maxSearchLength} characters).`
    );
  }
  return trimmed;
};
var parseQuery = (query, config3) => {
  const maxLimit = config3.maxLimit ?? DEFAULT_MAX_LIMIT;
  const maxInclude = config3.maxInclude ?? DEFAULT_MAX_INCLUDE;
  const maxNestedDepth = config3.maxNestedDepth ?? DEFAULT_MAX_NESTED_DEPTH;
  const maxSearchLength = config3.maxSearchLength ?? DEFAULT_MAX_SEARCH_LENGTH;
  const { page, limit, skip } = parsePagination(query, maxLimit);
  const search = parseSearch(query, maxSearchLength);
  const fields = parseCsvWhitelisted(query.fields, config3.selectableFields);
  const include = parseCsvWhitelisted(
    query.include,
    config3.includableRelations,
    maxInclude
  );
  return {
    page,
    limit,
    skip,
    ...search !== void 0 && { search },
    filters: parseFilters(query, config3, maxNestedDepth),
    sorts: parseSort(query, config3, maxNestedDepth),
    ...fields !== void 0 && { fields },
    ...include !== void 0 && { include }
  };
};

// src/app/queryBuilder/queryBuilder.ts
var validateConfig = (config3) => {
  for (const field of config3.selectableFields ?? []) {
    if (field.includes(".")) {
      throw new Error(
        `QueryConfig.selectableFields: "${field}" is invalid \u2014 nested field selection is not supported.`
      );
    }
  }
  for (const relation of config3.includableRelations ?? []) {
    if (relation.includes(".")) {
      throw new Error(
        `QueryConfig.includableRelations: "${relation}" is invalid \u2014 only direct relation names are supported.`
      );
    }
  }
  for (const field of config3.searchableFields ?? []) {
    const baseField = field.includes(".") ? void 0 : field;
    if (baseField && config3.filterableFields[baseField]) {
      const fieldConfig = config3.filterableFields[baseField];
      const baseType = typeof fieldConfig === "string" ? fieldConfig : "enum";
      if (baseType !== "string") {
        throw new Error(
          `QueryConfig.searchableFields: "${field}" is type "${baseType}", but search uses "contains" which only works on strings.`
        );
      }
    }
  }
};
var QueryBuilder = class {
  delegate;
  config;
  constructor(delegate, config3) {
    const merged = {
      maxLimit: DEFAULT_MAX_LIMIT,
      maxInclude: DEFAULT_MAX_INCLUDE,
      maxNestedDepth: DEFAULT_MAX_NESTED_DEPTH,
      maxSearchLength: DEFAULT_MAX_SEARCH_LENGTH,
      defaultSortField: DEFAULT_SORT_FIELD,
      ...config3
    };
    validateConfig(merged);
    this.delegate = delegate;
    this.config = merged;
  }
  parse(rawQuery) {
    return parseQuery(rawQuery, this.config);
  }
  buildArgs(parsed2, tenantScope) {
    return buildPrismaArgs(parsed2, this.config, tenantScope);
  }
  buildMeta(parsed2, total) {
    return {
      page: parsed2.page,
      limit: parsed2.limit,
      total,
      totalPage: Math.max(1, Math.ceil(total / parsed2.limit))
    };
  }
  async execute(rawQuery, tenantScope) {
    const parsed2 = this.parse(rawQuery);
    const args = this.buildArgs(parsed2, tenantScope);
    const where = args.where;
    const [data, total] = await Promise.all([
      this.delegate.findMany({ ...args, where }),
      this.delegate.count({ where })
    ]);
    return { data, meta: this.buildMeta(parsed2, total) };
  }
};

// src/app/modules/payment/payment.const.ts
var PLAN_PRICING = {
  PRO: { amountMinor: 2900, currency: "usd" },
  ENTERPRISE: { amountMinor: 9900, currency: "usd" }
};
var PAYMENT_SELECT = {
  id: true,
  userId: true,
  companyId: true,
  subscriptionId: true,
  provider: true,
  status: true,
  amountMinor: true,
  currency: true,
  transactionId: true,
  providerPaymentId: true,
  paidAt: true,
  failedAt: true,
  createdAt: true
};

// src/app/modules/payment/payment.service.ts
var paymentQueryBuilder = new QueryBuilder(prisma.payment, {
  searchableFields: [],
  filterableFields: {
    status: {
      type: "enum",
      enum: {
        PENDING: "PENDING",
        PROCESSING: "PROCESSING",
        PAID: "PAID",
        FAILED: "FAILED",
        CANCELLED: "CANCELLED",
        REFUNDED: "REFUNDED"
      }
    },
    provider: {
      type: "enum",
      enum: { STRIPE: "STRIPE", BKASH: "BKASH", SSLCOMMERZ: "SSLCOMMERZ" }
    },
    createdAt: "date"
  },
  sortableFields: ["createdAt", "amountMinor"],
  selectableFields: Object.keys(PAYMENT_SELECT),
  defaultSortField: "createdAt"
});
var createCheckoutSession = async (userId, companyId, payload) => {
  const pricing = PLAN_PRICING[payload.plan];
  const stripe2 = getStripe();
  const clientUrl = config_default.app.clientUrl.split(",")[0]?.trim() ?? "http://localhost:3000";
  const payment = await prisma.payment.create({
    data: {
      userId,
      companyId,
      provider: "STRIPE",
      status: "PENDING",
      amountMinor: pricing.amountMinor,
      currency: pricing.currency.toUpperCase(),
      metadata: { plan: payload.plan }
    }
  });
  const session = await stripe2.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: pricing.currency,
          product_data: { name: `${payload.plan} plan subscription` },
          unit_amount: pricing.amountMinor
        },
        quantity: 1
      }
    ],
    success_url: `${clientUrl}/billing/success?paymentId=${payment.id}`,
    cancel_url: `${clientUrl}/billing/cancel?paymentId=${payment.id}`,
    metadata: { paymentId: payment.id, companyId, plan: payload.plan }
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { providerPaymentId: session.id }
  });
  return { paymentId: payment.id, checkoutUrl: session.url };
};
var handleStripeWebhook = async (rawBody, signature) => {
  const stripe2 = getStripe();
  if (!config_default.stripe.webhookSecret) {
    throw new appError_default(
      import_http_status_codes7.StatusCodes.SERVICE_UNAVAILABLE,
      "Stripe webhook secret is not configured."
    );
  }
  if (!signature) {
    throw new appError_default(
      import_http_status_codes7.StatusCodes.BAD_REQUEST,
      "Missing Stripe signature header."
    );
  }
  let event;
  try {
    event = stripe2.webhooks.constructEvent(
      rawBody,
      signature,
      config_default.stripe.webhookSecret
    );
  } catch {
    throw new appError_default(
      import_http_status_codes7.StatusCodes.BAD_REQUEST,
      "Invalid Stripe webhook signature."
    );
  }
  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: { provider_eventId: { provider: "STRIPE", eventId: event.id } }
  });
  if (existingEvent?.processed) {
    return { received: true, alreadyProcessed: true };
  }
  await prisma.paymentWebhookEvent.upsert({
    where: { provider_eventId: { provider: "STRIPE", eventId: event.id } },
    update: {},
    create: {
      provider: "STRIPE",
      eventId: event.id,
      eventType: event.type,
      payload: JSON.parse(JSON.stringify(event))
    }
  });
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    const plan = session.metadata?.plan;
    const companyId = session.metadata?.companyId;
    if (paymentId) {
      await prisma.$transaction(async (tx) => {
        const paymentIntent = session.payment_intent;
        const transactionId = typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;
        const payment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            paidAt: /* @__PURE__ */ new Date(),
            ...transactionId && { transactionId }
          }
        });
        if (companyId && plan) {
          const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
          const subscription = await tx.subscription.upsert({
            where: { companyId },
            update: {
              plan,
              status: "ACTIVE",
              currentPeriodStart: /* @__PURE__ */ new Date(),
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: false
            },
            create: {
              companyId,
              plan,
              status: "ACTIVE",
              currentPeriodStart: /* @__PURE__ */ new Date(),
              currentPeriodEnd: periodEnd
            }
          });
          await tx.payment.update({
            where: { id: paymentId },
            data: { subscriptionId: subscription.id }
          });
        }
        await tx.notification.create({
          data: {
            userId: payment.userId,
            title: "Payment Successful",
            message: `Your payment of ${(Number(payment.amountMinor) / 100).toFixed(2)} ${payment.currency} was successful.`,
            type: "PAYMENT_SUCCESS"
          }
        });
      });
    }
  } else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    if (paymentId) {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "FAILED", failedAt: /* @__PURE__ */ new Date() }
      });
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Payment Failed",
          message: "Your payment could not be completed. Please try again.",
          type: "PAYMENT_FAILED"
        }
      });
    }
  }
  await prisma.paymentWebhookEvent.update({
    where: { provider_eventId: { provider: "STRIPE", eventId: event.id } },
    data: { processed: true, processedAt: /* @__PURE__ */ new Date() }
  });
  return { received: true };
};
var getMyPayments = async (userId, query) => {
  return paymentQueryBuilder.execute(query, { userId });
};
var getAllPayments = async (query) => {
  return paymentQueryBuilder.execute(query);
};
var getPaymentById = async (id, requester) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    select: PAYMENT_SELECT
  });
  if (!payment) {
    throw new appError_default(import_http_status_codes7.StatusCodes.NOT_FOUND, "Payment not found.");
  }
  if (requester.role !== "ADMIN" && payment.userId !== requester.id) {
    throw new appError_default(
      import_http_status_codes7.StatusCodes.FORBIDDEN,
      "You don't have permission to view this payment."
    );
  }
  return payment;
};
var paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getMyPayments,
  getAllPayments,
  getPaymentById
};

// src/app/modules/webhook/webhook.controller.ts
var handleStripeWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const result = await paymentService.handleStripeWebhook(
    req.body,
    signature
  );
  res.status(import_http_status_codes8.StatusCodes.OK).json({
    success: true,
    message: "Webhook processed.",
    data: result
  });
});
var webhookController = {
  handleStripeWebhook: handleStripeWebhook2
};

// src/app/modules/webhook/webhook.routes.ts
var router = (0, import_express.Router)();
router.post(
  "/stripe",
  import_express.default.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);
var webhookRoutes = router;

// src/app/routes/index.ts
var import_express16 = require("express");

// src/app/modules/admin/admin.routes.ts
var import_express2 = require("express");

// src/app/middlewares/requireAuth.ts
var import_node = require("better-auth/node");
var import_http_status_codes10 = require("http-status-codes");

// src/lib/auth.ts
var import_better_auth = require("better-auth");
var import_prisma2 = require("better-auth/adapters/prisma");
var import_api = require("better-auth/api");
var import_plugins = require("better-auth/plugins");

// src/lib/radis.ts
var import_ioredis = __toESM(require("ioredis"), 1);
var redis = config_default.app.env !== "production" || !config_default.redis.url ? new import_ioredis.default({ enableReadyCheck: false, maxRetriesPerRequest: 0 }) : new import_ioredis.default(config_default.redis.url, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3
});
if (config_default.app.env === "production") {
  redis.on("error", (error) => {
    console.error("[Redis] Connection error:", error.message);
  });
}

// src/app/utils/bruteForceGuard.ts
var MAX_ATTEMPTS = 5;
var LOCKOUT_SECONDS = 15 * 60;
var ATTEMPT_WINDOW_SECONDS = 15 * 60;
var attemptsKey = (identifier) => `login:attempts:${identifier}`;
var lockKey = (identifier) => `login:locked:${identifier}`;
var isLocked = async (identifier) => {
  if (config_default.app.env !== "production") {
    return false;
  }
  try {
    const locked = await redis.get(lockKey(identifier));
    return Boolean(locked);
  } catch {
    return false;
  }
};
var recordFailedAttempt = async (identifier) => {
  if (config_default.app.env !== "production") {
    return;
  }
  try {
    const key = attemptsKey(identifier);
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, ATTEMPT_WINDOW_SECONDS);
    }
    if (attempts >= MAX_ATTEMPTS) {
      await redis.set(lockKey(identifier), "1", "EX", LOCKOUT_SECONDS);
      await redis.del(key);
    }
  } catch {
  }
};
var clearFailedAttempts = async (identifier) => {
  if (config_default.app.env !== "production") {
    return;
  }
  try {
    await redis.del(attemptsKey(identifier));
  } catch {
  }
};

// src/app/utils/emailTemplates.ts
var welcomeEmailTemplate = (name) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <h2>Welcome, ${name}!</h2>
    <p>Thanks for joining. Your account has been created successfully.</p>
  </div>
`;
var otpEmailTemplate = (name, otp, expirationMinutes, purpose = "verify your email") => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <h2>Verification Code</h2>
    <p>Hi ${name}, use the code below to ${purpose}.</p>
    <div style="display:inline-block;padding:12px 24px;background:#f0f4ff;color:#007bff;font-size:28px;font-weight:bold;letter-spacing:8px;border-radius:4px;margin-top:20px;">${otp}</div>
    <p style="font-size: 13px; color: #666; margin-top: 16px;">This code will expire in ${expirationMinutes} minutes. If you didn't request this, please ignore this email.</p>
  </div>
`;

// src/lib/nodemailer.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  auth: {
    user: config_default.email.smtpUser,
    pass: config_default.email.smtpPassword
  }
});

// src/app/utils/sendEmailSmtp.ts
var sendEmailSmtp = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: config_default.email.smtpUser,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("[Email] Failed to send email via SMTP:", error);
  }
};

// src/app/utils/verifyCaptcha.ts
var import_http_status_codes9 = require("http-status-codes");
var verifyCaptcha = async (token) => {
  if (!config_default.captcha.hcaptchaSecretKey) return;
  if (config_default.app.env !== "production") {
    return;
  }
  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      secret: config_default.captcha.hcaptchaSecretKey,
      response: token
    })
  });
  if (!response.ok) {
    throw new appError_default(
      import_http_status_codes9.StatusCodes.BAD_GATEWAY,
      "Captcha verification service is unavailable."
    );
  }
  const result = await response.json();
  if (!result.success) {
    throw new appError_default(import_http_status_codes9.StatusCodes.BAD_REQUEST, "Captcha verification failed.");
  }
};

// src/lib/auth.ts
var socialProviders = {};
if (config_default.oauth.google.clientId && config_default.oauth.google.clientSecret) {
  socialProviders.google = {
    clientId: config_default.oauth.google.clientId,
    clientSecret: config_default.oauth.google.clientSecret
  };
}
if (config_default.oauth.github.clientId && config_default.oauth.github.clientSecret) {
  socialProviders.github = {
    clientId: config_default.oauth.github.clientId,
    clientSecret: config_default.oauth.github.clientSecret
  };
}
var trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...config_default.app.clientUrl.split(",").map((origin) => origin.trim()).filter(Boolean)
].filter((origin, index, origins) => origins.indexOf(origin) === index);
if (config_default.app.env !== "production") {
  trustedOrigins.push("null");
}
var auth = (0, import_better_auth.betterAuth)({
  database: (0, import_prisma2.prismaAdapter)(prisma, { provider: "postgresql" }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        // Matches schema.prisma: `enum UserRole { ADMIN RECRUITER CANDIDATE }`
        // and `User.role UserRole @default(CANDIDATE)`. Must never be a value
        // outside that enum, or Postgres will reject the insert.
        defaultValue: "CANDIDATE",
        input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: config_default.app.env === "production"
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  socialProviders,
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  trustedOrigins,
  advanced: {
    useSecureCookies: config_default.app.env === "production",
    defaultCookieAttributes: {
      sameSite: config_default.app.env === "production" ? "none" : "lax",
      secure: config_default.app.env === "production"
    }
  },
  plugins: [
    (0, import_plugins.bearer)(),
    (0, import_plugins.twoFactor)({
      issuer: "YourAppName"
    }),
    (0, import_plugins.emailOTP)({
      otpLength: 6,
      expiresIn: config_default.app.env === "production" ? 5 * 60 : 60 * 60,
      allowedAttempts: 5,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        const user = await prisma.user.findUnique({ where: { email } });
        const name = user?.name ?? "there";
        const subjectAndPurpose = type === "sign-in" ? { subject: "Your sign-in code", purpose: "sign in" } : type === "email-verification" ? { subject: "Verify your email", purpose: "verify your email" } : {
          subject: "Reset your password",
          purpose: "reset your password"
        };
        if (config_default.app.env !== "production") {
          console.log(
            `[Email OTP] ${subjectAndPurpose.purpose} code for ${email}: ${otp}`
          );
        }
        await sendEmailSmtp({
          to: email,
          subject: subjectAndPurpose.subject,
          html: otpEmailTemplate(name, otp, 5, subjectAndPurpose.purpose)
        });
      }
    })
  ],
  // --------------------------------------------------------------
  // Request lifecycle hooks — brute-force lockout + optional captcha
  // --------------------------------------------------------------
  hooks: {
    before: (0, import_api.createAuthMiddleware)(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        if (email && await isLocked(email)) {
          throw new import_api.APIError("TOO_MANY_REQUESTS", {
            message: "Too many failed login attempts. Please try again in 15 minutes."
          });
        }
      }
      if (ctx.path === "/sign-up/email") {
        const captchaToken = ctx.body?.captchaToken;
        if (config_default.captcha.hcaptchaSecretKey && captchaToken) {
          await verifyCaptcha(captchaToken);
        }
      }
    }),
    after: (0, import_api.createAuthMiddleware)(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        const returned = ctx.context.returned;
        const failed = Boolean(
          returned && typeof returned === "object" && "status" in returned && (returned.status ?? 0) >= 400
        );
        if (email) {
          if (failed) {
            await recordFailedAttempt(email);
          } else {
            await clearFailedAttempts(email);
          }
        }
      }
    })
  },
  // --------------------------------------------------------------
  // Database hooks — fires for BOTH credential signup and OAuth
  // (Google/GitHub) signup, since both create a User row the same way
  // --------------------------------------------------------------
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendEmailSmtp({
            to: user.email,
            subject: `Welcome, ${user.name}!`,
            html: welcomeEmailTemplate(user.name)
          });
        }
      }
    }
  }
});

// src/app/middlewares/requireAuth.ts
var requireAuth = catchAsync(
  async (req, _res, next) => {
    const session = await auth.api.getSession({
      headers: (0, import_node.fromNodeHeaders)(req.headers)
    });
    if (!session?.user) {
      throw new appError_default(
        import_http_status_codes10.StatusCodes.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource."
      );
    }
    req.user = session.user;
    next();
  }
);
var requireRole = (...roles) => {
  return catchAsync(
    async (req, _res, next) => {
      if (!req.user) {
        throw new appError_default(import_http_status_codes10.StatusCodes.UNAUTHORIZED, "You are not logged in.");
      }
      if (roles.length && !roles.includes(req.user.role)) {
        throw new appError_default(
          import_http_status_codes10.StatusCodes.FORBIDDEN,
          "You don't have permission to access this resource."
        );
      }
      next();
    }
  );
};

// src/app/modules/admin/admin.controller.ts
var import_http_status_codes11 = require("http-status-codes");

// src/app/modules/admin/admin.const.ts
var AUDIT_LOG_SELECT = {
  id: true,
  userId: true,
  action: true,
  entity: true,
  entityId: true,
  oldValue: true,
  newValue: true,
  metadata: true,
  ipAddress: true,
  userAgent: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true, role: true } }
};

// src/app/modules/admin/admin.service.ts
var auditLogQueryBuilder = new QueryBuilder(
  prisma.auditLog,
  {
    searchableFields: ["entity"],
    filterableFields: {
      action: {
        type: "enum",
        enum: {
          CREATE: "CREATE",
          UPDATE: "UPDATE",
          DELETE: "DELETE",
          LOGIN: "LOGIN",
          LOGOUT: "LOGOUT",
          STATUS_CHANGE: "STATUS_CHANGE",
          ROLE_CHANGE: "ROLE_CHANGE",
          PAYMENT: "PAYMENT",
          SUBMISSION: "SUBMISSION",
          EVALUATION: "EVALUATION",
          SECURITY: "SECURITY"
        }
      },
      entity: "string",
      createdAt: "date"
    },
    sortableFields: ["createdAt"],
    selectableFields: Object.keys(AUDIT_LOG_SELECT),
    defaultSortField: "createdAt"
  }
);
var getAuditLogs = async (query) => {
  return auditLogQueryBuilder.execute(query);
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    usersByRole,
    totalCompanies,
    verifiedCompanies,
    totalProblems,
    totalAssessments,
    assessmentsByStatus,
    totalAttempts,
    attemptsByStatus,
    totalPaidPayments,
    paidRevenue
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.groupBy({
      by: ["role"],
      where: { deletedAt: null },
      _count: { _all: true }
    }),
    prisma.company.count({ where: { deletedAt: null } }),
    prisma.company.count({ where: { deletedAt: null, isVerified: true } }),
    prisma.problem.count({ where: { deletedAt: null } }),
    prisma.assessment.count({ where: { deletedAt: null } }),
    prisma.assessment.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { _all: true }
    }),
    prisma.assessmentAttempt.count(),
    prisma.assessmentAttempt.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountMinor: true }
    })
  ]);
  return {
    users: {
      total: totalUsers,
      byRole: Object.fromEntries(
        usersByRole.map((row) => [row.role, row._count._all])
      )
    },
    companies: { total: totalCompanies, verified: verifiedCompanies },
    problems: { total: totalProblems },
    assessments: {
      total: totalAssessments,
      byStatus: Object.fromEntries(
        assessmentsByStatus.map((row) => [row.status, row._count._all])
      )
    },
    attempts: {
      total: totalAttempts,
      byStatus: Object.fromEntries(
        attemptsByStatus.map((row) => [row.status, row._count._all])
      )
    },
    payments: {
      totalPaid: totalPaidPayments,
      totalRevenueMinor: Number(paidRevenue._sum.amountMinor ?? 0n)
    }
  };
};
var adminService = {
  getDashboardStats,
  getAuditLogs
};

// src/app/modules/admin/admin.controller.ts
var getDashboardStats2 = catchAsync(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(import_http_status_codes11.StatusCodes.OK).json({
    success: true,
    message: "Dashboard stats retrieved successfully.",
    data: stats
  });
});
var getAuditLogs2 = catchAsync(async (req, res) => {
  const result = await adminService.getAuditLogs(
    req.query
  );
  res.status(import_http_status_codes11.StatusCodes.OK).json({
    success: true,
    message: "Audit logs retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var adminController = {
  getDashboardStats: getDashboardStats2,
  getAuditLogs: getAuditLogs2
};

// src/app/modules/admin/admin.routes.ts
var router2 = (0, import_express2.Router)();
router2.use(requireAuth, requireRole("ADMIN"));
router2.get("/dashboard-stats", adminController.getDashboardStats);
router2.get("/audit-logs", adminController.getAuditLogs);
var adminRoutes = router2;

// src/app/modules/assessment/assessment.routes.ts
var import_express3 = require("express");

// src/app/middlewares/validateRequest.ts
var import_http_status_codes12 = require("http-status-codes");
var validateRequest = (schema) => {
  return async (req, _res, next) => {
    const result = await schema.safeParseAsync(req.body ?? {});
    if (!result.success) {
      return next(
        new appError_default(
          import_http_status_codes12.StatusCodes.BAD_REQUEST,
          result.error.issues[0]?.message ?? "Validation failed.",
          "VALIDATION_ERROR",
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        )
      );
    }
    req.body = result.data;
    next();
  };
};

// src/app/modules/assessment/assessment.controller.ts
var import_http_status_codes16 = require("http-status-codes");

// src/app/modules/company/company.service.ts
var import_http_status_codes14 = require("http-status-codes");

// src/app/utils/fileUploader.ts
var import_http_status_codes13 = require("http-status-codes");

// src/lib/cloudinary.ts
var import_cloudinary = require("cloudinary");
var { cloudName, apiKey, apiSecret } = config_default.cloudinary;
var isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);
if (cloudName && apiKey && apiSecret) {
  import_cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}
var getCloudinary = () => {
  if (!isCloudinaryConfigured) {
    throw new appError_default(
      503,
      "Cloudinary is not configured. Set CLOUDINARY_* env vars."
    );
  }
  return import_cloudinary.v2;
};

// src/app/utils/fileUploader.ts
var uploadFileToCloudinary = async (buffer, fileName, folder = "uploads") => {
  if (!buffer || !fileName) {
    throw new appError_default(
      import_http_status_codes13.StatusCodes.BAD_REQUEST,
      "File buffer or file name is missing."
    );
  }
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fileNameWithoutExtension}`;
  const cloudinary2 = getCloudinary();
  return new Promise((resolve, reject) => {
    cloudinary2.uploader.upload_stream(
      { folder, public_id: uniqueName, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          return reject(
            new appError_default(
              import_http_status_codes13.StatusCodes.INTERNAL_SERVER_ERROR,
              "Cloudinary upload failed."
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};

// src/app/utils/generateUniqueSlug.ts
var slugify = (input) => input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "item";
var generateUniqueSlug = async (source, isTaken) => {
  const base = slugify(source);
  let candidate = base;
  let suffix = 2;
  while (await isTaken(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > 1e3) {
      throw new Error(
        `Could not generate a unique slug for "${source}" after 1000 attempts.`
      );
    }
  }
  return candidate;
};

// src/app/modules/company/company.const.ts
var COMPANY_DETAIL_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  website: true,
  industry: true,
  logo: true,
  isVerified: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true
};
var COMPANY_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  website: true,
  industry: true,
  logo: true,
  isVerified: true,
  createdAt: true
};

// src/app/modules/company/company.service.ts
var companyQueryBuilder = new QueryBuilder(prisma.company, {
  searchableFields: ["name", "industry", "description"],
  filterableFields: {
    industry: "string",
    isVerified: "boolean",
    createdAt: "date"
  },
  sortableFields: ["createdAt", "name"],
  selectableFields: Object.keys(COMPANY_LIST_SELECT),
  softDelete: true,
  defaultSortField: "createdAt"
});
var registerCompany = async (userId, payload) => {
  const existing = await prisma.company.findUnique({
    where: { ownerId: userId }
  });
  if (existing && !existing.deletedAt) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.CONFLICT,
      "You already have a company registered."
    );
  }
  const company = await prisma.$transaction(async (tx) => {
    let record;
    if (existing) {
      record = await tx.company.update({
        where: { id: existing.id },
        data: {
          name: payload.name,
          ...payload.description !== void 0 && {
            description: payload.description
          },
          ...payload.website !== void 0 && { website: payload.website },
          ...payload.industry !== void 0 && { industry: payload.industry },
          isVerified: false,
          deletedAt: null
        },
        select: COMPANY_DETAIL_SELECT
      });
    } else {
      const slug = await generateUniqueSlug(
        payload.name,
        (candidate) => tx.company.findUnique({ where: { slug: candidate } }).then(Boolean)
      );
      record = await tx.company.create({
        data: {
          name: payload.name,
          slug,
          ...payload.description !== void 0 && {
            description: payload.description
          },
          ...payload.website !== void 0 && { website: payload.website },
          ...payload.industry !== void 0 && { industry: payload.industry },
          ownerId: userId
        },
        select: COMPANY_DETAIL_SELECT
      });
      await tx.subscription.create({
        data: { companyId: record.id, plan: "FREE", status: "ACTIVE" }
      });
    }
    await tx.user.update({
      where: { id: userId },
      data: { role: "RECRUITER" }
    });
    return record;
  });
  return company;
};
var getAllCompanies = async (query, requesterRole) => {
  const tenantScope = requesterRole === "ADMIN" ? void 0 : { isVerified: true };
  return companyQueryBuilder.execute(query, tenantScope);
};
var getCompanyById = async (id, requesterId, requesterRole) => {
  const company = await prisma.company.findFirst({
    where: { id, deletedAt: null },
    select: COMPANY_DETAIL_SELECT
  });
  if (!company) {
    throw new appError_default(import_http_status_codes14.StatusCodes.NOT_FOUND, "Company not found.");
  }
  const canSeeUnverified = requesterRole === "ADMIN" || company.ownerId === requesterId;
  if (!company.isVerified && !canSeeUnverified) {
    throw new appError_default(import_http_status_codes14.StatusCodes.NOT_FOUND, "Company not found.");
  }
  return company;
};
var getMyCompany = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    select: COMPANY_DETAIL_SELECT
  });
  if (!company) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  return company;
};
var updateMyCompany = async (userId, payload, file) => {
  const existing = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null }
  });
  if (!existing) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  const updateData = {
    ...payload.description !== void 0 && {
      description: payload.description
    },
    ...payload.website !== void 0 && { website: payload.website },
    ...payload.industry !== void 0 && { industry: payload.industry }
  };
  if (file) {
    const uploaded = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      "company-logos"
    );
    updateData.logo = uploaded.secure_url;
  }
  return prisma.company.update({
    where: { id: existing.id },
    data: updateData,
    select: COMPANY_DETAIL_SELECT
  });
};
var verifyCompany = async (id, actorId) => {
  const company = await prisma.company.findFirst({
    where: { id, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(import_http_status_codes14.StatusCodes.NOT_FOUND, "Company not found.");
  }
  if (company.isVerified) {
    throw new appError_default(import_http_status_codes14.StatusCodes.CONFLICT, "Company is already verified.");
  }
  const [updated] = await prisma.$transaction([
    prisma.company.update({
      where: { id },
      data: { isVerified: true },
      select: COMPANY_DETAIL_SELECT
    }),
    prisma.auditLog.create({
      data: {
        userId: actorId,
        action: "STATUS_CHANGE",
        entity: "Company",
        entityId: id,
        oldValue: { isVerified: false },
        newValue: { isVerified: true }
      }
    })
  ]);
  return updated;
};
var softDeleteCompany = async (id, actorId, actorRole) => {
  const company = await prisma.company.findFirst({
    where: { id, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(import_http_status_codes14.StatusCodes.NOT_FOUND, "Company not found.");
  }
  const isOwner = company.ownerId === actorId;
  if (!isOwner && actorRole !== "ADMIN") {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.FORBIDDEN,
      "You don't have permission to delete this company."
    );
  }
  await prisma.$transaction([
    prisma.company.update({
      where: { id },
      data: { deletedAt: /* @__PURE__ */ new Date() }
    }),
    prisma.user.update({
      where: { id: company.ownerId },
      data: { role: "CANDIDATE" }
    })
  ]);
  return { message: "Company deleted successfully." };
};
var getMySubscription = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    include: { subscription: true }
  });
  if (!company) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  return company.subscription ?? { message: "No active subscription." };
};
var updateMySubscription = async (userId, plan) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
  const subscription = await prisma.subscription.upsert({
    where: { companyId: company.id },
    update: {
      plan,
      status: "ACTIVE",
      currentPeriodStart: /* @__PURE__ */ new Date(),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false
    },
    create: {
      companyId: company.id,
      plan,
      status: "ACTIVE",
      currentPeriodStart: /* @__PURE__ */ new Date(),
      currentPeriodEnd: periodEnd
    }
  });
  return subscription;
};
var cancelMySubscription = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    include: { subscription: true }
  });
  if (!company) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  if (!company.subscription) {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.NOT_FOUND,
      "No active subscription to cancel."
    );
  }
  if (company.subscription.status === "CANCELLED" || company.subscription.status === "EXPIRED") {
    throw new appError_default(
      import_http_status_codes14.StatusCodes.CONFLICT,
      "Subscription is already cancelled or expired."
    );
  }
  const updated = await prisma.subscription.update({
    where: { companyId: company.id },
    data: {
      status: "CANCELLED",
      cancelledAt: /* @__PURE__ */ new Date(),
      cancelAtPeriodEnd: true
    }
  });
  return updated;
};
var companyService = {
  registerCompany,
  getAllCompanies,
  getCompanyById,
  getMyCompany,
  updateMyCompany,
  verifyCompany,
  softDeleteCompany,
  getMySubscription,
  updateMySubscription,
  cancelMySubscription
};

// src/app/modules/assessment/assessment.service.ts
var import_http_status_codes15 = require("http-status-codes");

// src/app/modules/assessment/assessment.const.ts
var ASSESSMENT_DETAIL_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  instructions: true,
  durationMinutes: true,
  totalMarks: true,
  passingMarks: true,
  maxAttempts: true,
  status: true,
  startAt: true,
  endAt: true,
  publishedAt: true,
  shuffleQuestions: true,
  showResultImmediately: true,
  allowReview: true,
  version: true,
  isLatestVersion: true,
  companyId: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  assessmentProblems: {
    select: {
      id: true,
      order: true,
      marks: true,
      problem: {
        select: {
          id: true,
          title: true,
          type: true,
          difficulty: true,
          defaultMarks: true
        }
      }
    },
    orderBy: { order: "asc" }
  }
};
var ASSESSMENT_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  status: true,
  durationMinutes: true,
  totalMarks: true,
  passingMarks: true,
  maxAttempts: true,
  startAt: true,
  endAt: true,
  publishedAt: true,
  createdAt: true
};

// src/app/modules/assessment/assessment.service.ts
var assessmentQueryBuilder = new QueryBuilder(prisma.assessment, {
  searchableFields: ["title", "description"],
  filterableFields: {
    status: {
      type: "enum",
      enum: {
        DRAFT: "DRAFT",
        PUBLISHED: "PUBLISHED",
        ACTIVE: "ACTIVE",
        CLOSED: "CLOSED",
        ARCHIVED: "ARCHIVED"
      }
    },
    createdAt: "date"
  },
  sortableFields: ["createdAt", "title", "startAt"],
  selectableFields: Object.keys(ASSESSMENT_LIST_SELECT),
  softDelete: true,
  defaultSortField: "createdAt"
});
var assertProblemsBelongToCompany = async (companyId, problemIds) => {
  const found = await prisma.problem.findMany({
    where: { id: { in: problemIds }, companyId, deletedAt: null },
    select: { id: true }
  });
  if (found.length !== new Set(problemIds).size) {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.BAD_REQUEST,
      "One or more problems were not found in your company's problem bank."
    );
  }
};
var createAssessment = async (companyId, createdById, payload) => {
  await assertProblemsBelongToCompany(
    companyId,
    payload.problems.map((problem) => problem.problemId)
  );
  const slug = await generateUniqueSlug(
    payload.title,
    (candidate) => prisma.assessment.findUnique({
      where: {
        companyId_slug_version: { companyId, slug: candidate, version: 1 }
      }
    }).then(Boolean)
  );
  return prisma.assessment.create({
    data: {
      title: payload.title,
      slug,
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.instructions !== void 0 && {
        instructions: payload.instructions
      },
      durationMinutes: payload.durationMinutes,
      totalMarks: payload.totalMarks,
      passingMarks: payload.passingMarks,
      maxAttempts: payload.maxAttempts ?? 1,
      ...payload.startAt !== void 0 && { startAt: payload.startAt },
      ...payload.endAt !== void 0 && { endAt: payload.endAt },
      shuffleQuestions: payload.shuffleQuestions ?? false,
      showResultImmediately: payload.showResultImmediately ?? false,
      allowReview: payload.allowReview ?? true,
      companyId,
      createdById,
      assessmentProblems: {
        create: payload.problems.map((problem) => ({
          problemId: problem.problemId,
          order: problem.order,
          marks: problem.marks
        }))
      }
    },
    select: ASSESSMENT_DETAIL_SELECT
  });
};
var getAllAssessments = async (query, companyId) => {
  const tenantScope = companyId ? { companyId } : void 0;
  return assessmentQueryBuilder.execute(query, tenantScope);
};
var getAssessmentById = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id, deletedAt: null, ...companyId && { companyId } },
    select: ASSESSMENT_DETAIL_SELECT
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  return assessment;
};
var updateAssessment = async (id, companyId, payload) => {
  const existing = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (existing.status !== "DRAFT") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      "Only DRAFT assessments can be edited. Close this one and create a new assessment instead."
    );
  }
  const effectiveTotalMarks = payload.totalMarks ?? existing.totalMarks;
  if (payload.problems) {
    await assertProblemsBelongToCompany(
      companyId,
      payload.problems.map((problem) => problem.problemId)
    );
    const marksSum = payload.problems.reduce(
      (sum, problem) => sum + problem.marks,
      0
    );
    if (marksSum !== effectiveTotalMarks) {
      throw new appError_default(
        import_http_status_codes15.StatusCodes.BAD_REQUEST,
        `Sum of problem marks (${marksSum}) must equal totalMarks (${effectiveTotalMarks}).`
      );
    }
  }
  const effectivePassingMarks = payload.passingMarks ?? existing.passingMarks;
  if (effectivePassingMarks > effectiveTotalMarks) {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.BAD_REQUEST,
      "Passing marks cannot exceed total marks."
    );
  }
  const { problems, ...topLevel } = payload;
  await prisma.$transaction(async (tx) => {
    if (Object.keys(topLevel).length > 0) {
      await tx.assessment.update({ where: { id }, data: topLevel });
    }
    if (problems) {
      await tx.assessmentProblem.deleteMany({ where: { assessmentId: id } });
      await tx.assessmentProblem.createMany({
        data: problems.map((problem) => ({
          assessmentId: id,
          problemId: problem.problemId,
          order: problem.order,
          marks: problem.marks
        }))
      });
    }
  });
  return getAssessmentById(id, companyId);
};
var publishAssessment = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null },
    include: { assessmentProblems: true }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") {
    return assessment;
  }
  if (assessment.status !== "DRAFT") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      `Cannot publish an assessment with status ${assessment.status}.`
    );
  }
  if (assessment.assessmentProblems.length === 0) {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.BAD_REQUEST,
      "Add at least one problem before publishing."
    );
  }
  const marksSum = assessment.assessmentProblems.reduce(
    (sum, ap) => sum + ap.marks,
    0
  );
  if (marksSum !== assessment.totalMarks) {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.BAD_REQUEST,
      `Sum of problem marks (${marksSum}) does not match totalMarks (${assessment.totalMarks}).`
    );
  }
  return prisma.assessment.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: /* @__PURE__ */ new Date() },
    select: ASSESSMENT_DETAIL_SELECT
  });
};
var closeAssessment = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      `Cannot close an assessment with status ${assessment.status}.`
    );
  }
  return prisma.assessment.update({
    where: { id },
    data: { status: "CLOSED" },
    select: ASSESSMENT_DETAIL_SELECT
  });
};
var softDeleteAssessment = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "DRAFT") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      "Only DRAFT assessments can be deleted. Close a published assessment instead."
    );
  }
  await prisma.assessment.update({
    where: { id },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return { message: "Assessment deleted successfully." };
};
var createAssessmentVersion = async (id, companyId) => {
  const existing = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null },
    include: { assessmentProblems: { include: { problem: true } } }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (existing.status === "DRAFT") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      "Only published or closed assessments can be versioned."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const maxVersionResult = await tx.assessment.aggregate({
      where: {
        companyId,
        slug: existing.slug,
        deletedAt: null
      },
      _max: { version: true }
    });
    const nextVersion = (maxVersionResult._max.version || existing.version) + 1;
    await tx.assessment.updateMany({
      where: {
        companyId,
        slug: existing.slug,
        isLatestVersion: true,
        deletedAt: null
      },
      data: { isLatestVersion: false }
    });
    const newAssessment = await tx.assessment.create({
      data: {
        title: existing.title,
        slug: existing.slug,
        description: existing.description,
        instructions: existing.instructions,
        durationMinutes: existing.durationMinutes,
        totalMarks: existing.totalMarks,
        passingMarks: existing.passingMarks,
        maxAttempts: existing.maxAttempts,
        startAt: existing.startAt,
        endAt: existing.endAt,
        shuffleQuestions: existing.shuffleQuestions,
        showResultImmediately: existing.showResultImmediately,
        allowReview: existing.allowReview,
        version: nextVersion,
        isLatestVersion: true,
        parentAssessmentId: existing.id,
        companyId,
        createdById: existing.createdById,
        status: "DRAFT",
        assessmentProblems: {
          create: existing.assessmentProblems.map((ap) => ({
            problemId: ap.problemId,
            order: ap.order,
            marks: ap.marks
          }))
        }
      },
      select: ASSESSMENT_DETAIL_SELECT
    });
    return newAssessment;
  });
  return result;
};
var getAssessmentVersions = async (id, companyId) => {
  const existing = await prisma.assessment.findFirst({
    where: { id, deletedAt: null, ...companyId && { companyId } },
    select: { id: true, companyId: true, slug: true }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  const versions = await prisma.assessment.findMany({
    where: {
      companyId: existing.companyId,
      slug: existing.slug,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      version: true,
      isLatestVersion: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { version: "desc" }
  });
  return versions;
};
var restoreAssessmentVersion = async (id, companyId) => {
  const target = await prisma.assessment.findFirst({
    where: { id, companyId, deletedAt: null },
    include: { assessmentProblems: { include: { problem: true } } }
  });
  if (!target) {
    throw new appError_default(import_http_status_codes15.StatusCodes.NOT_FOUND, "Assessment version not found.");
  }
  if (target.isLatestVersion && target.status !== "DRAFT") {
    throw new appError_default(
      import_http_status_codes15.StatusCodes.CONFLICT,
      "This is already the latest published version."
    );
  }
  const restored = await prisma.$transaction(async (tx) => {
    const latest = await tx.assessment.findFirst({
      where: {
        companyId,
        slug: target.slug,
        isLatestVersion: true,
        deletedAt: null
      },
      orderBy: { version: "desc" },
      include: { assessmentProblems: true }
    });
    if (!latest) {
      throw new appError_default(
        import_http_status_codes15.StatusCodes.NOT_FOUND,
        "Latest assessment version not found."
      );
    }
    const nextVersion = latest.version + 1;
    await tx.assessment.updateMany({
      where: { companyId, slug: target.slug, isLatestVersion: true },
      data: { isLatestVersion: false }
    });
    return tx.assessment.create({
      data: {
        title: target.title,
        slug: target.slug,
        description: target.description,
        instructions: target.instructions,
        durationMinutes: target.durationMinutes,
        totalMarks: target.totalMarks,
        passingMarks: target.passingMarks,
        maxAttempts: target.maxAttempts,
        startAt: target.startAt,
        endAt: target.endAt,
        shuffleQuestions: target.shuffleQuestions,
        showResultImmediately: target.showResultImmediately,
        allowReview: target.allowReview,
        version: nextVersion,
        isLatestVersion: true,
        parentAssessmentId: target.id,
        companyId,
        createdById: target.createdById,
        status: "DRAFT",
        assessmentProblems: {
          create: target.assessmentProblems.map((ap) => ({
            problemId: ap.problemId,
            order: ap.order,
            marks: ap.marks
          }))
        }
      },
      select: ASSESSMENT_DETAIL_SELECT
    });
  });
  return restored;
};
var assessmentService = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  publishAssessment,
  closeAssessment,
  softDeleteAssessment,
  createAssessmentVersion,
  getAssessmentVersions,
  restoreAssessmentVersion
};

// src/app/modules/assessment/assessment.controller.ts
var resolveScopeCompanyId = async (user) => {
  if (user.role === "ADMIN") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var createAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const assessment = await assessmentService.createAssessment(
    company.id,
    currentUser.id,
    req.body
  );
  res.status(import_http_status_codes16.StatusCodes.CREATED).json({
    success: true,
    message: "Assessment created successfully.",
    data: assessment
  });
});
var getAllAssessments2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId(currentUser);
  const result = await assessmentService.getAllAssessments(
    req.query,
    companyId
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: "Assessments retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getAssessmentById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId(currentUser);
  const assessment = await assessmentService.getAssessmentById(
    req.params.id,
    companyId
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment
  });
});
var updateAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const assessment = await assessmentService.updateAssessment(
    req.params.id,
    company.id,
    req.body
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: "Assessment updated successfully.",
    data: assessment
  });
});
var publishAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const assessment = await assessmentService.publishAssessment(
    req.params.id,
    company.id
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: "Assessment published successfully.",
    data: assessment
  });
});
var closeAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const assessment = await assessmentService.closeAssessment(
    req.params.id,
    company.id
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: "Assessment closed successfully.",
    data: assessment
  });
});
var deleteAssessment = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const result = await assessmentService.softDeleteAssessment(
    req.params.id,
    company.id
  );
  res.status(import_http_status_codes16.StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var createAssessmentVersion2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const company = await companyService.getMyCompany(currentUser.id);
    const assessment = await assessmentService.createAssessmentVersion(
      req.params.id,
      company.id
    );
    res.status(import_http_status_codes16.StatusCodes.CREATED).json({
      success: true,
      message: "New version created successfully.",
      data: assessment
    });
  }
);
var getAssessmentVersions2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await resolveScopeCompanyId(currentUser);
    const versions = await assessmentService.getAssessmentVersions(
      req.params.id,
      companyId
    );
    res.status(import_http_status_codes16.StatusCodes.OK).json({
      success: true,
      message: "Assessment versions retrieved successfully.",
      data: versions
    });
  }
);
var restoreAssessmentVersion2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const company = await companyService.getMyCompany(currentUser.id);
    const assessment = await assessmentService.restoreAssessmentVersion(
      req.params.id,
      company.id
    );
    res.status(import_http_status_codes16.StatusCodes.OK).json({
      success: true,
      message: "Assessment version restored successfully. A new draft version has been created.",
      data: assessment
    });
  }
);
var assessmentController = {
  createAssessment: createAssessment2,
  getAllAssessments: getAllAssessments2,
  getAssessmentById: getAssessmentById2,
  updateAssessment: updateAssessment2,
  publishAssessment: publishAssessment2,
  closeAssessment: closeAssessment2,
  deleteAssessment,
  createAssessmentVersion: createAssessmentVersion2,
  getAssessmentVersions: getAssessmentVersions2,
  restoreAssessmentVersion: restoreAssessmentVersion2
};

// src/app/modules/assessment/assessment.validation.ts
var import_zod3 = require("zod");
var assessmentProblemSchema = import_zod3.z.object({
  problemId: import_zod3.z.string().min(1, "problemId is required."),
  order: import_zod3.z.number().int().min(1, "Order must start at 1."),
  marks: import_zod3.z.coerce.number().int().min(1, "Marks must be at least 1.").max(1e3)
});
var baseAssessmentFields = {
  title: import_zod3.z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  description: import_zod3.z.string().trim().max(5e3).optional(),
  instructions: import_zod3.z.string().trim().max(5e3).optional(),
  durationMinutes: import_zod3.z.coerce.number().int().min(5, "Duration must be at least 5 minutes.").max(600, "Duration must be at most 10 hours."),
  totalMarks: import_zod3.z.coerce.number().int().min(1),
  passingMarks: import_zod3.z.coerce.number().int().min(0),
  maxAttempts: import_zod3.z.coerce.number().int().min(1).max(10).optional(),
  startAt: import_zod3.z.coerce.date().optional(),
  endAt: import_zod3.z.coerce.date().optional(),
  shuffleQuestions: import_zod3.z.boolean().optional(),
  showResultImmediately: import_zod3.z.boolean().optional(),
  allowReview: import_zod3.z.boolean().optional()
};
var validateProblemsInvariants = (data, ctx) => {
  if (!data.problems) return;
  const orders = data.problems.map((problem) => problem.order);
  if (new Set(orders).size !== orders.length) {
    ctx.addIssue({
      code: "custom",
      message: "Problem order values must be unique.",
      path: ["problems"]
    });
  }
  const problemIds = data.problems.map((problem) => problem.problemId);
  if (new Set(problemIds).size !== problemIds.length) {
    ctx.addIssue({
      code: "custom",
      message: "The same problem cannot be added twice.",
      path: ["problems"]
    });
  }
  if (data.totalMarks !== void 0) {
    const marksSum = data.problems.reduce(
      (sum, problem) => sum + problem.marks,
      0
    );
    if (marksSum !== data.totalMarks) {
      ctx.addIssue({
        code: "custom",
        message: `Sum of problem marks (${marksSum}) must equal totalMarks (${data.totalMarks}).`,
        path: ["totalMarks"]
      });
    }
  }
};
var createAssessmentSchema = import_zod3.z.object({
  ...baseAssessmentFields,
  problems: import_zod3.z.array(assessmentProblemSchema).min(1, "Add at least one problem.")
}).superRefine((data, ctx) => {
  if (data.passingMarks > data.totalMarks) {
    ctx.addIssue({
      code: "custom",
      message: "Passing marks cannot exceed total marks.",
      path: ["passingMarks"]
    });
  }
  if (data.startAt && data.endAt && data.endAt <= data.startAt) {
    ctx.addIssue({
      code: "custom",
      message: "endAt must be after startAt.",
      path: ["endAt"]
    });
  }
  validateProblemsInvariants(data, ctx);
});
var updateAssessmentSchema = import_zod3.z.object({
  title: import_zod3.z.string().trim().min(3).max(200).optional(),
  description: import_zod3.z.string().trim().max(5e3).optional(),
  instructions: import_zod3.z.string().trim().max(5e3).optional(),
  durationMinutes: import_zod3.z.coerce.number().int().min(5).max(600).optional(),
  totalMarks: import_zod3.z.coerce.number().int().min(1).optional(),
  passingMarks: import_zod3.z.coerce.number().int().min(0).optional(),
  maxAttempts: import_zod3.z.coerce.number().int().min(1).max(10).optional(),
  startAt: import_zod3.z.coerce.date().optional(),
  endAt: import_zod3.z.coerce.date().optional(),
  shuffleQuestions: import_zod3.z.boolean().optional(),
  showResultImmediately: import_zod3.z.boolean().optional(),
  allowReview: import_zod3.z.boolean().optional(),
  problems: import_zod3.z.array(assessmentProblemSchema).min(1, "Add at least one problem.").optional()
}).superRefine((data, ctx) => {
  if (data.passingMarks !== void 0 && data.totalMarks !== void 0 && data.passingMarks > data.totalMarks) {
    ctx.addIssue({
      code: "custom",
      message: "Passing marks cannot exceed total marks.",
      path: ["passingMarks"]
    });
  }
  if (data.startAt && data.endAt && data.endAt <= data.startAt) {
    ctx.addIssue({
      code: "custom",
      message: "endAt must be after startAt.",
      path: ["endAt"]
    });
  }
  validateProblemsInvariants(data, ctx);
});
var assessmentValidation = {
  createAssessmentSchema,
  updateAssessmentSchema,
  createVersionSchema: import_zod3.z.object({}),
  restoreVersionSchema: import_zod3.z.object({})
};

// src/app/modules/assessment/assessment.routes.ts
var router3 = (0, import_express3.Router)();
router3.use(requireAuth);
router3.post(
  "/",
  requireRole("RECRUITER"),
  validateRequest(assessmentValidation.createAssessmentSchema),
  assessmentController.createAssessment
);
router3.get(
  "/",
  requireRole("RECRUITER", "ADMIN"),
  assessmentController.getAllAssessments
);
router3.get(
  "/:id",
  requireRole("RECRUITER", "ADMIN"),
  assessmentController.getAssessmentById
);
router3.patch(
  "/:id",
  requireRole("RECRUITER"),
  validateRequest(assessmentValidation.updateAssessmentSchema),
  assessmentController.updateAssessment
);
router3.patch(
  "/:id/publish",
  requireRole("RECRUITER"),
  assessmentController.publishAssessment
);
router3.patch(
  "/:id/close",
  requireRole("RECRUITER"),
  assessmentController.closeAssessment
);
router3.delete(
  "/:id",
  requireRole("RECRUITER"),
  assessmentController.deleteAssessment
);
router3.post(
  "/:id/versions",
  requireRole("RECRUITER"),
  validateRequest(assessmentValidation.createVersionSchema),
  assessmentController.createAssessmentVersion
);
router3.get(
  "/:id/versions",
  requireRole("RECRUITER", "ADMIN"),
  assessmentController.getAssessmentVersions
);
router3.patch(
  "/versions/:id/restore",
  requireRole("RECRUITER"),
  validateRequest(assessmentValidation.restoreVersionSchema),
  assessmentController.restoreAssessmentVersion
);
var assessmentRoutes = router3;

// src/app/modules/attempt/attempt.routes.ts
var import_express4 = require("express");

// src/app/modules/attempt/attempt.controller.ts
var import_http_status_codes18 = require("http-status-codes");

// src/app/modules/attempt/attempt.service.ts
var import_http_status_codes17 = require("http-status-codes");

// src/app/modules/attempt/attempt.const.ts
var ATTEMPT_PROBLEM_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  difficulty: true,
  defaultMarks: true,
  timeLimitSeconds: true,
  mcqProblem: {
    select: {
      id: true,
      type: true,
      options: {
        select: { id: true, optionText: true, order: true },
        orderBy: { order: "asc" }
      }
    }
  },
  testCases: {
    where: { isSample: true },
    select: { id: true, input: true, expectedOutput: true, isSample: true },
    orderBy: { id: "asc" }
  }
};
var ATTEMPT_DETAIL_SELECT = {
  id: true,
  assessmentId: true,
  candidateId: true,
  attemptNumber: true,
  status: true,
  startedAt: true,
  submittedAt: true,
  expiresAt: true,
  autoSubmittedAt: true,
  tabSwitchCount: true,
  createdAt: true,
  assessment: {
    select: {
      id: true,
      title: true,
      companyId: true,
      durationMinutes: true,
      totalMarks: true,
      passingMarks: true,
      shuffleQuestions: true,
      allowReview: true,
      showResultImmediately: true,
      assessmentProblems: {
        select: {
          id: true,
          order: true,
          marks: true,
          problem: { select: ATTEMPT_PROBLEM_SELECT }
        },
        orderBy: { order: "asc" }
      }
    }
  },
  submissions: {
    select: {
      id: true,
      problemId: true,
      answerText: true,
      code: true,
      language: true,
      status: true,
      submittedAt: true,
      answers: { select: { optionId: true } }
    }
  }
};
var SUBMISSION_GRADING_SELECT = {
  id: true,
  attemptId: true,
  problemId: true,
  answerText: true,
  code: true,
  language: true,
  status: true,
  submittedAt: true,
  problem: {
    select: {
      id: true,
      title: true,
      type: true,
      defaultMarks: true,
      testCases: {
        select: {
          id: true,
          input: true,
          expectedOutput: true,
          isSample: true,
          points: true
        }
      }
    }
  },
  answers: {
    select: {
      optionId: true,
      option: { select: { id: true, optionText: true, isCorrect: true } }
    }
  },
  testCaseResults: {
    select: {
      id: true,
      testCaseId: true,
      passed: true,
      actualOutput: true,
      points: true
    }
  },
  evaluation: {
    select: {
      id: true,
      score: true,
      maxScore: true,
      status: true,
      isAutoEvaluated: true,
      feedback: true,
      evaluatedAt: true,
      evaluatorId: true
    }
  }
};

// src/app/modules/attempt/grading.util.ts
var gradeSubmissionForProblem = async (params) => {
  const { attemptId, problemId, problemType, marks } = params;
  const submission = await prisma.submission.findUnique({
    where: { attemptId_problemId: { attemptId, problemId } }
  });
  if (!submission) {
    const blank = await prisma.submission.create({
      data: { attemptId, problemId, status: "EVALUATED" }
    });
    await prisma.submissionEvaluation.create({
      data: {
        submissionId: blank.id,
        score: 0,
        maxScore: marks,
        status: "COMPLETED",
        isAutoEvaluated: true,
        evaluatedAt: /* @__PURE__ */ new Date()
      }
    });
    return;
  }
  if (problemType === "MCQ") {
    const [mcqProblem, selectedAnswers] = await Promise.all([
      prisma.mcqProblem.findUniqueOrThrow({
        where: { problemId },
        include: { options: { select: { id: true, isCorrect: true } } }
      }),
      prisma.submissionAnswer.findMany({
        where: { submissionId: submission.id },
        select: { optionId: true }
      })
    ]);
    const selectedIds = new Set(
      selectedAnswers.map((answer) => answer.optionId)
    );
    const correctIds = new Set(
      mcqProblem.options.filter((option) => option.isCorrect).map((option) => option.id)
    );
    const isFullyCorrect = selectedIds.size === correctIds.size && [...selectedIds].every((id) => correctIds.has(id));
    const score = isFullyCorrect ? marks : 0;
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "EVALUATED" }
    });
    await prisma.submissionEvaluation.upsert({
      where: { submissionId: submission.id },
      update: {
        score,
        maxScore: marks,
        status: "COMPLETED",
        isAutoEvaluated: true,
        evaluatedAt: /* @__PURE__ */ new Date()
      },
      create: {
        submissionId: submission.id,
        score,
        maxScore: marks,
        status: "COMPLETED",
        isAutoEvaluated: true,
        evaluatedAt: /* @__PURE__ */ new Date()
      }
    });
    return;
  }
  await prisma.submission.update({
    where: { id: submission.id },
    data: { status: "EVALUATING" }
  });
  await prisma.submissionEvaluation.upsert({
    where: { submissionId: submission.id },
    update: { maxScore: marks, status: "PENDING", isAutoEvaluated: false },
    create: {
      submissionId: submission.id,
      score: 0,
      maxScore: marks,
      status: "PENDING",
      isAutoEvaluated: false
    }
  });
};
var recomputeResult = async (attemptId) => {
  const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: {
      assessment: {
        select: { id: true, totalMarks: true, passingMarks: true }
      },
      submissions: { include: { evaluation: true } }
    }
  });
  const allCompleted = attempt.submissions.every(
    (submission) => submission.evaluation?.status === "COMPLETED"
  );
  const totalScore = attempt.submissions.reduce(
    (sum, submission) => sum + (submission.evaluation?.score ?? 0),
    0
  );
  const totalMarks = attempt.assessment.totalMarks;
  const percentage = totalMarks > 0 ? Math.round(totalScore / totalMarks * 1e4) / 100 : 0;
  const status = !allCompleted ? "PENDING" : totalScore >= attempt.assessment.passingMarks ? "PASSED" : "FAILED";
  const existingResult = await prisma.result.findUnique({
    where: { attemptId }
  });
  const isNewlyCompleted = allCompleted && (!existingResult || existingResult.status === "PENDING");
  await prisma.result.upsert({
    where: { attemptId },
    update: {
      totalScore,
      totalMarks,
      percentage,
      status,
      evaluatedAt: allCompleted ? /* @__PURE__ */ new Date() : null
    },
    create: {
      attemptId,
      assessmentId: attempt.assessment.id,
      totalScore,
      totalMarks,
      percentage,
      status,
      evaluatedAt: allCompleted ? /* @__PURE__ */ new Date() : null
    }
  });
  if (isNewlyCompleted) {
    await prisma.notification.create({
      data: {
        userId: attempt.candidateId,
        title: "Result Published",
        message: `Your result is now available: ${totalScore}/${totalMarks} (${status}).`,
        type: "ATTEMPT_EVALUATED",
        metadata: { assessmentId: attempt.assessment.id, attemptId }
      }
    });
  }
  return { allCompleted, totalScore, totalMarks, percentage, status };
};

// src/app/modules/attempt/attempt.service.ts
var finalizeAttempt = async (attemptId) => {
  const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: {
      assessment: {
        include: {
          assessmentProblems: {
            include: { problem: { select: { id: true, type: true } } }
          }
        }
      }
    }
  });
  if (attempt.status !== "IN_PROGRESS") return;
  const isLate = attempt.expiresAt < /* @__PURE__ */ new Date();
  await prisma.assessmentAttempt.update({
    where: { id: attemptId },
    data: {
      status: isLate ? "AUTO_SUBMITTED" : "SUBMITTED",
      submittedAt: /* @__PURE__ */ new Date(),
      ...isLate && { autoSubmittedAt: /* @__PURE__ */ new Date() }
    }
  });
  for (const assessmentProblem of attempt.assessment.assessmentProblems) {
    await gradeSubmissionForProblem({
      attemptId,
      problemId: assessmentProblem.problemId,
      problemType: assessmentProblem.problem.type,
      marks: assessmentProblem.marks
    });
  }
  await recomputeResult(attemptId);
  if (attempt.invitationId) {
    await prisma.assessmentInvitation.updateMany({
      where: { id: attempt.invitationId, status: { not: "COMPLETED" } },
      data: { status: "COMPLETED", completedAt: /* @__PURE__ */ new Date() }
    });
  }
};
var getAttemptById = async (id, requester) => {
  let attempt = await prisma.assessmentAttempt.findUnique({
    where: { id },
    select: ATTEMPT_DETAIL_SELECT
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.FORBIDDEN,
      "You don't have permission to view this attempt."
    );
  }
  if (attempt.status === "IN_PROGRESS" && attempt.expiresAt < /* @__PURE__ */ new Date()) {
    await finalizeAttempt(id);
    attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
      where: { id },
      select: ATTEMPT_DETAIL_SELECT
    });
  }
  return attempt;
};
var getMyAttempts = async (candidateId) => {
  return prisma.assessmentAttempt.findMany({
    where: { candidateId },
    select: ATTEMPT_DETAIL_SELECT,
    orderBy: { createdAt: "desc" }
  });
};
var startAttempt = async (candidateId, assessmentId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      "This assessment is not currently open for attempts."
    );
  }
  const now = /* @__PURE__ */ new Date();
  if (assessment.startAt && now < assessment.startAt) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      "This assessment has not started yet."
    );
  }
  if (assessment.endAt && now > assessment.endAt) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      "This assessment's window has closed."
    );
  }
  const invitation = await prisma.assessmentInvitation.findFirst({
    where: {
      assessmentId,
      candidateId,
      status: { in: ["ACCEPTED", "COMPLETED"] }
    }
  });
  if (!invitation) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.FORBIDDEN,
      "You need an accepted invitation to start this assessment."
    );
  }
  const inProgress = await prisma.assessmentAttempt.findFirst({
    where: { assessmentId, candidateId, status: "IN_PROGRESS" }
  });
  if (inProgress) {
    if (inProgress.expiresAt >= now) {
      return getAttemptById(inProgress.id, {
        id: candidateId,
        role: "CANDIDATE"
      });
    }
    await finalizeAttempt(inProgress.id);
  }
  const attemptCount = await prisma.assessmentAttempt.count({
    where: { assessmentId, candidateId }
  });
  if (attemptCount >= assessment.maxAttempts) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      `You have used all ${assessment.maxAttempts} allowed attempt(s) for this assessment.`
    );
  }
  const rawExpiresAt = now.getTime() + assessment.durationMinutes * 60 * 1e3;
  const expiresAt = assessment.endAt ? new Date(Math.min(rawExpiresAt, assessment.endAt.getTime())) : new Date(rawExpiresAt);
  const attempt = await prisma.assessmentAttempt.create({
    data: {
      assessmentId,
      candidateId,
      invitationId: invitation.id,
      attemptNumber: attemptCount + 1,
      status: "IN_PROGRESS",
      startedAt: now,
      expiresAt
    }
  });
  return getAttemptById(attempt.id, { id: candidateId, role: "CANDIDATE" });
};
var saveSubmission = async (attemptId, candidateId, problemId, payload) => {
  const attempt = await prisma.assessmentAttempt.findFirst({
    where: { id: attemptId, candidateId },
    include: {
      assessment: {
        include: {
          assessmentProblems: {
            where: { problemId },
            include: { problem: true }
          }
        }
      }
    }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  if (attempt.status === "IN_PROGRESS" && attempt.expiresAt < /* @__PURE__ */ new Date()) {
    await finalizeAttempt(attemptId);
    throw new appError_default(
      import_http_status_codes17.StatusCodes.GONE,
      "Time is up \u2014 this attempt has been auto-submitted."
    );
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      `Cannot modify answers \u2014 this attempt is already ${attempt.status.toLowerCase()}.`
    );
  }
  const assessmentProblem = attempt.assessment.assessmentProblems[0];
  if (!assessmentProblem) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.BAD_REQUEST,
      "This problem is not part of this assessment."
    );
  }
  const { problem } = assessmentProblem;
  let selectedOptionIds = [];
  if (problem.type === "MCQ") {
    if (!payload.selectedOptionIds || payload.selectedOptionIds.length === 0) {
      throw new appError_default(
        import_http_status_codes17.StatusCodes.BAD_REQUEST,
        "selectedOptionIds is required for an MCQ problem."
      );
    }
    const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({
      where: { problemId },
      include: { options: { select: { id: true } } }
    });
    const validOptionIds = new Set(
      mcqProblem.options.map((option) => option.id)
    );
    const hasInvalidOption = payload.selectedOptionIds.some(
      (id) => !validOptionIds.has(id)
    );
    if (hasInvalidOption) {
      throw new appError_default(
        import_http_status_codes17.StatusCodes.BAD_REQUEST,
        "One or more selected options do not belong to this problem."
      );
    }
    if (mcqProblem.type === "SINGLE_CHOICE" && payload.selectedOptionIds.length > 1) {
      throw new appError_default(
        import_http_status_codes17.StatusCodes.BAD_REQUEST,
        "This is a single-choice question \u2014 select only one option."
      );
    }
    selectedOptionIds = payload.selectedOptionIds;
  } else if (problem.type === "CODING") {
    if (!payload.code) {
      throw new appError_default(
        import_http_status_codes17.StatusCodes.BAD_REQUEST,
        "code is required for a CODING problem."
      );
    }
  } else if (!payload.answerText) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.BAD_REQUEST,
      "answerText is required for a WRITTEN problem."
    );
  }
  const submission = await prisma.submission.upsert({
    where: { attemptId_problemId: { attemptId, problemId } },
    update: {
      status: "SUBMITTED",
      submittedAt: /* @__PURE__ */ new Date(),
      ...problem.type === "CODING" && payload.code !== void 0 && { code: payload.code },
      ...problem.type === "CODING" && payload.language !== void 0 && { language: payload.language },
      ...problem.type === "WRITTEN" && payload.answerText !== void 0 && { answerText: payload.answerText }
    },
    create: {
      attemptId,
      problemId,
      status: "SUBMITTED",
      submittedAt: /* @__PURE__ */ new Date(),
      ...problem.type === "CODING" && payload.code !== void 0 && { code: payload.code },
      ...problem.type === "CODING" && payload.language !== void 0 && { language: payload.language },
      ...problem.type === "WRITTEN" && payload.answerText !== void 0 && { answerText: payload.answerText }
    }
  });
  if (problem.type === "MCQ") {
    await prisma.$transaction([
      prisma.submissionAnswer.deleteMany({
        where: { submissionId: submission.id }
      }),
      prisma.submissionAnswer.createMany({
        data: selectedOptionIds.map((optionId) => ({
          submissionId: submission.id,
          optionId
        }))
      })
    ]);
  }
  return prisma.submission.findUniqueOrThrow({
    where: { id: submission.id },
    include: { answers: true }
  });
};
var submitAttempt = async (attemptId, candidateId) => {
  const attempt = await prisma.assessmentAttempt.findFirst({
    where: { id: attemptId, candidateId }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.CONFLICT,
      `This attempt is already ${attempt.status.toLowerCase()}.`
    );
  }
  await finalizeAttempt(attemptId);
  return getAttemptById(attemptId, { id: candidateId, role: "CANDIDATE" });
};
var recordProctoringEvent = async (attemptId, candidateId, payload) => {
  const attempt = await prisma.assessmentAttempt.findFirst({
    where: { id: attemptId, candidateId }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  if (attempt.status !== "IN_PROGRESS") {
    return { recorded: false };
  }
  if (payload.eventType === "TAB_SWITCH") {
    await prisma.$transaction([
      prisma.proctoringEvent.create({
        data: {
          attemptId,
          eventType: payload.eventType,
          ...payload.metadata && {
            metadata: payload.metadata
          }
        }
      }),
      prisma.assessmentAttempt.update({
        where: { id: attemptId },
        data: { tabSwitchCount: { increment: 1 } }
      })
    ]);
  } else {
    await prisma.proctoringEvent.create({
      data: {
        attemptId,
        eventType: payload.eventType,
        ...payload.metadata && {
          metadata: payload.metadata
        }
      }
    });
  }
  return { recorded: true };
};
var getProctoringEvents = async (attemptId, requester) => {
  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      candidateId: true,
      assessment: { select: { companyId: true } }
    }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.FORBIDDEN,
      "You don't have permission to view these proctoring events."
    );
  }
  return prisma.proctoringEvent.findMany({
    where: { attemptId },
    orderBy: { timestamp: "asc" }
  });
};
var getProctoringEventById = async (attemptId, eventId, requester) => {
  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      candidateId: true,
      assessment: { select: { companyId: true } }
    }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(
      import_http_status_codes17.StatusCodes.FORBIDDEN,
      "You don't have permission to view this proctoring event."
    );
  }
  const event = await prisma.proctoringEvent.findFirst({
    where: { id: eventId, attemptId }
  });
  if (!event) {
    throw new appError_default(import_http_status_codes17.StatusCodes.NOT_FOUND, "Proctoring event not found.");
  }
  return event;
};
var attemptService = {
  startAttempt,
  getMyAttempts,
  getAttemptById,
  saveSubmission,
  submitAttempt,
  recordProctoringEvent,
  getProctoringEvents,
  getProctoringEventById
};

// src/app/modules/attempt/attempt.controller.ts
var resolveScopeCompanyId2 = async (user) => {
  if (user.role === "ADMIN") return void 0;
  if (user.role !== "RECRUITER") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var startAttempt2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const attempt = await attemptService.startAttempt(
    currentUser.id,
    req.body.assessmentId
  );
  res.status(import_http_status_codes18.StatusCodes.CREATED).json({
    success: true,
    message: "Attempt started successfully.",
    data: attempt
  });
});
var getMyAttempts2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const attempts = await attemptService.getMyAttempts(currentUser.id);
  res.status(import_http_status_codes18.StatusCodes.OK).json({
    success: true,
    message: "Attempts retrieved successfully.",
    data: attempts
  });
});
var getAttemptById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId2(currentUser);
  const attempt = await attemptService.getAttemptById(req.params.id, {
    id: currentUser.id,
    role: currentUser.role,
    ...companyId !== void 0 && { companyId }
  });
  res.status(import_http_status_codes18.StatusCodes.OK).json({
    success: true,
    message: "Attempt retrieved successfully.",
    data: attempt
  });
});
var saveSubmission2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const submission = await attemptService.saveSubmission(
    req.params.id,
    currentUser.id,
    req.params.problemId,
    req.body
  );
  res.status(import_http_status_codes18.StatusCodes.OK).json({
    success: true,
    message: "Answer saved successfully.",
    data: submission
  });
});
var submitAttempt2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const attempt = await attemptService.submitAttempt(
    req.params.id,
    currentUser.id
  );
  res.status(import_http_status_codes18.StatusCodes.OK).json({
    success: true,
    message: "Attempt submitted successfully.",
    data: attempt
  });
});
var recordProctoringEvent2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const result = await attemptService.recordProctoringEvent(
      req.params.id,
      currentUser.id,
      req.body
    );
    res.status(import_http_status_codes18.StatusCodes.OK).json({
      success: true,
      message: result.recorded ? "Event recorded." : "Attempt is no longer active; event ignored.",
      data: result
    });
  }
);
var getProctoringEvents2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId2(currentUser);
  const events = await attemptService.getProctoringEvents(
    req.params.id,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(import_http_status_codes18.StatusCodes.OK).json({
    success: true,
    message: "Proctoring events retrieved successfully.",
    data: events
  });
});
var getProctoringEventById2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await resolveScopeCompanyId2(currentUser);
    const event = await attemptService.getProctoringEventById(
      req.params.id,
      req.params.eventId,
      {
        id: currentUser.id,
        role: currentUser.role,
        ...companyId !== void 0 && { companyId }
      }
    );
    res.status(import_http_status_codes18.StatusCodes.OK).json({
      success: true,
      message: "Proctoring event retrieved successfully.",
      data: event
    });
  }
);
var attemptController = {
  startAttempt: startAttempt2,
  getMyAttempts: getMyAttempts2,
  getAttemptById: getAttemptById2,
  saveSubmission: saveSubmission2,
  submitAttempt: submitAttempt2,
  recordProctoringEvent: recordProctoringEvent2,
  getProctoringEvents: getProctoringEvents2,
  getProctoringEventById: getProctoringEventById2
};

// src/app/modules/attempt/attempt.validation.ts
var import_zod4 = require("zod");
var startAttemptSchema = import_zod4.z.object({
  assessmentId: import_zod4.z.string().min(1, "assessmentId is required.")
});
var saveSubmissionSchema = import_zod4.z.object({
  selectedOptionIds: import_zod4.z.array(import_zod4.z.string().min(1)).min(1).max(10).optional(),
  code: import_zod4.z.string().max(2e4).optional(),
  language: import_zod4.z.string().trim().max(50).optional(),
  answerText: import_zod4.z.string().trim().max(2e4).optional()
}).refine(
  (data) => data.selectedOptionIds !== void 0 || data.code !== void 0 || data.answerText !== void 0,
  {
    message: "Provide an answer: selectedOptionIds (MCQ), code (CODING), or answerText (WRITTEN)."
  }
);
var testCaseResultInputSchema = import_zod4.z.object({
  testCaseId: import_zod4.z.string().min(1),
  passed: import_zod4.z.boolean(),
  actualOutput: import_zod4.z.string().max(5e3).optional(),
  points: import_zod4.z.coerce.number().int().min(0).max(1e3).optional()
});
var manualEvaluationSchema = import_zod4.z.object({
  score: import_zod4.z.coerce.number().min(0, "Score cannot be negative."),
  feedback: import_zod4.z.string().trim().max(2e3).optional(),
  testCaseResults: import_zod4.z.array(testCaseResultInputSchema).max(50).optional()
});
var proctoringEventSchema = import_zod4.z.object({
  eventType: import_zod4.z.enum([
    "TAB_SWITCH",
    "FULLSCREEN_EXIT",
    "COPY",
    "PASTE",
    "DEVTOOLS_DETECTED",
    "CAMERA_BLOCKED",
    "MICROPHONE_BLOCKED",
    "WINDOW_BLUR",
    "WINDOW_FOCUS",
    "OTHER"
  ]),
  metadata: import_zod4.z.record(import_zod4.z.string(), import_zod4.z.unknown()).optional()
});
var attemptValidation = {
  startAttemptSchema,
  saveSubmissionSchema,
  manualEvaluationSchema,
  proctoringEventSchema
};

// src/app/modules/attempt/attempt.routes.ts
var router4 = (0, import_express4.Router)();
router4.use(requireAuth);
router4.post(
  "/start",
  requireRole("CANDIDATE"),
  validateRequest(attemptValidation.startAttemptSchema),
  attemptController.startAttempt
);
router4.get("/me", requireRole("CANDIDATE"), attemptController.getMyAttempts);
router4.get("/:id", attemptController.getAttemptById);
router4.put(
  "/:id/submissions/:problemId",
  requireRole("CANDIDATE"),
  validateRequest(attemptValidation.saveSubmissionSchema),
  attemptController.saveSubmission
);
router4.post(
  "/:id/submit",
  requireRole("CANDIDATE"),
  attemptController.submitAttempt
);
router4.post(
  "/:id/proctoring-events",
  requireRole("CANDIDATE"),
  validateRequest(attemptValidation.proctoringEventSchema),
  attemptController.recordProctoringEvent
);
router4.get("/:id/proctoring-events", attemptController.getProctoringEvents);
router4.get(
  "/proctoring-events/:eventId",
  attemptController.getProctoringEventById
);
var attemptRoutes = router4;

// src/app/modules/auth/auth.routes.ts
var import_express5 = require("express");

// src/app/modules/auth/auth.controller.ts
var import_node2 = require("better-auth/node");
var import_http_status_codes20 = require("http-status-codes");

// src/app/utils/authCookies.ts
var applyAuthCookies = (headers, res) => {
  const setCookieHeaders = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : headers.get("set-cookie");
  if (setCookieHeaders && (Array.isArray(setCookieHeaders) ? setCookieHeaders.length > 0 : true)) {
    res.setHeader("set-cookie", setCookieHeaders);
  }
  const authToken = headers.get("set-auth-token");
  if (authToken) {
    res.setHeader("set-auth-token", authToken);
  }
};

// src/app/modules/auth/auth.service.ts
var import_http_status_codes19 = require("http-status-codes");

// src/app/modules/auth/auth.const.ts
var AUTH_FALLBACK_MESSAGES = {
  REGISTER: "Registration failed.",
  LOGIN: "Invalid email or password.",
  LOGOUT: "Logout failed.",
  REFRESH_TOKEN: "Could not refresh session.",
  SEND_OTP: "Could not send the verification code.",
  VERIFY_EMAIL_OTP: "Email verification failed. The code may be invalid or expired.",
  RESET_PASSWORD_OTP: "Password reset failed. The code may be invalid or expired.",
  CHANGE_PASSWORD: "Could not change password."
};

// src/app/modules/auth/auth.service.ts
var callAuthEndpoint = async (responsePromise, fallbackMessage) => {
  const response = await responsePromise;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(
      `[Auth] ${response.status} error:`,
      body ?? response.statusText
    );
    throw new appError_default(
      response.status,
      body?.message ?? fallbackMessage
    );
  }
  return {
    data: body,
    headers: response.headers
  };
};
var register = (payload, headers) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callAuthEndpoint(
    auth.api.signUpEmail({
      body: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        ...payload.captchaToken && { captchaToken: payload.captchaToken }
      },
      headers,
      asResponse: true
    }),
    AUTH_FALLBACK_MESSAGES.REGISTER
  )
);
var login = (payload, headers) => callAuthEndpoint(
  auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
      rememberMe: payload.rememberMe
    },
    headers,
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.LOGIN
);
var logout = (headers) => callAuthEndpoint(
  auth.api.signOut({
    headers,
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.LOGOUT
);
var refreshToken = (headers) => callAuthEndpoint(
  auth.api.getSession({
    headers,
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.REFRESH_TOKEN
);
var sendEmailOtp = (payload) => callAuthEndpoint(
  auth.api.sendVerificationOTP({
    body: {
      email: payload.email,
      type: payload.type
    },
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.SEND_OTP
);
var verifyEmailOtp = (payload) => callAuthEndpoint(
  auth.api.verifyEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp
    },
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.VERIFY_EMAIL_OTP
);
var resetPasswordWithOtp = (payload) => callAuthEndpoint(
  auth.api.resetPasswordEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
      password: payload.newPassword
    },
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.RESET_PASSWORD_OTP
);
var changePassword = (payload, headers) => callAuthEndpoint(
  auth.api.changePassword({
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: payload.revokeOtherSessions
    },
    headers,
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.CHANGE_PASSWORD
);
var authService = {
  register,
  login,
  logout,
  refreshToken,
  sendEmailOtp,
  verifyEmailOtp,
  resetPasswordWithOtp,
  changePassword
};

// src/app/modules/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.register(
    req.body,
    (0, import_node2.fromNodeHeaders)(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(import_http_status_codes20.StatusCodes.CREATED).json({
    success: true,
    message: "Registered successfully. Please check your email for the verification code.",
    data
  });
});
var login2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.login(
    req.body,
    (0, import_node2.fromNodeHeaders)(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Logged in successfully.",
    data
  });
});
var logout2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.logout(
    (0, import_node2.fromNodeHeaders)(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Logged out successfully.",
    data
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.refreshToken(
    (0, import_node2.fromNodeHeaders)(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Session refreshed successfully.",
    data
  });
});
var sendEmailOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.sendEmailOtp(req.body);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Verification code sent.",
    data
  });
});
var verifyEmailOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.verifyEmailOtp(req.body);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Email verified successfully.",
    data
  });
});
var resetPasswordWithOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.resetPasswordWithOtp(req.body);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
    data
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.changePassword(
    req.body,
    (0, import_node2.fromNodeHeaders)(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Password changed successfully.",
    data
  });
});
var getMe = catchAsync(async (req, res) => {
  res.status(import_http_status_codes20.StatusCodes.OK).json({
    success: true,
    message: "Current user retrieved successfully.",
    data: req.user
  });
});
var authController = {
  register: register2,
  login: login2,
  logout: logout2,
  refreshToken: refreshToken2,
  sendEmailOtp: sendEmailOtp2,
  verifyEmailOtp: verifyEmailOtp2,
  resetPasswordWithOtp: resetPasswordWithOtp2,
  changePassword: changePassword2,
  getMe
};

// src/app/modules/auth/auth.validation.ts
var import_zod5 = require("zod");
var registerSchema = import_zod5.z.object({
  name: import_zod5.z.string().min(2, "Name must be at least 2 characters."),
  email: import_zod5.z.string().email("Invalid email address."),
  password: import_zod5.z.string().min(8, "Password must be at least 8 characters."),
  captchaToken: import_zod5.z.string().optional()
});
var loginSchema = import_zod5.z.object({
  email: import_zod5.z.string().email("Invalid email address."),
  password: import_zod5.z.string().min(1, "Password is required."),
  rememberMe: import_zod5.z.boolean().optional()
});
var sendEmailOtpSchema = import_zod5.z.object({
  email: import_zod5.z.string().email("Invalid email address."),
  type: import_zod5.z.enum(["sign-in", "email-verification", "forget-password"])
});
var verifyEmailOtpSchema = import_zod5.z.object({
  email: import_zod5.z.string().email("Invalid email address."),
  otp: import_zod5.z.string().length(6, "OTP must be 6 digits.")
});
var resetPasswordOtpSchema = import_zod5.z.object({
  email: import_zod5.z.string().email("Invalid email address."),
  otp: import_zod5.z.string().length(6, "OTP must be 6 digits."),
  newPassword: import_zod5.z.string().min(8, "Password must be at least 8 characters.")
});
var changePasswordSchema = import_zod5.z.object({
  currentPassword: import_zod5.z.string().min(1, "Current password is required."),
  newPassword: import_zod5.z.string().min(8, "Password must be at least 8 characters."),
  revokeOtherSessions: import_zod5.z.boolean().optional()
});
var authValidation = {
  registerSchema,
  loginSchema,
  sendEmailOtpSchema,
  verifyEmailOtpSchema,
  resetPasswordOtpSchema,
  changePasswordSchema
};

// src/app/modules/auth/auth.routes.ts
var router5 = (0, import_express5.Router)();
router5.post(
  "/register",
  publicRateLimiter,
  validateRequest(authValidation.registerSchema),
  authController.register
);
router5.post(
  "/login",
  authRateLimiter,
  validateRequest(authValidation.loginSchema),
  authController.login
);
router5.post("/logout", requireAuth, authController.logout);
router5.post("/refresh-token", requireAuth, authController.refreshToken);
router5.post(
  "/send-otp",
  publicRateLimiter,
  validateRequest(authValidation.sendEmailOtpSchema),
  authController.sendEmailOtp
);
router5.post(
  "/verify-email-otp",
  publicRateLimiter,
  validateRequest(authValidation.verifyEmailOtpSchema),
  authController.verifyEmailOtp
);
router5.post(
  "/reset-password-otp",
  publicRateLimiter,
  validateRequest(authValidation.resetPasswordOtpSchema),
  authController.resetPasswordWithOtp
);
router5.post(
  "/change-password",
  requireAuth,
  validateRequest(authValidation.changePasswordSchema),
  authController.changePassword
);
router5.get("/me", requireAuth, authController.getMe);
var authRoutes = router5;

// src/app/modules/candidade/candidate.routes.ts
var import_express6 = require("express");

// src/app/middlewares/upload.ts
var import_http_status_codes21 = require("http-status-codes");
var import_multer = __toESM(require("multer"), 1);
var storage = import_multer.default.memoryStorage();
var IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/x-png",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/bmp",
  "image/tiff"
];
var DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv"
];
var makeUploader = (allowedMimeTypes, maxSizeBytes, label) => (0, import_multer.default)({
  storage,
  limits: { fileSize: maxSizeBytes },
  fileFilter: (_req, file, cb) => {
    cb(null, true);
  }
});
var imageUpload = makeUploader(
  IMAGE_MIME_TYPES,
  5 * 1024 * 1024,
  "images"
);
var documentUpload = makeUploader(
  [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
  20 * 1024 * 1024,
  "documents"
);

// src/app/middlewares/validateRequest2.ts
var import_http_status_codes22 = require("http-status-codes");
var validateRequestWithFile = (schema) => {
  return async (req, _res, next) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
    } catch {
      return next(
        new appError_default(import_http_status_codes22.StatusCodes.BAD_REQUEST, "Invalid JSON in 'data' field.")
      );
    }
    const result = await schema.safeParseAsync(req.body ?? {});
    if (!result.success) {
      return next(
        new appError_default(
          import_http_status_codes22.StatusCodes.BAD_REQUEST,
          result.error.issues[0]?.message ?? "Validation failed.",
          "VALIDATION_ERROR",
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        )
      );
    }
    req.body = result.data;
    next();
  };
};

// src/app/modules/candidade/candidate.controller.ts
var import_http_status_codes24 = require("http-status-codes");

// src/app/modules/candidade/candidate.service.ts
var import_http_status_codes23 = require("http-status-codes");

// src/app/modules/candidade/candidate.const.ts
var CANDIDATE_DETAIL_SELECT = {
  id: true,
  headline: true,
  bio: true,
  phone: true,
  location: true,
  resumeUrl: true,
  linkedinUrl: true,
  githubUrl: true,
  portfolioUrl: true,
  skills: true,
  experienceYears: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  }
};

// src/app/modules/candidade/candidate.service.ts
var candidateQueryBuilder = new QueryBuilder(
  prisma.candidateProfile,
  {
    searchableFields: ["headline", "location", "phone"],
    filterableFields: {
      experienceYears: "number",
      createdAt: "date"
    },
    sortableFields: ["createdAt", "updatedAt", "experienceYears"],
    selectableFields: Object.keys(CANDIDATE_DETAIL_SELECT),
    softDelete: true,
    defaultSortField: "createdAt"
  }
);
var upsertMyProfile = async (userId, payload, file) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null }
  });
  if (!user) {
    throw new appError_default(import_http_status_codes23.StatusCodes.NOT_FOUND, "User not found.");
  }
  let resumeUrl;
  if (file) {
    const uploaded = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      "resumes"
    );
    resumeUrl = uploaded.secure_url;
  }
  return prisma.candidateProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...payload,
      ...resumeUrl ? { resumeUrl } : {}
    },
    update: {
      ...payload,
      ...resumeUrl ? { resumeUrl } : {}
    },
    select: CANDIDATE_DETAIL_SELECT
  });
};
var getMyProfile = async (userId) => {
  const profile = await prisma.candidateProfile.findFirst({
    where: { userId, deletedAt: null },
    select: CANDIDATE_DETAIL_SELECT
  });
  if (!profile) {
    throw new appError_default(import_http_status_codes23.StatusCodes.NOT_FOUND, "Candidate profile not found.");
  }
  return profile;
};
var getCandidateProfileById = async (id) => {
  const profile = await prisma.candidateProfile.findFirst({
    where: { id, deletedAt: null },
    select: CANDIDATE_DETAIL_SELECT
  });
  if (!profile) {
    throw new appError_default(import_http_status_codes23.StatusCodes.NOT_FOUND, "Candidate profile not found.");
  }
  return profile;
};
var getAllCandidates = async (query) => {
  return candidateQueryBuilder.execute(query);
};
var candidateService = {
  upsertMyProfile,
  getMyProfile,
  getCandidateProfileById,
  getAllCandidates
};

// src/app/modules/candidade/candidate.controller.ts
var upsertMyProfile2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const profile = await candidateService.upsertMyProfile(
    currentUser.id,
    req.body,
    req.file
  );
  res.status(import_http_status_codes24.StatusCodes.OK).json({
    success: true,
    message: "Profile saved successfully.",
    data: profile
  });
});
var getMyProfile2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const profile = await candidateService.getMyProfile(currentUser.id);
  res.status(import_http_status_codes24.StatusCodes.OK).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: profile
  });
});
var getCandidateProfileById2 = catchAsync(
  async (req, res) => {
    const profile = await candidateService.getCandidateProfileById(
      req.params.id
    );
    res.status(import_http_status_codes24.StatusCodes.OK).json({
      success: true,
      message: "Candidate profile retrieved successfully.",
      data: profile
    });
  }
);
var getAllCandidates2 = catchAsync(async (req, res) => {
  const result = await candidateService.getAllCandidates(
    req.query
  );
  res.status(import_http_status_codes24.StatusCodes.OK).json({
    success: true,
    message: "Candidates retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var candidateController = {
  upsertMyProfile: upsertMyProfile2,
  getMyProfile: getMyProfile2,
  getCandidateProfileById: getCandidateProfileById2,
  getAllCandidates: getAllCandidates2
};

// src/app/modules/candidade/candidate.validation.ts
var import_zod7 = require("zod");

// src/app/modules/user/user.validation.ts
var import_zod6 = require("zod");
var phoneSchema = import_zod6.z.string().trim().regex(
  /^\+?[1-9]\d{7,14}$/,
  "Enter a valid phone number (8\u201315 digits, digits only, optionally starting with +)."
).optional();
var updateProfileSchema = import_zod6.z.object({
  name: import_zod6.z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name must be at most 100 characters.").optional(),
  phone: phoneSchema
});
var updateRoleSchema = import_zod6.z.object({
  role: import_zod6.z.enum(["ADMIN", "RECRUITER", "CANDIDATE"], {
    message: "Role must be one of ADMIN, RECRUITER, or CANDIDATE."
  })
});
var updateStatusSchema = import_zod6.z.object({
  status: import_zod6.z.enum(["ACTIVE", "SUSPENDED", "PENDING"], {
    message: "Status must be one of ACTIVE, SUSPENDED, or PENDING."
  })
});
var userValidation = {
  updateProfileSchema,
  updateRoleSchema,
  updateStatusSchema
};

// src/app/modules/candidade/candidate.validation.ts
var urlField = (label) => import_zod7.z.string().trim().url(`Enter a valid ${label} URL, e.g. https://example.com/you.`).optional();
var upsertProfileSchema = import_zod7.z.object({
  headline: import_zod7.z.string().trim().min(2, "Headline must be at least 2 characters.").max(150, "Headline must be at most 150 characters.").optional(),
  bio: import_zod7.z.string().trim().max(2e3, "Bio must be at most 2000 characters.").optional(),
  phone: phoneSchema,
  location: import_zod7.z.string().trim().max(150, "Location must be at most 150 characters.").optional(),
  linkedinUrl: urlField("LinkedIn"),
  githubUrl: urlField("GitHub"),
  portfolioUrl: urlField("portfolio"),
  skills: import_zod7.z.array(
    import_zod7.z.string().trim().min(1).max(40, "Each skill must be at most 40 characters.")
  ).max(30, "You can list at most 30 skills.").optional(),
  experienceYears: import_zod7.z.coerce.number().int("Experience years must be a whole number.").min(0, "Experience years cannot be negative.").max(60, "Enter a realistic number of years.").optional()
});
var candidateValidation = {
  upsertProfileSchema
};

// src/app/modules/candidade/candidate.routes.ts
var router6 = (0, import_express6.Router)();
router6.get(
  "/me",
  requireAuth,
  requireRole("CANDIDATE"),
  candidateController.getMyProfile
);
router6.patch(
  "/me",
  requireAuth,
  requireRole("CANDIDATE"),
  documentUpload.single("resume"),
  validateRequestWithFile(candidateValidation.upsertProfileSchema),
  candidateController.upsertMyProfile
);
router6.get(
  "/",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  candidateController.getAllCandidates
);
router6.get(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  candidateController.getCandidateProfileById
);
var candidateRoutes = router6;

// src/app/modules/company/company.routes.ts
var import_express7 = require("express");

// src/app/modules/company/company.controller.ts
var import_http_status_codes25 = require("http-status-codes");
var registerCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.registerCompany(
    currentUser.id,
    req.body
  );
  res.status(import_http_status_codes25.StatusCodes.CREATED).json({
    success: true,
    message: "Company registered successfully. Awaiting admin verification.",
    data: company
  });
});
var getAllCompanies2 = catchAsync(async (req, res) => {
  const requesterRole = req.user?.role ?? "CANDIDATE";
  const result = await companyService.getAllCompanies(
    req.query,
    requesterRole
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Companies retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getCompanyById2 = catchAsync(async (req, res) => {
  const requester = req.user;
  const company = await companyService.getCompanyById(
    req.params.id,
    requester?.id ?? "",
    requester?.role ?? "CANDIDATE"
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Company retrieved successfully.",
    data: company
  });
});
var getMyCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Your company retrieved successfully.",
    data: company
  });
});
var updateMyCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.updateMyCompany(
    currentUser.id,
    req.body,
    req.file
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Company updated successfully.",
    data: company
  });
});
var verifyCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.verifyCompany(
    req.params.id,
    currentUser.id
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Company verified successfully.",
    data: company
  });
});
var deleteCompany = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await companyService.softDeleteCompany(
    req.params.id,
    currentUser.id,
    currentUser.role
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var getMySubscription2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const subscription = await companyService.getMySubscription(currentUser.id);
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Subscription retrieved successfully.",
    data: subscription
  });
});
var updateMySubscription2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const subscription = await companyService.updateMySubscription(
    currentUser.id,
    req.body.plan
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Subscription updated successfully.",
    data: subscription
  });
});
var cancelMySubscription2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const subscription = await companyService.cancelMySubscription(
    currentUser.id
  );
  res.status(import_http_status_codes25.StatusCodes.OK).json({
    success: true,
    message: "Subscription cancelled successfully. It will remain active until the end of the current period.",
    data: subscription
  });
});
var companyController = {
  registerCompany: registerCompany2,
  getAllCompanies: getAllCompanies2,
  getCompanyById: getCompanyById2,
  getMyCompany: getMyCompany2,
  updateMyCompany: updateMyCompany2,
  verifyCompany: verifyCompany2,
  deleteCompany,
  getMySubscription: getMySubscription2,
  updateMySubscription: updateMySubscription2,
  cancelMySubscription: cancelMySubscription2
};

// src/app/modules/company/company.validation.ts
var import_zod8 = require("zod");
var registerCompanySchema = import_zod8.z.object({
  name: import_zod8.z.string().trim().min(2, "Company name must be at least 2 characters.").max(150, "Company name must be at most 150 characters."),
  description: import_zod8.z.string().trim().max(2e3, "Description must be at most 2000 characters.").optional(),
  website: import_zod8.z.string().trim().url("Enter a valid website URL, e.g. https://example.com.").optional(),
  industry: import_zod8.z.string().trim().max(100, "Industry must be at most 100 characters.").optional()
});
var updateCompanySchema = import_zod8.z.object({
  description: import_zod8.z.string().trim().max(2e3, "Description must be at most 2000 characters.").optional(),
  website: import_zod8.z.string().trim().url("Enter a valid website URL, e.g. https://example.com.").optional(),
  industry: import_zod8.z.string().trim().max(100, "Industry must be at most 100 characters.").optional()
});
var companyValidation = {
  registerCompanySchema,
  updateCompanySchema,
  updateSubscriptionSchema: import_zod8.z.object({
    plan: import_zod8.z.enum(["FREE", "PRO", "ENTERPRISE"], {
      message: "Plan must be one of FREE, PRO, or ENTERPRISE."
    })
  })
};

// src/app/modules/company/company.routes.ts
var router7 = (0, import_express7.Router)();
router7.post(
  "/register",
  requireAuth,
  validateRequest(companyValidation.registerCompanySchema),
  companyController.registerCompany
);
router7.get("/", companyController.getAllCompanies);
router7.get("/me", requireAuth, companyController.getMyCompany);
router7.patch(
  "/me",
  requireAuth,
  requireRole("RECRUITER"),
  imageUpload.single("logo"),
  validateRequestWithFile(companyValidation.updateCompanySchema),
  companyController.updateMyCompany
);
router7.get("/:id", companyController.getCompanyById);
router7.patch(
  "/:id/verify",
  requireAuth,
  requireRole("ADMIN"),
  companyController.verifyCompany
);
router7.delete("/:id", requireAuth, companyController.deleteCompany);
router7.get(
  "/me/subscription",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.getMySubscription
);
router7.patch(
  "/me/subscription",
  requireAuth,
  requireRole("RECRUITER"),
  validateRequest(companyValidation.updateSubscriptionSchema),
  companyController.updateMySubscription
);
router7.post(
  "/me/subscription/cancel",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.cancelMySubscription
);
var companyRoutes = router7;

// src/app/modules/consent/consent.routes.ts
var import_express8 = require("express");

// src/app/modules/consent/consent.controller.ts
var import_http_status_codes27 = require("http-status-codes");

// src/app/modules/consent/consent.service.ts
var import_http_status_codes26 = require("http-status-codes");

// src/app/modules/consent/consent.const.ts
var CONSENT_SELECT = {
  id: true,
  userId: true,
  consentType: true,
  granted: true,
  grantedAt: true,
  revokedAt: true
};

// src/app/modules/consent/consent.service.ts
var getMyConsents = async (userId) => {
  const consents = await prisma.userConsent.findMany({
    where: { userId },
    select: CONSENT_SELECT,
    orderBy: { grantedAt: "desc" }
  });
  const allTypes = [
    "MARKETING",
    "ANALYTICS",
    "THIRD_PARTY",
    "PRIVACY_POLICY",
    "TERMS_OF_SERVICE"
  ];
  const result = allTypes.map((type) => {
    const existing = consents.find((c) => c.consentType === type);
    if (existing) {
      return existing;
    }
    return {
      id: "",
      userId,
      consentType: type,
      granted: false,
      grantedAt: /* @__PURE__ */ new Date(),
      revokedAt: null
    };
  });
  return result;
};
var updateConsent = async (userId, payload) => {
  const existing = await prisma.userConsent.findUnique({
    where: { userId_consentType: { userId, consentType: payload.consentType } }
  });
  if (existing) {
    if (existing.granted === payload.granted) {
      return await prisma.userConsent.findUniqueOrThrow({
        where: {
          userId_consentType: { userId, consentType: payload.consentType }
        },
        select: CONSENT_SELECT
      });
    }
    return await prisma.userConsent.update({
      where: {
        userId_consentType: { userId, consentType: payload.consentType }
      },
      data: {
        granted: payload.granted,
        ...payload.granted ? { revokedAt: null } : { revokedAt: /* @__PURE__ */ new Date() }
      },
      select: CONSENT_SELECT
    });
  }
  return await prisma.userConsent.create({
    data: {
      userId,
      consentType: payload.consentType,
      granted: payload.granted,
      ...payload.granted ? {} : { revokedAt: /* @__PURE__ */ new Date() }
    },
    select: CONSENT_SELECT
  });
};
var revokeConsent = async (userId, consentType) => {
  const existing = await prisma.userConsent.findUnique({
    where: { userId_consentType: { userId, consentType } }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes26.StatusCodes.NOT_FOUND, "Consent not found.");
  }
  if (!existing.granted) {
    throw new appError_default(
      import_http_status_codes26.StatusCodes.CONFLICT,
      "This consent is already revoked."
    );
  }
  return prisma.userConsent.update({
    where: { userId_consentType: { userId, consentType } },
    data: { granted: false, revokedAt: /* @__PURE__ */ new Date() },
    select: CONSENT_SELECT
  });
};
var consentService = {
  getMyConsents,
  updateConsent,
  revokeConsent
};

// src/app/modules/consent/consent.controller.ts
var getMyConsents2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const consents = await consentService.getMyConsents(currentUser.id);
  res.status(import_http_status_codes27.StatusCodes.OK).json({
    success: true,
    message: "Consents retrieved successfully.",
    data: consents
  });
});
var updateConsent2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const consent = await consentService.updateConsent(currentUser.id, req.body);
  res.status(import_http_status_codes27.StatusCodes.OK).json({
    success: true,
    message: "Consent updated successfully.",
    data: consent
  });
});
var revokeConsent2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const consent = await consentService.revokeConsent(
    currentUser.id,
    req.params.consentType
  );
  res.status(import_http_status_codes27.StatusCodes.OK).json({
    success: true,
    message: "Consent revoked successfully.",
    data: consent
  });
});
var consentController = {
  getMyConsents: getMyConsents2,
  updateConsent: updateConsent2,
  revokeConsent: revokeConsent2
};

// src/app/modules/consent/consent.validation.ts
var import_zod9 = require("zod");
var consentTypeSchema = import_zod9.z.enum([
  "MARKETING",
  "ANALYTICS",
  "THIRD_PARTY",
  "PRIVACY_POLICY",
  "TERMS_OF_SERVICE"
]);
var updateConsentSchema = import_zod9.z.object({
  consentType: consentTypeSchema,
  granted: import_zod9.z.boolean()
});
var consentValidation = {
  updateConsentSchema
};

// src/app/modules/consent/consent.routes.ts
var router8 = (0, import_express8.Router)();
router8.use(requireAuth);
router8.get("/me", consentController.getMyConsents);
router8.patch(
  "/me",
  validateRequest(consentValidation.updateConsentSchema),
  consentController.updateConsent
);
router8.delete("/me/:consentType", consentController.revokeConsent);
var consentRoutes = router8;

// src/app/modules/evaluation/evaluation.routes.ts
var import_express9 = require("express");

// src/app/modules/evaluation/evaluation.controller.ts
var import_http_status_codes29 = require("http-status-codes");

// src/app/modules/evaluation/evaluation.service.ts
var import_http_status_codes28 = require("http-status-codes");
var assertCanGrade = (requesterCompanyId, submissionCompanyId, role) => {
  if (role !== "ADMIN" && requesterCompanyId !== submissionCompanyId) {
    throw new appError_default(
      import_http_status_codes28.StatusCodes.FORBIDDEN,
      "You don't have permission to access this submission."
    );
  }
};
var getSubmissionsForAttempt = async (attemptId, requester) => {
  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    select: { id: true, assessment: { select: { companyId: true } } }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes28.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  assertCanGrade(
    requester.companyId,
    attempt.assessment.companyId,
    requester.role
  );
  return prisma.submission.findMany({
    where: { attemptId },
    select: SUBMISSION_GRADING_SELECT,
    orderBy: { createdAt: "asc" }
  });
};
var getSubmissionById = async (id, requester) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    select: SUBMISSION_GRADING_SELECT
  });
  if (!submission) {
    throw new appError_default(import_http_status_codes28.StatusCodes.NOT_FOUND, "Submission not found.");
  }
  const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
    where: { id: submission.attemptId },
    select: { assessment: { select: { companyId: true } } }
  });
  assertCanGrade(
    requester.companyId,
    attempt.assessment.companyId,
    requester.role
  );
  return submission;
};
var getPendingEvaluations = async (assessmentId, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes28.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  return prisma.submission.findMany({
    where: { attempt: { assessmentId }, evaluation: { status: "PENDING" } },
    select: SUBMISSION_GRADING_SELECT,
    orderBy: { submittedAt: "asc" }
  });
};
var evaluateSubmission = async (id, evaluatorId, companyId, payload) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      problem: { select: { id: true, type: true, defaultMarks: true } },
      attempt: {
        select: {
          id: true,
          status: true,
          assessment: {
            select: {
              companyId: true,
              assessmentProblems: { select: { problemId: true, marks: true } }
            }
          }
        }
      }
    }
  });
  if (!submission) {
    throw new appError_default(import_http_status_codes28.StatusCodes.NOT_FOUND, "Submission not found.");
  }
  assertCanGrade(
    companyId,
    submission.attempt.assessment.companyId,
    "RECRUITER"
  );
  if (submission.attempt.status === "NOT_STARTED" || submission.attempt.status === "IN_PROGRESS") {
    throw new appError_default(
      import_http_status_codes28.StatusCodes.CONFLICT,
      "This attempt hasn't been submitted yet."
    );
  }
  if (submission.problem.type === "MCQ") {
    throw new appError_default(
      import_http_status_codes28.StatusCodes.BAD_REQUEST,
      "MCQ submissions are graded automatically and cannot be manually re-graded."
    );
  }
  const assessmentProblem = submission.attempt.assessment.assessmentProblems.find(
    (ap) => ap.problemId === submission.problemId
  );
  const maxScore = assessmentProblem?.marks ?? submission.problem.defaultMarks;
  if (payload.score > maxScore) {
    throw new appError_default(
      import_http_status_codes28.StatusCodes.BAD_REQUEST,
      `Score cannot exceed the maximum marks for this problem (${maxScore}).`
    );
  }
  await prisma.$transaction(async (tx) => {
    if (submission.problem.type === "CODING" && payload.testCaseResults) {
      for (const testCaseResult of payload.testCaseResults) {
        await tx.testCaseResult.upsert({
          where: {
            submissionId_testCaseId: {
              submissionId: id,
              testCaseId: testCaseResult.testCaseId
            }
          },
          update: {
            passed: testCaseResult.passed,
            ...testCaseResult.actualOutput !== void 0 && {
              actualOutput: testCaseResult.actualOutput
            },
            points: testCaseResult.points ?? 0
          },
          create: {
            submissionId: id,
            testCaseId: testCaseResult.testCaseId,
            passed: testCaseResult.passed,
            ...testCaseResult.actualOutput !== void 0 && {
              actualOutput: testCaseResult.actualOutput
            },
            points: testCaseResult.points ?? 0
          }
        });
      }
    }
    await tx.submission.update({
      where: { id },
      data: { status: "EVALUATED" }
    });
    await tx.submissionEvaluation.upsert({
      where: { submissionId: id },
      update: {
        score: payload.score,
        maxScore,
        status: "COMPLETED",
        isAutoEvaluated: false,
        evaluatorId,
        ...payload.feedback !== void 0 && { feedback: payload.feedback },
        evaluatedAt: /* @__PURE__ */ new Date()
      },
      create: {
        submissionId: id,
        score: payload.score,
        maxScore,
        status: "COMPLETED",
        isAutoEvaluated: false,
        evaluatorId,
        ...payload.feedback !== void 0 && { feedback: payload.feedback },
        evaluatedAt: /* @__PURE__ */ new Date()
      }
    });
  });
  await recomputeResult(submission.attempt.id);
  return prisma.submission.findUniqueOrThrow({
    where: { id },
    select: SUBMISSION_GRADING_SELECT
  });
};
var evaluationService = {
  getSubmissionsForAttempt,
  getSubmissionById,
  getPendingEvaluations,
  evaluateSubmission
};

// src/app/modules/evaluation/evaluation.controller.ts
var resolveScopeCompanyId3 = async (user) => {
  if (user.role === "ADMIN") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var getSubmissionsForAttempt2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await resolveScopeCompanyId3(currentUser);
    const submissions = await evaluationService.getSubmissionsForAttempt(
      req.params.attemptId,
      {
        id: currentUser.id,
        role: currentUser.role,
        ...companyId !== void 0 && { companyId }
      }
    );
    res.status(import_http_status_codes29.StatusCodes.OK).json({
      success: true,
      message: "Submissions retrieved successfully.",
      data: submissions
    });
  }
);
var getSubmissionById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId3(currentUser);
  const submission = await evaluationService.getSubmissionById(
    req.params.id,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(import_http_status_codes29.StatusCodes.OK).json({
    success: true,
    message: "Submission retrieved successfully.",
    data: submission
  });
});
var getPendingEvaluations2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const company = await companyService.getMyCompany(currentUser.id);
    const submissions = await evaluationService.getPendingEvaluations(
      req.params.assessmentId,
      company.id
    );
    res.status(import_http_status_codes29.StatusCodes.OK).json({
      success: true,
      message: "Pending evaluations retrieved successfully.",
      data: submissions
    });
  }
);
var evaluateSubmission2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const submission = await evaluationService.evaluateSubmission(
    req.params.id,
    currentUser.id,
    company.id,
    req.body
  );
  res.status(import_http_status_codes29.StatusCodes.OK).json({
    success: true,
    message: "Submission evaluated successfully.",
    data: submission
  });
});
var evaluationController = {
  getSubmissionsForAttempt: getSubmissionsForAttempt2,
  getSubmissionById: getSubmissionById2,
  getPendingEvaluations: getPendingEvaluations2,
  evaluateSubmission: evaluateSubmission2
};

// src/app/modules/evaluation/evaluation.validation.ts
var import_zod10 = require("zod");
var testCaseResultInputSchema2 = import_zod10.z.object({
  testCaseId: import_zod10.z.string().min(1),
  passed: import_zod10.z.boolean(),
  actualOutput: import_zod10.z.string().max(5e3).optional(),
  points: import_zod10.z.coerce.number().int().min(0).max(1e3).optional()
});
var manualEvaluationSchema2 = import_zod10.z.object({
  score: import_zod10.z.coerce.number().min(0, "Score cannot be negative."),
  feedback: import_zod10.z.string().trim().max(2e3).optional(),
  testCaseResults: import_zod10.z.array(testCaseResultInputSchema2).max(50).optional()
});
var evaluationValidation = {
  manualEvaluationSchema: manualEvaluationSchema2
};

// src/app/modules/evaluation/evaluation.routes.ts
var router9 = (0, import_express9.Router)();
router9.use(requireAuth, requireRole("RECRUITER", "ADMIN"));
router9.get(
  "/attempts/:attemptId/submissions",
  evaluationController.getSubmissionsForAttempt
);
router9.get(
  "/assessments/:assessmentId/pending",
  evaluationController.getPendingEvaluations
);
router9.get("/submissions/:id", evaluationController.getSubmissionById);
router9.patch(
  "/submissions/:id",
  validateRequest(evaluationValidation.manualEvaluationSchema),
  evaluationController.evaluateSubmission
);
var evaluationRoutes = router9;

// src/app/modules/invitation/invitation.routes.ts
var import_express10 = require("express");

// src/app/modules/invitation/invitation.controller.ts
var import_http_status_codes31 = require("http-status-codes");

// src/app/modules/invitation/invitation.service.ts
var import_node_crypto = require("crypto");
var import_http_status_codes30 = require("http-status-codes");

// src/lib/resend.ts
var import_resend = require("resend");
var resend = new import_resend.Resend(config_default.email.resendApiKey ?? "");

// src/app/utils/sendEmail.ts
var sendEmail = async ({ to, subject, html }) => {
  if (config_default.app.env !== "production") {
    console.log(`[Email] Dev-mode email: to=${to}, subject=${subject}`);
    console.log(`[Email] Body preview: ${html.slice(0, 200)}...`);
  }
  try {
    const result = await resend.emails.send({
      from: config_default.email.from ?? "onboarding@resend.dev",
      to,
      subject,
      html
    });
    if (config_default.app.env !== "production") {
      console.log(`[Email] Resend accepted:`, result);
    }
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    if (config_default.app.env !== "production") {
      console.log(
        "[Email] Hint: In Resend test mode, only verified domains can receive emails. Verify your domain at https://resend.com/domains"
      );
      console.log(
        "[Email] The OTP is logged above \u2014 use it directly for testing."
      );
    }
  }
};

// src/app/modules/invitation/invitation.const.ts
var INVITATION_SELECT = {
  id: true,
  assessmentId: true,
  candidateId: true,
  email: true,
  status: true,
  invitedAt: true,
  acceptedAt: true,
  expiresAt: true,
  completedAt: true,
  assessment: {
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      durationMinutes: true,
      totalMarks: true,
      passingMarks: true,
      companyId: true
    }
  }
};

// src/app/modules/invitation/invitation.service.ts
var generateInvitationToken = () => (0, import_node_crypto.createHash)("sha256").update((0, import_node_crypto.randomUUID)()).digest("hex");
var invitationEmailTemplate = (assessmentTitle, expiresAt) => `
	<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
		<h2>You've been invited to an assessment</h2>
		<p>You've been invited to take the assessment: <strong>${assessmentTitle}</strong>.</p>
		<p>Log in to your account and check your invitations to accept and start.</p>
		<p style="font-size: 13px; color: #666;">This invitation expires on ${expiresAt.toDateString()}.</p>
	</div>
`;
var invitationQueryBuilder = new QueryBuilder(
  prisma.assessmentInvitation,
  {
    searchableFields: ["email"],
    filterableFields: {
      status: {
        type: "enum",
        enum: {
          PENDING: "PENDING",
          ACCEPTED: "ACCEPTED",
          DECLINED: "DECLINED",
          EXPIRED: "EXPIRED",
          COMPLETED: "COMPLETED"
        }
      },
      invitedAt: "date"
    },
    sortableFields: ["invitedAt", "expiresAt"],
    selectableFields: Object.keys(INVITATION_SELECT),
    defaultSelect: INVITATION_SELECT,
    defaultSortField: "invitedAt"
  }
);
var inviteCandidates = async (assessmentId, companyId, payload) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.CONFLICT,
      "Candidates can only be invited to a published assessment."
    );
  }
  const uniqueEmails = Array.from(
    new Set(payload.emails.map((email) => email.toLowerCase()))
  );
  const alreadyInvited = await prisma.assessmentInvitation.findMany({
    where: { assessmentId, email: { in: uniqueEmails } },
    select: { email: true }
  });
  const alreadyInvitedSet = new Set(
    alreadyInvited.map((invitation) => invitation.email)
  );
  const emailsToInvite = uniqueEmails.filter(
    (email) => !alreadyInvitedSet.has(email)
  );
  if (emailsToInvite.length === 0) {
    return { invited: 0, skipped: uniqueEmails.length, invitations: [] };
  }
  const matchingCandidates = await prisma.user.findMany({
    where: {
      email: { in: emailsToInvite },
      role: "CANDIDATE",
      deletedAt: null
    },
    select: { id: true, email: true }
  });
  const candidateIdByEmail = new Map(
    matchingCandidates.map((user) => [user.email.toLowerCase(), user.id])
  );
  const expiresAt = new Date(
    Date.now() + (payload.expiresInDays ?? 7) * 24 * 60 * 60 * 1e3
  );
  const created = await prisma.$transaction(
    emailsToInvite.map(
      (email) => prisma.assessmentInvitation.create({
        data: {
          assessmentId,
          email,
          candidateId: candidateIdByEmail.get(email) ?? null,
          status: "PENDING",
          tokenHash: generateInvitationToken(),
          expiresAt
        },
        select: INVITATION_SELECT
      })
    )
  );
  await Promise.all(
    created.map(
      (invitation) => sendEmail({
        to: invitation.email,
        subject: `You're invited: ${assessment.title}`,
        html: invitationEmailTemplate(assessment.title, expiresAt)
      })
    )
  );
  return {
    invited: created.length,
    skipped: uniqueEmails.length - emailsToInvite.length,
    invitations: created
  };
};
var getInvitationsForAssessment = async (assessmentId, companyId, query) => {
  if (!companyId) {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.FORBIDDEN,
      "Recruiter scope could not be resolved."
    );
  }
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  return invitationQueryBuilder.execute(query, { assessmentId });
};
var getMyInvitations = async (userId, email) => {
  await prisma.assessmentInvitation.updateMany({
    where: { email: email.toLowerCase(), candidateId: null },
    data: { candidateId: userId }
  });
  return prisma.assessmentInvitation.findMany({
    where: { candidateId: userId },
    select: INVITATION_SELECT,
    orderBy: { invitedAt: "desc" }
  });
};
var getInvitationById = async (id, requester) => {
  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { id },
    select: INVITATION_SELECT
  });
  if (!invitation) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Invitation not found.");
  }
  const isInvitedCandidate = invitation.candidateId === requester.id || invitation.email.toLowerCase() === requester.email.toLowerCase();
  const isOwningRecruiter = requester.companyId !== void 0 && invitation.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isInvitedCandidate && !isOwningRecruiter) {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.FORBIDDEN,
      "You don't have permission to view this invitation."
    );
  }
  return invitation;
};
var acceptInvitation = async (id, userId, email) => {
  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { id },
    include: { assessment: true }
  });
  if (!invitation) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Invitation not found.");
  }
  const belongsToUser = invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();
  if (!belongsToUser) {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.FORBIDDEN,
      "This invitation does not belong to your account."
    );
  }
  if (invitation.status === "PENDING" && invitation.expiresAt && invitation.expiresAt < /* @__PURE__ */ new Date()) {
    await prisma.assessmentInvitation.update({
      where: { id },
      data: { status: "EXPIRED" }
    });
    throw new appError_default(import_http_status_codes30.StatusCodes.GONE, "This invitation has expired.");
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.CONFLICT,
      `This invitation is already ${invitation.status.toLowerCase()}.`
    );
  }
  if (invitation.assessment.status !== "PUBLISHED" && invitation.assessment.status !== "ACTIVE") {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.CONFLICT,
      "This assessment is no longer accepting candidates."
    );
  }
  return prisma.assessmentInvitation.update({
    where: { id },
    data: { status: "ACCEPTED", candidateId: userId, acceptedAt: /* @__PURE__ */ new Date() },
    select: INVITATION_SELECT
  });
};
var declineInvitation = async (id, userId, email) => {
  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { id }
  });
  if (!invitation) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Invitation not found.");
  }
  const belongsToUser = invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();
  if (!belongsToUser) {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.FORBIDDEN,
      "This invitation does not belong to your account."
    );
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.CONFLICT,
      `This invitation is already ${invitation.status.toLowerCase()}.`
    );
  }
  return prisma.assessmentInvitation.update({
    where: { id },
    data: { status: "DECLINED", candidateId: invitation.candidateId ?? userId },
    select: INVITATION_SELECT
  });
};
var cancelInvitation = async (id, companyId) => {
  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { id },
    include: { assessment: true }
  });
  if (!invitation || invitation.assessment.companyId !== companyId) {
    throw new appError_default(import_http_status_codes30.StatusCodes.NOT_FOUND, "Invitation not found.");
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      import_http_status_codes30.StatusCodes.CONFLICT,
      "Only a pending invitation can be cancelled."
    );
  }
  await prisma.assessmentInvitation.delete({ where: { id } });
  return { message: "Invitation cancelled successfully." };
};
var invitationService = {
  inviteCandidates,
  getInvitationsForAssessment,
  getMyInvitations,
  getInvitationById,
  acceptInvitation,
  declineInvitation,
  cancelInvitation
};

// src/app/modules/invitation/invitation.controller.ts
var resolveScopeCompanyId4 = async (user) => {
  if (user.role === "ADMIN") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var inviteCandidates2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const result = await invitationService.inviteCandidates(
    req.params.assessmentId,
    company.id,
    req.body
  );
  res.status(import_http_status_codes31.StatusCodes.CREATED).json({
    success: true,
    message: `${result.invited} candidate(s) invited${result.skipped ? `, ${result.skipped} already invited` : ""}.`,
    data: result
  });
});
var getInvitationsForAssessment2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await resolveScopeCompanyId4(currentUser);
    const result = await invitationService.getInvitationsForAssessment(
      req.params.assessmentId,
      companyId,
      req.query
    );
    res.status(import_http_status_codes31.StatusCodes.OK).json({
      success: true,
      message: "Invitations retrieved successfully.",
      meta: result.meta,
      data: result.data
    });
  }
);
var getMyInvitations2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const invitations = await invitationService.getMyInvitations(
    currentUser.id,
    currentUser.email
  );
  res.status(import_http_status_codes31.StatusCodes.OK).json({
    success: true,
    message: "Invitations retrieved successfully.",
    data: invitations
  });
});
var getInvitationById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId4(currentUser);
  const invitation = await invitationService.getInvitationById(
    req.params.id,
    {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(import_http_status_codes31.StatusCodes.OK).json({
    success: true,
    message: "Invitation retrieved successfully.",
    data: invitation
  });
});
var acceptInvitation2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const invitation = await invitationService.acceptInvitation(
    req.params.id,
    currentUser.id,
    currentUser.email
  );
  res.status(import_http_status_codes31.StatusCodes.OK).json({
    success: true,
    message: "Invitation accepted successfully.",
    data: invitation
  });
});
var declineInvitation2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const invitation = await invitationService.declineInvitation(
    req.params.id,
    currentUser.id,
    currentUser.email
  );
  res.status(import_http_status_codes31.StatusCodes.OK).json({
    success: true,
    message: "Invitation declined.",
    data: invitation
  });
});
var cancelInvitation2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const result = await invitationService.cancelInvitation(
    req.params.id,
    company.id
  );
  res.status(import_http_status_codes31.StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var invitationController = {
  inviteCandidates: inviteCandidates2,
  getInvitationsForAssessment: getInvitationsForAssessment2,
  getMyInvitations: getMyInvitations2,
  getInvitationById: getInvitationById2,
  acceptInvitation: acceptInvitation2,
  declineInvitation: declineInvitation2,
  cancelInvitation: cancelInvitation2
};

// src/app/modules/invitation/invitation.validation.ts
var import_zod11 = require("zod");
var inviteCandidatesSchema = import_zod11.z.object({
  emails: import_zod11.z.array(import_zod11.z.string().trim().email("Invalid email address.")).min(1, "Provide at least one email address.").max(100, "At most 100 emails per request."),
  expiresInDays: import_zod11.z.coerce.number().int().min(1).max(90).optional()
});
var invitationValidation = {
  inviteCandidatesSchema
};

// src/app/modules/invitation/invitation.routes.ts
var router10 = (0, import_express10.Router)();
router10.use(requireAuth);
router10.post(
  "/assessments/:assessmentId",
  requireRole("RECRUITER"),
  validateRequest(invitationValidation.inviteCandidatesSchema),
  invitationController.inviteCandidates
);
router10.get(
  "/assessments/:assessmentId",
  requireRole("RECRUITER", "ADMIN"),
  invitationController.getInvitationsForAssessment
);
router10.get(
  "/me",
  requireRole("CANDIDATE"),
  invitationController.getMyInvitations
);
router10.get("/:id", invitationController.getInvitationById);
router10.post(
  "/:id/accept",
  requireRole("CANDIDATE"),
  invitationController.acceptInvitation
);
router10.post(
  "/:id/decline",
  requireRole("CANDIDATE"),
  invitationController.declineInvitation
);
router10.delete(
  "/:id",
  requireRole("RECRUITER"),
  invitationController.cancelInvitation
);
var invitationRoutes = router10;

// src/app/modules/notification/notification.routes.ts
var import_express11 = require("express");

// src/app/modules/notification/notification.controller.ts
var import_http_status_codes33 = require("http-status-codes");

// src/app/modules/notification/notification.service.ts
var import_http_status_codes32 = require("http-status-codes");

// src/app/modules/notification/notification.const.ts
var NOTIFICATION_SELECT = {
  id: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  metadata: true,
  createdAt: true
};

// src/app/modules/notification/notification.service.ts
var notificationQueryBuilder = new QueryBuilder(prisma.notification, {
  searchableFields: ["title", "message"],
  filterableFields: {
    isRead: "boolean",
    type: {
      type: "enum",
      enum: {
        ASSESSMENT_INVITATION: "ASSESSMENT_INVITATION",
        ASSESSMENT_REMINDER: "ASSESSMENT_REMINDER",
        ASSESSMENT_RESULT: "ASSESSMENT_RESULT",
        ATTEMPT_SUBMITTED: "ATTEMPT_SUBMITTED",
        ATTEMPT_EVALUATED: "ATTEMPT_EVALUATED",
        PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
        PAYMENT_FAILED: "PAYMENT_FAILED",
        SYSTEM: "SYSTEM"
      }
    },
    createdAt: "date"
  },
  sortableFields: ["createdAt"],
  selectableFields: Object.keys(NOTIFICATION_SELECT),
  defaultSortField: "createdAt"
});
var getMyNotifications = async (userId, query) => {
  return notificationQueryBuilder.execute(query, { userId });
};
var getUnreadCount = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false }
  });
  return { unreadCount };
};
var markAsRead = async (id, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId }
  });
  if (!notification) {
    throw new appError_default(import_http_status_codes32.StatusCodes.NOT_FOUND, "Notification not found.");
  }
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
    select: NOTIFICATION_SELECT
  });
};
var markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  return { updated: result.count };
};
var deleteNotification = async (id, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId }
  });
  if (!notification) {
    throw new appError_default(import_http_status_codes32.StatusCodes.NOT_FOUND, "Notification not found.");
  }
  await prisma.notification.delete({ where: { id } });
  return { message: "Notification deleted successfully." };
};
var notificationService = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

// src/app/modules/notification/notification.controller.ts
var getMyNotifications2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.getMyNotifications(
    currentUser.id,
    req.query
  );
  res.status(import_http_status_codes33.StatusCodes.OK).json({
    success: true,
    message: "Notifications retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getUnreadCount2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.getUnreadCount(currentUser.id);
  res.status(import_http_status_codes33.StatusCodes.OK).json({
    success: true,
    message: "Unread count retrieved successfully.",
    data: result
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const notification = await notificationService.markAsRead(
    req.params.id,
    currentUser.id
  );
  res.status(import_http_status_codes33.StatusCodes.OK).json({
    success: true,
    message: "Notification marked as read.",
    data: notification
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.markAllAsRead(currentUser.id);
  res.status(import_http_status_codes33.StatusCodes.OK).json({
    success: true,
    message: `${result.updated} notification(s) marked as read.`,
    data: result
  });
});
var deleteNotification2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.deleteNotification(
    req.params.id,
    currentUser.id
  );
  res.status(import_http_status_codes33.StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var notificationController = {
  getMyNotifications: getMyNotifications2,
  getUnreadCount: getUnreadCount2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2,
  deleteNotification: deleteNotification2
};

// src/app/modules/notification/notification.routes.ts
var router11 = (0, import_express11.Router)();
router11.use(requireAuth);
router11.get("/me", notificationController.getMyNotifications);
router11.get("/unread-count", notificationController.getUnreadCount);
router11.patch("/read-all", notificationController.markAllAsRead);
router11.patch("/:id/read", notificationController.markAsRead);
router11.delete("/:id", notificationController.deleteNotification);
var notificationRoutes = router11;

// src/app/modules/payment/payment.routes.ts
var import_express12 = require("express");

// src/app/modules/payment/payment.controller.ts
var import_http_status_codes34 = require("http-status-codes");
var createCheckoutSession2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const company = await companyService.getMyCompany(currentUser.id);
    const result = await paymentService.createCheckoutSession(
      currentUser.id,
      company.id,
      req.body
    );
    res.status(import_http_status_codes34.StatusCodes.CREATED).json({
      success: true,
      message: "Checkout session created.",
      data: result
    });
  }
);
var getMyPayments2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await paymentService.getMyPayments(
    currentUser.id,
    req.query
  );
  res.status(import_http_status_codes34.StatusCodes.OK).json({
    success: true,
    message: "Payments retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getAllPayments2 = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayments(
    req.query
  );
  res.status(import_http_status_codes34.StatusCodes.OK).json({
    success: true,
    message: "Payments retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getPaymentById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const payment = await paymentService.getPaymentById(req.params.id, {
    id: currentUser.id,
    role: currentUser.role
  });
  res.status(import_http_status_codes34.StatusCodes.OK).json({
    success: true,
    message: "Payment retrieved successfully.",
    data: payment
  });
});
var paymentController = {
  createCheckoutSession: createCheckoutSession2,
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  getPaymentById: getPaymentById2
};

// src/app/modules/payment/payment.validation.ts
var import_zod12 = require("zod");
var createCheckoutSchema = import_zod12.z.object({
  plan: import_zod12.z.enum(["PRO", "ENTERPRISE"], {
    message: "Plan must be PRO or ENTERPRISE."
  })
});
var paymentValidation = {
  createCheckoutSchema
};

// src/app/modules/payment/payment.routes.ts
var router12 = (0, import_express12.Router)();
router12.use(requireAuth);
router12.post(
  "/checkout",
  requireRole("RECRUITER"),
  validateRequest(paymentValidation.createCheckoutSchema),
  paymentController.createCheckoutSession
);
router12.get("/me", requireRole("RECRUITER"), paymentController.getMyPayments);
router12.get("/", requireRole("ADMIN"), paymentController.getAllPayments);
router12.get("/:id", paymentController.getPaymentById);
var paymentRoutes = router12;

// src/app/modules/problem/problem.routes.ts
var import_express13 = require("express");

// src/app/modules/problem/problem.controller.ts
var import_http_status_codes36 = require("http-status-codes");

// src/app/modules/problem/problem.service.ts
var import_http_status_codes35 = require("http-status-codes");

// src/app/modules/problem/problem.const.ts
var PROBLEM_DETAIL_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  type: true,
  difficulty: true,
  defaultMarks: true,
  timeLimitSeconds: true,
  isPublic: true,
  companyId: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  mcqProblem: {
    select: {
      id: true,
      type: true,
      explanation: true,
      options: {
        select: { id: true, optionText: true, isCorrect: true, order: true },
        orderBy: { order: "asc" }
      }
    }
  },
  testCases: {
    select: {
      id: true,
      input: true,
      expectedOutput: true,
      isSample: true,
      points: true,
      timeLimitMs: true,
      memoryLimitMb: true
    },
    orderBy: { id: "asc" }
  }
};
var PROBLEM_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  type: true,
  difficulty: true,
  defaultMarks: true,
  isPublic: true,
  createdAt: true
};

// src/app/modules/problem/problem.service.ts
var problemQueryBuilder = new QueryBuilder(prisma.problem, {
  searchableFields: ["title", "description"],
  filterableFields: {
    type: {
      type: "enum",
      enum: { MCQ: "MCQ", CODING: "CODING", WRITTEN: "WRITTEN" }
    },
    difficulty: {
      type: "enum",
      enum: { EASY: "EASY", MEDIUM: "MEDIUM", HARD: "HARD" }
    },
    isPublic: "boolean",
    createdAt: "date"
  },
  sortableFields: ["createdAt", "title", "defaultMarks"],
  selectableFields: Object.keys(PROBLEM_LIST_SELECT),
  softDelete: true,
  defaultSortField: "createdAt"
});
var createProblem = async (companyId, createdById, payload) => {
  const slug = await generateUniqueSlug(
    payload.title,
    (candidate) => prisma.problem.findUnique({ where: { companyId_slug: { companyId, slug: candidate } } }).then(Boolean)
  );
  const baseData = {
    title: payload.title,
    slug,
    description: payload.description,
    difficulty: payload.difficulty ?? "MEDIUM",
    defaultMarks: payload.defaultMarks ?? 10,
    isPublic: payload.isPublic ?? false,
    companyId,
    createdById
  };
  if (payload.type === "MCQ") {
    return prisma.problem.create({
      data: {
        ...baseData,
        type: "MCQ",
        mcqProblem: {
          create: {
            type: payload.mcqType ?? "SINGLE_CHOICE",
            ...payload.explanation !== void 0 && {
              explanation: payload.explanation
            },
            options: {
              create: payload.options.map((option) => ({
                optionText: option.optionText,
                isCorrect: option.isCorrect,
                order: option.order
              }))
            }
          }
        }
      },
      select: PROBLEM_DETAIL_SELECT
    });
  }
  if (payload.type === "CODING") {
    return prisma.problem.create({
      data: {
        ...baseData,
        type: "CODING",
        ...payload.timeLimitSeconds !== void 0 && {
          timeLimitSeconds: payload.timeLimitSeconds
        },
        testCases: { create: payload.testCases }
      },
      select: PROBLEM_DETAIL_SELECT
    });
  }
  return prisma.problem.create({
    data: { ...baseData, type: "WRITTEN" },
    select: PROBLEM_DETAIL_SELECT
  });
};
var getAllProblems = async (query, companyId) => {
  const tenantScope = companyId ? { companyId } : void 0;
  return problemQueryBuilder.execute(query, tenantScope);
};
var getProblemById = async (id, companyId) => {
  const problem = await prisma.problem.findFirst({
    where: { id, deletedAt: null, ...companyId && { companyId } },
    select: PROBLEM_DETAIL_SELECT
  });
  if (!problem) {
    throw new appError_default(import_http_status_codes35.StatusCodes.NOT_FOUND, "Problem not found.");
  }
  return problem;
};
var updateProblem = async (id, companyId, payload) => {
  const existing = await prisma.problem.findFirst({
    where: { id, companyId, deletedAt: null }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes35.StatusCodes.NOT_FOUND, "Problem not found.");
  }
  const { options, testCases, mcqType, explanation, ...topLevel } = payload;
  if (Object.keys(topLevel).length > 0) {
    await prisma.problem.update({ where: { id }, data: topLevel });
  }
  if (existing.type === "MCQ" && (options || mcqType !== void 0 || explanation !== void 0)) {
    const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({
      where: { problemId: id }
    });
    if (mcqType !== void 0 || explanation !== void 0) {
      await prisma.mcqProblem.update({
        where: { id: mcqProblem.id },
        data: {
          ...mcqType !== void 0 && { type: mcqType },
          ...explanation !== void 0 && { explanation }
        }
      });
    }
    if (options) {
      await prisma.$transaction(
        options.map(
          (option) => prisma.mcqOption.upsert({
            where: {
              mcqProblemId_order: {
                mcqProblemId: mcqProblem.id,
                order: option.order
              }
            },
            update: {
              optionText: option.optionText,
              isCorrect: option.isCorrect
            },
            create: { mcqProblemId: mcqProblem.id, ...option }
          })
        )
      );
    }
  }
  if (existing.type === "CODING" && testCases) {
    const hasGradedResult = await prisma.testCaseResult.findFirst({
      where: { testCase: { problemId: id } }
    });
    if (hasGradedResult) {
      throw new appError_default(
        import_http_status_codes35.StatusCodes.CONFLICT,
        "This problem's test cases can't be changed after candidates have been graded against them. Create a new problem instead."
      );
    }
    await prisma.testCase.deleteMany({ where: { problemId: id } });
    await prisma.testCase.createMany({
      data: testCases.map((testCase) => ({ problemId: id, ...testCase }))
    });
  }
  return getProblemById(id, companyId);
};
var softDeleteProblem = async (id, companyId) => {
  const existing = await prisma.problem.findFirst({
    where: { id, companyId, deletedAt: null }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes35.StatusCodes.NOT_FOUND, "Problem not found.");
  }
  const usedInLiveAssessment = await prisma.assessmentProblem.findFirst({
    where: {
      problemId: id,
      assessment: { status: { in: ["PUBLISHED", "ACTIVE"] }, deletedAt: null }
    }
  });
  if (usedInLiveAssessment) {
    throw new appError_default(
      import_http_status_codes35.StatusCodes.CONFLICT,
      "This problem is part of a published assessment and can't be deleted. Remove it from the assessment first."
    );
  }
  await prisma.problem.update({
    where: { id },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return { message: "Problem deleted successfully." };
};
var problemService = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  softDeleteProblem
};

// src/app/modules/problem/problem.controller.ts
var resolveScopeCompanyId5 = async (user) => {
  if (user.role === "ADMIN") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var createProblem2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const problem = await problemService.createProblem(
    company.id,
    currentUser.id,
    req.body
  );
  res.status(import_http_status_codes36.StatusCodes.CREATED).json({
    success: true,
    message: "Problem created successfully.",
    data: problem
  });
});
var getAllProblems2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId5(currentUser);
  const result = await problemService.getAllProblems(
    req.query,
    companyId
  );
  res.status(import_http_status_codes36.StatusCodes.OK).json({
    success: true,
    message: "Problems retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getProblemById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId5(currentUser);
  const problem = await problemService.getProblemById(
    req.params.id,
    companyId
  );
  res.status(import_http_status_codes36.StatusCodes.OK).json({
    success: true,
    message: "Problem retrieved successfully.",
    data: problem
  });
});
var updateProblem2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const problem = await problemService.updateProblem(
    req.params.id,
    company.id,
    req.body
  );
  res.status(import_http_status_codes36.StatusCodes.OK).json({
    success: true,
    message: "Problem updated successfully.",
    data: problem
  });
});
var deleteProblem = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const result = await problemService.softDeleteProblem(
    req.params.id,
    company.id
  );
  res.status(import_http_status_codes36.StatusCodes.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var problemController = {
  createProblem: createProblem2,
  getAllProblems: getAllProblems2,
  getProblemById: getProblemById2,
  updateProblem: updateProblem2,
  deleteProblem
};

// src/app/modules/problem/problem.validation.ts
var import_zod13 = require("zod");
var mcqOptionSchema = import_zod13.z.object({
  optionText: import_zod13.z.string().trim().min(1, "Option text is required.").max(500),
  isCorrect: import_zod13.z.boolean(),
  order: import_zod13.z.number().int().min(1, "Option order must start at 1.")
});
var testCaseSchema = import_zod13.z.object({
  input: import_zod13.z.string().max(5e3).optional(),
  expectedOutput: import_zod13.z.string().trim().min(1, "Expected output is required.").max(5e3),
  isSample: import_zod13.z.boolean().optional(),
  points: import_zod13.z.coerce.number().int().min(0).max(1e3).optional(),
  timeLimitMs: import_zod13.z.coerce.number().int().positive().optional(),
  memoryLimitMb: import_zod13.z.coerce.number().int().positive().optional()
});
var baseFields = {
  title: import_zod13.z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  description: import_zod13.z.string().trim().min(10, "Description must be at least 10 characters.").max(1e4),
  difficulty: import_zod13.z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  defaultMarks: import_zod13.z.coerce.number().int().min(1, "Marks must be at least 1.").max(1e3).optional(),
  isPublic: import_zod13.z.boolean().optional()
};
var mcqCreateSchema = import_zod13.z.object({
  ...baseFields,
  type: import_zod13.z.literal("MCQ"),
  mcqType: import_zod13.z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).default("SINGLE_CHOICE"),
  explanation: import_zod13.z.string().trim().max(2e3).optional(),
  options: import_zod13.z.array(mcqOptionSchema).min(2, "Provide at least 2 options.").max(10, "At most 10 options are allowed.")
});
var codingCreateSchema = import_zod13.z.object({
  ...baseFields,
  type: import_zod13.z.literal("CODING"),
  timeLimitSeconds: import_zod13.z.coerce.number().int().min(1).max(7200).optional(),
  testCases: import_zod13.z.array(testCaseSchema).min(1, "Provide at least 1 test case.")
});
var writtenCreateSchema = import_zod13.z.object({
  ...baseFields,
  type: import_zod13.z.literal("WRITTEN")
});
var createProblemSchema = import_zod13.z.discriminatedUnion("type", [
  mcqCreateSchema,
  codingCreateSchema,
  writtenCreateSchema
]).superRefine((data, ctx) => {
  if (data.type !== "MCQ") return;
  const orders = data.options.map((option) => option.order);
  if (new Set(orders).size !== orders.length) {
    ctx.addIssue({
      code: "custom",
      message: "Option order values must be unique.",
      path: ["options"]
    });
  }
  const correctCount = data.options.filter(
    (option) => option.isCorrect
  ).length;
  if (correctCount === 0) {
    ctx.addIssue({
      code: "custom",
      message: "At least one option must be marked correct.",
      path: ["options"]
    });
  }
  if (data.mcqType === "SINGLE_CHOICE" && correctCount > 1) {
    ctx.addIssue({
      code: "custom",
      message: "SINGLE_CHOICE questions must have exactly one correct option.",
      path: ["options"]
    });
  }
});
var updateProblemSchema = import_zod13.z.object({
  title: import_zod13.z.string().trim().min(3).max(200).optional(),
  description: import_zod13.z.string().trim().min(10).max(1e4).optional(),
  difficulty: import_zod13.z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  defaultMarks: import_zod13.z.coerce.number().int().min(1).max(1e3).optional(),
  isPublic: import_zod13.z.boolean().optional(),
  timeLimitSeconds: import_zod13.z.coerce.number().int().min(1).max(7200).optional(),
  mcqType: import_zod13.z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).optional(),
  explanation: import_zod13.z.string().trim().max(2e3).optional(),
  options: import_zod13.z.array(mcqOptionSchema).min(2).max(10).optional(),
  testCases: import_zod13.z.array(testCaseSchema).min(1).optional()
}).superRefine((data, ctx) => {
  if (!data.options) return;
  const orders = data.options.map((option) => option.order);
  if (new Set(orders).size !== orders.length) {
    ctx.addIssue({
      code: "custom",
      message: "Option order values must be unique.",
      path: ["options"]
    });
  }
  if (!data.options.some((option) => option.isCorrect)) {
    ctx.addIssue({
      code: "custom",
      message: "At least one option must be marked correct.",
      path: ["options"]
    });
  }
});
var problemValidation = {
  createProblemSchema,
  updateProblemSchema
};

// src/app/modules/problem/problem.routes.ts
var router13 = (0, import_express13.Router)();
router13.use(requireAuth);
router13.post(
  "/",
  requireRole("RECRUITER"),
  validateRequest(problemValidation.createProblemSchema),
  problemController.createProblem
);
router13.get(
  "/",
  requireRole("RECRUITER", "ADMIN"),
  problemController.getAllProblems
);
router13.get(
  "/:id",
  requireRole("RECRUITER", "ADMIN"),
  problemController.getProblemById
);
router13.patch(
  "/:id",
  requireRole("RECRUITER"),
  validateRequest(problemValidation.updateProblemSchema),
  problemController.updateProblem
);
router13.delete(
  "/:id",
  requireRole("RECRUITER"),
  problemController.deleteProblem
);
var problemRoutes = router13;

// src/app/modules/result/result.routes.ts
var import_express14 = require("express");

// src/app/modules/result/result.controller.ts
var import_http_status_codes38 = require("http-status-codes");

// src/app/modules/result/result.service.ts
var import_http_status_codes37 = require("http-status-codes");

// src/app/modules/result/result.const.ts
var RESULT_LEADERBOARD_SELECT = {
  id: true,
  totalScore: true,
  totalMarks: true,
  percentage: true,
  status: true,
  rank: true,
  evaluatedAt: true,
  attempt: {
    select: {
      id: true,
      attemptNumber: true,
      submittedAt: true,
      candidate: { select: { id: true, name: true, email: true } }
    }
  }
};

// src/app/modules/result/result.service.ts
var getResultByAttemptId = async (attemptId, requester) => {
  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      candidateId: true,
      assessment: { select: { companyId: true } }
    }
  });
  if (!attempt) {
    throw new appError_default(import_http_status_codes37.StatusCodes.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(
      import_http_status_codes37.StatusCodes.FORBIDDEN,
      "You don't have permission to view this result."
    );
  }
  const result = await prisma.result.findUnique({
    where: { attemptId },
    select: RESULT_LEADERBOARD_SELECT
  });
  if (!result) {
    throw new appError_default(
      import_http_status_codes37.StatusCodes.NOT_FOUND,
      "Result not available yet \u2014 this attempt may not be finalized."
    );
  }
  return result;
};
var getResultsForAssessment = async (assessmentId, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      deletedAt: null,
      ...companyId && { companyId }
    }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes37.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  return prisma.result.findMany({
    where: { assessmentId },
    select: RESULT_LEADERBOARD_SELECT,
    orderBy: [{ totalScore: "desc" }, { evaluatedAt: "asc" }]
  });
};
var computeRanks = async (assessmentId, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, companyId, deletedAt: null }
  });
  if (!assessment) {
    throw new appError_default(import_http_status_codes37.StatusCodes.NOT_FOUND, "Assessment not found.");
  }
  const finalizedResults = await prisma.result.findMany({
    where: { assessmentId, status: { in: ["PASSED", "FAILED"] } },
    orderBy: { totalScore: "desc" },
    select: { id: true }
  });
  if (finalizedResults.length === 0) {
    throw new appError_default(
      import_http_status_codes37.StatusCodes.BAD_REQUEST,
      "No fully-graded results to rank yet."
    );
  }
  await prisma.$transaction(
    finalizedResults.map(
      (result, index) => prisma.result.update({
        where: { id: result.id },
        data: { rank: index + 1 }
      })
    )
  );
  return { ranked: finalizedResults.length };
};
var resultService = {
  getResultByAttemptId,
  getResultsForAssessment,
  computeRanks
};

// src/app/modules/result/result.controller.ts
var resolveScopeCompanyId6 = async (user) => {
  if (user.role !== "RECRUITER") return void 0;
  const company = await companyService.getMyCompany(user.id);
  return company.id;
};
var getResultByAttemptId2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await resolveScopeCompanyId6(currentUser);
  const result = await resultService.getResultByAttemptId(
    req.params.attemptId,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(import_http_status_codes38.StatusCodes.OK).json({
    success: true,
    message: "Result retrieved successfully.",
    data: result
  });
});
var getResultsForAssessment2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = currentUser.role === "ADMIN" ? void 0 : (await companyService.getMyCompany(currentUser.id)).id;
    const results = await resultService.getResultsForAssessment(
      req.params.assessmentId,
      companyId
    );
    res.status(import_http_status_codes38.StatusCodes.OK).json({
      success: true,
      message: "Results retrieved successfully.",
      data: results
    });
  }
);
var computeRanks2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  const result = await resultService.computeRanks(
    req.params.assessmentId,
    company.id
  );
  res.status(import_http_status_codes38.StatusCodes.OK).json({
    success: true,
    message: `Ranked ${result.ranked} result(s).`,
    data: result
  });
});
var resultController = {
  getResultByAttemptId: getResultByAttemptId2,
  getResultsForAssessment: getResultsForAssessment2,
  computeRanks: computeRanks2
};

// src/app/modules/result/result.routes.ts
var router14 = (0, import_express14.Router)();
router14.use(requireAuth);
router14.get("/attempts/:attemptId", resultController.getResultByAttemptId);
router14.get(
  "/assessments/:assessmentId",
  requireRole("RECRUITER", "ADMIN"),
  resultController.getResultsForAssessment
);
router14.post(
  "/assessments/:assessmentId/compute-ranks",
  requireRole("RECRUITER"),
  resultController.computeRanks
);
var resultRoutes = router14;

// src/app/modules/user/user.routes.ts
var import_express15 = require("express");

// src/app/modules/user/user.controller.ts
var import_http_status_codes40 = require("http-status-codes");

// src/app/modules/user/user.service.ts
var import_http_status_codes39 = require("http-status-codes");

// src/app/modules/user/user.const.ts
var USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  phone: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true
};

// src/app/modules/user/user.service.ts
var userQueryBuilder = new QueryBuilder(prisma.user, {
  searchableFields: ["name", "email", "phone"],
  filterableFields: {
    role: {
      type: "enum",
      enum: {
        ADMIN: "ADMIN",
        RECRUITER: "RECRUITER",
        CANDIDATE: "CANDIDATE"
      }
    },
    status: {
      type: "enum",
      enum: {
        ACTIVE: "ACTIVE",
        SUSPENDED: "SUSPENDED",
        PENDING: "PENDING"
      }
    },
    createdAt: "date"
  },
  sortableFields: ["createdAt", "name", "email"],
  selectableFields: Object.keys(USER_PUBLIC_SELECT),
  softDelete: true,
  defaultSortField: "createdAt"
});
var assertNotActingOnSelf = (actorId, targetId, action) => {
  if (actorId === targetId) {
    throw new appError_default(
      import_http_status_codes39.StatusCodes.FORBIDDEN,
      `You cannot ${action} your own account.`
    );
  }
};
var getAllUsers = async (query) => {
  return userQueryBuilder.execute(query);
};
var getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    },
    select: USER_PUBLIC_SELECT
  });
  if (!user) {
    throw new appError_default(import_http_status_codes39.StatusCodes.NOT_FOUND, "User not found.");
  }
  return user;
};
var updateProfile = async (id, payload, file) => {
  const existing = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes39.StatusCodes.NOT_FOUND, "User not found.");
  }
  const updateData = {
    ...payload
  };
  if (file) {
    const uploaded = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      "avatars"
    );
    updateData.image = uploaded.secure_url;
  }
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: updateData,
    select: USER_PUBLIC_SELECT
  });
  return updatedUser;
};
var updateRole = async (id, role, actorId, actorRole) => {
  assertNotActingOnSelf(actorId, id, "change the role of");
  const existing = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes39.StatusCodes.NOT_FOUND, "User not found.");
  }
  if ((role === "ADMIN" || existing.role === "ADMIN") && actorRole !== "ADMIN") {
    throw new appError_default(
      import_http_status_codes39.StatusCodes.FORBIDDEN,
      "Only an Admin can assign or modify Admin privileges."
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
  return updatedUser;
};
var updateStatus = async (id, status, actorId) => {
  assertNotActingOnSelf(actorId, id, "change the status of");
  const existing = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes39.StatusCodes.NOT_FOUND, "User not found.");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      status
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true
    }
  });
  return updatedUser;
};
var softDeleteUser = async (id, actorId) => {
  assertNotActingOnSelf(actorId, id, "delete");
  const existing = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existing) {
    throw new appError_default(import_http_status_codes39.StatusCodes.NOT_FOUND, "User not found.");
  }
  await prisma.user.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      status: "SUSPENDED"
    }
  });
  return {
    message: "User deleted successfully."
  };
};
var userService = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateRole,
  updateStatus,
  softDeleteUser
};

// src/app/modules/user/user.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(
    req.query
  );
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "Users retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "User retrieved successfully.",
    data: user
  });
});
var getMyProfile3 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const user = await userService.getUserById(currentUser.id);
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: user
  });
});
var updateMyProfile = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const user = await userService.updateProfile(
    currentUser.id,
    req.body,
    req.file
  );
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "Profile updated successfully.",
    data: user
  });
});
var updateRole2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const user = await userService.updateRole(
    req.params.id,
    req.body.role,
    currentUser.id,
    currentUser.role
  );
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "User role updated successfully.",
    data: user
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const user = await userService.updateStatus(
    req.params.id,
    req.body.status,
    currentUser.id
  );
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "User status updated successfully.",
    data: user
  });
});
var deleteUser = catchAsync(async (req, res) => {
  const currentUser = req.user;
  await userService.softDeleteUser(req.params.id, currentUser.id);
  res.status(import_http_status_codes40.StatusCodes.OK).json({
    success: true,
    message: "User deleted successfully.",
    data: null
  });
});
var userController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  getMyProfile: getMyProfile3,
  updateMyProfile,
  updateRole: updateRole2,
  updateStatus: updateStatus2,
  deleteUser
};

// src/app/modules/user/user.routes.ts
var router15 = (0, import_express15.Router)();
router15.use(requireAuth);
router15.get("/me", userController.getMyProfile);
router15.patch(
  "/me",
  imageUpload.single("image"),
  validateRequestWithFile(userValidation.updateProfileSchema),
  userController.updateMyProfile
);
router15.get("/", requireRole("ADMIN"), userController.getAllUsers);
router15.get("/:id", requireRole("ADMIN"), userController.getUserById);
router15.patch(
  "/:id/role",
  requireRole("ADMIN"),
  validateRequest(userValidation.updateRoleSchema),
  userController.updateRole
);
router15.patch(
  "/:id/status",
  requireRole("ADMIN"),
  validateRequest(userValidation.updateStatusSchema),
  userController.updateStatus
);
router15.delete("/:id", requireRole("ADMIN"), userController.deleteUser);
var userRoutes = router15;

// src/app/routes/index.ts
var router16 = (0, import_express16.Router)();
var moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/companies", route: companyRoutes },
  { path: "/candidates", route: candidateRoutes },
  { path: "/problems", route: problemRoutes },
  { path: "/assessments", route: assessmentRoutes },
  { path: "/invitations", route: invitationRoutes },
  { path: "/attempts", route: attemptRoutes },
  { path: "/evaluations", route: evaluationRoutes },
  { path: "/results", route: resultRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/notifications", route: notificationRoutes },
  { path: "/admin", route: adminRoutes },
  { path: "/consents", route: consentRoutes }
];
for (const { path: path2, route } of moduleRoutes) {
  router16.use(path2, route);
}
var globalRoutes = router16;

// src/app.ts
var app = (0, import_express17.default)();
app.set("trust proxy", 1);
if (config_default.app.env === "production") {
  app.use(forceHttps);
}
app.use((0, import_helmet.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`
    );
  });
  next();
});
var allowedOrigins = config_default.app.clientUrl.split(",").map((origin) => origin.trim());
app.use(
  (0, import_cors.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "X-Requested-With"
    ]
  })
);
app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/auth/sign-in", authRateLimiter);
app.use("/api/auth/sign-up", authRateLimiter);
app.use("/api/auth/forget-password", authRateLimiter);
app.use("/api/auth/email-otp", authRateLimiter);
if (config_default.app.env !== "production") {
  app.use("/api/auth", (req, _res, next) => {
    if (!req.headers.origin) {
      req.headers.origin = "http://localhost:3000";
    }
    next();
  });
}
app.all("/api/auth/*splat", (0, import_node3.toNodeHandler)(auth));
app.use(import_express17.default.json({ limit: "10mb" }));
app.use(sanitizeBody);
app.use(import_express17.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, import_cookie_parser.default)());
app.use((_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const json = JSON.stringify(
      body,
      (_key, value) => typeof value === "bigint" ? Number(value) : value
    );
    res.setHeader("Content-Type", "application/json");
    return res.send(json);
  };
  next();
});
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Evalora API is running." });
});
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ success: true, status: "healthy", database: "connected" });
  } catch {
    res.status(503).json({ success: false, status: "unhealthy", database: "disconnected" });
  }
});
app.use("/api/v1", generalRateLimiter, globalRoutes);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var PORT = config_default.app.port;
var server;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    server = app_default.listen(PORT, () => {
      console.log(`\u{1F680} Evalora server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
var shutdown = async (signal) => {
  console.log(`
${signal} received. Shutting down gracefully...`);
  server?.close(async () => {
    await prisma.$disconnect();
    console.log("Server closed, database disconnected.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 1e4).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown("uncaughtException");
});
main();
//# sourceMappingURL=server.cjs.map