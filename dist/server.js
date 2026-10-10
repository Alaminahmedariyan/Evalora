
		import { createRequire } from "module";
		const require = createRequire(import.meta.url);
		
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express2 from "express";
import helmet from "helmet";

// src/app/config/index.ts
import "dotenv/config";
import { z } from "zod";
var envSchema = z.object({
  // ============================================================
  // Core App
  // ============================================================
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5e3),
  CLIENT_URL: z.string().url(),
  // ============================================================
  // Database
  // ============================================================
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  // ============================================================
  // Authentication - Better Auth
  // ============================================================
  BETTER_AUTH_SECRET: z.string().min(16).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
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
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  // ============================================================
  // Cloudinary
  // ============================================================
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // ============================================================
  // Email - Resend
  // ============================================================
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  // ============================================================
  // Email - SMTP / Nodemailer (Alternative)
  // ============================================================
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  // ============================================================
  // Redis
  // ============================================================
  REDIS_URL: z.string().optional(),
  // ============================================================
  // Stripe
  // ============================================================
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // ============================================================
  // bKash
  // ============================================================
  BKASH_BASE_URL: z.string().optional(),
  BKASH_USERNAME: z.string().optional(),
  BKASH_PASSWORD: z.string().optional(),
  BKASH_APP_KEY: z.string().optional(),
  BKASH_APP_SECRET: z.string().optional(),
  BKASH_CALLBACK_URL: z.string().optional(),
  // ============================================================
  // SSLCommerz
  // ============================================================
  SSLCOMMERZ_STORE_ID: z.string().optional(),
  SSLCOMMERZ_STORE_PASSWORD: z.string().optional(),
  SSLCOMMERZ_IS_LIVE: z.coerce.boolean().default(false),
  // ============================================================
  // Super Admin
  // ============================================================
  SUPER_ADMIN_NAME: z.string().optional(),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8)
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
import { StatusCodes as StatusCodes3 } from "http-status-codes";
import { ZodError } from "zod";
import multer from "multer";

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
import { StatusCodes } from "http-status-codes";

// src/generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// src/generated/prisma/enums.ts
var SubscriptionPlan = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE"
};

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": `generator client {
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

enum BlogPostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ContactMessageStatus {
  NEW
  READ
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

  payments        Payment[]
  notifications   Notification[]
  auditLogs       AuditLog[]
  blogPosts       BlogPost[]       @relation("BlogPostAuthor")
  idempotencyKeys IdempotencyKey[]

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

  createdAt             DateTime @default(now()) @db.Timestamptz(3)
  updatedAt             DateTime @updatedAt @db.Timestamptz(3)
  isVisibleToRecruiters Boolean  @default(true)

  @@index([deletedAt])
  @@index([isVisibleToRecruiters, deletedAt])
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

model IdempotencyKey {
  id          String   @id @default(cuid())
  key         String
  userId      String
  endpoint    String
  requestHash String
  response    Json
  statusCode  Int
  expiresAt   DateTime @db.Timestamptz(3)
  createdAt   DateTime @default(now()) @db.Timestamptz(3)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([key, userId])
  @@index([expiresAt])
  @@index([userId, createdAt])
  @@map("idempotency_keys")
}

model BlogCategory {
  id String @id @default(cuid())

  name        String  @unique
  slug        String  @unique
  description String?

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  posts BlogPost[]

  @@map("blog_categories")
}

model BlogTag {
  id String @id @default(cuid())

  name String @unique
  slug String @unique

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  posts BlogPostTag[]

  @@map("blog_tags")
}

// content is Markdown. A category can't be deleted while posts use it
// (Restrict); an author can't be hard-deleted while they have posts.
model BlogPost {
  id String @id @default(cuid())

  title   String
  slug    String @unique
  excerpt String
  content String

  coverImage String?

  status             BlogPostStatus @default(DRAFT)
  readingTimeMinutes Int            @default(1)
  publishedAt        DateTime?      @db.Timestamptz(3)

  authorId String
  author   User   @relation("BlogPostAuthor", fields: [authorId], references: [id], onDelete: Restrict)

  categoryId String
  category   BlogCategory @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  tags BlogPostTag[]

  deletedAt DateTime? @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@index([status, publishedAt])
  @@index([categoryId, status, publishedAt])
  @@index([authorId, status, publishedAt])
  @@index([deletedAt])
  @@map("blog_posts")
}

model BlogPostTag {
  postId String
  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)

  tagId String
  tag   BlogTag @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([tagId])
  @@map("blog_post_tags")
}

model ContactMessage {
  id String @id @default(cuid())

  name    String
  email   String @db.VarChar(320)
  subject String
  message String

  status ContactMessageStatus @default(NEW)
  readAt DateTime?            @db.Timestamptz(3)

  createdAt DateTime @default(now()) @db.Timestamptz(3)

  @@index([status, createdAt])
  @@index([createdAt])
  @@map("contact_messages")
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"provider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"twoFactors","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"consents","kind":"object","type":"UserConsent","relationName":"UserToUserConsent"},{"name":"candidateProfile","kind":"object","type":"CandidateProfile","relationName":"CandidateProfileToUser"},{"name":"assessmentsCreated","kind":"object","type":"Assessment","relationName":"AssessmentCreator"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"CandidateInvitations"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"CandidateAttempts"},{"name":"problemsCreated","kind":"object","type":"Problem","relationName":"ProblemCreator"},{"name":"evaluations","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionEvaluator"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"blogPosts","kind":"object","type":"BlogPost","relationName":"BlogPostAuthor"},{"name":"idempotencyKeys","kind":"object","type":"IdempotencyKey","relationName":"IdempotencyKeyToUser"}],"dbName":"users","schema":null},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"issuer","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"accounts","schema":null},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"two_factors","schema":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"sessions","schema":null},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verifications","schema":null},"Company":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"industry","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"CompanyToUser"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessments","kind":"object","type":"Assessment","relationName":"AssessmentToCompany"},{"name":"problems","kind":"object","type":"Problem","relationName":"CompanyToProblem"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"CompanyToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"CompanyToPayment"}],"dbName":"companies","schema":null},"CandidateProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CandidateProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"Json"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isVisibleToRecruiters","kind":"scalar","type":"Boolean"}],"dbName":"candidate_profiles","schema":null},"Assessment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"passingMarks","kind":"scalar","type":"Int"},{"name":"maxAttempts","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AssessmentStatus"},{"name":"startAt","kind":"scalar","type":"DateTime"},{"name":"endAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"shuffleQuestions","kind":"scalar","type":"Boolean"},{"name":"showResultImmediately","kind":"scalar","type":"Boolean"},{"name":"allowReview","kind":"scalar","type":"Boolean"},{"name":"version","kind":"scalar","type":"Int"},{"name":"isLatestVersion","kind":"scalar","type":"Boolean"},{"name":"parentAssessmentId","kind":"scalar","type":"String"},{"name":"parentAssessment","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"childVersions","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"AssessmentToCompany"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"AssessmentCreator"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentToAssessmentProblem"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentToAssessmentInvitation"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentToAssessmentAttempt"},{"name":"results","kind":"object","type":"Result","relationName":"AssessmentToResult"}],"dbName":"assessments","schema":null},"Problem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ProblemType"},{"name":"difficulty","kind":"enum","type":"Difficulty"},{"name":"defaultMarks","kind":"scalar","type":"Int"},{"name":"timeLimitSeconds","kind":"scalar","type":"Int"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToProblem"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"ProblemCreator"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqProblemToProblem"},{"name":"testCases","kind":"object","type":"TestCase","relationName":"ProblemToTestCase"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentProblemToProblem"},{"name":"submissions","kind":"object","type":"Submission","relationName":"ProblemToSubmission"}],"dbName":"problems","schema":null},"McqProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"McqProblemToProblem"},{"name":"type","kind":"enum","type":"McqType"},{"name":"explanation","kind":"scalar","type":"String"},{"name":"options","kind":"object","type":"McqOption","relationName":"McqOptionToMcqProblem"}],"dbName":"mcq_problems","schema":null},"McqOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mcqProblemId","kind":"scalar","type":"String"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqOptionToMcqProblem"},{"name":"optionText","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"submissionAnswers","kind":"object","type":"SubmissionAnswer","relationName":"McqOptionToSubmissionAnswer"}],"dbName":"mcq_options","schema":null},"TestCase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToTestCase"},{"name":"input","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"isSample","kind":"scalar","type":"Boolean"},{"name":"points","kind":"scalar","type":"Int"},{"name":"timeLimitMs","kind":"scalar","type":"Int"},{"name":"memoryLimitMb","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"results","kind":"object","type":"TestCaseResult","relationName":"TestCaseToTestCaseResult"}],"dbName":"test_cases","schema":null},"AssessmentProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentProblem"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"AssessmentProblemToProblem"},{"name":"order","kind":"scalar","type":"Int"},{"name":"marks","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"assessment_problems","schema":null},"AssessmentInvitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentInvitation"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateInvitations"},{"name":"email","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"tokenHash","kind":"scalar","type":"String"},{"name":"invitedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToAssessmentInvitation"}],"dbName":"assessment_invitations","schema":null},"AssessmentAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentAttempt"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateAttempts"},{"name":"invitationId","kind":"scalar","type":"String"},{"name":"invitation","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentAttemptToAssessmentInvitation"},{"name":"attemptNumber","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AttemptStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"autoSubmittedAt","kind":"scalar","type":"DateTime"},{"name":"tabSwitchCount","kind":"scalar","type":"Int"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"submissions","kind":"object","type":"Submission","relationName":"AssessmentAttemptToSubmission"},{"name":"result","kind":"object","type":"Result","relationName":"AssessmentAttemptToResult"},{"name":"proctoringEvents","kind":"object","type":"ProctoringEvent","relationName":"AssessmentAttemptToProctoringEvent"}],"dbName":"assessment_attempts","schema":null},"Submission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToSubmission"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToSubmission"},{"name":"answerText","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SubmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"answers","kind":"object","type":"SubmissionAnswer","relationName":"SubmissionToSubmissionAnswer"},{"name":"evaluation","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionToSubmissionEvaluation"},{"name":"testCaseResults","kind":"object","type":"TestCaseResult","relationName":"SubmissionToTestCaseResult"}],"dbName":"submissions","schema":null},"SubmissionAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionAnswer"},{"name":"optionId","kind":"scalar","type":"String"},{"name":"option","kind":"object","type":"McqOption","relationName":"McqOptionToSubmissionAnswer"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_answers","schema":null},"SubmissionEvaluation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionEvaluation"},{"name":"evaluatorId","kind":"scalar","type":"String"},{"name":"evaluator","kind":"object","type":"User","relationName":"SubmissionEvaluator"},{"name":"score","kind":"scalar","type":"Int"},{"name":"maxScore","kind":"scalar","type":"Int"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"EvaluationStatus"},{"name":"isAutoEvaluated","kind":"scalar","type":"Boolean"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_evaluations","schema":null},"TestCaseResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToTestCaseResult"},{"name":"testCaseId","kind":"scalar","type":"String"},{"name":"testCase","kind":"object","type":"TestCase","relationName":"TestCaseToTestCaseResult"},{"name":"passed","kind":"scalar","type":"Boolean"},{"name":"actualOutput","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"executionTimeMs","kind":"scalar","type":"Int"},{"name":"memoryUsedMb","kind":"scalar","type":"Int"},{"name":"points","kind":"scalar","type":"Int"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"test_case_results","schema":null},"Result":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToResult"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToResult"},{"name":"totalScore","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"ResultStatus"},{"name":"rank","kind":"scalar","type":"Int"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"results","schema":null},"ProctoringEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToProctoringEvent"},{"name":"eventType","kind":"enum","type":"ProctoringEventType"},{"name":"timestamp","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"}],"dbName":"proctoring_events","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToSubscription"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToPayment"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amountMinor","kind":"scalar","type":"BigInt"},{"name":"currency","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"providerPaymentId","kind":"scalar","type":"String"},{"name":"idempotencyKey","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments","schema":null},"PaymentWebhookEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"processed","kind":"scalar","type":"Boolean"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"retryCount","kind":"scalar","type":"Int"},{"name":"maxRetries","kind":"scalar","type":"Int"},{"name":"lastRetryAt","kind":"scalar","type":"DateTime"},{"name":"nextRetryAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment_webhook_events","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications","schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"enum","type":"AuditAction"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs","schema":null},"UserConsent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserConsent"},{"name":"consentType","kind":"enum","type":"ConsentType"},{"name":"granted","kind":"scalar","type":"Boolean"},{"name":"grantedAt","kind":"scalar","type":"DateTime"},{"name":"revokedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_consents","schema":null},"IdempotencyKey":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"endpoint","kind":"scalar","type":"String"},{"name":"requestHash","kind":"scalar","type":"String"},{"name":"response","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"IdempotencyKeyToUser"}],"dbName":"idempotency_keys","schema":null},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"posts","kind":"object","type":"BlogPost","relationName":"BlogCategoryToBlogPost"}],"dbName":"blog_categories","schema":null},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_tags","schema":null},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BlogPostStatus"},{"name":"readingTimeMinutes","kind":"scalar","type":"Int"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"BlogPostAuthor"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPost"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts","schema":null},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags","schema":null},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ContactMessageStatus"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"contact_messages","schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","owner","orderBy","cursor","parentAssessment","childVersions","company","createdBy","assessment","problem","mcqProblem","candidate","attempts","_count","invitation","submissions","attempt","result","proctoringEvents","answers","submission","evaluator","evaluation","results","testCase","testCaseResults","option","submissionAnswers","options","testCases","assessmentProblems","invitations","assessments","problems","user","subscription","payments","accounts","sessions","twoFactors","consents","candidateProfile","assessmentsCreated","problemsCreated","evaluations","notifications","auditLogs","author","posts","category","post","tag","tags","blogPosts","idempotencyKeys","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Company.findUnique","Company.findUniqueOrThrow","Company.findFirst","Company.findFirstOrThrow","Company.findMany","Company.createOne","Company.createMany","Company.createManyAndReturn","Company.updateOne","Company.updateMany","Company.updateManyAndReturn","Company.upsertOne","Company.deleteOne","Company.deleteMany","Company.groupBy","Company.aggregate","CandidateProfile.findUnique","CandidateProfile.findUniqueOrThrow","CandidateProfile.findFirst","CandidateProfile.findFirstOrThrow","CandidateProfile.findMany","CandidateProfile.createOne","CandidateProfile.createMany","CandidateProfile.createManyAndReturn","CandidateProfile.updateOne","CandidateProfile.updateMany","CandidateProfile.updateManyAndReturn","CandidateProfile.upsertOne","CandidateProfile.deleteOne","CandidateProfile.deleteMany","_avg","_sum","CandidateProfile.groupBy","CandidateProfile.aggregate","Assessment.findUnique","Assessment.findUniqueOrThrow","Assessment.findFirst","Assessment.findFirstOrThrow","Assessment.findMany","Assessment.createOne","Assessment.createMany","Assessment.createManyAndReturn","Assessment.updateOne","Assessment.updateMany","Assessment.updateManyAndReturn","Assessment.upsertOne","Assessment.deleteOne","Assessment.deleteMany","Assessment.groupBy","Assessment.aggregate","Problem.findUnique","Problem.findUniqueOrThrow","Problem.findFirst","Problem.findFirstOrThrow","Problem.findMany","Problem.createOne","Problem.createMany","Problem.createManyAndReturn","Problem.updateOne","Problem.updateMany","Problem.updateManyAndReturn","Problem.upsertOne","Problem.deleteOne","Problem.deleteMany","Problem.groupBy","Problem.aggregate","McqProblem.findUnique","McqProblem.findUniqueOrThrow","McqProblem.findFirst","McqProblem.findFirstOrThrow","McqProblem.findMany","McqProblem.createOne","McqProblem.createMany","McqProblem.createManyAndReturn","McqProblem.updateOne","McqProblem.updateMany","McqProblem.updateManyAndReturn","McqProblem.upsertOne","McqProblem.deleteOne","McqProblem.deleteMany","McqProblem.groupBy","McqProblem.aggregate","McqOption.findUnique","McqOption.findUniqueOrThrow","McqOption.findFirst","McqOption.findFirstOrThrow","McqOption.findMany","McqOption.createOne","McqOption.createMany","McqOption.createManyAndReturn","McqOption.updateOne","McqOption.updateMany","McqOption.updateManyAndReturn","McqOption.upsertOne","McqOption.deleteOne","McqOption.deleteMany","McqOption.groupBy","McqOption.aggregate","TestCase.findUnique","TestCase.findUniqueOrThrow","TestCase.findFirst","TestCase.findFirstOrThrow","TestCase.findMany","TestCase.createOne","TestCase.createMany","TestCase.createManyAndReturn","TestCase.updateOne","TestCase.updateMany","TestCase.updateManyAndReturn","TestCase.upsertOne","TestCase.deleteOne","TestCase.deleteMany","TestCase.groupBy","TestCase.aggregate","AssessmentProblem.findUnique","AssessmentProblem.findUniqueOrThrow","AssessmentProblem.findFirst","AssessmentProblem.findFirstOrThrow","AssessmentProblem.findMany","AssessmentProblem.createOne","AssessmentProblem.createMany","AssessmentProblem.createManyAndReturn","AssessmentProblem.updateOne","AssessmentProblem.updateMany","AssessmentProblem.updateManyAndReturn","AssessmentProblem.upsertOne","AssessmentProblem.deleteOne","AssessmentProblem.deleteMany","AssessmentProblem.groupBy","AssessmentProblem.aggregate","AssessmentInvitation.findUnique","AssessmentInvitation.findUniqueOrThrow","AssessmentInvitation.findFirst","AssessmentInvitation.findFirstOrThrow","AssessmentInvitation.findMany","AssessmentInvitation.createOne","AssessmentInvitation.createMany","AssessmentInvitation.createManyAndReturn","AssessmentInvitation.updateOne","AssessmentInvitation.updateMany","AssessmentInvitation.updateManyAndReturn","AssessmentInvitation.upsertOne","AssessmentInvitation.deleteOne","AssessmentInvitation.deleteMany","AssessmentInvitation.groupBy","AssessmentInvitation.aggregate","AssessmentAttempt.findUnique","AssessmentAttempt.findUniqueOrThrow","AssessmentAttempt.findFirst","AssessmentAttempt.findFirstOrThrow","AssessmentAttempt.findMany","AssessmentAttempt.createOne","AssessmentAttempt.createMany","AssessmentAttempt.createManyAndReturn","AssessmentAttempt.updateOne","AssessmentAttempt.updateMany","AssessmentAttempt.updateManyAndReturn","AssessmentAttempt.upsertOne","AssessmentAttempt.deleteOne","AssessmentAttempt.deleteMany","AssessmentAttempt.groupBy","AssessmentAttempt.aggregate","Submission.findUnique","Submission.findUniqueOrThrow","Submission.findFirst","Submission.findFirstOrThrow","Submission.findMany","Submission.createOne","Submission.createMany","Submission.createManyAndReturn","Submission.updateOne","Submission.updateMany","Submission.updateManyAndReturn","Submission.upsertOne","Submission.deleteOne","Submission.deleteMany","Submission.groupBy","Submission.aggregate","SubmissionAnswer.findUnique","SubmissionAnswer.findUniqueOrThrow","SubmissionAnswer.findFirst","SubmissionAnswer.findFirstOrThrow","SubmissionAnswer.findMany","SubmissionAnswer.createOne","SubmissionAnswer.createMany","SubmissionAnswer.createManyAndReturn","SubmissionAnswer.updateOne","SubmissionAnswer.updateMany","SubmissionAnswer.updateManyAndReturn","SubmissionAnswer.upsertOne","SubmissionAnswer.deleteOne","SubmissionAnswer.deleteMany","SubmissionAnswer.groupBy","SubmissionAnswer.aggregate","SubmissionEvaluation.findUnique","SubmissionEvaluation.findUniqueOrThrow","SubmissionEvaluation.findFirst","SubmissionEvaluation.findFirstOrThrow","SubmissionEvaluation.findMany","SubmissionEvaluation.createOne","SubmissionEvaluation.createMany","SubmissionEvaluation.createManyAndReturn","SubmissionEvaluation.updateOne","SubmissionEvaluation.updateMany","SubmissionEvaluation.updateManyAndReturn","SubmissionEvaluation.upsertOne","SubmissionEvaluation.deleteOne","SubmissionEvaluation.deleteMany","SubmissionEvaluation.groupBy","SubmissionEvaluation.aggregate","TestCaseResult.findUnique","TestCaseResult.findUniqueOrThrow","TestCaseResult.findFirst","TestCaseResult.findFirstOrThrow","TestCaseResult.findMany","TestCaseResult.createOne","TestCaseResult.createMany","TestCaseResult.createManyAndReturn","TestCaseResult.updateOne","TestCaseResult.updateMany","TestCaseResult.updateManyAndReturn","TestCaseResult.upsertOne","TestCaseResult.deleteOne","TestCaseResult.deleteMany","TestCaseResult.groupBy","TestCaseResult.aggregate","Result.findUnique","Result.findUniqueOrThrow","Result.findFirst","Result.findFirstOrThrow","Result.findMany","Result.createOne","Result.createMany","Result.createManyAndReturn","Result.updateOne","Result.updateMany","Result.updateManyAndReturn","Result.upsertOne","Result.deleteOne","Result.deleteMany","Result.groupBy","Result.aggregate","ProctoringEvent.findUnique","ProctoringEvent.findUniqueOrThrow","ProctoringEvent.findFirst","ProctoringEvent.findFirstOrThrow","ProctoringEvent.findMany","ProctoringEvent.createOne","ProctoringEvent.createMany","ProctoringEvent.createManyAndReturn","ProctoringEvent.updateOne","ProctoringEvent.updateMany","ProctoringEvent.updateManyAndReturn","ProctoringEvent.upsertOne","ProctoringEvent.deleteOne","ProctoringEvent.deleteMany","ProctoringEvent.groupBy","ProctoringEvent.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentWebhookEvent.findUnique","PaymentWebhookEvent.findUniqueOrThrow","PaymentWebhookEvent.findFirst","PaymentWebhookEvent.findFirstOrThrow","PaymentWebhookEvent.findMany","PaymentWebhookEvent.createOne","PaymentWebhookEvent.createMany","PaymentWebhookEvent.createManyAndReturn","PaymentWebhookEvent.updateOne","PaymentWebhookEvent.updateMany","PaymentWebhookEvent.updateManyAndReturn","PaymentWebhookEvent.upsertOne","PaymentWebhookEvent.deleteOne","PaymentWebhookEvent.deleteMany","PaymentWebhookEvent.groupBy","PaymentWebhookEvent.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","UserConsent.findUnique","UserConsent.findUniqueOrThrow","UserConsent.findFirst","UserConsent.findFirstOrThrow","UserConsent.findMany","UserConsent.createOne","UserConsent.createMany","UserConsent.createManyAndReturn","UserConsent.updateOne","UserConsent.updateMany","UserConsent.updateManyAndReturn","UserConsent.upsertOne","UserConsent.deleteOne","UserConsent.deleteMany","UserConsent.groupBy","UserConsent.aggregate","IdempotencyKey.findUnique","IdempotencyKey.findUniqueOrThrow","IdempotencyKey.findFirst","IdempotencyKey.findFirstOrThrow","IdempotencyKey.findMany","IdempotencyKey.createOne","IdempotencyKey.createMany","IdempotencyKey.createManyAndReturn","IdempotencyKey.updateOne","IdempotencyKey.updateMany","IdempotencyKey.updateManyAndReturn","IdempotencyKey.upsertOne","IdempotencyKey.deleteOne","IdempotencyKey.deleteMany","IdempotencyKey.groupBy","IdempotencyKey.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","AND","OR","NOT","id","name","email","subject","message","ContactMessageStatus","status","readAt","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","postId","tagId","title","slug","excerpt","content","coverImage","BlogPostStatus","readingTimeMinutes","publishedAt","authorId","categoryId","deletedAt","updatedAt","every","some","none","description","key","userId","endpoint","requestHash","response","statusCode","expiresAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","ConsentType","consentType","granted","grantedAt","revokedAt","AuditAction","action","entity","entityId","oldValue","newValue","metadata","ipAddress","userAgent","NotificationType","type","isRead","PaymentProvider","provider","eventId","eventType","payload","processed","processedAt","retryCount","maxRetries","lastRetryAt","nextRetryAt","provider_eventId","companyId","subscriptionId","PaymentStatus","amountMinor","currency","transactionId","providerPaymentId","idempotencyKey","paidAt","failedAt","SubscriptionPlan","plan","SubscriptionStatus","stripeCustomerId","stripeSubscriptionId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","cancelledAt","attemptId","ProctoringEventType","timestamp","assessmentId","totalScore","totalMarks","percentage","ResultStatus","rank","evaluatedAt","submissionId","testCaseId","passed","actualOutput","expectedOutput","executionTimeMs","memoryUsedMb","points","errorMessage","evaluatorId","score","maxScore","feedback","EvaluationStatus","isAutoEvaluated","optionId","problemId","answerText","code","language","SubmissionStatus","submittedAt","candidateId","invitationId","attemptNumber","AttemptStatus","startedAt","autoSubmittedAt","tabSwitchCount","InvitationStatus","tokenHash","invitedAt","acceptedAt","completedAt","order","marks","input","isSample","timeLimitMs","memoryLimitMb","mcqProblemId","optionText","isCorrect","McqType","explanation","ProblemType","Difficulty","difficulty","defaultMarks","timeLimitSeconds","createdById","isPublic","instructions","durationMinutes","passingMarks","maxAttempts","AssessmentStatus","startAt","endAt","shuffleQuestions","showResultImmediately","allowReview","version","isLatestVersion","parentAssessmentId","headline","bio","phone","location","resumeUrl","linkedinUrl","githubUrl","portfolioUrl","skills","experienceYears","isVisibleToRecruiters","website","industry","logo","isVerified","ownerId","identifier","value","identifier_value","token","secret","backupCodes","accountId","providerId","issuer","password","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","image","UserRole","role","UserStatus","AuthProvider","emailVerified","twoFactorEnabled","lastLoginAt","key_userId","postId_tagId","userId_consentType","issuer_accountId","companyId_slug","assessmentId_email","submissionId_testCaseId","attemptId_problemId","assessmentId_candidateId_attemptNumber","submissionId_optionId","mcqProblemId_order","assessmentId_problemId","assessmentId_order","companyId_slug_version","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "vhGzApAEIQYAAOAIACAMAADxCAAgHwAAjQkAICQAAPUHACAlAACICQAgJgAAiQkAICcAAIoJACAoAACLCQAgKQAAjAkAICoAALIIACArAACzCAAgLAAAjgkAIC0AAI8JACAuAACQCQAgNQAAxAcAIDYAAJEJACDPBAAAhAkAMNAEAAAbABDRBAAAhAkAMNIEAQAAAAHTBAEArwcAIdQEAQAAAAHYBAAAhgmkBiLaBEAAsgcAIfIEQACxBwAh8wRAALIHACGXBQAAhwmlBiKCBgEAwwcAIaAGAQDDBwAhogYAAIUJogYipQYgAOAHACGmBiAA4AcAIacGQACxBwAhAQAAAAEAIBQBAACvCAAgIAAAsggAICEAALMIACAjAAC0CAAgJAAA9QcAIM8EAACxCAAw0AQAAAMAENEEAACxCAAw0gQBAK8HACHTBAEArwcAIdoEQACyBwAh6QQBAK8HACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGLBgEAwwcAIYwGAQDDBwAhjQYBAMMHACGOBiAA4AcAIY8GAQCvBwAhAQAAAAMAICMEAACeCQAgBQAAsggAIAYAAPQHACAHAACvCAAgDAAA8QgAIBcAAJ8JACAeAADnCAAgHwAAjQkAIM8EAACcCQAw0AQAAAUAENEEAACcCQAw0gQBAK8HACHYBAAAnQn4BSLaBEAAsgcAIegEAQCvBwAh6QQBAK8HACHvBEAAsQcAIfIEQACxBwAh8wRAALIHACH3BAEAwwcAIaIFAQCvBwAhugUCAOEHACHxBQEArwcAIfMFAQDDBwAh9AUCAOEHACH1BQIA4QcAIfYFAgDhBwAh-AVAALEHACH5BUAAsQcAIfoFIADgBwAh-wUgAOAHACH8BSAA4AcAIf0FAgDhBwAh_gUgAOAHACH_BQEAwwcAIQ8EAAC5DwAgBQAAyg0AIAYAAKwKACAHAACZDQAgDAAAqw8AIBcAAMIPACAeAAC2DwAgHwAAqg8AIO8EAACgCQAg8gQAAKAJACD3BAAAoAkAIPMFAACgCQAg-AUAAKAJACD5BQAAoAkAIP8FAACgCQAgJAQAAJ4JACAFAACyCAAgBgAA9AcAIAcAAK8IACAMAADxCAAgFwAAnwkAIB4AAOcIACAfAACNCQAgzwQAAJwJADDQBAAABQAQ0QQAAJwJADDSBAEAAAAB2AQAAJ0J-AUi2gRAALIHACHoBAEArwcAIekEAQCvBwAh7wRAALEHACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGiBQEArwcAIboFAgDhBwAh8QUBAK8HACHzBQEAwwcAIfQFAgDhBwAh9QUCAOEHACH2BQIA4QcAIfgFQACxBwAh-QVAALEHACH6BSAA4AcAIfsFIADgBwAh_AUgAOAHACH9BQIA4QcAIf4FIADgBwAh_wUBAMMHACG1BgAAmwkAIAMAAAAFACACAAAGADADAAAHACABAAAABQAgAwAAAAUAIAIAAAYAMAMAAAcAIAsIAADtCAAgCQAAnggAIM8EAACaCQAw0AQAAAsAENEEAACaCQAw0gQBAK8HACHaBEAAsgcAIbgFAQCvBwAhzwUBAK8HACHhBQIA4QcAIeIFAgDhBwAhAggAALkPACAJAACLDAAgDQgAAO0IACAJAACeCAAgzwQAAJoJADDQBAAACwAQ0QQAAJoJADDSBAEAAAAB2gRAALIHACG4BQEArwcAIc8FAQCvBwAh4QUCAOEHACHiBQIA4QcAIbMGAACYCQAgtAYAAJkJACADAAAACwAgAgAADAAwAwAADQAgCQkAAJ4IACAcAACfCAAgzwQAAJwIADDQBAAADwAQ0QQAAJwIADDSBAEArwcAIZQFAACdCOsFIs8FAQCvBwAh6wUBAMMHACEBAAAADwAgCgoAAJcJACAbAAD8CAAgzwQAAJYJADDQBAAAEQAQ0QQAAJYJADDSBAEArwcAIeEFAgDhBwAh5wUBAK8HACHoBQEArwcAIekFIADgBwAhAgoAALQPACAbAAC8DwAgCwoAAJcJACAbAAD8CAAgzwQAAJYJADDQBAAAEQAQ0QQAAJYJADDSBAEAAAAB4QUCAOEHACHnBQEArwcAIegFAQCvBwAh6QUgAOAHACGyBgAAlQkAIAMAAAARACACAAASADADAAATACAJFAAA1QgAIBoAAJQJACDPBAAAkwkAMNAEAAAVABDRBAAAkwkAMNIEAQCvBwAh2gRAALIHACG_BQEArwcAIc4FAQCvBwAhAhQAALMPACAaAADBDwAgChQAANUIACAaAACUCQAgzwQAAJMJADDQBAAAFQAQ0QQAAJMJADDSBAEAAAAB2gRAALIHACG_BQEArwcAIc4FAQCvBwAhsQYAAJIJACADAAAAFQAgAgAAFgAwAwAAFwAgEAgAAO0IACALAADQCAAgDAAA8QgAIM8EAADvCAAw0AQAABkAENEEAADvCAAw0gQBAK8HACHUBAEArwcAIdgEAADwCN0FIv4EQACxBwAhuAUBAK8HACHVBQEAwwcAId0FAQCvBwAh3gVAALIHACHfBUAAsQcAIeAFQACxBwAhAQAAABkAICEGAADgCAAgDAAA8QgAIB8AAI0JACAkAAD1BwAgJQAAiAkAICYAAIkJACAnAACKCQAgKAAAiwkAICkAAIwJACAqAACyCAAgKwAAswgAICwAAI4JACAtAACPCQAgLgAAkAkAIDUAAMQHACA2AACRCQAgzwQAAIQJADDQBAAAGwAQ0QQAAIQJADDSBAEArwcAIdMEAQCvBwAh1AQBAK8HACHYBAAAhgmkBiLaBEAAsgcAIfIEQACxBwAh8wRAALIHACGXBQAAhwmlBiKCBgEAwwcAIaAGAQDDBwAhogYAAIUJogYipQYgAOAHACGmBiAA4AcAIacGQACxBwAhAQAAABsAIBgIAADtCAAgCwAArwgAIA4AAIEJACAPAADoCAAgEQAAggkAIBIAAIMJACDPBAAA_wgAMNAEAAAdABDRBAAA_wgAMNIEAQCvBwAh2AQAAIAJ2QUi2gRAALIHACHzBEAAsgcAIf4EQACyBwAhkQUBAMMHACGSBQEAwwcAIbgFAQCvBwAh1AVAALEHACHVBQEArwcAIdYFAQDDBwAh1wUCAOEHACHZBUAAsQcAIdoFQACxBwAh2wUCAOEHACEMCAAAuQ8AIAsAAJkNACAOAAC-DwAgDwAAtw8AIBEAAL8PACASAADADwAgkQUAAKAJACCSBQAAoAkAINQFAACgCQAg1gUAAKAJACDZBQAAoAkAINoFAACgCQAgGQgAAO0IACALAACvCAAgDgAAgQkAIA8AAOgIACARAACCCQAgEgAAgwkAIM8EAAD_CAAw0AQAAB0AENEEAAD_CAAw0gQBAAAAAdgEAACACdkFItoEQACyBwAh8wRAALIHACH-BEAAsgcAIZEFAQDDBwAhkgUBAMMHACG4BQEArwcAIdQFQACxBwAh1QUBAK8HACHWBQEAwwcAIdcFAgDhBwAh2QVAALEHACHaBUAAsQcAIdsFAgDhBwAhsAYAAP4IACADAAAAHQAgAgAAHgAwAwAAHwAgAQAAAB0AIBIJAACeCAAgEAAA7AgAIBMAAPwIACAWAAD9CAAgGQAA8wgAIM8EAAD6CAAw0AQAACIAENEEAAD6CAAw0gQBAK8HACHYBAAA-wjUBSLaBEAAsgcAIfMEQACyBwAhtQUBAK8HACHPBQEArwcAIdAFAQDDBwAh0QUBAMMHACHSBQEAwwcAIdQFQACxBwAhCQkAAIsMACAQAAC4DwAgEwAAvA8AIBYAAL0PACAZAAC6DwAg0AUAAKAJACDRBQAAoAkAINIFAACgCQAg1AUAAKAJACATCQAAnggAIBAAAOwIACATAAD8CAAgFgAA_QgAIBkAAPMIACDPBAAA-ggAMNAEAAAiABDRBAAA-ggAMNIEAQAAAAHYBAAA-wjUBSLaBEAAsgcAIfMEQACyBwAhtQUBAK8HACHPBQEArwcAIdAFAQDDBwAh0QUBAMMHACHSBQEAwwcAIdQFQACxBwAhrwYAAPkIACADAAAAIgAgAgAAIwAwAwAAJAAgEAgAAO0IACAQAADsCAAgzwQAAOkIADDQBAAAJgAQ0QQAAOkIADDSBAEArwcAIdgEAADrCL0FItoEQACyBwAh8wRAALIHACG1BQEArwcAIbgFAQCvBwAhuQUCAOEHACG6BQIA4QcAIbsFCADqCAAhvQUCAK4IACG-BUAAsQcAIQEAAAAmACAJEAAA7AgAIM8EAAD3CAAw0AQAACgAENEEAAD3CAAw0gQBAK8HACGQBQAArQgAIJkFAAD4CLcFIrUFAQCvBwAhtwVAALIHACECEAAAuA8AIJAFAACgCQAgCRAAAOwIACDPBAAA9wgAMNAEAAAoABDRBAAA9wgAMNIEAQAAAAGQBQAArQgAIJkFAAD4CLcFIrUFAQCvBwAhtwVAALIHACEDAAAAKAAgAgAAKQAwAwAAKgAgAQAAACIAIAEAAAAoACADAAAAFQAgAgAAFgAwAwAAFwAgERQAANUIACAVAADQCAAgzwQAANMIADDQBAAALwAQ0QQAANMIADDSBAEArwcAIdgEAADUCM0FItoEQACyBwAh8wRAALIHACGQBQAArQgAIL4FQACxBwAhvwUBAK8HACHIBQEAwwcAIckFAgDhBwAhygUCAOEHACHLBQEAwwcAIc0FIADgBwAhAQAAAC8AIAEAAAAbACAQFAAA1QgAIBgAAPYIACDPBAAA9QgAMNAEAAAyABDRBAAA9QgAMNIEAQCvBwAh2gRAALIHACG_BQEArwcAIcAFAQCvBwAhwQUgAOAHACHCBQEAwwcAIcMFAQDDBwAhxAUCAK4IACHFBQIArggAIcYFAgDhBwAhxwUBAMMHACEHFAAAsw8AIBgAALsPACDCBQAAoAkAIMMFAACgCQAgxAUAAKAJACDFBQAAoAkAIMcFAACgCQAgERQAANUIACAYAAD2CAAgzwQAAPUIADDQBAAAMgAQ0QQAAPUIADDSBAEAAAAB2gRAALIHACG_BQEArwcAIcAFAQCvBwAhwQUgAOAHACHCBQEAwwcAIcMFAQDDBwAhxAUCAK4IACHFBQIArggAIcYFAgDhBwAhxwUBAMMHACGuBgAA9AgAIAMAAAAyACACAAAzADADAAA0ACADAAAAMgAgAgAAMwAwAwAANAAgAQAAADIAIAEAAAAVACABAAAAMgAgAQAAABUAIAEAAAARACAOCQAAnggAIBcAAPMIACDPBAAA8ggAMNAEAAA8ABDRBAAA8ggAMNIEAQCvBwAh2gRAALIHACHDBQEArwcAIcYFAgDhBwAhzwUBAK8HACHjBQEAwwcAIeQFIADgBwAh5QUCAK4IACHmBQIArggAIQUJAACLDAAgFwAAug8AIOMFAACgCQAg5QUAAKAJACDmBQAAoAkAIA4JAACeCAAgFwAA8wgAIM8EAADyCAAw0AQAADwAENEEAADyCAAw0gQBAAAAAdoEQACyBwAhwwUBAK8HACHGBQIA4QcAIc8FAQCvBwAh4wUBAMMHACHkBSAA4AcAIeUFAgCuCAAh5gUCAK4IACEDAAAAPAAgAgAAPQAwAwAAPgAgAwAAAAsAIAIAAAwAMAMAAA0AIAMAAAAiACACAAAjADADAAAkACABAAAAPAAgAQAAAAsAIAEAAAAiACAHCAAAuQ8AIAsAAJkNACAMAACrDwAg_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-QQBAK8HACH-BEAAsgcAIZEFAQDDBwAhkgUBAMMHACGTBgEAAAABAwAAAGYAIAIAAGcAMAMAAGgAIAgiAACvCAAgzwQAANkIADDQBAAAagAQ0QQAANkIADDSBAEArwcAIfkEAQCvBwAhlAYBAK8HACGVBgEAwwcAIQIiAACZDQAglQYAAKAJACAIIgAArwgAIM8EAADZCAAw0AQAAGoAENEEAADZCAAw0gQBAAAAAfkEAQAAAAGUBgEArwcAIZUGAQDDBwAhAwAAAGoAIAIAAGsAMAMAAGwAIAoiAACvCAAgzwQAANcIADDQBAAAbgAQ0QQAANcIADDSBAEArwcAIfkEAQCvBwAhhgUAANgIhgUihwUgAOAHACGIBUAAsgcAIYkFQACxBwAhAiIAAJkNACCJBQAAoAkAIAsiAACvCAAgzwQAANcIADDQBAAAbgAQ0QQAANcIADDSBAEAAAAB-QQBAK8HACGGBQAA2AiGBSKHBSAA4AcAIYgFQACyBwAhiQVAALEHACGqBgAA1ggAIAMAAABuACACAABvADADAABwACAUIgAArwgAIM8EAACsCAAw0AQAAHIAENEEAACsCAAw0gQBAK8HACHaBEAAsgcAIfIEQACxBwAh8wRAALIHACH5BAEArwcAIYAGAQDDBwAhgQYBAMMHACGCBgEAwwcAIYMGAQDDBwAhhAYBAMMHACGFBgEAwwcAIYYGAQDDBwAhhwYBAMMHACGIBgAArQgAIIkGAgCuCAAhigYgAOAHACEBAAAAcgAgAwAAAAUAIAIAAAYAMAMAAAcAIAMAAAAZACACAABFADADAABGACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAFEAIAIAAFIAMAMAAFMAIAYUAACzDwAgFQAAmQ0AIJAFAACgCQAgvgUAAKAJACDIBQAAoAkAIMsFAACgCQAgERQAANUIACAVAADQCAAgzwQAANMIADDQBAAALwAQ0QQAANMIADDSBAEAAAAB2AQAANQIzQUi2gRAALIHACHzBEAAsgcAIZAFAACtCAAgvgVAALEHACG_BQEAAAAByAUBAMMHACHJBQIA4QcAIcoFAgDhBwAhywUBAMMHACHNBSAA4AcAIQMAAAAvACACAAB4ADADAAB5ACADAAAAVwAgAgAAWAAwAwAAWQAgDSIAAK8IACDPBAAA0QgAMNAEAAB8ABDRBAAA0QgAMNIEAQCvBwAh1gQBAK8HACHaBEAAsgcAIegEAQCvBwAh8wRAALIHACH5BAEArwcAIZAFAACtCAAglAUAANIIlAUilQUgAOAHACECIgAAmQ0AIJAFAACgCQAgDSIAAK8IACDPBAAA0QgAMNAEAAB8ABDRBAAA0QgAMNIEAQAAAAHWBAEArwcAIdoEQACyBwAh6AQBAK8HACHzBEAAsgcAIfkEAQCvBwAhkAUAAK0IACCUBQAA0giUBSKVBSAA4AcAIQMAAAB8ACACAAB9ADADAAB-ACAPIgAA0AgAIM8EAADOCAAw0AQAAIABABDRBAAAzggAMNIEAQCvBwAh2gRAALIHACH5BAEAwwcAIYsFAADPCIsFIowFAQCvBwAhjQUBAMMHACGOBQAArQgAII8FAACtCAAgkAUAAK0IACCRBQEAwwcAIZIFAQDDBwAhCCIAAJkNACD5BAAAoAkAII0FAACgCQAgjgUAAKAJACCPBQAAoAkAIJAFAACgCQAgkQUAAKAJACCSBQAAoAkAIA8iAADQCAAgzwQAAM4IADDQBAAAgAEAENEEAADOCAAw0gQBAAAAAdoEQACyBwAh-QQBAMMHACGLBQAAzwiLBSKMBQEArwcAIY0FAQDDBwAhjgUAAK0IACCPBQAArQgAIJAFAACtCAAgkQUBAMMHACGSBQEAwwcAIQMAAACAAQAgAgAAgQEAMAMAAIIBACABAAAAGwAgFC8AAK8IACAxAADNCAAgNAAAwAcAIM8EAADLCAAw0AQAAIUBABDRBAAAywgAMNIEAQCvBwAh2AQAAMwI7gQi2gRAALIHACHoBAEArwcAIekEAQCvBwAh6gQBAK8HACHrBAEArwcAIewEAQDDBwAh7gQCAOEHACHvBEAAsQcAIfAEAQCvBwAh8QQBAK8HACHyBEAAsQcAIfMEQACyBwAhBi8AAJkNACAxAACyDwAgNAAA1wkAIOwEAACgCQAg7wQAAKAJACDyBAAAoAkAIBQvAACvCAAgMQAAzQgAIDQAAMAHACDPBAAAywgAMNAEAACFAQAQ0QQAAMsIADDSBAEAAAAB2AQAAMwI7gQi2gRAALIHACHoBAEArwcAIekEAQAAAAHqBAEArwcAIesEAQCvBwAh7AQBAMMHACHuBAIA4QcAIe8EQACxBwAh8AQBAK8HACHxBAEArwcAIfIEQACxBwAh8wRAALIHACEDAAAAhQEAIAIAAIYBADADAACHAQAgAwAAAIUBACACAACGAQAwAwAAhwEAIAEAAACFAQAgBzIAAMkIACAzAADKCAAgzwQAAMgIADDQBAAAiwEAENEEAADICAAw5gQBAK8HACHnBAEArwcAIQIyAACwDwAgMwAAsQ8AIAgyAADJCAAgMwAAyggAIM8EAADICAAw0AQAAIsBABDRBAAAyAgAMOYEAQCvBwAh5wQBAK8HACGpBgAAxwgAIAMAAACLAQAgAgAAjAEAMAMAAI0BACADAAAAiwEAIAIAAIwBADADAACNAQAgAQAAAIsBACABAAAAiwEAIA0iAACvCAAgzwQAAMYIADDQBAAAkgEAENEEAADGCAAw0gQBAK8HACHaBEAAsgcAIfgEAQCvBwAh-QQBAK8HACH6BAEArwcAIfsEAQCvBwAh_AQAAN8HACD9BAIA4QcAIf4EQACyBwAhASIAAJkNACAOIgAArwgAIM8EAADGCAAw0AQAAJIBABDRBAAAxggAMNIEAQAAAAHaBEAAsgcAIfgEAQCvBwAh-QQBAK8HACH6BAEArwcAIfsEAQCvBwAh_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_AQAgDtIEAQAAAAHaBEAAAAAB8wRAAAAAAfkEAQAAAAGWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQZAAAAAAZ4GQAAAAAGfBgEAAAABATwAAMEBADABPAAAwQEAMA8iAADdDQAg0gQBAKQJACHaBEAApwkAIfMEQACnCQAh-QQBAKQJACGWBgEApAkAIZcGAQCkCQAhmAYBAKQJACGZBgEAtAkAIZoGAQC0CQAhmwYBALQJACGcBgEAtAkAIZ0GQACmCQAhngZAAKYJACGfBgEAtAkAIQIAAABkACA8AADEAQAgDtIEAQCkCQAh2gRAAKcJACHzBEAApwkAIfkEAQCkCQAhlgYBAKQJACGXBgEApAkAIZgGAQCkCQAhmQYBALQJACGaBgEAtAkAIZsGAQC0CQAhnAYBALQJACGdBkAApgkAIZ4GQACmCQAhnwYBALQJACECAAAAYgAgPAAAxgEAIAIAAABiACA8AADGAQAgAwAAAGQAIEMAAL8BACBEAADEAQAgAQAAAGQAIAEAAABiACAKDQAA2g0AIEkAANwNACBKAADbDQAgmQYAAKAJACCaBgAAoAkAIJsGAACgCQAgnAYAAKAJACCdBgAAoAkAIJ4GAACgCQAgnwYAAKAJACARzwQAALoIADDQBAAAzQEAENEEAAC6CAAw0gQBAKAHACHaBEAAowcAIfMEQACjBwAh-QQBAKAHACGWBgEAoAcAIZcGAQCgBwAhmAYBAKAHACGZBgEAtQcAIZoGAQC1BwAhmwYBALUHACGcBgEAtQcAIZ0GQACiBwAhngZAAKIHACGfBgEAtQcAIQMAAABiACACAADMAQAwSAAAzQEAIAMAAABiACACAABjADADAABkACABAAAAbAAgAQAAAGwAIAMAAABqACACAABrADADAABsACADAAAAagAgAgAAawAwAwAAbAAgAwAAAGoAIAIAAGsAMAMAAGwAIAUiAADZDQAg0gQBAAAAAfkEAQAAAAGUBgEAAAABlQYBAAAAAQE8AADVAQAgBNIEAQAAAAH5BAEAAAABlAYBAAAAAZUGAQAAAAEBPAAA1wEAMAE8AADXAQAwBSIAANgNACDSBAEApAkAIfkEAQCkCQAhlAYBAKQJACGVBgEAtAkAIQIAAABsACA8AADaAQAgBNIEAQCkCQAh-QQBAKQJACGUBgEApAkAIZUGAQC0CQAhAgAAAGoAIDwAANwBACACAAAAagAgPAAA3AEAIAMAAABsACBDAADVAQAgRAAA2gEAIAEAAABsACABAAAAagAgBA0AANUNACBJAADXDQAgSgAA1g0AIJUGAACgCQAgB88EAAC5CAAw0AQAAOMBABDRBAAAuQgAMNIEAQCgBwAh-QQBAKAHACGUBgEAoAcAIZUGAQC1BwAhAwAAAGoAIAIAAOIBADBIAADjAQAgAwAAAGoAIAIAAGsAMAMAAGwAIAEAAABoACABAAAAaAAgAwAAAGYAIAIAAGcAMAMAAGgAIAMAAABmACACAABnADADAABoACADAAAAZgAgAgAAZwAwAwAAaAAgCSIAANQNACDSBAEAAAAB2gRAAAAAAfMEQAAAAAH5BAEAAAAB_gRAAAAAAZEFAQAAAAGSBQEAAAABkwYBAAAAAQE8AADrAQAgCNIEAQAAAAHaBEAAAAAB8wRAAAAAAfkEAQAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAGTBgEAAAABATwAAO0BADABPAAA7QEAMAkiAADTDQAg0gQBAKQJACHaBEAApwkAIfMEQACnCQAh-QQBAKQJACH-BEAApwkAIZEFAQC0CQAhkgUBALQJACGTBgEApAkAIQIAAABoACA8AADwAQAgCNIEAQCkCQAh2gRAAKcJACHzBEAApwkAIfkEAQCkCQAh_gRAAKcJACGRBQEAtAkAIZIFAQC0CQAhkwYBAKQJACECAAAAZgAgPAAA8gEAIAIAAABmACA8AADyAQAgAwAAAGgAIEMAAOsBACBEAADwAQAgAQAAAGgAIAEAAABmACAFDQAA0A0AIEkAANINACBKAADRDQAgkQUAAKAJACCSBQAAoAkAIAvPBAAAuAgAMNAEAAD5AQAQ0QQAALgIADDSBAEAoAcAIdoEQACjBwAh8wRAAKMHACH5BAEAoAcAIf4EQACjBwAhkQUBALUHACGSBQEAtQcAIZMGAQCgBwAhAwAAAGYAIAIAAPgBADBIAAD5AQAgAwAAAGYAIAIAAGcAMAMAAGgAIArPBAAAtggAMNAEAAD_AQAQ0QQAALYIADDSBAEAAAAB2gRAALIHACHzBEAAsgcAIf4EQACyBwAhkAYBAK8HACGRBgEArwcAIZIGAAC3CAAgAQAAAPwBACABAAAA_AEAIAnPBAAAtggAMNAEAAD_AQAQ0QQAALYIADDSBAEArwcAIdoEQACyBwAh8wRAALIHACH-BEAAsgcAIZAGAQCvBwAhkQYBAK8HACEAAwAAAP8BACACAACAAgAwAwAA_AEAIAMAAAD_AQAgAgAAgAIAMAMAAPwBACADAAAA_wEAIAIAAIACADADAAD8AQAgBtIEAQAAAAHaBEAAAAAB8wRAAAAAAf4EQAAAAAGQBgEAAAABkQYBAAAAAQE8AACEAgAgBtIEAQAAAAHaBEAAAAAB8wRAAAAAAf4EQAAAAAGQBgEAAAABkQYBAAAAAQE8AACGAgAwATwAAIYCADAG0gQBAKQJACHaBEAApwkAIfMEQACnCQAh_gRAAKcJACGQBgEApAkAIZEGAQCkCQAhAgAAAPwBACA8AACJAgAgBtIEAQCkCQAh2gRAAKcJACHzBEAApwkAIf4EQACnCQAhkAYBAKQJACGRBgEApAkAIQIAAAD_AQAgPAAAiwIAIAIAAAD_AQAgPAAAiwIAIAMAAAD8AQAgQwAAhAIAIEQAAIkCACABAAAA_AEAIAEAAAD_AQAgAw0AAM0NACBJAADPDQAgSgAAzg0AIAnPBAAAtQgAMNAEAACSAgAQ0QQAALUIADDSBAEAoAcAIdoEQACjBwAh8wRAAKMHACH-BEAAowcAIZAGAQCgBwAhkQYBAKAHACEDAAAA_wEAIAIAAJECADBIAACSAgAgAwAAAP8BACACAACAAgAwAwAA_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-AVAAAAAAfkFQAAAAAH6BSAAAAAB-wUgAAAAAfwFIAAAAAH9BQIAAAAB_gUgAAAAAf8FAQAAAAEBPAAAygIAIBjSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHxBQEAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABATwAAMwCADABPAAAzAIAMAEAAAAFACAgBAAAzAwAIAUAAM0MACAGAADODAAgBwAAzwwAIAwAANIMACAXAADTDAAgHgAA0AwAIB8AANEMACDSBAEApAkAIdgEAADLDPgFItoEQACnCQAh6AQBAKQJACHpBAEApAkAIe8EQACmCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhogUBAKQJACG6BQIAtgkAIfEFAQCkCQAh8wUBALQJACH0BQIAtgkAIfUFAgC2CQAh9gUCALYJACH4BUAApgkAIfkFQACmCQAh-gUgAPUJACH7BSAA9QkAIfwFIAD1CQAh_QUCALYJACH-BSAA9QkAIf8FAQC0CQAhAgAAAAcAIDwAANACACAY0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_BQEAtAkAIQIAAAAFACA8AADSAgAgAgAAAAUAIDwAANICACABAAAABQAgAwAAAAcAIEMAAMoCACBEAADQAgAgAQAAAAcAIAEAAAAFACAMDQAAxgwAIEkAAMkMACBKAADIDAAgqwEAAMcMACCsAQAAygwAIO8EAACgCQAg8gQAAKAJACD3BAAAoAkAIPMFAACgCQAg-AUAAKAJACD5BQAAoAkAIP8FAACgCQAgG88EAACnCAAw0AQAANoCABDRBAAApwgAMNIEAQCgBwAh2AQAAKgI-AUi2gRAAKMHACHoBAEAoAcAIekEAQCgBwAh7wRAAKIHACHyBEAAogcAIfMEQACjBwAh9wQBALUHACGiBQEAoAcAIboFAgC3BwAh8QUBAKAHACHzBQEAtQcAIfQFAgC3BwAh9QUCALcHACH2BQIAtwcAIfgFQACiBwAh-QVAAKIHACH6BSAAygcAIfsFIADKBwAh_AUgAMoHACH9BQIAtwcAIf4FIADKBwAh_wUBALUHACEDAAAABQAgAgAA2QIAMEgAANoCACADAAAABQAgAgAABgAwAwAABwAgAQAAAFMAIAEAAABTACADAAAAUQAgAgAAUgAwAwAAUwAgAwAAAFEAIAIAAFIAMAMAAFMAIAMAAABRACACAABSADADAABTACAUBgAAwAwAIAcAAMEMACAKAADCDAAgDwAAxQwAIB0AAMMMACAeAADEDAAg0gQBAAAAAdoEQAAAAAHoBAEAAAAB6QQBAAAAAfIEQAAAAAHzBEAAAAAB9wQBAAAAAZQFAAAA7QUCogUBAAAAAe4FAAAA7gUC7wUCAAAAAfAFAgAAAAHxBQEAAAAB8gUgAAAAAQE8AADiAgAgDtIEAQAAAAHaBEAAAAAB6AQBAAAAAekEAQAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGUBQAAAO0FAqIFAQAAAAHuBQAAAO4FAu8FAgAAAAHwBQIAAAAB8QUBAAAAAfIFIAAAAAEBPAAA5AIAMAE8AADkAgAwFAYAAJQMACAHAACVDAAgCgAAlgwAIA8AAJkMACAdAACXDAAgHgAAmAwAINIEAQCkCQAh2gRAAKcJACHoBAEApAkAIekEAQCkCQAh8gRAAKYJACHzBEAApwkAIfcEAQCkCQAhlAUAAJIM7QUiogUBAKQJACHuBQAAkwzuBSLvBQIAtgkAIfAFAgC7CgAh8QUBAKQJACHyBSAA9QkAIQIAAABTACA8AADnAgAgDtIEAQCkCQAh2gRAAKcJACHoBAEApAkAIekEAQCkCQAh8gRAAKYJACHzBEAApwkAIfcEAQCkCQAhlAUAAJIM7QUiogUBAKQJACHuBQAAkwzuBSLvBQIAtgkAIfAFAgC7CgAh8QUBAKQJACHyBSAA9QkAIQIAAABRACA8AADpAgAgAgAAAFEAIDwAAOkCACADAAAAUwAgQwAA4gIAIEQAAOcCACABAAAAUwAgAQAAAFEAIAcNAACNDAAgSQAAkAwAIEoAAI8MACCrAQAAjgwAIKwBAACRDAAg8gQAAKAJACDwBQAAoAkAIBHPBAAAoAgAMNAEAADwAgAQ0QQAAKAIADDSBAEAoAcAIdoEQACjBwAh6AQBAKAHACHpBAEAoAcAIfIEQACiBwAh8wRAAKMHACH3BAEAoAcAIZQFAAChCO0FIqIFAQCgBwAh7gUAAKII7gUi7wUCALcHACHwBQIA_QcAIfEFAQCgBwAh8gUgAMoHACEDAAAAUQAgAgAA7wIAMEgAAPACACADAAAAUQAgAgAAUgAwAwAAUwAgCQkAAJ4IACAcAACfCAAgzwQAAJwIADDQBAAADwAQ0QQAAJwIADDSBAEAAAABlAUAAJ0I6wUizwUBAAAAAesFAQDDBwAhAQAAAPMCACABAAAA8wIAIAMJAACLDAAgHAAAjAwAIOsFAACgCQAgAwAAAA8AIAIAAPYCADADAADzAgAgAwAAAA8AIAIAAPYCADADAADzAgAgAwAAAA8AIAIAAPYCADADAADzAgAgBgkAAIkMACAcAACKDAAg0gQBAAAAAZQFAAAA6wUCzwUBAAAAAesFAQAAAAEBPAAA-gIAIATSBAEAAAABlAUAAADrBQLPBQEAAAAB6wUBAAAAAQE8AAD8AgAwATwAAPwCADAGCQAA-wsAIBwAAPwLACDSBAEApAkAIZQFAAD6C-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_gRAAKYJACG4BQEApAkAIdUFAQC0CQAh3QUBAKQJACHeBUAApwkAId8FQACmCQAh4AVAAKYJACECAAAARgAgPAAA2AMAIArSBAEApAkAIdQEAQCkCQAh2AQAALcL3QUi_gRAAKYJACG4BQEApAkAIdUFAQC0CQAh3QUBAKQJACHeBUAApwkAId8FQACmCQAh4AVAAKYJACECAAAAGQAgPAAA2gMAIAIAAAAZACA8AADaAwAgAQAAABsAIAMAAABGACBDAADSAwAgRAAA2AMAIAEAAABGACABAAAAGQAgBw0AALQLACBJAAC2CwAgSgAAtQsAIP4EAACgCQAg1QUAAKAJACDfBQAAoAkAIOAFAACgCQAgDc8EAACRCAAw0AQAAOIDABDRBAAAkQgAMNIEAQCgBwAh1AQBAKAHACHYBAAAkgjdBSL-BEAAogcAIbgFAQCgBwAh1QUBALUHACHdBQEAoAcAId4FQACjBwAh3wVAAKIHACHgBUAAogcAIQMAAAAZACACAADhAwAwSAAA4gMAIAMAAAAZACACAABFADADAABGACABAAAAHwAgAQAAAB8AIAMAAAAdACACAAAeADADAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIBUIAACuCwAgCwAArwsAIA4AALALACAPAACxCwAgEQAAsgsAIBIAALMLACDSBAEAAAAB2AQAAADZBQLaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAbgFAQAAAAHUBUAAAAAB1QUBAAAAAdYFAQAAAAHXBQIAAAAB2QVAAAAAAdoFQAAAAAHbBQIAAAABATwAAOoDACAP0gQBAAAAAdgEAAAA2QUC2gRAAAAAAfMEQAAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAG4BQEAAAAB1AVAAAAAAdUFAQAAAAHWBQEAAAAB1wUCAAAAAdkFQAAAAAHaBUAAAAAB2wUCAAAAAQE8AADsAwAwATwAAOwDADABAAAAGQAgFQgAAIsLACALAACMCwAgDgAAjQsAIA8AAI4LACARAACPCwAgEgAAkAsAINIEAQCkCQAh2AQAAIoL2QUi2gRAAKcJACHzBEAApwkAIf4EQACnCQAhkQUBALQJACGSBQEAtAkAIbgFAQCkCQAh1AVAAKYJACHVBQEApAkAIdYFAQC0CQAh1wUCALYJACHZBUAApgkAIdoFQACmCQAh2wUCALYJACECAAAAHwAgPAAA8AMAIA_SBAEApAkAIdgEAACKC9kFItoEQACnCQAh8wRAAKcJACH-BEAApwkAIZEFAQC0CQAhkgUBALQJACG4BQEApAkAIdQFQACmCQAh1QUBAKQJACHWBQEAtAkAIdcFAgC2CQAh2QVAAKYJACHaBUAApgkAIdsFAgC2CQAhAgAAAB0AIDwAAPIDACACAAAAHQAgPAAA8gMAIAEAAAAZACADAAAAHwAgQwAA6gMAIEQAAPADACABAAAAHwAgAQAAAB0AIAsNAACFCwAgSQAAiAsAIEoAAIcLACCrAQAAhgsAIKwBAACJCwAgkQUAAKAJACCSBQAAoAkAINQFAACgCQAg1gUAAKAJACDZBQAAoAkAINoFAACgCQAgEs8EAACNCAAw0AQAAPoDABDRBAAAjQgAMNIEAQCgBwAh2AQAAI4I2QUi2gRAAKMHACHzBEAAowcAIf4EQACjBwAhkQUBALUHACGSBQEAtQcAIbgFAQCgBwAh1AVAAKIHACHVBQEAoAcAIdYFAQC1BwAh1wUCALcHACHZBUAAogcAIdoFQACiBwAh2wUCALcHACEDAAAAHQAgAgAA-QMAMEgAAPoDACADAAAAHQAgAgAAHgAwAwAAHwAgAQAAACQAIAEAAAAkACADAAAAIgAgAgAAIwAwAwAAJAAgAwAAACIAIAIAACMAMAMAACQAIAMAAAAiACACAAAjADADAAAkACAPCQAAgQsAIBAAAIALACATAACCCwAgFgAAgwsAIBkAAIQLACDSBAEAAAAB2AQAAADUBQLaBEAAAAAB8wRAAAAAAbUFAQAAAAHPBQEAAAAB0AUBAAAAAdEFAQAAAAHSBQEAAAAB1AVAAAAAAQE8AACCBAAgCtIEAQAAAAHYBAAAANQFAtoEQAAAAAHzBEAAAAABtQUBAAAAAc8FAQAAAAHQBQEAAAAB0QUBAAAAAdIFAQAAAAHUBUAAAAABATwAAIQEADABPAAAhAQAMA8JAADfCgAgEAAA3goAIBMAAOAKACAWAADhCgAgGQAA4goAINIEAQCkCQAh2AQAAN0K1AUi2gRAAKcJACHzBEAApwkAIbUFAQCkCQAhzwUBAKQJACHQBQEAtAkAIdEFAQC0CQAh0gUBALQJACHUBUAApgkAIQIAAAAkACA8AACHBAAgCtIEAQCkCQAh2AQAAN0K1AUi2gRAAKcJACHzBEAApwkAIbUFAQCkCQAhzwUBAKQJACHQBQEAtAkAIdEFAQC0CQAh0gUBALQJACHUBUAApgkAIQIAAAAiACA8AACJBAAgAgAAACIAIDwAAIkEACADAAAAJAAgQwAAggQAIEQAAIcEACABAAAAJAAgAQAAACIAIAcNAADaCgAgSQAA3AoAIEoAANsKACDQBQAAoAkAINEFAACgCQAg0gUAAKAJACDUBQAAoAkAIA3PBAAAiQgAMNAEAACQBAAQ0QQAAIkIADDSBAEAoAcAIdgEAACKCNQFItoEQACjBwAh8wRAAKMHACG1BQEAoAcAIc8FAQCgBwAh0AUBALUHACHRBQEAtQcAIdIFAQC1BwAh1AVAAKIHACEDAAAAIgAgAgAAjwQAMEgAAJAEACADAAAAIgAgAgAAIwAwAwAAJAAgAQAAABcAIAEAAAAXACADAAAAFQAgAgAAFgAwAwAAFwAgAwAAABUAIAIAABYAMAMAABcAIAMAAAAVACACAAAWADADAAAXACAGFAAA2AoAIBoAANkKACDSBAEAAAAB2gRAAAAAAb8FAQAAAAHOBQEAAAABATwAAJgEACAE0gQBAAAAAdoEQAAAAAG_BQEAAAABzgUBAAAAAQE8AACaBAAwATwAAJoEADAGFAAA1goAIBoAANcKACDSBAEApAkAIdoEQACnCQAhvwUBAKQJACHOBQEApAkAIQIAAAAXACA8AACdBAAgBNIEAQCkCQAh2gRAAKcJACG_BQEApAkAIc4FAQCkCQAhAgAAABUAIDwAAJ8EACACAAAAFQAgPAAAnwQAIAMAAAAXACBDAACYBAAgRAAAnQQAIAEAAAAXACABAAAAFQAgAw0AANMKACBJAADVCgAgSgAA1AoAIAfPBAAAiAgAMNAEAACmBAAQ0QQAAIgIADDSBAEAoAcAIdoEQACjBwAhvwUBAKAHACHOBQEAoAcAIQMAAAAVACACAAClBAAwSAAApgQAIAMAAAAVACACAAAWADADAAAXACABAAAAeQAgAQAAAHkAIAMAAAAvACACAAB4ADADAAB5ACADAAAALwAgAgAAeAAwAwAAeQAgAwAAAC8AIAIAAHgAMAMAAHkAIA4UAADRCgAgFQAA0goAINIEAQAAAAHYBAAAAM0FAtoEQAAAAAHzBEAAAAABkAWAAAAAAb4FQAAAAAG_BQEAAAAByAUBAAAAAckFAgAAAAHKBQIAAAABywUBAAAAAc0FIAAAAAEBPAAArgQAIAzSBAEAAAAB2AQAAADNBQLaBEAAAAAB8wRAAAAAAZAFgAAAAAG-BUAAAAABvwUBAAAAAcgFAQAAAAHJBQIAAAABygUCAAAAAcsFAQAAAAHNBSAAAAABATwAALAEADABPAAAsAQAMAEAAAAbACAOFAAAzwoAIBUAANAKACDSBAEApAkAIdgEAADOCs0FItoEQACnCQAh8wRAAKcJACGQBYAAAAABvgVAAKYJACG_BQEApAkAIcgFAQC0CQAhyQUCALYJACHKBQIAtgkAIcsFAQC0CQAhzQUgAPUJACECAAAAeQAgPAAAtAQAIAzSBAEApAkAIdgEAADOCs0FItoEQACnCQAh8wRAAKcJACGQBYAAAAABvgVAAKYJACG_BQEApAkAIcgFAQC0CQAhyQUCALYJACHKBQIAtgkAIcsFAQC0CQAhzQUgAPUJACECAAAALwAgPAAAtgQAIAIAAAAvACA8AAC2BAAgAQAAABsAIAMAAAB5ACBDAACuBAAgRAAAtAQAIAEAAAB5ACABAAAALwAgCQ0AAMkKACBJAADMCgAgSgAAywoAIKsBAADKCgAgrAEAAM0KACCQBQAAoAkAIL4FAACgCQAgyAUAAKAJACDLBQAAoAkAIA_PBAAAhAgAMNAEAAC-BAAQ0QQAAIQIADDSBAEAoAcAIdgEAACFCM0FItoEQACjBwAh8wRAAKMHACGQBQAA0QcAIL4FQACiBwAhvwUBAKAHACHIBQEAtQcAIckFAgC3BwAhygUCALcHACHLBQEAtQcAIc0FIADKBwAhAwAAAC8AIAIAAL0EADBIAAC-BAAgAwAAAC8AIAIAAHgAMAMAAHkAIAEAAAA0ACABAAAANAAgAwAAADIAIAIAADMAMAMAADQAIAMAAAAyACACAAAzADADAAA0ACADAAAAMgAgAgAAMwAwAwAANAAgDRQAAMcKACAYAADICgAg0gQBAAAAAdoEQAAAAAG_BQEAAAABwAUBAAAAAcEFIAAAAAHCBQEAAAABwwUBAAAAAcQFAgAAAAHFBQIAAAABxgUCAAAAAccFAQAAAAEBPAAAxgQAIAvSBAEAAAAB2gRAAAAAAb8FAQAAAAHABQEAAAABwQUgAAAAAcIFAQAAAAHDBQEAAAABxAUCAAAAAcUFAgAAAAHGBQIAAAABxwUBAAAAAQE8AADIBAAwATwAAMgEADANFAAAxQoAIBgAAMYKACDSBAEApAkAIdoEQACnCQAhvwUBAKQJACHABQEApAkAIcEFIAD1CQAhwgUBALQJACHDBQEAtAkAIcQFAgC7CgAhxQUCALsKACHGBQIAtgkAIccFAQC0CQAhAgAAADQAIDwAAMsEACAL0gQBAKQJACHaBEAApwkAIb8FAQCkCQAhwAUBAKQJACHBBSAA9QkAIcIFAQC0CQAhwwUBALQJACHEBQIAuwoAIcUFAgC7CgAhxgUCALYJACHHBQEAtAkAIQIAAAAyACA8AADNBAAgAgAAADIAIDwAAM0EACADAAAANAAgQwAAxgQAIEQAAMsEACABAAAANAAgAQAAADIAIAoNAADACgAgSQAAwwoAIEoAAMIKACCrAQAAwQoAIKwBAADECgAgwgUAAKAJACDDBQAAoAkAIMQFAACgCQAgxQUAAKAJACDHBQAAoAkAIA7PBAAAgwgAMNAEAADUBAAQ0QQAAIMIADDSBAEAoAcAIdoEQACjBwAhvwUBAKAHACHABQEAoAcAIcEFIADKBwAhwgUBALUHACHDBQEAtQcAIcQFAgD9BwAhxQUCAP0HACHGBQIAtwcAIccFAQC1BwAhAwAAADIAIAIAANMEADBIAADUBAAgAwAAADIAIAIAADMAMAMAADQAIAEAAABKACABAAAASgAgAwAAACYAIAIAAEkAMAMAAEoAIAMAAAAmACACAABJADADAABKACADAAAAJgAgAgAASQAwAwAASgAgDQgAAL8KACAQAAC-CgAg0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG1BQEAAAABuAUBAAAAAbkFAgAAAAG6BQIAAAABuwUIAAAAAb0FAgAAAAG-BUAAAAABATwAANwEACAL0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG1BQEAAAABuAUBAAAAAbkFAgAAAAG6BQIAAAABuwUIAAAAAb0FAgAAAAG-BUAAAAABATwAAN4EADABPAAA3gQAMA0IAAC9CgAgEAAAvAoAINIEAQCkCQAh2AQAALoKvQUi2gRAAKcJACHzBEAApwkAIbUFAQCkCQAhuAUBAKQJACG5BQIAtgkAIboFAgC2CQAhuwUIALkKACG9BQIAuwoAIb4FQACmCQAhAgAAAEoAIDwAAOEEACAL0gQBAKQJACHYBAAAugq9BSLaBEAApwkAIfMEQACnCQAhtQUBAKQJACG4BQEApAkAIbkFAgC2CQAhugUCALYJACG7BQgAuQoAIb0FAgC7CgAhvgVAAKYJACECAAAAJgAgPAAA4wQAIAIAAAAmACA8AADjBAAgAwAAAEoAIEMAANwEACBEAADhBAAgAQAAAEoAIAEAAAAmACAHDQAAtAoAIEkAALcKACBKAAC2CgAgqwEAALUKACCsAQAAuAoAIL0FAACgCQAgvgUAAKAJACAOzwQAAPoHADDQBAAA6gQAENEEAAD6BwAw0gQBAKAHACHYBAAA_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_PBAAA2QcAMNAEAADLBQAQ0QQAANkHADDSBAEAoAcAIdoEQACjBwAhlwUAANoHlwUimAUBAKAHACGZBQEAoAcAIZoFAADGBwAgmwUgAMoHACGcBUAAogcAIZ0FAgC3BwAhngUCALcHACGfBUAAogcAIaAFQACiBwAhAwAAALgFACACAADKBQAwSAAAywUAIAMAAAC4BQAgAgAAuQUAMAMAALUFACABAAAAfgAgAQAAAH4AIAMAAAB8ACACAAB9ADADAAB-ACADAAAAfAAgAgAAfQAwAwAAfgAgAwAAAHwAIAIAAH0AMAMAAH4AIAoiAACDCgAg0gQBAAAAAdYEAQAAAAHaBEAAAAAB6AQBAAAAAfMEQAAAAAH5BAEAAAABkAWAAAAAAZQFAAAAlAUClQUgAAAAAQE8AADTBQAgCdIEAQAAAAHWBAEAAAAB2gRAAAAAAegEAQAAAAHzBEAAAAAB-QQBAAAAAZAFgAAAAAGUBQAAAJQFApUFIAAAAAEBPAAA1QUAMAE8AADVBQAwCiIAAIIKACDSBAEApAkAIdYEAQCkCQAh2gRAAKcJACHoBAEApAkAIfMEQACnCQAh-QQBAKQJACGQBYAAAAABlAUAAIEKlAUilQUgAPUJACECAAAAfgAgPAAA2AUAIAnSBAEApAkAIdYEAQCkCQAh2gRAAKcJACHoBAEApAkAIfMEQACnCQAh-QQBAKQJACGQBYAAAAABlAUAAIEKlAUilQUgAPUJACECAAAAfAAgPAAA2gUAIAIAAAB8ACA8AADaBQAgAwAAAH4AIEMAANMFACBEAADYBQAgAQAAAH4AIAEAAAB8ACAEDQAA_gkAIEkAAIAKACBKAAD_CQAgkAUAAKAJACAMzwQAANUHADDQBAAA4QUAENEEAADVBwAw0gQBAKAHACHWBAEAoAcAIdoEQACjBwAh6AQBAKAHACHzBEAAowcAIfkEAQCgBwAhkAUAANEHACCUBQAA1geUBSKVBSAAygcAIQMAAAB8ACACAADgBQAwSAAA4QUAIAMAAAB8ACACAAB9ADADAAB-ACABAAAAggEAIAEAAACCAQAgAwAAAIABACACAACBAQAwAwAAggEAIAMAAACAAQAgAgAAgQEAMAMAAIIBACADAAAAgAEAIAIAAIEBADADAACCAQAgDCIAAP0JACDSBAEAAAAB2gRAAAAAAfkEAQAAAAGLBQAAAIsFAowFAQAAAAGNBQEAAAABjgWAAAAAAY8FgAAAAAGQBYAAAAABkQUBAAAAAZIFAQAAAAEBPAAA6QUAIAvSBAEAAAAB2gRAAAAAAfkEAQAAAAGLBQAAAIsFAowFAQAAAAGNBQEAAAABjgWAAAAAAY8FgAAAAAGQBYAAAAABkQUBAAAAAZIFAQAAAAEBPAAA6wUAMAE8AADrBQAwAQAAABsAIAwiAAD8CQAg0gQBAKQJACHaBEAApwkAIfkEAQC0CQAhiwUAAPsJiwUijAUBAKQJACGNBQEAtAkAIY4FgAAAAAGPBYAAAAABkAWAAAAAAZEFAQC0CQAhkgUBALQJACECAAAAggEAIDwAAO8FACAL0gQBAKQJACHaBEAApwkAIfkEAQC0CQAhiwUAAPsJiwUijAUBAKQJACGNBQEAtAkAIY4FgAAAAAGPBYAAAAABkAWAAAAAAZEFAQC0CQAhkgUBALQJACECAAAAgAEAIDwAAPEFACACAAAAgAEAIDwAAPEFACABAAAAGwAgAwAAAIIBACBDAADpBQAgRAAA7wUAIAEAAACCAQAgAQAAAIABACAKDQAA-AkAIEkAAPoJACBKAAD5CQAg-QQAAKAJACCNBQAAoAkAII4FAACgCQAgjwUAAKAJACCQBQAAoAkAIJEFAACgCQAgkgUAAKAJACAOzwQAAM8HADDQBAAA-QUAENEEAADPBwAw0gQBAKAHACHaBEAAowcAIfkEAQC1BwAhiwUAANAHiwUijAUBAKAHACGNBQEAtQcAIY4FAADRBwAgjwUAANEHACCQBQAA0QcAIJEFAQC1BwAhkgUBALUHACEDAAAAgAEAIAIAAPgFADBIAAD5BQAgAwAAAIABACACAACBAQAwAwAAggEAIAEAAABwACABAAAAcAAgAwAAAG4AIAIAAG8AMAMAAHAAIAMAAABuACACAABvADADAABwACADAAAAbgAgAgAAbwAwAwAAcAAgByIAAPcJACDSBAEAAAAB-QQBAAAAAYYFAAAAhgUChwUgAAAAAYgFQAAAAAGJBUAAAAABATwAAIEGACAG0gQBAAAAAfkEAQAAAAGGBQAAAIYFAocFIAAAAAGIBUAAAAABiQVAAAAAAQE8AACDBgAwATwAAIMGADAHIgAA9gkAINIEAQCkCQAh-QQBAKQJACGGBQAA9AmGBSKHBSAA9QkAIYgFQACnCQAhiQVAAKYJACECAAAAcAAgPAAAhgYAIAbSBAEApAkAIfkEAQCkCQAhhgUAAPQJhgUihwUgAPUJACGIBUAApwkAIYkFQACmCQAhAgAAAG4AIDwAAIgGACACAAAAbgAgPAAAiAYAIAMAAABwACBDAACBBgAgRAAAhgYAIAEAAABwACABAAAAbgAgBA0AAPEJACBJAADzCQAgSgAA8gkAIIkFAACgCQAgCc8EAADIBwAw0AQAAI8GABDRBAAAyAcAMNIEAQCgBwAh-QQBAKAHACGGBQAAyQeGBSKHBSAAygcAIYgFQACjBwAhiQVAAKIHACEDAAAAbgAgAgAAjgYAMEgAAI8GACADAAAAbgAgAgAAbwAwAwAAcAAgAQAAAJQBACABAAAAlAEAIAMAAACSAQAgAgAAkwEAMAMAAJQBACADAAAAkgEAIAIAAJMBADADAACUAQAgAwAAAJIBACACAACTAQAwAwAAlAEAIAoiAADwCQAg0gQBAAAAAdoEQAAAAAH4BAEAAAAB-QQBAAAAAfoEAQAAAAH7BAEAAAAB_ASAAAAAAf0EAgAAAAH-BEAAAAABATwAAJcGACAJ0gQBAAAAAdoEQAAAAAH4BAEAAAAB-QQBAAAAAfoEAQAAAAH7BAEAAAAB_ASAAAAAAf0EAgAAAAH-BEAAAAABATwAAJkGADABPAAAmQYAMAoiAADvCQAg0gQBAKQJACHaBEAApwkAIfgEAQCkCQAh-QQBAKQJACH6BAEApAkAIfsEAQCkCQAh_ASAAAAAAf0EAgC2CQAh_gRAAKcJACECAAAAlAEAIDwAAJwGACAJ0gQBAKQJACHaBEAApwkAIfgEAQCkCQAh-QQBAKQJACH6BAEApAkAIfsEAQCkCQAh_ASAAAAAAf0EAgC2CQAh_gRAAKcJACECAAAAkgEAIDwAAJ4GACACAAAAkgEAIDwAAJ4GACADAAAAlAEAIEMAAJcGACBEAACcBgAgAQAAAJQBACABAAAAkgEAIAUNAADqCQAgSQAA7QkAIEoAAOwJACCrAQAA6wkAIKwBAADuCQAgDM8EAADFBwAw0AQAAKUGABDRBAAAxQcAMNIEAQCgBwAh2gRAAKMHACH4BAEAoAcAIfkEAQCgBwAh-gQBAKAHACH7BAEAoAcAIfwEAADGBwAg_QQCALcHACH-BEAAowcAIQMAAACSAQAgAgAApAYAMEgAAKUGACADAAAAkgEAIAIAAJMBADADAACUAQAgCjAAAMQHACDPBAAAwgcAMNAEAACrBgAQ0QQAAMIHADDSBAEAAAAB0wQBAAAAAdoEQACyBwAh6QQBAAAAAfMEQACyBwAh9wQBAMMHACEBAAAAqAYAIAEAAACoBgAgCjAAAMQHACDPBAAAwgcAMNAEAACrBgAQ0QQAAMIHADDSBAEArwcAIdMEAQCvBwAh2gRAALIHACHpBAEArwcAIfMEQACyBwAh9wQBAMMHACECMAAA6QkAIPcEAACgCQAgAwAAAKsGACACAACsBgAwAwAAqAYAIAMAAACrBgAgAgAArAYAMAMAAKgGACADAAAAqwYAIAIAAKwGADADAACoBgAgBzAAAOgJACDSBAEAAAAB0wQBAAAAAdoEQAAAAAHpBAEAAAAB8wRAAAAAAfcEAQAAAAEBPAAAsAYAIAbSBAEAAAAB0wQBAAAAAdoEQAAAAAHpBAEAAAAB8wRAAAAAAfcEAQAAAAEBPAAAsgYAMAE8AACyBgAwBzAAANsJACDSBAEApAkAIdMEAQCkCQAh2gRAAKcJACHpBAEApAkAIfMEQACnCQAh9wQBALQJACECAAAAqAYAIDwAALUGACAG0gQBAKQJACHTBAEApAkAIdoEQACnCQAh6QQBAKQJACHzBEAApwkAIfcEAQC0CQAhAgAAAKsGACA8AAC3BgAgAgAAAKsGACA8AAC3BgAgAwAAAKgGACBDAACwBgAgRAAAtQYAIAEAAACoBgAgAQAAAKsGACAEDQAA2AkAIEkAANoJACBKAADZCQAg9wQAAKAJACAJzwQAAMEHADDQBAAAvgYAENEEAADBBwAw0gQBAKAHACHTBAEAoAcAIdoEQACjBwAh6QQBAKAHACHzBEAAowcAIfcEAQC1BwAhAwAAAKsGACACAAC9BgAwSAAAvgYAIAMAAACrBgAgAgAArAYAMAMAAKgGACAIMAAAwAcAIM8EAAC_BwAw0AQAAMQGABDRBAAAvwcAMNIEAQAAAAHTBAEAAAAB2gRAALIHACHpBAEAAAABAQAAAMEGACABAAAAwQYAIAgwAADABwAgzwQAAL8HADDQBAAAxAYAENEEAAC_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_BwAw0AQAAMQGABDRBAAAvwcAMNIEAQCvBwAh0wQBAK8HACHaBEAAsgcAIekEAQCvBwAhA_QEAACLAQAg9QQAAIsBACD2BAAAiwEAIAnPBAAAwQcAMNAEAAC-BgAQ0QQAAMEHADDSBAEAoAcAIdMEAQCgBwAh2gRAAKMHACHpBAEAoAcAIfMEQACjBwAh9wQBALUHACEKMAAAxAcAIM8EAADCBwAw0AQAAKsGABDRBAAAwgcAMNIEAQCvBwAh0wQBAK8HACHaBEAAsgcAIekEAQCvBwAh8wRAALIHACH3BAEAwwcAIQvbBAEAAAAB3AQBAAAABd0EAQAAAAXeBAEAAAAB3wQBAAAAAeAEAQAAAAHhBAEAAAAB4gQBAL0HACHjBAEAAAAB5AQBAAAAAeUEAQAAAAED9AQAAIUBACD1BAAAhQEAIPYEAACFAQAgDM8EAADFBwAw0AQAAKUGABDRBAAAxQcAMNIEAQCgBwAh2gRAAKMHACH4BAEAoAcAIfkEAQCgBwAh-gQBAKAHACH7BAEAoAcAIfwEAADGBwAg_QQCALcHACH-BEAAowcAIQ8NAAClBwAgSQAAxwcAIEoAAMcHACDbBIAAAAAB3gSAAAAAAd8EgAAAAAHgBIAAAAAB4QSAAAAAAeIEgAAAAAH_BAEAAAABgAUBAAAAAYEFAQAAAAGCBYAAAAABgwWAAAAAAYQFgAAAAAEM2wSAAAAAAd4EgAAAAAHfBIAAAAAB4ASAAAAAAeEEgAAAAAHiBIAAAAAB_wQBAAAAAYAFAQAAAAGBBQEAAAABggWAAAAAAYMFgAAAAAGEBYAAAAABCc8EAADIBwAw0AQAAI8GABDRBAAAyAcAMNIEAQCgBwAh-QQBAKAHACGGBQAAyQeGBSKHBSAAygcAIYgFQACjBwAhiQVAAKIHACEHDQAApQcAIEkAAM4HACBKAADOBwAg2wQAAACGBQLcBAAAAIYFCN0EAAAAhgUI4gQAAM0HhgUiBQ0AAKUHACBJAADMBwAgSgAAzAcAINsEIAAAAAHiBCAAywcAIQUNAAClBwAgSQAAzAcAIEoAAMwHACDbBCAAAAAB4gQgAMsHACEC2wQgAAAAAeIEIADMBwAhBw0AAKUHACBJAADOBwAgSgAAzgcAINsEAAAAhgUC3AQAAACGBQjdBAAAAIYFCOIEAADNB4YFIgTbBAAAAIYFAtwEAAAAhgUI3QQAAACGBQjiBAAAzgeGBSIOzwQAAM8HADDQBAAA-QUAENEEAADPBwAw0gQBAKAHACHaBEAAowcAIfkEAQC1BwAhiwUAANAHiwUijAUBAKAHACGNBQEAtQcAIY4FAADRBwAgjwUAANEHACCQBQAA0QcAIJEFAQC1BwAhkgUBALUHACEHDQAApQcAIEkAANQHACBKAADUBwAg2wQAAACLBQLcBAAAAIsFCN0EAAAAiwUI4gQAANMHiwUiDw0AAKgHACBJAADSBwAgSgAA0gcAINsEgAAAAAHeBIAAAAAB3wSAAAAAAeAEgAAAAAHhBIAAAAAB4gSAAAAAAf8EAQAAAAGABQEAAAABgQUBAAAAAYIFgAAAAAGDBYAAAAABhAWAAAAAAQzbBIAAAAAB3gSAAAAAAd8EgAAAAAHgBIAAAAAB4QSAAAAAAeIEgAAAAAH_BAEAAAABgAUBAAAAAYEFAQAAAAGCBYAAAAABgwWAAAAAAYQFgAAAAAEHDQAApQcAIEkAANQHACBKAADUBwAg2wQAAACLBQLcBAAAAIsFCN0EAAAAiwUI4gQAANMHiwUiBNsEAAAAiwUC3AQAAACLBQjdBAAAAIsFCOIEAADUB4sFIgzPBAAA1QcAMNAEAADhBQAQ0QQAANUHADDSBAEAoAcAIdYEAQCgBwAh2gRAAKMHACHoBAEAoAcAIfMEQACjBwAh-QQBAKAHACGQBQAA0QcAIJQFAADWB5QFIpUFIADKBwAhBw0AAKUHACBJAADYBwAgSgAA2AcAINsEAAAAlAUC3AQAAACUBQjdBAAAAJQFCOIEAADXB5QFIgcNAAClBwAgSQAA2AcAIEoAANgHACDbBAAAAJQFAtwEAAAAlAUI3QQAAACUBQjiBAAA1weUBSIE2wQAAACUBQLcBAAAAJQFCN0EAAAAlAUI4gQAANgHlAUiD88EAADZBwAw0AQAAMsFABDRBAAA2QcAMNIEAQCgBwAh2gRAAKMHACGXBQAA2geXBSKYBQEAoAcAIZkFAQCgBwAhmgUAAMYHACCbBSAAygcAIZwFQACiBwAhnQUCALcHACGeBQIAtwcAIZ8FQACiBwAhoAVAAKIHACEHDQAApQcAIEkAANwHACBKAADcBwAg2wQAAACXBQLcBAAAAJcFCN0EAAAAlwUI4gQAANsHlwUiBw0AAKUHACBJAADcBwAgSgAA3AcAINsEAAAAlwUC3AQAAACXBQjdBAAAAJcFCOIEAADbB5cFIgTbBAAAAJcFAtwEAAAAlwUI3QQAAACXBQjiBAAA3AeXBSIPzwQAAN0HADDQBAAAuAUAENEEAADdBwAw0gQBAK8HACHaBEAAsgcAIZcFAADeB5cFIpgFAQCvBwAhmQUBAK8HACGaBQAA3wcAIJsFIADgBwAhnAVAALEHACGdBQIA4QcAIZ4FAgDhBwAhnwVAALEHACGgBUAAsQcAIQTbBAAAAJcFAtwEAAAAlwUI3QQAAACXBQjiBAAA3AeXBSIM2wSAAAAAAd4EgAAAAAHfBIAAAAAB4ASAAAAAAeEEgAAAAAHiBIAAAAAB_wQBAAAAAYAFAQAAAAGBBQEAAAABggWAAAAAAYMFgAAAAAGEBYAAAAABAtsEIAAAAAHiBCAAzAcAIQjbBAIAAAAB3AQCAAAABN0EAgAAAATeBAIAAAAB3wQCAAAAAeAEAgAAAAHhBAIAAAAB4gQCAKUHACEClwUAAACXBQKYBQEAAAABE88EAADjBwAw0AQAALIFABDRBAAA4wcAMNIEAQCgBwAh2AQAAOQHpQUi2gRAAKMHACHzBEAAowcAIfkEAQCgBwAhkAUAANEHACCXBQAA2geXBSKiBQEAtQcAIaMFAQC1BwAhpQUEAOUHACGmBQEAoAcAIacFAQC1BwAhqAUBALUHACGpBQEAtQcAIaoFQACiBwAhqwVAAKIHACEHDQAApQcAIEkAAOkHACBKAADpBwAg2wQAAAClBQLcBAAAAKUFCN0EAAAApQUI4gQAAOgHpQUiDQ0AAKUHACBJAADnBwAgSgAA5wcAIKsBAAC5BwAgrAEAAOcHACDbBAQAAAAB3AQEAAAABN0EBAAAAATeBAQAAAAB3wQEAAAAAeAEBAAAAAHhBAQAAAAB4gQEAOYHACENDQAApQcAIEkAAOcHACBKAADnBwAgqwEAALkHACCsAQAA5wcAINsEBAAAAAHcBAQAAAAE3QQEAAAABN4EBAAAAAHfBAQAAAAB4AQEAAAAAeEEBAAAAAHiBAQA5gcAIQjbBAQAAAAB3AQEAAAABN0EBAAAAATeBAQAAAAB3wQEAAAAAeAEBAAAAAHhBAQAAAAB4gQEAOcHACEHDQAApQcAIEkAAOkHACBKAADpBwAg2wQAAAClBQLcBAAAAKUFCN0EAAAApQUI4gQAAOgHpQUiBNsEAAAApQUC3AQAAAClBQjdBAAAAKUFCOIEAADpB6UFIg_PBAAA6gcAMNAEAACYBQAQ0QQAAOoHADDSBAEAoAcAIdgEAADsB68FItoEQACjBwAh8wRAAKMHACGiBQEAoAcAIa0FAADrB60FIq8FAQC1BwAhsAUBALUHACGxBUAAogcAIbIFQACiBwAhswUgAMoHACG0BUAAogcAIQcNAAClBwAgSQAA8AcAIEoAAPAHACDbBAAAAK0FAtwEAAAArQUI3QQAAACtBQjiBAAA7wetBSIHDQAApQcAIEkAAO4HACBKAADuBwAg2wQAAACvBQLcBAAAAK8FCN0EAAAArwUI4gQAAO0HrwUiBw0AAKUHACBJAADuBwAgSgAA7gcAINsEAAAArwUC3AQAAACvBQjdBAAAAK8FCOIEAADtB68FIgTbBAAAAK8FAtwEAAAArwUI3QQAAACvBQjiBAAA7gevBSIHDQAApQcAIEkAAPAHACBKAADwBwAg2wQAAACtBQLcBAAAAK0FCN0EAAAArQUI4gQAAO8HrQUiBNsEAAAArQUC3AQAAACtBQjdBAAAAK0FCOIEAADwB60FIhEGAAD0BwAgJAAA9QcAIM8EAADxBwAw0AQAAFUAENEEAADxBwAw0gQBAK8HACHYBAAA8wevBSLaBEAAsgcAIfMEQACyBwAhogUBAK8HACGtBQAA8getBSKvBQEAwwcAIbAFAQDDBwAhsQVAALEHACGyBUAAsQcAIbMFIADgBwAhtAVAALEHACEE2wQAAACtBQLcBAAAAK0FCN0EAAAArQUI4gQAAPAHrQUiBNsEAAAArwUC3AQAAACvBQjdBAAAAK8FCOIEAADuB68FIhYBAACvCAAgIAAAsggAICEAALMIACAjAAC0CAAgJAAA9QcAIM8EAACxCAAw0AQAAAMAENEEAACxCAAw0gQBAK8HACHTBAEArwcAIdoEQACyBwAh6QQBAK8HACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGLBgEAwwcAIYwGAQDDBwAhjQYBAMMHACGOBiAA4AcAIY8GAQCvBwAhtgYAAAMAILcGAAADACAD9AQAAFcAIPUEAABXACD2BAAAVwAgCM8EAAD2BwAw0AQAAIAFABDRBAAA9gcAMNIEAQCgBwAhkAUAANEHACCZBQAA9we3BSK1BQEAoAcAIbcFQACjBwAhBw0AAKUHACBJAAD5BwAgSgAA-QcAINsEAAAAtwUC3AQAAAC3BQjdBAAAALcFCOIEAAD4B7cFIgcNAAClBwAgSQAA-QcAIEoAAPkHACDbBAAAALcFAtwEAAAAtwUI3QQAAAC3BQjiBAAA-Ae3BSIE2wQAAAC3BQLcBAAAALcFCN0EAAAAtwUI4gQAAPkHtwUiDs8EAAD6BwAw0AQAAOoEABDRBAAA-gcAMNIEAQCgBwAh2AQAAPwHvQUi2gRAAKMHACHzBEAAowcAIbUFAQCgBwAhuAUBAKAHACG5BQIAtwcAIboFAgC3BwAhuwUIAPsHACG9BQIA_QcAIb4FQACiBwAhDQ0AAKUHACBJAAC5BwAgSgAAuQcAIKsBAAC5BwAgrAEAALkHACDbBAgAAAAB3AQIAAAABN0ECAAAAATeBAgAAAAB3wQIAAAAAeAECAAAAAHhBAgAAAAB4gQIAIIIACEHDQAApQcAIEkAAIEIACBKAACBCAAg2wQAAAC9BQLcBAAAAL0FCN0EAAAAvQUI4gQAAIAIvQUiDQ0AAKgHACBJAACoBwAgSgAAqAcAIKsBAAD_BwAgrAEAAKgHACDbBAIAAAAB3AQCAAAABd0EAgAAAAXeBAIAAAAB3wQCAAAAAeAEAgAAAAHhBAIAAAAB4gQCAP4HACENDQAAqAcAIEkAAKgHACBKAACoBwAgqwEAAP8HACCsAQAAqAcAINsEAgAAAAHcBAIAAAAF3QQCAAAABd4EAgAAAAHfBAIAAAAB4AQCAAAAAeEEAgAAAAHiBAIA_gcAIQjbBAgAAAAB3AQIAAAABd0ECAAAAAXeBAgAAAAB3wQIAAAAAeAECAAAAAHhBAgAAAAB4gQIAP8HACEHDQAApQcAIEkAAIEIACBKAACBCAAg2wQAAAC9BQLcBAAAAL0FCN0EAAAAvQUI4gQAAIAIvQUiBNsEAAAAvQUC3AQAAAC9BQjdBAAAAL0FCOIEAACBCL0FIg0NAAClBwAgSQAAuQcAIEoAALkHACCrAQAAuQcAIKwBAAC5BwAg2wQIAAAAAdwECAAAAATdBAgAAAAE3gQIAAAAAd8ECAAAAAHgBAgAAAAB4QQIAAAAAeIECACCCAAhDs8EAACDCAAw0AQAANQEABDRBAAAgwgAMNIEAQCgBwAh2gRAAKMHACG_BQEAoAcAIcAFAQCgBwAhwQUgAMoHACHCBQEAtQcAIcMFAQC1BwAhxAUCAP0HACHFBQIA_QcAIcYFAgC3BwAhxwUBALUHACEPzwQAAIQIADDQBAAAvgQAENEEAACECAAw0gQBAKAHACHYBAAAhQjNBSLaBEAAowcAIfMEQACjBwAhkAUAANEHACC-BUAAogcAIb8FAQCgBwAhyAUBALUHACHJBQIAtwcAIcoFAgC3BwAhywUBALUHACHNBSAAygcAIQcNAAClBwAgSQAAhwgAIEoAAIcIACDbBAAAAM0FAtwEAAAAzQUI3QQAAADNBQjiBAAAhgjNBSIHDQAApQcAIEkAAIcIACBKAACHCAAg2wQAAADNBQLcBAAAAM0FCN0EAAAAzQUI4gQAAIYIzQUiBNsEAAAAzQUC3AQAAADNBQjdBAAAAM0FCOIEAACHCM0FIgfPBAAAiAgAMNAEAACmBAAQ0QQAAIgIADDSBAEAoAcAIdoEQACjBwAhvwUBAKAHACHOBQEAoAcAIQ3PBAAAiQgAMNAEAACQBAAQ0QQAAIkIADDSBAEAoAcAIdgEAACKCNQFItoEQACjBwAh8wRAAKMHACG1BQEAoAcAIc8FAQCgBwAh0AUBALUHACHRBQEAtQcAIdIFAQC1BwAh1AVAAKIHACEHDQAApQcAIEkAAIwIACBKAACMCAAg2wQAAADUBQLcBAAAANQFCN0EAAAA1AUI4gQAAIsI1AUiBw0AAKUHACBJAACMCAAgSgAAjAgAINsEAAAA1AUC3AQAAADUBQjdBAAAANQFCOIEAACLCNQFIgTbBAAAANQFAtwEAAAA1AUI3QQAAADUBQjiBAAAjAjUBSISzwQAAI0IADDQBAAA-gMAENEEAACNCAAw0gQBAKAHACHYBAAAjgjZBSLaBEAAowcAIfMEQACjBwAh_gRAAKMHACGRBQEAtQcAIZIFAQC1BwAhuAUBAKAHACHUBUAAogcAIdUFAQCgBwAh1gUBALUHACHXBQIAtwcAIdkFQACiBwAh2gVAAKIHACHbBQIAtwcAIQcNAAClBwAgSQAAkAgAIEoAAJAIACDbBAAAANkFAtwEAAAA2QUI3QQAAADZBQjiBAAAjwjZBSIHDQAApQcAIEkAAJAIACBKAACQCAAg2wQAAADZBQLcBAAAANkFCN0EAAAA2QUI4gQAAI8I2QUiBNsEAAAA2QUC3AQAAADZBQjdBAAAANkFCOIEAACQCNkFIg3PBAAAkQgAMNAEAADiAwAQ0QQAAJEIADDSBAEAoAcAIdQEAQCgBwAh2AQAAJII3QUi_gRAAKIHACG4BQEAoAcAIdUFAQC1BwAh3QUBAKAHACHeBUAAowcAId8FQACiBwAh4AVAAKIHACEHDQAApQcAIEkAAJQIACBKAACUCAAg2wQAAADdBQLcBAAAAN0FCN0EAAAA3QUI4gQAAJMI3QUiBw0AAKUHACBJAACUCAAgSgAAlAgAINsEAAAA3QUC3AQAAADdBQjdBAAAAN0FCOIEAACTCN0FIgTbBAAAAN0FAtwEAAAA3QUI3QQAAADdBQjiBAAAlAjdBSIJzwQAAJUIADDQBAAAygMAENEEAACVCAAw0gQBAKAHACHaBEAAowcAIbgFAQCgBwAhzwUBAKAHACHhBQIAtwcAIeIFAgC3BwAhDM8EAACWCAAw0AQAALQDABDRBAAAlggAMNIEAQCgBwAh2gRAAKMHACHDBQEAoAcAIcYFAgC3BwAhzwUBAKAHACHjBQEAtQcAIeQFIADKBwAh5QUCAP0HACHmBQIA_QcAIQjPBAAAlwgAMNAEAACeAwAQ0QQAAJcIADDSBAEAoAcAIeEFAgC3BwAh5wUBAKAHACHoBQEAoAcAIekFIADKBwAhB88EAACYCAAw0AQAAIgDABDRBAAAmAgAMNIEAQCgBwAhlAUAAJkI6wUizwUBAKAHACHrBQEAtQcAIQcNAAClBwAgSQAAmwgAIEoAAJsIACDbBAAAAOsFAtwEAAAA6wUI3QQAAADrBQjiBAAAmgjrBSIHDQAApQcAIEkAAJsIACBKAACbCAAg2wQAAADrBQLcBAAAAOsFCN0EAAAA6wUI4gQAAJoI6wUiBNsEAAAA6wUC3AQAAADrBQjdBAAAAOsFCOIEAACbCOsFIgkJAACeCAAgHAAAnwgAIM8EAACcCAAw0AQAAA8AENEEAACcCAAw0gQBAK8HACGUBQAAnQjrBSLPBQEArwcAIesFAQDDBwAhBNsEAAAA6wUC3AQAAADrBQjdBAAAAOsFCOIEAACbCOsFIhkGAAD0BwAgBwAArwgAIAoAAOUIACAPAADoCAAgHQAA5ggAIB4AAOcIACDPBAAA4ggAMNAEAABRABDRBAAA4ggAMNIEAQCvBwAh2gRAALIHACHoBAEArwcAIekEAQCvBwAh8gRAALEHACHzBEAAsgcAIfcEAQCvBwAhlAUAAOMI7QUiogUBAK8HACHuBQAA5AjuBSLvBQIA4QcAIfAFAgCuCAAh8QUBAK8HACHyBSAA4AcAIbYGAABRACC3BgAAUQAgA_QEAAARACD1BAAAEQAg9gQAABEAIBHPBAAAoAgAMNAEAADwAgAQ0QQAAKAIADDSBAEAoAcAIdoEQACjBwAh6AQBAKAHACHpBAEAoAcAIfIEQACiBwAh8wRAAKMHACH3BAEAoAcAIZQFAAChCO0FIqIFAQCgBwAh7gUAAKII7gUi7wUCALcHACHwBQIA_QcAIfEFAQCgBwAh8gUgAMoHACEHDQAApQcAIEkAAKYIACBKAACmCAAg2wQAAADtBQLcBAAAAO0FCN0EAAAA7QUI4gQAAKUI7QUiBw0AAKUHACBJAACkCAAgSgAApAgAINsEAAAA7gUC3AQAAADuBQjdBAAAAO4FCOIEAACjCO4FIgcNAAClBwAgSQAApAgAIEoAAKQIACDbBAAAAO4FAtwEAAAA7gUI3QQAAADuBQjiBAAAowjuBSIE2wQAAADuBQLcBAAAAO4FCN0EAAAA7gUI4gQAAKQI7gUiBw0AAKUHACBJAACmCAAgSgAApggAINsEAAAA7QUC3AQAAADtBQjdBAAAAO0FCOIEAAClCO0FIgTbBAAAAO0FAtwEAAAA7QUI3QQAAADtBQjiBAAApgjtBSIbzwQAAKcIADDQBAAA2gIAENEEAACnCAAw0gQBAKAHACHYBAAAqAj4BSLaBEAAowcAIegEAQCgBwAh6QQBAKAHACHvBEAAogcAIfIEQACiBwAh8wRAAKMHACH3BAEAtQcAIaIFAQCgBwAhugUCALcHACHxBQEAoAcAIfMFAQC1BwAh9AUCALcHACH1BQIAtwcAIfYFAgC3BwAh-AVAAKIHACH5BUAAogcAIfoFIADKBwAh-wUgAMoHACH8BSAAygcAIf0FAgC3BwAh_gUgAMoHACH_BQEAtQcAIQcNAAClBwAgSQAAqggAIEoAAKoIACDbBAAAAPgFAtwEAAAA-AUI3QQAAAD4BQjiBAAAqQj4BSIHDQAApQcAIEkAAKoIACBKAACqCAAg2wQAAAD4BQLcBAAAAPgFCN0EAAAA-AUI4gQAAKkI-AUiBNsEAAAA-AUC3AQAAAD4BQjdBAAAAPgFCOIEAACqCPgFIhPPBAAAqwgAMNAEAADCAgAQ0QQAAKsIADDSBAEAoAcAIdoEQACjBwAh8gRAAKIHACHzBEAAowcAIfkEAQCgBwAhgAYBALUHACGBBgEAtQcAIYIGAQC1BwAhgwYBALUHACGEBgEAtQcAIYUGAQC1BwAhhgYBALUHACGHBgEAtQcAIYgGAADRBwAgiQYCAP0HACGKBiAAygcAIRQiAACvCAAgzwQAAKwIADDQBAAAcgAQ0QQAAKwIADDSBAEArwcAIdoEQACyBwAh8gRAALEHACHzBEAAsgcAIfkEAQCvBwAhgAYBAMMHACGBBgEAwwcAIYIGAQDDBwAhgwYBAMMHACGEBgEAwwcAIYUGAQDDBwAhhgYBAMMHACGHBgEAwwcAIYgGAACtCAAgiQYCAK4IACGKBiAA4AcAIQzbBIAAAAAB3gSAAAAAAd8EgAAAAAHgBIAAAAAB4QSAAAAAAeIEgAAAAAH_BAEAAAABgAUBAAAAAYEFAQAAAAGCBYAAAAABgwWAAAAAAYQFgAAAAAEI2wQCAAAAAdwEAgAAAAXdBAIAAAAF3gQCAAAAAd8EAgAAAAHgBAIAAAAB4QQCAAAAAeIEAgCoBwAhIwYAAOAIACAMAADxCAAgHwAAjQkAICQAAPUHACAlAACICQAgJgAAiQkAICcAAIoJACAoAACLCQAgKQAAjAkAICoAALIIACArAACzCAAgLAAAjgkAIC0AAI8JACAuAACQCQAgNQAAxAcAIDYAAJEJACDPBAAAhAkAMNAEAAAbABDRBAAAhAkAMNIEAQCvBwAh0wQBAK8HACHUBAEArwcAIdgEAACGCaQGItoEQACyBwAh8gRAALEHACHzBEAAsgcAIZcFAACHCaUGIoIGAQDDBwAhoAYBAMMHACGiBgAAhQmiBiKlBiAA4AcAIaYGIADgBwAhpwZAALEHACG2BgAAGwAgtwYAABsAIA_PBAAAsAgAMNAEAACqAgAQ0QQAALAIADDSBAEAoAcAIdMEAQCgBwAh2gRAAKMHACHpBAEAoAcAIfIEQACiBwAh8wRAAKMHACH3BAEAtQcAIYsGAQC1BwAhjAYBALUHACGNBgEAtQcAIY4GIADKBwAhjwYBAKAHACEUAQAArwgAICAAALIIACAhAACzCAAgIwAAtAgAICQAAPUHACDPBAAAsQgAMNAEAAADABDRBAAAsQgAMNIEAQCvBwAh0wQBAK8HACHaBEAAsgcAIekEAQCvBwAh8gRAALEHACHzBEAAsgcAIfcEAQDDBwAhiwYBAMMHACGMBgEAwwcAIY0GAQDDBwAhjgYgAOAHACGPBgEArwcAIQP0BAAABQAg9QQAAAUAIPYEAAAFACAD9AQAAFEAIPUEAABRACD2BAAAUQAgEwYAAPQHACAkAAD1BwAgzwQAAPEHADDQBAAAVQAQ0QQAAPEHADDSBAEArwcAIdgEAADzB68FItoEQACyBwAh8wRAALIHACGiBQEArwcAIa0FAADyB60FIq8FAQDDBwAhsAUBAMMHACGxBUAAsQcAIbIFQACxBwAhswUgAOAHACG0BUAAsQcAIbYGAABVACC3BgAAVQAgCc8EAAC1CAAw0AQAAJICABDRBAAAtQgAMNIEAQCgBwAh2gRAAKMHACHzBEAAowcAIf4EQACjBwAhkAYBAKAHACGRBgEAoAcAIQnPBAAAtggAMNAEAAD_AQAQ0QQAALYIADDSBAEArwcAIdoEQACyBwAh8wRAALIHACH-BEAAsgcAIZAGAQCvBwAhkQYBAK8HACECkAYBAAAAAZEGAQAAAAELzwQAALgIADDQBAAA-QEAENEEAAC4CAAw0gQBAKAHACHaBEAAowcAIfMEQACjBwAh-QQBAKAHACH-BEAAowcAIZEFAQC1BwAhkgUBALUHACGTBgEAoAcAIQfPBAAAuQgAMNAEAADjAQAQ0QQAALkIADDSBAEAoAcAIfkEAQCgBwAhlAYBAKAHACGVBgEAtQcAIRHPBAAAuggAMNAEAADNAQAQ0QQAALoIADDSBAEAoAcAIdoEQACjBwAh8wRAAKMHACH5BAEAoAcAIZYGAQCgBwAhlwYBAKAHACGYBgEAoAcAIZkGAQC1BwAhmgYBALUHACGbBgEAtQcAIZwGAQC1BwAhnQZAAKIHACGeBkAAogcAIZ8GAQC1BwAhEc8EAAC7CAAw0AQAALcBABDRBAAAuwgAMNIEAQCgBwAh0wQBAKAHACHUBAEAoAcAIdgEAAC9CKQGItoEQACjBwAh8gRAAKIHACHzBEAAowcAIZcFAAC-CKUGIoIGAQC1BwAhoAYBALUHACGiBgAAvAiiBiKlBiAAygcAIaYGIADKBwAhpwZAAKIHACEHDQAApQcAIEkAAMQIACBKAADECAAg2wQAAACiBgLcBAAAAKIGCN0EAAAAogYI4gQAAMMIogYiBw0AAKUHACBJAADCCAAgSgAAwggAINsEAAAApAYC3AQAAACkBgjdBAAAAKQGCOIEAADBCKQGIgcNAAClBwAgSQAAwAgAIEoAAMAIACDbBAAAAKUGAtwEAAAApQYI3QQAAAClBgjiBAAAvwilBiIHDQAApQcAIEkAAMAIACBKAADACAAg2wQAAAClBgLcBAAAAKUGCN0EAAAApQYI4gQAAL8IpQYiBNsEAAAApQYC3AQAAAClBgjdBAAAAKUGCOIEAADACKUGIgcNAAClBwAgSQAAwggAIEoAAMIIACDbBAAAAKQGAtwEAAAApAYI3QQAAACkBgjiBAAAwQikBiIE2wQAAACkBgLcBAAAAKQGCN0EAAAApAYI4gQAAMIIpAYiBw0AAKUHACBJAADECAAgSgAAxAgAINsEAAAAogYC3AQAAACiBgjdBAAAAKIGCOIEAADDCKIGIgTbBAAAAKIGAtwEAAAAogYI3QQAAACiBgjiBAAAxAiiBiIC-AQBAAAAAfkEAQAAAAENIgAArwgAIM8EAADGCAAw0AQAAJIBABDRBAAAxggAMNIEAQCvBwAh2gRAALIHACH4BAEArwcAIfkEAQCvBwAh-gQBAK8HACH7BAEArwcAIfwEAADfBwAg_QQCAOEHACH-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_gRAALIHACGRBQEAwwcAIZIFAQDDBwAhkwYBAK8HACEClgYBAAAAAZgGAQAAAAESIgAArwgAIM8EAADcCAAw0AQAAGIAENEEAADcCAAw0gQBAK8HACHaBEAAsgcAIfMEQACyBwAh-QQBAK8HACGWBgEArwcAIZcGAQCvBwAhmAYBAK8HACGZBgEAwwcAIZoGAQDDBwAhmwYBAMMHACGcBgEAwwcAIZ0GQACxBwAhngZAALEHACGfBgEAwwcAIRYGAADgCAAgIgAArwgAICMAALQIACDPBAAA3QgAMNAEAABXABDRBAAA3QgAMNIEAQCvBwAh2AQAAN4IpQUi2gRAALIHACHzBEAAsgcAIfkEAQCvBwAhkAUAAK0IACCXBQAA3geXBSKiBQEAwwcAIaMFAQDDBwAhpQUEAN8IACGmBQEArwcAIacFAQDDBwAhqAUBAMMHACGpBQEAwwcAIaoFQACxBwAhqwVAALEHACEE2wQAAAClBQLcBAAAAKUFCN0EAAAApQUI4gQAAOkHpQUiCNsEBAAAAAHcBAQAAAAE3QQEAAAABN4EBAAAAAHfBAQAAAAB4AQEAAAAAeEEBAAAAAHiBAQA5wcAIRYBAACvCAAgIAAAsggAICEAALMIACAjAAC0CAAgJAAA9QcAIM8EAACxCAAw0AQAAAMAENEEAACxCAAw0gQBAK8HACHTBAEArwcAIdoEQACyBwAh6QQBAK8HACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGLBgEAwwcAIYwGAQDDBwAhjQYBAMMHACGOBiAA4AcAIY8GAQCvBwAhtgYAAAMAILcGAAADACAC6QQBAAAAAaIFAQAAAAEXBgAA9AcAIAcAAK8IACAKAADlCAAgDwAA6AgAIB0AAOYIACAeAADnCAAgzwQAAOIIADDQBAAAUQAQ0QQAAOIIADDSBAEArwcAIdoEQACyBwAh6AQBAK8HACHpBAEArwcAIfIEQACxBwAh8wRAALIHACH3BAEArwcAIZQFAADjCO0FIqIFAQCvBwAh7gUAAOQI7gUi7wUCAOEHACHwBQIArggAIfEFAQCvBwAh8gUgAOAHACEE2wQAAADtBQLcBAAAAO0FCN0EAAAA7QUI4gQAAKYI7QUiBNsEAAAA7gUC3AQAAADuBQjdBAAAAO4FCOIEAACkCO4FIgsJAACeCAAgHAAAnwgAIM8EAACcCAAw0AQAAA8AENEEAACcCAAw0gQBAK8HACGUBQAAnQjrBSLPBQEArwcAIesFAQDDBwAhtgYAAA8AILcGAAAPACAD9AQAADwAIPUEAAA8ACD2BAAAPAAgA_QEAAALACD1BAAACwAg9gQAAAsAIAP0BAAAIgAg9QQAACIAIPYEAAAiACAQCAAA7QgAIBAAAOwIACDPBAAA6QgAMNAEAAAmABDRBAAA6QgAMNIEAQCvBwAh2AQAAOsIvQUi2gRAALIHACHzBEAAsgcAIbUFAQCvBwAhuAUBAK8HACG5BQIA4QcAIboFAgDhBwAhuwUIAOoIACG9BQIArggAIb4FQACxBwAhCNsECAAAAAHcBAgAAAAE3QQIAAAABN4ECAAAAAHfBAgAAAAB4AQIAAAAAeEECAAAAAHiBAgAuQcAIQTbBAAAAL0FAtwEAAAAvQUI3QQAAAC9BQjiBAAAgQi9BSIaCAAA7QgAIAsAAK8IACAOAACBCQAgDwAA6AgAIBEAAIIJACASAACDCQAgzwQAAP8IADDQBAAAHQAQ0QQAAP8IADDSBAEArwcAIdgEAACACdkFItoEQACyBwAh8wRAALIHACH-BEAAsgcAIZEFAQDDBwAhkgUBAMMHACG4BQEArwcAIdQFQACxBwAh1QUBAK8HACHWBQEAwwcAIdcFAgDhBwAh2QVAALEHACHaBUAAsQcAIdsFAgDhBwAhtgYAAB0AILcGAAAdACAlBAAAngkAIAUAALIIACAGAAD0BwAgBwAArwgAIAwAAPEIACAXAACfCQAgHgAA5wgAIB8AAI0JACDPBAAAnAkAMNAEAAAFABDRBAAAnAkAMNIEAQCvBwAh2AQAAJ0J-AUi2gRAALIHACHoBAEArwcAIekEAQCvBwAh7wRAALEHACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGiBQEArwcAIboFAgDhBwAh8QUBAK8HACHzBQEAwwcAIfQFAgDhBwAh9QUCAOEHACH2BQIA4QcAIfgFQACxBwAh-QVAALEHACH6BSAA4AcAIfsFIADgBwAh_AUgAOAHACH9BQIA4QcAIf4FIADgBwAh_wUBAMMHACG2BgAABQAgtwYAAAUAIALUBAEAAAABuAUBAAAAARAIAADtCAAgCwAA0AgAIAwAAPEIACDPBAAA7wgAMNAEAAAZABDRBAAA7wgAMNIEAQCvBwAh1AQBAK8HACHYBAAA8AjdBSL-BEAAsQcAIbgFAQCvBwAh1QUBAMMHACHdBQEArwcAId4FQACyBwAh3wVAALEHACHgBUAAsQcAIQTbBAAAAN0FAtwEAAAA3QUI3QQAAADdBQjiBAAAlAjdBSID9AQAAB0AIPUEAAAdACD2BAAAHQAgDgkAAJ4IACAXAADzCAAgzwQAAPIIADDQBAAAPAAQ0QQAAPIIADDSBAEArwcAIdoEQACyBwAhwwUBAK8HACHGBQIA4QcAIc8FAQCvBwAh4wUBAMMHACHkBSAA4AcAIeUFAgCuCAAh5gUCAK4IACED9AQAADIAIPUEAAAyACD2BAAAMgAgAr8FAQAAAAHABQEAAAABEBQAANUIACAYAAD2CAAgzwQAAPUIADDQBAAAMgAQ0QQAAPUIADDSBAEArwcAIdoEQACyBwAhvwUBAK8HACHABQEArwcAIcEFIADgBwAhwgUBAMMHACHDBQEAwwcAIcQFAgCuCAAhxQUCAK4IACHGBQIA4QcAIccFAQDDBwAhEAkAAJ4IACAXAADzCAAgzwQAAPIIADDQBAAAPAAQ0QQAAPIIADDSBAEArwcAIdoEQACyBwAhwwUBAK8HACHGBQIA4QcAIc8FAQCvBwAh4wUBAMMHACHkBSAA4AcAIeUFAgCuCAAh5gUCAK4IACG2BgAAPAAgtwYAADwAIAkQAADsCAAgzwQAAPcIADDQBAAAKAAQ0QQAAPcIADDSBAEArwcAIZAFAACtCAAgmQUAAPgItwUitQUBAK8HACG3BUAAsgcAIQTbBAAAALcFAtwEAAAAtwUI3QQAAAC3BQjiBAAA-Qe3BSICtQUBAAAAAc8FAQAAAAESCQAAnggAIBAAAOwIACATAAD8CAAgFgAA_QgAIBkAAPMIACDPBAAA-ggAMNAEAAAiABDRBAAA-ggAMNIEAQCvBwAh2AQAAPsI1AUi2gRAALIHACHzBEAAsgcAIbUFAQCvBwAhzwUBAK8HACHQBQEAwwcAIdEFAQDDBwAh0gUBAMMHACHUBUAAsQcAIQTbBAAAANQFAtwEAAAA1AUI3QQAAADUBQjiBAAAjAjUBSID9AQAABUAIPUEAAAVACD2BAAAFQAgExQAANUIACAVAADQCAAgzwQAANMIADDQBAAALwAQ0QQAANMIADDSBAEArwcAIdgEAADUCM0FItoEQACyBwAh8wRAALIHACGQBQAArQgAIL4FQACxBwAhvwUBAK8HACHIBQEAwwcAIckFAgDhBwAhygUCAOEHACHLBQEAwwcAIc0FIADgBwAhtgYAAC8AILcGAAAvACADuAUBAAAAAdUFAQAAAAHXBQIAAAABGAgAAO0IACALAACvCAAgDgAAgQkAIA8AAOgIACARAACCCQAgEgAAgwkAIM8EAAD_CAAw0AQAAB0AENEEAAD_CAAw0gQBAK8HACHYBAAAgAnZBSLaBEAAsgcAIfMEQACyBwAh_gRAALIHACGRBQEAwwcAIZIFAQDDBwAhuAUBAK8HACHUBUAAsQcAIdUFAQCvBwAh1gUBAMMHACHXBQIA4QcAIdkFQACxBwAh2gVAALEHACHbBQIA4QcAIQTbBAAAANkFAtwEAAAA2QUI3QQAAADZBQjiBAAAkAjZBSISCAAA7QgAIAsAANAIACAMAADxCAAgzwQAAO8IADDQBAAAGQAQ0QQAAO8IADDSBAEArwcAIdQEAQCvBwAh2AQAAPAI3QUi_gRAALEHACG4BQEArwcAIdUFAQDDBwAh3QUBAK8HACHeBUAAsgcAId8FQACxBwAh4AVAALEHACG2BgAAGQAgtwYAABkAIBIIAADtCAAgEAAA7AgAIM8EAADpCAAw0AQAACYAENEEAADpCAAw0gQBAK8HACHYBAAA6wi9BSLaBEAAsgcAIfMEQACyBwAhtQUBAK8HACG4BQEArwcAIbkFAgDhBwAhugUCAOEHACG7BQgA6ggAIb0FAgCuCAAhvgVAALEHACG2BgAAJgAgtwYAACYAIAP0BAAAKAAg9QQAACgAIPYEAAAoACAhBgAA4AgAIAwAAPEIACAfAACNCQAgJAAA9QcAICUAAIgJACAmAACJCQAgJwAAigkAICgAAIsJACApAACMCQAgKgAAsggAICsAALMIACAsAACOCQAgLQAAjwkAIC4AAJAJACA1AADEBwAgNgAAkQkAIM8EAACECQAw0AQAABsAENEEAACECQAw0gQBAK8HACHTBAEArwcAIdQEAQCvBwAh2AQAAIYJpAYi2gRAALIHACHyBEAAsQcAIfMEQACyBwAhlwUAAIcJpQYiggYBAMMHACGgBgEAwwcAIaIGAACFCaIGIqUGIADgBwAhpgYgAOAHACGnBkAAsQcAIQTbBAAAAKIGAtwEAAAAogYI3QQAAACiBgjiBAAAxAiiBiIE2wQAAACkBgLcBAAAAKQGCN0EAAAApAYI4gQAAMIIpAYiBNsEAAAApQYC3AQAAAClBgjdBAAAAKUGCOIEAADACKUGIgP0BAAAYgAg9QQAAGIAIPYEAABiACAD9AQAAGYAIPUEAABmACD2BAAAZgAgA_QEAABqACD1BAAAagAg9gQAAGoAIAP0BAAAbgAg9QQAAG4AIPYEAABuACAWIgAArwgAIM8EAACsCAAw0AQAAHIAENEEAACsCAAw0gQBAK8HACHaBEAAsgcAIfIEQACxBwAh8wRAALIHACH5BAEArwcAIYAGAQDDBwAhgQYBAMMHACGCBgEAwwcAIYMGAQDDBwAhhAYBAMMHACGFBgEAwwcAIYYGAQDDBwAhhwYBAMMHACGIBgAArQgAIIkGAgCuCAAhigYgAOAHACG2BgAAcgAgtwYAAHIAIAP0BAAAGQAg9QQAABkAIPYEAAAZACAD9AQAAC8AIPUEAAAvACD2BAAALwAgA_QEAAB8ACD1BAAAfAAg9gQAAHwAIAP0BAAAgAEAIPUEAACAAQAg9gQAAIABACAD9AQAAJIBACD1BAAAkgEAIPYEAACSAQAgAr8FAQAAAAHOBQEAAAABCRQAANUIACAaAACUCQAgzwQAAJMJADDQBAAAFQAQ0QQAAJMJADDSBAEArwcAIdoEQACyBwAhvwUBAK8HACHOBQEArwcAIQwKAACXCQAgGwAA_AgAIM8EAACWCQAw0AQAABEAENEEAACWCQAw0gQBAK8HACHhBQIA4QcAIecFAQCvBwAh6AUBAK8HACHpBSAA4AcAIbYGAAARACC3BgAAEQAgAuEFAgAAAAHnBQEAAAABCgoAAJcJACAbAAD8CAAgzwQAAJYJADDQBAAAEQAQ0QQAAJYJADDSBAEArwcAIeEFAgDhBwAh5wUBAK8HACHoBQEArwcAIekFIADgBwAhCwkAAJ4IACAcAACfCAAgzwQAAJwIADDQBAAADwAQ0QQAAJwIADDSBAEArwcAIZQFAACdCOsFIs8FAQCvBwAh6wUBAMMHACG2BgAADwAgtwYAAA8AIAK4BQEAAAABzwUBAAAAAQK4BQEAAAAB4QUCAAAAAQsIAADtCAAgCQAAnggAIM8EAACaCQAw0AQAAAsAENEEAACaCQAw0gQBAK8HACHaBEAAsgcAIbgFAQCvBwAhzwUBAK8HACHhBQIA4QcAIeIFAgDhBwAhA-kEAQAAAAGiBQEAAAAB_QUCAAAAASMEAACeCQAgBQAAsggAIAYAAPQHACAHAACvCAAgDAAA8QgAIBcAAJ8JACAeAADnCAAgHwAAjQkAIM8EAACcCQAw0AQAAAUAENEEAACcCQAw0gQBAK8HACHYBAAAnQn4BSLaBEAAsgcAIegEAQCvBwAh6QQBAK8HACHvBEAAsQcAIfIEQACxBwAh8wRAALIHACH3BAEAwwcAIaIFAQCvBwAhugUCAOEHACHxBQEArwcAIfMFAQDDBwAh9AUCAOEHACH1BQIA4QcAIfYFAgDhBwAh-AVAALEHACH5BUAAsQcAIfoFIADgBwAh-wUgAOAHACH8BSAA4AcAIf0FAgDhBwAh_gUgAOAHACH_BQEAwwcAIQTbBAAAAPgFAtwEAAAA-AUI3QQAAAD4BQjiBAAAqgj4BSIlBAAAngkAIAUAALIIACAGAAD0BwAgBwAArwgAIAwAAPEIACAXAACfCQAgHgAA5wgAIB8AAI0JACDPBAAAnAkAMNAEAAAFABDRBAAAnAkAMNIEAQCvBwAh2AQAAJ0J-AUi2gRAALIHACHoBAEArwcAIekEAQCvBwAh7wRAALEHACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGiBQEArwcAIboFAgDhBwAh8QUBAK8HACHzBQEAwwcAIfQFAgDhBwAh9QUCAOEHACH2BQIA4QcAIfgFQACxBwAh-QVAALEHACH6BSAA4AcAIfsFIADgBwAh_AUgAOAHACH9BQIA4QcAIf4FIADgBwAh_wUBAMMHACG2BgAABQAgtwYAAAUAIAP0BAAAJgAg9QQAACYAIPYEAAAmACAAAAAAAbsGAQAAAAEBuwYAAADYBAIBuwZAAAAAAQG7BkAAAAABAAAABUMAALcRACBEAAC9EQAguAYAALgRACC5BgAAvBEAIL4GAACHAQAgBUMAALURACBEAAC6EQAguAYAALYRACC5BgAAuREAIL4GAADBBgAgA0MAALcRACC4BgAAuBEAIL4GAACHAQAgA0MAALURACC4BgAAthEAIL4GAADBBgAgAAAAAAABuwYBAAAAAQG7BgAAAO4EAgW7BgIAAAABwQYCAAAAAcIGAgAAAAHDBgIAAAABxAYCAAAAAQVDAACsEQAgRAAAsxEAILgGAACtEQAguQYAALIRACC-BgAAAQAgBUMAAKoRACBEAACwEQAguAYAAKsRACC5BgAArxEAIL4GAACoBgAgC0MAALoJADBEAAC_CQAwuAYAALsJADC5BgAAvAkAMLoGAAC9CQAguwYAAL4JADC8BgAAvgkAML0GAAC-CQAwvgYAAL4JADC_BgAAwAkAMMAGAADBCQAwAjMAAK4JACDnBAEAAAABAgAAAI0BACBDAADFCQAgAwAAAI0BACBDAADFCQAgRAAAxAkAIAE8AACuEQAwCDIAAMkIACAzAADKCAAgzwQAAMgIADDQBAAAiwEAENEEAADICAAw5gQBAK8HACHnBAEArwcAIakGAADHCAAgAgAAAI0BACA8AADECQAgAgAAAMIJACA8AADDCQAgBc8EAADBCQAw0AQAAMIJABDRBAAAwQkAMOYEAQCvBwAh5wQBAK8HACEFzwQAAMEJADDQBAAAwgkAENEEAADBCQAw5gQBAK8HACHnBAEArwcAIQHnBAEApAkAIQIzAACsCQAg5wQBAKQJACECMwAArgkAIOcEAQAAAAEDQwAArBEAILgGAACtEQAgvgYAAAEAIANDAACqEQAguAYAAKsRACC-BgAAqAYAIARDAAC6CQAwuAYAALsJADC6BgAAvQkAIL4GAAC-CQAwAAAAC0MAAM0JADBEAADRCQAwuAYAAM4JADC5BgAAzwkAMLoGAADQCQAguwYAAL4JADC8BgAAvgkAML0GAAC-CQAwvgYAAL4JADC_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_xAAIEQAAIMRACC4BgAAgBEAILkGAACCEQAgvgYAAJUCACALQwAAngoAMEQAAKMKADC4BgAAnwoAMLkGAACgCgAwugYAAKEKACC7BgAAogoAMLwGAACiCgAwvQYAAKIKADC-BgAAogoAML8GAACkCgAwwAYAAKUKADARBgAAlQoAICIAAJQKACDSBAEAAAAB2AQAAAClBQLaBEAAAAAB8wRAAAAAAfkEAQAAAAGQBYAAAAABlwUAAACXBQKiBQEAAAABpQUEAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBUAAAAABqwVAAAAAAQIAAABZACBDAACpCgAgAwAAAFkAIEMAAKkKACBEAACoCgAgATwAAIERADAWBgAA4AgAICIAAK8IACAjAAC0CAAgzwQAAN0IADDQBAAAVwAQ0QQAAN0IADDSBAEAAAAB2AQAAN4IpQUi2gRAALIHACHzBEAAsgcAIfkEAQCvBwAhkAUAAK0IACCXBQAA3geXBSKiBQEAwwcAIaMFAQDDBwAhpQUEAN8IACGmBQEArwcAIacFAQAAAAGoBQEAAAABqQUBAAAAAaoFQACxBwAhqwVAALEHACECAAAAWQAgPAAAqAoAIAIAAACmCgAgPAAApwoAIBPPBAAApQoAMNAEAACmCgAQ0QQAAKUKADDSBAEArwcAIdgEAADeCKUFItoEQACyBwAh8wRAALIHACH5BAEArwcAIZAFAACtCAAglwUAAN4HlwUiogUBAMMHACGjBQEAwwcAIaUFBADfCAAhpgUBAK8HACGnBQEAwwcAIagFAQDDBwAhqQUBAMMHACGqBUAAsQcAIasFQACxBwAhE88EAAClCgAw0AQAAKYKABDRBAAApQoAMNIEAQCvBwAh2AQAAN4IpQUi2gRAALIHACHzBEAAsgcAIfkEAQCvBwAhkAUAAK0IACCXBQAA3geXBSKiBQEAwwcAIaMFAQDDBwAhpQUEAN8IACGmBQEArwcAIacFAQDDBwAhqAUBAMMHACGpBQEAwwcAIaoFQACxBwAhqwVAALEHACEP0gQBAKQJACHYBAAAjwqlBSLaBEAApwkAIfMEQACnCQAh-QQBAKQJACGQBYAAAAABlwUAAIkKlwUiogUBALQJACGlBQQAkAoAIaYFAQCkCQAhpwUBALQJACGoBQEAtAkAIakFAQC0CQAhqgVAAKYJACGrBUAApgkAIREGAACSCgAgIgAAkQoAINIEAQCkCQAh2AQAAI8KpQUi2gRAAKcJACHzBEAApwkAIfkEAQCkCQAhkAWAAAAAAZcFAACJCpcFIqIFAQC0CQAhpQUEAJAKACGmBQEApAkAIacFAQC0CQAhqAUBALQJACGpBQEAtAkAIaoFQACmCQAhqwVAAKYJACERBgAAlQoAICIAAJQKACDSBAEAAAAB2AQAAAClBQLaBEAAAAAB8wRAAAAAAfkEAQAAAAGQBYAAAAABlwUAAACXBQKiBQEAAAABpQUEAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBUAAAAABqwVAAAAAAQNDAAD_EAAguAYAAIARACC-BgAAlQIAIARDAACeCgAwuAYAAJ8KADC6BgAAoQoAIL4GAACiCgAwCgEAAJkNACAgAADKDQAgIQAAyw0AICMAAMwNACAkAACtCgAg8gQAAKAJACD3BAAAoAkAIIsGAACgCQAgjAYAAKAJACCNBgAAoAkAIAAAAAABuwYAAAC3BQIFQwAA-hAAIEQAAP0QACC4BgAA-xAAILkGAAD8EAAgvgYAAB8AIANDAAD6EAAguAYAAPsQACC-BgAAHwAgAAAAAAAFuwYIAAAAAcEGCAAAAAHCBggAAAABwwYIAAAAAcQGCAAAAAEBuwYAAAC9BQIFuwYCAAAAAcEGAgAAAAHCBgIAAAABwwYCAAAAAcQGAgAAAAEFQwAA8hAAIEQAAPgQACC4BgAA8xAAILkGAAD3EAAgvgYAAB8AIAVDAADwEAAgRAAA9RAAILgGAADxEAAguQYAAPQQACC-BgAABwAgA0MAAPIQACC4BgAA8xAAIL4GAAAfACADQwAA8BAAILgGAADxEAAgvgYAAAcAIAAAAAAABUMAAOgQACBEAADuEAAguAYAAOkQACC5BgAA7RAAIL4GAAAkACAFQwAA5hAAIEQAAOsQACC4BgAA5xAAILkGAADqEAAgvgYAAD4AIANDAADoEAAguAYAAOkQACC-BgAAJAAgA0MAAOYQACC4BgAA5xAAIL4GAAA-ACAAAAAAAAG7BgAAAM0FAgVDAADeEAAgRAAA5BAAILgGAADfEAAguQYAAOMQACC-BgAAJAAgB0MAANwQACBEAADhEAAguAYAAN0QACC5BgAA4BAAILwGAAAbACC9BgAAGwAgvgYAAAEAIANDAADeEAAguAYAAN8QACC-BgAAJAAgA0MAANwQACC4BgAA3RAAIL4GAAABACAAAAAFQwAA1BAAIEQAANoQACC4BgAA1RAAILkGAADZEAAgvgYAACQAIAVDAADSEAAgRAAA1xAAILgGAADTEAAguQYAANYQACC-BgAAEwAgA0MAANQQACC4BgAA1RAAIL4GAAAkACADQwAA0hAAILgGAADTEAAgvgYAABMAIAAAAAG7BgAAANQFAgVDAADIEAAgRAAA0BAAILgGAADJEAAguQYAAM8QACC-BgAAHwAgBUMAAMYQACBEAADNEAAguAYAAMcQACC5BgAAzBAAIL4GAABTACALQwAA9AoAMEQAAPkKADC4BgAA9QoAMLkGAAD2CgAwugYAAPcKACC7BgAA-AoAMLwGAAD4CgAwvQYAAPgKADC-BgAA-AoAML8GAAD6CgAwwAYAAPsKADAHQwAA7woAIEQAAPIKACC4BgAA8AoAILkGAADxCgAgvAYAAC8AIL0GAAAvACC-BgAAeQAgC0MAAOMKADBEAADoCgAwuAYAAOQKADC5BgAA5QoAMLoGAADmCgAguwYAAOcKADC8BgAA5woAML0GAADnCgAwvgYAAOcKADC_BgAA6QoAMMAGAADqCgAwCxgAAMgKACDSBAEAAAAB2gRAAAAAAcAFAQAAAAHBBSAAAAABwgUBAAAAAcMFAQAAAAHEBQIAAAABxQUCAAAAAcYFAgAAAAHHBQEAAAABAgAAADQAIEMAAO4KACADAAAANAAgQwAA7goAIEQAAO0KACABPAAAyxAAMBEUAADVCAAgGAAA9ggAIM8EAAD1CAAw0AQAADIAENEEAAD1CAAw0gQBAAAAAdoEQACyBwAhvwUBAK8HACHABQEArwcAIcEFIADgBwAhwgUBAMMHACHDBQEAwwcAIcQFAgCuCAAhxQUCAK4IACHGBQIA4QcAIccFAQDDBwAhrgYAAPQIACACAAAANAAgPAAA7QoAIAIAAADrCgAgPAAA7AoAIA7PBAAA6goAMNAEAADrCgAQ0QQAAOoKADDSBAEArwcAIdoEQACyBwAhvwUBAK8HACHABQEArwcAIcEFIADgBwAhwgUBAMMHACHDBQEAwwcAIcQFAgCuCAAhxQUCAK4IACHGBQIA4QcAIccFAQDDBwAhDs8EAADqCgAw0AQAAOsKABDRBAAA6goAMNIEAQCvBwAh2gRAALIHACG_BQEArwcAIcAFAQCvBwAhwQUgAOAHACHCBQEAwwcAIcMFAQDDBwAhxAUCAK4IACHFBQIArggAIcYFAgDhBwAhxwUBAMMHACEK0gQBAKQJACHaBEAApwkAIcAFAQCkCQAhwQUgAPUJACHCBQEAtAkAIcMFAQC0CQAhxAUCALsKACHFBQIAuwoAIcYFAgC2CQAhxwUBALQJACELGAAAxgoAINIEAQCkCQAh2gRAAKcJACHABQEApAkAIcEFIAD1CQAhwgUBALQJACHDBQEAtAkAIcQFAgC7CgAhxQUCALsKACHGBQIAtgkAIccFAQC0CQAhCxgAAMgKACDSBAEAAAAB2gRAAAAAAcAFAQAAAAHBBSAAAAABwgUBAAAAAcMFAQAAAAHEBQIAAAABxQUCAAAAAcYFAgAAAAHHBQEAAAABDBUAANIKACDSBAEAAAAB2AQAAADNBQLaBEAAAAAB8wRAAAAAAZAFgAAAAAG-BUAAAAAByAUBAAAAAckFAgAAAAHKBQIAAAABywUBAAAAAc0FIAAAAAECAAAAeQAgQwAA7woAIAMAAAAvACBDAADvCgAgRAAA8woAIA4AAAAvACAVAADQCgAgPAAA8woAINIEAQCkCQAh2AQAAM4KzQUi2gRAAKcJACHzBEAApwkAIZAFgAAAAAG-BUAApgkAIcgFAQC0CQAhyQUCALYJACHKBQIAtgkAIcsFAQC0CQAhzQUgAPUJACEMFQAA0AoAINIEAQCkCQAh2AQAAM4KzQUi2gRAAKcJACHzBEAApwkAIZAFgAAAAAG-BUAApgkAIcgFAQC0CQAhyQUCALYJACHKBQIAtgkAIcsFAQC0CQAhzQUgAPUJACEEGgAA2QoAINIEAQAAAAHaBEAAAAABzgUBAAAAAQIAAAAXACBDAAD_CgAgAwAAABcAIEMAAP8KACBEAAD-CgAgATwAAMoQADAKFAAA1QgAIBoAAJQJACDPBAAAkwkAMNAEAAAVABDRBAAAkwkAMNIEAQAAAAHaBEAAsgcAIb8FAQCvBwAhzgUBAK8HACGxBgAAkgkAIAIAAAAXACA8AAD-CgAgAgAAAPwKACA8AAD9CgAgB88EAAD7CgAw0AQAAPwKABDRBAAA-woAMNIEAQCvBwAh2gRAALIHACG_BQEArwcAIc4FAQCvBwAhB88EAAD7CgAw0AQAAPwKABDRBAAA-woAMNIEAQCvBwAh2gRAALIHACG_BQEArwcAIc4FAQCvBwAhA9IEAQCkCQAh2gRAAKcJACHOBQEApAkAIQQaAADXCgAg0gQBAKQJACHaBEAApwkAIc4FAQCkCQAhBBoAANkKACDSBAEAAAAB2gRAAAAAAc4FAQAAAAEDQwAAyBAAILgGAADJEAAgvgYAAB8AIANDAADGEAAguAYAAMcQACC-BgAAUwAgBEMAAPQKADC4BgAA9QoAMLoGAAD3CgAgvgYAAPgKADADQwAA7woAILgGAADwCgAgvgYAAHkAIARDAADjCgAwuAYAAOQKADC6BgAA5goAIL4GAADnCgAwAAAAAAABuwYAAADZBQIFQwAAuRAAIEQAAMQQACC4BgAAuhAAILkGAADDEAAgvgYAAAcAIAVDAAC3EAAgRAAAwRAAILgGAAC4EAAguQYAAMAQACC-BgAAAQAgB0MAALUQACBEAAC-EAAguAYAALYQACC5BgAAvRAAILwGAAAZACC9BgAAGQAgvgYAAEYAIAtDAACiCwAwRAAApwsAMLgGAACjCwAwuQYAAKQLADC6BgAApQsAILsGAACmCwAwvAYAAKYLADC9BgAApgsAML4GAACmCwAwvwYAAKgLADDABgAAqQsAMAdDAACdCwAgRAAAoAsAILgGAACeCwAguQYAAJ8LACC8BgAAJgAgvQYAACYAIL4GAABKACALQwAAkQsAMEQAAJYLADC4BgAAkgsAMLkGAACTCwAwugYAAJQLACC7BgAAlQsAMLwGAACVCwAwvQYAAJULADC-BgAAlQsAML8GAACXCwAwwAYAAJgLADAE0gQBAAAAAZAFgAAAAAGZBQAAALcFArcFQAAAAAECAAAAKgAgQwAAnAsAIAMAAAAqACBDAACcCwAgRAAAmwsAIAE8AAC8EAAwCRAAAOwIACDPBAAA9wgAMNAEAAAoABDRBAAA9wgAMNIEAQAAAAGQBQAArQgAIJkFAAD4CLcFIrUFAQCvBwAhtwVAALIHACECAAAAKgAgPAAAmwsAIAIAAACZCwAgPAAAmgsAIAjPBAAAmAsAMNAEAACZCwAQ0QQAAJgLADDSBAEArwcAIZAFAACtCAAgmQUAAPgItwUitQUBAK8HACG3BUAAsgcAIQjPBAAAmAsAMNAEAACZCwAQ0QQAAJgLADDSBAEArwcAIZAFAACtCAAgmQUAAPgItwUitQUBAK8HACG3BUAAsgcAIQTSBAEApAkAIZAFgAAAAAGZBQAAsQq3BSK3BUAApwkAIQTSBAEApAkAIZAFgAAAAAGZBQAAsQq3BSK3BUAApwkAIQTSBAEAAAABkAWAAAAAAZkFAAAAtwUCtwVAAAAAAQsIAAC_CgAg0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG4BQEAAAABuQUCAAAAAboFAgAAAAG7BQgAAAABvQUCAAAAAb4FQAAAAAECAAAASgAgQwAAnQsAIAMAAAAmACBDAACdCwAgRAAAoQsAIA0AAAAmACAIAAC9CgAgPAAAoQsAINIEAQCkCQAh2AQAALoKvQUi2gRAAKcJACHzBEAApwkAIbgFAQCkCQAhuQUCALYJACG6BQIAtgkAIbsFCAC5CgAhvQUCALsKACG-BUAApgkAIQsIAAC9CgAg0gQBAKQJACHYBAAAugq9BSLaBEAApwkAIfMEQACnCQAhuAUBAKQJACG5BQIAtgkAIboFAgC2CQAhuwUIALkKACG9BQIAuwoAIb4FQACmCQAhDQkAAIELACATAACCCwAgFgAAgwsAIBkAAIQLACDSBAEAAAAB2AQAAADUBQLaBEAAAAAB8wRAAAAAAc8FAQAAAAHQBQEAAAAB0QUBAAAAAdIFAQAAAAHUBUAAAAABAgAAACQAIEMAAK0LACADAAAAJAAgQwAArQsAIEQAAKwLACABPAAAuxAAMBMJAACeCAAgEAAA7AgAIBMAAPwIACAWAAD9CAAgGQAA8wgAIM8EAAD6CAAw0AQAACIAENEEAAD6CAAw0gQBAAAAAdgEAAD7CNQFItoEQACyBwAh8wRAALIHACG1BQEArwcAIc8FAQCvBwAh0AUBAMMHACHRBQEAwwcAIdIFAQDDBwAh1AVAALEHACGvBgAA-QgAIAIAAAAkACA8AACsCwAgAgAAAKoLACA8AACrCwAgDc8EAACpCwAw0AQAAKoLABDRBAAAqQsAMNIEAQCvBwAh2AQAAPsI1AUi2gRAALIHACHzBEAAsgcAIbUFAQCvBwAhzwUBAK8HACHQBQEAwwcAIdEFAQDDBwAh0gUBAMMHACHUBUAAsQcAIQ3PBAAAqQsAMNAEAACqCwAQ0QQAAKkLADDSBAEArwcAIdgEAAD7CNQFItoEQACyBwAh8wRAALIHACG1BQEArwcAIc8FAQCvBwAh0AUBAMMHACHRBQEAwwcAIdIFAQDDBwAh1AVAALEHACEJ0gQBAKQJACHYBAAA3QrUBSLaBEAApwkAIfMEQACnCQAhzwUBAKQJACHQBQEAtAkAIdEFAQC0CQAh0gUBALQJACHUBUAApgkAIQ0JAADfCgAgEwAA4AoAIBYAAOEKACAZAADiCgAg0gQBAKQJACHYBAAA3QrUBSLaBEAApwkAIfMEQACnCQAhzwUBAKQJACHQBQEAtAkAIdEFAQC0CQAh0gUBALQJACHUBUAApgkAIQ0JAACBCwAgEwAAggsAIBYAAIMLACAZAACECwAg0gQBAAAAAdgEAAAA1AUC2gRAAAAAAfMEQAAAAAHPBQEAAAAB0AUBAAAAAdEFAQAAAAHSBQEAAAAB1AVAAAAAAQNDAAC5EAAguAYAALoQACC-BgAABwAgA0MAALcQACC4BgAAuBAAIL4GAAABACADQwAAtRAAILgGAAC2EAAgvgYAAEYAIARDAACiCwAwuAYAAKMLADC6BgAApQsAIL4GAACmCwAwA0MAAJ0LACC4BgAAngsAIL4GAABKACAEQwAAkQsAMLgGAACSCwAwugYAAJQLACC-BgAAlQsAMAAAAAG7BgAAAN0FAgVDAACsEAAgRAAAsxAAILgGAACtEAAguQYAALIQACC-BgAABwAgB0MAAKoQACBEAACwEAAguAYAAKsQACC5BgAArxAAILwGAAAbACC9BgAAGwAgvgYAAAEAIAtDAAC7CwAwRAAAwAsAMLgGAAC8CwAwuQYAAL0LADC6BgAAvgsAILsGAAC_CwAwvAYAAL8LADC9BgAAvwsAML4GAAC_CwAwvwYAAMELADDABgAAwgsAMBMIAACuCwAgCwAArwsAIA8AALELACARAACyCwAgEgAAswsAINIEAQAAAAHYBAAAANkFAtoEQAAAAAHzBEAAAAAB_gRAAAAAAZEFAQAAAAGSBQEAAAABuAUBAAAAAdQFQAAAAAHVBQEAAAAB1wUCAAAAAdkFQAAAAAHaBUAAAAAB2wUCAAAAAQIAAAAfACBDAADGCwAgAwAAAB8AIEMAAMYLACBEAADFCwAgATwAAK4QADAZCAAA7QgAIAsAAK8IACAOAACBCQAgDwAA6AgAIBEAAIIJACASAACDCQAgzwQAAP8IADDQBAAAHQAQ0QQAAP8IADDSBAEAAAAB2AQAAIAJ2QUi2gRAALIHACHzBEAAsgcAIf4EQACyBwAhkQUBAMMHACGSBQEAwwcAIbgFAQCvBwAh1AVAALEHACHVBQEArwcAIdYFAQDDBwAh1wUCAOEHACHZBUAAsQcAIdoFQACxBwAh2wUCAOEHACGwBgAA_ggAIAIAAAAfACA8AADFCwAgAgAAAMMLACA8AADECwAgEs8EAADCCwAw0AQAAMMLABDRBAAAwgsAMNIEAQCvBwAh2AQAAIAJ2QUi2gRAALIHACHzBEAAsgcAIf4EQACyBwAhkQUBAMMHACGSBQEAwwcAIbgFAQCvBwAh1AVAALEHACHVBQEArwcAIdYFAQDDBwAh1wUCAOEHACHZBUAAsQcAIdoFQACxBwAh2wUCAOEHACESzwQAAMILADDQBAAAwwsAENEEAADCCwAw0gQBAK8HACHYBAAAgAnZBSLaBEAAsgcAIfMEQACyBwAh_gRAALIHACGRBQEAwwcAIZIFAQDDBwAhuAUBAK8HACHUBUAAsQcAIdUFAQCvBwAh1gUBAMMHACHXBQIA4QcAIdkFQACxBwAh2gVAALEHACHbBQIA4QcAIQ7SBAEApAkAIdgEAACKC9kFItoEQACnCQAh8wRAAKcJACH-BEAApwkAIZEFAQC0CQAhkgUBALQJACG4BQEApAkAIdQFQACmCQAh1QUBAKQJACHXBQIAtgkAIdkFQACmCQAh2gVAAKYJACHbBQIAtgkAIRMIAACLCwAgCwAAjAsAIA8AAI4LACARAACPCwAgEgAAkAsAINIEAQCkCQAh2AQAAIoL2QUi2gRAAKcJACHzBEAApwkAIf4EQACnCQAhkQUBALQJACGSBQEAtAkAIbgFAQCkCQAh1AVAAKYJACHVBQEApAkAIdcFAgC2CQAh2QVAAKYJACHaBUAApgkAIdsFAgC2CQAhEwgAAK4LACALAACvCwAgDwAAsQsAIBEAALILACASAACzCwAg0gQBAAAAAdgEAAAA2QUC2gRAAAAAAfMEQAAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAG4BQEAAAAB1AVAAAAAAdUFAQAAAAHXBQIAAAAB2QVAAAAAAdoFQAAAAAHbBQIAAAABA0MAAKwQACC4BgAArRAAIL4GAAAHACADQwAAqhAAILgGAACrEAAgvgYAAAEAIARDAAC7CwAwuAYAALwLADC6BgAAvgsAIL4GAAC_CwAwAAAAAAAFQwAAohAAIEQAAKgQACC4BgAAoxAAILkGAACnEAAgvgYAAAcAIAVDAACgEAAgRAAApRAAILgGAAChEAAguQYAAKQQACC-BgAAUwAgA0MAAKIQACC4BgAAoxAAIL4GAAAHACADQwAAoBAAILgGAAChEAAgvgYAAFMAIAAAAAAABUMAAJoQACBEAACeEAAguAYAAJsQACC5BgAAnRAAIL4GAABTACALQwAA2gsAMEQAAN4LADC4BgAA2wsAMLkGAADcCwAwugYAAN0LACC7BgAA5woAMLwGAADnCgAwvQYAAOcKADC-BgAA5woAML8GAADfCwAwwAYAAOoKADALFAAAxwoAINIEAQAAAAHaBEAAAAABvwUBAAAAAcEFIAAAAAHCBQEAAAABwwUBAAAAAcQFAgAAAAHFBQIAAAABxgUCAAAAAccFAQAAAAECAAAANAAgQwAA4gsAIAMAAAA0ACBDAADiCwAgRAAA4QsAIAE8AACcEAAwAgAAADQAIDwAAOELACACAAAA6woAIDwAAOALACAK0gQBAKQJACHaBEAApwkAIb8FAQCkCQAhwQUgAPUJACHCBQEAtAkAIcMFAQC0CQAhxAUCALsKACHFBQIAuwoAIcYFAgC2CQAhxwUBALQJACELFAAAxQoAINIEAQCkCQAh2gRAAKcJACG_BQEApAkAIcEFIAD1CQAhwgUBALQJACHDBQEAtAkAIcQFAgC7CgAhxQUCALsKACHGBQIAtgkAIccFAQC0CQAhCxQAAMcKACDSBAEAAAAB2gRAAAAAAb8FAQAAAAHBBSAAAAABwgUBAAAAAcMFAQAAAAHEBQIAAAABxQUCAAAAAcYFAgAAAAHHBQEAAAABA0MAAJoQACC4BgAAmxAAIL4GAABTACAEQwAA2gsAMLgGAADbCwAwugYAAN0LACC-BgAA5woAMAAAAAAABUMAAJQQACBEAACYEAAguAYAAJUQACC5BgAAlxAAIL4GAADzAgAgC0MAAOwLADBEAADwCwAwuAYAAO0LADC5BgAA7gsAMLoGAADvCwAguwYAAPgKADC8BgAA-AoAML0GAAD4CgAwvgYAAPgKADC_BgAA8QsAMMAGAAD7CgAwBBQAANgKACDSBAEAAAAB2gRAAAAAAb8FAQAAAAECAAAAFwAgQwAA9AsAIAMAAAAXACBDAAD0CwAgRAAA8wsAIAE8AACWEAAwAgAAABcAIDwAAPMLACACAAAA_AoAIDwAAPILACAD0gQBAKQJACHaBEAApwkAIb8FAQCkCQAhBBQAANYKACDSBAEApAkAIdoEQACnCQAhvwUBAKQJACEEFAAA2AoAINIEAQAAAAHaBEAAAAABvwUBAAAAAQNDAACUEAAguAYAAJUQACC-BgAA8wIAIARDAADsCwAwuAYAAO0LADC6BgAA7wsAIL4GAAD4CgAwAAAAAbsGAAAA6wUCBUMAAI4QACBEAACSEAAguAYAAI8QACC5BgAAkRAAIL4GAABTACALQwAA_QsAMEQAAIIMADC4BgAA_gsAMLkGAAD_CwAwugYAAIAMACC7BgAAgQwAMLwGAACBDAAwvQYAAIEMADC-BgAAgQwAML8GAACDDAAwwAYAAIQMADAFGwAA9gsAINIEAQAAAAHhBQIAAAAB6AUBAAAAAekFIAAAAAECAAAAEwAgQwAAiAwAIAMAAAATACBDAACIDAAgRAAAhwwAIAE8AACQEAAwCwoAAJcJACAbAAD8CAAgzwQAAJYJADDQBAAAEQAQ0QQAAJYJADDSBAEAAAAB4QUCAOEHACHnBQEArwcAIegFAQCvBwAh6QUgAOAHACGyBgAAlQkAIAIAAAATACA8AACHDAAgAgAAAIUMACA8AACGDAAgCM8EAACEDAAw0AQAAIUMABDRBAAAhAwAMNIEAQCvBwAh4QUCAOEHACHnBQEArwcAIegFAQCvBwAh6QUgAOAHACEIzwQAAIQMADDQBAAAhQwAENEEAACEDAAw0gQBAK8HACHhBQIA4QcAIecFAQCvBwAh6AUBAK8HACHpBSAA4AcAIQTSBAEApAkAIeEFAgC2CQAh6AUBAKQJACHpBSAA9QkAIQUbAADrCwAg0gQBAKQJACHhBQIAtgkAIegFAQCkCQAh6QUgAPUJACEFGwAA9gsAINIEAQAAAAHhBQIAAAAB6AUBAAAAAekFIAAAAAEDQwAAjhAAILgGAACPEAAgvgYAAFMAIARDAAD9CwAwuAYAAP4LADC6BgAAgAwAIL4GAACBDAAwCAYAAKwKACAHAACZDQAgCgAAtA8AIA8AALcPACAdAAC1DwAgHgAAtg8AIPIEAACgCQAg8AUAAKAJACAAAAAAAAABuwYAAADtBQIBuwYAAADuBQIFQwAAgxAAIEQAAIwQACC4BgAAhBAAILkGAACLEAAgvgYAAJUCACAFQwAAgRAAIEQAAIkQACC4BgAAghAAILkGAACIEAAgvgYAAAEAIAdDAAC7DAAgRAAAvgwAILgGAAC8DAAguQYAAL0MACC8BgAADwAgvQYAAA8AIL4GAADzAgAgC0MAAK8MADBEAAC0DAAwuAYAALAMADC5BgAAsQwAMLoGAACyDAAguwYAALMMADC8BgAAswwAML0GAACzDAAwvgYAALMMADC_BgAAtQwAMMAGAAC2DAAwC0MAAKMMADBEAACoDAAwuAYAAKQMADC5BgAApQwAMLoGAACmDAAguwYAAKcMADC8BgAApwwAML0GAACnDAAwvgYAAKcMADC_BgAAqQwAMMAGAACqDAAwC0MAAJoMADBEAACeDAAwuAYAAJsMADC5BgAAnAwAMLoGAACdDAAguwYAAKYLADC8BgAApgsAML0GAACmCwAwvgYAAKYLADC_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_AsAIDwAAL8MACDSBAEApAkAIZQFAAD6C-sFIusFAQC0CQAhBBwAAPwLACDSBAEApAkAIZQFAAD6C-sFIusFAQC0CQAhA0MAAIMQACC4BgAAhBAAIL4GAACVAgAgA0MAAIEQACC4BgAAghAAIL4GAAABACADQwAAuwwAILgGAAC8DAAgvgYAAPMCACAEQwAArwwAMLgGAACwDAAwugYAALIMACC-BgAAswwAMARDAACjDAAwuAYAAKQMADC6BgAApgwAIL4GAACnDAAwBEMAAJoMADC4BgAAmwwAMLoGAACdDAAgvgYAAKYLADAAAAAAAAG7BgAAAPgFAgdDAADtDwAgRAAA_w8AILgGAADuDwAguQYAAP4PACC8BgAABQAgvQYAAAUAIL4GAAAHACALQwAA_gwAMEQAAIMNADC4BgAA_wwAMLkGAACADQAwugYAAIENACC7BgAAgg0AMLwGAACCDQAwvQYAAIINADC-BgAAgg0AML8GAACEDQAwwAYAAIUNADAFQwAA8Q8AIEQAAPwPACC4BgAA8g8AILkGAAD7DwAgvgYAAJUCACAFQwAA7w8AIEQAAPkPACC4BgAA8A8AILkGAAD4DwAgvgYAAAEAIAtDAAD1DAAwRAAA-QwAMLgGAAD2DAAwuQYAAPcMADC6BgAA-AwAILsGAACnDAAwvAYAAKcMADC9BgAApwwAML4GAACnDAAwvwYAAPoMADDABgAAqgwAMAtDAADpDAAwRAAA7gwAMLgGAADqDAAwuQYAAOsMADC6BgAA7AwAILsGAADtDAAwvAYAAO0MADC9BgAA7QwAML4GAADtDAAwvwYAAO8MADDABgAA8AwAMAtDAADgDAAwRAAA5AwAMLgGAADhDAAwuQYAAOIMADC6BgAA4wwAILsGAAC_CwAwvAYAAL8LADC9BgAAvwsAML4GAAC_CwAwvwYAAOUMADDABgAAwgsAMAtDAADUDAAwRAAA2QwAMLgGAADVDAAwuQYAANYMADC6BgAA1wwAILsGAADYDAAwvAYAANgMADC9BgAA2AwAML4GAADYDAAwvwYAANoMADDABgAA2wwAMAsQAAC-CgAg0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG1BQEAAAABuQUCAAAAAboFAgAAAAG7BQgAAAABvQUCAAAAAb4FQAAAAAECAAAASgAgQwAA3wwAIAMAAABKACBDAADfDAAgRAAA3gwAIAE8AAD3DwAwEAgAAO0IACAQAADsCAAgzwQAAOkIADDQBAAAJgAQ0QQAAOkIADDSBAEAAAAB2AQAAOsIvQUi2gRAALIHACHzBEAAsgcAIbUFAQAAAAG4BQEArwcAIbkFAgDhBwAhugUCAOEHACG7BQgA6ggAIb0FAgCuCAAhvgVAALEHACECAAAASgAgPAAA3gwAIAIAAADcDAAgPAAA3QwAIA7PBAAA2wwAMNAEAADcDAAQ0QQAANsMADDSBAEArwcAIdgEAADrCL0FItoEQACyBwAh8wRAALIHACG1BQEArwcAIbgFAQCvBwAhuQUCAOEHACG6BQIA4QcAIbsFCADqCAAhvQUCAK4IACG-BUAAsQcAIQ7PBAAA2wwAMNAEAADcDAAQ0QQAANsMADDSBAEArwcAIdgEAADrCL0FItoEQACyBwAh8wRAALIHACG1BQEArwcAIbgFAQCvBwAhuQUCAOEHACG6BQIA4QcAIbsFCADqCAAhvQUCAK4IACG-BUAAsQcAIQrSBAEApAkAIdgEAAC6Cr0FItoEQACnCQAh8wRAAKcJACG1BQEApAkAIbkFAgC2CQAhugUCALYJACG7BQgAuQoAIb0FAgC7CgAhvgVAAKYJACELEAAAvAoAINIEAQCkCQAh2AQAALoKvQUi2gRAAKcJACHzBEAApwkAIbUFAQCkCQAhuQUCALYJACG6BQIAtgkAIbsFCAC5CgAhvQUCALsKACG-BUAApgkAIQsQAAC-CgAg0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG1BQEAAAABuQUCAAAAAboFAgAAAAG7BQgAAAABvQUCAAAAAb4FQAAAAAETCwAArwsAIA4AALALACAPAACxCwAgEQAAsgsAIBIAALMLACDSBAEAAAAB2AQAAADZBQLaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAdQFQAAAAAHVBQEAAAAB1gUBAAAAAdcFAgAAAAHZBUAAAAAB2gVAAAAAAdsFAgAAAAECAAAAHwAgQwAA6AwAIAMAAAAfACBDAADoDAAgRAAA5wwAIAE8AAD2DwAwAgAAAB8AIDwAAOcMACACAAAAwwsAIDwAAOYMACAO0gQBAKQJACHYBAAAigvZBSLaBEAApwkAIfMEQACnCQAh_gRAAKcJACGRBQEAtAkAIZIFAQC0CQAh1AVAAKYJACHVBQEApAkAIdYFAQC0CQAh1wUCALYJACHZBUAApgkAIdoFQACmCQAh2wUCALYJACETCwAAjAsAIA4AAI0LACAPAACOCwAgEQAAjwsAIBIAAJALACDSBAEApAkAIdgEAACKC9kFItoEQACnCQAh8wRAAKcJACH-BEAApwkAIZEFAQC0CQAhkgUBALQJACHUBUAApgkAIdUFAQCkCQAh1gUBALQJACHXBQIAtgkAIdkFQACmCQAh2gVAAKYJACHbBQIAtgkAIRMLAACvCwAgDgAAsAsAIA8AALELACARAACyCwAgEgAAswsAINIEAQAAAAHYBAAAANkFAtoEQAAAAAHzBEAAAAAB_gRAAAAAAZEFAQAAAAGSBQEAAAAB1AVAAAAAAdUFAQAAAAHWBQEAAAAB1wUCAAAAAdkFQAAAAAHaBUAAAAAB2wUCAAAAAQsLAADICwAgDAAAyQsAINIEAQAAAAHUBAEAAAAB2AQAAADdBQL-BEAAAAAB1QUBAAAAAd0FAQAAAAHeBUAAAAAB3wVAAAAAAeAFQAAAAAECAAAARgAgQwAA9AwAIAMAAABGACBDAAD0DAAgRAAA8wwAIAE8AAD1DwAwEQgAAO0IACALAADQCAAgDAAA8QgAIM8EAADvCAAw0AQAABkAENEEAADvCAAw0gQBAAAAAdQEAQCvBwAh2AQAAPAI3QUi_gRAALEHACG4BQEArwcAIdUFAQDDBwAh3QUBAAAAAd4FQACyBwAh3wVAALEHACHgBUAAsQcAIa0GAADuCAAgAgAAAEYAIDwAAPMMACACAAAA8QwAIDwAAPIMACANzwQAAPAMADDQBAAA8QwAENEEAADwDAAw0gQBAK8HACHUBAEArwcAIdgEAADwCN0FIv4EQACxBwAhuAUBAK8HACHVBQEAwwcAId0FAQCvBwAh3gVAALIHACHfBUAAsQcAIeAFQACxBwAhDc8EAADwDAAw0AQAAPEMABDRBAAA8AwAMNIEAQCvBwAh1AQBAK8HACHYBAAA8AjdBSL-BEAAsQcAIbgFAQCvBwAh1QUBAMMHACHdBQEArwcAId4FQACyBwAh3wVAALEHACHgBUAAsQcAIQnSBAEApAkAIdQEAQCkCQAh2AQAALcL3QUi_gRAAKYJACHVBQEAtAkAId0FAQCkCQAh3gVAAKcJACHfBUAApgkAIeAFQACmCQAhCwsAALkLACAMAAC6CwAg0gQBAKQJACHUBAEApAkAIdgEAAC3C90FIv4EQACmCQAh1QUBALQJACHdBQEApAkAId4FQACnCQAh3wVAAKYJACHgBUAApgkAIQsLAADICwAgDAAAyQsAINIEAQAAAAHUBAEAAAAB2AQAAADdBQL-BEAAAAAB1QUBAAAAAd0FAQAAAAHeBUAAAAAB3wVAAAAAAeAFQAAAAAEGCQAA0gsAINIEAQAAAAHaBEAAAAABzwUBAAAAAeEFAgAAAAHiBQIAAAABAgAAAA0AIEMAAP0MACADAAAADQAgQwAA_QwAIEQAAPwMACABPAAA9A8AMAIAAAANACA8AAD8DAAgAgAAAKsMACA8AAD7DAAgBdIEAQCkCQAh2gRAAKcJACHPBQEApAkAIeEFAgC2CQAh4gUCALYJACEGCQAA0AsAINIEAQCkCQAh2gRAAKcJACHPBQEApAkAIeEFAgC2CQAh4gUCALYJACEGCQAA0gsAINIEAQAAAAHaBEAAAAABzwUBAAAAAeEFAgAAAAHiBQIAAAABHgUAAIoNACAGAACLDQAgBwAAjA0AIAwAAI8NACAXAACQDQAgHgAAjQ0AIB8AAI4NACDSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHxBQEAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAECAAAABwAgQwAAiQ0AIAMAAAAHACBDAACJDQAgRAAAiA0AIAE8AADzDwAwJAQAAJ4JACAFAACyCAAgBgAA9AcAIAcAAK8IACAMAADxCAAgFwAAnwkAIB4AAOcIACAfAACNCQAgzwQAAJwJADDQBAAABQAQ0QQAAJwJADDSBAEAAAAB2AQAAJ0J-AUi2gRAALIHACHoBAEArwcAIekEAQCvBwAh7wRAALEHACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGiBQEArwcAIboFAgDhBwAh8QUBAK8HACHzBQEAwwcAIfQFAgDhBwAh9QUCAOEHACH2BQIA4QcAIfgFQACxBwAh-QVAALEHACH6BSAA4AcAIfsFIADgBwAh_AUgAOAHACH9BQIA4QcAIf4FIADgBwAh_wUBAMMHACG1BgAAmwkAIAIAAAAHACA8AACIDQAgAgAAAIYNACA8AACHDQAgG88EAACFDQAw0AQAAIYNABDRBAAAhQ0AMNIEAQCvBwAh2AQAAJ0J-AUi2gRAALIHACHoBAEArwcAIekEAQCvBwAh7wRAALEHACHyBEAAsQcAIfMEQACyBwAh9wQBAMMHACGiBQEArwcAIboFAgDhBwAh8QUBAK8HACHzBQEAwwcAIfQFAgDhBwAh9QUCAOEHACH2BQIA4QcAIfgFQACxBwAh-QVAALEHACH6BSAA4AcAIfsFIADgBwAh_AUgAOAHACH9BQIA4QcAIf4FIADgBwAh_wUBAMMHACEbzwQAAIUNADDQBAAAhg0AENEEAACFDQAw0gQBAK8HACHYBAAAnQn4BSLaBEAAsgcAIegEAQCvBwAh6QQBAK8HACHvBEAAsQcAIfIEQACxBwAh8wRAALIHACH3BAEAwwcAIaIFAQCvBwAhugUCAOEHACHxBQEArwcAIfMFAQDDBwAh9AUCAOEHACH1BQIA4QcAIfYFAgDhBwAh-AVAALEHACH5BUAAsQcAIfoFIADgBwAh-wUgAOAHACH8BSAA4AcAIf0FAgDhBwAh_gUgAOAHACH_BQEAwwcAIRfSBAEApAkAIdgEAADLDPgFItoEQACnCQAh6AQBAKQJACHpBAEApAkAIe8EQACmCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhogUBAKQJACG6BQIAtgkAIfEFAQCkCQAh8wUBALQJACH0BQIAtgkAIfUFAgC2CQAh9gUCALYJACH4BUAApgkAIfkFQACmCQAh-gUgAPUJACH7BSAA9QkAIfwFIAD1CQAh_QUCALYJACH-BSAA9QkAIR4FAADNDAAgBgAAzgwAIAcAAM8MACAMAADSDAAgFwAA0wwAIB4AANAMACAfAADRDAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACEeBQAAig0AIAYAAIsNACAHAACMDQAgDAAAjw0AIBcAAJANACAeAACNDQAgHwAAjg0AINIEAQAAAAHYBAAAAPgFAtoEQAAAAAHoBAEAAAAB6QQBAAAAAe8EQAAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGiBQEAAAABugUCAAAAAfEFAQAAAAHzBQEAAAAB9AUCAAAAAfUFAgAAAAH2BQIAAAAB-AVAAAAAAfkFQAAAAAH6BSAAAAAB-wUgAAAAAfwFIAAAAAH9BQIAAAAB_gUgAAAAAQRDAAD-DAAwuAYAAP8MADC6BgAAgQ0AIL4GAACCDQAwA0MAAPEPACC4BgAA8g8AIL4GAACVAgAgA0MAAO8PACC4BgAA8A8AIL4GAAABACAEQwAA9QwAMLgGAAD2DAAwugYAAPgMACC-BgAApwwAMARDAADpDAAwuAYAAOoMADC6BgAA7AwAIL4GAADtDAAwBEMAAOAMADC4BgAA4QwAMLoGAADjDAAgvgYAAL8LADAEQwAA1AwAMLgGAADVDAAwugYAANcMACC-BgAA2AwAMANDAADtDwAguAYAAO4PACC-BgAABwAgAAAAAAAFQwAA6A8AIEQAAOsPACC4BgAA6Q8AILkGAADqDwAgvgYAAAEAIANDAADoDwAguAYAAOkPACC-BgAAAQAgFAYAAKwKACAMAACrDwAgHwAAqg8AICQAAK0KACAlAAClDwAgJgAApg8AICcAAKcPACAoAACoDwAgKQAAqQ8AICoAAMoNACArAADLDQAgLAAArA8AIC0AAK0PACAuAACuDwAgNQAA6QkAIDYAAK8PACDyBAAAoAkAIIIGAACgCQAgoAYAAKAJACCnBgAAoAkAIAAAAAVDAADgDwAgRAAA5g8AILgGAADhDwAguQYAAOUPACC-BgAAAQAgC0MAALwNADBEAADADQAwuAYAAL0NADC5BgAAvg0AMLoGAAC_DQAguwYAAIINADC8BgAAgg0AML0GAACCDQAwvgYAAIINADC_BgAAwQ0AMMAGAACFDQAwC0MAALANADBEAAC1DQAwuAYAALENADC5BgAAsg0AMLoGAACzDQAguwYAALQNADC8BgAAtA0AML0GAAC0DQAwvgYAALQNADC_BgAAtg0AMMAGAAC3DQAwB0MAAKsNACBEAACuDQAguAYAAKwNACC5BgAArQ0AILwGAABVACC9BgAAVQAgvgYAAIMFACALQwAAog0AMEQAAKYNADC4BgAAow0AMLkGAACkDQAwugYAAKUNACC7BgAAogoAMLwGAACiCgAwvQYAAKIKADC-BgAAogoAML8GAACnDQAwwAYAAKUKADARIgAAlAoAICMAAJYKACDSBAEAAAAB2AQAAAClBQLaBEAAAAAB8wRAAAAAAfkEAQAAAAGQBYAAAAABlwUAAACXBQKjBQEAAAABpQUEAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBUAAAAABqwVAAAAAAQIAAABZACBDAACqDQAgAwAAAFkAIEMAAKoNACBEAACpDQAgATwAAOQPADACAAAAWQAgPAAAqQ0AIAIAAACmCgAgPAAAqA0AIA_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-QVAAAAAAfoFIAAAAAH7BSAAAAAB_AUgAAAAAf0FAgAAAAH-BSAAAAAB_wUBAAAAAQIAAAAHACBDAADEDQAgAwAAAAcAIEMAAMQNACBEAADDDQAgATwAAOIPADACAAAABwAgPAAAww0AIAIAAACGDQAgPAAAwg0AIBfSBAEApAkAIdgEAADLDPgFItoEQACnCQAh6AQBAKQJACHpBAEApAkAIe8EQACmCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_BQEAtAkAIR4EAADMDAAgBQAAzQwAIAcAAM8MACAMAADSDAAgFwAA0wwAIB4AANAMACAfAADRDAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIboFAgC2CQAh8QUBAKQJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_wUBALQJACEeBAAAkQ0AIAUAAIoNACAHAACMDQAgDAAAjw0AIBcAAJANACAeAACNDQAgHwAAjg0AINIEAQAAAAHYBAAAAPgFAtoEQAAAAAHoBAEAAAAB6QQBAAAAAe8EQAAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAG6BQIAAAAB8QUBAAAAAfMFAQAAAAH0BQIAAAAB9QUCAAAAAfYFAgAAAAH4BUAAAAAB-QVAAAAAAfoFIAAAAAH7BSAAAAAB_AUgAAAAAf0FAgAAAAH-BSAAAAAB_wUBAAAAAQNDAADgDwAguAYAAOEPACC-BgAAAQAgBEMAALwNADC4BgAAvQ0AMLoGAAC_DQAgvgYAAIINADAEQwAAsA0AMLgGAACxDQAwugYAALMNACC-BgAAtA0AMANDAACrDQAguAYAAKwNACC-BgAAgwUAIARDAACiDQAwuAYAAKMNADC6BgAApQ0AIL4GAACiCgAwAAAHBgAArAoAICQAAK0KACCvBQAAoAkAILAFAACgCQAgsQUAAKAJACCyBQAAoAkAILQFAACgCQAgAAAAAAAABUMAANsPACBEAADeDwAguAYAANwPACC5BgAA3Q8AIL4GAAABACADQwAA2w8AILgGAADcDwAgvgYAAAEAIAAAAAVDAADWDwAgRAAA2Q8AILgGAADXDwAguQYAANgPACC-BgAAAQAgA0MAANYPACC4BgAA1w8AIL4GAAABACAAAAAFQwAA0Q8AIEQAANQPACC4BgAA0g8AILkGAADTDwAgvgYAAAEAIANDAADRDwAguAYAANIPACC-BgAAAQAgAAAAAbsGAAAAogYCAbsGAAAApAYCAbsGAAAApQYCB0MAAJAPACBEAACTDwAguAYAAJEPACC5BgAAkg8AILwGAAADACC9BgAAAwAgvgYAAJUCACALQwAAhA8AMEQAAIkPADC4BgAAhQ8AMLkGAACGDwAwugYAAIcPACC7BgAAiA8AMLwGAACIDwAwvQYAAIgPADC-BgAAiA8AML8GAACKDwAwwAYAAIsPADALQwAA-A4AMEQAAP0OADC4BgAA-Q4AMLkGAAD6DgAwugYAAPsOACC7BgAA_A4AMLwGAAD8DgAwvQYAAPwOADC-BgAA_A4AML8GAAD-DgAwwAYAAP8OADALQwAA7A4AMEQAAPEOADC4BgAA7Q4AMLkGAADuDgAwugYAAO8OACC7BgAA8A4AMLwGAADwDgAwvQYAAPAOADC-BgAA8A4AML8GAADyDgAwwAYAAPMOADALQwAA4A4AMEQAAOUOADC4BgAA4Q4AMLkGAADiDgAwugYAAOMOACC7BgAA5A4AMLwGAADkDgAwvQYAAOQOADC-BgAA5A4AML8GAADmDgAwwAYAAOcOADAHQwAA2w4AIEQAAN4OACC4BgAA3A4AILkGAADdDgAgvAYAAHIAIL0GAAByACC-BgAArQIAIAtDAADSDgAwRAAA1g4AMLgGAADTDgAwuQYAANQOADC6BgAA1Q4AILsGAACCDQAwvAYAAIINADC9BgAAgg0AML4GAACCDQAwvwYAANcOADDABgAAhQ0AMAtDAADJDgAwRAAAzQ4AMLgGAADKDgAwuQYAAMsOADC6BgAAzA4AILsGAADtDAAwvAYAAO0MADC9BgAA7QwAML4GAADtDAAwvwYAAM4OADDABgAA8AwAMAtDAADADgAwRAAAxA4AMLgGAADBDgAwuQYAAMIOADC6BgAAww4AILsGAAC_CwAwvAYAAL8LADC9BgAAvwsAML4GAAC_CwAwvwYAAMUOADDABgAAwgsAMAtDAAC3DgAwRAAAuw4AMLgGAAC4DgAwuQYAALkOADC6BgAAug4AILsGAAC0DQAwvAYAALQNADC9BgAAtA0AML4GAAC0DQAwvwYAALwOADDABgAAtw0AMAtDAACrDgAwRAAAsA4AMLgGAACsDgAwuQYAAK0OADC6BgAArg4AILsGAACvDgAwvAYAAK8OADC9BgAArw4AML4GAACvDgAwvwYAALEOADDABgAAsg4AMAtDAACiDgAwRAAApg4AMLgGAACjDgAwuQYAAKQOADC6BgAApQ4AILsGAACiCgAwvAYAAKIKADC9BgAAogoAML4GAACiCgAwvwYAAKcOADDABgAApQoAMAtDAACWDgAwRAAAmw4AMLgGAACXDgAwuQYAAJgOADC6BgAAmQ4AILsGAACaDgAwvAYAAJoOADC9BgAAmg4AML4GAACaDgAwvwYAAJwOADDABgAAnQ4AMAtDAACKDgAwRAAAjw4AMLgGAACLDgAwuQYAAIwOADC6BgAAjQ4AILsGAACODgAwvAYAAI4OADC9BgAAjg4AML4GAACODgAwvwYAAJAOADDABgAAkQ4AMAtDAACBDgAwRAAAhQ4AMLgGAACCDgAwuQYAAIMOADC6BgAAhA4AILsGAADgCQAwvAYAAOAJADC9BgAA4AkAML4GAADgCQAwvwYAAIYOADDABgAA4wkAMAtDAAD1DQAwRAAA-g0AMLgGAAD2DQAwuQYAAPcNADC6BgAA-A0AILsGAAD5DQAwvAYAAPkNADC9BgAA-Q0AML4GAAD5DQAwvwYAAPsNADDABgAA_A0AMAjSBAEAAAAB2gRAAAAAAfgEAQAAAAH6BAEAAAAB-wQBAAAAAfwEgAAAAAH9BAIAAAAB_gRAAAAAAQIAAACUAQAgQwAAgA4AIAMAAACUAQAgQwAAgA4AIEQAAP8NACABPAAA0A8AMA4iAACvCAAgzwQAAMYIADDQBAAAkgEAENEEAADGCAAw0gQBAAAAAdoEQACyBwAh-AQBAK8HACH5BAEArwcAIfoEAQCvBwAh-wQBAK8HACH8BAAA3wcAIP0EAgDhBwAh_gRAALIHACGoBgAAxQgAIAIAAACUAQAgPAAA_w0AIAIAAAD9DQAgPAAA_g0AIAzPBAAA_A0AMNAEAAD9DQAQ0QQAAPwNADDSBAEArwcAIdoEQACyBwAh-AQBAK8HACH5BAEArwcAIfoEAQCvBwAh-wQBAK8HACH8BAAA3wcAIP0EAgDhBwAh_gRAALIHACEMzwQAAPwNADDQBAAA_Q0AENEEAAD8DQAw0gQBAK8HACHaBEAAsgcAIfgEAQCvBwAh-QQBAK8HACH6BAEArwcAIfsEAQCvBwAh_AQAAN8HACD9BAIA4QcAIf4EQACyBwAhCNIEAQCkCQAh2gRAAKcJACH4BAEApAkAIfoEAQCkCQAh-wQBAKQJACH8BIAAAAAB_QQCALYJACH-BEAApwkAIQjSBAEApAkAIdoEQACnCQAh-AQBAKQJACH6BAEApAkAIfsEAQCkCQAh_ASAAAAAAf0EAgC2CQAh_gRAAKcJACEI0gQBAAAAAdoEQAAAAAH4BAEAAAAB-gQBAAAAAfsEAQAAAAH8BIAAAAAB_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_SBAEApAkAIdgEAACPCqUFItoEQACnCQAh8wRAAKcJACGQBYAAAAABlwUAAIkKlwUiogUBALQJACGjBQEAtAkAIaUFBACQCgAhpgUBAKQJACGnBQEAtAkAIagFAQC0CQAhqQUBALQJACGqBUAApgkAIasFQACmCQAhEQYAAJIKACAjAACTCgAg0gQBAKQJACHYBAAAjwqlBSLaBEAApwkAIfMEQACnCQAhkAWAAAAAAZcFAACJCpcFIqIFAQC0CQAhowUBALQJACGlBQQAkAoAIaYFAQCkCQAhpwUBALQJACGoBQEAtAkAIakFAQC0CQAhqgVAAKYJACGrBUAApgkAIREGAACVCgAgIwAAlgoAINIEAQAAAAHYBAAAAKUFAtoEQAAAAAHzBEAAAAABkAWAAAAAAZcFAAAAlwUCogUBAAAAAaMFAQAAAAGlBQQAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABqQUBAAAAAaoFQAAAAAGrBUAAAAABDBQAANEKACDSBAEAAAAB2AQAAADNBQLaBEAAAAAB8wRAAAAAAZAFgAAAAAG-BUAAAAABvwUBAAAAAckFAgAAAAHKBQIAAAABywUBAAAAAc0FIAAAAAECAAAAeQAgQwAAtg4AIAMAAAB5ACBDAAC2DgAgRAAAtQ4AIAE8AADLDwAwERQAANUIACAVAADQCAAgzwQAANMIADDQBAAALwAQ0QQAANMIADDSBAEAAAAB2AQAANQIzQUi2gRAALIHACHzBEAAsgcAIZAFAACtCAAgvgVAALEHACG_BQEAAAAByAUBAMMHACHJBQIA4QcAIcoFAgDhBwAhywUBAMMHACHNBSAA4AcAIQIAAAB5ACA8AAC1DgAgAgAAALMOACA8AAC0DgAgD88EAACyDgAw0AQAALMOABDRBAAAsg4AMNIEAQCvBwAh2AQAANQIzQUi2gRAALIHACHzBEAAsgcAIZAFAACtCAAgvgVAALEHACG_BQEArwcAIcgFAQDDBwAhyQUCAOEHACHKBQIA4QcAIcsFAQDDBwAhzQUgAOAHACEPzwQAALIOADDQBAAAsw4AENEEAACyDgAw0gQBAK8HACHYBAAA1AjNBSLaBEAAsgcAIfMEQACyBwAhkAUAAK0IACC-BUAAsQcAIb8FAQCvBwAhyAUBAMMHACHJBQIA4QcAIcoFAgDhBwAhywUBAMMHACHNBSAA4AcAIQvSBAEApAkAIdgEAADOCs0FItoEQACnCQAh8wRAAKcJACGQBYAAAAABvgVAAKYJACG_BQEApAkAIckFAgC2CQAhygUCALYJACHLBQEAtAkAIc0FIAD1CQAhDBQAAM8KACDSBAEApAkAIdgEAADOCs0FItoEQACnCQAh8wRAAKcJACGQBYAAAAABvgVAAKYJACG_BQEApAkAIckFAgC2CQAhygUCALYJACHLBQEAtAkAIc0FIAD1CQAhDBQAANEKACDSBAEAAAAB2AQAAADNBQLaBEAAAAAB8wRAAAAAAZAFgAAAAAG-BUAAAAABvwUBAAAAAckFAgAAAAHKBQIAAAABywUBAAAAAc0FIAAAAAESBgAAwAwAIAoAAMIMACAPAADFDAAgHQAAwwwAIB4AAMQMACDSBAEAAAAB2gRAAAAAAegEAQAAAAHpBAEAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABlAUAAADtBQKiBQEAAAAB7gUAAADuBQLvBQIAAAAB8AUCAAAAAfIFIAAAAAECAAAAUwAgQwAAvw4AIAMAAABTACBDAAC_DgAgRAAAvg4AIAE8AADKDwAwAgAAAFMAIDwAAL4OACACAAAAuA0AIDwAAL0OACAN0gQBAKQJACHaBEAApwkAIegEAQCkCQAh6QQBAKQJACHyBEAApgkAIfMEQACnCQAh9wQBAKQJACGUBQAAkgztBSKiBQEApAkAIe4FAACTDO4FIu8FAgC2CQAh8AUCALsKACHyBSAA9QkAIRIGAACUDAAgCgAAlgwAIA8AAJkMACAdAACXDAAgHgAAmAwAINIEAQCkCQAh2gRAAKcJACHoBAEApAkAIekEAQCkCQAh8gRAAKYJACHzBEAApwkAIfcEAQCkCQAhlAUAAJIM7QUiogUBAKQJACHuBQAAkwzuBSLvBQIAtgkAIfAFAgC7CgAh8gUgAPUJACESBgAAwAwAIAoAAMIMACAPAADFDAAgHQAAwwwAIB4AAMQMACDSBAEAAAAB2gRAAAAAAegEAQAAAAHpBAEAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABlAUAAADtBQKiBQEAAAAB7gUAAADuBQLvBQIAAAAB8AUCAAAAAfIFIAAAAAETCAAArgsAIA4AALALACAPAACxCwAgEQAAsgsAIBIAALMLACDSBAEAAAAB2AQAAADZBQLaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAbgFAQAAAAHUBUAAAAAB1gUBAAAAAdcFAgAAAAHZBUAAAAAB2gVAAAAAAdsFAgAAAAECAAAAHwAgQwAAyA4AIAMAAAAfACBDAADIDgAgRAAAxw4AIAE8AADJDwAwAgAAAB8AIDwAAMcOACACAAAAwwsAIDwAAMYOACAO0gQBAKQJACHYBAAAigvZBSLaBEAApwkAIfMEQACnCQAh_gRAAKcJACGRBQEAtAkAIZIFAQC0CQAhuAUBAKQJACHUBUAApgkAIdYFAQC0CQAh1wUCALYJACHZBUAApgkAIdoFQACmCQAh2wUCALYJACETCAAAiwsAIA4AAI0LACAPAACOCwAgEQAAjwsAIBIAAJALACDSBAEApAkAIdgEAACKC9kFItoEQACnCQAh8wRAAKcJACH-BEAApwkAIZEFAQC0CQAhkgUBALQJACG4BQEApAkAIdQFQACmCQAh1gUBALQJACHXBQIAtgkAIdkFQACmCQAh2gVAAKYJACHbBQIAtgkAIRMIAACuCwAgDgAAsAsAIA8AALELACARAACyCwAgEgAAswsAINIEAQAAAAHYBAAAANkFAtoEQAAAAAHzBEAAAAAB_gRAAAAAAZEFAQAAAAGSBQEAAAABuAUBAAAAAdQFQAAAAAHWBQEAAAAB1wUCAAAAAdkFQAAAAAHaBUAAAAAB2wUCAAAAAQsIAADHCwAgDAAAyQsAINIEAQAAAAHUBAEAAAAB2AQAAADdBQL-BEAAAAABuAUBAAAAAd0FAQAAAAHeBUAAAAAB3wVAAAAAAeAFQAAAAAECAAAARgAgQwAA0Q4AIAMAAABGACBDAADRDgAgRAAA0A4AIAE8AADIDwAwAgAAAEYAIDwAANAOACACAAAA8QwAIDwAAM8OACAJ0gQBAKQJACHUBAEApAkAIdgEAAC3C90FIv4EQACmCQAhuAUBAKQJACHdBQEApAkAId4FQACnCQAh3wVAAKYJACHgBUAApgkAIQsIAAC4CwAgDAAAugsAINIEAQCkCQAh1AQBAKQJACHYBAAAtwvdBSL-BEAApgkAIbgFAQCkCQAh3QUBAKQJACHeBUAApwkAId8FQACmCQAh4AVAAKYJACELCAAAxwsAIAwAAMkLACDSBAEAAAAB1AQBAAAAAdgEAAAA3QUC_gRAAAAAAbgFAQAAAAHdBQEAAAAB3gVAAAAAAd8FQAAAAAHgBUAAAAABHgQAAJENACAFAACKDQAgBgAAiw0AIAwAAI8NACAXAACQDQAgHgAAjQ0AIB8AAI4NACDSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHzBQEAAAAB9AUCAAAAAfUFAgAAAAH2BQIAAAAB-AVAAAAAAfkFQAAAAAH6BSAAAAAB-wUgAAAAAfwFIAAAAAH9BQIAAAAB_gUgAAAAAf8FAQAAAAECAAAABwAgQwAA2g4AIAMAAAAHACBDAADaDgAgRAAA2Q4AIAE8AADHDwAwAgAAAAcAIDwAANkOACACAAAAhg0AIDwAANgOACAX0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_wUBALQJACEeBAAAzAwAIAUAAM0MACAGAADODAAgDAAA0gwAIBcAANMMACAeAADQDAAgHwAA0QwAINIEAQCkCQAh2AQAAMsM-AUi2gRAAKcJACHoBAEApAkAIekEAQCkCQAh7wRAAKYJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGiBQEApAkAIboFAgC2CQAh8wUBALQJACH0BQIAtgkAIfUFAgC2CQAh9gUCALYJACH4BUAApgkAIfkFQACmCQAh-gUgAPUJACH7BSAA9QkAIfwFIAD1CQAh_QUCALYJACH-BSAA9QkAIf8FAQC0CQAhHgQAAJENACAFAACKDQAgBgAAiw0AIAwAAI8NACAXAACQDQAgHgAAjQ0AIB8AAI4NACDSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHzBQEAAAAB9AUCAAAAAfUFAgAAAAH2BQIAAAAB-AVAAAAAAfkFQAAAAAH6BSAAAAAB-wUgAAAAAfwFIAAAAAH9BQIAAAAB_gUgAAAAAf8FAQAAAAEP0gQBAAAAAdoEQAAAAAHyBEAAAAAB8wRAAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQYBAAAAAYYGAQAAAAGHBgEAAAABiAaAAAAAAYkGAgAAAAGKBiAAAAABAgAAAK0CACBDAADbDgAgAwAAAHIAIEMAANsOACBEAADfDgAgEQAAAHIAIDwAAN8OACDSBAEApAkAIdoEQACnCQAh8gRAAKYJACHzBEAApwkAIYAGAQC0CQAhgQYBALQJACGCBgEAtAkAIYMGAQC0CQAhhAYBALQJACGFBgEAtAkAIYYGAQC0CQAhhwYBALQJACGIBoAAAAABiQYCALsKACGKBiAA9QkAIQ_SBAEApAkAIdoEQACnCQAh8gRAAKYJACHzBEAApwkAIYAGAQC0CQAhgQYBALQJACGCBgEAtAkAIYMGAQC0CQAhhAYBALQJACGFBgEAtAkAIYYGAQC0CQAhhwYBALQJACGIBoAAAAABiQYCALsKACGKBiAA9QkAIQXSBAEAAAABhgUAAACGBQKHBSAAAAABiAVAAAAAAYkFQAAAAAECAAAAcAAgQwAA6w4AIAMAAABwACBDAADrDgAgRAAA6g4AIAE8AADGDwAwCyIAAK8IACDPBAAA1wgAMNAEAABuABDRBAAA1wgAMNIEAQAAAAH5BAEArwcAIYYFAADYCIYFIocFIADgBwAhiAVAALIHACGJBUAAsQcAIaoGAADWCAAgAgAAAHAAIDwAAOoOACACAAAA6A4AIDwAAOkOACAJzwQAAOcOADDQBAAA6A4AENEEAADnDgAw0gQBAK8HACH5BAEArwcAIYYFAADYCIYFIocFIADgBwAhiAVAALIHACGJBUAAsQcAIQnPBAAA5w4AMNAEAADoDgAQ0QQAAOcOADDSBAEArwcAIfkEAQCvBwAhhgUAANgIhgUihwUgAOAHACGIBUAAsgcAIYkFQACxBwAhBdIEAQCkCQAhhgUAAPQJhgUihwUgAPUJACGIBUAApwkAIYkFQACmCQAhBdIEAQCkCQAhhgUAAPQJhgUihwUgAPUJACGIBUAApwkAIYkFQACmCQAhBdIEAQAAAAGGBQAAAIYFAocFIAAAAAGIBUAAAAABiQVAAAAAAQPSBAEAAAABlAYBAAAAAZUGAQAAAAECAAAAbAAgQwAA9w4AIAMAAABsACBDAAD3DgAgRAAA9g4AIAE8AADFDwAwCCIAAK8IACDPBAAA2QgAMNAEAABqABDRBAAA2QgAMNIEAQAAAAH5BAEAAAABlAYBAK8HACGVBgEAwwcAIQIAAABsACA8AAD2DgAgAgAAAPQOACA8AAD1DgAgB88EAADzDgAw0AQAAPQOABDRBAAA8w4AMNIEAQCvBwAh-QQBAK8HACGUBgEArwcAIZUGAQDDBwAhB88EAADzDgAw0AQAAPQOABDRBAAA8w4AMNIEAQCvBwAh-QQBAK8HACGUBgEArwcAIZUGAQDDBwAhA9IEAQCkCQAhlAYBAKQJACGVBgEAtAkAIQPSBAEApAkAIZQGAQCkCQAhlQYBALQJACED0gQBAAAAAZQGAQAAAAGVBgEAAAABB9IEAQAAAAHaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAZMGAQAAAAECAAAAaAAgQwAAgw8AIAMAAABoACBDAACDDwAgRAAAgg8AIAE8AADEDwAwDCIAAK8IACDPBAAA2ggAMNAEAABmABDRBAAA2ggAMNIEAQAAAAHaBEAAsgcAIfMEQACyBwAh-QQBAK8HACH-BEAAsgcAIZEFAQDDBwAhkgUBAMMHACGTBgEAAAABAgAAAGgAIDwAAIIPACACAAAAgA8AIDwAAIEPACALzwQAAP8OADDQBAAAgA8AENEEAAD_DgAw0gQBAK8HACHaBEAAsgcAIfMEQACyBwAh-QQBAK8HACH-BEAAsgcAIZEFAQDDBwAhkgUBAMMHACGTBgEArwcAIQvPBAAA_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-A4AMLgGAAD5DgAwugYAAPsOACC-BgAA_A4AMARDAADsDgAwuAYAAO0OADC6BgAA7w4AIL4GAADwDgAwBEMAAOAOADC4BgAA4Q4AMLoGAADjDgAgvgYAAOQOADADQwAA2w4AILgGAADcDgAgvgYAAK0CACAEQwAA0g4AMLgGAADTDgAwugYAANUOACC-BgAAgg0AMARDAADJDgAwuAYAAMoOADC6BgAAzA4AIL4GAADtDAAwBEMAAMAOADC4BgAAwQ4AMLoGAADDDgAgvgYAAL8LADAEQwAAtw4AMLgGAAC4DgAwugYAALoOACC-BgAAtA0AMARDAACrDgAwuAYAAKwOADC6BgAArg4AIL4GAACvDgAwBEMAAKIOADC4BgAAow4AMLoGAAClDgAgvgYAAKIKADAEQwAAlg4AMLgGAACXDgAwugYAAJkOACC-BgAAmg4AMARDAACKDgAwuAYAAIsOADC6BgAAjQ4AIL4GAACODgAwBEMAAIEOADC4BgAAgg4AMLoGAACEDgAgvgYAAOAJADAEQwAA9Q0AMLgGAAD2DQAwugYAAPgNACC-BgAA-Q0AMAAAAAAMIgAAmQ0AIPIEAACgCQAggAYAAKAJACCBBgAAoAkAIIIGAACgCQAggwYAAKAJACCEBgAAoAkAIIUGAACgCQAghgYAAKAJACCHBgAAoAkAIIgGAACgCQAgiQYAAKAJACAAAAAAAAAGLwAAmQ0AIDEAALIPACA0AADXCQAg7AQAAKAJACDvBAAAoAkAIPIEAACgCQAgATAAANcJACACMAAA6QkAIPcEAACgCQAgCQkAAIsMACAQAAC4DwAgEwAAvA8AIBYAAL0PACAZAAC6DwAg0AUAAKAJACDRBQAAoAkAINIFAACgCQAg1AUAAKAJACADCQAAiwwAIBwAAIwMACDrBQAAoAkAIAAAAAwIAAC5DwAgCwAAmQ0AIA4AAL4PACAPAAC3DwAgEQAAvw8AIBIAAMAPACCRBQAAoAkAIJIFAACgCQAg1AUAAKAJACDWBQAAoAkAINkFAACgCQAg2gUAAKAJACAPBAAAuQ8AIAUAAMoNACAGAACsCgAgBwAAmQ0AIAwAAKsPACAXAADCDwAgHgAAtg8AIB8AAKoPACDvBAAAoAkAIPIEAACgCQAg9wQAAKAJACDzBQAAoAkAIPgFAACgCQAg-QUAAKAJACD_BQAAoAkAIAAFCQAAiwwAIBcAALoPACDjBQAAoAkAIOUFAACgCQAg5gUAAKAJACAABhQAALMPACAVAACZDQAgkAUAAKAJACC-BQAAoAkAIMgFAACgCQAgywUAAKAJACAHCAAAuQ8AIAsAAJkNACAMAACrDwAg_gQAAKAJACDVBQAAoAkAIN8FAACgCQAg4AUAAKAJACAECAAAuQ8AIBAAALgPACC9BQAAoAkAIL4FAACgCQAgAAIKAAC0DwAgGwAAvA8AIAAN0gQBAAAAAdoEQAAAAAHzBEAAAAABlgYBAAAAAZcGAQAAAAGYBgEAAAABmQYBAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAZ0GQAAAAAGeBkAAAAABnwYBAAAAAQfSBAEAAAAB2gRAAAAAAfMEQAAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAGTBgEAAAABA9IEAQAAAAGUBgEAAAABlQYBAAAAAQXSBAEAAAABhgUAAACGBQKHBSAAAAABiAVAAAAAAYkFQAAAAAEX0gQBAAAAAdgEAAAA-AUC2gRAAAAAAegEAQAAAAHpBAEAAAAB7wRAAAAAAfIEQAAAAAHzBEAAAAAB9wQBAAAAAaIFAQAAAAG6BQIAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABCdIEAQAAAAHUBAEAAAAB2AQAAADdBQL-BEAAAAABuAUBAAAAAd0FAQAAAAHeBUAAAAAB3wVAAAAAAeAFQAAAAAEO0gQBAAAAAdgEAAAA2QUC2gRAAAAAAfMEQAAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAG4BQEAAAAB1AVAAAAAAdYFAQAAAAHXBQIAAAAB2QVAAAAAAdoFQAAAAAHbBQIAAAABDdIEAQAAAAHaBEAAAAAB6AQBAAAAAekEAQAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGUBQAAAO0FAqIFAQAAAAHuBQAAAO4FAu8FAgAAAAHwBQIAAAAB8gUgAAAAAQvSBAEAAAAB2AQAAADNBQLaBEAAAAAB8wRAAAAAAZAFgAAAAAG-BUAAAAABvwUBAAAAAckFAgAAAAHKBQIAAAABywUBAAAAAc0FIAAAAAEP0gQBAAAAAdgEAAAApQUC2gRAAAAAAfMEQAAAAAGQBYAAAAABlwUAAACXBQKiBQEAAAABowUBAAAAAaUFBAAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAGpBQEAAAABqgVAAAAAAasFQAAAAAEI0gQBAAAAAdYEAQAAAAHaBEAAAAAB6AQBAAAAAfMEQAAAAAGQBYAAAAABlAUAAACUBQKVBSAAAAABCtIEAQAAAAHaBEAAAAABiwUAAACLBQKMBQEAAAABjQUBAAAAAY4FgAAAAAGPBYAAAAABkAWAAAAAAZEFAQAAAAGSBQEAAAABDdIEAQAAAAHYBAAAAO4EAtoEQAAAAAHoBAEAAAAB6QQBAAAAAeoEAQAAAAHrBAEAAAAB7AQBAAAAAe4EAgAAAAHvBEAAAAAB8QQBAAAAAfIEQAAAAAHzBEAAAAABCNIEAQAAAAHaBEAAAAAB-AQBAAAAAfoEAQAAAAH7BAEAAAAB_ASAAAAAAf0EAgAAAAH-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-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABDdIEAQAAAAHaBEAAAAAB6AQBAAAAAekEAQAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGUBQAAAO0FAu4FAAAA7gUC7wUCAAAAAfAFAgAAAAHxBQEAAAAB8gUgAAAAAQ_SBAEAAAAB2AQAAAClBQLaBEAAAAAB8wRAAAAAAfkEAQAAAAGQBYAAAAABlwUAAACXBQKjBQEAAAABpQUEAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBUAAAAABqwVAAAAAAQMAAAAbACBDAADgDwAgRAAA5w8AIB8AAAAbACAMAADtDQAgHwAA7A0AICQAAPANACAlAADmDQAgJgAA5w0AICcAAOgNACAoAADpDQAgKQAA6g0AICoAAOsNACArAADuDQAgLAAA7w0AIC0AAPENACAuAADyDQAgNQAA8w0AIDYAAPQNACA8AADnDwAg0gQBAKQJACHTBAEApAkAIdQEAQCkCQAh2AQAAOMNpAYi2gRAAKcJACHyBEAApgkAIfMEQACnCQAhlwUAAOQNpQYiggYBALQJACGgBgEAtAkAIaIGAADiDaIGIqUGIAD1CQAhpgYgAPUJACGnBkAApgkAIR0MAADtDQAgHwAA7A0AICQAAPANACAlAADmDQAgJgAA5w0AICcAAOgNACAoAADpDQAgKQAA6g0AICoAAOsNACArAADuDQAgLAAA7w0AIC0AAPENACAuAADyDQAgNQAA8w0AIDYAAPQNACDSBAEApAkAIdMEAQCkCQAh1AQBAKQJACHYBAAA4w2kBiLaBEAApwkAIfIEQACmCQAh8wRAAKcJACGXBQAA5A2lBiKCBgEAtAkAIaAGAQC0CQAhogYAAOINogYipQYgAPUJACGmBiAA9QkAIacGQACmCQAhHQYAAJUPACAMAACdDwAgHwAAnA8AICQAAKAPACAlAACWDwAgJgAAlw8AICcAAJgPACAoAACZDwAgKgAAmw8AICsAAJ4PACAsAACfDwAgLQAAoQ8AIC4AAKIPACA1AACjDwAgNgAApA8AINIEAQAAAAHTBAEAAAAB1AQBAAAAAdgEAAAApAYC2gRAAAAAAfIEQAAAAAHzBEAAAAABlwUAAAClBgKCBgEAAAABoAYBAAAAAaIGAAAAogYCpQYgAAAAAaYGIAAAAAGnBkAAAAABAgAAAAEAIEMAAOgPACADAAAAGwAgQwAA6A8AIEQAAOwPACAfAAAAGwAgBgAA5Q0AIAwAAO0NACAfAADsDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACAqAADrDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAgPAAA7A8AINIEAQCkCQAh0wQBAKQJACHUBAEApAkAIdgEAADjDaQGItoEQACnCQAh8gRAAKYJACHzBEAApwkAIZcFAADkDaUGIoIGAQC0CQAhoAYBALQJACGiBgAA4g2iBiKlBiAA9QkAIaYGIAD1CQAhpwZAAKYJACEdBgAA5Q0AIAwAAO0NACAfAADsDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACAqAADrDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAg0gQBAKQJACHTBAEApAkAIdQEAQCkCQAh2AQAAOMNpAYi2gRAAKcJACHyBEAApgkAIfMEQACnCQAhlwUAAOQNpQYiggYBALQJACGgBgEAtAkAIaIGAADiDaIGIqUGIAD1CQAhpgYgAPUJACGnBkAApgkAIR8EAACRDQAgBgAAiw0AIAcAAIwNACAMAACPDQAgFwAAkA0AIB4AAI0NACAfAACODQAg0gQBAAAAAdgEAAAA-AUC2gRAAAAAAegEAQAAAAHpBAEAAAAB7wRAAAAAAfIEQAAAAAHzBEAAAAAB9wQBAAAAAaIFAQAAAAG6BQIAAAAB8QUBAAAAAfMFAQAAAAH0BQIAAAAB9QUCAAAAAfYFAgAAAAH4BUAAAAAB-QVAAAAAAfoFIAAAAAH7BSAAAAAB_AUgAAAAAf0FAgAAAAH-BSAAAAAB_wUBAAAAAQIAAAAHACBDAADtDwAgHQYAAJUPACAMAACdDwAgHwAAnA8AICQAAKAPACAlAACWDwAgJgAAlw8AICcAAJgPACAoAACZDwAgKQAAmg8AICsAAJ4PACAsAACfDwAgLQAAoQ8AIC4AAKIPACA1AACjDwAgNgAApA8AINIEAQAAAAHTBAEAAAAB1AQBAAAAAdgEAAAApAYC2gRAAAAAAfIEQAAAAAHzBEAAAAABlwUAAAClBgKCBgEAAAABoAYBAAAAAaIGAAAAogYCpQYgAAAAAaYGIAAAAAGnBkAAAAABAgAAAAEAIEMAAO8PACAQAQAAxQ0AICEAAMcNACAjAADIDQAgJAAAyQ0AINIEAQAAAAHTBAEAAAAB2gRAAAAAAekEAQAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBiAAAAABjwYBAAAAAQIAAACVAgAgQwAA8Q8AIBfSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHxBQEAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAEF0gQBAAAAAdoEQAAAAAHPBQEAAAAB4QUCAAAAAeIFAgAAAAEJ0gQBAAAAAdQEAQAAAAHYBAAAAN0FAv4EQAAAAAHVBQEAAAAB3QUBAAAAAd4FQAAAAAHfBUAAAAAB4AVAAAAAAQ7SBAEAAAAB2AQAAADZBQLaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAdQFQAAAAAHVBQEAAAAB1gUBAAAAAdcFAgAAAAHZBUAAAAAB2gVAAAAAAdsFAgAAAAEK0gQBAAAAAdgEAAAAvQUC2gRAAAAAAfMEQAAAAAG1BQEAAAABuQUCAAAAAboFAgAAAAG7BQgAAAABvQUCAAAAAb4FQAAAAAEDAAAAGwAgQwAA7w8AIEQAAPoPACAfAAAAGwAgBgAA5Q0AIAwAAO0NACAfAADsDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACApAADqDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAgPAAA-g8AINIEAQCkCQAh0wQBAKQJACHUBAEApAkAIdgEAADjDaQGItoEQACnCQAh8gRAAKYJACHzBEAApwkAIZcFAADkDaUGIoIGAQC0CQAhoAYBALQJACGiBgAA4g2iBiKlBiAA9QkAIaYGIAD1CQAhpwZAAKYJACEdBgAA5Q0AIAwAAO0NACAfAADsDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACApAADqDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAg0gQBAKQJACHTBAEApAkAIdQEAQCkCQAh2AQAAOMNpAYi2gRAAKcJACHyBEAApgkAIfMEQACnCQAhlwUAAOQNpQYiggYBALQJACGgBgEAtAkAIaIGAADiDaIGIqUGIAD1CQAhpgYgAPUJACGnBkAApgkAIQMAAAADACBDAADxDwAgRAAA_Q8AIBIAAAADACABAACdDQAgIQAAnw0AICMAAKANACAkAAChDQAgPAAA_Q8AINIEAQCkCQAh0wQBAKQJACHaBEAApwkAIekEAQCkCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhiwYBALQJACGMBgEAtAkAIY0GAQC0CQAhjgYgAPUJACGPBgEApAkAIRABAACdDQAgIQAAnw0AICMAAKANACAkAAChDQAg0gQBAKQJACHTBAEApAkAIdoEQACnCQAh6QQBAKQJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGLBgEAtAkAIYwGAQC0CQAhjQYBALQJACGOBiAA9QkAIY8GAQCkCQAhAwAAAAUAIEMAAO0PACBEAACAEAAgIQAAAAUAIAQAAMwMACAGAADODAAgBwAAzwwAIAwAANIMACAXAADTDAAgHgAA0AwAIB8AANEMACA8AACAEAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_BQEAtAkAIR8EAADMDAAgBgAAzgwAIAcAAM8MACAMAADSDAAgFwAA0wwAIB4AANAMACAfAADRDAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_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-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABAgAAAAcAIEMAAKIQACADAAAAUQAgQwAAoBAAIEQAAKYQACAVAAAAUQAgBgAAlAwAIAcAAJUMACAKAACWDAAgDwAAmQwAIB0AAJcMACA8AACmEAAg0gQBAKQJACHaBEAApwkAIegEAQCkCQAh6QQBAKQJACHyBEAApgkAIfMEQACnCQAh9wQBAKQJACGUBQAAkgztBSKiBQEApAkAIe4FAACTDO4FIu8FAgC2CQAh8AUCALsKACHxBQEApAkAIfIFIAD1CQAhEwYAAJQMACAHAACVDAAgCgAAlgwAIA8AAJkMACAdAACXDAAg0gQBAKQJACHaBEAApwkAIegEAQCkCQAh6QQBAKQJACHyBEAApgkAIfMEQACnCQAh9wQBAKQJACGUBQAAkgztBSKiBQEApAkAIe4FAACTDO4FIu8FAgC2CQAh8AUCALsKACHxBQEApAkAIfIFIAD1CQAhAwAAAAUAIEMAAKIQACBEAACpEAAgIQAAAAUAIAQAAMwMACAFAADNDAAgBgAAzgwAIAcAAM8MACAMAADSDAAgFwAA0wwAIB8AANEMACA8AACpEAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_BQEAtAkAIR8EAADMDAAgBQAAzQwAIAYAAM4MACAHAADPDAAgDAAA0gwAIBcAANMMACAfAADRDAAg0gQBAKQJACHYBAAAywz4BSLaBEAApwkAIegEAQCkCQAh6QQBAKQJACHvBEAApgkAIfIEQACmCQAh8wRAAKcJACH3BAEAtAkAIaIFAQCkCQAhugUCALYJACHxBQEApAkAIfMFAQC0CQAh9AUCALYJACH1BQIAtgkAIfYFAgC2CQAh-AVAAKYJACH5BUAApgkAIfoFIAD1CQAh-wUgAPUJACH8BSAA9QkAIf0FAgC2CQAh_gUgAPUJACH_BQEAtAkAIR0GAACVDwAgDAAAnQ8AICQAAKAPACAlAACWDwAgJgAAlw8AICcAAJgPACAoAACZDwAgKQAAmg8AICoAAJsPACArAACeDwAgLAAAnw8AIC0AAKEPACAuAACiDwAgNQAAow8AIDYAAKQPACDSBAEAAAAB0wQBAAAAAdQEAQAAAAHYBAAAAKQGAtoEQAAAAAHyBEAAAAAB8wRAAAAAAZcFAAAApQYCggYBAAAAAaAGAQAAAAGiBgAAAKIGAqUGIAAAAAGmBiAAAAABpwZAAAAAAQIAAAABACBDAACqEAAgHwQAAJENACAFAACKDQAgBgAAiw0AIAcAAIwNACAMAACPDQAgFwAAkA0AIB4AAI0NACDSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHxBQEAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABAgAAAAcAIEMAAKwQACAO0gQBAAAAAdgEAAAA2QUC2gRAAAAAAfMEQAAAAAH-BEAAAAABkQUBAAAAAZIFAQAAAAG4BQEAAAAB1AVAAAAAAdUFAQAAAAHXBQIAAAAB2QVAAAAAAdoFQAAAAAHbBQIAAAABAwAAABsAIEMAAKoQACBEAACxEAAgHwAAABsAIAYAAOUNACAMAADtDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACApAADqDQAgKgAA6w0AICsAAO4NACAsAADvDQAgLQAA8Q0AIC4AAPINACA1AADzDQAgNgAA9A0AIDwAALEQACDSBAEApAkAIdMEAQCkCQAh1AQBAKQJACHYBAAA4w2kBiLaBEAApwkAIfIEQACmCQAh8wRAAKcJACGXBQAA5A2lBiKCBgEAtAkAIaAGAQC0CQAhogYAAOINogYipQYgAPUJACGmBiAA9QkAIacGQACmCQAhHQYAAOUNACAMAADtDQAgJAAA8A0AICUAAOYNACAmAADnDQAgJwAA6A0AICgAAOkNACApAADqDQAgKgAA6w0AICsAAO4NACAsAADvDQAgLQAA8Q0AIC4AAPINACA1AADzDQAgNgAA9A0AINIEAQCkCQAh0wQBAKQJACHUBAEApAkAIdgEAADjDaQGItoEQACnCQAh8gRAAKYJACHzBEAApwkAIZcFAADkDaUGIoIGAQC0CQAhoAYBALQJACGiBgAA4g2iBiKlBiAA9QkAIaYGIAD1CQAhpwZAAKYJACEDAAAABQAgQwAArBAAIEQAALQQACAhAAAABQAgBAAAzAwAIAUAAM0MACAGAADODAAgBwAAzwwAIAwAANIMACAXAADTDAAgHgAA0AwAIDwAALQQACDSBAEApAkAIdgEAADLDPgFItoEQACnCQAh6AQBAKQJACHpBAEApAkAIe8EQACmCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhogUBAKQJACG6BQIAtgkAIfEFAQCkCQAh8wUBALQJACH0BQIAtgkAIfUFAgC2CQAh9gUCALYJACH4BUAApgkAIfkFQACmCQAh-gUgAPUJACH7BSAA9QkAIfwFIAD1CQAh_QUCALYJACH-BSAA9QkAIf8FAQC0CQAhHwQAAMwMACAFAADNDAAgBgAAzgwAIAcAAM8MACAMAADSDAAgFwAA0wwAIB4AANAMACDSBAEApAkAIdgEAADLDPgFItoEQACnCQAh6AQBAKQJACHpBAEApAkAIe8EQACmCQAh8gRAAKYJACHzBEAApwkAIfcEAQC0CQAhogUBAKQJACG6BQIAtgkAIfEFAQCkCQAh8wUBALQJACH0BQIAtgkAIfUFAgC2CQAh9gUCALYJACH4BUAApgkAIfkFQACmCQAh-gUgAPUJACH7BSAA9QkAIfwFIAD1CQAh_QUCALYJACH-BSAA9QkAIf8FAQC0CQAhDAgAAMcLACALAADICwAg0gQBAAAAAdQEAQAAAAHYBAAAAN0FAv4EQAAAAAG4BQEAAAAB1QUBAAAAAd0FAQAAAAHeBUAAAAAB3wVAAAAAAeAFQAAAAAECAAAARgAgQwAAtRAAIB0GAACVDwAgHwAAnA8AICQAAKAPACAlAACWDwAgJgAAlw8AICcAAJgPACAoAACZDwAgKQAAmg8AICoAAJsPACArAACeDwAgLAAAnw8AIC0AAKEPACAuAACiDwAgNQAAow8AIDYAAKQPACDSBAEAAAAB0wQBAAAAAdQEAQAAAAHYBAAAAKQGAtoEQAAAAAHyBEAAAAAB8wRAAAAAAZcFAAAApQYCggYBAAAAAaAGAQAAAAGiBgAAAKIGAqUGIAAAAAGmBiAAAAABpwZAAAAAAQIAAAABACBDAAC3EAAgHwQAAJENACAFAACKDQAgBgAAiw0AIAcAAIwNACAXAACQDQAgHgAAjQ0AIB8AAI4NACDSBAEAAAAB2AQAAAD4BQLaBEAAAAAB6AQBAAAAAekEAQAAAAHvBEAAAAAB8gRAAAAAAfMEQAAAAAH3BAEAAAABogUBAAAAAboFAgAAAAHxBQEAAAAB8wUBAAAAAfQFAgAAAAH1BQIAAAAB9gUCAAAAAfgFQAAAAAH5BUAAAAAB-gUgAAAAAfsFIAAAAAH8BSAAAAAB_QUCAAAAAf4FIAAAAAH_BQEAAAABAgAAAAcAIEMAALkQACAJ0gQBAAAAAdgEAAAA1AUC2gRAAAAAAfMEQAAAAAHPBQEAAAAB0AUBAAAAAdEFAQAAAAHSBQEAAAAB1AVAAAAAAQTSBAEAAAABkAWAAAAAAZkFAAAAtwUCtwVAAAAAAQMAAAAZACBDAAC1EAAgRAAAvxAAIA4AAAAZACAIAAC4CwAgCwAAuQsAIDwAAL8QACDSBAEApAkAIdQEAQCkCQAh2AQAALcL3QUi_gRAAKYJACG4BQEApAkAIdUFAQC0CQAh3QUBAKQJACHeBUAApwkAId8FQACmCQAh4AVAAKYJACEMCAAAuAsAIAsAALkLACDSBAEApAkAIdQEAQCkCQAh2AQAALcL3QUi_gRAAKYJACG4BQEApAkAIdUFAQC0CQAh3QUBAKQJACHeBUAApwkAId8FQACmCQAh4AVAAKYJACEDAAAAGwAgQwAAtxAAIEQAAMIQACAfAAAAGwAgBgAA5Q0AIB8AAOwNACAkAADwDQAgJQAA5g0AICYAAOcNACAnAADoDQAgKAAA6Q0AICkAAOoNACAqAADrDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAgPAAAwhAAINIEAQCkCQAh0wQBAKQJACHUBAEApAkAIdgEAADjDaQGItoEQACnCQAh8gRAAKYJACHzBEAApwkAIZcFAADkDaUGIoIGAQC0CQAhoAYBALQJACGiBgAA4g2iBiKlBiAA9QkAIaYGIAD1CQAhpwZAAKYJACEdBgAA5Q0AIB8AAOwNACAkAADwDQAgJQAA5g0AICYAAOcNACAnAADoDQAgKAAA6Q0AICkAAOoNACAqAADrDQAgKwAA7g0AICwAAO8NACAtAADxDQAgLgAA8g0AIDUAAPMNACA2AAD0DQAg0gQBAKQJACHTBAEApAkAIdQEAQCkCQAh2AQAAOMNpAYi2gRAAKcJACHyBEAApgkAIfMEQACnCQAhlwUAAOQNpQYiggYBALQJACGgBgEAtAkAIaIGAADiDaIGIqUGIAD1CQAhpgYgAPUJACGnBkAApgkAIQMAAAAFACBDAAC5EAAgRAAAxRAAICEAAAAFACAEAADMDAAgBQAAzQwAIAYAAM4MACAHAADPDAAgFwAA0wwAIB4AANAMACAfAADRDAAgPAAAxRAAINIEAQCkCQAh2AQAAMsM-AUi2gRAAKcJACHoBAEApAkAIekEAQCkCQAh7wRAAKYJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGiBQEApAkAIboFAgC2CQAh8QUBAKQJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_wUBALQJACEfBAAAzAwAIAUAAM0MACAGAADODAAgBwAAzwwAIBcAANMMACAeAADQDAAgHwAA0QwAINIEAQCkCQAh2AQAAMsM-AUi2gRAAKcJACHoBAEApAkAIekEAQCkCQAh7wRAAKYJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGiBQEApAkAIboFAgC2CQAh8QUBAKQJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_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-AVAAAAAAfkFQAAAAAH6BSAAAAAB-wUgAAAAAfwFIAAAAAH9BQIAAAAB_gUgAAAAAf8FAQAAAAECAAAABwAgQwAA8BAAIBQIAACuCwAgCwAArwsAIA4AALALACAPAACxCwAgEgAAswsAINIEAQAAAAHYBAAAANkFAtoEQAAAAAHzBEAAAAAB_gRAAAAAAZEFAQAAAAGSBQEAAAABuAUBAAAAAdQFQAAAAAHVBQEAAAAB1gUBAAAAAdcFAgAAAAHZBUAAAAAB2gVAAAAAAdsFAgAAAAECAAAAHwAgQwAA8hAAIAMAAAAFACBDAADwEAAgRAAA9hAAICEAAAAFACAEAADMDAAgBQAAzQwAIAYAAM4MACAHAADPDAAgDAAA0gwAIB4AANAMACAfAADRDAAgPAAA9hAAINIEAQCkCQAh2AQAAMsM-AUi2gRAAKcJACHoBAEApAkAIekEAQCkCQAh7wRAAKYJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGiBQEApAkAIboFAgC2CQAh8QUBAKQJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_wUBALQJACEfBAAAzAwAIAUAAM0MACAGAADODAAgBwAAzwwAIAwAANIMACAeAADQDAAgHwAA0QwAINIEAQCkCQAh2AQAAMsM-AUi2gRAAKcJACHoBAEApAkAIekEAQCkCQAh7wRAAKYJACHyBEAApgkAIfMEQACnCQAh9wQBALQJACGiBQEApAkAIboFAgC2CQAh8QUBAKQJACHzBQEAtAkAIfQFAgC2CQAh9QUCALYJACH2BQIAtgkAIfgFQACmCQAh-QVAAKYJACH6BSAA9QkAIfsFIAD1CQAh_AUgAPUJACH9BQIAtgkAIf4FIAD1CQAh_wUBALQJACEDAAAAHQAgQwAA8hAAIEQAAPkQACAWAAAAHQAgCAAAiwsAIAsAAIwLACAOAACNCwAgDwAAjgsAIBIAAJALACA8AAD5EAAg0gQBAKQJACHYBAAAigvZBSLaBEAApwkAIfMEQACnCQAh_gRAAKcJACGRBQEAtAkAIZIFAQC0CQAhuAUBAKQJACHUBUAApgkAIdUFAQCkCQAh1gUBALQJACHXBQIAtgkAIdkFQACmCQAh2gVAAKYJACHbBQIAtgkAIRQIAACLCwAgCwAAjAsAIA4AAI0LACAPAACOCwAgEgAAkAsAINIEAQCkCQAh2AQAAIoL2QUi2gRAAKcJACHzBEAApwkAIf4EQACnCQAhkQUBALQJACGSBQEAtAkAIbgFAQCkCQAh1AVAAKYJACHVBQEApAkAIdYFAQC0CQAh1wUCALYJACHZBUAApgkAIdoFQACmCQAh2wUCALYJACEUCAAArgsAIAsAAK8LACAOAACwCwAgDwAAsQsAIBEAALILACDSBAEAAAAB2AQAAADZBQLaBEAAAAAB8wRAAAAAAf4EQAAAAAGRBQEAAAABkgUBAAAAAbgFAQAAAAHUBUAAAAAB1QUBAAAAAdYFAQAAAAHXBQIAAAAB2QVAAAAAAdoFQAAAAAHbBQIAAAABAgAAAB8AIEMAAPoQACADAAAAHQAgQwAA-hAAIEQAAP4QACAWAAAAHQAgCAAAiwsAIAsAAIwLACAOAACNCwAgDwAAjgsAIBEAAI8LACA8AAD-EAAg0gQBAKQJACHYBAAAigvZBSLaBEAApwkAIfMEQACnCQAh_gRAAKcJACGRBQEAtAkAIZIFAQC0CQAhuAUBAKQJACHUBUAApgkAIdUFAQCkCQAh1gUBALQJACHXBQIAtgkAIdkFQACmCQAh2gVAAKYJACHbBQIAtgkAIRQIAACLCwAgCwAAjAsAIA4AAI0LACAPAACOCwAgEQAAjwsAINIEAQCkCQAh2AQAAIoL2QUi2gRAAKcJACHzBEAApwkAIf4EQACnCQAhkQUBALQJACGSBQEAtAkAIbgFAQCkCQAh1AVAAKYJACHVBQEApAkAIdYFAQC0CQAh1wUCALYJACHZBUAApgkAIdoFQACmCQAh2wUCALYJACEQAQAAxQ0AICAAAMYNACAhAADHDQAgJAAAyQ0AINIEAQAAAAHTBAEAAAAB2gRAAAAAAekEAQAAAAHyBEAAAAAB8wRAAAAAAfcEAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBiAAAAABjwYBAAAAAQIAAACVAgAgQwAA_xAAIA_SBAEAAAAB2AQAAAClBQLaBEAAAAAB8wRAAAAAAfkEAQAAAAGQBYAAAAABlwUAAACXBQKiBQEAAAABpQUEAAAAAaYFAQAAAAGnBQEAAAABqAUBAAAAAakFAQAAAAGqBUAAAAABqwVAAAAAAQMAAAADACBDAAD_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_Ii6DASM1iAEkNpUBKwYBAAENABwgCAMhVAUjVhkkXhoJBAkDBQoDBgACBwABDEgKDQAYF0sNHg4EH0cLAggAAwkABQcGAAIHAAEKEAYNABcPQQkdPxIeQAQDCQAFDQAWHBQHAwoABg0AFRsYCAIUAAkaAAcGCQAFDQAUEAAKEy4IFjAQGTURBwgAAwsAAQ0ADw4aCw8lCREnDRIrDgQIAAMLHAEMIAoNAAwBDCEAAggAAxAACgEQAAoCDywAEi0AAhQACRUxAQIUAAkYABIDCQAFDQATFzYRARc3AAITOAAZOQABGzoAARw7AAMPRAAdQgAeQwAFBUwADE8AF1AAHk0AH04AAwYAAg0AGyRaGgMGWwIiAAEjXBkBJF0AAyBfACFgACRhAAEiAAEBIgABASIAAQEiAAEBIgABASIAAQEihAEBBA0AKi8AATEAJTSOAScCDQAmMIkBJAEwigEAAjIAJDMAKAINACkwjwEnATCQAQABNJEBAAEiAAEODJwBAB-bAQAknwEAJZYBACaXAQAnmAEAKJkBACqaAQArnQEALJ4BAC2gAQAuoQEANaIBADajAQAAAAADDQAxSQAySgAzAAAAAw0AMUkAMkoAMwEiAAEBIgABAw0AOEkAOUoAOgAAAAMNADhJADlKADoBIgABASIAAQMNAD9JAEBKAEEAAAADDQA_SQBASgBBASIAAQEiAAEDDQBGSQBHSgBIAAAAAw0ARkkAR0oASAAAAAMNAE5JAE9KAFAAAAADDQBOSQBPSgBQAQEAAQEBAAEDDQBVSQBWSgBXAAAAAw0AVUkAVkoAVwEiAAEBIgABBQ0AXEkAX0oAYKsBAF2sAQBeAAAAAAAFDQBcSQBfSgBgqwEAXawBAF4DBM8CAwYAAgcAAQME1QIDBgACBwABBQ0AZUkAaEoAaasBAGasAQBnAAAAAAAFDQBlSQBoSgBpqwEAZqwBAGcCBgACBwABAgYAAgcAAQUNAG5JAHFKAHKrAQBvrAEAcAAAAAAABQ0AbkkAcUoAcqsBAG-sAQBwAQkABQEJAAUDDQB3SQB4SgB5AAAAAw0Ad0kAeEoAeQEKAAYBCgAGBQ0AfkkAgQFKAIIBqwEAf6wBAIABAAAAAAAFDQB-SQCBAUoAggGrAQB_rAEAgAEBCQAFAQkABQUNAIcBSQCKAUoAiwGrAQCIAawBAIkBAAAAAAAFDQCHAUkAigFKAIsBqwEAiAGsAQCJAQIIAAMJAAUCCAADCQAFBQ0AkAFJAJMBSgCUAasBAJEBrAEAkgEAAAAAAAUNAJABSQCTAUoAlAGrAQCRAawBAJIBAggAAwvXAwECCAADC90DAQMNAJkBSQCaAUoAmwEAAAADDQCZAUkAmgFKAJsBAwgAAwsAAQ7vAwsDCAADCwABDvUDCwUNAKABSQCjAUoApAGrAQChAawBAKIBAAAAAAAFDQCgAUkAowFKAKQBqwEAoQGsAQCiAQIJAAUQAAoCCQAFEAAKAw0AqQFJAKoBSgCrAQAAAAMNAKkBSQCqAUoAqwECFAAJGgAHAhQACRoABwMNALABSQCxAUoAsgEAAAADDQCwAUkAsQFKALIBAhQACRWzBAECFAAJFbkEAQUNALcBSQC6AUoAuwGrAQC4AawBALkBAAAAAAAFDQC3AUkAugFKALsBqwEAuAGsAQC5AQIUAAkYABICFAAJGAASBQ0AwAFJAMMBSgDEAasBAMEBrAEAwgEAAAAAAAUNAMABSQDDAUoAxAGrAQDBAawBAMIBAggAAxAACgIIAAMQAAoFDQDJAUkAzAFKAM0BqwEAygGsAQDLAQAAAAAABQ0AyQFJAMwBSgDNAasBAMoBrAEAywEBEAAKARAACgMNANIBSQDTAUoA1AEAAAADDQDSAUkA0wFKANQBAQYAAgEGAAIDDQDZAUkA2gFKANsBAAAAAw0A2QFJANoBSgDbAQMGpQUCIgABI6YFGQMGrAUCIgABI60FGQUNAOABSQDjAUoA5AGrAQDhAawBAOIBAAAAAAAFDQDgAUkA4wFKAOQBqwEA4QGsAQDiAQAAAAUNAOoBSQDtAUoA7gGrAQDrAawBAOwBAAAAAAAFDQDqAUkA7QFKAO4BqwEA6wGsAQDsAQEiAAEBIgABAw0A8wFJAPQBSgD1AQAAAAMNAPMBSQD0AUoA9QEBIu4FAQEi9AUBAw0A-gFJAPsBSgD8AQAAAAMNAPoBSQD7AUoA_AEBIgABASIAAQMNAIECSQCCAkoAgwIAAAADDQCBAkkAggJKAIMCASIAAQEiAAEFDQCIAkkAiwJKAIwCqwEAiQKsAQCKAgAAAAAABQ0AiAJJAIsCSgCMAqsBAIkCrAEAigIAAAMNAJECSQCSAkoAkwIAAAADDQCRAkkAkgJKAJMCAAADDQCYAkkAmQJKAJoCAAAAAw0AmAJJAJkCSgCaAgIvAAExACUCLwABMQAlBQ0AnwJJAKICSgCjAqsBAKACrAEAoQIAAAAAAAUNAJ8CSQCiAkoAowKrAQCgAqwBAKECAjIAJDMAKAIyACQzACgDDQCoAkkAqQJKAKoCAAAAAw0AqAJJAKkCSgCqAgAAAAMNALACSQCxAkoAsgIAAAADDQCwAkkAsQJKALICNwIBOKQBATmmAQE6pwEBO6gBAT2qAQE-rAEtP60BLkCvAQFBsQEtQrIBL0WzAQFGtAEBR7UBLUu4ATBMuQE0TboBHU67AR1PvAEdUL0BHVG-AR1SwAEdU8IBLVTDATVVxQEdVscBLVfIATZYyQEdWcoBHVrLAS1bzgE3XM8BO13QAR9e0QEfX9IBH2DTAR9h1AEfYtYBH2PYAS1k2QE8ZdsBH2bdAS1n3gE9aN8BH2ngAR9q4QEta-QBPmzlAUJt5gEebucBHm_oAR5w6QEeceoBHnLsAR5z7gEtdO8BQ3XxAR528wEtd_QBRHj1AR559gEeevcBLXv6AUV8-wFJff0BSn7-AUp_gQJKgAGCAkqBAYMCSoIBhQJKgwGHAi2EAYgCS4UBigJKhgGMAi2HAY0CTIgBjgJKiQGPAkqKAZACLYsBkwJNjAGUAlGNAZYCAo4BlwICjwGZAgKQAZoCApEBmwICkgGdAgKTAZ8CLZQBoAJSlQGiAgKWAaQCLZcBpQJTmAGmAgKZAacCApoBqAItmwGrAlScAawCWJ0BrgIhngGvAiGfAbECIaABsgIhoQGzAiGiAbUCIaMBtwItpAG4AlmlAboCIaYBvAItpwG9AlqoAb4CIakBvwIhqgHAAi2tAcMCW64BxAJhrwHFAgOwAcYCA7EBxwIDsgHIAgOzAckCA7QBywIDtQHNAi22Ac4CYrcB0QIDuAHTAi25AdQCY7oB1gIDuwHXAgO8AdgCLb0B2wJkvgHcAmq_Ad0CBcAB3gIFwQHfAgXCAeACBcMB4QIFxAHjAgXFAeUCLcYB5gJrxwHoAgXIAeoCLckB6wJsygHsAgXLAe0CBcwB7gItzQHxAm3OAfICc88B9AIG0AH1AgbRAfcCBtIB-AIG0wH5AgbUAfsCBtUB_QIt1gH-AnTXAYADBtgBggMt2QGDA3XaAYQDBtsBhQMG3AGGAy3dAYkDdt4BigN63wGLAwfgAYwDB-EBjQMH4gGOAwfjAY8DB-QBkQMH5QGTAy3mAZQDe-cBlgMH6AGYAy3pAZkDfOoBmgMH6wGbAwfsAZwDLe0BnwN97gGgA4MB7wGhAxLwAaIDEvEBowMS8gGkAxLzAaUDEvQBpwMS9QGpAy32AaoDhAH3AawDEvgBrgMt-QGvA4UB-gGwAxL7AbEDEvwBsgMt_QG1A4YB_gG2A4wB_wG3AwSAArgDBIECuQMEggK6AwSDArsDBIQCvQMEhQK_Ay2GAsADjQGHAsIDBIgCxAMtiQLFA44BigLGAwSLAscDBIwCyAMtjQLLA48BjgLMA5UBjwLNAwuQAs4DC5ECzwMLkgLQAwuTAtEDC5QC0wMLlQLVAy2WAtYDlgGXAtkDC5gC2wMtmQLcA5cBmgLeAwubAt8DC5wC4AMtnQLjA5gBngLkA5wBnwLlAwqgAuYDCqEC5wMKogLoAwqjAukDCqQC6wMKpQLtAy2mAu4DnQGnAvEDCqgC8wMtqQL0A54BqgL2AwqrAvcDCqwC-AMtrQL7A58BrgL8A6UBrwL9AwmwAv4DCbEC_wMJsgKABAmzAoEECbQCgwQJtQKFBC22AoYEpgG3AogECbgCigQtuQKLBKcBugKMBAm7Ao0ECbwCjgQtvQKRBKgBvgKSBKwBvwKTBAjAApQECMEClQQIwgKWBAjDApcECMQCmQQIxQKbBC3GApwErQHHAp4ECMgCoAQtyQKhBK4BygKiBAjLAqMECMwCpAQtzQKnBK8BzgKoBLMBzwKpBBDQAqoEENECqwQQ0gKsBBDTAq0EENQCrwQQ1QKxBC3WArIEtAHXArUEENgCtwQt2QK4BLUB2gK6BBDbArsEENwCvAQt3QK_BLYB3gLABLwB3wLBBBHgAsIEEeECwwQR4gLEBBHjAsUEEeQCxwQR5QLJBC3mAsoEvQHnAswEEegCzgQt6QLPBL4B6gLQBBHrAtEEEewC0gQt7QLVBL8B7gLWBMUB7wLXBA3wAtgEDfEC2QQN8gLaBA3zAtsEDfQC3QQN9QLfBC32AuAExgH3AuIEDfgC5AQt-QLlBMcB-gLmBA37AucEDfwC6AQt_QLrBMgB_gLsBM4B_wLtBA6AA-4EDoED7wQOggPwBA6DA_EEDoQD8wQOhQP1BC2GA_YEzwGHA_gEDogD-gQtiQP7BNABigP8BA6LA_0EDowD_gQtjQOBBdEBjgOCBdUBjwOEBRmQA4UFGZEDhwUZkgOIBRmTA4kFGZQDiwUZlQONBS2WA44F1gGXA5AFGZgDkgUtmQOTBdcBmgOUBRmbA5UFGZwDlgUtnQOZBdgBngOaBdwBnwObBRqgA5wFGqEDnQUaogOeBRqjA58FGqQDoQUapQOjBS2mA6QF3QGnA6gFGqgDqgUtqQOrBd4BqgOuBRqrA68FGqwDsAUtrQOzBd8BrgO0BeUBrwO2BeYBsAO3BeYBsQO6BeYBsgO7BeYBswO8BeYBtAO-BeYBtQPABS22A8EF5wG3A8MF5gG4A8UFLbkDxgXoAboDxwXmAbsDyAXmAbwDyQUtvQPMBekBvgPNBe8BvwPOBSLAA88FIsED0AUiwgPRBSLDA9IFIsQD1AUixQPWBS3GA9cF8AHHA9kFIsgD2wUtyQPcBfEBygPdBSLLA94FIswD3wUtzQPiBfIBzgPjBfYBzwPkBSPQA-UFI9ED5gUj0gPnBSPTA-gFI9QD6gUj1QPsBS3WA-0F9wHXA_AFI9gD8gUt2QPzBfgB2gP1BSPbA_YFI9wD9wUt3QP6BfkB3gP7Bf0B3wP8BSDgA_0FIOED_gUg4gP_BSDjA4AGIOQDggYg5QOEBi3mA4UG_gHnA4cGIOgDiQYt6QOKBv8B6gOLBiDrA4wGIOwDjQYt7QOQBoAC7gORBoQC7wOSBivwA5MGK_EDlAYr8gOVBivzA5YGK_QDmAYr9QOaBi32A5sGhQL3A50GK_gDnwYt-QOgBoYC-gOhBiv7A6IGK_wDowYt_QOmBocC_gOnBo0C_wOpBiWABKoGJYEErQYlggSuBiWDBK8GJYQEsQYlhQSzBi2GBLQGjgKHBLYGJYgEuAYtiQS5Bo8CigS6BiWLBLsGJYwEvAYtjQS_BpACjgTABpQCjwTCBiiQBMMGKJEExgYokgTHBiiTBMgGKJQEygYolQTMBi2WBM0GlQKXBM8GKJgE0QYtmQTSBpYCmgTTBiibBNQGKJwE1QYtnQTYBpcCngTZBpsCnwTaBiSgBNsGJKEE3AYkogTdBiSjBN4GJKQE4AYkpQTiBi2mBOMGnAKnBOUGJKgE5wYtqQToBp0CqgTpBiSrBOoGJKwE6wYtrQTuBp4CrgTvBqQCrwTwBiewBPEGJ7EE8gYnsgTzBiezBPQGJ7QE9gYntQT4Bi22BPkGpQK3BPsGJ7gE_QYtuQT-BqYCugT_Bie7BIAHJ7wEgQctvQSEB6cCvgSFB6sCvwSHB6wCwASIB6wCwQSLB6wCwgSMB6wCwwSNB6wCxASPB6wCxQSRBy3GBJIHrQLHBJQHrALIBJYHLckElweuAsoEmAesAssEmQesAswEmgctzQSdB68CzgSeB7MC"
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
  BlogCategoryScalarFieldEnum: () => BlogCategoryScalarFieldEnum,
  BlogPostScalarFieldEnum: () => BlogPostScalarFieldEnum,
  BlogPostTagScalarFieldEnum: () => BlogPostTagScalarFieldEnum,
  BlogTagScalarFieldEnum: () => BlogTagScalarFieldEnum,
  CandidateProfileScalarFieldEnum: () => CandidateProfileScalarFieldEnum,
  CompanyScalarFieldEnum: () => CompanyScalarFieldEnum,
  ContactMessageScalarFieldEnum: () => ContactMessageScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  IdempotencyKeyScalarFieldEnum: () => IdempotencyKeyScalarFieldEnum,
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
import * as runtime2 from "@prisma/client/runtime/client";
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
  UserConsent: "UserConsent",
  IdempotencyKey: "IdempotencyKey",
  BlogCategory: "BlogCategory",
  BlogTag: "BlogTag",
  BlogPost: "BlogPost",
  BlogPostTag: "BlogPostTag",
  ContactMessage: "ContactMessage"
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
  updatedAt: "updatedAt",
  isVisibleToRecruiters: "isVisibleToRecruiters"
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
var IdempotencyKeyScalarFieldEnum = {
  id: "id",
  key: "key",
  userId: "userId",
  endpoint: "endpoint",
  requestHash: "requestHash",
  response: "response",
  statusCode: "statusCode",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var BlogCategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogTagScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt"
};
var BlogPostScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  excerpt: "excerpt",
  content: "content",
  coverImage: "coverImage",
  status: "status",
  readingTimeMinutes: "readingTimeMinutes",
  publishedAt: "publishedAt",
  authorId: "authorId",
  categoryId: "categoryId",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlogPostTagScalarFieldEnum = {
  postId: "postId",
  tagId: "tagId"
};
var ContactMessageScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  status: "status",
  readAt: "readAt",
  createdAt: "createdAt"
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
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/errors/handlePrismaError.ts
var handlePrismaError = (error) => {
  if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Invalid request data.",
      errorCode: "PRISMA_VALIDATION_ERROR"
    };
  }
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          statusCode: StatusCodes.CONFLICT,
          message: "Resource already exists.",
          errorCode: error.code
        };
      case "P2003":
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Foreign key constraint failed.",
          errorCode: error.code
        };
      case "P2025":
        return {
          statusCode: StatusCodes.NOT_FOUND,
          message: "Resource not found.",
          errorCode: error.code
        };
      default:
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Database request failed.",
          errorCode: error.code
        };
    }
  }
  if (error instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (error.errorCode === "P1000") {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Database authentication failed.",
        errorCode: "P1000"
      };
    }
    if (error.errorCode === "P1001") {
      return {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
        message: "Can't reach database server.",
        errorCode: "P1001"
      };
    }
    return {
      statusCode: StatusCodes.SERVICE_UNAVAILABLE,
      message: "Database connection failed.",
      errorCode: error.errorCode ?? "PRISMA_INIT_ERROR"
    };
  }
  if (error instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Database query failed.",
      errorCode: "PRISMA_UNKNOWN_ERROR"
    };
  }
  return null;
};

// src/app/errors/handleZodError.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";
var handleZodError = (error) => {
  return {
    statusCode: StatusCodes2.BAD_REQUEST,
    message: "Validation failed",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }))
  };
};

// src/app/middlewares/globalErrorHandler.ts
var globalErrorHandler = (error, _req, res, _next) => {
  let statusCode = StatusCodes3.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorCode;
  let errors = [];
  if (error instanceof appError_default) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode;
    errors = Array.isArray(error.details) ? error.details : error.details !== void 0 ? [error.details] : [];
  } else if (error instanceof ZodError) {
    const zodError = handleZodError(error);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.details;
  } else if (error instanceof ZodError) {
    const zodError = handleZodError(error);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.details;
  } else if (error instanceof multer.MulterError) {
    const tooLarge = error.code === "LIMIT_FILE_SIZE";
    statusCode = tooLarge ? StatusCodes3.REQUEST_TOO_LONG : StatusCodes3.BAD_REQUEST;
    message = tooLarge ? "The uploaded file is too large." : error.message;
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
import { StatusCodes as StatusCodes4 } from "http-status-codes";
var notFound = (req, res) => {
  res.status(StatusCodes4.NOT_FOUND).json({
    success: false,
    message: "Route not found.",
    errors: [{ path: req.originalUrl }]
  });
};

// src/app/middlewares/rateLimiters.ts
import { timingSafeEqual } from "crypto";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { StatusCodes as StatusCodes5 } from "http-status-codes";

// src/lib/radis.ts
import Redis from "ioredis";
var redis = config_default.app.env !== "production" || !config_default.redis.url ? new Redis({ enableReadyCheck: false, maxRetriesPerRequest: 0 }) : new Redis(config_default.redis.url, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3
});
if (config_default.app.env === "production") {
  redis.on("error", (error) => {
    console.error("[Redis] Connection error:", error.message);
  });
}

// src/app/middlewares/rate-limit-store.ts
var PREFIX = "ratelimit";
var INCR_WITH_TTL_LUA = `
local hits = redis.call('INCR', KEYS[1])
if hits == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return hits
`;
var RedisStore = class {
  prefix = PREFIX;
  windowMs;
  storeName;
  /**
   * @param windowMs - the rate-limit window in milliseconds; converted to
   *   seconds for Redis EXPIRE.
   * @param storeName - short identifier used in the Redis key prefix so
   *   different limiters don't share counters.
   */
  constructor(windowMs, storeName) {
    this.windowMs = windowMs;
    this.storeName = storeName;
  }
  /** No-op init — the client is constructed eagerly in radis.ts. */
  init(_options) {
  }
  async increment(key) {
    const fullKey = `${this.prefix}:${this.storeName}:${key}`;
    const ttlSeconds = Math.max(1, Math.ceil(this.windowMs / 1e3));
    try {
      let hits;
      const maybeEval = redis.eval;
      if (typeof maybeEval === "function") {
        hits = await redis.eval(INCR_WITH_TTL_LUA, 1, fullKey, ttlSeconds);
      } else {
        hits = await redis.incr(fullKey);
        if (hits === 1) {
          await redis.expire(fullKey, ttlSeconds);
        }
      }
      const resetTime = new Date(Date.now() + ttlSeconds * 1e3);
      return { totalHits: hits, resetTime };
    } catch (error) {
      console.warn("[RedisStore] increment failed; failing open:", error);
      return { totalHits: 0, resetTime: void 0 };
    }
  }
  async decrement(key) {
    const fullKey = `${this.prefix}:${this.storeName}:${key}`;
    try {
      const maybeDecr = redis.decr;
      if (typeof maybeDecr === "function") {
        await redis.decr(fullKey);
      }
    } catch (error) {
      console.warn("[RedisStore] decrement failed; failing open:", error);
    }
  }
  async resetKey(key) {
    const fullKey = `${this.prefix}:${this.storeName}:${key}`;
    try {
      await redis.del(fullKey);
    } catch (error) {
      console.warn("[RedisStore] resetKey failed; failing open:", error);
    }
  }
  async resetAll() {
    try {
      const pattern = `${this.prefix}:*`;
      const scan = redis.scan;
      if (typeof scan === "function") {
        let cursor = "0";
        do {
          const [nextCursor, keys] = await scan(pattern);
          cursor = nextCursor;
          if (keys.length > 0) {
            await redis.del(...keys);
          }
        } while (cursor !== "0");
      }
    } catch (error) {
      console.warn("[RedisStore] resetAll failed; failing open:", error);
    }
  }
  async get(key) {
    const fullKey = `${this.prefix}:${this.storeName}:${key}`;
    try {
      const raw3 = await redis.get(fullKey);
      if (raw3 === null || raw3 === void 0) {
        return void 0;
      }
      const totalHits = Number.parseInt(raw3, 10);
      const maybePttl = redis.pttl;
      let resetTime;
      if (typeof maybePttl === "function") {
        const ttlMs = await redis.pttl(fullKey);
        if (Number.isFinite(ttlMs) && ttlMs > 0) {
          resetTime = new Date(Date.now() + ttlMs);
        }
      }
      return { totalHits: Number.isNaN(totalHits) ? 0 : totalHits, resetTime };
    } catch (error) {
      console.warn("[RedisStore] get failed; failing open:", error);
      return void 0;
    }
  }
  async shutdown() {
  }
};

// src/app/middlewares/rateLimiters.ts
var makeLimiter = (windowMs, baseLimit, message, store, keyType = "ip", skip = () => false) => {
  const limitFn = (_req, _res) => {
    if (process.env.NODE_ENV === "test") {
      const raw3 = Number.parseFloat(
        process.env.RATE_LIMIT_TEST_MULTIPLIER ?? "100"
      );
      if (Number.isFinite(raw3) && raw3 > 0) {
        return Math.max(1, Math.floor(baseLimit * raw3));
      }
    }
    return baseLimit;
  };
  return rateLimit({
    windowMs,
    limit: limitFn,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    skip: (req) => skip(req),
    passOnStoreError: true,
    message: {
      success: false,
      statusCode: StatusCodes5.TOO_MANY_REQUESTS,
      message
    },
    keyGenerator: (req) => {
      if (keyType === "user" && req.user?.id) {
        return req.user.id;
      }
      return ipKeyGenerator(req.ip ?? "unknown");
    }
  });
};
var isInternalRequest = (req) => {
  const secret = process.env.INTERNAL_API_SECRET;
  const header = req.headers["x-internal-secret"];
  if (!secret || typeof header !== "string") return false;
  const received = Buffer.from(header);
  const expected = Buffer.from(secret);
  return received.length === expected.length && timingSafeEqual(received, expected);
};
var generalRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  300,
  "Too many requests. Please try again later.",
  new RedisStore(15 * 60 * 1e3, "general"),
  "ip",
  isInternalRequest
);
var authRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  10,
  "Too many login attempts. Please try again in 15 minutes.",
  new RedisStore(15 * 60 * 1e3, "auth")
);
var publicRateLimiter = makeLimiter(
  15 * 60 * 1e3,
  20,
  "Too many requests. Please try again later.",
  new RedisStore(15 * 60 * 1e3, "public")
);
var invitationAcceptLimiter = makeLimiter(
  6e4,
  10,
  "Too many invitation actions. Please try again shortly.",
  new RedisStore(6e4, "invitation"),
  "ip"
);
var attemptSubmitLimiter = makeLimiter(
  6e4,
  5,
  "Too many submission attempts. Please try again shortly.",
  new RedisStore(6e4, "attempt-submit"),
  "user"
);
var submissionAnswerLimiter = makeLimiter(
  6e4,
  60,
  "Too many answer submissions. Please try again shortly.",
  new RedisStore(6e4, "submission-answer"),
  "user"
);
var paymentCheckoutLimiter = makeLimiter(
  6e4,
  5,
  "Too many checkout attempts. Please try again shortly.",
  new RedisStore(6e4, "payment-checkout"),
  "user"
);
var contactLimiter = makeLimiter(
  60 * 60 * 1e3,
  5,
  "Too many messages from this connection. Please try again later.",
  new RedisStore(60 * 60 * 1e3, "contact"),
  "ip"
);
var accountActionLimiter = makeLimiter(
  60 * 60 * 1e3,
  10,
  "Too many account requests. Please try again later.",
  new RedisStore(60 * 60 * 1e3, "account-action"),
  "user"
);
var proctoringEventLimiter = makeLimiter(
  6e4,
  120,
  "Too many proctoring events. Please slow down.",
  new RedisStore(6e4, "proctoring-event"),
  "user"
);
var twoFactorLimiter = makeLimiter(
  15 * 60 * 1e3,
  20,
  "Too many verification attempts. Please try again in 15 minutes.",
  new RedisStore(15 * 60 * 1e3, "two-factor"),
  "ip"
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
import express, { Router } from "express";

// src/app/modules/webhook/webhook.controller.ts
import { StatusCodes as StatusCodes8 } from "http-status-codes";

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
import { StatusCodes as StatusCodes7 } from "http-status-codes";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
var adapter = new PrismaPg({ connectionString: config_default.database.url });
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (config_default.app.env !== "production") {
  globalForPrisma.prisma = prisma;
}

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = config_default.stripe.secretKey ? new Stripe(config_default.stripe.secretKey) : null;
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
import { StatusCodes as StatusCodes6 } from "http-status-codes";
var getBaseType = (config3) => typeof config3 === "string" ? config3 : "enum";
var assertValidDepth = (field, maxDepth) => {
  if (field.split(".").length > maxDepth) {
    throw new appError_default(
      StatusCodes6.BAD_REQUEST,
      `Field "${field}" exceeds the maximum allowed nesting depth of ${maxDepth}.`
    );
  }
};
var assertOperatorAllowedForType = (field, operator, type) => {
  const allowed = OPERATORS_BY_TYPE[type] ?? [];
  if (!allowed.includes(operator)) {
    throw new appError_default(
      StatusCodes6.BAD_REQUEST,
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
        StatusCodes6.BAD_REQUEST,
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
          StatusCodes6.BAD_REQUEST,
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
          StatusCodes6.BAD_REQUEST,
          `Invalid decimal value for "${field}": "${raw3}"`
        );
      }
    }
    case "boolean": {
      if (raw3 !== "true" && raw3 !== "false") {
        throw new appError_default(
          StatusCodes6.BAD_REQUEST,
          `"${field}" must be "true" or "false".`
        );
      }
      return raw3 === "true";
    }
    case "date": {
      if (!DATE_STRING_PATTERN.test(raw3)) {
        throw new appError_default(
          StatusCodes6.BAD_REQUEST,
          `Invalid date value for "${field}": "${raw3}". Expected format YYYY-MM-DD.`
        );
      }
      if (!isValidCalendarDate(raw3)) {
        throw new appError_default(
          StatusCodes6.BAD_REQUEST,
          `"${raw3}" is not a real calendar date for "${field}".`
        );
      }
      const date = new Date(raw3);
      if (Number.isNaN(date.getTime())) {
        throw new appError_default(
          StatusCodes6.BAD_REQUEST,
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
  const str3 = String(raw3);
  if (operator === "in" || operator === "notIn") {
    return str3.split(",").map((v) => castSingleValue(v.trim(), field, config3));
  }
  return castSingleValue(str3, field, config3);
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
      StatusCodes6.BAD_REQUEST,
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
      StatusCodes6.BAD_REQUEST,
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
  FREE: { amountMinor: 0, currency: "usd" },
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
      enum: {
        STRIPE: "STRIPE",
        BKASH: "BKASH",
        SSLCOMMERZ: "SSLCOMMERZ"
      }
    },
    createdAt: "date"
  },
  sortableFields: ["createdAt", "amountMinor"],
  selectableFields: Object.keys(PAYMENT_SELECT),
  defaultSelect: PAYMENT_SELECT,
  defaultSortField: "createdAt"
});
var PLAN_RANK = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2
};
var createCheckoutSession = async (userId, companyId, payload) => {
  const pricing = PLAN_PRICING[payload.plan];
  if (!pricing) {
    throw new appError_default(
      StatusCodes7.BAD_REQUEST,
      `Invalid subscription plan: ${payload.plan}`
    );
  }
  const stripe2 = getStripe();
  const clientUrl = config_default.app.clientUrl.split(",")[0]?.trim() || "http://localhost:3000";
  const existingSubscription = await prisma.subscription.findUnique({
    where: { companyId }
  });
  const stillActive = existingSubscription?.status === "ACTIVE" && (!existingSubscription.currentPeriodEnd || existingSubscription.currentPeriodEnd > /* @__PURE__ */ new Date());
  if (existingSubscription && stillActive && PLAN_RANK[existingSubscription.plan] >= PLAN_RANK[payload.plan]) {
    throw new appError_default(
      StatusCodes7.CONFLICT,
      `Your company is already on the ${existingSubscription.plan} plan.`
    );
  }
  if (payload.plan === "FREE") {
    throw new appError_default(
      StatusCodes7.BAD_REQUEST,
      "The FREE plan does not require checkout."
    );
  }
  const payment = await prisma.payment.create({
    data: {
      userId,
      companyId,
      provider: "STRIPE",
      status: "PENDING",
      amountMinor: pricing.amountMinor,
      currency: pricing.currency.toUpperCase(),
      metadata: {
        plan: payload.plan
      }
    }
  });
  try {
    const session = await stripe2.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: pricing.currency,
            product_data: {
              name: `${payload.plan} plan subscription`
            },
            unit_amount: pricing.amountMinor
          },
          quantity: 1
        }
      ],
      success_url: `${clientUrl}/billing/success?paymentId=${payment.id}`,
      cancel_url: `${clientUrl}/billing/cancel?paymentId=${payment.id}`,
      metadata: {
        paymentId: payment.id,
        companyId,
        plan: payload.plan
      },
      payment_intent_data: {
        metadata: {
          paymentId: payment.id,
          companyId,
          plan: payload.plan
        }
      }
    });
    if (!session.url) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failedAt: /* @__PURE__ */ new Date()
        }
      });
      throw new appError_default(
        StatusCodes7.INTERNAL_SERVER_ERROR,
        "Stripe checkout URL was not generated."
      );
    }
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerPaymentId: session.id
      }
    });
    return {
      paymentId: payment.id,
      checkoutUrl: session.url
    };
  } catch (error) {
    if (error instanceof appError_default) {
      throw error;
    }
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failedAt: /* @__PURE__ */ new Date()
      }
    });
    throw new appError_default(
      StatusCodes7.BAD_GATEWAY,
      "Unable to create Stripe checkout session."
    );
  }
};
var markCheckoutPaid = async (session) => {
  const paymentId = session.metadata?.paymentId;
  if (!paymentId) return false;
  const companyId = session.metadata?.companyId;
  const plan = session.metadata?.plan;
  const paymentIntent = session.payment_intent;
  const transactionId = typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: {
        id: paymentId,
        status: { in: ["PENDING", "PROCESSING", "FAILED"] }
      },
      data: {
        status: "PAID",
        paidAt: /* @__PURE__ */ new Date(),
        failedAt: null,
        ...transactionId ? { transactionId } : {}
      }
    });
    if (claimed.count === 0) return false;
    const payment = await tx.payment.findUniqueOrThrow({
      where: { id: paymentId }
    });
    if (companyId && plan) {
      const currentPeriodStart = /* @__PURE__ */ new Date();
      const currentPeriodEnd = new Date(
        currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1e3
      );
      const subscription = await tx.subscription.upsert({
        where: { companyId },
        update: {
          plan,
          status: "ACTIVE",
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false
        },
        create: {
          companyId,
          plan,
          status: "ACTIVE",
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false
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
    return true;
  });
};
var markCheckoutFailed = async (paymentId) => {
  const claimed = await prisma.payment.updateMany({
    where: { id: paymentId, status: { in: ["PENDING", "PROCESSING"] } },
    data: { status: "FAILED", failedAt: /* @__PURE__ */ new Date() }
  });
  if (claimed.count === 0) return;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { userId: true }
  });
  if (!payment) return;
  await prisma.notification.create({
    data: {
      userId: payment.userId,
      title: "Payment Failed",
      message: "Your payment could not be completed. Please try again.",
      type: "PAYMENT_FAILED"
    }
  });
};
var handleStripeWebhook = async (rawBody, signature) => {
  const stripe2 = getStripe();
  if (!config_default.stripe.webhookSecret) {
    throw new appError_default(
      StatusCodes7.SERVICE_UNAVAILABLE,
      "Stripe webhook secret is not configured."
    );
  }
  if (!signature) {
    throw new appError_default(
      StatusCodes7.BAD_REQUEST,
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
      StatusCodes7.BAD_REQUEST,
      "Invalid Stripe webhook signature."
    );
  }
  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id
      }
    }
  });
  if (existingEvent?.processed) {
    return {
      received: true,
      alreadyProcessed: true
    };
  }
  await prisma.paymentWebhookEvent.upsert({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id
      }
    },
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
    if (session.payment_status === "paid") {
      await markCheckoutPaid(session);
    }
  } else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
    const object = event.data.object;
    const paymentId = object.metadata?.paymentId;
    if (paymentId) {
      await markCheckoutFailed(paymentId);
    }
  }
  await prisma.paymentWebhookEvent.update({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id
      }
    },
    data: {
      processed: true,
      processedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    received: true
  };
};
var getMyPayments = async (userId, query) => {
  return paymentQueryBuilder.execute(query, {
    userId
  });
};
var getAllPayments = async (query) => {
  return paymentQueryBuilder.execute(query);
};
var getPaymentById = async (id, requester) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id
    },
    select: PAYMENT_SELECT
  });
  if (!payment) {
    throw new appError_default(
      StatusCodes7.NOT_FOUND,
      "Payment not found."
    );
  }
  if (requester.role !== "ADMIN" && payment.userId !== requester.id) {
    throw new appError_default(
      StatusCodes7.FORBIDDEN,
      "You don't have permission to view this payment."
    );
  }
  return payment;
};
var syncPayment = async (id, requester) => {
  const payment = await getPaymentById(id, requester);
  if (payment.status !== "PENDING" && payment.status !== "PROCESSING") {
    return payment;
  }
  if (!payment.providerPaymentId) {
    return payment;
  }
  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(
      payment.providerPaymentId
    );
  } catch {
    throw new appError_default(
      StatusCodes7.BAD_GATEWAY,
      "Couldn't check the payment with Stripe. Please try again."
    );
  }
  if (session.payment_status === "paid") {
    await markCheckoutPaid(session);
  } else if (session.status === "expired") {
    await markCheckoutFailed(payment.id);
  }
  return getPaymentById(id, requester);
};
var paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  syncPayment
};

// src/app/modules/webhook/webhook.controller.ts
var handleStripeWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const result = await paymentService.handleStripeWebhook(
    req.body,
    signature
  );
  res.status(StatusCodes8.OK).json({
    success: true,
    message: "Webhook processed.",
    data: result
  });
});
var webhookController = {
  handleStripeWebhook: handleStripeWebhook2
};

// src/app/modules/webhook/webhook.routes.ts
var router = Router();
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);
var webhookRoutes = router;

// src/app/routes/index.ts
import { Router as Router18 } from "express";

// src/app/modules/admin/admin.routes.ts
import { Router as Router2 } from "express";

// src/app/middlewares/requireAuth.ts
import { fromNodeHeaders } from "better-auth/node";
import { StatusCodes as StatusCodes9 } from "http-status-codes";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";

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

// src/app/utils/escapeHtml.ts
var ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ENTITIES[char] ?? char);

// src/app/utils/emailTemplates.ts
var welcomeEmailTemplate = (name) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <h2>Welcome, ${escapeHtml(name)}!</h2>
    <p>Thanks for joining. Your account has been created successfully.</p>
  </div>
`;
var otpEmailTemplate = (name, otp, expirationMinutes, purpose = "verify your email") => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <h2>Verification Code</h2>
    <p>Hi ${escapeHtml(name)}, use the code below to ${escapeHtml(purpose)}.</p>
    <div style="display:inline-block;padding:12px 24px;background:#f0f4ff;color:#007bff;font-size:28px;font-weight:bold;letter-spacing:8px;border-radius:4px;margin-top:20px;">${escapeHtml(otp)}</div>
    <p style="font-size: 13px; color: #666; margin-top: 16px;">This code will expire in ${expirationMinutes} minutes. If you didn't request this, please ignore this email.</p>
  </div>
`;

// src/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
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

// src/lib/auth.ts
var isProduction = config_default.app.env === "production";
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
var clientOrigins = config_default.app.clientUrl.split(",").map((origin) => origin.trim()).filter(Boolean);
var trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...clientOrigins
].filter((origin, index, origins) => origins.indexOf(origin) === index);
if (!isProduction) {
  trustedOrigins.push("null");
}
var auth = betterAuth({
  // The browser reaches this API through the frontend domain (Next.js
  // rewrites), so Better Auth must build its OAuth callback URLs and set
  // its cookies for the FRONTEND origin. Set BETTER_AUTH_URL to it.
  baseURL: config_default.betterAuth.url || clientOrigins[0],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
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
    requireEmailVerification: isProduction
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
    useSecureCookies: isProduction,
    // Cookies are first-party now (the frontend proxies /api/auth and
    // /api/v1), so Lax is correct and works in every browser. SameSite=None
    // is no longer needed.
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction
    }
  },
  plugins: [
    bearer(),
    twoFactor({
      issuer: "Evalora"
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: isProduction ? 5 * 60 : 60 * 60,
      allowedAttempts: 5,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        const user = await prisma.user.findUnique({
          where: { email }
        });
        const name = user?.name ?? "there";
        const subjectAndPurpose = type === "sign-in" ? {
          subject: "Your sign-in code",
          purpose: "sign in"
        } : type === "email-verification" ? {
          subject: "Verify your email",
          purpose: "verify your email"
        } : {
          subject: "Reset your password",
          purpose: "reset your password"
        };
        if (!isProduction) {
          console.log(
            `[Email OTP] ${subjectAndPurpose.purpose} code for ${email}: ${otp}`
          );
        }
        await sendEmailSmtp({
          to: email,
          subject: subjectAndPurpose.subject,
          html: otpEmailTemplate(
            name,
            otp,
            5,
            subjectAndPurpose.purpose
          )
        });
      }
    })
  ],
  // --------------------------------------------------------------
  // Request lifecycle hooks — brute-force lockout
  // --------------------------------------------------------------
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        if (email && await isLocked(email)) {
          throw new APIError("TOO_MANY_REQUESTS", {
            message: "Too many failed login attempts. Please try again in 15 minutes."
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
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
    session: {
      create: {
        // Stops a suspended or deleted account from getting a new session.
        before: async (session) => {
          const account = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
              status: true,
              deletedAt: true
            }
          });
          if (!account || account.deletedAt || account.status === "SUSPENDED") {
            throw new APIError("FORBIDDEN", {
              message: "This account is suspended or has been deleted. Please contact us if you think this is a mistake."
            });
          }
        }
      }
    },
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.userConsent.createMany({
              data: [
                {
                  userId: user.id,
                  consentType: "TERMS_OF_SERVICE",
                  granted: true
                },
                {
                  userId: user.id,
                  consentType: "PRIVACY_POLICY",
                  granted: true
                }
              ],
              skipDuplicates: true
            });
          } catch (error) {
            console.error(
              "[Auth] Failed to record sign-up consents:",
              error
            );
          }
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
      headers: fromNodeHeaders(req.headers)
    });
    if (!session?.user) {
      throw new appError_default(
        StatusCodes9.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource."
      );
    }
    const account = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { status: true, deletedAt: true }
    });
    if (!account || account.deletedAt || account.status === "SUSPENDED") {
      throw new appError_default(
        StatusCodes9.FORBIDDEN,
        "This account is suspended or has been deleted."
      );
    }
    req.user = session.user;
    next();
  }
);
var optionalAuth = catchAsync(
  async (req, _res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (session?.user) {
        const account = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { status: true, deletedAt: true }
        });
        if (account && !account.deletedAt && account.status !== "SUSPENDED") {
          req.user = session.user;
        }
      }
    } catch {
    }
    next();
  }
);
var requireRole = (...roles) => {
  return catchAsync(
    async (req, _res, next) => {
      if (!req.user) {
        throw new appError_default(StatusCodes9.UNAUTHORIZED, "You are not logged in.");
      }
      if (roles.length && !roles.includes(req.user.role)) {
        throw new appError_default(
          StatusCodes9.FORBIDDEN,
          "You don't have permission to access this resource."
        );
      }
      next();
    }
  );
};

// src/app/modules/admin/admin.controller.ts
import { StatusCodes as StatusCodes10 } from "http-status-codes";

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
    defaultSelect: AUDIT_LOG_SELECT,
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
  res.status(StatusCodes10.OK).json({
    success: true,
    message: "Dashboard stats retrieved successfully.",
    data: stats
  });
});
var getAuditLogs2 = catchAsync(async (req, res) => {
  const result = await adminService.getAuditLogs(
    req.query
  );
  res.status(StatusCodes10.OK).json({
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
var router2 = Router2();
router2.use(requireAuth, requireRole("ADMIN"));
router2.get("/dashboard-stats", adminController.getDashboardStats);
router2.get("/audit-logs", adminController.getAuditLogs);
var adminRoutes = router2;

// src/app/modules/assessment/assessment.routes.ts
import { Router as Router3 } from "express";

// src/app/middlewares/validateRequest.ts
import { StatusCodes as StatusCodes11 } from "http-status-codes";
var validateRequest = (schema) => {
  return async (req, _res, next) => {
    const result = await schema.safeParseAsync(req.body ?? {});
    if (!result.success) {
      return next(
        new appError_default(
          StatusCodes11.BAD_REQUEST,
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
import { StatusCodes as StatusCodes16 } from "http-status-codes";

// src/lib/getCompanyIdForUser.ts
import { StatusCodes as StatusCodes12 } from "http-status-codes";
async function getCompanyIdForUser(user, _req) {
  if (user.role === "ADMIN") {
    return void 0;
  }
  if (user.role === "CANDIDATE") {
    throw new appError_default(
      StatusCodes12.FORBIDDEN,
      "Candidates cannot access company-scoped resources"
    );
  }
  const company = await prisma.company.findFirst({
    where: { ownerId: user.id, deletedAt: null },
    select: { id: true }
  });
  if (!company) {
    throw new appError_default(
      StatusCodes12.FORBIDDEN,
      "No company associated with this user"
    );
  }
  return company.id;
}

// src/app/modules/assessment/assessment.service.ts
import { StatusCodes as StatusCodes15 } from "http-status-codes";

// src/lib/prismaTenantScope.ts
function withTenantScope(where, companyId) {
  const baseWhere = where ?? {};
  if (companyId === void 0) {
    return baseWhere;
  }
  if ("companyId" in baseWhere && baseWhere.companyId !== void 0) {
    throw new Error(
      "withTenantScope: where clause already contains companyId. Potential double-scoping bug."
    );
  }
  return { ...baseWhere, companyId };
}

// src/app/utils/planLimits.ts
import { StatusCodes as StatusCodes13 } from "http-status-codes";
var PLAN_LIMITS = {
  FREE: { maxAssessments: 2, maxInvitationsPer30Days: 20 },
  PRO: { maxAssessments: 20, maxInvitationsPer30Days: 200 },
  ENTERPRISE: { maxAssessments: null, maxInvitationsPer30Days: null }
};
var THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1e3;
var getEffectivePlan = async (companyId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { companyId },
    select: { plan: true, status: true, currentPeriodEnd: true }
  });
  if (!subscription || subscription.plan === "FREE") return "FREE";
  if (subscription.status === "EXPIRED") return "FREE";
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < /* @__PURE__ */ new Date()) {
    return "FREE";
  }
  return subscription.plan;
};
var countAssessments = (companyId) => (
  // tenant-scoped via explicit companyId
  prisma.assessment.count({
    where: {
      companyId,
      deletedAt: null,
      isLatestVersion: true,
      status: { not: "ARCHIVED" }
    }
  })
);
var countRecentInvitations = (companyId) => (
  // tenant-scoped via relation filter
  prisma.assessmentInvitation.count({
    where: {
      invitedAt: { gte: new Date(Date.now() - THIRTY_DAYS_MS) },
      assessment: { companyId, deletedAt: null }
    }
  })
);
var getPlanSnapshot = async (companyId) => {
  const [effectivePlan, assessments, invitationsLast30Days] = await Promise.all([
    getEffectivePlan(companyId),
    countAssessments(companyId),
    countRecentInvitations(companyId)
  ]);
  return {
    effectivePlan,
    limits: PLAN_LIMITS[effectivePlan],
    usage: { assessments, invitationsLast30Days }
  };
};
var assertCanCreateAssessment = async (companyId) => {
  const plan = await getEffectivePlan(companyId);
  const limit = PLAN_LIMITS[plan].maxAssessments;
  if (limit === null) return;
  const used = await countAssessments(companyId);
  if (used >= limit) {
    throw new appError_default(
      StatusCodes13.PAYMENT_REQUIRED,
      `Your ${plan} plan allows up to ${limit} assessments. Upgrade your plan to create more.`
    );
  }
};
var assertCanInvite = async (companyId, count) => {
  const plan = await getEffectivePlan(companyId);
  const limit = PLAN_LIMITS[plan].maxInvitationsPer30Days;
  if (limit === null) return;
  const used = await countRecentInvitations(companyId);
  const remaining = Math.max(limit - used, 0);
  if (count > remaining) {
    throw new appError_default(
      StatusCodes13.PAYMENT_REQUIRED,
      `Your ${plan} plan allows ${limit} invitations per 30 days, and you have ${remaining} left. Upgrade your plan to invite more candidates.`
    );
  }
};

// src/app/utils/assertCompanyVerified.ts
import { StatusCodes as StatusCodes14 } from "http-status-codes";
var assertCompanyVerified = async (companyId) => {
  const company = await prisma.company.findFirst({
    where: { id: companyId, deletedAt: null },
    select: { isVerified: true }
  });
  if (!company) {
    throw new appError_default(StatusCodes14.NOT_FOUND, "Company not found.");
  }
  if (!company.isVerified) {
    throw new appError_default(
      StatusCodes14.FORBIDDEN,
      "Your company must be verified by an admin before you can do this."
    );
  }
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

// src/app/modules/result/result.notification.ts
var notifyResultsReleased = async (assessmentId, assessmentTitle) => {
  const results = await prisma.result.findMany({
    where: { assessmentId, status: { in: ["PASSED", "FAILED"] } },
    select: {
      attemptId: true,
      attempt: { select: { candidateId: true } }
    }
  });
  if (results.length === 0) return;
  await prisma.notification.createMany({
    data: results.map((result) => ({
      userId: result.attempt.candidateId,
      title: "Result ready",
      message: `Your result for "${assessmentTitle}" is ready to view.`,
      type: "ASSESSMENT_RESULT",
      metadata: { assessmentId, attemptId: result.attemptId }
    }))
  });
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
  defaultSelect: ASSESSMENT_LIST_SELECT,
  softDelete: true,
  defaultSortField: "createdAt"
});
var assertProblemsBelongToCompany = async (companyId, problemIds) => {
  const found = await prisma.problem.findMany({
    where: withTenantScope(
      {
        id: { in: problemIds },
        deletedAt: null
      },
      companyId
    ) ?? {},
    select: {
      id: true
    }
  });
  if (found.length !== new Set(problemIds).size) {
    throw new appError_default(
      StatusCodes15.BAD_REQUEST,
      "One or more problems were not found in your company's problem bank."
    );
  }
};
var createAssessment = async (companyId, createdById, payload) => {
  await assertCanCreateAssessment(companyId);
  await assertProblemsBelongToCompany(
    companyId,
    payload.problems.map((problem) => problem.problemId)
  );
  const slug = await generateUniqueSlug(
    payload.title,
    (candidate) => prisma.assessment.findUnique({
      where: {
        companyId_slug_version: {
          companyId,
          slug: candidate,
          version: 1
        }
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
      ...payload.startAt !== void 0 && {
        startAt: payload.startAt
      },
      ...payload.endAt !== void 0 && {
        endAt: payload.endAt
      },
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
  const tenantScope = withTenantScope({}, companyId) ?? {};
  return assessmentQueryBuilder.execute(query, tenantScope);
};
var getAssessmentById = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {},
    select: ASSESSMENT_DETAIL_SELECT
  });
  if (!assessment) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  return assessment;
};
var updateAssessment = async (id, companyId, payload) => {
  const existing = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {}
  });
  if (!existing) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  if (existing.status !== "DRAFT") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
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
        StatusCodes15.BAD_REQUEST,
        `Sum of problem marks (${marksSum}) must equal totalMarks (${effectiveTotalMarks}).`
      );
    }
  }
  const effectivePassingMarks = payload.passingMarks ?? existing.passingMarks;
  if (effectivePassingMarks > effectiveTotalMarks) {
    throw new appError_default(
      StatusCodes15.BAD_REQUEST,
      "Passing marks cannot exceed total marks."
    );
  }
  const effectiveStartAt = payload.startAt !== void 0 ? payload.startAt : existing.startAt;
  const effectiveEndAt = payload.endAt !== void 0 ? payload.endAt : existing.endAt;
  if (effectiveStartAt && effectiveEndAt && effectiveEndAt <= effectiveStartAt) {
    throw new appError_default(
      StatusCodes15.BAD_REQUEST,
      "The end time must be after the start time."
    );
  }
  const { problems, ...topLevel } = payload;
  await prisma.$transaction(async (tx) => {
    if (Object.keys(topLevel).length > 0) {
      await tx.assessment.update({
        where: {
          id
        },
        data: topLevel
      });
    }
    if (problems) {
      await tx.assessmentProblem.deleteMany({
        where: {
          assessmentId: id
        }
      });
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
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {},
    include: {
      assessmentProblems: true
    }
  });
  if (!assessment) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") {
    return prisma.assessment.findUniqueOrThrow({
      where: {
        id
      },
      select: ASSESSMENT_DETAIL_SELECT
    });
  }
  if (assessment.status !== "DRAFT") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
      `Cannot publish an assessment with status ${assessment.status}.`
    );
  }
  await assertCompanyVerified(companyId);
  if (assessment.assessmentProblems.length === 0) {
    throw new appError_default(
      StatusCodes15.BAD_REQUEST,
      "Add at least one problem before publishing."
    );
  }
  const marksSum = assessment.assessmentProblems.reduce(
    (sum, assessmentProblem) => sum + assessmentProblem.marks,
    0
  );
  if (marksSum !== assessment.totalMarks) {
    throw new appError_default(
      StatusCodes15.BAD_REQUEST,
      `Sum of problem marks (${marksSum}) does not match totalMarks (${assessment.totalMarks}).`
    );
  }
  return prisma.assessment.update({
    where: {
      id
    },
    data: {
      status: "PUBLISHED",
      publishedAt: /* @__PURE__ */ new Date()
    },
    select: ASSESSMENT_DETAIL_SELECT
  });
};
var closeAssessment = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {}
  });
  if (!assessment) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
      `Cannot close an assessment with status ${assessment.status}.`
    );
  }
  const closed = await prisma.assessment.update({
    where: {
      id
    },
    data: {
      status: "CLOSED"
    },
    select: ASSESSMENT_DETAIL_SELECT
  });
  if (!assessment.showResultImmediately) {
    try {
      await notifyResultsReleased(id, assessment.title);
    } catch (error) {
      console.error("Failed to send result-release notifications", error);
    }
  }
  return closed;
};
var softDeleteAssessment = async (id, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {}
  });
  if (!assessment) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "DRAFT") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
      "Only DRAFT assessments can be deleted. Close a published assessment instead."
    );
  }
  await prisma.assessment.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    message: "Assessment deleted successfully."
  };
};
var createAssessmentVersion = async (id, companyId) => {
  const existing = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {},
    include: {
      assessmentProblems: {
        include: {
          problem: true
        }
      }
    }
  });
  if (!existing) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
  }
  if (existing.status === "DRAFT") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
      "Only published or closed assessments can be versioned."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const maxVersionResult = await tx.assessment.aggregate({
      where: withTenantScope(
        {
          slug: existing.slug,
          deletedAt: null
        },
        companyId
      ) ?? {},
      _max: {
        version: true
      }
    });
    const nextVersion = (maxVersionResult._max.version || existing.version) + 1;
    await tx.assessment.updateMany({
      where: withTenantScope(
        {
          slug: existing.slug,
          isLatestVersion: true,
          deletedAt: null
        },
        companyId
      ) ?? {},
      data: {
        isLatestVersion: false
      }
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
          create: existing.assessmentProblems.map(
            (assessmentProblem) => ({
              problemId: assessmentProblem.problemId,
              order: assessmentProblem.order,
              marks: assessmentProblem.marks
            })
          )
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
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {},
    select: {
      id: true,
      companyId: true,
      slug: true
    }
  });
  if (!existing) {
    throw new appError_default(StatusCodes15.NOT_FOUND, "Assessment not found.");
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
    orderBy: {
      version: "desc"
    }
  });
  return versions;
};
var restoreAssessmentVersion = async (id, companyId) => {
  const target = await prisma.assessment.findFirst({
    where: withTenantScope(
      {
        id,
        deletedAt: null
      },
      companyId
    ) ?? {},
    include: {
      assessmentProblems: {
        include: {
          problem: true
        }
      }
    }
  });
  if (!target) {
    throw new appError_default(
      StatusCodes15.NOT_FOUND,
      "Assessment version not found."
    );
  }
  if (target.isLatestVersion && target.status !== "DRAFT") {
    throw new appError_default(
      StatusCodes15.CONFLICT,
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
      orderBy: {
        version: "desc"
      },
      include: {
        assessmentProblems: true
      }
    });
    if (!latest) {
      throw new appError_default(
        StatusCodes15.NOT_FOUND,
        "Latest assessment version not found."
      );
    }
    const nextVersion = latest.version + 1;
    await tx.assessment.updateMany({
      where: {
        companyId,
        slug: target.slug,
        isLatestVersion: true
      },
      data: {
        isLatestVersion: false
      }
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
          create: target.assessmentProblems.map(
            (assessmentProblem) => ({
              problemId: assessmentProblem.problemId,
              order: assessmentProblem.order,
              marks: assessmentProblem.marks
            })
          )
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
var createAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const assessment = await assessmentService.createAssessment(
    companyId,
    currentUser.id,
    req.body
  );
  res.status(StatusCodes16.CREATED).json({
    success: true,
    message: "Assessment created successfully.",
    data: assessment
  });
});
var getAllAssessments2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
  const result = await assessmentService.getAllAssessments(
    req.query,
    companyId
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: "Assessments retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getAssessmentById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
  const assessment = await assessmentService.getAssessmentById(
    req.params.id,
    companyId
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: "Assessment retrieved successfully.",
    data: assessment
  });
});
var updateAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const assessment = await assessmentService.updateAssessment(
    req.params.id,
    companyId,
    req.body
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: "Assessment updated successfully.",
    data: assessment
  });
});
var publishAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const assessment = await assessmentService.publishAssessment(
    req.params.id,
    companyId
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: "Assessment published successfully.",
    data: assessment
  });
});
var closeAssessment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const assessment = await assessmentService.closeAssessment(
    req.params.id,
    companyId
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: "Assessment closed successfully.",
    data: assessment
  });
});
var deleteAssessment = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await assessmentService.softDeleteAssessment(
    req.params.id,
    companyId
  );
  res.status(StatusCodes16.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var createAssessmentVersion2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req);
    const assessment = await assessmentService.createAssessmentVersion(
      req.params.id,
      companyId
    );
    res.status(StatusCodes16.CREATED).json({
      success: true,
      message: "New version created successfully.",
      data: assessment
    });
  }
);
var getAssessmentVersions2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
    const versions = await assessmentService.getAssessmentVersions(
      req.params.id,
      companyId
    );
    res.status(StatusCodes16.OK).json({
      success: true,
      message: "Assessment versions retrieved successfully.",
      data: versions
    });
  }
);
var restoreAssessmentVersion2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req);
    const assessment = await assessmentService.restoreAssessmentVersion(
      req.params.id,
      companyId
    );
    res.status(StatusCodes16.OK).json({
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
import { z as z2 } from "zod";
var assessmentProblemSchema = z2.object({
  problemId: z2.string().min(1, "problemId is required."),
  order: z2.number().int().min(1, "Order must start at 1."),
  marks: z2.coerce.number().int().min(1, "Marks must be at least 1.").max(1e3)
});
var blankToNull = (value) => typeof value === "string" && value.trim() === "" ? null : value;
var baseAssessmentFields = {
  title: z2.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  description: z2.string().trim().max(5e3).optional(),
  instructions: z2.string().trim().max(5e3).optional(),
  durationMinutes: z2.coerce.number().int().min(5, "Duration must be at least 5 minutes.").max(600, "Duration must be at most 10 hours."),
  totalMarks: z2.coerce.number().int().min(1),
  passingMarks: z2.coerce.number().int().min(0),
  maxAttempts: z2.coerce.number().int().min(1).max(10).optional(),
  startAt: z2.coerce.date().optional(),
  endAt: z2.coerce.date().optional(),
  shuffleQuestions: z2.boolean().optional(),
  showResultImmediately: z2.boolean().optional(),
  allowReview: z2.boolean().optional()
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
var createAssessmentSchema = z2.object({
  ...baseAssessmentFields,
  problems: z2.array(assessmentProblemSchema).min(1, "Add at least one problem.")
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
var updateAssessmentSchema = z2.object({
  title: z2.string().trim().min(3).max(200).optional(),
  description: z2.preprocess(
    blankToNull,
    z2.string().trim().max(5e3).nullable().optional()
  ),
  instructions: z2.preprocess(
    blankToNull,
    z2.string().trim().max(5e3).nullable().optional()
  ),
  durationMinutes: z2.coerce.number().int().min(5).max(600).optional(),
  totalMarks: z2.coerce.number().int().min(1).optional(),
  passingMarks: z2.coerce.number().int().min(0).optional(),
  maxAttempts: z2.coerce.number().int().min(1).max(10).optional(),
  startAt: z2.preprocess(blankToNull, z2.coerce.date().nullable().optional()),
  endAt: z2.preprocess(blankToNull, z2.coerce.date().nullable().optional()),
  shuffleQuestions: z2.boolean().optional(),
  showResultImmediately: z2.boolean().optional(),
  allowReview: z2.boolean().optional(),
  problems: z2.array(assessmentProblemSchema).min(1, "Add at least one problem.").optional()
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
  createVersionSchema: z2.object({}),
  restoreVersionSchema: z2.object({})
};

// src/app/modules/assessment/assessment.routes.ts
var router3 = Router3();
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
import { Router as Router4 } from "express";

// src/app/middlewares/idempotency.ts
import crypto from "crypto";
import { StatusCodes as StatusCodes17 } from "http-status-codes";
var NON_REPLAYABLE_STATUSES = /* @__PURE__ */ new Set([408, 425, 429]);
var idempotency = () => {
  return async (req, res, next) => {
    const keyHeader = req.headers["idempotency-key"];
    const key = Array.isArray(keyHeader) ? keyHeader[0] : keyHeader;
    if (!key || key.trim() === "") {
      throw new appError_default(
        StatusCodes17.BAD_REQUEST,
        "Idempotency-Key header is required",
        "MISSING_IDEMPOTENCY_KEY"
      );
    }
    if (key.length > 255) {
      throw new appError_default(
        StatusCodes17.BAD_REQUEST,
        "Idempotency-Key too long",
        "INVALID_IDEMPOTENCY_KEY"
      );
    }
    if (!req.user?.id) {
      throw new appError_default(
        StatusCodes17.INTERNAL_SERVER_ERROR,
        "Idempotency middleware requires auth",
        "INTERNAL_MISCONFIGURATION"
      );
    }
    const userId = req.user.id;
    const rawBody = JSON.stringify(req.body ?? {});
    const requestHash = crypto.createHash("sha256").update(`${rawBody}|${userId}`).digest("hex");
    const existing = await prisma.idempotencyKey.findUnique({
      where: { key_userId: { key, userId } }
    });
    const now = /* @__PURE__ */ new Date();
    if (Math.random() < 0.02) {
      void prisma.idempotencyKey.deleteMany({ where: { expiresAt: { lt: now } } }).catch(() => void 0);
    }
    if (existing) {
      if (existing.expiresAt > now) {
        if (existing.requestHash === requestHash) {
          res.setHeader("X-Idempotent-Replay", "true");
          res.status(existing.statusCode).json(existing.response);
          return;
        }
        throw new appError_default(
          StatusCodes17.CONFLICT,
          "Idempotency-Key already used with a different request body",
          "IDEMPOTENCY_CONFLICT"
        );
      }
      await prisma.idempotencyKey.delete({
        where: { key_userId: { key, userId } }
      });
    }
    const originalJson = res.json.bind(res);
    const persist = async (body) => {
      const statusCode = res.statusCode;
      if (statusCode < 500 && !NON_REPLAYABLE_STATUSES.has(statusCode) && body !== void 0) {
        const endpointPath = `${req.method} ${req.baseUrl}${req.route?.path ?? req.path}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        try {
          await prisma.idempotencyKey.create({
            data: {
              key,
              userId,
              endpoint: endpointPath,
              requestHash,
              response: body,
              statusCode,
              expiresAt
            }
          });
        } catch (error) {
          if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError && error.code === "P2002") {
            const replay = await prisma.idempotencyKey.findUnique({
              where: { key_userId: { key, userId } }
            });
            if (replay && replay.requestHash === requestHash) {
              if (!res.headersSent) {
                res.setHeader("X-Idempotent-Replay", "true");
                res.status(replay.statusCode);
                return originalJson(replay.response);
              }
            }
          }
        }
      }
      return originalJson(body);
    };
    res.json = persist;
    next();
  };
};

// src/app/modules/attempt/attempt.controller.ts
import { StatusCodes as StatusCodes19 } from "http-status-codes";

// src/app/modules/attempt/attempt.service.ts
import { StatusCodes as StatusCodes18 } from "http-status-codes";

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
  candidate: { select: { id: true, name: true, email: true } },
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
      description: true,
      instructions: true,
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
  attempt: {
    select: {
      id: true,
      assessmentId: true,
      attemptNumber: true,
      candidate: { select: { id: true, name: true, email: true } }
    }
  },
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

// src/app/modules/result/result.access.ts
var RELEASED_STATUSES = ["CLOSED", "ARCHIVED"];
var isResultReleasedToCandidate = (assessment) => assessment.showResultImmediately || RELEASED_STATUSES.includes(assessment.status);

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
        include: {
          options: {
            select: { id: true, isCorrect: true }
          }
        }
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
    update: {
      maxScore: marks,
      status: "PENDING",
      isAutoEvaluated: false
    },
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
        select: {
          id: true,
          title: true,
          totalMarks: true,
          passingMarks: true,
          showResultImmediately: true,
          status: true
        }
      },
      submissions: {
        include: { evaluation: true }
      }
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
  if (isNewlyCompleted && isResultReleasedToCandidate(attempt.assessment)) {
    await prisma.notification.create({
      data: {
        userId: attempt.candidateId,
        title: "Result ready",
        message: `Your result for "${attempt.assessment.title}" is ready to view.`,
        type: "ASSESSMENT_RESULT",
        metadata: {
          assessmentId: attempt.assessment.id,
          attemptId
        }
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      StatusCodes18.CONFLICT,
      "This assessment is not currently open for attempts."
    );
  }
  const now = /* @__PURE__ */ new Date();
  if (assessment.startAt && now < assessment.startAt) {
    throw new appError_default(
      StatusCodes18.CONFLICT,
      "This assessment has not started yet."
    );
  }
  if (assessment.endAt && now > assessment.endAt) {
    throw new appError_default(
      StatusCodes18.CONFLICT,
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
      StatusCodes18.FORBIDDEN,
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
      StatusCodes18.CONFLICT,
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  if (attempt.status === "IN_PROGRESS" && attempt.expiresAt < /* @__PURE__ */ new Date()) {
    await finalizeAttempt(attemptId);
    throw new appError_default(
      StatusCodes18.GONE,
      "Time is up \u2014 this attempt has been auto-submitted."
    );
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new appError_default(
      StatusCodes18.CONFLICT,
      `Cannot modify answers \u2014 this attempt is already ${attempt.status.toLowerCase()}.`
    );
  }
  const assessmentProblem = attempt.assessment.assessmentProblems[0];
  if (!assessmentProblem) {
    throw new appError_default(
      StatusCodes18.BAD_REQUEST,
      "This problem is not part of this assessment."
    );
  }
  const { problem } = assessmentProblem;
  let selectedOptionIds = [];
  let isEmpty = false;
  if (problem.type === "MCQ") {
    if (payload.selectedOptionIds === void 0) {
      throw new appError_default(
        StatusCodes18.BAD_REQUEST,
        "selectedOptionIds is required for an MCQ problem."
      );
    }
    selectedOptionIds = payload.selectedOptionIds;
    isEmpty = selectedOptionIds.length === 0;
    if (!isEmpty) {
      const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({
        where: { problemId },
        include: { options: { select: { id: true } } }
      });
      const validOptionIds = new Set(
        mcqProblem.options.map((option) => option.id)
      );
      const hasInvalidOption = selectedOptionIds.some(
        (id) => !validOptionIds.has(id)
      );
      if (hasInvalidOption) {
        throw new appError_default(
          StatusCodes18.BAD_REQUEST,
          "One or more selected options do not belong to this problem."
        );
      }
      if (mcqProblem.type === "SINGLE_CHOICE" && selectedOptionIds.length > 1) {
        throw new appError_default(
          StatusCodes18.BAD_REQUEST,
          "This is a single-choice question \u2014 select only one option."
        );
      }
    }
  } else if (problem.type === "CODING") {
    if (payload.code === void 0) {
      throw new appError_default(
        StatusCodes18.BAD_REQUEST,
        "code is required for a CODING problem."
      );
    }
    isEmpty = payload.code.trim() === "";
  } else {
    if (payload.answerText === void 0) {
      throw new appError_default(
        StatusCodes18.BAD_REQUEST,
        "answerText is required for a WRITTEN problem."
      );
    }
    isEmpty = payload.answerText.trim() === "";
  }
  if (isEmpty) {
    await prisma.submission.deleteMany({ where: { attemptId, problemId } });
    return null;
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new appError_default(
      StatusCodes18.CONFLICT,
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
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
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  const isOwner = attempt.candidateId === requester.id;
  const isOwningRecruiter = requester.companyId !== void 0 && attempt.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
    throw new appError_default(StatusCodes18.NOT_FOUND, "Attempt not found.");
  }
  const event = await prisma.proctoringEvent.findFirst({
    where: { id: eventId, attemptId }
  });
  if (!event) {
    throw new appError_default(StatusCodes18.NOT_FOUND, "Proctoring event not found.");
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
var startAttempt2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const attempt = await attemptService.startAttempt(
    currentUser.id,
    req.body.assessmentId
  );
  res.status(StatusCodes19.CREATED).json({
    success: true,
    message: "Attempt started successfully.",
    data: attempt
  });
});
var getMyAttempts2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const attempts = await attemptService.getMyAttempts(currentUser.id);
  res.status(StatusCodes19.OK).json({
    success: true,
    message: "Attempts retrieved successfully.",
    data: attempts
  });
});
var getAttemptById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
  const attempt = await attemptService.getAttemptById(req.params.id, {
    id: currentUser.id,
    role: currentUser.role,
    ...companyId !== void 0 && { companyId }
  });
  res.status(StatusCodes19.OK).json({
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
  res.status(StatusCodes19.OK).json({
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
  res.status(StatusCodes19.OK).json({
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
    res.status(StatusCodes19.OK).json({
      success: true,
      message: result.recorded ? "Event recorded." : "Attempt is no longer active; event ignored.",
      data: result
    });
  }
);
var getProctoringEvents2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
  const events = await attemptService.getProctoringEvents(
    req.params.id,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(StatusCodes19.OK).json({
    success: true,
    message: "Proctoring events retrieved successfully.",
    data: events
  });
});
var getProctoringEventById2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
    const event = await attemptService.getProctoringEventById(
      req.params.id,
      req.params.eventId,
      {
        id: currentUser.id,
        role: currentUser.role,
        ...companyId !== void 0 && { companyId }
      }
    );
    res.status(StatusCodes19.OK).json({
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
import { z as z3 } from "zod";
var startAttemptSchema = z3.object({
  assessmentId: z3.string().min(1, "assessmentId is required.")
});
var saveSubmissionSchema = z3.object({
  selectedOptionIds: z3.array(z3.string().min(1)).max(10).optional(),
  code: z3.string().max(2e4).optional(),
  language: z3.string().trim().max(50).optional(),
  answerText: z3.string().trim().max(2e4).optional()
}).refine(
  (data) => data.selectedOptionIds !== void 0 || data.code !== void 0 || data.answerText !== void 0,
  {
    message: "Provide an answer: selectedOptionIds (MCQ), code (CODING), or answerText (WRITTEN)."
  }
);
var testCaseResultInputSchema = z3.object({
  testCaseId: z3.string().min(1),
  passed: z3.boolean(),
  actualOutput: z3.string().max(5e3).optional(),
  points: z3.coerce.number().int().min(0).max(1e3).optional()
});
var manualEvaluationSchema = z3.object({
  score: z3.coerce.number().min(0, "Score cannot be negative."),
  feedback: z3.string().trim().max(2e3).optional(),
  testCaseResults: z3.array(testCaseResultInputSchema).max(50).optional()
});
var proctoringEventSchema = z3.object({
  eventType: z3.enum([
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
  metadata: z3.record(z3.string(), z3.unknown()).refine(
    (value) => JSON.stringify(value).length <= 2e3,
    "Metadata is too large."
  ).optional()
});
var attemptValidation = {
  startAttemptSchema,
  saveSubmissionSchema,
  manualEvaluationSchema,
  proctoringEventSchema
};

// src/app/modules/attempt/attempt.routes.ts
var router4 = Router4();
router4.use(requireAuth);
router4.post(
  "/start",
  requireRole("CANDIDATE"),
  idempotency(),
  validateRequest(attemptValidation.startAttemptSchema),
  attemptController.startAttempt
);
router4.get("/me", requireRole("CANDIDATE"), attemptController.getMyAttempts);
router4.get("/:id", attemptController.getAttemptById);
router4.put(
  "/:id/submissions/:problemId",
  requireRole("CANDIDATE"),
  submissionAnswerLimiter,
  validateRequest(attemptValidation.saveSubmissionSchema),
  attemptController.saveSubmission
);
router4.post(
  "/:id/submit",
  requireRole("CANDIDATE"),
  idempotency(),
  attemptSubmitLimiter,
  attemptController.submitAttempt
);
router4.post(
  "/:id/proctoring-events",
  requireRole("CANDIDATE"),
  proctoringEventLimiter,
  validateRequest(attemptValidation.proctoringEventSchema),
  attemptController.recordProctoringEvent
);
router4.get("/:id/proctoring-events", attemptController.getProctoringEvents);
router4.get(
  "/:id/proctoring-events/:eventId",
  attemptController.getProctoringEventById
);
var attemptRoutes = router4;

// src/app/modules/auth/auth.routes.ts
import { Router as Router5 } from "express";

// src/app/modules/auth/auth.controller.ts
import { fromNodeHeaders as fromNodeHeaders2 } from "better-auth/node";
import { StatusCodes as StatusCodes21 } from "http-status-codes";

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
import "http-status-codes";

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
var register = (payload, headers) => callAuthEndpoint(
  auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password
    },
    headers,
    asResponse: true
  }),
  AUTH_FALLBACK_MESSAGES.REGISTER
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
    fromNodeHeaders2(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(StatusCodes21.CREATED).json({
    success: true,
    message: "Registered successfully. Please check your email for the verification code.",
    data
  });
});
var login2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.login(
    req.body,
    fromNodeHeaders2(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Logged in successfully.",
    data
  });
});
var logout2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.logout(
    fromNodeHeaders2(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Logged out successfully.",
    data
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.refreshToken(
    fromNodeHeaders2(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Session refreshed successfully.",
    data
  });
});
var sendEmailOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.sendEmailOtp(req.body);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Verification code sent.",
    data
  });
});
var verifyEmailOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.verifyEmailOtp(req.body);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Email verified successfully.",
    data
  });
});
var resetPasswordWithOtp2 = catchAsync(async (req, res) => {
  const { data } = await authService.resetPasswordWithOtp(req.body);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
    data
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const { data, headers } = await authService.changePassword(
    req.body,
    fromNodeHeaders2(req.headers)
  );
  applyAuthCookies(headers, res);
  res.status(StatusCodes21.OK).json({
    success: true,
    message: "Password changed successfully.",
    data
  });
});
var getMe = catchAsync(async (req, res) => {
  res.status(StatusCodes21.OK).json({
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
import { z as z4 } from "zod";
var passwordSchema = z4.string().min(8, "Password must be at least 8 characters long.").regex(/[a-z]/, "Password must contain at least 1 lowercase letter.").regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.").regex(/[0-9]/, "Password must contain at least 1 number.").regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character.");
var registerSchema = z4.object({
  name: z4.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  email: z4.string().email("Invalid email address."),
  password: passwordSchema,
  acceptTerms: z4.custom(
    (value) => value === true,
    "You must accept the Terms of Service and Privacy Policy."
  )
});
var loginSchema = z4.object({
  email: z4.string().email("Invalid email address."),
  password: z4.string().min(1, "Password is required."),
  rememberMe: z4.boolean().optional()
});
var sendEmailOtpSchema = z4.object({
  email: z4.string().email("Invalid email address."),
  type: z4.enum(["sign-in", "email-verification", "forget-password"])
});
var verifyEmailOtpSchema = z4.object({
  email: z4.string().email("Invalid email address."),
  otp: z4.string().length(6, "OTP must be 6 digits.")
});
var resetPasswordOtpSchema = z4.object({
  email: z4.string().email("Invalid email address."),
  otp: z4.string().length(6, "OTP must be 6 digits."),
  newPassword: passwordSchema
});
var changePasswordSchema = z4.object({
  currentPassword: z4.string().min(1, "Current password is required."),
  newPassword: passwordSchema,
  revokeOtherSessions: z4.boolean().optional()
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
var router5 = Router5();
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

// src/app/modules/candidate/candidate.routes.ts
import { Router as Router6 } from "express";

// src/app/middlewares/upload.ts
import { StatusCodes as StatusCodes22 } from "http-status-codes";
import multer2 from "multer";
var storage = multer2.memoryStorage();
var IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
var DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv"
];
var makeUploader = (allowedMimeTypes, maxSizeBytes, label) => multer2({
  storage,
  limits: { fileSize: maxSizeBytes },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(
        new appError_default(
          StatusCodes22.BAD_REQUEST,
          `Only ${label} files are allowed.`
        )
      );
      return;
    }
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

// src/app/middlewares/validateRequestWithFile.ts
import { StatusCodes as StatusCodes23 } from "http-status-codes";
var validateRequestWithFile = (schema) => {
  return async (req, res, next) => {
    if (typeof req.body?.data === "string") {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return next(
          new appError_default(
            StatusCodes23.BAD_REQUEST,
            "Invalid JSON in 'data' field."
          )
        );
      }
    }
    return validateRequest(schema)(req, res, next);
  };
};

// src/app/modules/candidate/candidate.controller.ts
import { StatusCodes as StatusCodes26 } from "http-status-codes";

// src/app/modules/candidate/candidate.service.ts
import { StatusCodes as StatusCodes25 } from "http-status-codes";

// src/app/utils/fileUploader.ts
import { StatusCodes as StatusCodes24 } from "http-status-codes";

// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
var { cloudName, apiKey, apiSecret } = config_default.cloudinary;
var isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
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
  return cloudinary;
};

// src/app/utils/fileUploader.ts
var uploadFileToCloudinary = async (buffer, fileName, folder = "uploads") => {
  if (!buffer || !fileName) {
    throw new appError_default(
      StatusCodes24.BAD_REQUEST,
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
              StatusCodes24.INTERNAL_SERVER_ERROR,
              "Cloudinary upload failed."
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};

// src/app/modules/candidate/candidate.const.ts
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
var CANDIDATE_OWN_SELECT = {
  ...CANDIDATE_DETAIL_SELECT,
  isVisibleToRecruiters: true
};

// src/app/modules/candidate/candidate.service.ts
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
    defaultSelect: CANDIDATE_DETAIL_SELECT,
    softDelete: true,
    defaultSortField: "createdAt"
  }
);
var visibleTo = (role) => role === "ADMIN" ? {} : {
  isVisibleToRecruiters: true,
  user: { deletedAt: null, status: "ACTIVE" }
};
var upsertMyProfile = async (userId, payload, file) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null }
  });
  if (!user) {
    throw new appError_default(StatusCodes25.NOT_FOUND, "User not found.");
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
    select: CANDIDATE_OWN_SELECT
  });
};
var getMyProfile = async (userId) => {
  const profile = await prisma.candidateProfile.findFirst({
    where: { userId, deletedAt: null },
    select: CANDIDATE_OWN_SELECT
  });
  if (!profile) {
    throw new appError_default(StatusCodes25.NOT_FOUND, "Candidate profile not found.");
  }
  return profile;
};
var getCandidateProfileById = async (id, requesterRole) => {
  const profile = await prisma.candidateProfile.findFirst({
    where: { id, deletedAt: null, ...visibleTo(requesterRole) },
    select: CANDIDATE_DETAIL_SELECT
  });
  if (!profile) {
    throw new appError_default(StatusCodes25.NOT_FOUND, "Candidate profile not found.");
  }
  return profile;
};
var getAllCandidates = async (query, requesterRole) => {
  return candidateQueryBuilder.execute(query, visibleTo(requesterRole));
};
var candidateService = {
  upsertMyProfile,
  getMyProfile,
  getCandidateProfileById,
  getAllCandidates
};

// src/app/modules/candidate/candidate.controller.ts
var upsertMyProfile2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const profile = await candidateService.upsertMyProfile(
    currentUser.id,
    req.body,
    req.file
  );
  res.status(StatusCodes26.OK).json({
    success: true,
    message: "Profile saved successfully.",
    data: profile
  });
});
var getMyProfile2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const profile = await candidateService.getMyProfile(currentUser.id);
  res.status(StatusCodes26.OK).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: profile
  });
});
var getCandidateProfileById2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const profile = await candidateService.getCandidateProfileById(
      req.params.id,
      currentUser.role
    );
    res.status(StatusCodes26.OK).json({
      success: true,
      message: "Candidate profile retrieved successfully.",
      data: profile
    });
  }
);
var getAllCandidates2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await candidateService.getAllCandidates(
    req.query,
    currentUser.role
  );
  res.status(StatusCodes26.OK).json({
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

// src/app/modules/candidate/candidate.validation.ts
import { z as z6 } from "zod";

// src/app/modules/user/user.validation.ts
import { z as z5 } from "zod";
var phoneSchema = z5.string().trim().regex(
  /^\+?[1-9]\d{7,14}$/,
  "Enter a valid phone number (8\u201315 digits, digits only, optionally starting with +)."
).optional();
var updateProfileSchema = z5.object({
  name: z5.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name must be at most 100 characters.").optional(),
  phone: phoneSchema
});
var updateRoleSchema = z5.object({
  role: z5.enum(["ADMIN", "RECRUITER", "CANDIDATE"], {
    message: "Role must be one of ADMIN, RECRUITER, or CANDIDATE."
  })
});
var updateStatusSchema = z5.object({
  status: z5.enum(["ACTIVE", "SUSPENDED", "PENDING"], {
    message: "Status must be one of ACTIVE, SUSPENDED, or PENDING."
  })
});
var userValidation = {
  updateProfileSchema,
  updateRoleSchema,
  updateStatusSchema
};

// src/app/modules/candidate/candidate.validation.ts
var blankToNull2 = (value) => typeof value === "string" && value.trim() === "" ? null : value;
var isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
var urlField = (label) => z6.preprocess(
  blankToNull2,
  z6.string().trim().max(2048, `${label} URL is too long.`).refine(
    isHttpUrl,
    `Enter a valid ${label} URL starting with https://, e.g. https://example.com/you.`
  ).nullable().optional()
);
var parseSkills = (value) => {
  if (value === void 0 || Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed2 = JSON.parse(value);
      if (Array.isArray(parsed2)) return parsed2;
    } catch {
    }
    return [value];
  }
  return value;
};
var upsertProfileSchema = z6.object({
  headline: z6.preprocess(
    blankToNull2,
    z6.string().trim().min(2, "Headline must be at least 2 characters.").max(150, "Headline must be at most 150 characters.").nullable().optional()
  ),
  bio: z6.preprocess(
    blankToNull2,
    z6.string().trim().max(2e3, "Bio must be at most 2000 characters.").nullable().optional()
  ),
  phone: z6.preprocess(
    blankToNull2,
    z6.union([z6.null(), phoneSchema]).optional()
  ),
  location: z6.preprocess(
    blankToNull2,
    z6.string().trim().max(150, "Location must be at most 150 characters.").nullable().optional()
  ),
  linkedinUrl: urlField("LinkedIn"),
  githubUrl: urlField("GitHub"),
  portfolioUrl: urlField("portfolio"),
  skills: z6.preprocess(
    parseSkills,
    z6.array(
      z6.string().trim().min(1).max(40, "Each skill must be at most 40 characters.")
    ).max(30, "You can list at most 30 skills.").optional()
  ),
  experienceYears: z6.preprocess(
    blankToNull2,
    z6.coerce.number().int("Experience years must be a whole number.").min(0, "Experience years cannot be negative.").max(60, "Enter a realistic number of years.").nullable().optional()
  ),
  // Multipart values are strings, and z.coerce.boolean() would turn the
  // string "false" into true, so the two literal strings are mapped by hand.
  isVisibleToRecruiters: z6.union([
    z6.boolean(),
    z6.enum(["true", "false"]).transform((value) => value === "true")
  ]).optional()
});
var candidateValidation = {
  upsertProfileSchema
};

// src/app/modules/candidate/candidate.routes.ts
var router6 = Router6();
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
import { Router as Router7 } from "express";

// src/app/modules/company/company.controller.ts
import { StatusCodes as StatusCodes28 } from "http-status-codes";

// src/app/modules/company/company.service.ts
import { StatusCodes as StatusCodes27 } from "http-status-codes";

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
  defaultSelect: COMPANY_LIST_SELECT,
  softDelete: true,
  defaultSortField: "createdAt"
});
var isUniqueConstraintError = (error) => typeof error === "object" && error !== null && error.code === "P2002";
var notifyAdminsOfPendingCompany = async (company, reminder = false) => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", status: "ACTIVE", deletedAt: null },
    select: { id: true }
  });
  if (admins.length === 0) return 0;
  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      title: reminder ? "Company verification reminder" : "New company awaiting verification",
      message: reminder ? `${company.name} is still waiting for verification.` : `${company.name} has registered and is waiting for verification.`,
      type: "SYSTEM",
      metadata: { companyId: company.id, kind: "company_pending" }
    }))
  });
  return admins.length;
};
var notifyAdminsOfNewCompany = async (company) => {
  try {
    await notifyAdminsOfPendingCompany(company);
  } catch {
  }
};
var notifyOwnerOfVerification = async (company) => {
  try {
    await prisma.notification.create({
      data: {
        userId: company.ownerId,
        title: "Your company is verified",
        message: `${company.name} has been verified. You can now publish assessments and invite candidates.`,
        type: "SYSTEM",
        metadata: { companyId: company.id, kind: "company_verified" }
      }
    });
  } catch {
  }
};
var registerCompany = async (userId, payload) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { role: true }
  });
  if (!user) {
    throw new appError_default(StatusCodes27.NOT_FOUND, "User not found.");
  }
  if (user.role === "ADMIN") {
    throw new appError_default(
      StatusCodes27.FORBIDDEN,
      "Admin accounts can't register a company."
    );
  }
  const existing = await prisma.company.findUnique({
    where: { ownerId: userId }
  });
  if (existing && !existing.deletedAt) {
    throw new appError_default(
      StatusCodes27.CONFLICT,
      "You already have a company registered."
    );
  }
  let company;
  try {
    company = await prisma.$transaction(async (tx) => {
      let record;
      if (existing) {
        const slug = await generateUniqueSlug(
          payload.name,
          (candidate) => tx.company.findUnique({ where: { slug: candidate } }).then((found) => found !== null && found.id !== existing.id)
        );
        record = await tx.company.update({
          where: { id: existing.id },
          data: {
            name: payload.name,
            slug,
            description: payload.description ?? null,
            website: payload.website ?? null,
            industry: payload.industry ?? null,
            logo: null,
            isVerified: false,
            deletedAt: null
          },
          select: COMPANY_DETAIL_SELECT
        });
        await tx.subscription.upsert({
          where: { companyId: record.id },
          update: {},
          create: { companyId: record.id, plan: "FREE", status: "ACTIVE" }
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
            ...payload.industry !== void 0 && {
              industry: payload.industry
            },
            ownerId: userId
          },
          select: COMPANY_DETAIL_SELECT
        });
        await tx.subscription.create({
          data: { companyId: record.id, plan: "FREE", status: "ACTIVE" }
        });
      }
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE",
          entity: "Company",
          entityId: record.id,
          newValue: { name: record.name, slug: record.slug },
          metadata: { reactivated: Boolean(existing) }
        }
      });
      if (user.role === "CANDIDATE") {
        await tx.user.update({
          where: { id: userId },
          data: { role: "RECRUITER" }
        });
        await tx.auditLog.create({
          data: {
            userId,
            action: "ROLE_CHANGE",
            entity: "User",
            entityId: userId,
            oldValue: { role: "CANDIDATE" },
            newValue: { role: "RECRUITER" },
            metadata: { reason: "company_registered" }
          }
        });
      }
      return record;
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new appError_default(
        StatusCodes27.CONFLICT,
        "A company with these details already exists. Please try again."
      );
    }
    throw error;
  }
  await notifyAdminsOfNewCompany(company);
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
    throw new appError_default(StatusCodes27.NOT_FOUND, "Company not found.");
  }
  const canSeeUnverified = requesterRole === "ADMIN" || company.ownerId === requesterId;
  if (!company.isVerified && !canSeeUnverified) {
    throw new appError_default(StatusCodes27.NOT_FOUND, "Company not found.");
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
      StatusCodes27.NOT_FOUND,
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
      StatusCodes27.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  const updateData = {};
  const oldValue = {};
  const newValue = {};
  const editableFields = ["description", "website", "industry"];
  for (const field of editableFields) {
    const next = payload[field];
    if (next !== void 0 && next !== existing[field]) {
      updateData[field] = next;
      oldValue[field] = existing[field];
      newValue[field] = next;
    }
  }
  if (file) {
    const uploaded = await uploadFileToCloudinary(
      file.buffer,
      file.originalname,
      "company-logos"
    );
    updateData.logo = uploaded.secure_url;
    oldValue.logo = existing.logo;
    newValue.logo = uploaded.secure_url;
  }
  if (Object.keys(updateData).length === 0) {
    return prisma.company.findUniqueOrThrow({
      where: { id: existing.id },
      select: COMPANY_DETAIL_SELECT
    });
  }
  const [updated] = await prisma.$transaction([
    prisma.company.update({
      where: { id: existing.id },
      data: updateData,
      select: COMPANY_DETAIL_SELECT
    }),
    prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE",
        entity: "Company",
        entityId: existing.id,
        oldValue,
        newValue
      }
    })
  ]);
  return updated;
};
var VERIFICATION_REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1e3;
var requestVerification = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    select: { id: true, name: true, isVerified: true }
  });
  if (!company) {
    throw new appError_default(
      StatusCodes27.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  if (company.isVerified) {
    throw new appError_default(
      StatusCodes27.CONFLICT,
      "Your company is already verified."
    );
  }
  const recentlyNotified = await prisma.notification.findFirst({
    where: {
      type: "SYSTEM",
      createdAt: {
        gt: new Date(Date.now() - VERIFICATION_REMINDER_COOLDOWN_MS)
      },
      user: { role: "ADMIN" },
      metadata: { path: ["companyId"], equals: company.id }
    },
    select: { id: true }
  });
  if (recentlyNotified) {
    throw new appError_default(
      StatusCodes27.TOO_MANY_REQUESTS,
      "Admins were already notified in the last 24 hours. Please try again later."
    );
  }
  const notified = await notifyAdminsOfPendingCompany(company, true);
  if (notified === 0) {
    throw new appError_default(
      StatusCodes27.SERVICE_UNAVAILABLE,
      "No administrator is available to review your company right now."
    );
  }
  return { notified };
};
var verifyCompany = async (id, actorId) => {
  const company = await prisma.company.findFirst({
    where: { id, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(StatusCodes27.NOT_FOUND, "Company not found.");
  }
  if (company.isVerified) {
    throw new appError_default(StatusCodes27.CONFLICT, "Company is already verified.");
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
  await notifyOwnerOfVerification(updated);
  return updated;
};
var softDeleteCompany = async (id, actorId, actorRole) => {
  const company = await prisma.company.findFirst({
    where: { id, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(StatusCodes27.NOT_FOUND, "Company not found.");
  }
  const isOwner = company.ownerId === actorId;
  if (!isOwner && actorRole !== "ADMIN") {
    throw new appError_default(
      StatusCodes27.FORBIDDEN,
      "You don't have permission to delete this company."
    );
  }
  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id },
      data: { deletedAt: /* @__PURE__ */ new Date() }
    });
    const closedAssessments = await tx.assessment.updateMany({
      where: {
        companyId: id,
        deletedAt: null,
        status: { in: ["PUBLISHED", "ACTIVE"] }
      },
      data: { status: "CLOSED" }
    });
    const cancelledInvitations = await tx.assessmentInvitation.deleteMany({
      where: {
        status: "PENDING",
        assessment: { companyId: id }
      }
    });
    await tx.auditLog.create({
      data: {
        userId: actorId,
        action: "DELETE",
        entity: "Company",
        entityId: id,
        oldValue: { name: company.name, isVerified: company.isVerified },
        metadata: {
          deletedByOwner: isOwner,
          closedAssessments: closedAssessments.count,
          cancelledInvitations: cancelledInvitations.count
        }
      }
    });
    const demoted = await tx.user.updateMany({
      where: { id: company.ownerId, role: "RECRUITER" },
      data: { role: "CANDIDATE" }
    });
    if (demoted.count > 0) {
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: "ROLE_CHANGE",
          entity: "User",
          entityId: company.ownerId,
          oldValue: { role: "RECRUITER" },
          newValue: { role: "CANDIDATE" },
          metadata: { reason: "company_deleted" }
        }
      });
    }
  });
  return { message: "Company deleted successfully." };
};
var getMySubscription = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    include: { subscription: true }
  });
  if (!company) {
    throw new appError_default(
      StatusCodes27.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  if (!company.subscription) {
    return { message: "No active subscription." };
  }
  let subscription = company.subscription;
  if (subscription.plan !== "FREE" && subscription.status === "ACTIVE" && subscription.currentPeriodEnd && subscription.currentPeriodEnd < /* @__PURE__ */ new Date()) {
    subscription = await prisma.subscription.update({
      where: { companyId: company.id },
      data: { plan: "FREE", status: "EXPIRED" }
    });
  }
  const snapshot = await getPlanSnapshot(company.id);
  return { ...subscription, ...snapshot };
};
var updateMySubscription = async (userId, plan) => {
  if (plan !== "FREE") {
    throw new appError_default(
      StatusCodes27.BAD_REQUEST,
      "Paid plans can only be activated through checkout."
    );
  }
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null }
  });
  if (!company) {
    throw new appError_default(
      StatusCodes27.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  return prisma.subscription.upsert({
    where: { companyId: company.id },
    update: {
      plan: "FREE",
      status: "ACTIVE",
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      cancelledAt: null
    },
    create: { companyId: company.id, plan: "FREE", status: "ACTIVE" }
  });
};
var cancelMySubscription = async (userId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId: userId, deletedAt: null },
    include: { subscription: true }
  });
  if (!company) {
    throw new appError_default(
      StatusCodes27.NOT_FOUND,
      "You don't have a registered company yet."
    );
  }
  if (!company.subscription) {
    throw new appError_default(
      StatusCodes27.NOT_FOUND,
      "No active subscription to cancel."
    );
  }
  if (company.subscription.status === "CANCELLED" || company.subscription.status === "EXPIRED") {
    throw new appError_default(
      StatusCodes27.CONFLICT,
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
  requestVerification,
  verifyCompany,
  softDeleteCompany,
  getMySubscription,
  updateMySubscription,
  cancelMySubscription
};

// src/app/modules/company/company.controller.ts
var registerCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.registerCompany(
    currentUser.id,
    req.body
  );
  res.status(StatusCodes28.CREATED).json({
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
  res.status(StatusCodes28.OK).json({
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
  res.status(StatusCodes28.OK).json({
    success: true,
    message: "Company retrieved successfully.",
    data: company
  });
});
var getMyCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.getMyCompany(currentUser.id);
  res.status(StatusCodes28.OK).json({
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
  res.status(StatusCodes28.OK).json({
    success: true,
    message: "Company updated successfully.",
    data: company
  });
});
var requestVerification2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await companyService.requestVerification(currentUser.id);
  res.status(StatusCodes28.OK).json({
    success: true,
    message: "Admins have been notified and will review your company.",
    data: result
  });
});
var verifyCompany2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const company = await companyService.verifyCompany(
    req.params.id,
    currentUser.id
  );
  res.status(StatusCodes28.OK).json({
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
  res.status(StatusCodes28.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var getMySubscription2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const subscription = await companyService.getMySubscription(currentUser.id);
  res.status(StatusCodes28.OK).json({
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
  res.status(StatusCodes28.OK).json({
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
  res.status(StatusCodes28.OK).json({
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
  requestVerification: requestVerification2,
  verifyCompany: verifyCompany2,
  deleteCompany,
  getMySubscription: getMySubscription2,
  updateMySubscription: updateMySubscription2,
  cancelMySubscription: cancelMySubscription2
};

// src/app/modules/company/company.validation.ts
import { z as z7 } from "zod";
var registerCompanySchema = z7.object({
  name: z7.string().trim().min(2, "Company name must be at least 2 characters.").max(150, "Company name must be at most 150 characters."),
  description: z7.string().trim().max(2e3, "Description must be at most 2000 characters.").optional(),
  website: z7.string().trim().url("Enter a valid website URL, e.g. https://example.com.").optional(),
  industry: z7.string().trim().max(100, "Industry must be at most 100 characters.").optional()
});
var updateCompanySchema = z7.object({
  description: z7.string().trim().max(2e3, "Description must be at most 2000 characters.").optional(),
  website: z7.string().trim().url("Enter a valid website URL, e.g. https://example.com.").optional(),
  industry: z7.string().trim().max(100, "Industry must be at most 100 characters.").optional()
});
var companyValidation = {
  registerCompanySchema,
  updateCompanySchema,
  updateSubscriptionSchema: z7.object({
    plan: z7.literal("FREE", {
      message: "Only downgrading to FREE is allowed here \u2014 upgrade to a paid plan via checkout."
    })
  })
};

// src/app/modules/company/company.routes.ts
var router7 = Router7();
router7.post(
  "/register",
  requireAuth,
  validateRequest(companyValidation.registerCompanySchema),
  companyController.registerCompany
);
router7.get("/", optionalAuth, companyController.getAllCompanies);
router7.get("/me", requireAuth, companyController.getMyCompany);
router7.post(
  "/me/request-verification",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.requestVerification
);
router7.patch(
  "/me",
  requireAuth,
  requireRole("RECRUITER"),
  imageUpload.single("logo"),
  validateRequestWithFile(companyValidation.updateCompanySchema),
  companyController.updateMyCompany
);
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
router7.get("/:id", optionalAuth, companyController.getCompanyById);
router7.patch(
  "/:id/verify",
  requireAuth,
  requireRole("ADMIN"),
  companyController.verifyCompany
);
router7.delete("/:id", requireAuth, companyController.deleteCompany);
var companyRoutes = router7;

// src/app/modules/consent/consent.routes.ts
import { Router as Router8 } from "express";

// src/app/modules/consent/consent.controller.ts
import { StatusCodes as StatusCodes30 } from "http-status-codes";

// src/app/modules/consent/consent.service.ts
import { StatusCodes as StatusCodes29 } from "http-status-codes";

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
    throw new appError_default(StatusCodes29.NOT_FOUND, "Consent not found.");
  }
  if (!existing.granted) {
    throw new appError_default(
      StatusCodes29.CONFLICT,
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
  res.status(StatusCodes30.OK).json({
    success: true,
    message: "Consents retrieved successfully.",
    data: consents
  });
});
var updateConsent2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const consent = await consentService.updateConsent(currentUser.id, req.body);
  res.status(StatusCodes30.OK).json({
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
  res.status(StatusCodes30.OK).json({
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
import { z as z8 } from "zod";
var consentTypeSchema = z8.enum([
  "MARKETING",
  "ANALYTICS",
  "THIRD_PARTY",
  "PRIVACY_POLICY",
  "TERMS_OF_SERVICE"
]);
var updateConsentSchema = z8.object({
  consentType: consentTypeSchema,
  granted: z8.boolean()
});
var consentValidation = {
  updateConsentSchema
};

// src/app/modules/consent/consent.routes.ts
var router8 = Router8();
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
import { Router as Router9 } from "express";

// src/app/modules/evaluation/evaluation.controller.ts
import { StatusCodes as StatusCodes32 } from "http-status-codes";

// src/app/modules/evaluation/evaluation.service.ts
import { StatusCodes as StatusCodes31 } from "http-status-codes";
var assertCanGrade = (requesterCompanyId, submissionCompanyId, role) => {
  if (role !== "ADMIN" && requesterCompanyId !== submissionCompanyId) {
    throw new appError_default(StatusCodes31.NOT_FOUND, "Submission not found.");
  }
};
var getSubmissionsForAttempt = async (attemptId, requester) => {
  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    select: { id: true, assessment: { select: { companyId: true } } }
  });
  if (!attempt) {
    throw new appError_default(StatusCodes31.NOT_FOUND, "Attempt not found.");
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
    throw new appError_default(StatusCodes31.NOT_FOUND, "Submission not found.");
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
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId)
  });
  if (!assessment) {
    throw new appError_default(StatusCodes31.NOT_FOUND, "Assessment not found.");
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
    throw new appError_default(StatusCodes31.NOT_FOUND, "Submission not found.");
  }
  assertCanGrade(
    companyId,
    submission.attempt.assessment.companyId,
    "RECRUITER"
  );
  if (submission.attempt.status === "NOT_STARTED" || submission.attempt.status === "IN_PROGRESS") {
    throw new appError_default(
      StatusCodes31.CONFLICT,
      "This attempt hasn't been submitted yet."
    );
  }
  if (submission.problem.type === "MCQ") {
    throw new appError_default(
      StatusCodes31.BAD_REQUEST,
      "MCQ submissions are graded automatically and cannot be manually re-graded."
    );
  }
  const assessmentProblem = submission.attempt.assessment.assessmentProblems.find(
    (ap) => ap.problemId === submission.problemId
  );
  const maxScore = assessmentProblem?.marks ?? submission.problem.defaultMarks;
  if (payload.score > maxScore) {
    throw new appError_default(
      StatusCodes31.BAD_REQUEST,
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
var getSubmissionsForAttempt2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
    const submissions = await evaluationService.getSubmissionsForAttempt(
      req.params.attemptId,
      {
        id: currentUser.id,
        role: currentUser.role,
        ...companyId !== void 0 && { companyId }
      }
    );
    res.status(StatusCodes32.OK).json({
      success: true,
      message: "Submissions retrieved successfully.",
      data: submissions
    });
  }
);
var getSubmissionById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
  const submission = await evaluationService.getSubmissionById(
    req.params.id,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(StatusCodes32.OK).json({
    success: true,
    message: "Submission retrieved successfully.",
    data: submission
  });
});
var getPendingEvaluations2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req);
    const submissions = await evaluationService.getPendingEvaluations(
      req.params.assessmentId,
      companyId
    );
    res.status(StatusCodes32.OK).json({
      success: true,
      message: "Pending evaluations retrieved successfully.",
      data: submissions
    });
  }
);
var evaluateSubmission2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const submission = await evaluationService.evaluateSubmission(
    req.params.id,
    currentUser.id,
    companyId,
    req.body
  );
  res.status(StatusCodes32.OK).json({
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
import { z as z9 } from "zod";
var testCaseResultInputSchema2 = z9.object({
  testCaseId: z9.string().min(1),
  passed: z9.boolean(),
  actualOutput: z9.string().max(5e3).optional(),
  points: z9.coerce.number().int().min(0).max(1e3).optional()
});
var manualEvaluationSchema2 = z9.object({
  score: z9.coerce.number().min(0, "Score cannot be negative."),
  feedback: z9.string().trim().max(2e3).optional(),
  testCaseResults: z9.array(testCaseResultInputSchema2).max(50).optional()
});
var evaluationValidation = {
  manualEvaluationSchema: manualEvaluationSchema2
};

// src/app/modules/evaluation/evaluation.routes.ts
var router9 = Router9();
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
import { Router as Router10 } from "express";

// src/app/modules/invitation/invitation.controller.ts
import { StatusCodes as StatusCodes34 } from "http-status-codes";

// src/app/modules/invitation/invitation.service.ts
import { createHash, randomUUID } from "crypto";
import { StatusCodes as StatusCodes33 } from "http-status-codes";

// src/lib/resend.ts
import { Resend } from "resend";
var resend = new Resend(config_default.email.resendApiKey ?? "");

// src/app/utils/sendEmail.ts
var SANDBOX_SENDER = "onboarding@resend.dev";
var useResend = Boolean(config_default.email.resendApiKey) && config_default.email.from !== SANDBOX_SENDER;
var sendEmail = async ({ to, subject, html }) => {
  if (!useResend) {
    await sendEmailSmtp({ to, subject, html });
    return;
  }
  if (config_default.app.env !== "production") {
    console.log(`[Email] Dev-mode email: to=${to}, subject=${subject}`);
    console.log(`[Email] Body preview: ${html.slice(0, 200)}...`);
  }
  try {
    const result = await resend.emails.send({
      from: config_default.email.from,
      to,
      subject,
      html
    });
    if (config_default.app.env !== "production") {
      console.log("[Email] Resend accepted:", result);
    }
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
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
var generateInvitationToken = () => createHash("sha256").update(randomUUID()).digest("hex");
var invitationEmailTemplate = (assessmentTitle, expiresAt) => `
	<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
		<h2>You've been invited to an assessment</h2>
		<p>You've been invited to take the assessment: <strong>${escapeHtml(assessmentTitle)}</strong>.</p>
		<p>Log in to your account and check your invitations to accept and start.</p>
		<p style="font-size: 13px; color: #666;">This invitation expires on ${expiresAt.toDateString()}.</p>
	</div>
`;
var notifyInvitedCandidates = async (notices) => {
  if (notices.length === 0) return;
  try {
    await prisma.notification.createMany({
      data: notices.map((notice) => ({
        userId: notice.candidateId,
        title: "New assessment invitation",
        message: `You've been invited to take "${notice.assessmentTitle}". Open your invitations to accept.`,
        type: "ASSESSMENT_INVITATION",
        metadata: {
          assessmentId: notice.assessmentId,
          invitationId: notice.invitationId
        }
      }))
    });
  } catch (error) {
    console.error("Failed to create invitation notifications", error);
  }
};
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
  await assertCompanyVerified(companyId);
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId) ?? {}
  });
  if (!assessment) {
    throw new appError_default(StatusCodes33.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
    throw new appError_default(
      StatusCodes33.CONFLICT,
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
  await assertCanInvite(companyId, emailsToInvite.length);
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
  await notifyInvitedCandidates(
    created.flatMap(
      (invitation) => invitation.candidateId ? [
        {
          invitationId: invitation.id,
          assessmentId: invitation.assessmentId,
          assessmentTitle: assessment.title,
          candidateId: invitation.candidateId
        }
      ] : []
    )
  );
  await Promise.allSettled(
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
      StatusCodes33.FORBIDDEN,
      "Recruiter scope could not be resolved."
    );
  }
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId) ?? {}
  });
  if (!assessment) {
    throw new appError_default(StatusCodes33.NOT_FOUND, "Assessment not found.");
  }
  return invitationQueryBuilder.execute(query, { assessmentId });
};
var getMyInvitations = async (userId, email) => {
  const unlinked = await prisma.assessmentInvitation.findMany({
    where: { email: email.toLowerCase(), candidateId: null },
    select: {
      id: true,
      assessmentId: true,
      status: true,
      assessment: { select: { title: true } }
    }
  });
  if (unlinked.length > 0) {
    const claimed = await prisma.assessmentInvitation.updateMany({
      where: { id: { in: unlinked.map((item) => item.id) }, candidateId: null },
      data: { candidateId: userId }
    });
    if (claimed.count === unlinked.length) {
      await notifyInvitedCandidates(
        unlinked.filter((item) => item.status === "PENDING").map((item) => ({
          invitationId: item.id,
          assessmentId: item.assessmentId,
          assessmentTitle: item.assessment.title,
          candidateId: userId
        }))
      );
    }
  }
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
    throw new appError_default(StatusCodes33.NOT_FOUND, "Invitation not found.");
  }
  const isInvitedCandidate = invitation.candidateId === requester.id || invitation.email.toLowerCase() === requester.email.toLowerCase();
  const isOwningRecruiter = requester.companyId !== void 0 && invitation.assessment.companyId === requester.companyId;
  if (requester.role !== "ADMIN" && !isInvitedCandidate && !isOwningRecruiter) {
    throw new appError_default(StatusCodes33.NOT_FOUND, "Invitation not found.");
  }
  return invitation;
};
var acceptInvitation = async (id, userId, email) => {
  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { id },
    include: { assessment: true }
  });
  if (!invitation) {
    throw new appError_default(StatusCodes33.NOT_FOUND, "Invitation not found.");
  }
  const belongsToUser = invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();
  if (!belongsToUser) {
    throw new appError_default(
      StatusCodes33.FORBIDDEN,
      "This invitation does not belong to your account."
    );
  }
  if (invitation.status === "PENDING" && invitation.expiresAt && invitation.expiresAt < /* @__PURE__ */ new Date()) {
    await prisma.assessmentInvitation.update({
      where: { id },
      data: { status: "EXPIRED" }
    });
    throw new appError_default(StatusCodes33.GONE, "This invitation has expired.");
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      StatusCodes33.CONFLICT,
      `This invitation is already ${invitation.status.toLowerCase()}.`
    );
  }
  if (invitation.assessment.status !== "PUBLISHED" && invitation.assessment.status !== "ACTIVE") {
    throw new appError_default(
      StatusCodes33.CONFLICT,
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
    throw new appError_default(StatusCodes33.NOT_FOUND, "Invitation not found.");
  }
  const belongsToUser = invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();
  if (!belongsToUser) {
    throw new appError_default(
      StatusCodes33.FORBIDDEN,
      "This invitation does not belong to your account."
    );
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      StatusCodes33.CONFLICT,
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
  const invitation = await prisma.assessmentInvitation.findFirst({
    where: {
      id,
      assessment: withTenantScope({ deletedAt: null }, companyId) ?? {}
    },
    include: { assessment: true }
  });
  if (!invitation) {
    throw new appError_default(StatusCodes33.NOT_FOUND, "Invitation not found.");
  }
  if (invitation.status !== "PENDING") {
    throw new appError_default(
      StatusCodes33.CONFLICT,
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
var inviteCandidates2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await invitationService.inviteCandidates(
    req.params.assessmentId,
    companyId,
    req.body
  );
  res.status(StatusCodes34.CREATED).json({
    success: true,
    message: `${result.invited} candidate(s) invited${result.skipped ? `, ${result.skipped} already invited` : ""}.`,
    data: result
  });
});
var getInvitationsForAssessment2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
    const result = await invitationService.getInvitationsForAssessment(
      req.params.assessmentId,
      companyId,
      req.query
    );
    res.status(StatusCodes34.OK).json({
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
  res.status(StatusCodes34.OK).json({
    success: true,
    message: "Invitations retrieved successfully.",
    data: invitations
  });
});
var getInvitationById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = currentUser.role === "RECRUITER" ? await getCompanyIdForUser(currentUser, req) ?? void 0 : void 0;
  const invitation = await invitationService.getInvitationById(
    req.params.id,
    {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(StatusCodes34.OK).json({
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
  res.status(StatusCodes34.OK).json({
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
  res.status(StatusCodes34.OK).json({
    success: true,
    message: "Invitation declined.",
    data: invitation
  });
});
var cancelInvitation2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await invitationService.cancelInvitation(
    req.params.id,
    companyId
  );
  res.status(StatusCodes34.OK).json({
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
import { z as z10 } from "zod";
var inviteCandidatesSchema = z10.object({
  emails: z10.array(z10.string().trim().email("Invalid email address.")).min(1, "Provide at least one email address.").max(100, "At most 100 emails per request."),
  expiresInDays: z10.coerce.number().int().min(1).max(90).optional()
});
var invitationValidation = {
  inviteCandidatesSchema
};

// src/app/modules/invitation/invitation.routes.ts
var router10 = Router10();
router10.use(requireAuth);
router10.post(
  "/assessments/:assessmentId",
  requireRole("RECRUITER"),
  idempotency(),
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
  invitationAcceptLimiter,
  invitationController.acceptInvitation
);
router10.post(
  "/:id/decline",
  requireRole("CANDIDATE"),
  invitationAcceptLimiter,
  invitationController.declineInvitation
);
router10.delete(
  "/:id",
  requireRole("RECRUITER"),
  invitationController.cancelInvitation
);
var invitationRoutes = router10;

// src/app/modules/notification/notification.routes.ts
import { Router as Router11 } from "express";

// src/app/modules/notification/notification.controller.ts
import { StatusCodes as StatusCodes36 } from "http-status-codes";

// src/app/modules/notification/notification.service.ts
import { StatusCodes as StatusCodes35 } from "http-status-codes";

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
  defaultSelect: NOTIFICATION_SELECT,
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
    throw new appError_default(StatusCodes35.NOT_FOUND, "Notification not found.");
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
    throw new appError_default(StatusCodes35.NOT_FOUND, "Notification not found.");
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
  res.status(StatusCodes36.OK).json({
    success: true,
    message: "Notifications retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getUnreadCount2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.getUnreadCount(currentUser.id);
  res.status(StatusCodes36.OK).json({
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
  res.status(StatusCodes36.OK).json({
    success: true,
    message: "Notification marked as read.",
    data: notification
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await notificationService.markAllAsRead(currentUser.id);
  res.status(StatusCodes36.OK).json({
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
  res.status(StatusCodes36.OK).json({
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
var router11 = Router11();
router11.use(requireAuth);
router11.get("/me", notificationController.getMyNotifications);
router11.get("/unread-count", notificationController.getUnreadCount);
router11.patch("/read-all", notificationController.markAllAsRead);
router11.patch("/:id/read", notificationController.markAsRead);
router11.delete("/:id", notificationController.deleteNotification);
var notificationRoutes = router11;

// src/app/modules/payment/payment.routes.ts
import { Router as Router12 } from "express";

// src/app/modules/payment/payment.controller.ts
import { StatusCodes as StatusCodes37 } from "http-status-codes";
var createCheckoutSession2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const company = await companyService.getMyCompany(currentUser.id);
    const result = await paymentService.createCheckoutSession(
      currentUser.id,
      company.id,
      req.body
    );
    res.status(StatusCodes37.CREATED).json({
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
  res.status(StatusCodes37.OK).json({
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
  res.status(StatusCodes37.OK).json({
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
  res.status(StatusCodes37.OK).json({
    success: true,
    message: "Payment retrieved successfully.",
    data: payment
  });
});
var syncPayment2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const payment = await paymentService.syncPayment(req.params.id, {
    id: currentUser.id,
    role: currentUser.role
  });
  res.status(StatusCodes37.OK).json({
    success: true,
    message: "Payment status refreshed.",
    data: payment
  });
});
var paymentController = {
  createCheckoutSession: createCheckoutSession2,
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  getPaymentById: getPaymentById2,
  syncPayment: syncPayment2
};

// src/app/modules/payment/payment.validation.ts
import { z as z11 } from "zod";
var createCheckoutSchema = z11.object({
  plan: z11.nativeEnum(SubscriptionPlan, {
    message: "Plan must be FREE, PRO, or ENTERPRISE."
  })
});
var paymentValidation = {
  createCheckoutSchema
};

// src/app/modules/payment/payment.routes.ts
var router12 = Router12();
router12.use(requireAuth);
router12.post(
  "/checkout",
  requireRole("RECRUITER"),
  idempotency(),
  paymentCheckoutLimiter,
  validateRequest(paymentValidation.createCheckoutSchema),
  paymentController.createCheckoutSession
);
router12.get("/me", requireRole("RECRUITER"), paymentController.getMyPayments);
router12.get("/", requireRole("ADMIN"), paymentController.getAllPayments);
router12.post(
  "/:id/sync",
  requireRole("RECRUITER", "ADMIN"),
  paymentController.syncPayment
);
router12.get("/:id", paymentController.getPaymentById);
var paymentRoutes = router12;

// src/app/modules/problem/problem.routes.ts
import { Router as Router13 } from "express";

// src/app/modules/problem/problem.controller.ts
import { StatusCodes as StatusCodes39 } from "http-status-codes";

// src/app/modules/problem/problem.service.ts
import { StatusCodes as StatusCodes38 } from "http-status-codes";

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
  defaultSelect: PROBLEM_LIST_SELECT,
  softDelete: true,
  defaultSortField: "createdAt"
});
var createProblem = async (companyId, createdById, payload) => {
  const slug = await generateUniqueSlug(
    payload.title,
    (candidate) => prisma.problem.findUnique({
      where: { companyId_slug: { companyId, slug: candidate } }
    }).then(Boolean)
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
  const tenantScope = withTenantScope({}, companyId);
  return problemQueryBuilder.execute(query, tenantScope);
};
var getProblemById = async (id, companyId) => {
  const whereClause = withTenantScope({ id, deletedAt: null }, companyId);
  const problem = await prisma.problem.findFirst({
    where: whereClause,
    select: PROBLEM_DETAIL_SELECT
  });
  if (!problem) {
    throw new appError_default(StatusCodes38.NOT_FOUND, "Problem not found.");
  }
  return problem;
};
var updateProblem = async (id, companyId, payload) => {
  const whereClause = withTenantScope({ id, deletedAt: null }, companyId);
  const existing = await prisma.problem.findFirst({
    where: whereClause
  });
  if (!existing) {
    throw new appError_default(StatusCodes38.NOT_FOUND, "Problem not found.");
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
        StatusCodes38.CONFLICT,
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
  const whereClause = withTenantScope({ id, deletedAt: null }, companyId);
  const existing = await prisma.problem.findFirst({
    where: whereClause
  });
  if (!existing) {
    throw new appError_default(StatusCodes38.NOT_FOUND, "Problem not found.");
  }
  const usedInLiveAssessment = await prisma.assessmentProblem.findFirst({
    where: {
      problemId: id,
      assessment: { status: { in: ["PUBLISHED", "ACTIVE"] }, deletedAt: null }
    }
  });
  if (usedInLiveAssessment) {
    throw new appError_default(
      StatusCodes38.CONFLICT,
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
var createProblem2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const problem = await problemService.createProblem(
    companyId,
    currentUser.id,
    req.body
  );
  res.status(StatusCodes39.CREATED).json({
    success: true,
    message: "Problem created successfully.",
    data: problem
  });
});
var getAllProblems2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
  const result = await problemService.getAllProblems(
    req.query,
    companyId
  );
  res.status(StatusCodes39.OK).json({
    success: true,
    message: "Problems retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getProblemById2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
  const problem = await problemService.getProblemById(
    req.params.id,
    companyId
  );
  res.status(StatusCodes39.OK).json({
    success: true,
    message: "Problem retrieved successfully.",
    data: problem
  });
});
var updateProblem2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const problem = await problemService.updateProblem(
    req.params.id,
    companyId,
    req.body
  );
  res.status(StatusCodes39.OK).json({
    success: true,
    message: "Problem updated successfully.",
    data: problem
  });
});
var deleteProblem = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await problemService.softDeleteProblem(
    req.params.id,
    companyId
  );
  res.status(StatusCodes39.OK).json({
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
import { z as z12 } from "zod";
var mcqOptionSchema = z12.object({
  optionText: z12.string().trim().min(1, "Option text is required.").max(500),
  isCorrect: z12.boolean(),
  order: z12.number().int().min(1, "Option order must start at 1.")
});
var testCaseSchema = z12.object({
  input: z12.string().max(5e3).optional(),
  expectedOutput: z12.string().trim().min(1, "Expected output is required.").max(5e3),
  isSample: z12.boolean().optional(),
  points: z12.coerce.number().int().min(0).max(1e3).optional(),
  timeLimitMs: z12.coerce.number().int().positive().optional(),
  memoryLimitMb: z12.coerce.number().int().positive().optional()
});
var baseFields = {
  title: z12.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  description: z12.string().trim().min(10, "Description must be at least 10 characters.").max(1e4),
  difficulty: z12.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  defaultMarks: z12.coerce.number().int().min(1, "Marks must be at least 1.").max(1e3).optional(),
  isPublic: z12.boolean().optional()
};
var mcqCreateSchema = z12.object({
  ...baseFields,
  type: z12.literal("MCQ"),
  mcqType: z12.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).default("SINGLE_CHOICE"),
  explanation: z12.string().trim().max(2e3).optional(),
  options: z12.array(mcqOptionSchema).min(2, "Provide at least 2 options.").max(10, "At most 10 options are allowed.")
});
var codingCreateSchema = z12.object({
  ...baseFields,
  type: z12.literal("CODING"),
  timeLimitSeconds: z12.coerce.number().int().min(1).max(7200).optional(),
  testCases: z12.array(testCaseSchema).min(1, "Provide at least 1 test case.")
});
var writtenCreateSchema = z12.object({
  ...baseFields,
  type: z12.literal("WRITTEN")
});
var createProblemSchema = z12.discriminatedUnion("type", [
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
var updateProblemSchema = z12.object({
  title: z12.string().trim().min(3).max(200).optional(),
  description: z12.string().trim().min(10).max(1e4).optional(),
  difficulty: z12.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  defaultMarks: z12.coerce.number().int().min(1).max(1e3).optional(),
  isPublic: z12.boolean().optional(),
  timeLimitSeconds: z12.coerce.number().int().min(1).max(7200).optional(),
  mcqType: z12.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).optional(),
  explanation: z12.string().trim().max(2e3).optional(),
  options: z12.array(mcqOptionSchema).min(2).max(10).optional(),
  testCases: z12.array(testCaseSchema).min(1).optional()
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
var router13 = Router13();
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
import { Router as Router14 } from "express";

// src/app/modules/result/result.controller.ts
import { StatusCodes as StatusCodes41 } from "http-status-codes";

// src/app/modules/result/result.service.ts
import { StatusCodes as StatusCodes40 } from "http-status-codes";

// src/app/modules/result/result.const.ts
var RESULT_LEADERBOARD_SELECT = {
  id: true,
  totalScore: true,
  totalMarks: true,
  percentage: true,
  status: true,
  rank: true,
  evaluatedAt: true,
  assessment: {
    select: { id: true, title: true, passingMarks: true }
  },
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
  const whereClause = { id: attemptId };
  if (requester.role === "CANDIDATE") {
    whereClause.candidateId = requester.id;
  } else if (requester.role !== "ADMIN") {
    if (!requester.companyId) {
      throw new appError_default(
        StatusCodes40.FORBIDDEN,
        "Access denied. Missing company scope."
      );
    }
    whereClause.assessment = { companyId: requester.companyId };
  }
  const attempt = await prisma.assessmentAttempt.findFirst({
    where: whereClause,
    select: {
      id: true,
      assessment: { select: { showResultImmediately: true, status: true } }
    }
  });
  if (!attempt) {
    throw new appError_default(StatusCodes40.NOT_FOUND, "Attempt result not found.");
  }
  if (requester.role === "CANDIDATE" && !isResultReleasedToCandidate(attempt.assessment)) {
    throw new appError_default(
      StatusCodes40.FORBIDDEN,
      "Results for this assessment haven't been released yet."
    );
  }
  const result = await prisma.result.findUnique({
    where: { attemptId },
    select: RESULT_LEADERBOARD_SELECT
  });
  if (!result) {
    throw new appError_default(
      StatusCodes40.NOT_FOUND,
      "Result not available yet \u2014 this attempt may not be finalized."
    );
  }
  return result;
};
var getResultsForAssessment = async (assessmentId, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId)
  });
  if (!assessment) {
    throw new appError_default(StatusCodes40.NOT_FOUND, "Assessment not found.");
  }
  return prisma.result.findMany({
    where: { assessmentId },
    select: RESULT_LEADERBOARD_SELECT,
    orderBy: [{ totalScore: "desc" }, { rank: "asc" }, { evaluatedAt: "asc" }]
  });
};
var releaseResults = async (assessmentId, companyId, actorId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
    select: {
      id: true,
      title: true,
      status: true,
      showResultImmediately: true
    }
  });
  if (!assessment) {
    throw new appError_default(StatusCodes40.NOT_FOUND, "Assessment not found.");
  }
  if (assessment.status === "DRAFT") {
    throw new appError_default(
      StatusCodes40.CONFLICT,
      "Publish this assessment before releasing results."
    );
  }
  if (isResultReleasedToCandidate(assessment)) {
    throw new appError_default(
      StatusCodes40.CONFLICT,
      "Results are already released to candidates."
    );
  }
  await prisma.$transaction([
    prisma.assessment.update({
      where: { id: assessmentId },
      data: { showResultImmediately: true }
    }),
    prisma.auditLog.create({
      data: {
        userId: actorId,
        action: "STATUS_CHANGE",
        entity: "Assessment",
        entityId: assessmentId,
        oldValue: { showResultImmediately: false },
        newValue: { showResultImmediately: true },
        metadata: { reason: "results_released" }
      }
    })
  ]);
  const [notified, waitingForGrading] = await Promise.all([
    prisma.result.count({
      where: { assessmentId, status: { in: ["PASSED", "FAILED"] } }
    }),
    prisma.result.count({ where: { assessmentId, status: "PENDING" } })
  ]);
  try {
    await notifyResultsReleased(assessment.id, assessment.title);
  } catch (error) {
    console.error("Failed to send result-release notifications", error);
  }
  return { released: true, notified, waitingForGrading };
};
var computeRanks = async (assessmentId, companyId) => {
  const assessment = await prisma.assessment.findFirst({
    where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId)
  });
  if (!assessment) {
    throw new appError_default(StatusCodes40.NOT_FOUND, "Assessment not found.");
  }
  const finalizedResults = await prisma.result.findMany({
    where: {
      assessmentId,
      status: { in: ["PASSED", "FAILED"] }
    },
    orderBy: [
      { totalScore: "desc" },
      { evaluatedAt: "asc" },
      { createdAt: "asc" }
    ],
    select: { id: true }
  });
  if (finalizedResults.length === 0) {
    throw new appError_default(
      StatusCodes40.BAD_REQUEST,
      "No fully-graded results to rank yet."
    );
  }
  const CHUNK_SIZE = 100;
  await prisma.$transaction(async (tx) => {
    await tx.result.updateMany({
      where: {
        assessmentId,
        status: "PENDING"
      },
      data: { rank: null }
    });
    for (let i = 0; i < finalizedResults.length; i += CHUNK_SIZE) {
      const chunk = finalizedResults.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(
          (result, index) => tx.result.update({
            where: { id: result.id },
            data: { rank: i + index + 1 }
          })
        )
      );
    }
  });
  return { ranked: finalizedResults.length };
};
var resultService = {
  getResultByAttemptId,
  getResultsForAssessment,
  releaseResults,
  computeRanks
};

// src/app/modules/result/result.controller.ts
var getResultByAttemptId2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = currentUser.role === "CANDIDATE" ? void 0 : await getCompanyIdForUser(currentUser, req) ?? void 0;
  const result = await resultService.getResultByAttemptId(
    req.params.attemptId,
    {
      id: currentUser.id,
      role: currentUser.role,
      ...companyId !== void 0 && { companyId }
    }
  );
  res.status(StatusCodes41.OK).json({
    success: true,
    message: "Result retrieved successfully.",
    data: result
  });
});
var getResultsForAssessment2 = catchAsync(
  async (req, res) => {
    const currentUser = req.user;
    const companyId = await getCompanyIdForUser(currentUser, req) ?? void 0;
    const results = await resultService.getResultsForAssessment(
      req.params.assessmentId,
      companyId
    );
    res.status(StatusCodes41.OK).json({
      success: true,
      message: "Results retrieved successfully.",
      data: results
    });
  }
);
var releaseResults2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await resultService.releaseResults(
    req.params.assessmentId,
    companyId,
    currentUser.id
  );
  res.status(StatusCodes41.OK).json({
    success: true,
    message: "Results released to candidates.",
    data: result
  });
});
var computeRanks2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const companyId = await getCompanyIdForUser(currentUser, req);
  const result = await resultService.computeRanks(
    req.params.assessmentId,
    companyId
  );
  res.status(StatusCodes41.OK).json({
    success: true,
    message: `Ranked ${result.ranked} result(s).`,
    data: result
  });
});
var resultController = {
  getResultByAttemptId: getResultByAttemptId2,
  getResultsForAssessment: getResultsForAssessment2,
  releaseResults: releaseResults2,
  computeRanks: computeRanks2
};

// src/app/modules/result/result.routes.ts
var router14 = Router14();
router14.use(requireAuth);
router14.get("/attempts/:attemptId", resultController.getResultByAttemptId);
router14.get(
  "/assessments/:assessmentId",
  requireRole("RECRUITER", "ADMIN"),
  resultController.getResultsForAssessment
);
router14.patch(
  "/assessments/:assessmentId/release",
  requireRole("RECRUITER"),
  resultController.releaseResults
);
router14.post(
  "/assessments/:assessmentId/compute-ranks",
  requireRole("RECRUITER"),
  resultController.computeRanks
);
var resultRoutes = router14;

// src/app/modules/user/user.routes.ts
import { Router as Router15 } from "express";

// src/app/modules/user/account.controller.ts
import { StatusCodes as StatusCodes43 } from "http-status-codes";

// src/app/modules/user/account.service.ts
import { StatusCodes as StatusCodes42 } from "http-status-codes";
var exportMyData = async (userId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      provider: true,
      emailVerified: true,
      twoFactorEnabled: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new appError_default(StatusCodes42.NOT_FOUND, "User not found.");
  }
  const [
    candidateProfile,
    consents,
    invitations,
    attempts,
    notifications,
    payments,
    company
  ] = await Promise.all([
    prisma.candidateProfile.findFirst({
      where: { userId, deletedAt: null },
      select: {
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
        isVisibleToRecruiters: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.userConsent.findMany({
      where: { userId },
      select: {
        consentType: true,
        granted: true,
        grantedAt: true,
        revokedAt: true
      }
    }),
    prisma.assessmentInvitation.findMany({
      where: {
        OR: [{ candidateId: userId }, { email: user.email.toLowerCase() }]
      },
      select: {
        email: true,
        status: true,
        invitedAt: true,
        acceptedAt: true,
        expiresAt: true,
        completedAt: true,
        assessment: { select: { title: true } }
      },
      orderBy: { invitedAt: "desc" }
    }),
    prisma.assessmentAttempt.findMany({
      where: { candidateId: userId },
      select: {
        attemptNumber: true,
        status: true,
        startedAt: true,
        submittedAt: true,
        expiresAt: true,
        tabSwitchCount: true,
        ipAddress: true,
        userAgent: true,
        assessment: { select: { title: true, showResultImmediately: true } },
        result: {
          select: {
            totalScore: true,
            totalMarks: true,
            percentage: true,
            status: true,
            rank: true,
            evaluatedAt: true
          }
        },
        submissions: {
          select: {
            answerText: true,
            code: true,
            language: true,
            status: true,
            submittedAt: true,
            problem: { select: { title: true, type: true } },
            answers: { select: { option: { select: { optionText: true } } } },
            evaluation: {
              select: {
                score: true,
                maxScore: true,
                feedback: true,
                status: true,
                evaluatedAt: true
              }
            }
          }
        },
        proctoringEvents: {
          select: { eventType: true, timestamp: true },
          orderBy: { timestamp: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.notification.findMany({
      where: { userId },
      select: { title: true, message: true, type: true, isRead: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500
    }),
    prisma.payment.findMany({
      where: { userId },
      select: {
        provider: true,
        status: true,
        amountMinor: true,
        currency: true,
        paidAt: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.company.findFirst({
      where: { ownerId: userId, deletedAt: null },
      select: {
        name: true,
        slug: true,
        description: true,
        website: true,
        industry: true,
        logo: true,
        isVerified: true,
        createdAt: true,
        subscription: {
          select: {
            plan: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true
          }
        }
      }
    })
  ]);
  const attemptsOut = attempts.map(
    ({ assessment, result, submissions, ...attempt }) => {
      const released = assessment.showResultImmediately;
      return {
        ...attempt,
        assessment: { title: assessment.title },
        result: released ? result : null,
        submissions: submissions.map(({ evaluation, ...submission }) => ({
          ...submission,
          evaluation: released ? evaluation : null
        }))
      };
    }
  );
  return {
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    account: user,
    candidateProfile,
    consents,
    invitations,
    attempts: attemptsOut,
    notifications,
    payments,
    company
  };
};
var deleteMyAccount = async (userId, confirmEmail) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true, email: true, role: true }
  });
  if (!user) {
    throw new appError_default(StatusCodes42.NOT_FOUND, "User not found.");
  }
  if (user.role === "ADMIN") {
    throw new appError_default(
      StatusCodes42.FORBIDDEN,
      "Admin accounts can't be deleted from here."
    );
  }
  if (user.role === "RECRUITER") {
    throw new appError_default(
      StatusCodes42.CONFLICT,
      "Company accounts can't be deleted from here yet. Please contact us and we will help."
    );
  }
  if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
    throw new appError_default(
      StatusCodes42.BAD_REQUEST,
      "The email you typed doesn't match your account email."
    );
  }
  const inProgress = await prisma.assessmentAttempt.count({
    where: {
      candidateId: userId,
      status: "IN_PROGRESS",
      expiresAt: { gt: /* @__PURE__ */ new Date() }
    }
  });
  if (inProgress > 0) {
    throw new appError_default(
      StatusCodes42.CONFLICT,
      "You have an assessment in progress. Submit it before deleting your account."
    );
  }
  const now = /* @__PURE__ */ new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { deletedAt: now, status: "SUSPENDED" }
    }),
    prisma.candidateProfile.updateMany({
      where: { userId },
      data: { isVisibleToRecruiters: false, deletedAt: now }
    }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.auditLog.create({
      data: {
        userId,
        action: "DELETE",
        entity: "User",
        entityId: userId,
        metadata: { selfService: true }
      }
    })
  ]);
  return { message: "Your account has been deleted." };
};
var accountService = { exportMyData, deleteMyAccount };

// src/app/modules/user/account.controller.ts
var exportMyData2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const data = await accountService.exportMyData(currentUser.id);
  res.setHeader("Cache-Control", "no-store");
  res.status(StatusCodes43.OK).json({
    success: true,
    message: "Your data export is ready.",
    data
  });
});
var deleteMyAccount2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await accountService.deleteMyAccount(
    currentUser.id,
    req.body.confirmEmail
  );
  res.status(StatusCodes43.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var accountController = { exportMyData: exportMyData2, deleteMyAccount: deleteMyAccount2 };

// src/app/modules/user/account.validation.ts
import { z as z13 } from "zod";
var deleteAccountSchema = z13.object({
  confirmEmail: z13.string().trim().min(1, "Type your email address to confirm.").max(320)
});
var accountValidation = { deleteAccountSchema };

// src/app/modules/user/user.controller.ts
import { StatusCodes as StatusCodes45 } from "http-status-codes";

// src/app/modules/user/user.service.ts
import { StatusCodes as StatusCodes44 } from "http-status-codes";

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
  defaultSelect: USER_PUBLIC_SELECT,
  softDelete: true,
  defaultSortField: "createdAt"
});
var assertNotActingOnSelf = (actorId, targetId, action) => {
  if (actorId === targetId) {
    throw new appError_default(
      StatusCodes44.FORBIDDEN,
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
    throw new appError_default(StatusCodes44.NOT_FOUND, "User not found.");
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
    throw new appError_default(StatusCodes44.NOT_FOUND, "User not found.");
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
    throw new appError_default(StatusCodes44.NOT_FOUND, "User not found.");
  }
  if ((role === "ADMIN" || existing.role === "ADMIN") && actorRole !== "ADMIN") {
    throw new appError_default(
      StatusCodes44.FORBIDDEN,
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
    throw new appError_default(StatusCodes44.NOT_FOUND, "User not found.");
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
  if (status === "SUSPENDED") {
    await prisma.session.deleteMany({ where: { userId: id } });
  }
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
    throw new appError_default(StatusCodes44.NOT_FOUND, "User not found.");
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
  await prisma.session.deleteMany({ where: { userId: id } });
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
  res.status(StatusCodes45.OK).json({
    success: true,
    message: "Users retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(StatusCodes45.OK).json({
    success: true,
    message: "User retrieved successfully.",
    data: user
  });
});
var getMyProfile3 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const user = await userService.getUserById(currentUser.id);
  res.status(StatusCodes45.OK).json({
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
  res.status(StatusCodes45.OK).json({
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
  res.status(StatusCodes45.OK).json({
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
  res.status(StatusCodes45.OK).json({
    success: true,
    message: "User status updated successfully.",
    data: user
  });
});
var deleteUser = catchAsync(async (req, res) => {
  const currentUser = req.user;
  await userService.softDeleteUser(req.params.id, currentUser.id);
  res.status(StatusCodes45.OK).json({
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
var router15 = Router15();
router15.use(requireAuth);
router15.get("/me", userController.getMyProfile);
router15.patch(
  "/me",
  imageUpload.single("image"),
  validateRequestWithFile(userValidation.updateProfileSchema),
  userController.updateMyProfile
);
router15.get("/me/export", accountActionLimiter, accountController.exportMyData);
router15.post(
  "/me/delete",
  accountActionLimiter,
  validateRequest(accountValidation.deleteAccountSchema),
  accountController.deleteMyAccount
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

// src/app/modules/blog/blog.routes.ts
import { Router as Router16 } from "express";

// src/app/modules/blog/blog.controller.ts
import { StatusCodes as StatusCodes47 } from "http-status-codes";

// src/app/modules/blog/blog.service.ts
import { StatusCodes as StatusCodes46 } from "http-status-codes";

// src/app/utils/readingTime.ts
var WORDS_PER_MINUTE = 200;
var calculateReadingTime = (markdown) => {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

// src/app/modules/blog/blog.const.ts
var BLOG_AUTHOR_SELECT = {
  id: true,
  name: true,
  image: true
};
var BLOG_POST_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  status: true,
  readingTimeMinutes: true,
  publishedAt: true,
  createdAt: true,
  author: { select: BLOG_AUTHOR_SELECT },
  category: { select: { id: true, name: true, slug: true } },
  tags: {
    select: { tag: { select: { id: true, name: true, slug: true } } }
  }
};
var BLOG_POST_DETAIL_SELECT = {
  ...BLOG_POST_LIST_SELECT,
  content: true,
  updatedAt: true
};
var BLOG_CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  createdAt: true,
  _count: {
    select: { posts: { where: { status: "PUBLISHED", deletedAt: null } } }
  }
};
var BLOG_AUTHOR_PUBLIC_SELECT = BLOG_AUTHOR_SELECT;

// src/app/modules/blog/blog.service.ts
var POST_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
var str = (value) => typeof value === "string" && value.trim() ? value.trim() : void 0;
var parsePagination2 = (query, maxLimit, defaultLimit) => {
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(
      1,
      Number.parseInt(String(query.limit ?? defaultLimit), 10) || defaultLimit
    )
  );
  return { page, limit, skip: (page - 1) * limit };
};
var buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPage: Math.max(1, Math.ceil(total / limit))
});
var flattenTags = (post) => ({ ...post, tags: post.tags.map((entry) => entry.tag) });
var normalizeTags = (tags = []) => {
  const bySlug = /* @__PURE__ */ new Map();
  for (const raw3 of tags) {
    const name = raw3.trim().replace(/\s+/g, " ");
    const slug = slugify(name);
    if (name && !bySlug.has(slug)) bySlug.set(slug, { name, slug });
  }
  return Array.from(bySlug.values());
};
var toTagCreates = (tags) => tags.map((tag) => ({
  tag: { connectOrCreate: { where: { slug: tag.slug }, create: tag } }
}));
var assertCategoryExists = async (categoryId) => {
  const category = await prisma.blogCategory.findUnique({
    where: { id: categoryId },
    select: { id: true }
  });
  if (!category) {
    throw new appError_default(StatusCodes46.BAD_REQUEST, "Blog category not found.");
  }
};
var publicPostWhere = (query) => {
  const search = str(query.search)?.slice(0, 100);
  const category = str(query.category);
  const tag = str(query.tag);
  const author = str(query.author);
  return {
    status: "PUBLISHED",
    deletedAt: null,
    ...category && { category: { slug: category } },
    ...tag && { tags: { some: { tag: { slug: tag } } } },
    ...author && { authorId: author },
    ...search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }
  };
};
var mapCategory = (category) => {
  const { _count, ...rest } = category;
  return { ...rest, postCount: _count.posts };
};
var getPublishedPosts = async (query) => {
  const { page, limit, skip } = parsePagination2(query, 24, 9);
  const where = publicPostWhere(query);
  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      select: BLOG_POST_LIST_SELECT,
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      skip,
      take: limit
    })
  ]);
  return { data: posts.map(flattenTags), meta: buildMeta(page, limit, total) };
};
var getPublishedPostBySlug = async (slug) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    select: BLOG_POST_DETAIL_SELECT
  });
  if (!post) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  const related = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      categoryId: post.category.id,
      id: { not: post.id }
    },
    select: BLOG_POST_LIST_SELECT,
    orderBy: { publishedAt: "desc" },
    take: 3
  });
  return { ...flattenTags(post), related: related.map(flattenTags) };
};
var getCategories = async () => {
  const categories = await prisma.blogCategory.findMany({
    select: BLOG_CATEGORY_SELECT,
    orderBy: { name: "asc" }
  });
  return categories.map(mapCategory);
};
var getTags = async () => {
  const tags = await prisma.blogTag.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          posts: { where: { post: { status: "PUBLISHED", deletedAt: null } } }
        }
      }
    },
    orderBy: { name: "asc" }
  });
  return tags.map(({ _count, ...tag }) => ({ ...tag, postCount: _count.posts })).filter((tag) => tag.postCount > 0);
};
var getAuthor = async (id) => {
  const author = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
      blogPosts: { some: { status: "PUBLISHED", deletedAt: null } }
    },
    select: BLOG_AUTHOR_PUBLIC_SELECT
  });
  if (!author) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Author not found.");
  }
  const postCount = await prisma.blogPost.count({
    where: { authorId: id, status: "PUBLISHED", deletedAt: null }
  });
  return { ...author, postCount };
};
var getAdminPosts = async (query) => {
  const { page, limit, skip } = parsePagination2(query, 50, 10);
  const status = str(query.status);
  const search = str(query.search)?.slice(0, 100);
  const where = {
    deletedAt: null,
    ...status && POST_STATUSES.includes(status) && {
      status
    },
    ...search && { title: { contains: search, mode: "insensitive" } }
  };
  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      select: BLOG_POST_LIST_SELECT,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip,
      take: limit
    })
  ]);
  return { data: posts.map(flattenTags), meta: buildMeta(page, limit, total) };
};
var getAdminPostById = async (id) => {
  const post = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    select: BLOG_POST_DETAIL_SELECT
  });
  if (!post) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  return flattenTags(post);
};
var createPost = async (authorId, payload) => {
  await assertCategoryExists(payload.categoryId);
  const slug = await generateUniqueSlug(
    payload.title,
    (candidate) => prisma.blogPost.findUnique({ where: { slug: candidate } }).then(Boolean)
  );
  const post = await prisma.blogPost.create({
    data: {
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      readingTimeMinutes: calculateReadingTime(payload.content),
      ...payload.coverImage !== void 0 && {
        coverImage: payload.coverImage
      },
      authorId,
      categoryId: payload.categoryId,
      tags: { create: toTagCreates(normalizeTags(payload.tags)) }
    },
    select: BLOG_POST_DETAIL_SELECT
  });
  return flattenTags(post);
};
var updatePost = async (id, payload) => {
  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    select: { id: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  if (payload.categoryId !== void 0) {
    await assertCategoryExists(payload.categoryId);
  }
  const data = {
    ...payload.title !== void 0 && { title: payload.title },
    ...payload.excerpt !== void 0 && { excerpt: payload.excerpt },
    ...payload.content !== void 0 && {
      content: payload.content,
      readingTimeMinutes: calculateReadingTime(payload.content)
    },
    ...payload.coverImage !== void 0 && { coverImage: payload.coverImage },
    ...payload.categoryId !== void 0 && {
      category: { connect: { id: payload.categoryId } }
    },
    ...payload.tags !== void 0 && {
      tags: { deleteMany: {}, create: toTagCreates(normalizeTags(payload.tags)) }
    }
  };
  const post = await prisma.blogPost.update({
    where: { id },
    data,
    select: BLOG_POST_DETAIL_SELECT
  });
  return flattenTags(post);
};
var publishPost = async (id, actorId) => {
  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, status: true, publishedAt: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  if (existing.status === "PUBLISHED") return getAdminPostById(id);
  await prisma.$transaction([
    prisma.blogPost.update({
      where: { id },
      // Re-publishing keeps the original publish date.
      data: { status: "PUBLISHED", publishedAt: existing.publishedAt ?? /* @__PURE__ */ new Date() }
    }),
    prisma.auditLog.create({
      data: {
        userId: actorId,
        action: "STATUS_CHANGE",
        entity: "BlogPost",
        entityId: id,
        oldValue: { status: existing.status },
        newValue: { status: "PUBLISHED" }
      }
    })
  ]);
  return getAdminPostById(id);
};
var unpublishPost = async (id, actorId) => {
  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, status: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  if (existing.status !== "PUBLISHED") return getAdminPostById(id);
  await prisma.$transaction([
    prisma.blogPost.update({ where: { id }, data: { status: "DRAFT" } }),
    prisma.auditLog.create({
      data: {
        userId: actorId,
        action: "STATUS_CHANGE",
        entity: "BlogPost",
        entityId: id,
        oldValue: { status: "PUBLISHED" },
        newValue: { status: "DRAFT" }
      }
    })
  ]);
  return getAdminPostById(id);
};
var softDeletePost = async (id, actorId) => {
  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, title: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog post not found.");
  }
  await prisma.$transaction([
    prisma.blogPost.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } }),
    prisma.auditLog.create({
      data: {
        userId: actorId,
        action: "DELETE",
        entity: "BlogPost",
        entityId: id,
        oldValue: { title: existing.title }
      }
    })
  ]);
  return { message: "Blog post deleted successfully." };
};
var createCategory = async (payload) => {
  const duplicate = await prisma.blogCategory.findFirst({
    where: { name: { equals: payload.name, mode: "insensitive" } },
    select: { id: true }
  });
  if (duplicate) {
    throw new appError_default(
      StatusCodes46.CONFLICT,
      "A category with this name already exists."
    );
  }
  const slug = await generateUniqueSlug(
    payload.name,
    (candidate) => prisma.blogCategory.findUnique({ where: { slug: candidate } }).then(Boolean)
  );
  const category = await prisma.blogCategory.create({
    data: {
      name: payload.name,
      slug,
      ...payload.description !== void 0 && {
        description: payload.description
      }
    },
    select: BLOG_CATEGORY_SELECT
  });
  return mapCategory(category);
};
var updateCategory = async (id, payload) => {
  const existing = await prisma.blogCategory.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog category not found.");
  }
  if (payload.name !== void 0) {
    const duplicate = await prisma.blogCategory.findFirst({
      where: {
        id: { not: id },
        name: { equals: payload.name, mode: "insensitive" }
      },
      select: { id: true }
    });
    if (duplicate) {
      throw new appError_default(
        StatusCodes46.CONFLICT,
        "A category with this name already exists."
      );
    }
  }
  const category = await prisma.blogCategory.update({
    where: { id },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.description !== void 0 && {
        description: payload.description
      }
    },
    select: BLOG_CATEGORY_SELECT
  });
  return mapCategory(category);
};
var deleteCategory = async (id) => {
  const existing = await prisma.blogCategory.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes46.NOT_FOUND, "Blog category not found.");
  }
  const postCount = await prisma.blogPost.count({ where: { categoryId: id } });
  if (postCount > 0) {
    throw new appError_default(
      StatusCodes46.CONFLICT,
      "This category still has posts. Move them to another category first."
    );
  }
  await prisma.blogCategory.delete({ where: { id } });
  return { message: "Blog category deleted successfully." };
};
var uploadCover = async (file) => {
  if (!file) {
    throw new appError_default(StatusCodes46.BAD_REQUEST, "An image file is required.");
  }
  const uploaded = await uploadFileToCloudinary(
    file.buffer,
    file.originalname,
    "blog-covers"
  );
  return { url: uploaded.secure_url };
};
var blogService = {
  getPublishedPosts,
  getPublishedPostBySlug,
  getCategories,
  getTags,
  getAuthor,
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  publishPost,
  unpublishPost,
  softDeletePost,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCover
};

// src/app/modules/blog/blog.controller.ts
var setPublicCache = (res) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );
};
var queryOf = (req) => req.query;
var getPublishedPosts2 = catchAsync(async (req, res) => {
  const result = await blogService.getPublishedPosts(queryOf(req));
  setPublicCache(res);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog posts retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getPublishedPostBySlug2 = catchAsync(async (req, res) => {
  const post = await blogService.getPublishedPostBySlug(req.params.slug);
  setPublicCache(res);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog post retrieved successfully.",
    data: post
  });
});
var getCategories2 = catchAsync(async (_req, res) => {
  const categories = await blogService.getCategories();
  setPublicCache(res);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog categories retrieved successfully.",
    data: categories
  });
});
var getTags2 = catchAsync(async (_req, res) => {
  const tags = await blogService.getTags();
  setPublicCache(res);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog tags retrieved successfully.",
    data: tags
  });
});
var getAuthor2 = catchAsync(async (req, res) => {
  const author = await blogService.getAuthor(req.params.id);
  setPublicCache(res);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Author retrieved successfully.",
    data: author
  });
});
var getAdminPosts2 = catchAsync(async (req, res) => {
  const result = await blogService.getAdminPosts(queryOf(req));
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog posts retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var getAdminPostById2 = catchAsync(async (req, res) => {
  const post = await blogService.getAdminPostById(req.params.id);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog post retrieved successfully.",
    data: post
  });
});
var createPost2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const post = await blogService.createPost(currentUser.id, req.body);
  res.status(StatusCodes47.CREATED).json({
    success: true,
    message: "Blog post created successfully.",
    data: post
  });
});
var updatePost2 = catchAsync(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog post updated successfully.",
    data: post
  });
});
var publishPost2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const post = await blogService.publishPost(req.params.id, currentUser.id);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog post published.",
    data: post
  });
});
var unpublishPost2 = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const post = await blogService.unpublishPost(req.params.id, currentUser.id);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog post moved back to draft.",
    data: post
  });
});
var deletePost = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const result = await blogService.softDeletePost(req.params.id, currentUser.id);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var createCategory2 = catchAsync(async (req, res) => {
  const category = await blogService.createCategory(req.body);
  res.status(StatusCodes47.CREATED).json({
    success: true,
    message: "Blog category created successfully.",
    data: category
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const category = await blogService.updateCategory(req.params.id, req.body);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: "Blog category updated successfully.",
    data: category
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const result = await blogService.deleteCategory(req.params.id);
  res.status(StatusCodes47.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var uploadCover2 = catchAsync(async (req, res) => {
  const result = await blogService.uploadCover(req.file);
  res.status(StatusCodes47.CREATED).json({
    success: true,
    message: "Cover image uploaded successfully.",
    data: result
  });
});
var blogController = {
  getPublishedPosts: getPublishedPosts2,
  getPublishedPostBySlug: getPublishedPostBySlug2,
  getCategories: getCategories2,
  getTags: getTags2,
  getAuthor: getAuthor2,
  getAdminPosts: getAdminPosts2,
  getAdminPostById: getAdminPostById2,
  createPost: createPost2,
  updatePost: updatePost2,
  publishPost: publishPost2,
  unpublishPost: unpublishPost2,
  deletePost,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  uploadCover: uploadCover2
};

// src/app/modules/blog/blog.validation.ts
import { z as z14 } from "zod";
var httpsUrl = z14.string().trim().url("Cover image must be a valid URL.").refine((value) => value.startsWith("https://"), "Cover image URL must use https.");
var postFields = {
  title: z14.string().trim().min(5, "Title must be at least 5 characters.").max(160),
  excerpt: z14.string().trim().min(20, "Excerpt must be at least 20 characters.").max(300),
  content: z14.string().trim().min(100, "Content must be at least 100 characters.").max(1e5),
  coverImage: httpsUrl.optional(),
  categoryId: z14.string().trim().min(1, "Category is required."),
  tags: z14.array(z14.string().trim().min(2, "Tags must be at least 2 characters.").max(30)).max(8, "At most 8 tags are allowed.").optional()
};
var createBlogPostSchema = z14.object(postFields);
var updateBlogPostSchema = z14.object(postFields).partial().extend({ coverImage: httpsUrl.nullable().optional() }).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update."
});
var categoryFields = {
  name: z14.string().trim().min(2, "Name must be at least 2 characters.").max(50),
  description: z14.string().trim().max(300).optional()
};
var createBlogCategorySchema = z14.object(categoryFields);
var updateBlogCategorySchema = z14.object(categoryFields).partial().refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update."
});
var blogValidation = {
  createBlogPostSchema,
  updateBlogPostSchema,
  createBlogCategorySchema,
  updateBlogCategorySchema
};

// src/app/modules/blog/blog.routes.ts
var router16 = Router16();
router16.get("/posts", blogController.getPublishedPosts);
router16.get("/posts/:slug", blogController.getPublishedPostBySlug);
router16.get("/categories", blogController.getCategories);
router16.get("/tags", blogController.getTags);
router16.get("/authors/:id", blogController.getAuthor);
var adminRouter = Router16();
adminRouter.use(requireAuth, requireRole("ADMIN"));
adminRouter.get("/posts", blogController.getAdminPosts);
adminRouter.get("/posts/:id", blogController.getAdminPostById);
adminRouter.post(
  "/posts",
  validateRequest(blogValidation.createBlogPostSchema),
  blogController.createPost
);
adminRouter.patch(
  "/posts/:id",
  validateRequest(blogValidation.updateBlogPostSchema),
  blogController.updatePost
);
adminRouter.patch("/posts/:id/publish", blogController.publishPost);
adminRouter.patch("/posts/:id/unpublish", blogController.unpublishPost);
adminRouter.delete("/posts/:id", blogController.deletePost);
adminRouter.post(
  "/categories",
  validateRequest(blogValidation.createBlogCategorySchema),
  blogController.createCategory
);
adminRouter.patch(
  "/categories/:id",
  validateRequest(blogValidation.updateBlogCategorySchema),
  blogController.updateCategory
);
adminRouter.delete("/categories/:id", blogController.deleteCategory);
adminRouter.post(
  "/upload-cover",
  imageUpload.single("image"),
  blogController.uploadCover
);
router16.use("/admin", adminRouter);
var blogRoutes = router16;

// src/app/modules/contact/contact.routes.ts
import { Router as Router17 } from "express";

// src/app/modules/contact/contact.controller.ts
import { StatusCodes as StatusCodes49 } from "http-status-codes";

// src/app/modules/contact/contact.service.ts
import { StatusCodes as StatusCodes48 } from "http-status-codes";

// src/app/modules/contact/contact.const.ts
var CONTACT_MESSAGE_SELECT = {
  id: true,
  name: true,
  email: true,
  subject: true,
  message: true,
  status: true,
  readAt: true,
  createdAt: true
};

// src/app/modules/contact/contact.service.ts
var adminEmailHtml = (m) => `
	<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
		<h2>New contact message</h2>
		<p><strong>From:</strong> ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</p>
		<p><strong>Subject:</strong> ${escapeHtml(m.subject)}</p>
		<p style="white-space: pre-wrap;">${escapeHtml(m.message)}</p>
		<p style="font-size: 13px; color: #666;">
			Reply to ${escapeHtml(m.email)} directly, or manage messages in the admin dashboard.
		</p>
	</div>
`;
var notifyAdmins = async (stored) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN", status: "ACTIVE", deletedAt: null },
      select: { id: true }
    });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "New contact message",
          message: `${stored.name}: ${stored.subject}`,
          type: "SYSTEM",
          metadata: { contactMessageId: stored.id }
        }))
      });
    }
  } catch (error) {
    console.error("[Contact] Failed to create admin notifications:", error);
  }
  try {
    await sendEmail({
      to: config_default.superAdmin.email,
      subject: `New contact message: ${stored.subject}`,
      html: adminEmailHtml(stored)
    });
  } catch (error) {
    console.error("[Contact] Failed to email the admin:", error);
  }
};
var createMessage = async (payload) => {
  if (payload.website && payload.website.trim() !== "") {
    return { received: true };
  }
  const stored = await prisma.contactMessage.create({
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message
    },
    select: CONTACT_MESSAGE_SELECT
  });
  await notifyAdmins(stored);
  return { received: true };
};
var str2 = (value) => typeof value === "string" && value.trim() ? value.trim() : void 0;
var getMessages = async (query) => {
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(String(query.limit ?? "10"), 10) || 10)
  );
  const status = str2(query.status);
  const search = str2(query.search)?.slice(0, 100);
  const where = {
    ...status === "NEW" || status === "READ" ? { status } : {},
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } }
      ]
    }
  };
  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      select: CONTACT_MESSAGE_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return {
    data: messages,
    meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) }
  };
};
var updateStatus3 = async (id, payload) => {
  const existing = await prisma.contactMessage.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes48.NOT_FOUND, "Message not found.");
  }
  return prisma.contactMessage.update({
    where: { id },
    data: {
      status: payload.status,
      readAt: payload.status === "READ" ? /* @__PURE__ */ new Date() : null
    },
    select: CONTACT_MESSAGE_SELECT
  });
};
var deleteMessage = async (id) => {
  const existing = await prisma.contactMessage.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) {
    throw new appError_default(StatusCodes48.NOT_FOUND, "Message not found.");
  }
  await prisma.contactMessage.delete({ where: { id } });
  return { message: "Message deleted successfully." };
};
var contactService = {
  createMessage,
  getMessages,
  updateStatus: updateStatus3,
  deleteMessage
};

// src/app/modules/contact/contact.controller.ts
var createMessage2 = catchAsync(async (req, res) => {
  const result = await contactService.createMessage(req.body);
  res.status(StatusCodes49.CREATED).json({
    success: true,
    message: "Thanks! Your message has been sent.",
    data: result
  });
});
var getMessages2 = catchAsync(async (req, res) => {
  const result = await contactService.getMessages(
    req.query
  );
  res.status(StatusCodes49.OK).json({
    success: true,
    message: "Messages retrieved successfully.",
    meta: result.meta,
    data: result.data
  });
});
var updateStatus4 = catchAsync(async (req, res) => {
  const message = await contactService.updateStatus(
    req.params.id,
    req.body
  );
  res.status(StatusCodes49.OK).json({
    success: true,
    message: "Message updated successfully.",
    data: message
  });
});
var deleteMessage2 = catchAsync(async (req, res) => {
  const result = await contactService.deleteMessage(req.params.id);
  res.status(StatusCodes49.OK).json({
    success: true,
    message: result.message,
    data: null
  });
});
var contactController = {
  createMessage: createMessage2,
  getMessages: getMessages2,
  updateStatus: updateStatus4,
  deleteMessage: deleteMessage2
};

// src/app/modules/contact/contact.validation.ts
import { z as z15 } from "zod";
var singleLine = (label, min, max) => z15.string().trim().min(min, `${label} must be at least ${min} characters.`).max(max, `${label} must be at most ${max} characters.`).regex(/^[^\r\n]*$/, `${label} must be a single line.`);
var createContactMessageSchema = z15.object({
  name: singleLine("Name", 2, 100),
  email: z15.string().trim().toLowerCase().email("Enter a valid email address.").max(320, "Email is too long."),
  subject: singleLine("Subject", 3, 150),
  message: z15.string().trim().min(10, "Message must be at least 10 characters.").max(5e3, "Message must be at most 5000 characters."),
  website: z15.string().max(200).optional()
});
var updateContactMessageStatusSchema = z15.object({
  status: z15.enum(["NEW", "READ"])
});
var contactValidation = {
  createContactMessageSchema,
  updateContactMessageStatusSchema
};

// src/app/modules/contact/contact.routes.ts
var router17 = Router17();
router17.post(
  "/",
  contactLimiter,
  validateRequest(contactValidation.createContactMessageSchema),
  contactController.createMessage
);
var adminRouter2 = Router17();
adminRouter2.use(requireAuth, requireRole("ADMIN"));
adminRouter2.get("/messages", contactController.getMessages);
adminRouter2.patch(
  "/messages/:id/status",
  validateRequest(contactValidation.updateContactMessageStatusSchema),
  contactController.updateStatus
);
adminRouter2.delete("/messages/:id", contactController.deleteMessage);
router17.use("/admin", adminRouter2);
var contactRoutes = router17;

// src/app/routes/index.ts
var router18 = Router18();
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
  { path: "/consents", route: consentRoutes },
  { path: "/blog", route: blogRoutes },
  { path: "/contact", route: contactRoutes }
];
for (const { path: path2, route } of moduleRoutes) {
  router18.use(path2, route);
}
var globalRoutes = router18;

// src/app.ts
var app = express2();
app.set("trust proxy", 1);
if (config_default.app.env === "production") {
  app.use(forceHttps);
}
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
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
  cors({
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
app.use("/api/auth/two-factor", twoFactorLimiter);
if (config_default.app.env !== "production") {
  app.use(
    "/api/auth",
    (req, _res, next) => {
      if (!req.headers.origin) {
        req.headers.origin = "http://localhost:3000";
      }
      next();
    }
  );
}
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express2.json({ limit: "10mb" }));
app.use(sanitizeBody);
app.use(express2.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
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
  res.status(200).json({
    success: true,
    message: "Evalora API is running."
  });
});
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: "healthy",
      database: "connected"
    });
  } catch {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      database: "disconnected"
    });
  }
});
app.get("/api/v1/debug-ip", (req, res) => {
  res.json({ ip: req.ip, forwardedFor: req.headers["x-forwarded-for"] });
});
console.log("=== API ROUTES DEBUG ===");
console.log("API v1 routes are being registered");
console.log("Blog route expected: GET /api/v1/blog/categories");
console.log("Blog admin route expected: POST /api/v1/blog/admin/categories");
console.log("========================");
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
//# sourceMappingURL=server.js.map