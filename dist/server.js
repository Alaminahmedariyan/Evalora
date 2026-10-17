
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
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5e3),
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
  SSLCOMMERZ_IS_LIVE: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  SUPER_ADMIN_NAME: z.string().optional(),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8),
  HCAPTCHA_SECRET_KEY: z.string().optional(),
  INTERNAL_API_SECRET: z.string().min(32).optional(),
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(32).optional(),
  N8N_API_KEY: z.string().min(32).optional(),
  AUTOMATION_LOCAL_DISPATCHER: z.enum(["true", "false"]).default("false").transform((value) => value === "true")
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid or missing environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}
var env = parsed.data;
var config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL
  },
  database: {
    url: env.DATABASE_URL
  },
  betterAuth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL
  },
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
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET
  },
  email: {
    resendApiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM ?? "onboarding@resend.dev",
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD
  },
  redis: {
    url: env.REDIS_URL
  },
  stripe: {
    productId: env.STRIPE_PRODUCT_ID,
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET
  },
  bkash: {
    baseUrl: env.BKASH_BASE_URL,
    username: env.BKASH_USERNAME,
    password: env.BKASH_PASSWORD,
    appKey: env.BKASH_APP_KEY,
    appSecret: env.BKASH_APP_SECRET,
    callbackUrl: env.BKASH_CALLBACK_URL
  },
  sslcommerz: {
    storeId: env.SSLCOMMERZ_STORE_ID,
    storePassword: env.SSLCOMMERZ_STORE_PASSWORD,
    isLive: env.SSLCOMMERZ_IS_LIVE
  },
  superAdmin: {
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
    name: env.SUPER_ADMIN_NAME ?? "Super Admin"
  },
  hcaptcha: {
    secretKey: env.HCAPTCHA_SECRET_KEY
  },
  internalApi: {
    secret: env.INTERNAL_API_SECRET
  },
  n8n: {
    webhookUrl: env.N8N_WEBHOOK_URL,
    webhookSecret: env.N8N_WEBHOOK_SECRET,
    apiKey: env.N8N_API_KEY,
    localDispatcher: env.AUTOMATION_LOCAL_DISPATCHER
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

enum AutomationEventStatus {
  PENDING
  PROCESSING
  DELIVERED
  FAILED
}

enum AiReviewStatus {
  NOT_APPLICABLE
  PENDING_REVIEW
  APPROVED
  OVERRIDDEN
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
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
  PROCTORING_ALERT
  EVALUATION_REVIEW_NEEDED
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
  AI_PROCESSING
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
  id                 String                 @id @default(cuid())
  name               String
  email              String                 @unique @db.VarChar(320)
  image              String?
  phone              String?
  role               UserRole               @default(CANDIDATE)
  status             UserStatus             @default(ACTIVE)
  provider           AuthProvider           @default(EMAIL)
  emailVerified      Boolean                @default(false)
  // Set/read exclusively by the Better Auth twoFactor plugin \u2014 do not toggle manually.
  twoFactorEnabled   Boolean                @default(false)
  lastLoginAt        DateTime?              @db.Timestamptz(3)
  deletedAt          DateTime?              @db.Timestamptz(3)
  createdAt          DateTime               @default(now()) @db.Timestamptz(3)
  updatedAt          DateTime               @updatedAt @db.Timestamptz(3)
  company            Company?
  accounts           Account[]
  sessions           Session[]
  twoFactors         TwoFactor[]
  consents           UserConsent[]
  candidateProfile   CandidateProfile?
  assessmentsCreated Assessment[]           @relation("AssessmentCreator")
  invitations        AssessmentInvitation[] @relation("CandidateInvitations")
  attempts           AssessmentAttempt[]    @relation("CandidateAttempts")
  problemsCreated    Problem[]              @relation("ProblemCreator")
  evaluations        SubmissionEvaluation[] @relation("SubmissionEvaluator")
  payments           Payment[]
  notifications      Notification[]
  auditLogs          AuditLog[]
  blogPosts          BlogPost[]             @relation("BlogPostAuthor")
  idempotencyKeys    IdempotencyKey[]

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
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  issuer                String
  password              String?
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  createdAt             DateTime  @default(now()) @db.Timestamptz(3)
  updatedAt             DateTime  @updatedAt @db.Timestamptz(3)
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

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
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)

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
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("sessions")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime @db.Timestamptz(3)
  createdAt  DateTime @default(now()) @db.Timestamptz(3)
  updatedAt  DateTime @updatedAt @db.Timestamptz(3)

  @@unique([identifier, value])
  @@index([identifier])
  @@index([expiresAt])
  @@map("verifications")
}

// ownerId is required + Restrict: a company must always have an owner.
// To delete an owner, transfer ownership first, then delete the old user.
// Do not switch this to SetNull.
model Company {
  id           String        @id @default(cuid())
  name         String
  slug         String        @unique
  description  String?
  website      String?
  industry     String?
  logo         String?
  isVerified   Boolean       @default(false)
  ownerId      String        @unique
  owner        User          @relation(fields: [ownerId], references: [id], onDelete: Restrict)
  deletedAt    DateTime?     @db.Timestamptz(3)
  createdAt    DateTime      @default(now()) @db.Timestamptz(3)
  updatedAt    DateTime      @updatedAt @db.Timestamptz(3)
  assessments  Assessment[]
  problems     Problem[]
  subscription Subscription?
  payments     Payment[]

  @@index([deletedAt])
  @@map("companies")
}

model CandidateProfile {
  id                    String    @id @default(cuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  headline              String?
  bio                   String?
  phone                 String?
  location              String?
  resumeUrl             String?
  linkedinUrl           String?
  githubUrl             String?
  portfolioUrl          String?
  skills                Json?
  experienceYears       Int?
  resumeParsedAt        DateTime? @db.Timestamptz(3)
  deletedAt             DateTime? @db.Timestamptz(3)
  createdAt             DateTime  @default(now()) @db.Timestamptz(3)
  updatedAt             DateTime  @updatedAt @db.Timestamptz(3)
  isVisibleToRecruiters Boolean   @default(true)

  @@index([deletedAt])
  @@index([isVisibleToRecruiters, deletedAt])
  @@map("candidate_profiles")
}

model Assessment {
  id                    String                 @id @default(cuid())
  title                 String
  slug                  String
  description           String?
  instructions          String?
  durationMinutes       Int
  totalMarks            Int
  passingMarks          Int
  maxAttempts           Int                    @default(1)
  status                AssessmentStatus       @default(DRAFT)
  startAt               DateTime?              @db.Timestamptz(3)
  endAt                 DateTime?              @db.Timestamptz(3)
  publishedAt           DateTime?              @db.Timestamptz(3)
  shuffleQuestions      Boolean                @default(false)
  showResultImmediately Boolean                @default(false)
  allowReview           Boolean                @default(true)
  version               Int                    @default(1)
  isLatestVersion       Boolean                @default(true)
  parentAssessmentId    String?
  parentAssessment      Assessment?            @relation("AssessmentVersions", fields: [parentAssessmentId], references: [id], onDelete: SetNull)
  childVersions         Assessment[]           @relation("AssessmentVersions")
  companyId             String
  company               Company                @relation(fields: [companyId], references: [id], onDelete: Restrict)
  createdById           String
  createdBy             User                   @relation("AssessmentCreator", fields: [createdById], references: [id], onDelete: Restrict)
  deletedAt             DateTime?              @db.Timestamptz(3)
  createdAt             DateTime               @default(now()) @db.Timestamptz(3)
  updatedAt             DateTime               @updatedAt @db.Timestamptz(3)
  assessmentProblems    AssessmentProblem[]
  invitations           AssessmentInvitation[]
  attempts              AssessmentAttempt[]
  results               Result[]

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
  id                 String              @id @default(cuid())
  title              String
  slug               String
  description        String
  type               ProblemType
  difficulty         Difficulty          @default(MEDIUM)
  rubric             String?
  isAiGenerated      Boolean             @default(false)
  defaultMarks       Int                 @default(10)
  timeLimitSeconds   Int?
  companyId          String
  company            Company             @relation(fields: [companyId], references: [id], onDelete: Restrict)
  createdById        String
  createdBy          User                @relation("ProblemCreator", fields: [createdById], references: [id], onDelete: Restrict)
  isPublic           Boolean             @default(false)
  deletedAt          DateTime?           @db.Timestamptz(3)
  createdAt          DateTime            @default(now()) @db.Timestamptz(3)
  updatedAt          DateTime            @updatedAt @db.Timestamptz(3)
  mcqProblem         McqProblem?
  testCases          TestCase[]
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
  id          String      @id @default(cuid())
  problemId   String      @unique
  problem     Problem     @relation(fields: [problemId], references: [id], onDelete: Cascade)
  type        McqType
  explanation String?
  options     McqOption[]

  @@map("mcq_problems")
}

model McqOption {
  id                String             @id @default(cuid())
  mcqProblemId      String
  mcqProblem        McqProblem         @relation(fields: [mcqProblemId], references: [id], onDelete: Cascade)
  optionText        String
  order             Int
  isCorrect         Boolean            @default(false)
  submissionAnswers SubmissionAnswer[]

  @@unique([mcqProblemId, order])
  @@index([mcqProblemId])
  @@index([mcqProblemId, isCorrect])
  @@map("mcq_options")
}

model TestCase {
  id             String           @id @default(cuid())
  problemId      String
  problem        Problem          @relation(fields: [problemId], references: [id], onDelete: Cascade)
  input          String?
  expectedOutput String
  isSample       Boolean          @default(false)
  points         Int              @default(0)
  timeLimitMs    Int?
  memoryLimitMb  Int?
  createdAt      DateTime         @default(now()) @db.Timestamptz(3)
  results        TestCaseResult[]

  @@index([problemId])
  @@index([problemId, isSample])
  @@map("test_cases")
}

model AssessmentProblem {
  id           String     @id @default(cuid())
  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  problemId    String
  problem      Problem    @relation(fields: [problemId], references: [id], onDelete: Restrict)
  order        Int
  marks        Int
  createdAt    DateTime   @default(now()) @db.Timestamptz(3)

  @@unique([assessmentId, problemId])
  @@unique([assessmentId, order])
  @@index([problemId])
  @@map("assessment_problems")
}

// onDelete on assessment is Restrict (not Cascade), consistent with
// AssessmentAttempt.assessment \u2014 assessments with real attempt/invitation
// history cannot be hard-deleted. Archive instead of deleting.
model AssessmentInvitation {
  id             String              @id @default(cuid())
  assessmentId   String
  assessment     Assessment          @relation(fields: [assessmentId], references: [id], onDelete: Restrict)
  // Nullable because an invitation can be created by email before the
  // candidate has an account.
  candidateId    String?
  candidate      User?               @relation("CandidateInvitations", fields: [candidateId], references: [id], onDelete: SetNull)
  email          String              @db.VarChar(320)
  status         InvitationStatus    @default(PENDING)
  tokenHash      String              @unique @db.VarChar(64)
  invitedAt      DateTime            @default(now()) @db.Timestamptz(3)
  acceptedAt     DateTime?           @db.Timestamptz(3)
  expiresAt      DateTime?           @db.Timestamptz(3)
  completedAt    DateTime?           @db.Timestamptz(3)
  reminderSentAt DateTime?           @db.Timestamptz(3)
  attempts       AssessmentAttempt[]

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
  id               String                @id @default(cuid())
  assessmentId     String
  assessment       Assessment            @relation(fields: [assessmentId], references: [id], onDelete: Restrict)
  candidateId      String
  candidate        User                  @relation("CandidateAttempts", fields: [candidateId], references: [id], onDelete: Cascade)
  invitationId     String?
  invitation       AssessmentInvitation? @relation(fields: [invitationId], references: [id], onDelete: SetNull)
  attemptNumber    Int                   @default(1)
  status           AttemptStatus         @default(NOT_STARTED)
  startedAt        DateTime?             @db.Timestamptz(3)
  submittedAt      DateTime?             @db.Timestamptz(3)
  expiresAt        DateTime              @db.Timestamptz(3)
  autoSubmittedAt  DateTime?             @db.Timestamptz(3)
  // Must be incremented in the same transaction as the matching ProctoringEvent insert.
  tabSwitchCount   Int                   @default(0)
  ipAddress        String?
  userAgent        String?
  createdAt        DateTime              @default(now()) @db.Timestamptz(3)
  updatedAt        DateTime              @updatedAt @db.Timestamptz(3)
  submissions      Submission[]
  result           Result?
  report           AttemptReport?
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
  id              String                @id @default(cuid())
  attemptId       String
  attempt         AssessmentAttempt     @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  problemId       String
  problem         Problem               @relation(fields: [problemId], references: [id], onDelete: Restrict)
  answerText      String?
  code            String?
  language        String?
  status          SubmissionStatus      @default(DRAFT)
  submittedAt     DateTime?             @db.Timestamptz(3)
  createdAt       DateTime              @default(now()) @db.Timestamptz(3)
  updatedAt       DateTime              @updatedAt @db.Timestamptz(3)
  answers         SubmissionAnswer[]
  evaluation      SubmissionEvaluation?
  testCaseResults TestCaseResult[]

  @@unique([attemptId, problemId])
  @@index([attemptId, status, createdAt])
  @@index([problemId])
  @@index([submittedAt])
  @@map("submissions")
}

model SubmissionAnswer {
  id           String     @id @default(cuid())
  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  optionId     String
  option       McqOption  @relation(fields: [optionId], references: [id], onDelete: Restrict)
  createdAt    DateTime   @default(now()) @db.Timestamptz(3)

  @@unique([submissionId, optionId])
  @@index([submissionId])
  @@index([optionId])
  @@map("submission_answers")
}

// Single source of truth for a submission's score.
model SubmissionEvaluation {
  id              String           @id @default(cuid())
  submissionId    String           @unique
  submission      Submission       @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  evaluatorId     String?
  evaluator       User?            @relation("SubmissionEvaluator", fields: [evaluatorId], references: [id], onDelete: SetNull)
  score           Int              @default(0)
  maxScore        Int
  feedback        String?
  status          EvaluationStatus @default(PENDING)
  isAutoEvaluated Boolean          @default(false)
  aiScore         Int?
  aiFeedback      String?
  aiModel         String?
  aiEvaluatedAt   DateTime?        @db.Timestamptz(3)
  reviewStatus    AiReviewStatus   @default(NOT_APPLICABLE)
  reviewedAt      DateTime?        @db.Timestamptz(3)
  evaluatedAt     DateTime?        @db.Timestamptz(3)
  metadata        Json?
  createdAt       DateTime         @default(now()) @db.Timestamptz(3)
  updatedAt       DateTime         @updatedAt @db.Timestamptz(3)

  @@index([evaluatorId])
  @@index([status, evaluatedAt])
  @@index([isAutoEvaluated])
  @@index([reviewStatus])
  @@map("submission_evaluations")
}

model TestCaseResult {
  id              String     @id @default(cuid())
  submissionId    String
  submission      Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  testCaseId      String
  testCase        TestCase   @relation(fields: [testCaseId], references: [id], onDelete: Restrict)
  passed          Boolean    @default(false)
  actualOutput    String?
  expectedOutput  String?
  executionTimeMs Int?
  memoryUsedMb    Int?
  points          Int        @default(0)
  errorMessage    String?
  createdAt       DateTime   @default(now()) @db.Timestamptz(3)

  @@unique([submissionId, testCaseId])
  @@index([submissionId])
  @@index([testCaseId])
  @@index([submissionId, passed])
  @@map("test_case_results")
}

// Attempt-level source of truth.
model Result {
  id           String            @id @default(cuid())
  attemptId    String            @unique
  attempt      AssessmentAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  assessmentId String
  assessment   Assessment        @relation(fields: [assessmentId], references: [id], onDelete: Restrict)
  totalScore   Int               @default(0)
  totalMarks   Int
  percentage   Float             @default(0)
  status       ResultStatus      @default(PENDING)
  rank         Int?
  evaluatedAt  DateTime?         @db.Timestamptz(3)
  createdAt    DateTime          @default(now()) @db.Timestamptz(3)
  updatedAt    DateTime          @updatedAt @db.Timestamptz(3)

  @@index([assessmentId, totalScore])
  @@index([assessmentId, rank])
  @@index([assessmentId, status])
  @@index([status])
  @@index([percentage])
  @@map("results")
}

model ProctoringEvent {
  id        String              @id @default(cuid())
  attemptId String
  attempt   AssessmentAttempt   @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  eventType ProctoringEventType
  timestamp DateTime            @default(now()) @db.Timestamptz(3)
  metadata  Json?

  @@index([attemptId, timestamp])
  @@index([attemptId, eventType, timestamp])
  @@index([eventType])
  @@map("proctoring_events")
}

model Subscription {
  id                   String             @id @default(cuid())
  companyId            String             @unique
  company              Company            @relation(fields: [companyId], references: [id], onDelete: Restrict)
  plan                 SubscriptionPlan   @default(FREE)
  status               SubscriptionStatus @default(ACTIVE)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  currentPeriodStart   DateTime?          @db.Timestamptz(3)
  currentPeriodEnd     DateTime?          @db.Timestamptz(3)
  cancelAtPeriodEnd    Boolean            @default(false)
  cancelledAt          DateTime?          @db.Timestamptz(3)
  createdAt            DateTime           @default(now()) @db.Timestamptz(3)
  updatedAt            DateTime           @updatedAt @db.Timestamptz(3)
  payments             Payment[]

  @@index([plan])
  @@index([status])
  @@index([currentPeriodEnd])
  @@map("subscriptions")
}

model Payment {
  id                String          @id @default(cuid())
  userId            String
  user              User            @relation(fields: [userId], references: [id], onDelete: Restrict)
  companyId         String?
  company           Company?        @relation(fields: [companyId], references: [id], onDelete: SetNull)
  subscriptionId    String?
  subscription      Subscription?   @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)
  provider          PaymentProvider
  status            PaymentStatus   @default(PENDING)
  amountMinor       BigInt
  currency          String          @default("USD") @db.VarChar(3)
  transactionId     String?         @unique
  providerPaymentId String?         @unique
  idempotencyKey    String?         @unique
  metadata          Json?
  paidAt            DateTime?       @db.Timestamptz(3)
  failedAt          DateTime?       @db.Timestamptz(3)
  createdAt         DateTime        @default(now()) @db.Timestamptz(3)
  updatedAt         DateTime        @updatedAt @db.Timestamptz(3)

  @@index([userId, createdAt])
  @@index([companyId, createdAt])
  @@index([subscriptionId])
  @@index([status, createdAt])
  @@index([provider])
  @@map("payments")
}

model PaymentWebhookEvent {
  id          String          @id @default(cuid())
  provider    PaymentProvider
  eventId     String
  eventType   String
  payload     Json
  processed   Boolean         @default(false)
  processedAt DateTime?       @db.Timestamptz(3)
  retryCount  Int             @default(0)
  maxRetries  Int             @default(3)
  lastRetryAt DateTime?       @db.Timestamptz(3)
  nextRetryAt DateTime?       @db.Timestamptz(3)
  createdAt   DateTime        @default(now()) @db.Timestamptz(3)

  @@unique([provider, eventId])
  @@index([provider])
  @@index([processed])
  @@index([processed, nextRetryAt])
  @@index([createdAt])
  @@map("payment_webhook_events")
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  message   String
  type      NotificationType
  isRead    Boolean          @default(false)
  metadata  Json?
  createdAt DateTime         @default(now()) @db.Timestamptz(3)
  updatedAt DateTime         @updatedAt @db.Timestamptz(3)

  @@index([userId, type, createdAt])
  @@index([userId, isRead, createdAt])
  @@map("notifications")
}

model AuditLog {
  id        String      @id @default(cuid())
  userId    String?
  user      User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  action    AuditAction
  entity    String
  entityId  String?
  oldValue  Json?
  newValue  Json?
  metadata  Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime    @default(now()) @db.Timestamptz(3)

  @@index([userId])
  @@index([action])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

model UserConsent {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  consentType ConsentType
  granted     Boolean     @default(true)
  grantedAt   DateTime    @default(now()) @db.Timestamptz(3)
  revokedAt   DateTime?   @db.Timestamptz(3)

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
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([key, userId])
  @@index([expiresAt])
  @@index([userId, createdAt])
  @@map("idempotency_keys")
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  description String?
  createdAt   DateTime   @default(now()) @db.Timestamptz(3)
  updatedAt   DateTime   @updatedAt @db.Timestamptz(3)
  posts       BlogPost[]

  @@map("blog_categories")
}

model BlogTag {
  id        String        @id @default(cuid())
  name      String        @unique
  slug      String        @unique
  createdAt DateTime      @default(now()) @db.Timestamptz(3)
  posts     BlogPostTag[]

  @@map("blog_tags")
}

// content is Markdown. A category can't be deleted while posts use it
// (Restrict); an author can't be hard-deleted while they have posts.
model BlogPost {
  id                 String         @id @default(cuid())
  title              String
  slug               String         @unique
  excerpt            String
  content            String
  coverImage         String?
  status             BlogPostStatus @default(DRAFT)
  readingTimeMinutes Int            @default(1)
  publishedAt        DateTime?      @db.Timestamptz(3)
  authorId           String
  author             User           @relation("BlogPostAuthor", fields: [authorId], references: [id], onDelete: Restrict)
  categoryId         String
  category           BlogCategory   @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  tags               BlogPostTag[]
  deletedAt          DateTime?      @db.Timestamptz(3)
  createdAt          DateTime       @default(now()) @db.Timestamptz(3)
  updatedAt          DateTime       @updatedAt @db.Timestamptz(3)

  @@index([status, publishedAt])
  @@index([categoryId, status, publishedAt])
  @@index([authorId, status, publishedAt])
  @@index([deletedAt])
  @@map("blog_posts")
}

model BlogPostTag {
  postId String
  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tagId  String
  tag    BlogTag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([tagId])
  @@map("blog_post_tags")
}

model ContactMessage {
  id        String               @id @default(cuid())
  name      String
  email     String               @db.VarChar(320)
  subject   String
  message   String
  status    ContactMessageStatus @default(NEW)
  readAt    DateTime?            @db.Timestamptz(3)
  createdAt DateTime             @default(now()) @db.Timestamptz(3)

  @@index([status, createdAt])
  @@index([createdAt])
  @@map("contact_messages")
}

model AutomationEvent {
  id            String                @id @default(cuid())
  eventType     String
  aggregateType String
  aggregateId   String
  dedupeKey     String?               @unique
  payload       Json
  status        AutomationEventStatus @default(PENDING)
  retryCount    Int                   @default(0)
  maxRetries    Int                   @default(5)
  lockedAt      DateTime?             @db.Timestamptz(3)
  nextRetryAt   DateTime?             @db.Timestamptz(3)
  lastError     String?
  deliveredAt   DateTime?             @db.Timestamptz(3)
  createdAt     DateTime              @default(now()) @db.Timestamptz(3)
  updatedAt     DateTime              @updatedAt @db.Timestamptz(3)

  @@index([status, nextRetryAt])
  @@index([aggregateType, aggregateId])
  @@index([createdAt])
  @@map("automation_events")
}

model AttemptReport {
  id             String            @id @default(cuid())
  attemptId      String            @unique
  attempt        AssessmentAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  riskLevel      RiskLevel?
  riskSummary    String?
  summary        String?
  strengths      Json?
  weaknesses     Json?
  recommendation String?
  aiModel        String?
  riskAnalyzedAt DateTime?         @db.Timestamptz(3)
  generatedAt    DateTime?         @db.Timestamptz(3)
  createdAt      DateTime          @default(now()) @db.Timestamptz(3)
  updatedAt      DateTime          @updatedAt @db.Timestamptz(3)

  @@index([riskLevel])
  @@map("attempt_reports")
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
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"provider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"twoFactors","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"consents","kind":"object","type":"UserConsent","relationName":"UserToUserConsent"},{"name":"candidateProfile","kind":"object","type":"CandidateProfile","relationName":"CandidateProfileToUser"},{"name":"assessmentsCreated","kind":"object","type":"Assessment","relationName":"AssessmentCreator"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"CandidateInvitations"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"CandidateAttempts"},{"name":"problemsCreated","kind":"object","type":"Problem","relationName":"ProblemCreator"},{"name":"evaluations","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionEvaluator"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"blogPosts","kind":"object","type":"BlogPost","relationName":"BlogPostAuthor"},{"name":"idempotencyKeys","kind":"object","type":"IdempotencyKey","relationName":"IdempotencyKeyToUser"}],"dbName":"users","schema":null},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"issuer","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"accounts","schema":null},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"two_factors","schema":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"sessions","schema":null},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verifications","schema":null},"Company":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"industry","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"CompanyToUser"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessments","kind":"object","type":"Assessment","relationName":"AssessmentToCompany"},{"name":"problems","kind":"object","type":"Problem","relationName":"CompanyToProblem"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"CompanyToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"CompanyToPayment"}],"dbName":"companies","schema":null},"CandidateProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CandidateProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"Json"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"resumeParsedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isVisibleToRecruiters","kind":"scalar","type":"Boolean"}],"dbName":"candidate_profiles","schema":null},"Assessment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"passingMarks","kind":"scalar","type":"Int"},{"name":"maxAttempts","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AssessmentStatus"},{"name":"startAt","kind":"scalar","type":"DateTime"},{"name":"endAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"shuffleQuestions","kind":"scalar","type":"Boolean"},{"name":"showResultImmediately","kind":"scalar","type":"Boolean"},{"name":"allowReview","kind":"scalar","type":"Boolean"},{"name":"version","kind":"scalar","type":"Int"},{"name":"isLatestVersion","kind":"scalar","type":"Boolean"},{"name":"parentAssessmentId","kind":"scalar","type":"String"},{"name":"parentAssessment","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"childVersions","kind":"object","type":"Assessment","relationName":"AssessmentVersions"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"AssessmentToCompany"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"AssessmentCreator"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentToAssessmentProblem"},{"name":"invitations","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentToAssessmentInvitation"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentToAssessmentAttempt"},{"name":"results","kind":"object","type":"Result","relationName":"AssessmentToResult"}],"dbName":"assessments","schema":null},"Problem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ProblemType"},{"name":"difficulty","kind":"enum","type":"Difficulty"},{"name":"rubric","kind":"scalar","type":"String"},{"name":"isAiGenerated","kind":"scalar","type":"Boolean"},{"name":"defaultMarks","kind":"scalar","type":"Int"},{"name":"timeLimitSeconds","kind":"scalar","type":"Int"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToProblem"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"createdBy","kind":"object","type":"User","relationName":"ProblemCreator"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqProblemToProblem"},{"name":"testCases","kind":"object","type":"TestCase","relationName":"ProblemToTestCase"},{"name":"assessmentProblems","kind":"object","type":"AssessmentProblem","relationName":"AssessmentProblemToProblem"},{"name":"submissions","kind":"object","type":"Submission","relationName":"ProblemToSubmission"}],"dbName":"problems","schema":null},"McqProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"McqProblemToProblem"},{"name":"type","kind":"enum","type":"McqType"},{"name":"explanation","kind":"scalar","type":"String"},{"name":"options","kind":"object","type":"McqOption","relationName":"McqOptionToMcqProblem"}],"dbName":"mcq_problems","schema":null},"McqOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mcqProblemId","kind":"scalar","type":"String"},{"name":"mcqProblem","kind":"object","type":"McqProblem","relationName":"McqOptionToMcqProblem"},{"name":"optionText","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"submissionAnswers","kind":"object","type":"SubmissionAnswer","relationName":"McqOptionToSubmissionAnswer"}],"dbName":"mcq_options","schema":null},"TestCase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToTestCase"},{"name":"input","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"isSample","kind":"scalar","type":"Boolean"},{"name":"points","kind":"scalar","type":"Int"},{"name":"timeLimitMs","kind":"scalar","type":"Int"},{"name":"memoryLimitMb","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"results","kind":"object","type":"TestCaseResult","relationName":"TestCaseToTestCaseResult"}],"dbName":"test_cases","schema":null},"AssessmentProblem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentProblem"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"AssessmentProblemToProblem"},{"name":"order","kind":"scalar","type":"Int"},{"name":"marks","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"assessment_problems","schema":null},"AssessmentInvitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentInvitation"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateInvitations"},{"name":"email","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"tokenHash","kind":"scalar","type":"String"},{"name":"invitedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"reminderSentAt","kind":"scalar","type":"DateTime"},{"name":"attempts","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToAssessmentInvitation"}],"dbName":"assessment_invitations","schema":null},"AssessmentAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToAssessmentAttempt"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"User","relationName":"CandidateAttempts"},{"name":"invitationId","kind":"scalar","type":"String"},{"name":"invitation","kind":"object","type":"AssessmentInvitation","relationName":"AssessmentAttemptToAssessmentInvitation"},{"name":"attemptNumber","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"AttemptStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"autoSubmittedAt","kind":"scalar","type":"DateTime"},{"name":"tabSwitchCount","kind":"scalar","type":"Int"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"submissions","kind":"object","type":"Submission","relationName":"AssessmentAttemptToSubmission"},{"name":"result","kind":"object","type":"Result","relationName":"AssessmentAttemptToResult"},{"name":"report","kind":"object","type":"AttemptReport","relationName":"AssessmentAttemptToAttemptReport"},{"name":"proctoringEvents","kind":"object","type":"ProctoringEvent","relationName":"AssessmentAttemptToProctoringEvent"}],"dbName":"assessment_attempts","schema":null},"Submission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToSubmission"},{"name":"problemId","kind":"scalar","type":"String"},{"name":"problem","kind":"object","type":"Problem","relationName":"ProblemToSubmission"},{"name":"answerText","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SubmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"answers","kind":"object","type":"SubmissionAnswer","relationName":"SubmissionToSubmissionAnswer"},{"name":"evaluation","kind":"object","type":"SubmissionEvaluation","relationName":"SubmissionToSubmissionEvaluation"},{"name":"testCaseResults","kind":"object","type":"TestCaseResult","relationName":"SubmissionToTestCaseResult"}],"dbName":"submissions","schema":null},"SubmissionAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionAnswer"},{"name":"optionId","kind":"scalar","type":"String"},{"name":"option","kind":"object","type":"McqOption","relationName":"McqOptionToSubmissionAnswer"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_answers","schema":null},"SubmissionEvaluation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToSubmissionEvaluation"},{"name":"evaluatorId","kind":"scalar","type":"String"},{"name":"evaluator","kind":"object","type":"User","relationName":"SubmissionEvaluator"},{"name":"score","kind":"scalar","type":"Int"},{"name":"maxScore","kind":"scalar","type":"Int"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"EvaluationStatus"},{"name":"isAutoEvaluated","kind":"scalar","type":"Boolean"},{"name":"aiScore","kind":"scalar","type":"Int"},{"name":"aiFeedback","kind":"scalar","type":"String"},{"name":"aiModel","kind":"scalar","type":"String"},{"name":"aiEvaluatedAt","kind":"scalar","type":"DateTime"},{"name":"reviewStatus","kind":"enum","type":"AiReviewStatus"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"submission_evaluations","schema":null},"TestCaseResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"submissionId","kind":"scalar","type":"String"},{"name":"submission","kind":"object","type":"Submission","relationName":"SubmissionToTestCaseResult"},{"name":"testCaseId","kind":"scalar","type":"String"},{"name":"testCase","kind":"object","type":"TestCase","relationName":"TestCaseToTestCaseResult"},{"name":"passed","kind":"scalar","type":"Boolean"},{"name":"actualOutput","kind":"scalar","type":"String"},{"name":"expectedOutput","kind":"scalar","type":"String"},{"name":"executionTimeMs","kind":"scalar","type":"Int"},{"name":"memoryUsedMb","kind":"scalar","type":"Int"},{"name":"points","kind":"scalar","type":"Int"},{"name":"errorMessage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"test_case_results","schema":null},"Result":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToResult"},{"name":"assessmentId","kind":"scalar","type":"String"},{"name":"assessment","kind":"object","type":"Assessment","relationName":"AssessmentToResult"},{"name":"totalScore","kind":"scalar","type":"Int"},{"name":"totalMarks","kind":"scalar","type":"Int"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"ResultStatus"},{"name":"rank","kind":"scalar","type":"Int"},{"name":"evaluatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"results","schema":null},"ProctoringEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToProctoringEvent"},{"name":"eventType","kind":"enum","type":"ProctoringEventType"},{"name":"timestamp","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"}],"dbName":"proctoring_events","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToSubscription"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToPayment"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amountMinor","kind":"scalar","type":"BigInt"},{"name":"currency","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"providerPaymentId","kind":"scalar","type":"String"},{"name":"idempotencyKey","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments","schema":null},"PaymentWebhookEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"processed","kind":"scalar","type":"Boolean"},{"name":"processedAt","kind":"scalar","type":"DateTime"},{"name":"retryCount","kind":"scalar","type":"Int"},{"name":"maxRetries","kind":"scalar","type":"Int"},{"name":"lastRetryAt","kind":"scalar","type":"DateTime"},{"name":"nextRetryAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment_webhook_events","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications","schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"enum","type":"AuditAction"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs","schema":null},"UserConsent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserConsent"},{"name":"consentType","kind":"enum","type":"ConsentType"},{"name":"granted","kind":"scalar","type":"Boolean"},{"name":"grantedAt","kind":"scalar","type":"DateTime"},{"name":"revokedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_consents","schema":null},"IdempotencyKey":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"endpoint","kind":"scalar","type":"String"},{"name":"requestHash","kind":"scalar","type":"String"},{"name":"response","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"IdempotencyKeyToUser"}],"dbName":"idempotency_keys","schema":null},"BlogCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"posts","kind":"object","type":"BlogPost","relationName":"BlogCategoryToBlogPost"}],"dbName":"blog_categories","schema":null},"BlogTag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"posts","kind":"object","type":"BlogPostTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_tags","schema":null},"BlogPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"excerpt","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BlogPostStatus"},{"name":"readingTimeMinutes","kind":"scalar","type":"Int"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"BlogPostAuthor"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"BlogCategory","relationName":"BlogCategoryToBlogPost"},{"name":"tags","kind":"object","type":"BlogPostTag","relationName":"BlogPostToBlogPostTag"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"blog_posts","schema":null},"BlogPostTag":{"fields":[{"name":"postId","kind":"scalar","type":"String"},{"name":"post","kind":"object","type":"BlogPost","relationName":"BlogPostToBlogPostTag"},{"name":"tagId","kind":"scalar","type":"String"},{"name":"tag","kind":"object","type":"BlogTag","relationName":"BlogPostTagToBlogTag"}],"dbName":"blog_post_tags","schema":null},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ContactMessageStatus"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"contact_messages","schema":null},"AutomationEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventType","kind":"scalar","type":"String"},{"name":"aggregateType","kind":"scalar","type":"String"},{"name":"aggregateId","kind":"scalar","type":"String"},{"name":"dedupeKey","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"AutomationEventStatus"},{"name":"retryCount","kind":"scalar","type":"Int"},{"name":"maxRetries","kind":"scalar","type":"Int"},{"name":"lockedAt","kind":"scalar","type":"DateTime"},{"name":"nextRetryAt","kind":"scalar","type":"DateTime"},{"name":"lastError","kind":"scalar","type":"String"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"automation_events","schema":null},"AttemptReport":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"attempt","kind":"object","type":"AssessmentAttempt","relationName":"AssessmentAttemptToAttemptReport"},{"name":"riskLevel","kind":"enum","type":"RiskLevel"},{"name":"riskSummary","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"strengths","kind":"scalar","type":"Json"},{"name":"weaknesses","kind":"scalar","type":"Json"},{"name":"recommendation","kind":"scalar","type":"String"},{"name":"aiModel","kind":"scalar","type":"String"},{"name":"riskAnalyzedAt","kind":"scalar","type":"DateTime"},{"name":"generatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attempt_reports","schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","owner","orderBy","cursor","parentAssessment","childVersions","company","createdBy","assessment","problem","mcqProblem","candidate","attempts","_count","invitation","submissions","attempt","result","report","proctoringEvents","answers","submission","evaluator","evaluation","results","testCase","testCaseResults","option","submissionAnswers","options","testCases","assessmentProblems","invitations","assessments","problems","user","subscription","payments","accounts","sessions","twoFactors","consents","candidateProfile","assessmentsCreated","problemsCreated","evaluations","notifications","auditLogs","author","posts","category","post","tag","tags","blogPosts","idempotencyKeys","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Company.findUnique","Company.findUniqueOrThrow","Company.findFirst","Company.findFirstOrThrow","Company.findMany","Company.createOne","Company.createMany","Company.createManyAndReturn","Company.updateOne","Company.updateMany","Company.updateManyAndReturn","Company.upsertOne","Company.deleteOne","Company.deleteMany","Company.groupBy","Company.aggregate","CandidateProfile.findUnique","CandidateProfile.findUniqueOrThrow","CandidateProfile.findFirst","CandidateProfile.findFirstOrThrow","CandidateProfile.findMany","CandidateProfile.createOne","CandidateProfile.createMany","CandidateProfile.createManyAndReturn","CandidateProfile.updateOne","CandidateProfile.updateMany","CandidateProfile.updateManyAndReturn","CandidateProfile.upsertOne","CandidateProfile.deleteOne","CandidateProfile.deleteMany","_avg","_sum","CandidateProfile.groupBy","CandidateProfile.aggregate","Assessment.findUnique","Assessment.findUniqueOrThrow","Assessment.findFirst","Assessment.findFirstOrThrow","Assessment.findMany","Assessment.createOne","Assessment.createMany","Assessment.createManyAndReturn","Assessment.updateOne","Assessment.updateMany","Assessment.updateManyAndReturn","Assessment.upsertOne","Assessment.deleteOne","Assessment.deleteMany","Assessment.groupBy","Assessment.aggregate","Problem.findUnique","Problem.findUniqueOrThrow","Problem.findFirst","Problem.findFirstOrThrow","Problem.findMany","Problem.createOne","Problem.createMany","Problem.createManyAndReturn","Problem.updateOne","Problem.updateMany","Problem.updateManyAndReturn","Problem.upsertOne","Problem.deleteOne","Problem.deleteMany","Problem.groupBy","Problem.aggregate","McqProblem.findUnique","McqProblem.findUniqueOrThrow","McqProblem.findFirst","McqProblem.findFirstOrThrow","McqProblem.findMany","McqProblem.createOne","McqProblem.createMany","McqProblem.createManyAndReturn","McqProblem.updateOne","McqProblem.updateMany","McqProblem.updateManyAndReturn","McqProblem.upsertOne","McqProblem.deleteOne","McqProblem.deleteMany","McqProblem.groupBy","McqProblem.aggregate","McqOption.findUnique","McqOption.findUniqueOrThrow","McqOption.findFirst","McqOption.findFirstOrThrow","McqOption.findMany","McqOption.createOne","McqOption.createMany","McqOption.createManyAndReturn","McqOption.updateOne","McqOption.updateMany","McqOption.updateManyAndReturn","McqOption.upsertOne","McqOption.deleteOne","McqOption.deleteMany","McqOption.groupBy","McqOption.aggregate","TestCase.findUnique","TestCase.findUniqueOrThrow","TestCase.findFirst","TestCase.findFirstOrThrow","TestCase.findMany","TestCase.createOne","TestCase.createMany","TestCase.createManyAndReturn","TestCase.updateOne","TestCase.updateMany","TestCase.updateManyAndReturn","TestCase.upsertOne","TestCase.deleteOne","TestCase.deleteMany","TestCase.groupBy","TestCase.aggregate","AssessmentProblem.findUnique","AssessmentProblem.findUniqueOrThrow","AssessmentProblem.findFirst","AssessmentProblem.findFirstOrThrow","AssessmentProblem.findMany","AssessmentProblem.createOne","AssessmentProblem.createMany","AssessmentProblem.createManyAndReturn","AssessmentProblem.updateOne","AssessmentProblem.updateMany","AssessmentProblem.updateManyAndReturn","AssessmentProblem.upsertOne","AssessmentProblem.deleteOne","AssessmentProblem.deleteMany","AssessmentProblem.groupBy","AssessmentProblem.aggregate","AssessmentInvitation.findUnique","AssessmentInvitation.findUniqueOrThrow","AssessmentInvitation.findFirst","AssessmentInvitation.findFirstOrThrow","AssessmentInvitation.findMany","AssessmentInvitation.createOne","AssessmentInvitation.createMany","AssessmentInvitation.createManyAndReturn","AssessmentInvitation.updateOne","AssessmentInvitation.updateMany","AssessmentInvitation.updateManyAndReturn","AssessmentInvitation.upsertOne","AssessmentInvitation.deleteOne","AssessmentInvitation.deleteMany","AssessmentInvitation.groupBy","AssessmentInvitation.aggregate","AssessmentAttempt.findUnique","AssessmentAttempt.findUniqueOrThrow","AssessmentAttempt.findFirst","AssessmentAttempt.findFirstOrThrow","AssessmentAttempt.findMany","AssessmentAttempt.createOne","AssessmentAttempt.createMany","AssessmentAttempt.createManyAndReturn","AssessmentAttempt.updateOne","AssessmentAttempt.updateMany","AssessmentAttempt.updateManyAndReturn","AssessmentAttempt.upsertOne","AssessmentAttempt.deleteOne","AssessmentAttempt.deleteMany","AssessmentAttempt.groupBy","AssessmentAttempt.aggregate","Submission.findUnique","Submission.findUniqueOrThrow","Submission.findFirst","Submission.findFirstOrThrow","Submission.findMany","Submission.createOne","Submission.createMany","Submission.createManyAndReturn","Submission.updateOne","Submission.updateMany","Submission.updateManyAndReturn","Submission.upsertOne","Submission.deleteOne","Submission.deleteMany","Submission.groupBy","Submission.aggregate","SubmissionAnswer.findUnique","SubmissionAnswer.findUniqueOrThrow","SubmissionAnswer.findFirst","SubmissionAnswer.findFirstOrThrow","SubmissionAnswer.findMany","SubmissionAnswer.createOne","SubmissionAnswer.createMany","SubmissionAnswer.createManyAndReturn","SubmissionAnswer.updateOne","SubmissionAnswer.updateMany","SubmissionAnswer.updateManyAndReturn","SubmissionAnswer.upsertOne","SubmissionAnswer.deleteOne","SubmissionAnswer.deleteMany","SubmissionAnswer.groupBy","SubmissionAnswer.aggregate","SubmissionEvaluation.findUnique","SubmissionEvaluation.findUniqueOrThrow","SubmissionEvaluation.findFirst","SubmissionEvaluation.findFirstOrThrow","SubmissionEvaluation.findMany","SubmissionEvaluation.createOne","SubmissionEvaluation.createMany","SubmissionEvaluation.createManyAndReturn","SubmissionEvaluation.updateOne","SubmissionEvaluation.updateMany","SubmissionEvaluation.updateManyAndReturn","SubmissionEvaluation.upsertOne","SubmissionEvaluation.deleteOne","SubmissionEvaluation.deleteMany","SubmissionEvaluation.groupBy","SubmissionEvaluation.aggregate","TestCaseResult.findUnique","TestCaseResult.findUniqueOrThrow","TestCaseResult.findFirst","TestCaseResult.findFirstOrThrow","TestCaseResult.findMany","TestCaseResult.createOne","TestCaseResult.createMany","TestCaseResult.createManyAndReturn","TestCaseResult.updateOne","TestCaseResult.updateMany","TestCaseResult.updateManyAndReturn","TestCaseResult.upsertOne","TestCaseResult.deleteOne","TestCaseResult.deleteMany","TestCaseResult.groupBy","TestCaseResult.aggregate","Result.findUnique","Result.findUniqueOrThrow","Result.findFirst","Result.findFirstOrThrow","Result.findMany","Result.createOne","Result.createMany","Result.createManyAndReturn","Result.updateOne","Result.updateMany","Result.updateManyAndReturn","Result.upsertOne","Result.deleteOne","Result.deleteMany","Result.groupBy","Result.aggregate","ProctoringEvent.findUnique","ProctoringEvent.findUniqueOrThrow","ProctoringEvent.findFirst","ProctoringEvent.findFirstOrThrow","ProctoringEvent.findMany","ProctoringEvent.createOne","ProctoringEvent.createMany","ProctoringEvent.createManyAndReturn","ProctoringEvent.updateOne","ProctoringEvent.updateMany","ProctoringEvent.updateManyAndReturn","ProctoringEvent.upsertOne","ProctoringEvent.deleteOne","ProctoringEvent.deleteMany","ProctoringEvent.groupBy","ProctoringEvent.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentWebhookEvent.findUnique","PaymentWebhookEvent.findUniqueOrThrow","PaymentWebhookEvent.findFirst","PaymentWebhookEvent.findFirstOrThrow","PaymentWebhookEvent.findMany","PaymentWebhookEvent.createOne","PaymentWebhookEvent.createMany","PaymentWebhookEvent.createManyAndReturn","PaymentWebhookEvent.updateOne","PaymentWebhookEvent.updateMany","PaymentWebhookEvent.updateManyAndReturn","PaymentWebhookEvent.upsertOne","PaymentWebhookEvent.deleteOne","PaymentWebhookEvent.deleteMany","PaymentWebhookEvent.groupBy","PaymentWebhookEvent.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","UserConsent.findUnique","UserConsent.findUniqueOrThrow","UserConsent.findFirst","UserConsent.findFirstOrThrow","UserConsent.findMany","UserConsent.createOne","UserConsent.createMany","UserConsent.createManyAndReturn","UserConsent.updateOne","UserConsent.updateMany","UserConsent.updateManyAndReturn","UserConsent.upsertOne","UserConsent.deleteOne","UserConsent.deleteMany","UserConsent.groupBy","UserConsent.aggregate","IdempotencyKey.findUnique","IdempotencyKey.findUniqueOrThrow","IdempotencyKey.findFirst","IdempotencyKey.findFirstOrThrow","IdempotencyKey.findMany","IdempotencyKey.createOne","IdempotencyKey.createMany","IdempotencyKey.createManyAndReturn","IdempotencyKey.updateOne","IdempotencyKey.updateMany","IdempotencyKey.updateManyAndReturn","IdempotencyKey.upsertOne","IdempotencyKey.deleteOne","IdempotencyKey.deleteMany","IdempotencyKey.groupBy","IdempotencyKey.aggregate","BlogCategory.findUnique","BlogCategory.findUniqueOrThrow","BlogCategory.findFirst","BlogCategory.findFirstOrThrow","BlogCategory.findMany","BlogCategory.createOne","BlogCategory.createMany","BlogCategory.createManyAndReturn","BlogCategory.updateOne","BlogCategory.updateMany","BlogCategory.updateManyAndReturn","BlogCategory.upsertOne","BlogCategory.deleteOne","BlogCategory.deleteMany","BlogCategory.groupBy","BlogCategory.aggregate","BlogTag.findUnique","BlogTag.findUniqueOrThrow","BlogTag.findFirst","BlogTag.findFirstOrThrow","BlogTag.findMany","BlogTag.createOne","BlogTag.createMany","BlogTag.createManyAndReturn","BlogTag.updateOne","BlogTag.updateMany","BlogTag.updateManyAndReturn","BlogTag.upsertOne","BlogTag.deleteOne","BlogTag.deleteMany","BlogTag.groupBy","BlogTag.aggregate","BlogPost.findUnique","BlogPost.findUniqueOrThrow","BlogPost.findFirst","BlogPost.findFirstOrThrow","BlogPost.findMany","BlogPost.createOne","BlogPost.createMany","BlogPost.createManyAndReturn","BlogPost.updateOne","BlogPost.updateMany","BlogPost.updateManyAndReturn","BlogPost.upsertOne","BlogPost.deleteOne","BlogPost.deleteMany","BlogPost.groupBy","BlogPost.aggregate","BlogPostTag.findUnique","BlogPostTag.findUniqueOrThrow","BlogPostTag.findFirst","BlogPostTag.findFirstOrThrow","BlogPostTag.findMany","BlogPostTag.createOne","BlogPostTag.createMany","BlogPostTag.createManyAndReturn","BlogPostTag.updateOne","BlogPostTag.updateMany","BlogPostTag.updateManyAndReturn","BlogPostTag.upsertOne","BlogPostTag.deleteOne","BlogPostTag.deleteMany","BlogPostTag.groupBy","BlogPostTag.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","AutomationEvent.findUnique","AutomationEvent.findUniqueOrThrow","AutomationEvent.findFirst","AutomationEvent.findFirstOrThrow","AutomationEvent.findMany","AutomationEvent.createOne","AutomationEvent.createMany","AutomationEvent.createManyAndReturn","AutomationEvent.updateOne","AutomationEvent.updateMany","AutomationEvent.updateManyAndReturn","AutomationEvent.upsertOne","AutomationEvent.deleteOne","AutomationEvent.deleteMany","AutomationEvent.groupBy","AutomationEvent.aggregate","AttemptReport.findUnique","AttemptReport.findUniqueOrThrow","AttemptReport.findFirst","AttemptReport.findFirstOrThrow","AttemptReport.findMany","AttemptReport.createOne","AttemptReport.createMany","AttemptReport.createManyAndReturn","AttemptReport.updateOne","AttemptReport.updateMany","AttemptReport.updateManyAndReturn","AttemptReport.upsertOne","AttemptReport.deleteOne","AttemptReport.deleteMany","AttemptReport.groupBy","AttemptReport.aggregate","AND","OR","NOT","id","attemptId","RiskLevel","riskLevel","riskSummary","summary","strengths","weaknesses","recommendation","aiModel","riskAnalyzedAt","generatedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","eventType","aggregateType","aggregateId","dedupeKey","payload","AutomationEventStatus","status","retryCount","maxRetries","lockedAt","nextRetryAt","lastError","deliveredAt","name","email","subject","message","ContactMessageStatus","readAt","postId","tagId","title","slug","excerpt","content","coverImage","BlogPostStatus","readingTimeMinutes","publishedAt","authorId","categoryId","deletedAt","every","some","none","description","key","userId","endpoint","requestHash","response","statusCode","expiresAt","ConsentType","consentType","granted","grantedAt","revokedAt","AuditAction","action","entity","entityId","oldValue","newValue","metadata","ipAddress","userAgent","NotificationType","type","isRead","PaymentProvider","provider","eventId","processed","processedAt","lastRetryAt","provider_eventId","companyId","subscriptionId","PaymentStatus","amountMinor","currency","transactionId","providerPaymentId","idempotencyKey","paidAt","failedAt","SubscriptionPlan","plan","SubscriptionStatus","stripeCustomerId","stripeSubscriptionId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","cancelledAt","ProctoringEventType","timestamp","assessmentId","totalScore","totalMarks","percentage","ResultStatus","rank","evaluatedAt","submissionId","testCaseId","passed","actualOutput","expectedOutput","executionTimeMs","memoryUsedMb","points","errorMessage","evaluatorId","score","maxScore","feedback","EvaluationStatus","isAutoEvaluated","aiScore","aiFeedback","aiEvaluatedAt","AiReviewStatus","reviewStatus","reviewedAt","optionId","problemId","answerText","code","language","SubmissionStatus","submittedAt","candidateId","invitationId","attemptNumber","AttemptStatus","startedAt","autoSubmittedAt","tabSwitchCount","InvitationStatus","tokenHash","invitedAt","acceptedAt","completedAt","reminderSentAt","order","marks","input","isSample","timeLimitMs","memoryLimitMb","mcqProblemId","optionText","isCorrect","McqType","explanation","ProblemType","Difficulty","difficulty","rubric","isAiGenerated","defaultMarks","timeLimitSeconds","createdById","isPublic","instructions","durationMinutes","passingMarks","maxAttempts","AssessmentStatus","startAt","endAt","shuffleQuestions","showResultImmediately","allowReview","version","isLatestVersion","parentAssessmentId","headline","bio","phone","location","resumeUrl","linkedinUrl","githubUrl","portfolioUrl","skills","experienceYears","resumeParsedAt","isVisibleToRecruiters","website","industry","logo","isVerified","ownerId","identifier","value","identifier_value","token","secret","backupCodes","accountId","providerId","issuer","password","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","image","UserRole","role","UserStatus","AuthProvider","emailVerified","twoFactorEnabled","lastLoginAt","key_userId","postId_tagId","userId_consentType","issuer_accountId","companyId_slug","assessmentId_email","submissionId_testCaseId","attemptId_problemId","assessmentId_candidateId_attemptNumber","submissionId_optionId","mcqProblemId_order","assessmentId_problemId","assessmentId_order","companyId_slug_version","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "nBLFArAEIQYAAKQJACAMAAC0CQAgIAAA0QkAICUAALYIACAmAADMCQAgJwAAzQkAICgAAM4JACApAADPCQAgKgAA0AkAICsAAPUIACAsAAD2CAAgLQAA0gkAIC4AANMJACAvAADUCQAgNgAAiwgAIDcAANUJACDwBAAAyAkAMPEEAAAbABDyBAAAyAkAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhmAUAAMoJ4AYinwUBAPcHACGgBQEAAAABsQVAAOoHACHPBQAAywnhBiK9BgEA6AcAIdwGAQDoBwAh3gYAAMkJ3gYi4QYgAKIIACHiBiAAoggAIeMGQADqBwAhAQAAAAEAIBQBAADyCAAgIQAA9QgAICIAAPYIACAkAAD3CAAgJQAAtggAIPAEAAD0CAAw8QQAAAMAEPIEAAD0CAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhnwUBAPcHACGoBQEA9wcAIbEFQADqBwAhtQUBAOgHACHHBgEA6AcAIcgGAQDoBwAhyQYBAOgHACHKBiAAoggAIcsGAQD3BwAhAQAAAAMAICMEAADiCQAgBQAA9QgAIAYAALUIACAHAADyCAAgDAAAtAkAIBgAAOMJACAfAACrCQAgIAAA0QkAIPAEAADgCQAw8QQAAAUAEPIEAADgCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAOEJswYipwUBAPcHACGoBQEA9wcAIa4FQADqBwAhsQVAAOoHACG1BQEA6AcAIdUFAQD3BwAh7AUCAPoHACGsBgEA9wcAIa4GAQDoBwAhrwYCAPoHACGwBgIA-gcAIbEGAgD6BwAhswZAAOoHACG0BkAA6gcAIbUGIACiCAAhtgYgAKIIACG3BiAAoggAIbgGAgD6BwAhuQYgAKIIACG6BgEA6AcAIQ8EAACREAAgBQAAow4AIAYAAP0KACAHAADyDQAgDAAAhBAAIBgAAJsQACAfAACPEAAgIAAAgxAAIK4FAADkCQAgsQUAAOQJACC1BQAA5AkAIK4GAADkCQAgswYAAOQJACC0BgAA5AkAILoGAADkCQAgJAQAAOIJACAFAAD1CAAgBgAAtQgAIAcAAPIIACAMAAC0CQAgGAAA4wkAIB8AAKsJACAgAADRCQAg8AQAAOAJADDxBAAABQAQ8gQAAOAJADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAADhCbMGIqcFAQD3BwAhqAUBAPcHACGuBUAA6gcAIbEFQADqBwAhtQUBAOgHACHVBQEA9wcAIewFAgD6BwAhrAYBAPcHACGuBgEA6AcAIa8GAgD6BwAhsAYCAPoHACGxBgIA-gcAIbMGQADqBwAhtAZAAOoHACG1BiAAoggAIbYGIACiCAAhtwYgAKIIACG4BgIA-gcAIbkGIACiCAAhugYBAOgHACHxBgAA3wkAIAMAAAAFACACAAAGADADAAAHACABAAAABQAgAwAAAAUAIAIAAAYAMAMAAAcAIAsIAACwCQAgCQAA4ggAIPAEAADeCQAw8QQAAAsAEPIEAADeCQAw8wQBAPcHACH_BEAA6wcAIeoFAQD3BwAhhwYBAPcHACGaBgIA-gcAIZsGAgD6BwAhAggAAJEQACAJAADkDAAgDQgAALAJACAJAADiCAAg8AQAAN4JADDxBAAACwAQ8gQAAN4JADDzBAEAAAAB_wRAAOsHACHqBQEA9wcAIYcGAQD3BwAhmgYCAPoHACGbBgIA-gcAIe8GAADcCQAg8AYAAN0JACADAAAACwAgAgAADAAwAwAADQAgCQkAAOIIACAdAADjCAAg8AQAAOAIADDxBAAADwAQ8gQAAOAIADDzBAEA9wcAIcwFAADhCKQGIocGAQD3BwAhpAYBAOgHACEBAAAADwAgCgoAANsJACAcAAC_CQAg8AQAANoJADDxBAAAEQAQ8gQAANoJADDzBAEA9wcAIZoGAgD6BwAhoAYBAPcHACGhBgEA9wcAIaIGIACiCAAhAgoAAI0QACAcAACUEAAgCwoAANsJACAcAAC_CQAg8AQAANoJADDxBAAAEQAQ8gQAANoJADDzBAEAAAABmgYCAPoHACGgBgEA9wcAIaEGAQD3BwAhogYgAKIIACHuBgAA2QkAIAMAAAARACACAAASADADAAATACAJFQAAmQkAIBsAANgJACDwBAAA1wkAMPEEAAAVABDyBAAA1wkAMPMEAQD3BwAh_wRAAOsHACHxBQEA9wcAIYYGAQD3BwAhAhUAAIwQACAbAACaEAAgChUAAJkJACAbAADYCQAg8AQAANcJADDxBAAAFQAQ8gQAANcJADDzBAEAAAAB_wRAAOsHACHxBQEA9wcAIYYGAQD3BwAh7QYAANYJACADAAAAFQAgAgAAFgAwAwAAFwAgEQgAALAJACALAACTCQAgDAAAtAkAIPAEAACyCQAw8QQAABkAEPIEAACyCQAw8wQBAPcHACGYBQAAswmVBiKgBQEA9wcAIbwFQADqBwAh6gUBAPcHACGNBgEA6AcAIZUGAQD3BwAhlgZAAOsHACGXBkAA6gcAIZgGQADqBwAhmQZAAOoHACEBAAAAGQAgIQYAAKQJACAMAAC0CQAgIAAA0QkAICUAALYIACAmAADMCQAgJwAAzQkAICgAAM4JACApAADPCQAgKgAA0AkAICsAAPUIACAsAAD2CAAgLQAA0gkAIC4AANMJACAvAADUCQAgNgAAiwgAIDcAANUJACDwBAAAyAkAMPEEAAAbABDyBAAAyAkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADKCeAGIp8FAQD3BwAhoAUBAPcHACGxBUAA6gcAIc8FAADLCeEGIr0GAQDoBwAh3AYBAOgHACHeBgAAyQneBiLhBiAAoggAIeIGIACiCAAh4wZAAOoHACEBAAAAGwAgGQgAALAJACALAADyCAAgDgAAxAkAIA8AAKwJACARAADFCQAgEgAAxgkAIBMAAMcJACDwBAAAwgkAMPEEAAAdABDyBAAAwgkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADDCZEGIrwFQADrBwAhyQUBAOgHACHKBQEA6AcAIeoFAQD3BwAhjAZAAOoHACGNBgEA9wcAIY4GAQDoBwAhjwYCAPoHACGRBkAA6gcAIZIGQADqBwAhkwYCAPoHACENCAAAkRAAIAsAAPINACAOAACWEAAgDwAAkBAAIBEAAJcQACASAACYEAAgEwAAmRAAIMkFAADkCQAgygUAAOQJACCMBgAA5AkAII4GAADkCQAgkQYAAOQJACCSBgAA5AkAIBoIAACwCQAgCwAA8ggAIA4AAMQJACAPAACsCQAgEQAAxQkAIBIAAMYJACATAADHCQAg8AQAAMIJADDxBAAAHQAQ8gQAAMIJADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAADDCZEGIrwFQADrBwAhyQUBAOgHACHKBQEA6AcAIeoFAQD3BwAhjAZAAOoHACGNBgEA9wcAIY4GAQDoBwAhjwYCAPoHACGRBkAA6gcAIZIGQADqBwAhkwYCAPoHACHsBgAAwQkAIAMAAAAdACACAAAeADADAAAfACABAAAAHQAgEgkAAOIIACAQAADsBwAgFAAAvwkAIBcAAMAJACAaAAC2CQAg8AQAAL0JADDxBAAAIgAQ8gQAAL0JADDzBAEA9wcAIfQEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAAC-CYwGIocGAQD3BwAhiAYBAOgHACGJBgEA6AcAIYoGAQDoBwAhjAZAAOoHACEJCQAA5AwAIBAAAO8JACAUAACUEAAgFwAAlRAAIBoAAJIQACCIBgAA5AkAIIkGAADkCQAgigYAAOQJACCMBgAA5AkAIBMJAADiCAAgEAAA7AcAIBQAAL8JACAXAADACQAgGgAAtgkAIPAEAAC9CQAw8QQAACIAEPIEAAC9CQAw8wQBAAAAAfQEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAAC-CYwGIocGAQD3BwAhiAYBAOgHACGJBgEA6AcAIYoGAQDoBwAhjAZAAOoHACHrBgAAvAkAIAMAAAAiACACAAAjADADAAAkACAQCAAAsAkAIBAAAOwHACDwBAAArQkAMPEEAAAmABDyBAAArQkAMPMEAQD3BwAh9AQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAK8J7wUi6gUBAPcHACHrBQIA-gcAIewFAgD6BwAh7QUIAK4JACHvBQIA8QgAIfAFQADqBwAhAQAAACYAIBEQAADsBwAg8AQAAOYHADDxBAAAKAAQ8gQAAOYHADDzBAEA9wcAIfQEAQD3BwAh9gQAAOcH9gQj9wQBAOgHACH4BAEA6AcAIfkEAADpBwAg-gQAAOkHACD7BAEA6AcAIfwEAQDoBwAh_QRAAOoHACH-BEAA6gcAIf8EQADrBwAhgAVAAOsHACEBAAAAKAAgCRAAAOwHACDwBAAAugkAMPEEAAAqABDyBAAAugkAMPMEAQD3BwAh9AQBAPcHACGSBQAAuwnpBSLIBQAA6QcAIOkFQADrBwAhAhAAAO8JACDIBQAA5AkAIAkQAADsBwAg8AQAALoJADDxBAAAKgAQ8gQAALoJADDzBAEAAAAB9AQBAPcHACGSBQAAuwnpBSLIBQAA6QcAIOkFQADrBwAhAwAAACoAIAIAACsAMAMAACwAIAEAAAAiACABAAAAKgAgAwAAABUAIAIAABYAMAMAABcAIBcVAACZCQAgFgAAkwkAIPAEAACWCQAw8QQAADEAEPIEAACWCQAw8wQBAPcHACH8BAEA6AcAIf8EQADrBwAhgAVAAOsHACGYBQAAlwn_BSLIBQAA6QcAIPAFQADqBwAh8QUBAPcHACH6BQEA6AcAIfsFAgD6BwAh_AUCAPoHACH9BQEA6AcAIf8FIACiCAAhgAYCAPEIACGBBgEA6AcAIYIGQADqBwAhhAYAAJgJhAYihQZAAOoHACEBAAAAMQAgAQAAABsAIBAVAACZCQAgGQAAuQkAIPAEAAC4CQAw8QQAADQAEPIEAAC4CQAw8wQBAPcHACH_BEAA6wcAIfEFAQD3BwAh8gUBAPcHACHzBSAAoggAIfQFAQDoBwAh9QUBAOgHACH2BQIA8QgAIfcFAgDxCAAh-AUCAPoHACH5BQEA6AcAIQcVAACMEAAgGQAAkxAAIPQFAADkCQAg9QUAAOQJACD2BQAA5AkAIPcFAADkCQAg-QUAAOQJACARFQAAmQkAIBkAALkJACDwBAAAuAkAMPEEAAA0ABDyBAAAuAkAMPMEAQAAAAH_BEAA6wcAIfEFAQD3BwAh8gUBAPcHACHzBSAAoggAIfQFAQDoBwAh9QUBAOgHACH2BQIA8QgAIfcFAgDxCAAh-AUCAPoHACH5BQEA6AcAIeoGAAC3CQAgAwAAADQAIAIAADUAMAMAADYAIAMAAAA0ACACAAA1ADADAAA2ACABAAAANAAgAQAAABUAIAEAAAA0ACABAAAAFQAgAQAAABEAIA4JAADiCAAgGAAAtgkAIPAEAAC1CQAw8QQAAD4AEPIEAAC1CQAw8wQBAPcHACH_BEAA6wcAIfUFAQD3BwAh-AUCAPoHACGHBgEA9wcAIZwGAQDoBwAhnQYgAKIIACGeBgIA8QgAIZ8GAgDxCAAhBQkAAOQMACAYAACSEAAgnAYAAOQJACCeBgAA5AkAIJ8GAADkCQAgDgkAAOIIACAYAAC2CQAg8AQAALUJADDxBAAAPgAQ8gQAALUJADDzBAEAAAAB_wRAAOsHACH1BQEA9wcAIfgFAgD6BwAhhwYBAPcHACGcBgEA6AcAIZ0GIACiCAAhngYCAPEIACGfBgIA8QgAIQMAAAA-ACACAAA_ADADAABAACADAAAACwAgAgAADAAwAwAADQAgAwAAACIAIAIAACMAMAMAACQAIAEAAAA-ACABAAAACwAgAQAAACIAIAgIAACREAAgCwAA8g0AIAwAAIQQACC8BQAA5AkAII0GAADkCQAglwYAAOQJACCYBgAA5AkAIJkGAADkCQAgEggAALAJACALAACTCQAgDAAAtAkAIPAEAACyCQAw8QQAABkAEPIEAACyCQAw8wQBAAAAAZgFAACzCZUGIqAFAQD3BwAhvAVAAOoHACHqBQEA9wcAIY0GAQDoBwAhlQYBAAAAAZYGQADrBwAhlwZAAOoHACGYBkAA6gcAIZkGQADqBwAh6QYAALEJACADAAAAGQAgAgAARwAwAwAASAAgAwAAAB0AIAIAAB4AMAMAAB8AIAQIAACREAAgEAAA7wkAIO8FAADkCQAg8AUAAOQJACAQCAAAsAkAIBAAAOwHACDwBAAArQkAMPEEAAAmABDyBAAArQkAMPMEAQAAAAH0BAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAACvCe8FIuoFAQD3BwAh6wUCAPoHACHsBQIA-gcAIe0FCACuCQAh7wUCAPEIACHwBUAA6gcAIQMAAAAmACACAABLADADAABMACABAAAABQAgAQAAAAsAIAEAAAAZACABAAAAHQAgAQAAACYAIBkGAAC1CAAgBwAA8ggAIAoAAKkJACAPAACsCQAgHgAAqgkAIB8AAKsJACDwBAAApgkAMPEEAABTABDyBAAApgkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIacFAQD3BwAhqAUBAPcHACGxBUAA6gcAIbUFAQD3BwAhzAUAAKcJpgYi1QUBAPcHACGnBgAAqAmnBiKoBgEA6AcAIakGIACiCAAhqgYCAPoHACGrBgIA8QgAIawGAQD3BwAhrQYgAKIIACEJBgAA_QoAIAcAAPINACAKAACNEAAgDwAAkBAAIB4AAI4QACAfAACPEAAgsQUAAOQJACCoBgAA5AkAIKsGAADkCQAgGgYAALUIACAHAADyCAAgCgAAqQkAIA8AAKwJACAeAACqCQAgHwAAqwkAIPAEAACmCQAw8QQAAFMAEPIEAACmCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGnBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA9wcAIcwFAACnCaYGItUFAQD3BwAhpwYAAKgJpwYiqAYBAOgHACGpBiAAoggAIaoGAgD6BwAhqwYCAPEIACGsBgEA9wcAIa0GIACiCAAh6AYAAKUJACADAAAAUwAgAgAAVAAwAwAAVQAgEQYAALUIACAlAAC2CAAg8AQAALIIADDxBAAAVwAQ8gQAALIIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAtAjiBSLVBQEA9wcAIeAFAACzCOAFIuIFAQDoBwAh4wUBAOgHACHkBUAA6gcAIeUFQADqBwAh5gUgAKIIACHnBUAA6gcAIQEAAABXACAWBgAApAkAICMAAPIIACAkAAD3CAAg8AQAAKEJADDxBAAAWQAQ8gQAAKEJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAognYBSK3BQEA9wcAIcgFAADpBwAgzwUAAKEIzwUi1QUBAOgHACHWBQEA6AcAIdgFBACjCQAh2QUBAPcHACHaBQEA6AcAIdsFAQDoBwAh3AUBAOgHACHdBUAA6gcAId4FQADqBwAhCwYAAP0KACAjAADyDQAgJAAApQ4AIMgFAADkCQAg1QUAAOQJACDWBQAA5AkAINoFAADkCQAg2wUAAOQJACDcBQAA5AkAIN0FAADkCQAg3gUAAOQJACAWBgAApAkAICMAAPIIACAkAAD3CAAg8AQAAKEJADDxBAAAWQAQ8gQAAKEJADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAACiCdgFIrcFAQD3BwAhyAUAAOkHACDPBQAAoQjPBSLVBQEA6AcAIdYFAQDoBwAh2AUEAKMJACHZBQEA9wcAIdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FQADqBwAh3gVAAOoHACEDAAAAWQAgAgAAWgAwAwAAWwAgAQAAAAMAIAEAAABXACABAAAAWQAgAwAAAFkAIAIAAFoAMAMAAFsAIAEAAAAFACABAAAAUwAgAQAAAFkAIBIjAADyCAAg8AQAAKAJADDxBAAAZAAQ8gQAAKAJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACG3BQEA9wcAIdIGAQD3BwAh0wYBAPcHACHUBgEA9wcAIdUGAQDoBwAh1gYBAOgHACHXBgEA6AcAIdgGAQDoBwAh2QZAAOoHACHaBkAA6gcAIdsGAQDoBwAhCCMAAPINACDVBgAA5AkAINYGAADkCQAg1wYAAOQJACDYBgAA5AkAINkGAADkCQAg2gYAAOQJACDbBgAA5AkAIBMjAADyCAAg8AQAAKAJADDxBAAAZAAQ8gQAAKAJADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIbcFAQD3BwAh0gYBAPcHACHTBgEA9wcAIdQGAQD3BwAh1QYBAOgHACHWBgEA6AcAIdcGAQDoBwAh2AYBAOgHACHZBkAA6gcAIdoGQADqBwAh2wYBAOgHACHnBgAAnwkAIAMAAABkACACAABlADADAABmACAMIwAA8ggAIPAEAACeCQAw8QQAAGgAEPIEAACeCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhtwUBAPcHACG8BUAA6wcAIckFAQDoBwAhygUBAOgHACHPBgEA9wcAIQMjAADyDQAgyQUAAOQJACDKBQAA5AkAIAwjAADyCAAg8AQAAJ4JADDxBAAAaAAQ8gQAAJ4JADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIbcFAQD3BwAhvAVAAOsHACHJBQEA6AcAIcoFAQDoBwAhzwYBAAAAAQMAAABoACACAABpADADAABqACAIIwAA8ggAIPAEAACdCQAw8QQAAGwAEPIEAACdCQAw8wQBAPcHACG3BQEA9wcAIdAGAQD3BwAh0QYBAOgHACECIwAA8g0AINEGAADkCQAgCCMAAPIIACDwBAAAnQkAMPEEAABsABDyBAAAnQkAMPMEAQAAAAG3BQEAAAAB0AYBAPcHACHRBgEA6AcAIQMAAABsACACAABtADADAABuACAKIwAA8ggAIPAEAACbCQAw8QQAAHAAEPIEAACbCQAw8wQBAPcHACG3BQEA9wcAIb4FAACcCb4FIr8FIACiCAAhwAVAAOsHACHBBUAA6gcAIQIjAADyDQAgwQUAAOQJACALIwAA8ggAIPAEAACbCQAw8QQAAHAAEPIEAACbCQAw8wQBAAAAAbcFAQD3BwAhvgUAAJwJvgUivwUgAKIIACHABUAA6wcAIcEFQADqBwAh5gYAAJoJACADAAAAcAAgAgAAcQAwAwAAcgAgFSMAAPIIACDwBAAA8AgAMPEEAAB0ABDyBAAA8AgAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIbEFQADqBwAhtwUBAPcHACG7BgEA6AcAIbwGAQDoBwAhvQYBAOgHACG-BgEA6AcAIb8GAQDoBwAhwAYBAOgHACHBBgEA6AcAIcIGAQDoBwAhwwYAAOkHACDEBgIA8QgAIcUGQADqBwAhxgYgAKIIACEBAAAAdAAgAwAAAAUAIAIAAAYAMAMAAAcAIAMAAAAZACACAABHADADAABIACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAFMAIAIAAFQAMAMAAFUAIAsVAACMEAAgFgAA8g0AIPwEAADkCQAgyAUAAOQJACDwBQAA5AkAIPoFAADkCQAg_QUAAOQJACCABgAA5AkAIIEGAADkCQAgggYAAOQJACCFBgAA5AkAIBcVAACZCQAgFgAAkwkAIPAEAACWCQAw8QQAADEAEPIEAACWCQAw8wQBAAAAAfwEAQDoBwAh_wRAAOsHACGABUAA6wcAIZgFAACXCf8FIsgFAADpBwAg8AVAAOoHACHxBQEAAAAB-gUBAOgHACH7BQIA-gcAIfwFAgD6BwAh_QUBAOgHACH_BSAAoggAIYAGAgDxCAAhgQYBAOgHACGCBkAA6gcAIYQGAACYCYQGIoUGQADqBwAhAwAAADEAIAIAAHoAMAMAAHsAIAMAAABZACACAABaADADAABbACANIwAA8ggAIPAEAACUCQAw8QQAAH4AEPIEAACUCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhogUBAPcHACGnBQEA9wcAIbcFAQD3BwAhyAUAAOkHACDMBQAAlQnMBSLNBSAAoggAIQIjAADyDQAgyAUAAOQJACANIwAA8ggAIPAEAACUCQAw8QQAAH4AEPIEAACUCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGiBQEA9wcAIacFAQD3BwAhtwUBAPcHACHIBQAA6QcAIMwFAACVCcwFIs0FIACiCAAhAwAAAH4AIAIAAH8AMAMAAIABACAPIwAAkwkAIPAEAACRCQAw8QQAAIIBABDyBAAAkQkAMPMEAQD3BwAh_wRAAOsHACG3BQEA6AcAIcMFAACSCcMFIsQFAQD3BwAhxQUBAOgHACHGBQAA6QcAIMcFAADpBwAgyAUAAOkHACDJBQEA6AcAIcoFAQDoBwAhCCMAAPINACC3BQAA5AkAIMUFAADkCQAgxgUAAOQJACDHBQAA5AkAIMgFAADkCQAgyQUAAOQJACDKBQAA5AkAIA8jAACTCQAg8AQAAJEJADDxBAAAggEAEPIEAACRCQAw8wQBAAAAAf8EQADrBwAhtwUBAOgHACHDBQAAkgnDBSLEBQEA9wcAIcUFAQDoBwAhxgUAAOkHACDHBQAA6QcAIMgFAADpBwAgyQUBAOgHACHKBQEA6AcAIQMAAACCAQAgAgAAgwEAMAMAAIQBACABAAAAGwAgFDAAAPIIACAyAACQCQAgNQAAiAgAIPAEAACOCQAw8QQAAIcBABDyBAAAjgkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAPcHACGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAhBjAAAPINACAyAACLEAAgNQAAqAoAIKsFAADkCQAgrgUAAOQJACCxBQAA5AkAIBQwAADyCAAgMgAAkAkAIDUAAIgIACDwBAAAjgkAMPEEAACHAQAQ8gQAAI4JADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAAAAAakFAQD3BwAhqgUBAPcHACGrBQEA6AcAIa0FAgD6BwAhrgVAAOoHACGvBQEA9wcAIbAFAQD3BwAhsQVAAOoHACEDAAAAhwEAIAIAAIgBADADAACJAQAgAwAAAIcBACACAACIAQAwAwAAiQEAIAEAAACHAQAgBzMAAIwJACA0AACNCQAg8AQAAIsJADDxBAAAjQEAEPIEAACLCQAwpQUBAPcHACGmBQEA9wcAIQIzAACJEAAgNAAAihAAIAgzAACMCQAgNAAAjQkAIPAEAACLCQAw8QQAAI0BABDyBAAAiwkAMKUFAQD3BwAhpgUBAPcHACHlBgAAigkAIAMAAACNAQAgAgAAjgEAMAMAAI8BACADAAAAjQEAIAIAAI4BADADAACPAQAgAQAAAI0BACABAAAAjQEAIA0jAADyCAAg8AQAAIkJADDxBAAAlAEAEPIEAACJCQAw8wQBAPcHACH_BEAA6wcAIbYFAQD3BwAhtwUBAPcHACG4BQEA9wcAIbkFAQD3BwAhugUAAPgHACC7BQIA-gcAIbwFQADrBwAhASMAAPINACAOIwAA8ggAIPAEAACJCQAw8QQAAJQBABDyBAAAiQkAMPMEAQAAAAH_BEAA6wcAIbYFAQD3BwAhtwUBAPcHACG4BQEA9wcAIbkFAQD3BwAhugUAAPgHACC7BQIA-gcAIbwFQADrBwAh5AYAAIgJACADAAAAlAEAIAIAAJUBADADAACWAQAgAQAAAGQAIAEAAABoACABAAAAbAAgAQAAAHAAIAEAAAAFACABAAAAGQAgAQAAAB0AIAEAAABTACABAAAAMQAgAQAAAFkAIAEAAAB-ACABAAAAggEAIAEAAACHAQAgAQAAAJQBACABAAAAAQAgFAYAAP0KACAMAACEEAAgIAAAgxAAICUAAP4KACAmAAD-DwAgJwAA_w8AICgAAIAQACApAACBEAAgKgAAghAAICsAAKMOACAsAACkDgAgLQAAhRAAIC4AAIYQACAvAACHEAAgNgAAugoAIDcAAIgQACCxBQAA5AkAIL0GAADkCQAg3AYAAOQJACDjBgAA5AkAIAMAAAAbACACAACnAQAwAwAAAQAgAwAAABsAIAIAAKcBADADAAABACADAAAAGwAgAgAApwEAMAMAAAEAIB4GAADuDwAgDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKQAA8g8AICoAAPMPACArAAD0DwAgLAAA9w8AIC0AAPgPACAuAAD6DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAEBPQAAqwEAIA7zBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQE9AACtAQAwAT0AAK0BADAeBgAAvg4AIAwAAMYOACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACECAAAAAQAgPQAAsAEAIA7zBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhAgAAABsAID0AALIBACACAAAAGwAgPQAAsgEAIAMAAAABACBEAACrAQAgRQAAsAEAIAEAAAABACABAAAAGwAgBw0AALgOACBKAAC6DgAgSwAAuQ4AILEFAADkCQAgvQYAAOQJACDcBgAA5AkAIOMGAADkCQAgEfAEAAD-CAAw8QQAALkBABDyBAAA_ggAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAACACeAGIp8FAQDTBwAhoAUBANMHACGxBUAA1wcAIc8FAACBCeEGIr0GAQDVBwAh3AYBANUHACHeBgAA_wjeBiLhBiAAjwgAIeIGIACPCAAh4wZAANcHACEDAAAAGwAgAgAAuAEAMEkAALkBACADAAAAGwAgAgAApwEAMAMAAAEAIAEAAABmACABAAAAZgAgAwAAAGQAIAIAAGUAMAMAAGYAIAMAAABkACACAABlADADAABmACADAAAAZAAgAgAAZQAwAwAAZgAgDyMAALcOACDzBAEAAAAB_wRAAAAAAYAFQAAAAAG3BQEAAAAB0gYBAAAAAdMGAQAAAAHUBgEAAAAB1QYBAAAAAdYGAQAAAAHXBgEAAAAB2AYBAAAAAdkGQAAAAAHaBkAAAAAB2wYBAAAAAQE9AADBAQAgDvMEAQAAAAH_BEAAAAABgAVAAAAAAbcFAQAAAAHSBgEAAAAB0wYBAAAAAdQGAQAAAAHVBgEAAAAB1gYBAAAAAdcGAQAAAAHYBgEAAAAB2QZAAAAAAdoGQAAAAAHbBgEAAAABAT0AAMMBADABPQAAwwEAMA8jAAC2DgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhtwUBAOgJACHSBgEA6AkAIdMGAQDoCQAh1AYBAOgJACHVBgEA6gkAIdYGAQDqCQAh1wYBAOoJACHYBgEA6gkAIdkGQADrCQAh2gZAAOsJACHbBgEA6gkAIQIAAABmACA9AADGAQAgDvMEAQDoCQAh_wRAAOwJACGABUAA7AkAIbcFAQDoCQAh0gYBAOgJACHTBgEA6AkAIdQGAQDoCQAh1QYBAOoJACHWBgEA6gkAIdcGAQDqCQAh2AYBAOoJACHZBkAA6wkAIdoGQADrCQAh2wYBAOoJACECAAAAZAAgPQAAyAEAIAIAAABkACA9AADIAQAgAwAAAGYAIEQAAMEBACBFAADGAQAgAQAAAGYAIAEAAABkACAKDQAAsw4AIEoAALUOACBLAAC0DgAg1QYAAOQJACDWBgAA5AkAINcGAADkCQAg2AYAAOQJACDZBgAA5AkAINoGAADkCQAg2wYAAOQJACAR8AQAAP0IADDxBAAAzwEAEPIEAAD9CAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhtwUBANMHACHSBgEA0wcAIdMGAQDTBwAh1AYBANMHACHVBgEA1QcAIdYGAQDVBwAh1wYBANUHACHYBgEA1QcAIdkGQADXBwAh2gZAANcHACHbBgEA1QcAIQMAAABkACACAADOAQAwSQAAzwEAIAMAAABkACACAABlADADAABmACABAAAAbgAgAQAAAG4AIAMAAABsACACAABtADADAABuACADAAAAbAAgAgAAbQAwAwAAbgAgAwAAAGwAIAIAAG0AMAMAAG4AIAUjAACyDgAg8wQBAAAAAbcFAQAAAAHQBgEAAAAB0QYBAAAAAQE9AADXAQAgBPMEAQAAAAG3BQEAAAAB0AYBAAAAAdEGAQAAAAEBPQAA2QEAMAE9AADZAQAwBSMAALEOACDzBAEA6AkAIbcFAQDoCQAh0AYBAOgJACHRBgEA6gkAIQIAAABuACA9AADcAQAgBPMEAQDoCQAhtwUBAOgJACHQBgEA6AkAIdEGAQDqCQAhAgAAAGwAID0AAN4BACACAAAAbAAgPQAA3gEAIAMAAABuACBEAADXAQAgRQAA3AEAIAEAAABuACABAAAAbAAgBA0AAK4OACBKAACwDgAgSwAArw4AINEGAADkCQAgB_AEAAD8CAAw8QQAAOUBABDyBAAA_AgAMPMEAQDTBwAhtwUBANMHACHQBgEA0wcAIdEGAQDVBwAhAwAAAGwAIAIAAOQBADBJAADlAQAgAwAAAGwAIAIAAG0AMAMAAG4AIAEAAABqACABAAAAagAgAwAAAGgAIAIAAGkAMAMAAGoAIAMAAABoACACAABpADADAABqACADAAAAaAAgAgAAaQAwAwAAagAgCSMAAK0OACDzBAEAAAAB_wRAAAAAAYAFQAAAAAG3BQEAAAABvAVAAAAAAckFAQAAAAHKBQEAAAABzwYBAAAAAQE9AADtAQAgCPMEAQAAAAH_BEAAAAABgAVAAAAAAbcFAQAAAAG8BUAAAAAByQUBAAAAAcoFAQAAAAHPBgEAAAABAT0AAO8BADABPQAA7wEAMAkjAACsDgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhtwUBAOgJACG8BUAA7AkAIckFAQDqCQAhygUBAOoJACHPBgEA6AkAIQIAAABqACA9AADyAQAgCPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIbcFAQDoCQAhvAVAAOwJACHJBQEA6gkAIcoFAQDqCQAhzwYBAOgJACECAAAAaAAgPQAA9AEAIAIAAABoACA9AAD0AQAgAwAAAGoAIEQAAO0BACBFAADyAQAgAQAAAGoAIAEAAABoACAFDQAAqQ4AIEoAAKsOACBLAACqDgAgyQUAAOQJACDKBQAA5AkAIAvwBAAA-wgAMPEEAAD7AQAQ8gQAAPsIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACG3BQEA0wcAIbwFQADYBwAhyQUBANUHACHKBQEA1QcAIc8GAQDTBwAhAwAAAGgAIAIAAPoBADBJAAD7AQAgAwAAAGgAIAIAAGkAMAMAAGoAIArwBAAA-QgAMPEEAACBAgAQ8gQAAPkIADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIbwFQADrBwAhzAYBAPcHACHNBgEA9wcAIc4GAAD6CAAgAQAAAP4BACABAAAA_gEAIAnwBAAA-QgAMPEEAACBAgAQ8gQAAPkIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACG8BUAA6wcAIcwGAQD3BwAhzQYBAPcHACEAAwAAAIECACACAACCAgAwAwAA_gEAIAMAAACBAgAgAgAAggIAMAMAAP4BACADAAAAgQIAIAIAAIICADADAAD-AQAgBvMEAQAAAAH_BEAAAAABgAVAAAAAAbwFQAAAAAHMBgEAAAABzQYBAAAAAQE9AACGAgAgBvMEAQAAAAH_BEAAAAABgAVAAAAAAbwFQAAAAAHMBgEAAAABzQYBAAAAAQE9AACIAgAwAT0AAIgCADAG8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhvAVAAOwJACHMBgEA6AkAIc0GAQDoCQAhAgAAAP4BACA9AACLAgAgBvMEAQDoCQAh_wRAAOwJACGABUAA7AkAIbwFQADsCQAhzAYBAOgJACHNBgEA6AkAIQIAAACBAgAgPQAAjQIAIAIAAACBAgAgPQAAjQIAIAMAAAD-AQAgRAAAhgIAIEUAAIsCACABAAAA_gEAIAEAAACBAgAgAw0AAKYOACBKAACoDgAgSwAApw4AIAnwBAAA-AgAMPEEAACUAgAQ8gQAAPgIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACG8BUAA2AcAIcwGAQDTBwAhzQYBANMHACEDAAAAgQIAIAIAAJMCADBJAACUAgAgAwAAAIECACACAACCAgAwAwAA_gEAIBQBAADyCAAgIQAA9QgAICIAAPYIACAkAAD3CAAgJQAAtggAIPAEAAD0CAAw8QQAAAMAEPIEAAD0CAAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGfBQEA9wcAIagFAQAAAAGxBUAA6gcAIbUFAQDoBwAhxwYBAOgHACHIBgEA6AcAIckGAQDoBwAhygYgAKIIACHLBgEAAAABAQAAAJcCACABAAAAlwIAIAoBAADyDQAgIQAAow4AICIAAKQOACAkAAClDgAgJQAA_goAILEFAADkCQAgtQUAAOQJACDHBgAA5AkAIMgGAADkCQAgyQYAAOQJACADAAAAAwAgAgAAmgIAMAMAAJcCACADAAAAAwAgAgAAmgIAMAMAAJcCACADAAAAAwAgAgAAmgIAMAMAAJcCACARAQAAng4AICEAAJ8OACAiAACgDgAgJAAAoQ4AICUAAKIOACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGfBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYgAAAAAcsGAQAAAAEBPQAAngIAIAzzBAEAAAAB_wRAAAAAAYAFQAAAAAGfBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYgAAAAAcsGAQAAAAEBPQAAoAIAMAE9AACgAgAwEQEAAPYNACAhAAD3DQAgIgAA-A0AICQAAPkNACAlAAD6DQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIcsGAQDoCQAhAgAAAJcCACA9AACjAgAgDPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZ8FAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDqCQAhxwYBAOoJACHIBgEA6gkAIckGAQDqCQAhygYgAMYKACHLBgEA6AkAIQIAAAADACA9AAClAgAgAgAAAAMAID0AAKUCACADAAAAlwIAIEQAAJ4CACBFAACjAgAgAQAAAJcCACABAAAAAwAgCA0AAPMNACBKAAD1DQAgSwAA9A0AILEFAADkCQAgtQUAAOQJACDHBgAA5AkAIMgGAADkCQAgyQYAAOQJACAP8AQAAPMIADDxBAAArAIAEPIEAADzCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhnwUBANMHACGoBQEA0wcAIbEFQADXBwAhtQUBANUHACHHBgEA1QcAIcgGAQDVBwAhyQYBANUHACHKBiAAjwgAIcsGAQDTBwAhAwAAAAMAIAIAAKsCADBJAACsAgAgAwAAAAMAIAIAAJoCADADAACXAgAgFSMAAPIIACDwBAAA8AgAMPEEAAB0ABDyBAAA8AgAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhsQVAAOoHACG3BQEAAAABuwYBAOgHACG8BgEA6AcAIb0GAQDoBwAhvgYBAOgHACG_BgEA6AcAIcAGAQDoBwAhwQYBAOgHACHCBgEA6AcAIcMGAADpBwAgxAYCAPEIACHFBkAA6gcAIcYGIACiCAAhAQAAAK8CACABAAAArwIAIA0jAADyDQAgsQUAAOQJACC7BgAA5AkAILwGAADkCQAgvQYAAOQJACC-BgAA5AkAIL8GAADkCQAgwAYAAOQJACDBBgAA5AkAIMIGAADkCQAgwwYAAOQJACDEBgAA5AkAIMUGAADkCQAgAwAAAHQAIAIAALICADADAACvAgAgAwAAAHQAIAIAALICADADAACvAgAgAwAAAHQAIAIAALICADADAACvAgAgEiMAAPENACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGxBUAAAAABtwUBAAAAAbsGAQAAAAG8BgEAAAABvQYBAAAAAb4GAQAAAAG_BgEAAAABwAYBAAAAAcEGAQAAAAHCBgEAAAABwwaAAAAAAcQGAgAAAAHFBkAAAAABxgYgAAAAAQE9AAC2AgAgEfMEAQAAAAH_BEAAAAABgAVAAAAAAbEFQAAAAAG3BQEAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwQYBAAAAAcIGAQAAAAHDBoAAAAABxAYCAAAAAcUGQAAAAAHGBiAAAAABAT0AALgCADABPQAAuAIAMBIjAADwDQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhsQVAAOsJACG3BQEA6AkAIbsGAQDqCQAhvAYBAOoJACG9BgEA6gkAIb4GAQDqCQAhvwYBAOoJACHABgEA6gkAIcEGAQDqCQAhwgYBAOoJACHDBoAAAAABxAYCAIwLACHFBkAA6wkAIcYGIADGCgAhAgAAAK8CACA9AAC7AgAgEfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIbEFQADrCQAhtwUBAOgJACG7BgEA6gkAIbwGAQDqCQAhvQYBAOoJACG-BgEA6gkAIb8GAQDqCQAhwAYBAOoJACHBBgEA6gkAIcIGAQDqCQAhwwaAAAAAAcQGAgCMCwAhxQZAAOsJACHGBiAAxgoAIQIAAAB0ACA9AAC9AgAgAgAAAHQAID0AAL0CACADAAAArwIAIEQAALYCACBFAAC7AgAgAQAAAK8CACABAAAAdAAgEQ0AAOsNACBKAADuDQAgSwAA7Q0AIKwBAADsDQAgrQEAAO8NACCxBQAA5AkAILsGAADkCQAgvAYAAOQJACC9BgAA5AkAIL4GAADkCQAgvwYAAOQJACDABgAA5AkAIMEGAADkCQAgwgYAAOQJACDDBgAA5AkAIMQGAADkCQAgxQYAAOQJACAU8AQAAO8IADDxBAAAxAIAEPIEAADvCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhsQVAANcHACG3BQEA0wcAIbsGAQDVBwAhvAYBANUHACG9BgEA1QcAIb4GAQDVBwAhvwYBANUHACHABgEA1QcAIcEGAQDVBwAhwgYBANUHACHDBgAA1gcAIMQGAgC-CAAhxQZAANcHACHGBiAAjwgAIQMAAAB0ACACAADDAgAwSQAAxAIAIAMAAAB0ACACAACyAgAwAwAArwIAIAEAAAAHACABAAAABwAgAwAAAAUAIAIAAAYAMAMAAAcAIAMAAAAFACACAAAGADADAAAHACADAAAABQAgAgAABgAwAwAABwAgIAQAAOoNACAFAADjDQAgBgAA5A0AIAcAAOUNACAMAADoDQAgGAAA6Q0AIB8AAOYNACAgAADnDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACzBgKnBQEAAAABqAUBAAAAAa4FQAAAAAGxBUAAAAABtQUBAAAAAdUFAQAAAAHsBQIAAAABrAYBAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABugYBAAAAAQE9AADMAgAgGPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAEBPQAAzgIAMAE9AADOAgAwAQAAAAUAICAEAAClDQAgBQAApg0AIAYAAKcNACAHAACoDQAgDAAAqw0AIBgAAKwNACAfAACpDQAgIAAAqg0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACECAAAABwAgPQAA0gIAIBjzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhAgAAAAUAID0AANQCACACAAAABQAgPQAA1AIAIAEAAAAFACADAAAABwAgRAAAzAIAIEUAANICACABAAAABwAgAQAAAAUAIAwNAACfDQAgSgAAog0AIEsAAKENACCsAQAAoA0AIK0BAACjDQAgrgUAAOQJACCxBQAA5AkAILUFAADkCQAgrgYAAOQJACCzBgAA5AkAILQGAADkCQAgugYAAOQJACAb8AQAAOsIADDxBAAA3AIAEPIEAADrCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAAOwIswYipwUBANMHACGoBQEA0wcAIa4FQADXBwAhsQVAANcHACG1BQEA1QcAIdUFAQDTBwAh7AUCAPAHACGsBgEA0wcAIa4GAQDVBwAhrwYCAPAHACGwBgIA8AcAIbEGAgDwBwAhswZAANcHACG0BkAA1wcAIbUGIACPCAAhtgYgAI8IACG3BiAAjwgAIbgGAgDwBwAhuQYgAI8IACG6BgEA1QcAIQMAAAAFACACAADbAgAwSQAA3AIAIAMAAAAFACACAAAGADADAAAHACABAAAAVQAgAQAAAFUAIAMAAABTACACAABUADADAABVACADAAAAUwAgAgAAVAAwAwAAVQAgAwAAAFMAIAIAAFQAMAMAAFUAIBYGAACZDQAgBwAAmg0AIAoAAJsNACAPAACeDQAgHgAAnA0AIB8AAJ0NACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGnBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABzAUAAACmBgLVBQEAAAABpwYAAACnBgKoBgEAAAABqQYgAAAAAaoGAgAAAAGrBgIAAAABrAYBAAAAAa0GIAAAAAEBPQAA5AIAIBDzBAEAAAAB_wRAAAAAAYAFQAAAAAGnBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABzAUAAACmBgLVBQEAAAABpwYAAACnBgKoBgEAAAABqQYgAAAAAaoGAgAAAAGrBgIAAAABrAYBAAAAAa0GIAAAAAEBPQAA5gIAMAE9AADmAgAwFgYAAO0MACAHAADuDAAgCgAA7wwAIA8AAPIMACAeAADwDAAgHwAA8QwAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIacFAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDoCQAhzAUAAOsMpgYi1QUBAOgJACGnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIawGAQDoCQAhrQYgAMYKACECAAAAVQAgPQAA6QIAIBDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGnBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6AkAIcwFAADrDKYGItUFAQDoCQAhpwYAAOwMpwYiqAYBAOoJACGpBiAAxgoAIaoGAgD2CQAhqwYCAIwLACGsBgEA6AkAIa0GIADGCgAhAgAAAFMAID0AAOsCACACAAAAUwAgPQAA6wIAIAMAAABVACBEAADkAgAgRQAA6QIAIAEAAABVACABAAAAUwAgCA0AAOYMACBKAADpDAAgSwAA6AwAIKwBAADnDAAgrQEAAOoMACCxBQAA5AkAIKgGAADkCQAgqwYAAOQJACAT8AQAAOQIADDxBAAA8gIAEPIEAADkCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhpwUBANMHACGoBQEA0wcAIbEFQADXBwAhtQUBANMHACHMBQAA5QimBiLVBQEA0wcAIacGAADmCKcGIqgGAQDVBwAhqQYgAI8IACGqBgIA8AcAIasGAgC-CAAhrAYBANMHACGtBiAAjwgAIQMAAABTACACAADxAgAwSQAA8gIAIAMAAABTACACAABUADADAABVACAJCQAA4ggAIB0AAOMIACDwBAAA4AgAMPEEAAAPABDyBAAA4AgAMPMEAQAAAAHMBQAA4QikBiKHBgEAAAABpAYBAOgHACEBAAAA9QIAIAEAAAD1AgAgAwkAAOQMACAdAADlDAAgpAYAAOQJACADAAAADwAgAgAA-AIAMAMAAPUCACADAAAADwAgAgAA-AIAMAMAAPUCACADAAAADwAgAgAA-AIAMAMAAPUCACAGCQAA4gwAIB0AAOMMACDzBAEAAAABzAUAAACkBgKHBgEAAAABpAYBAAAAAQE9AAD8AgAgBPMEAQAAAAHMBQAAAKQGAocGAQAAAAGkBgEAAAABAT0AAP4CADABPQAA_gIAMAYJAADUDAAgHQAA1QwAIPMEAQDoCQAhzAUAANMMpAYihwYBAOgJACGkBgEA6gkAIQIAAAD1AgAgPQAAgQMAIATzBAEA6AkAIcwFAADTDKQGIocGAQDoCQAhpAYBAOoJACECAAAADwAgPQAAgwMAIAIAAAAPACA9AACDAwAgAwAAAPUCACBEAAD8AgAgRQAAgQMAIAEAAAD1AgAgAQAAAA8AIAQNAADQDAAgSgAA0gwAIEsAANEMACCkBgAA5AkAIAfwBAAA3AgAMPEEAACKAwAQ8gQAANwIADDzBAEA0wcAIcwFAADdCKQGIocGAQDTBwAhpAYBANUHACEDAAAADwAgAgAAiQMAMEkAAIoDACADAAAADwAgAgAA-AIAMAMAAPUCACABAAAAEwAgAQAAABMAIAMAAAARACACAAASADADAAATACADAAAAEQAgAgAAEgAwAwAAEwAgAwAAABEAIAIAABIAMAMAABMAIAcKAADODAAgHAAAzwwAIPMEAQAAAAGaBgIAAAABoAYBAAAAAaEGAQAAAAGiBiAAAAABAT0AAJIDACAF8wQBAAAAAZoGAgAAAAGgBgEAAAABoQYBAAAAAaIGIAAAAAEBPQAAlAMAMAE9AACUAwAwBwoAAMMMACAcAADEDAAg8wQBAOgJACGaBgIA9gkAIaAGAQDoCQAhoQYBAOgJACGiBiAAxgoAIQIAAAATACA9AACXAwAgBfMEAQDoCQAhmgYCAPYJACGgBgEA6AkAIaEGAQDoCQAhogYgAMYKACECAAAAEQAgPQAAmQMAIAIAAAARACA9AACZAwAgAwAAABMAIEQAAJIDACBFAACXAwAgAQAAABMAIAEAAAARACAFDQAAvgwAIEoAAMEMACBLAADADAAgrAEAAL8MACCtAQAAwgwAIAjwBAAA2wgAMPEEAACgAwAQ8gQAANsIADDzBAEA0wcAIZoGAgDwBwAhoAYBANMHACGhBgEA0wcAIaIGIACPCAAhAwAAABEAIAIAAJ8DADBJAACgAwAgAwAAABEAIAIAABIAMAMAABMAIAEAAABAACABAAAAQAAgAwAAAD4AIAIAAD8AMAMAAEAAIAMAAAA-ACACAAA_ADADAABAACADAAAAPgAgAgAAPwAwAwAAQAAgCwkAALwMACAYAAC9DAAg8wQBAAAAAf8EQAAAAAH1BQEAAAAB-AUCAAAAAYcGAQAAAAGcBgEAAAABnQYgAAAAAZ4GAgAAAAGfBgIAAAABAT0AAKgDACAJ8wQBAAAAAf8EQAAAAAH1BQEAAAAB-AUCAAAAAYcGAQAAAAGcBgEAAAABnQYgAAAAAZ4GAgAAAAGfBgIAAAABAT0AAKoDADABPQAAqgMAMAsJAACxDAAgGAAAsgwAIPMEAQDoCQAh_wRAAOwJACH1BQEA6AkAIfgFAgD2CQAhhwYBAOgJACGcBgEA6gkAIZ0GIADGCgAhngYCAIwLACGfBgIAjAsAIQIAAABAACA9AACtAwAgCfMEAQDoCQAh_wRAAOwJACH1BQEA6AkAIfgFAgD2CQAhhwYBAOgJACGcBgEA6gkAIZ0GIADGCgAhngYCAIwLACGfBgIAjAsAIQIAAAA-ACA9AACvAwAgAgAAAD4AID0AAK8DACADAAAAQAAgRAAAqAMAIEUAAK0DACABAAAAQAAgAQAAAD4AIAgNAACsDAAgSgAArwwAIEsAAK4MACCsAQAArQwAIK0BAACwDAAgnAYAAOQJACCeBgAA5AkAIJ8GAADkCQAgDPAEAADaCAAw8QQAALYDABDyBAAA2ggAMPMEAQDTBwAh_wRAANgHACH1BQEA0wcAIfgFAgDwBwAhhwYBANMHACGcBgEA1QcAIZ0GIACPCAAhngYCAL4IACGfBgIAvggAIQMAAAA-ACACAAC1AwAwSQAAtgMAIAMAAAA-ACACAAA_ADADAABAACABAAAADQAgAQAAAA0AIAMAAAALACACAAAMADADAAANACADAAAACwAgAgAADAAwAwAADQAgAwAAAAsAIAIAAAwAMAMAAA0AIAgIAACqDAAgCQAAqwwAIPMEAQAAAAH_BEAAAAAB6gUBAAAAAYcGAQAAAAGaBgIAAAABmwYCAAAAAQE9AAC-AwAgBvMEAQAAAAH_BEAAAAAB6gUBAAAAAYcGAQAAAAGaBgIAAAABmwYCAAAAAQE9AADAAwAwAT0AAMADADAICAAAqAwAIAkAAKkMACDzBAEA6AkAIf8EQADsCQAh6gUBAOgJACGHBgEA6AkAIZoGAgD2CQAhmwYCAPYJACECAAAADQAgPQAAwwMAIAbzBAEA6AkAIf8EQADsCQAh6gUBAOgJACGHBgEA6AkAIZoGAgD2CQAhmwYCAPYJACECAAAACwAgPQAAxQMAIAIAAAALACA9AADFAwAgAwAAAA0AIEQAAL4DACBFAADDAwAgAQAAAA0AIAEAAAALACAFDQAAowwAIEoAAKYMACBLAAClDAAgrAEAAKQMACCtAQAApwwAIAnwBAAA2QgAMPEEAADMAwAQ8gQAANkIADDzBAEA0wcAIf8EQADYBwAh6gUBANMHACGHBgEA0wcAIZoGAgDwBwAhmwYCAPAHACEDAAAACwAgAgAAywMAMEkAAMwDACADAAAACwAgAgAADAAwAwAADQAgAQAAAEgAIAEAAABIACADAAAAGQAgAgAARwAwAwAASAAgAwAAABkAIAIAAEcAMAMAAEgAIAMAAAAZACACAABHADADAABIACAOCAAAoAwAIAsAAKEMACAMAACiDAAg8wQBAAAAAZgFAAAAlQYCoAUBAAAAAbwFQAAAAAHqBQEAAAABjQYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAZgGQAAAAAGZBkAAAAABAT0AANQDACAL8wQBAAAAAZgFAAAAlQYCoAUBAAAAAbwFQAAAAAHqBQEAAAABjQYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAZgGQAAAAAGZBkAAAAABAT0AANYDADABPQAA1gMAMAEAAAAbACAOCAAAkQwAIAsAAJIMACAMAACTDAAg8wQBAOgJACGYBQAAkAyVBiKgBQEA6AkAIbwFQADrCQAh6gUBAOgJACGNBgEA6gkAIZUGAQDoCQAhlgZAAOwJACGXBkAA6wkAIZgGQADrCQAhmQZAAOsJACECAAAASAAgPQAA2gMAIAvzBAEA6AkAIZgFAACQDJUGIqAFAQDoCQAhvAVAAOsJACHqBQEA6AkAIY0GAQDqCQAhlQYBAOgJACGWBkAA7AkAIZcGQADrCQAhmAZAAOsJACGZBkAA6wkAIQIAAAAZACA9AADcAwAgAgAAABkAID0AANwDACABAAAAGwAgAwAAAEgAIEQAANQDACBFAADaAwAgAQAAAEgAIAEAAAAZACAIDQAAjQwAIEoAAI8MACBLAACODAAgvAUAAOQJACCNBgAA5AkAIJcGAADkCQAgmAYAAOQJACCZBgAA5AkAIA7wBAAA1QgAMPEEAADkAwAQ8gQAANUIADDzBAEA0wcAIZgFAADWCJUGIqAFAQDTBwAhvAVAANcHACHqBQEA0wcAIY0GAQDVBwAhlQYBANMHACGWBkAA2AcAIZcGQADXBwAhmAZAANcHACGZBkAA1wcAIQMAAAAZACACAADjAwAwSQAA5AMAIAMAAAAZACACAABHADADAABIACABAAAAHwAgAQAAAB8AIAMAAAAdACACAAAeADADAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIBYIAACGDAAgCwAAhwwAIA4AAIgMACAPAACJDAAgEQAAigwAIBIAAIsMACATAACMDAAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACRBgK8BUAAAAAByQUBAAAAAcoFAQAAAAHqBQEAAAABjAZAAAAAAY0GAQAAAAGOBgEAAAABjwYCAAAAAZEGQAAAAAGSBkAAAAABkwYCAAAAAQE9AADsAwAgD_MEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAkQYCvAVAAAAAAckFAQAAAAHKBQEAAAAB6gUBAAAAAYwGQAAAAAGNBgEAAAABjgYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAEBPQAA7gMAMAE9AADuAwAwAQAAABkAIBYIAADdCwAgCwAA3gsAIA4AAN8LACAPAADgCwAgEQAA4QsAIBIAAOILACATAADjCwAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAANwLkQYivAVAAOwJACHJBQEA6gkAIcoFAQDqCQAh6gUBAOgJACGMBkAA6wkAIY0GAQDoCQAhjgYBAOoJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIQIAAAAfACA9AADyAwAgD_MEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADcC5EGIrwFQADsCQAhyQUBAOoJACHKBQEA6gkAIeoFAQDoCQAhjAZAAOsJACGNBgEA6AkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACECAAAAHQAgPQAA9AMAIAIAAAAdACA9AAD0AwAgAQAAABkAIAMAAAAfACBEAADsAwAgRQAA8gMAIAEAAAAfACABAAAAHQAgCw0AANcLACBKAADaCwAgSwAA2QsAIKwBAADYCwAgrQEAANsLACDJBQAA5AkAIMoFAADkCQAgjAYAAOQJACCOBgAA5AkAIJEGAADkCQAgkgYAAOQJACAS8AQAANEIADDxBAAA_AMAEPIEAADRCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAANIIkQYivAVAANgHACHJBQEA1QcAIcoFAQDVBwAh6gUBANMHACGMBkAA1wcAIY0GAQDTBwAhjgYBANUHACGPBgIA8AcAIZEGQADXBwAhkgZAANcHACGTBgIA8AcAIQMAAAAdACACAAD7AwAwSQAA_AMAIAMAAAAdACACAAAeADADAAAfACABAAAAJAAgAQAAACQAIAMAAAAiACACAAAjADADAAAkACADAAAAIgAgAgAAIwAwAwAAJAAgAwAAACIAIAIAACMAMAMAACQAIA8JAADTCwAgEAAA0gsAIBQAANQLACAXAADVCwAgGgAA1gsAIPMEAQAAAAH0BAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAIwGAocGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGMBkAAAAABAT0AAIQEACAK8wQBAAAAAfQEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAjAYChwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYwGQAAAAAEBPQAAhgQAMAE9AACGBAAwDwkAALELACAQAACwCwAgFAAAsgsAIBcAALMLACAaAAC0CwAg8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAArwuMBiKHBgEA6AkAIYgGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhAgAAACQAID0AAIkEACAK8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAArwuMBiKHBgEA6AkAIYgGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhAgAAACIAID0AAIsEACACAAAAIgAgPQAAiwQAIAMAAAAkACBEAACEBAAgRQAAiQQAIAEAAAAkACABAAAAIgAgBw0AAKwLACBKAACuCwAgSwAArQsAIIgGAADkCQAgiQYAAOQJACCKBgAA5AkAIIwGAADkCQAgDfAEAADNCAAw8QQAAJIEABDyBAAAzQgAMPMEAQDTBwAh9AQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAAM4IjAYihwYBANMHACGIBgEA1QcAIYkGAQDVBwAhigYBANUHACGMBkAA1wcAIQMAAAAiACACAACRBAAwSQAAkgQAIAMAAAAiACACAAAjADADAAAkACABAAAAFwAgAQAAABcAIAMAAAAVACACAAAWADADAAAXACADAAAAFQAgAgAAFgAwAwAAFwAgAwAAABUAIAIAABYAMAMAABcAIAYVAACqCwAgGwAAqwsAIPMEAQAAAAH_BEAAAAAB8QUBAAAAAYYGAQAAAAEBPQAAmgQAIATzBAEAAAAB_wRAAAAAAfEFAQAAAAGGBgEAAAABAT0AAJwEADABPQAAnAQAMAYVAACoCwAgGwAAqQsAIPMEAQDoCQAh_wRAAOwJACHxBQEA6AkAIYYGAQDoCQAhAgAAABcAID0AAJ8EACAE8wQBAOgJACH_BEAA7AkAIfEFAQDoCQAhhgYBAOgJACECAAAAFQAgPQAAoQQAIAIAAAAVACA9AAChBAAgAwAAABcAIEQAAJoEACBFAACfBAAgAQAAABcAIAEAAAAVACADDQAApQsAIEoAAKcLACBLAACmCwAgB_AEAADMCAAw8QQAAKgEABDyBAAAzAgAMPMEAQDTBwAh_wRAANgHACHxBQEA0wcAIYYGAQDTBwAhAwAAABUAIAIAAKcEADBJAACoBAAgAwAAABUAIAIAABYAMAMAABcAIAEAAAB7ACABAAAAewAgAwAAADEAIAIAAHoAMAMAAHsAIAMAAAAxACACAAB6ADADAAB7ACADAAAAMQAgAgAAegAwAwAAewAgFBUAAKMLACAWAACkCwAg8wQBAAAAAfwEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA_wUCyAWAAAAAAfAFQAAAAAHxBQEAAAAB-gUBAAAAAfsFAgAAAAH8BQIAAAAB_QUBAAAAAf8FIAAAAAGABgIAAAABgQYBAAAAAYIGQAAAAAGEBgAAAIQGAoUGQAAAAAEBPQAAsAQAIBLzBAEAAAAB_AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAAD_BQLIBYAAAAAB8AVAAAAAAfEFAQAAAAH6BQEAAAAB-wUCAAAAAfwFAgAAAAH9BQEAAAAB_wUgAAAAAYAGAgAAAAGBBgEAAAABggZAAAAAAYQGAAAAhAYChQZAAAAAAQE9AACyBAAwAT0AALIEADABAAAAGwAgFBUAAKELACAWAACiCwAg8wQBAOgJACH8BAEA6gkAIf8EQADsCQAhgAVAAOwJACGYBQAAnwv_BSLIBYAAAAAB8AVAAOsJACHxBQEA6AkAIfoFAQDqCQAh-wUCAPYJACH8BQIA9gkAIf0FAQDqCQAh_wUgAMYKACGABgIAjAsAIYEGAQDqCQAhggZAAOsJACGEBgAAoAuEBiKFBkAA6wkAIQIAAAB7ACA9AAC2BAAgEvMEAQDoCQAh_AQBAOoJACH_BEAA7AkAIYAFQADsCQAhmAUAAJ8L_wUiyAWAAAAAAfAFQADrCQAh8QUBAOgJACH6BQEA6gkAIfsFAgD2CQAh_AUCAPYJACH9BQEA6gkAIf8FIADGCgAhgAYCAIwLACGBBgEA6gkAIYIGQADrCQAhhAYAAKALhAYihQZAAOsJACECAAAAMQAgPQAAuAQAIAIAAAAxACA9AAC4BAAgAQAAABsAIAMAAAB7ACBEAACwBAAgRQAAtgQAIAEAAAB7ACABAAAAMQAgDg0AAJoLACBKAACdCwAgSwAAnAsAIKwBAACbCwAgrQEAAJ4LACD8BAAA5AkAIMgFAADkCQAg8AUAAOQJACD6BQAA5AkAIP0FAADkCQAggAYAAOQJACCBBgAA5AkAIIIGAADkCQAghQYAAOQJACAV8AQAAMUIADDxBAAAwAQAEPIEAADFCAAw8wQBANMHACH8BAEA1QcAIf8EQADYBwAhgAVAANgHACGYBQAAxgj_BSLIBQAA1gcAIPAFQADXBwAh8QUBANMHACH6BQEA1QcAIfsFAgDwBwAh_AUCAPAHACH9BQEA1QcAIf8FIACPCAAhgAYCAL4IACGBBgEA1QcAIYIGQADXBwAhhAYAAMcIhAYihQZAANcHACEDAAAAMQAgAgAAvwQAMEkAAMAEACADAAAAMQAgAgAAegAwAwAAewAgAQAAADYAIAEAAAA2ACADAAAANAAgAgAANQAwAwAANgAgAwAAADQAIAIAADUAMAMAADYAIAMAAAA0ACACAAA1ADADAAA2ACANFQAAmAsAIBkAAJkLACDzBAEAAAAB_wRAAAAAAfEFAQAAAAHyBQEAAAAB8wUgAAAAAfQFAQAAAAH1BQEAAAAB9gUCAAAAAfcFAgAAAAH4BQIAAAAB-QUBAAAAAQE9AADIBAAgC_MEAQAAAAH_BEAAAAAB8QUBAAAAAfIFAQAAAAHzBSAAAAAB9AUBAAAAAfUFAQAAAAH2BQIAAAAB9wUCAAAAAfgFAgAAAAH5BQEAAAABAT0AAMoEADABPQAAygQAMA0VAACWCwAgGQAAlwsAIPMEAQDoCQAh_wRAAOwJACHxBQEA6AkAIfIFAQDoCQAh8wUgAMYKACH0BQEA6gkAIfUFAQDqCQAh9gUCAIwLACH3BQIAjAsAIfgFAgD2CQAh-QUBAOoJACECAAAANgAgPQAAzQQAIAvzBAEA6AkAIf8EQADsCQAh8QUBAOgJACHyBQEA6AkAIfMFIADGCgAh9AUBAOoJACH1BQEA6gkAIfYFAgCMCwAh9wUCAIwLACH4BQIA9gkAIfkFAQDqCQAhAgAAADQAID0AAM8EACACAAAANAAgPQAAzwQAIAMAAAA2ACBEAADIBAAgRQAAzQQAIAEAAAA2ACABAAAANAAgCg0AAJELACBKAACUCwAgSwAAkwsAIKwBAACSCwAgrQEAAJULACD0BQAA5AkAIPUFAADkCQAg9gUAAOQJACD3BQAA5AkAIPkFAADkCQAgDvAEAADECAAw8QQAANYEABDyBAAAxAgAMPMEAQDTBwAh_wRAANgHACHxBQEA0wcAIfIFAQDTBwAh8wUgAI8IACH0BQEA1QcAIfUFAQDVBwAh9gUCAL4IACH3BQIAvggAIfgFAgDwBwAh-QUBANUHACEDAAAANAAgAgAA1QQAMEkAANYEACADAAAANAAgAgAANQAwAwAANgAgAQAAAEwAIAEAAABMACADAAAAJgAgAgAASwAwAwAATAAgAwAAACYAIAIAAEsAMAMAAEwAIAMAAAAmACACAABLADADAABMACANCAAAkAsAIBAAAI8LACDzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADvBQLqBQEAAAAB6wUCAAAAAewFAgAAAAHtBQgAAAAB7wUCAAAAAfAFQAAAAAEBPQAA3gQAIAvzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADvBQLqBQEAAAAB6wUCAAAAAewFAgAAAAHtBQgAAAAB7wUCAAAAAfAFQAAAAAEBPQAA4AQAMAE9AADgBAAwDQgAAI4LACAQAACNCwAg8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAiwvvBSLqBQEA6AkAIesFAgD2CQAh7AUCAPYJACHtBQgAigsAIe8FAgCMCwAh8AVAAOsJACECAAAATAAgPQAA4wQAIAvzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACLC-8FIuoFAQDoCQAh6wUCAPYJACHsBQIA9gkAIe0FCACKCwAh7wUCAIwLACHwBUAA6wkAIQIAAAAmACA9AADlBAAgAgAAACYAID0AAOUEACADAAAATAAgRAAA3gQAIEUAAOMEACABAAAATAAgAQAAACYAIAcNAACFCwAgSgAAiAsAIEsAAIcLACCsAQAAhgsAIK0BAACJCwAg7wUAAOQJACDwBQAA5AkAIA7wBAAAuwgAMPEEAADsBAAQ8gQAALsIADDzBAEA0wcAIfQEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAAC9CO8FIuoFAQDTBwAh6wUCAPAHACHsBQIA8AcAIe0FCAC8CAAh7wUCAL4IACHwBUAA1wcAIQMAAAAmACACAADrBAAwSQAA7AQAIAMAAAAmACACAABLADADAABMACABAAAALAAgAQAAACwAIAMAAAAqACACAAArADADAAAsACADAAAAKgAgAgAAKwAwAwAALAAgAwAAACoAIAIAACsAMAMAACwAIAYQAACECwAg8wQBAAAAAfQEAQAAAAGSBQAAAOkFAsgFgAAAAAHpBUAAAAABAT0AAPQEACAF8wQBAAAAAfQEAQAAAAGSBQAAAOkFAsgFgAAAAAHpBUAAAAABAT0AAPYEADABPQAA9gQAMAYQAACDCwAg8wQBAOgJACH0BAEA6AkAIZIFAACCC-kFIsgFgAAAAAHpBUAA7AkAIQIAAAAsACA9AAD5BAAgBfMEAQDoCQAh9AQBAOgJACGSBQAAggvpBSLIBYAAAAAB6QVAAOwJACECAAAAKgAgPQAA-wQAIAIAAAAqACA9AAD7BAAgAwAAACwAIEQAAPQEACBFAAD5BAAgAQAAACwAIAEAAAAqACAEDQAA_woAIEoAAIELACBLAACACwAgyAUAAOQJACAI8AQAALcIADDxBAAAggUAEPIEAAC3CAAw8wQBANMHACH0BAEA0wcAIZIFAAC4COkFIsgFAADWBwAg6QVAANgHACEDAAAAKgAgAgAAgQUAMEkAAIIFACADAAAAKgAgAgAAKwAwAwAALAAgEQYAALUIACAlAAC2CAAg8AQAALIIADDxBAAAVwAQ8gQAALIIADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAAC0COIFItUFAQAAAAHgBQAAswjgBSLiBQEAAAAB4wUBAAAAAeQFQADqBwAh5QVAAOoHACHmBSAAoggAIecFQADqBwAhAQAAAIUFACABAAAAhQUAIAcGAAD9CgAgJQAA_goAIOIFAADkCQAg4wUAAOQJACDkBQAA5AkAIOUFAADkCQAg5wUAAOQJACADAAAAVwAgAgAAiAUAMAMAAIUFACADAAAAVwAgAgAAiAUAMAMAAIUFACADAAAAVwAgAgAAiAUAMAMAAIUFACAOBgAA-woAICUAAPwKACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOIFAtUFAQAAAAHgBQAAAOAFAuIFAQAAAAHjBQEAAAAB5AVAAAAAAeUFQAAAAAHmBSAAAAAB5wVAAAAAAQE9AACMBQAgDPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4gUC1QUBAAAAAeAFAAAA4AUC4gUBAAAAAeMFAQAAAAHkBUAAAAAB5QVAAAAAAeYFIAAAAAHnBUAAAAABAT0AAI4FADABPQAAjgUAMA4GAADtCgAgJQAA7goAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADsCuIFItUFAQDoCQAh4AUAAOsK4AUi4gUBAOoJACHjBQEA6gkAIeQFQADrCQAh5QVAAOsJACHmBSAAxgoAIecFQADrCQAhAgAAAIUFACA9AACRBQAgDPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADsCuIFItUFAQDoCQAh4AUAAOsK4AUi4gUBAOoJACHjBQEA6gkAIeQFQADrCQAh5QVAAOsJACHmBSAAxgoAIecFQADrCQAhAgAAAFcAID0AAJMFACACAAAAVwAgPQAAkwUAIAMAAACFBQAgRAAAjAUAIEUAAJEFACABAAAAhQUAIAEAAABXACAIDQAA6AoAIEoAAOoKACBLAADpCgAg4gUAAOQJACDjBQAA5AkAIOQFAADkCQAg5QUAAOQJACDnBQAA5AkAIA_wBAAAqwgAMPEEAACaBQAQ8gQAAKsIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGYBQAArQjiBSLVBQEA0wcAIeAFAACsCOAFIuIFAQDVBwAh4wUBANUHACHkBUAA1wcAIeUFQADXBwAh5gUgAI8IACHnBUAA1wcAIQMAAABXACACAACZBQAwSQAAmgUAIAMAAABXACACAACIBQAwAwAAhQUAIAEAAABbACABAAAAWwAgAwAAAFkAIAIAAFoAMAMAAFsAIAMAAABZACACAABaADADAABbACADAAAAWQAgAgAAWgAwAwAAWwAgEwYAAOYKACAjAADlCgAgJAAA5woAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA2AUCtwUBAAAAAcgFgAAAAAHPBQAAAM8FAtUFAQAAAAHWBQEAAAAB2AUEAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBUAAAAAB3gVAAAAAAQE9AACiBQAgEPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA2AUCtwUBAAAAAcgFgAAAAAHPBQAAAM8FAtUFAQAAAAHWBQEAAAAB2AUEAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBUAAAAAB3gVAAAAAAQE9AACkBQAwAT0AAKQFADABAAAAAwAgAQAAAFcAIBMGAADjCgAgIwAA4goAICQAAOQKACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA4ArYBSK3BQEA6AkAIcgFgAAAAAHPBQAA2grPBSLVBQEA6gkAIdYFAQDqCQAh2AUEAOEKACHZBQEA6AkAIdoFAQDqCQAh2wUBAOoJACHcBQEA6gkAId0FQADrCQAh3gVAAOsJACECAAAAWwAgPQAAqQUAIBDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA4ArYBSK3BQEA6AkAIcgFgAAAAAHPBQAA2grPBSLVBQEA6gkAIdYFAQDqCQAh2AUEAOEKACHZBQEA6AkAIdoFAQDqCQAh2wUBAOoJACHcBQEA6gkAId0FQADrCQAh3gVAAOsJACECAAAAWQAgPQAAqwUAIAIAAABZACA9AACrBQAgAQAAAAMAIAEAAABXACADAAAAWwAgRAAAogUAIEUAAKkFACABAAAAWwAgAQAAAFkAIA0NAADbCgAgSgAA3goAIEsAAN0KACCsAQAA3AoAIK0BAADfCgAgyAUAAOQJACDVBQAA5AkAINYFAADkCQAg2gUAAOQJACDbBQAA5AkAINwFAADkCQAg3QUAAOQJACDeBQAA5AkAIBPwBAAApAgAMPEEAAC0BQAQ8gQAAKQIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGYBQAApQjYBSK3BQEA0wcAIcgFAADWBwAgzwUAAJ0IzwUi1QUBANUHACHWBQEA1QcAIdgFBACmCAAh2QUBANMHACHaBQEA1QcAIdsFAQDVBwAh3AUBANUHACHdBUAA1wcAId4FQADXBwAhAwAAAFkAIAIAALMFADBJAAC0BQAgAwAAAFkAIAIAAFoAMAMAAFsAIBDwBAAAoAgAMPEEAAC6BQAQ8gQAAKAIADDzBAEAAAAB_wRAAOsHACGSBQEA9wcAIZYFAAD4BwAgmQUCAPoHACGaBQIA-gcAIZwFQADqBwAhzwUAAKEIzwUi0AUBAPcHACHRBSAAoggAIdIFQADqBwAh0wVAAOoHACHUBQAAowgAIAEAAAC3BQAgAQAAALcFACAP8AQAAKAIADDxBAAAugUAEPIEAACgCAAw8wQBAPcHACH_BEAA6wcAIZIFAQD3BwAhlgUAAPgHACCZBQIA-gcAIZoFAgD6BwAhnAVAAOoHACHPBQAAoQjPBSLQBQEA9wcAIdEFIACiCAAh0gVAAOoHACHTBUAA6gcAIQOcBQAA5AkAINIFAADkCQAg0wUAAOQJACADAAAAugUAIAIAALsFADADAAC3BQAgAwAAALoFACACAAC7BQAwAwAAtwUAIAMAAAC6BQAgAgAAuwUAMAMAALcFACAM8wQBAAAAAf8EQAAAAAGSBQEAAAABlgWAAAAAAZkFAgAAAAGaBQIAAAABnAVAAAAAAc8FAAAAzwUC0AUBAAAAAdEFIAAAAAHSBUAAAAAB0wVAAAAAAQE9AAC_BQAgDPMEAQAAAAH_BEAAAAABkgUBAAAAAZYFgAAAAAGZBQIAAAABmgUCAAAAAZwFQAAAAAHPBQAAAM8FAtAFAQAAAAHRBSAAAAAB0gVAAAAAAdMFQAAAAAEBPQAAwQUAMAE9AADBBQAwDPMEAQDoCQAh_wRAAOwJACGSBQEA6AkAIZYFgAAAAAGZBQIA9gkAIZoFAgD2CQAhnAVAAOsJACHPBQAA2grPBSLQBQEA6AkAIdEFIADGCgAh0gVAAOsJACHTBUAA6wkAIQIAAAC3BQAgPQAAxAUAIAzzBAEA6AkAIf8EQADsCQAhkgUBAOgJACGWBYAAAAABmQUCAPYJACGaBQIA9gkAIZwFQADrCQAhzwUAANoKzwUi0AUBAOgJACHRBSAAxgoAIdIFQADrCQAh0wVAAOsJACECAAAAugUAID0AAMYFACACAAAAugUAID0AAMYFACADAAAAtwUAIEQAAL8FACBFAADEBQAgAQAAALcFACABAAAAugUAIAgNAADVCgAgSgAA2AoAIEsAANcKACCsAQAA1goAIK0BAADZCgAgnAUAAOQJACDSBQAA5AkAINMFAADkCQAgD_AEAACcCAAw8QQAAM0FABDyBAAAnAgAMPMEAQDTBwAh_wRAANgHACGSBQEA0wcAIZYFAADuBwAgmQUCAPAHACGaBQIA8AcAIZwFQADXBwAhzwUAAJ0IzwUi0AUBANMHACHRBSAAjwgAIdIFQADXBwAh0wVAANcHACEDAAAAugUAIAIAAMwFADBJAADNBQAgAwAAALoFACACAAC7BQAwAwAAtwUAIAEAAACAAQAgAQAAAIABACADAAAAfgAgAgAAfwAwAwAAgAEAIAMAAAB-ACACAAB_ADADAACAAQAgAwAAAH4AIAIAAH8AMAMAAIABACAKIwAA1AoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAaIFAQAAAAGnBQEAAAABtwUBAAAAAcgFgAAAAAHMBQAAAMwFAs0FIAAAAAEBPQAA1QUAIAnzBAEAAAAB_wRAAAAAAYAFQAAAAAGiBQEAAAABpwUBAAAAAbcFAQAAAAHIBYAAAAABzAUAAADMBQLNBSAAAAABAT0AANcFADABPQAA1wUAMAojAADTCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhogUBAOgJACGnBQEA6AkAIbcFAQDoCQAhyAWAAAAAAcwFAADSCswFIs0FIADGCgAhAgAAAIABACA9AADaBQAgCfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIaIFAQDoCQAhpwUBAOgJACG3BQEA6AkAIcgFgAAAAAHMBQAA0grMBSLNBSAAxgoAIQIAAAB-ACA9AADcBQAgAgAAAH4AID0AANwFACADAAAAgAEAIEQAANUFACBFAADaBQAgAQAAAIABACABAAAAfgAgBA0AAM8KACBKAADRCgAgSwAA0AoAIMgFAADkCQAgDPAEAACYCAAw8QQAAOMFABDyBAAAmAgAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIaIFAQDTBwAhpwUBANMHACG3BQEA0wcAIcgFAADWBwAgzAUAAJkIzAUizQUgAI8IACEDAAAAfgAgAgAA4gUAMEkAAOMFACADAAAAfgAgAgAAfwAwAwAAgAEAIAEAAACEAQAgAQAAAIQBACADAAAAggEAIAIAAIMBADADAACEAQAgAwAAAIIBACACAACDAQAwAwAAhAEAIAMAAACCAQAgAgAAgwEAMAMAAIQBACAMIwAAzgoAIPMEAQAAAAH_BEAAAAABtwUBAAAAAcMFAAAAwwUCxAUBAAAAAcUFAQAAAAHGBYAAAAABxwWAAAAAAcgFgAAAAAHJBQEAAAABygUBAAAAAQE9AADrBQAgC_MEAQAAAAH_BEAAAAABtwUBAAAAAcMFAAAAwwUCxAUBAAAAAcUFAQAAAAHGBYAAAAABxwWAAAAAAcgFgAAAAAHJBQEAAAABygUBAAAAAQE9AADtBQAwAT0AAO0FADABAAAAGwAgDCMAAM0KACDzBAEA6AkAIf8EQADsCQAhtwUBAOoJACHDBQAAzArDBSLEBQEA6AkAIcUFAQDqCQAhxgWAAAAAAccFgAAAAAHIBYAAAAAByQUBAOoJACHKBQEA6gkAIQIAAACEAQAgPQAA8QUAIAvzBAEA6AkAIf8EQADsCQAhtwUBAOoJACHDBQAAzArDBSLEBQEA6AkAIcUFAQDqCQAhxgWAAAAAAccFgAAAAAHIBYAAAAAByQUBAOoJACHKBQEA6gkAIQIAAACCAQAgPQAA8wUAIAIAAACCAQAgPQAA8wUAIAEAAAAbACADAAAAhAEAIEQAAOsFACBFAADxBQAgAQAAAIQBACABAAAAggEAIAoNAADJCgAgSgAAywoAIEsAAMoKACC3BQAA5AkAIMUFAADkCQAgxgUAAOQJACDHBQAA5AkAIMgFAADkCQAgyQUAAOQJACDKBQAA5AkAIA7wBAAAlAgAMPEEAAD7BQAQ8gQAAJQIADDzBAEA0wcAIf8EQADYBwAhtwUBANUHACHDBQAAlQjDBSLEBQEA0wcAIcUFAQDVBwAhxgUAANYHACDHBQAA1gcAIMgFAADWBwAgyQUBANUHACHKBQEA1QcAIQMAAACCAQAgAgAA-gUAMEkAAPsFACADAAAAggEAIAIAAIMBADADAACEAQAgAQAAAHIAIAEAAAByACADAAAAcAAgAgAAcQAwAwAAcgAgAwAAAHAAIAIAAHEAMAMAAHIAIAMAAABwACACAABxADADAAByACAHIwAAyAoAIPMEAQAAAAG3BQEAAAABvgUAAAC-BQK_BSAAAAABwAVAAAAAAcEFQAAAAAEBPQAAgwYAIAbzBAEAAAABtwUBAAAAAb4FAAAAvgUCvwUgAAAAAcAFQAAAAAHBBUAAAAABAT0AAIUGADABPQAAhQYAMAcjAADHCgAg8wQBAOgJACG3BQEA6AkAIb4FAADFCr4FIr8FIADGCgAhwAVAAOwJACHBBUAA6wkAIQIAAAByACA9AACIBgAgBvMEAQDoCQAhtwUBAOgJACG-BQAAxQq-BSK_BSAAxgoAIcAFQADsCQAhwQVAAOsJACECAAAAcAAgPQAAigYAIAIAAABwACA9AACKBgAgAwAAAHIAIEQAAIMGACBFAACIBgAgAQAAAHIAIAEAAABwACAEDQAAwgoAIEoAAMQKACBLAADDCgAgwQUAAOQJACAJ8AQAAI0IADDxBAAAkQYAEPIEAACNCAAw8wQBANMHACG3BQEA0wcAIb4FAACOCL4FIr8FIACPCAAhwAVAANgHACHBBUAA1wcAIQMAAABwACACAACQBgAwSQAAkQYAIAMAAABwACACAABxADADAAByACABAAAAlgEAIAEAAACWAQAgAwAAAJQBACACAACVAQAwAwAAlgEAIAMAAACUAQAgAgAAlQEAMAMAAJYBACADAAAAlAEAIAIAAJUBADADAACWAQAgCiMAAMEKACDzBAEAAAAB_wRAAAAAAbYFAQAAAAG3BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwUCAAAAAbwFQAAAAAEBPQAAmQYAIAnzBAEAAAAB_wRAAAAAAbYFAQAAAAG3BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwUCAAAAAbwFQAAAAAEBPQAAmwYAMAE9AACbBgAwCiMAAMAKACDzBAEA6AkAIf8EQADsCQAhtgUBAOgJACG3BQEA6AkAIbgFAQDoCQAhuQUBAOgJACG6BYAAAAABuwUCAPYJACG8BUAA7AkAIQIAAACWAQAgPQAAngYAIAnzBAEA6AkAIf8EQADsCQAhtgUBAOgJACG3BQEA6AkAIbgFAQDoCQAhuQUBAOgJACG6BYAAAAABuwUCAPYJACG8BUAA7AkAIQIAAACUAQAgPQAAoAYAIAIAAACUAQAgPQAAoAYAIAMAAACWAQAgRAAAmQYAIEUAAJ4GACABAAAAlgEAIAEAAACUAQAgBQ0AALsKACBKAAC-CgAgSwAAvQoAIKwBAAC8CgAgrQEAAL8KACAM8AQAAIwIADDxBAAApwYAEPIEAACMCAAw8wQBANMHACH_BEAA2AcAIbYFAQDTBwAhtwUBANMHACG4BQEA0wcAIbkFAQDTBwAhugUAAO4HACC7BQIA8AcAIbwFQADYBwAhAwAAAJQBACACAACmBgAwSQAApwYAIAMAAACUAQAgAgAAlQEAMAMAAJYBACAKMQAAiwgAIPAEAACKCAAw8QQAAK0GABDyBAAAiggAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhnwUBAAAAAagFAQAAAAG1BQEA6AcAIQEAAACqBgAgAQAAAKoGACAKMQAAiwgAIPAEAACKCAAw8QQAAK0GABDyBAAAiggAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZ8FAQD3BwAhqAUBAPcHACG1BQEA6AcAIQIxAAC6CgAgtQUAAOQJACADAAAArQYAIAIAAK4GADADAACqBgAgAwAAAK0GACACAACuBgAwAwAAqgYAIAMAAACtBgAgAgAArgYAMAMAAKoGACAHMQAAuQoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZ8FAQAAAAGoBQEAAAABtQUBAAAAAQE9AACyBgAgBvMEAQAAAAH_BEAAAAABgAVAAAAAAZ8FAQAAAAGoBQEAAAABtQUBAAAAAQE9AAC0BgAwAT0AALQGADAHMQAArAoAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZ8FAQDoCQAhqAUBAOgJACG1BQEA6gkAIQIAAACqBgAgPQAAtwYAIAbzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGfBQEA6AkAIagFAQDoCQAhtQUBAOoJACECAAAArQYAID0AALkGACACAAAArQYAID0AALkGACADAAAAqgYAIEQAALIGACBFAAC3BgAgAQAAAKoGACABAAAArQYAIAQNAACpCgAgSgAAqwoAIEsAAKoKACC1BQAA5AkAIAnwBAAAiQgAMPEEAADABgAQ8gQAAIkIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGfBQEA0wcAIagFAQDTBwAhtQUBANUHACEDAAAArQYAIAIAAL8GADBJAADABgAgAwAAAK0GACACAACuBgAwAwAAqgYAIAgxAACICAAg8AQAAIcIADDxBAAAxgYAEPIEAACHCAAw8wQBAAAAAf8EQADrBwAhnwUBAAAAAagFAQAAAAEBAAAAwwYAIAEAAADDBgAgCDEAAIgIACDwBAAAhwgAMPEEAADGBgAQ8gQAAIcIADDzBAEA9wcAIf8EQADrBwAhnwUBAPcHACGoBQEA9wcAIQExAACoCgAgAwAAAMYGACACAADHBgAwAwAAwwYAIAMAAADGBgAgAgAAxwYAMAMAAMMGACADAAAAxgYAIAIAAMcGADADAADDBgAgBTEAAKcKACDzBAEAAAAB_wRAAAAAAZ8FAQAAAAGoBQEAAAABAT0AAMsGACAE8wQBAAAAAf8EQAAAAAGfBQEAAAABqAUBAAAAAQE9AADNBgAwAT0AAM0GADAFMQAAnQoAIPMEAQDoCQAh_wRAAOwJACGfBQEA6AkAIagFAQDoCQAhAgAAAMMGACA9AADQBgAgBPMEAQDoCQAh_wRAAOwJACGfBQEA6AkAIagFAQDoCQAhAgAAAMYGACA9AADSBgAgAgAAAMYGACA9AADSBgAgAwAAAMMGACBEAADLBgAgRQAA0AYAIAEAAADDBgAgAQAAAMYGACADDQAAmgoAIEoAAJwKACBLAACbCgAgB_AEAACGCAAw8QQAANkGABDyBAAAhggAMPMEAQDTBwAh_wRAANgHACGfBQEA0wcAIagFAQDTBwAhAwAAAMYGACACAADYBgAwSQAA2QYAIAMAAADGBgAgAgAAxwYAMAMAAMMGACABAAAAiQEAIAEAAACJAQAgAwAAAIcBACACAACIAQAwAwAAiQEAIAMAAACHAQAgAgAAiAEAMAMAAIkBACADAAAAhwEAIAIAAIgBADADAACJAQAgETAAAJcKACAyAACYCgAgNQAAmQoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAArQUCpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGtBQIAAAABrgVAAAAAAa8FAQAAAAGwBQEAAAABsQVAAAAAAQE9AADhBgAgDvMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAArQUCpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGtBQIAAAABrgVAAAAAAa8FAQAAAAGwBQEAAAABsQVAAAAAAQE9AADjBgAwAT0AAOMGADARMAAAiAoAIDIAAIkKACA1AACKCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAIcKrQUipwUBAOgJACGoBQEA6AkAIakFAQDoCQAhqgUBAOgJACGrBQEA6gkAIa0FAgD2CQAhrgVAAOsJACGvBQEA6AkAIbAFAQDoCQAhsQVAAOsJACECAAAAiQEAID0AAOYGACAO8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAIcKrQUipwUBAOgJACGoBQEA6AkAIakFAQDoCQAhqgUBAOgJACGrBQEA6gkAIa0FAgD2CQAhrgVAAOsJACGvBQEA6AkAIbAFAQDoCQAhsQVAAOsJACECAAAAhwEAID0AAOgGACACAAAAhwEAID0AAOgGACADAAAAiQEAIEQAAOEGACBFAADmBgAgAQAAAIkBACABAAAAhwEAIAgNAACCCgAgSgAAhQoAIEsAAIQKACCsAQAAgwoAIK0BAACGCgAgqwUAAOQJACCuBQAA5AkAILEFAADkCQAgEfAEAACCCAAw8QQAAO8GABDyBAAAgggAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAACDCK0FIqcFAQDTBwAhqAUBANMHACGpBQEA0wcAIaoFAQDTBwAhqwUBANUHACGtBQIA8AcAIa4FQADXBwAhrwUBANMHACGwBQEA0wcAIbEFQADXBwAhAwAAAIcBACACAADuBgAwSQAA7wYAIAMAAACHAQAgAgAAiAEAMAMAAIkBACABAAAAjwEAIAEAAACPAQAgAwAAAI0BACACAACOAQAwAwAAjwEAIAMAAACNAQAgAgAAjgEAMAMAAI8BACADAAAAjQEAIAIAAI4BADADAACPAQAgBDMAAIAKACA0AACBCgAgpQUBAAAAAaYFAQAAAAEBPQAA9wYAIAKlBQEAAAABpgUBAAAAAQE9AAD5BgAwAT0AAPkGADAEMwAA_gkAIDQAAP8JACClBQEA6AkAIaYFAQDoCQAhAgAAAI8BACA9AAD8BgAgAqUFAQDoCQAhpgUBAOgJACECAAAAjQEAID0AAP4GACACAAAAjQEAID0AAP4GACADAAAAjwEAIEQAAPcGACBFAAD8BgAgAQAAAI8BACABAAAAjQEAIAMNAAD7CQAgSgAA_QkAIEsAAPwJACAF8AQAAIEIADDxBAAAhQcAEPIEAACBCAAwpQUBANMHACGmBQEA0wcAIQMAAACNAQAgAgAAhAcAMEkAAIUHACADAAAAjQEAIAIAAI4BADADAACPAQAgC_AEAAD_BwAw8QQAAIsHABDyBAAA_wcAMPMEAQAAAAH_BEAA6wcAIZgFAACACKQFIp8FAQD3BwAhoAUBAPcHACGhBQEA9wcAIaIFAQD3BwAhpAVAAOoHACEBAAAAiAcAIAEAAACIBwAgC_AEAAD_BwAw8QQAAIsHABDyBAAA_wcAMPMEAQD3BwAh_wRAAOsHACGYBQAAgAikBSKfBQEA9wcAIaAFAQD3BwAhoQUBAPcHACGiBQEA9wcAIaQFQADqBwAhAaQFAADkCQAgAwAAAIsHACACAACMBwAwAwAAiAcAIAMAAACLBwAgAgAAjAcAMAMAAIgHACADAAAAiwcAIAIAAIwHADADAACIBwAgCPMEAQAAAAH_BEAAAAABmAUAAACkBQKfBQEAAAABoAUBAAAAAaEFAQAAAAGiBQEAAAABpAVAAAAAAQE9AACQBwAgCPMEAQAAAAH_BEAAAAABmAUAAACkBQKfBQEAAAABoAUBAAAAAaEFAQAAAAGiBQEAAAABpAVAAAAAAQE9AACSBwAwAT0AAJIHADAI8wQBAOgJACH_BEAA7AkAIZgFAAD6CaQFIp8FAQDoCQAhoAUBAOgJACGhBQEA6AkAIaIFAQDoCQAhpAVAAOsJACECAAAAiAcAID0AAJUHACAI8wQBAOgJACH_BEAA7AkAIZgFAAD6CaQFIp8FAQDoCQAhoAUBAOgJACGhBQEA6AkAIaIFAQDoCQAhpAVAAOsJACECAAAAiwcAID0AAJcHACACAAAAiwcAID0AAJcHACADAAAAiAcAIEQAAJAHACBFAACVBwAgAQAAAIgHACABAAAAiwcAIAQNAAD3CQAgSgAA-QkAIEsAAPgJACCkBQAA5AkAIAvwBAAA-wcAMPEEAACeBwAQ8gQAAPsHADDzBAEA0wcAIf8EQADYBwAhmAUAAPwHpAUinwUBANMHACGgBQEA0wcAIaEFAQDTBwAhogUBANMHACGkBUAA1wcAIQMAAACLBwAgAgAAnQcAMEkAAJ4HACADAAAAiwcAIAIAAIwHADADAACIBwAgEvAEAAD2BwAw8QQAAKQHABDyBAAA9gcAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhkgUBAPcHACGTBQEA9wcAIZQFAQD3BwAhlQUBAAAAAZYFAAD4BwAgmAUAAPkHmAUimQUCAPoHACGaBQIA-gcAIZsFQADqBwAhnAVAAOoHACGdBQEA6AcAIZ4FQADqBwAhAQAAAKEHACABAAAAoQcAIBLwBAAA9gcAMPEEAACkBwAQ8gQAAPYHADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGSBQEA9wcAIZMFAQD3BwAhlAUBAPcHACGVBQEA6AcAIZYFAAD4BwAgmAUAAPkHmAUimQUCAPoHACGaBQIA-gcAIZsFQADqBwAhnAVAAOoHACGdBQEA6AcAIZ4FQADqBwAhBZUFAADkCQAgmwUAAOQJACCcBQAA5AkAIJ0FAADkCQAgngUAAOQJACADAAAApAcAIAIAAKUHADADAAChBwAgAwAAAKQHACACAAClBwAwAwAAoQcAIAMAAACkBwAgAgAApQcAMAMAAKEHACAP8wQBAAAAAf8EQAAAAAGABUAAAAABkgUBAAAAAZMFAQAAAAGUBQEAAAABlQUBAAAAAZYFgAAAAAGYBQAAAJgFApkFAgAAAAGaBQIAAAABmwVAAAAAAZwFQAAAAAGdBQEAAAABngVAAAAAAQE9AACpBwAgD_MEAQAAAAH_BEAAAAABgAVAAAAAAZIFAQAAAAGTBQEAAAABlAUBAAAAAZUFAQAAAAGWBYAAAAABmAUAAACYBQKZBQIAAAABmgUCAAAAAZsFQAAAAAGcBUAAAAABnQUBAAAAAZ4FQAAAAAEBPQAAqwcAMAE9AACrBwAwD_MEAQDoCQAh_wRAAOwJACGABUAA7AkAIZIFAQDoCQAhkwUBAOgJACGUBQEA6AkAIZUFAQDqCQAhlgWAAAAAAZgFAAD1CZgFIpkFAgD2CQAhmgUCAPYJACGbBUAA6wkAIZwFQADrCQAhnQUBAOoJACGeBUAA6wkAIQIAAAChBwAgPQAArgcAIA_zBAEA6AkAIf8EQADsCQAhgAVAAOwJACGSBQEA6AkAIZMFAQDoCQAhlAUBAOgJACGVBQEA6gkAIZYFgAAAAAGYBQAA9QmYBSKZBQIA9gkAIZoFAgD2CQAhmwVAAOsJACGcBUAA6wkAIZ0FAQDqCQAhngVAAOsJACECAAAApAcAID0AALAHACACAAAApAcAID0AALAHACADAAAAoQcAIEQAAKkHACBFAACuBwAgAQAAAKEHACABAAAApAcAIAoNAADwCQAgSgAA8wkAIEsAAPIJACCsAQAA8QkAIK0BAAD0CQAglQUAAOQJACCbBQAA5AkAIJwFAADkCQAgnQUAAOQJACCeBQAA5AkAIBLwBAAA7QcAMPEEAAC3BwAQ8gQAAO0HADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGSBQEA0wcAIZMFAQDTBwAhlAUBANMHACGVBQEA1QcAIZYFAADuBwAgmAUAAO8HmAUimQUCAPAHACGaBQIA8AcAIZsFQADXBwAhnAVAANcHACGdBQEA1QcAIZ4FQADXBwAhAwAAAKQHACACAAC2BwAwSQAAtwcAIAMAAACkBwAgAgAApQcAMAMAAKEHACAREAAA7AcAIPAEAADmBwAw8QQAACgAEPIEAADmBwAw8wQBAAAAAfQEAQAAAAH2BAAA5wf2BCP3BAEA6AcAIfgEAQDoBwAh-QQAAOkHACD6BAAA6QcAIPsEAQDoBwAh_AQBAOgHACH9BEAA6gcAIf4EQADqBwAh_wRAAOsHACGABUAA6wcAIQEAAAC6BwAgAQAAALoHACAKEAAA7wkAIPYEAADkCQAg9wQAAOQJACD4BAAA5AkAIPkEAADkCQAg-gQAAOQJACD7BAAA5AkAIPwEAADkCQAg_QQAAOQJACD-BAAA5AkAIAMAAAAoACACAAC9BwAwAwAAugcAIAMAAAAoACACAAC9BwAwAwAAugcAIAMAAAAoACACAAC9BwAwAwAAugcAIA4QAADuCQAg8wQBAAAAAfQEAQAAAAH2BAAAAPYEA_cEAQAAAAH4BAEAAAAB-QSAAAAAAfoEgAAAAAH7BAEAAAAB_AQBAAAAAf0EQAAAAAH-BEAAAAAB_wRAAAAAAYAFQAAAAAEBPQAAwQcAIA3zBAEAAAAB9AQBAAAAAfYEAAAA9gQD9wQBAAAAAfgEAQAAAAH5BIAAAAAB-gSAAAAAAfsEAQAAAAH8BAEAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAVAAAAAAQE9AADDBwAwAT0AAMMHADAOEAAA7QkAIPMEAQDoCQAh9AQBAOgJACH2BAAA6Qn2BCP3BAEA6gkAIfgEAQDqCQAh-QSAAAAAAfoEgAAAAAH7BAEA6gkAIfwEAQDqCQAh_QRAAOsJACH-BEAA6wkAIf8EQADsCQAhgAVAAOwJACECAAAAugcAID0AAMYHACAN8wQBAOgJACH0BAEA6AkAIfYEAADpCfYEI_cEAQDqCQAh-AQBAOoJACH5BIAAAAAB-gSAAAAAAfsEAQDqCQAh_AQBAOoJACH9BEAA6wkAIf4EQADrCQAh_wRAAOwJACGABUAA7AkAIQIAAAAoACA9AADIBwAgAgAAACgAID0AAMgHACADAAAAugcAIEQAAMEHACBFAADGBwAgAQAAALoHACABAAAAKAAgDA0AAOUJACBKAADnCQAgSwAA5gkAIPYEAADkCQAg9wQAAOQJACD4BAAA5AkAIPkEAADkCQAg-gQAAOQJACD7BAAA5AkAIPwEAADkCQAg_QQAAOQJACD-BAAA5AkAIBDwBAAA0gcAMPEEAADPBwAQ8gQAANIHADDzBAEA0wcAIfQEAQDTBwAh9gQAANQH9gQj9wQBANUHACH4BAEA1QcAIfkEAADWBwAg-gQAANYHACD7BAEA1QcAIfwEAQDVBwAh_QRAANcHACH-BEAA1wcAIf8EQADYBwAhgAVAANgHACEDAAAAKAAgAgAAzgcAMEkAAM8HACADAAAAKAAgAgAAvQcAMAMAALoHACAQ8AQAANIHADDxBAAAzwcAEPIEAADSBwAw8wQBANMHACH0BAEA0wcAIfYEAADUB_YEI_cEAQDVBwAh-AQBANUHACH5BAAA1gcAIPoEAADWBwAg-wQBANUHACH8BAEA1QcAIf0EQADXBwAh_gRAANcHACH_BEAA2AcAIYAFQADYBwAhDg0AANoHACBKAADlBwAgSwAA5QcAIIEFAQAAAAGCBQEAAAAEgwUBAAAABIQFAQAAAAGFBQEAAAABhgUBAAAAAYcFAQAAAAGIBQEA5AcAIY8FAQAAAAGQBQEAAAABkQUBAAAAAQcNAADdBwAgSgAA4wcAIEsAAOMHACCBBQAAAPYEA4IFAAAA9gQJgwUAAAD2BAmIBQAA4gf2BCMODQAA3QcAIEoAAOEHACBLAADhBwAggQUBAAAAAYIFAQAAAAWDBQEAAAAFhAUBAAAAAYUFAQAAAAGGBQEAAAABhwUBAAAAAYgFAQDgBwAhjwUBAAAAAZAFAQAAAAGRBQEAAAABDw0AAN0HACBKAADfBwAgSwAA3wcAIIEFgAAAAAGEBYAAAAABhQWAAAAAAYYFgAAAAAGHBYAAAAABiAWAAAAAAYkFAQAAAAGKBQEAAAABiwUBAAAAAYwFgAAAAAGNBYAAAAABjgWAAAAAAQsNAADdBwAgSgAA3gcAIEsAAN4HACCBBUAAAAABggVAAAAABYMFQAAAAAWEBUAAAAABhQVAAAAAAYYFQAAAAAGHBUAAAAABiAVAANwHACELDQAA2gcAIEoAANsHACBLAADbBwAggQVAAAAAAYIFQAAAAASDBUAAAAAEhAVAAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAYgFQADZBwAhCw0AANoHACBKAADbBwAgSwAA2wcAIIEFQAAAAAGCBUAAAAAEgwVAAAAABIQFQAAAAAGFBUAAAAABhgVAAAAAAYcFQAAAAAGIBUAA2QcAIQiBBQIAAAABggUCAAAABIMFAgAAAASEBQIAAAABhQUCAAAAAYYFAgAAAAGHBQIAAAABiAUCANoHACEIgQVAAAAAAYIFQAAAAASDBUAAAAAEhAVAAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAYgFQADbBwAhCw0AAN0HACBKAADeBwAgSwAA3gcAIIEFQAAAAAGCBUAAAAAFgwVAAAAABYQFQAAAAAGFBUAAAAABhgVAAAAAAYcFQAAAAAGIBUAA3AcAIQiBBQIAAAABggUCAAAABYMFAgAAAAWEBQIAAAABhQUCAAAAAYYFAgAAAAGHBQIAAAABiAUCAN0HACEIgQVAAAAAAYIFQAAAAAWDBUAAAAAFhAVAAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAYgFQADeBwAhDIEFgAAAAAGEBYAAAAABhQWAAAAAAYYFgAAAAAGHBYAAAAABiAWAAAAAAYkFAQAAAAGKBQEAAAABiwUBAAAAAYwFgAAAAAGNBYAAAAABjgWAAAAAAQ4NAADdBwAgSgAA4QcAIEsAAOEHACCBBQEAAAABggUBAAAABYMFAQAAAAWEBQEAAAABhQUBAAAAAYYFAQAAAAGHBQEAAAABiAUBAOAHACGPBQEAAAABkAUBAAAAAZEFAQAAAAELgQUBAAAAAYIFAQAAAAWDBQEAAAAFhAUBAAAAAYUFAQAAAAGGBQEAAAABhwUBAAAAAYgFAQDhBwAhjwUBAAAAAZAFAQAAAAGRBQEAAAABBw0AAN0HACBKAADjBwAgSwAA4wcAIIEFAAAA9gQDggUAAAD2BAmDBQAAAPYECYgFAADiB_YEIwSBBQAAAPYEA4IFAAAA9gQJgwUAAAD2BAmIBQAA4wf2BCMODQAA2gcAIEoAAOUHACBLAADlBwAggQUBAAAAAYIFAQAAAASDBQEAAAAEhAUBAAAAAYUFAQAAAAGGBQEAAAABhwUBAAAAAYgFAQDkBwAhjwUBAAAAAZAFAQAAAAGRBQEAAAABC4EFAQAAAAGCBQEAAAAEgwUBAAAABIQFAQAAAAGFBQEAAAABhgUBAAAAAYcFAQAAAAGIBQEA5QcAIY8FAQAAAAGQBQEAAAABkQUBAAAAAREQAADsBwAg8AQAAOYHADDxBAAAKAAQ8gQAAOYHADDzBAEA9wcAIfQEAQD3BwAh9gQAAOcH9gQj9wQBAOgHACH4BAEA6AcAIfkEAADpBwAg-gQAAOkHACD7BAEA6AcAIfwEAQDoBwAh_QRAAOoHACH-BEAA6gcAIf8EQADrBwAhgAVAAOsHACEEgQUAAAD2BAOCBQAAAPYECYMFAAAA9gQJiAUAAOMH9gQjC4EFAQAAAAGCBQEAAAAFgwUBAAAABYQFAQAAAAGFBQEAAAABhgUBAAAAAYcFAQAAAAGIBQEA4QcAIY8FAQAAAAGQBQEAAAABkQUBAAAAAQyBBYAAAAABhAWAAAAAAYUFgAAAAAGGBYAAAAABhwWAAAAAAYgFgAAAAAGJBQEAAAABigUBAAAAAYsFAQAAAAGMBYAAAAABjQWAAAAAAY4FgAAAAAEIgQVAAAAAAYIFQAAAAAWDBUAAAAAFhAVAAAAAAYUFQAAAAAGGBUAAAAABhwVAAAAAAYgFQADeBwAhCIEFQAAAAAGCBUAAAAAEgwVAAAAABIQFQAAAAAGFBUAAAAABhgVAAAAAAYcFQAAAAAGIBUAA2wcAIRsIAACwCQAgCwAA8ggAIA4AAMQJACAPAACsCQAgEQAAxQkAIBIAAMYJACATAADHCQAg8AQAAMIJADDxBAAAHQAQ8gQAAMIJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAwwmRBiK8BUAA6wcAIckFAQDoBwAhygUBAOgHACHqBQEA9wcAIYwGQADqBwAhjQYBAPcHACGOBgEA6AcAIY8GAgD6BwAhkQZAAOoHACGSBkAA6gcAIZMGAgD6BwAh8gYAAB0AIPMGAAAdACAS8AQAAO0HADDxBAAAtwcAEPIEAADtBwAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhkgUBANMHACGTBQEA0wcAIZQFAQDTBwAhlQUBANUHACGWBQAA7gcAIJgFAADvB5gFIpkFAgDwBwAhmgUCAPAHACGbBUAA1wcAIZwFQADXBwAhnQUBANUHACGeBUAA1wcAIQ8NAADaBwAgSgAA9QcAIEsAAPUHACCBBYAAAAABhAWAAAAAAYUFgAAAAAGGBYAAAAABhwWAAAAAAYgFgAAAAAGJBQEAAAABigUBAAAAAYsFAQAAAAGMBYAAAAABjQWAAAAAAY4FgAAAAAEHDQAA2gcAIEoAAPQHACBLAAD0BwAggQUAAACYBQKCBQAAAJgFCIMFAAAAmAUIiAUAAPMHmAUiDQ0AANoHACBKAADaBwAgSwAA2gcAIKwBAADyBwAgrQEAANoHACCBBQIAAAABggUCAAAABIMFAgAAAASEBQIAAAABhQUCAAAAAYYFAgAAAAGHBQIAAAABiAUCAPEHACENDQAA2gcAIEoAANoHACBLAADaBwAgrAEAAPIHACCtAQAA2gcAIIEFAgAAAAGCBQIAAAAEgwUCAAAABIQFAgAAAAGFBQIAAAABhgUCAAAAAYcFAgAAAAGIBQIA8QcAIQiBBQgAAAABggUIAAAABIMFCAAAAASEBQgAAAABhQUIAAAAAYYFCAAAAAGHBQgAAAABiAUIAPIHACEHDQAA2gcAIEoAAPQHACBLAAD0BwAggQUAAACYBQKCBQAAAJgFCIMFAAAAmAUIiAUAAPMHmAUiBIEFAAAAmAUCggUAAACYBQiDBQAAAJgFCIgFAAD0B5gFIgyBBYAAAAABhAWAAAAAAYUFgAAAAAGGBYAAAAABhwWAAAAAAYgFgAAAAAGJBQEAAAABigUBAAAAAYsFAQAAAAGMBYAAAAABjQWAAAAAAY4FgAAAAAES8AQAAPYHADDxBAAApAcAEPIEAAD2BwAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhkgUBAPcHACGTBQEA9wcAIZQFAQD3BwAhlQUBAOgHACGWBQAA-AcAIJgFAAD5B5gFIpkFAgD6BwAhmgUCAPoHACGbBUAA6gcAIZwFQADqBwAhnQUBAOgHACGeBUAA6gcAIQuBBQEAAAABggUBAAAABIMFAQAAAASEBQEAAAABhQUBAAAAAYYFAQAAAAGHBQEAAAABiAUBAOUHACGPBQEAAAABkAUBAAAAAZEFAQAAAAEMgQWAAAAAAYQFgAAAAAGFBYAAAAABhgWAAAAAAYcFgAAAAAGIBYAAAAABiQUBAAAAAYoFAQAAAAGLBQEAAAABjAWAAAAAAY0FgAAAAAGOBYAAAAABBIEFAAAAmAUCggUAAACYBQiDBQAAAJgFCIgFAAD0B5gFIgiBBQIAAAABggUCAAAABIMFAgAAAASEBQIAAAABhQUCAAAAAYYFAgAAAAGHBQIAAAABiAUCANoHACEL8AQAAPsHADDxBAAAngcAEPIEAAD7BwAw8wQBANMHACH_BEAA2AcAIZgFAAD8B6QFIp8FAQDTBwAhoAUBANMHACGhBQEA0wcAIaIFAQDTBwAhpAVAANcHACEHDQAA2gcAIEoAAP4HACBLAAD-BwAggQUAAACkBQKCBQAAAKQFCIMFAAAApAUIiAUAAP0HpAUiBw0AANoHACBKAAD-BwAgSwAA_gcAIIEFAAAApAUCggUAAACkBQiDBQAAAKQFCIgFAAD9B6QFIgSBBQAAAKQFAoIFAAAApAUIgwUAAACkBQiIBQAA_gekBSIL8AQAAP8HADDxBAAAiwcAEPIEAAD_BwAw8wQBAPcHACH_BEAA6wcAIZgFAACACKQFIp8FAQD3BwAhoAUBAPcHACGhBQEA9wcAIaIFAQD3BwAhpAVAAOoHACEEgQUAAACkBQKCBQAAAKQFCIMFAAAApAUIiAUAAP4HpAUiBfAEAACBCAAw8QQAAIUHABDyBAAAgQgAMKUFAQDTBwAhpgUBANMHACER8AQAAIIIADDxBAAA7wYAEPIEAACCCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAAIMIrQUipwUBANMHACGoBQEA0wcAIakFAQDTBwAhqgUBANMHACGrBQEA1QcAIa0FAgDwBwAhrgVAANcHACGvBQEA0wcAIbAFAQDTBwAhsQVAANcHACEHDQAA2gcAIEoAAIUIACBLAACFCAAggQUAAACtBQKCBQAAAK0FCIMFAAAArQUIiAUAAIQIrQUiBw0AANoHACBKAACFCAAgSwAAhQgAIIEFAAAArQUCggUAAACtBQiDBQAAAK0FCIgFAACECK0FIgSBBQAAAK0FAoIFAAAArQUIgwUAAACtBQiIBQAAhQitBSIH8AQAAIYIADDxBAAA2QYAEPIEAACGCAAw8wQBANMHACH_BEAA2AcAIZ8FAQDTBwAhqAUBANMHACEIMQAAiAgAIPAEAACHCAAw8QQAAMYGABDyBAAAhwgAMPMEAQD3BwAh_wRAAOsHACGfBQEA9wcAIagFAQD3BwAhA7IFAACNAQAgswUAAI0BACC0BQAAjQEAIAnwBAAAiQgAMPEEAADABgAQ8gQAAIkIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGfBQEA0wcAIagFAQDTBwAhtQUBANUHACEKMQAAiwgAIPAEAACKCAAw8QQAAK0GABDyBAAAiggAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZ8FAQD3BwAhqAUBAPcHACG1BQEA6AcAIQOyBQAAhwEAILMFAACHAQAgtAUAAIcBACAM8AQAAIwIADDxBAAApwYAEPIEAACMCAAw8wQBANMHACH_BEAA2AcAIbYFAQDTBwAhtwUBANMHACG4BQEA0wcAIbkFAQDTBwAhugUAAO4HACC7BQIA8AcAIbwFQADYBwAhCfAEAACNCAAw8QQAAJEGABDyBAAAjQgAMPMEAQDTBwAhtwUBANMHACG-BQAAjgi-BSK_BSAAjwgAIcAFQADYBwAhwQVAANcHACEHDQAA2gcAIEoAAJMIACBLAACTCAAggQUAAAC-BQKCBQAAAL4FCIMFAAAAvgUIiAUAAJIIvgUiBQ0AANoHACBKAACRCAAgSwAAkQgAIIEFIAAAAAGIBSAAkAgAIQUNAADaBwAgSgAAkQgAIEsAAJEIACCBBSAAAAABiAUgAJAIACECgQUgAAAAAYgFIACRCAAhBw0AANoHACBKAACTCAAgSwAAkwgAIIEFAAAAvgUCggUAAAC-BQiDBQAAAL4FCIgFAACSCL4FIgSBBQAAAL4FAoIFAAAAvgUIgwUAAAC-BQiIBQAAkwi-BSIO8AQAAJQIADDxBAAA-wUAEPIEAACUCAAw8wQBANMHACH_BEAA2AcAIbcFAQDVBwAhwwUAAJUIwwUixAUBANMHACHFBQEA1QcAIcYFAADWBwAgxwUAANYHACDIBQAA1gcAIMkFAQDVBwAhygUBANUHACEHDQAA2gcAIEoAAJcIACBLAACXCAAggQUAAADDBQKCBQAAAMMFCIMFAAAAwwUIiAUAAJYIwwUiBw0AANoHACBKAACXCAAgSwAAlwgAIIEFAAAAwwUCggUAAADDBQiDBQAAAMMFCIgFAACWCMMFIgSBBQAAAMMFAoIFAAAAwwUIgwUAAADDBQiIBQAAlwjDBSIM8AQAAJgIADDxBAAA4wUAEPIEAACYCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhogUBANMHACGnBQEA0wcAIbcFAQDTBwAhyAUAANYHACDMBQAAmQjMBSLNBSAAjwgAIQcNAADaBwAgSgAAmwgAIEsAAJsIACCBBQAAAMwFAoIFAAAAzAUIgwUAAADMBQiIBQAAmgjMBSIHDQAA2gcAIEoAAJsIACBLAACbCAAggQUAAADMBQKCBQAAAMwFCIMFAAAAzAUIiAUAAJoIzAUiBIEFAAAAzAUCggUAAADMBQiDBQAAAMwFCIgFAACbCMwFIg_wBAAAnAgAMPEEAADNBQAQ8gQAAJwIADDzBAEA0wcAIf8EQADYBwAhkgUBANMHACGWBQAA7gcAIJkFAgDwBwAhmgUCAPAHACGcBUAA1wcAIc8FAACdCM8FItAFAQDTBwAh0QUgAI8IACHSBUAA1wcAIdMFQADXBwAhBw0AANoHACBKAACfCAAgSwAAnwgAIIEFAAAAzwUCggUAAADPBQiDBQAAAM8FCIgFAACeCM8FIgcNAADaBwAgSgAAnwgAIEsAAJ8IACCBBQAAAM8FAoIFAAAAzwUIgwUAAADPBQiIBQAAngjPBSIEgQUAAADPBQKCBQAAAM8FCIMFAAAAzwUIiAUAAJ8IzwUiD_AEAACgCAAw8QQAALoFABDyBAAAoAgAMPMEAQD3BwAh_wRAAOsHACGSBQEA9wcAIZYFAAD4BwAgmQUCAPoHACGaBQIA-gcAIZwFQADqBwAhzwUAAKEIzwUi0AUBAPcHACHRBSAAoggAIdIFQADqBwAh0wVAAOoHACEEgQUAAADPBQKCBQAAAM8FCIMFAAAAzwUIiAUAAJ8IzwUiAoEFIAAAAAGIBSAAkQgAIQLPBQAAAM8FAtAFAQAAAAET8AQAAKQIADDxBAAAtAUAEPIEAACkCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAAKUI2AUitwUBANMHACHIBQAA1gcAIM8FAACdCM8FItUFAQDVBwAh1gUBANUHACHYBQQApggAIdkFAQDTBwAh2gUBANUHACHbBQEA1QcAIdwFAQDVBwAh3QVAANcHACHeBUAA1wcAIQcNAADaBwAgSgAAqggAIEsAAKoIACCBBQAAANgFAoIFAAAA2AUIgwUAAADYBQiIBQAAqQjYBSINDQAA2gcAIEoAAKgIACBLAACoCAAgrAEAAPIHACCtAQAAqAgAIIEFBAAAAAGCBQQAAAAEgwUEAAAABIQFBAAAAAGFBQQAAAABhgUEAAAAAYcFBAAAAAGIBQQApwgAIQ0NAADaBwAgSgAAqAgAIEsAAKgIACCsAQAA8gcAIK0BAACoCAAggQUEAAAAAYIFBAAAAASDBQQAAAAEhAUEAAAAAYUFBAAAAAGGBQQAAAABhwUEAAAAAYgFBACnCAAhCIEFBAAAAAGCBQQAAAAEgwUEAAAABIQFBAAAAAGFBQQAAAABhgUEAAAAAYcFBAAAAAGIBQQAqAgAIQcNAADaBwAgSgAAqggAIEsAAKoIACCBBQAAANgFAoIFAAAA2AUIgwUAAADYBQiIBQAAqQjYBSIEgQUAAADYBQKCBQAAANgFCIMFAAAA2AUIiAUAAKoI2AUiD_AEAACrCAAw8QQAAJoFABDyBAAAqwgAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAACtCOIFItUFAQDTBwAh4AUAAKwI4AUi4gUBANUHACHjBQEA1QcAIeQFQADXBwAh5QVAANcHACHmBSAAjwgAIecFQADXBwAhBw0AANoHACBKAACxCAAgSwAAsQgAIIEFAAAA4AUCggUAAADgBQiDBQAAAOAFCIgFAACwCOAFIgcNAADaBwAgSgAArwgAIEsAAK8IACCBBQAAAOIFAoIFAAAA4gUIgwUAAADiBQiIBQAArgjiBSIHDQAA2gcAIEoAAK8IACBLAACvCAAggQUAAADiBQKCBQAAAOIFCIMFAAAA4gUIiAUAAK4I4gUiBIEFAAAA4gUCggUAAADiBQiDBQAAAOIFCIgFAACvCOIFIgcNAADaBwAgSgAAsQgAIEsAALEIACCBBQAAAOAFAoIFAAAA4AUIgwUAAADgBQiIBQAAsAjgBSIEgQUAAADgBQKCBQAAAOAFCIMFAAAA4AUIiAUAALEI4AUiEQYAALUIACAlAAC2CAAg8AQAALIIADDxBAAAVwAQ8gQAALIIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAtAjiBSLVBQEA9wcAIeAFAACzCOAFIuIFAQDoBwAh4wUBAOgHACHkBUAA6gcAIeUFQADqBwAh5gUgAKIIACHnBUAA6gcAIQSBBQAAAOAFAoIFAAAA4AUIgwUAAADgBQiIBQAAsQjgBSIEgQUAAADiBQKCBQAAAOIFCIMFAAAA4gUIiAUAAK8I4gUiFgEAAPIIACAhAAD1CAAgIgAA9ggAICQAAPcIACAlAAC2CAAg8AQAAPQIADDxBAAAAwAQ8gQAAPQIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGfBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA6AcAIccGAQDoBwAhyAYBAOgHACHJBgEA6AcAIcoGIACiCAAhywYBAPcHACHyBgAAAwAg8wYAAAMAIAOyBQAAWQAgswUAAFkAILQFAABZACAI8AQAALcIADDxBAAAggUAEPIEAAC3CAAw8wQBANMHACH0BAEA0wcAIZIFAAC4COkFIsgFAADWBwAg6QVAANgHACEHDQAA2gcAIEoAALoIACBLAAC6CAAggQUAAADpBQKCBQAAAOkFCIMFAAAA6QUIiAUAALkI6QUiBw0AANoHACBKAAC6CAAgSwAAuggAIIEFAAAA6QUCggUAAADpBQiDBQAAAOkFCIgFAAC5COkFIgSBBQAAAOkFAoIFAAAA6QUIgwUAAADpBQiIBQAAugjpBSIO8AQAALsIADDxBAAA7AQAEPIEAAC7CAAw8wQBANMHACH0BAEA0wcAIf8EQADYBwAhgAVAANgHACGYBQAAvQjvBSLqBQEA0wcAIesFAgDwBwAh7AUCAPAHACHtBQgAvAgAIe8FAgC-CAAh8AVAANcHACENDQAA2gcAIEoAAPIHACBLAADyBwAgrAEAAPIHACCtAQAA8gcAIIEFCAAAAAGCBQgAAAAEgwUIAAAABIQFCAAAAAGFBQgAAAABhgUIAAAAAYcFCAAAAAGIBQgAwwgAIQcNAADaBwAgSgAAwggAIEsAAMIIACCBBQAAAO8FAoIFAAAA7wUIgwUAAADvBQiIBQAAwQjvBSINDQAA3QcAIEoAAN0HACBLAADdBwAgrAEAAMAIACCtAQAA3QcAIIEFAgAAAAGCBQIAAAAFgwUCAAAABYQFAgAAAAGFBQIAAAABhgUCAAAAAYcFAgAAAAGIBQIAvwgAIQ0NAADdBwAgSgAA3QcAIEsAAN0HACCsAQAAwAgAIK0BAADdBwAggQUCAAAAAYIFAgAAAAWDBQIAAAAFhAUCAAAAAYUFAgAAAAGGBQIAAAABhwUCAAAAAYgFAgC_CAAhCIEFCAAAAAGCBQgAAAAFgwUIAAAABYQFCAAAAAGFBQgAAAABhgUIAAAAAYcFCAAAAAGIBQgAwAgAIQcNAADaBwAgSgAAwggAIEsAAMIIACCBBQAAAO8FAoIFAAAA7wUIgwUAAADvBQiIBQAAwQjvBSIEgQUAAADvBQKCBQAAAO8FCIMFAAAA7wUIiAUAAMII7wUiDQ0AANoHACBKAADyBwAgSwAA8gcAIKwBAADyBwAgrQEAAPIHACCBBQgAAAABggUIAAAABIMFCAAAAASEBQgAAAABhQUIAAAAAYYFCAAAAAGHBQgAAAABiAUIAMMIACEO8AQAAMQIADDxBAAA1gQAEPIEAADECAAw8wQBANMHACH_BEAA2AcAIfEFAQDTBwAh8gUBANMHACHzBSAAjwgAIfQFAQDVBwAh9QUBANUHACH2BQIAvggAIfcFAgC-CAAh-AUCAPAHACH5BQEA1QcAIRXwBAAAxQgAMPEEAADABAAQ8gQAAMUIADDzBAEA0wcAIfwEAQDVBwAh_wRAANgHACGABUAA2AcAIZgFAADGCP8FIsgFAADWBwAg8AVAANcHACHxBQEA0wcAIfoFAQDVBwAh-wUCAPAHACH8BQIA8AcAIf0FAQDVBwAh_wUgAI8IACGABgIAvggAIYEGAQDVBwAhggZAANcHACGEBgAAxwiEBiKFBkAA1wcAIQcNAADaBwAgSgAAywgAIEsAAMsIACCBBQAAAP8FAoIFAAAA_wUIgwUAAAD_BQiIBQAAygj_BSIHDQAA2gcAIEoAAMkIACBLAADJCAAggQUAAACEBgKCBQAAAIQGCIMFAAAAhAYIiAUAAMgIhAYiBw0AANoHACBKAADJCAAgSwAAyQgAIIEFAAAAhAYCggUAAACEBgiDBQAAAIQGCIgFAADICIQGIgSBBQAAAIQGAoIFAAAAhAYIgwUAAACEBgiIBQAAyQiEBiIHDQAA2gcAIEoAAMsIACBLAADLCAAggQUAAAD_BQKCBQAAAP8FCIMFAAAA_wUIiAUAAMoI_wUiBIEFAAAA_wUCggUAAAD_BQiDBQAAAP8FCIgFAADLCP8FIgfwBAAAzAgAMPEEAACoBAAQ8gQAAMwIADDzBAEA0wcAIf8EQADYBwAh8QUBANMHACGGBgEA0wcAIQ3wBAAAzQgAMPEEAACSBAAQ8gQAAM0IADDzBAEA0wcAIfQEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAADOCIwGIocGAQDTBwAhiAYBANUHACGJBgEA1QcAIYoGAQDVBwAhjAZAANcHACEHDQAA2gcAIEoAANAIACBLAADQCAAggQUAAACMBgKCBQAAAIwGCIMFAAAAjAYIiAUAAM8IjAYiBw0AANoHACBKAADQCAAgSwAA0AgAIIEFAAAAjAYCggUAAACMBgiDBQAAAIwGCIgFAADPCIwGIgSBBQAAAIwGAoIFAAAAjAYIgwUAAACMBgiIBQAA0AiMBiIS8AQAANEIADDxBAAA_AMAEPIEAADRCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhmAUAANIIkQYivAVAANgHACHJBQEA1QcAIcoFAQDVBwAh6gUBANMHACGMBkAA1wcAIY0GAQDTBwAhjgYBANUHACGPBgIA8AcAIZEGQADXBwAhkgZAANcHACGTBgIA8AcAIQcNAADaBwAgSgAA1AgAIEsAANQIACCBBQAAAJEGAoIFAAAAkQYIgwUAAACRBgiIBQAA0wiRBiIHDQAA2gcAIEoAANQIACBLAADUCAAggQUAAACRBgKCBQAAAJEGCIMFAAAAkQYIiAUAANMIkQYiBIEFAAAAkQYCggUAAACRBgiDBQAAAJEGCIgFAADUCJEGIg7wBAAA1QgAMPEEAADkAwAQ8gQAANUIADDzBAEA0wcAIZgFAADWCJUGIqAFAQDTBwAhvAVAANcHACHqBQEA0wcAIY0GAQDVBwAhlQYBANMHACGWBkAA2AcAIZcGQADXBwAhmAZAANcHACGZBkAA1wcAIQcNAADaBwAgSgAA2AgAIEsAANgIACCBBQAAAJUGAoIFAAAAlQYIgwUAAACVBgiIBQAA1wiVBiIHDQAA2gcAIEoAANgIACBLAADYCAAggQUAAACVBgKCBQAAAJUGCIMFAAAAlQYIiAUAANcIlQYiBIEFAAAAlQYCggUAAACVBgiDBQAAAJUGCIgFAADYCJUGIgnwBAAA2QgAMPEEAADMAwAQ8gQAANkIADDzBAEA0wcAIf8EQADYBwAh6gUBANMHACGHBgEA0wcAIZoGAgDwBwAhmwYCAPAHACEM8AQAANoIADDxBAAAtgMAEPIEAADaCAAw8wQBANMHACH_BEAA2AcAIfUFAQDTBwAh-AUCAPAHACGHBgEA0wcAIZwGAQDVBwAhnQYgAI8IACGeBgIAvggAIZ8GAgC-CAAhCPAEAADbCAAw8QQAAKADABDyBAAA2wgAMPMEAQDTBwAhmgYCAPAHACGgBgEA0wcAIaEGAQDTBwAhogYgAI8IACEH8AQAANwIADDxBAAAigMAEPIEAADcCAAw8wQBANMHACHMBQAA3QikBiKHBgEA0wcAIaQGAQDVBwAhBw0AANoHACBKAADfCAAgSwAA3wgAIIEFAAAApAYCggUAAACkBgiDBQAAAKQGCIgFAADeCKQGIgcNAADaBwAgSgAA3wgAIEsAAN8IACCBBQAAAKQGAoIFAAAApAYIgwUAAACkBgiIBQAA3gikBiIEgQUAAACkBgKCBQAAAKQGCIMFAAAApAYIiAUAAN8IpAYiCQkAAOIIACAdAADjCAAg8AQAAOAIADDxBAAADwAQ8gQAAOAIADDzBAEA9wcAIcwFAADhCKQGIocGAQD3BwAhpAYBAOgHACEEgQUAAACkBgKCBQAAAKQGCIMFAAAApAYIiAUAAN8IpAYiGwYAALUIACAHAADyCAAgCgAAqQkAIA8AAKwJACAeAACqCQAgHwAAqwkAIPAEAACmCQAw8QQAAFMAEPIEAACmCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhpwUBAPcHACGoBQEA9wcAIbEFQADqBwAhtQUBAPcHACHMBQAApwmmBiLVBQEA9wcAIacGAACoCacGIqgGAQDoBwAhqQYgAKIIACGqBgIA-gcAIasGAgDxCAAhrAYBAPcHACGtBiAAoggAIfIGAABTACDzBgAAUwAgA7IFAAARACCzBQAAEQAgtAUAABEAIBPwBAAA5AgAMPEEAADyAgAQ8gQAAOQIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGnBQEA0wcAIagFAQDTBwAhsQVAANcHACG1BQEA0wcAIcwFAADlCKYGItUFAQDTBwAhpwYAAOYIpwYiqAYBANUHACGpBiAAjwgAIaoGAgDwBwAhqwYCAL4IACGsBgEA0wcAIa0GIACPCAAhBw0AANoHACBKAADqCAAgSwAA6ggAIIEFAAAApgYCggUAAACmBgiDBQAAAKYGCIgFAADpCKYGIgcNAADaBwAgSgAA6AgAIEsAAOgIACCBBQAAAKcGAoIFAAAApwYIgwUAAACnBgiIBQAA5winBiIHDQAA2gcAIEoAAOgIACBLAADoCAAggQUAAACnBgKCBQAAAKcGCIMFAAAApwYIiAUAAOcIpwYiBIEFAAAApwYCggUAAACnBgiDBQAAAKcGCIgFAADoCKcGIgcNAADaBwAgSgAA6ggAIEsAAOoIACCBBQAAAKYGAoIFAAAApgYIgwUAAACmBgiIBQAA6QimBiIEgQUAAACmBgKCBQAAAKYGCIMFAAAApgYIiAUAAOoIpgYiG_AEAADrCAAw8QQAANwCABDyBAAA6wgAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIZgFAADsCLMGIqcFAQDTBwAhqAUBANMHACGuBUAA1wcAIbEFQADXBwAhtQUBANUHACHVBQEA0wcAIewFAgDwBwAhrAYBANMHACGuBgEA1QcAIa8GAgDwBwAhsAYCAPAHACGxBgIA8AcAIbMGQADXBwAhtAZAANcHACG1BiAAjwgAIbYGIACPCAAhtwYgAI8IACG4BgIA8AcAIbkGIACPCAAhugYBANUHACEHDQAA2gcAIEoAAO4IACBLAADuCAAggQUAAACzBgKCBQAAALMGCIMFAAAAswYIiAUAAO0IswYiBw0AANoHACBKAADuCAAgSwAA7ggAIIEFAAAAswYCggUAAACzBgiDBQAAALMGCIgFAADtCLMGIgSBBQAAALMGAoIFAAAAswYIgwUAAACzBgiIBQAA7gizBiIU8AQAAO8IADDxBAAAxAIAEPIEAADvCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhsQVAANcHACG3BQEA0wcAIbsGAQDVBwAhvAYBANUHACG9BgEA1QcAIb4GAQDVBwAhvwYBANUHACHABgEA1QcAIcEGAQDVBwAhwgYBANUHACHDBgAA1gcAIMQGAgC-CAAhxQZAANcHACHGBiAAjwgAIRUjAADyCAAg8AQAAPAIADDxBAAAdAAQ8gQAAPAIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGxBUAA6gcAIbcFAQD3BwAhuwYBAOgHACG8BgEA6AcAIb0GAQDoBwAhvgYBAOgHACG_BgEA6AcAIcAGAQDoBwAhwQYBAOgHACHCBgEA6AcAIcMGAADpBwAgxAYCAPEIACHFBkAA6gcAIcYGIACiCAAhCIEFAgAAAAGCBQIAAAAFgwUCAAAABYQFAgAAAAGFBQIAAAABhgUCAAAAAYcFAgAAAAGIBQIA3QcAISMGAACkCQAgDAAAtAkAICAAANEJACAlAAC2CAAgJgAAzAkAICcAAM0JACAoAADOCQAgKQAAzwkAICoAANAJACArAAD1CAAgLAAA9ggAIC0AANIJACAuAADTCQAgLwAA1AkAIDYAAIsIACA3AADVCQAg8AQAAMgJADDxBAAAGwAQ8gQAAMgJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAygngBiKfBQEA9wcAIaAFAQD3BwAhsQVAAOoHACHPBQAAywnhBiK9BgEA6AcAIdwGAQDoBwAh3gYAAMkJ3gYi4QYgAKIIACHiBiAAoggAIeMGQADqBwAh8gYAABsAIPMGAAAbACAP8AQAAPMIADDxBAAArAIAEPIEAADzCAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhnwUBANMHACGoBQEA0wcAIbEFQADXBwAhtQUBANUHACHHBgEA1QcAIcgGAQDVBwAhyQYBANUHACHKBiAAjwgAIcsGAQDTBwAhFAEAAPIIACAhAAD1CAAgIgAA9ggAICQAAPcIACAlAAC2CAAg8AQAAPQIADDxBAAAAwAQ8gQAAPQIADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGfBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA6AcAIccGAQDoBwAhyAYBAOgHACHJBgEA6AcAIcoGIACiCAAhywYBAPcHACEDsgUAAAUAILMFAAAFACC0BQAABQAgA7IFAABTACCzBQAAUwAgtAUAAFMAIBMGAAC1CAAgJQAAtggAIPAEAACyCAAw8QQAAFcAEPIEAACyCAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAALQI4gUi1QUBAPcHACHgBQAAswjgBSLiBQEA6AcAIeMFAQDoBwAh5AVAAOoHACHlBUAA6gcAIeYFIACiCAAh5wVAAOoHACHyBgAAVwAg8wYAAFcAIAnwBAAA-AgAMPEEAACUAgAQ8gQAAPgIADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACG8BUAA2AcAIcwGAQDTBwAhzQYBANMHACEJ8AQAAPkIADDxBAAAgQIAEPIEAAD5CAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhvAVAAOsHACHMBgEA9wcAIc0GAQD3BwAhAswGAQAAAAHNBgEAAAABC_AEAAD7CAAw8QQAAPsBABDyBAAA-wgAMPMEAQDTBwAh_wRAANgHACGABUAA2AcAIbcFAQDTBwAhvAVAANgHACHJBQEA1QcAIcoFAQDVBwAhzwYBANMHACEH8AQAAPwIADDxBAAA5QEAEPIEAAD8CAAw8wQBANMHACG3BQEA0wcAIdAGAQDTBwAh0QYBANUHACER8AQAAP0IADDxBAAAzwEAEPIEAAD9CAAw8wQBANMHACH_BEAA2AcAIYAFQADYBwAhtwUBANMHACHSBgEA0wcAIdMGAQDTBwAh1AYBANMHACHVBgEA1QcAIdYGAQDVBwAh1wYBANUHACHYBgEA1QcAIdkGQADXBwAh2gZAANcHACHbBgEA1QcAIRHwBAAA_ggAMPEEAAC5AQAQ8gQAAP4IADDzBAEA0wcAIf8EQADYBwAhgAVAANgHACGYBQAAgAngBiKfBQEA0wcAIaAFAQDTBwAhsQVAANcHACHPBQAAgQnhBiK9BgEA1QcAIdwGAQDVBwAh3gYAAP8I3gYi4QYgAI8IACHiBiAAjwgAIeMGQADXBwAhBw0AANoHACBKAACHCQAgSwAAhwkAIIEFAAAA3gYCggUAAADeBgiDBQAAAN4GCIgFAACGCd4GIgcNAADaBwAgSgAAhQkAIEsAAIUJACCBBQAAAOAGAoIFAAAA4AYIgwUAAADgBgiIBQAAhAngBiIHDQAA2gcAIEoAAIMJACBLAACDCQAggQUAAADhBgKCBQAAAOEGCIMFAAAA4QYIiAUAAIIJ4QYiBw0AANoHACBKAACDCQAgSwAAgwkAIIEFAAAA4QYCggUAAADhBgiDBQAAAOEGCIgFAACCCeEGIgSBBQAAAOEGAoIFAAAA4QYIgwUAAADhBgiIBQAAgwnhBiIHDQAA2gcAIEoAAIUJACBLAACFCQAggQUAAADgBgKCBQAAAOAGCIMFAAAA4AYIiAUAAIQJ4AYiBIEFAAAA4AYCggUAAADgBgiDBQAAAOAGCIgFAACFCeAGIgcNAADaBwAgSgAAhwkAIEsAAIcJACCBBQAAAN4GAoIFAAAA3gYIgwUAAADeBgiIBQAAhgneBiIEgQUAAADeBgKCBQAAAN4GCIMFAAAA3gYIiAUAAIcJ3gYiArYFAQAAAAG3BQEAAAABDSMAAPIIACDwBAAAiQkAMPEEAACUAQAQ8gQAAIkJADDzBAEA9wcAIf8EQADrBwAhtgUBAPcHACG3BQEA9wcAIbgFAQD3BwAhuQUBAPcHACG6BQAA-AcAILsFAgD6BwAhvAVAAOsHACECpQUBAAAAAaYFAQAAAAEHMwAAjAkAIDQAAI0JACDwBAAAiwkAMPEEAACNAQAQ8gQAAIsJADClBQEA9wcAIaYFAQD3BwAhFjAAAPIIACAyAACQCQAgNQAAiAgAIPAEAACOCQAw8QQAAIcBABDyBAAAjgkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAPcHACGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAh8gYAAIcBACDzBgAAhwEAIAoxAACICAAg8AQAAIcIADDxBAAAxgYAEPIEAACHCAAw8wQBAPcHACH_BEAA6wcAIZ8FAQD3BwAhqAUBAPcHACHyBgAAxgYAIPMGAADGBgAgFDAAAPIIACAyAACQCQAgNQAAiAgAIPAEAACOCQAw8QQAAIcBABDyBAAAjgkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAPcHACGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAhBIEFAAAArQUCggUAAACtBQiDBQAAAK0FCIgFAACFCK0FIgwxAACLCAAg8AQAAIoIADDxBAAArQYAEPIEAACKCAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhnwUBAPcHACGoBQEA9wcAIbUFAQDoBwAh8gYAAK0GACDzBgAArQYAIA8jAACTCQAg8AQAAJEJADDxBAAAggEAEPIEAACRCQAw8wQBAPcHACH_BEAA6wcAIbcFAQDoBwAhwwUAAJIJwwUixAUBAPcHACHFBQEA6AcAIcYFAADpBwAgxwUAAOkHACDIBQAA6QcAIMkFAQDoBwAhygUBAOgHACEEgQUAAADDBQKCBQAAAMMFCIMFAAAAwwUIiAUAAJcIwwUiIwYAAKQJACAMAAC0CQAgIAAA0QkAICUAALYIACAmAADMCQAgJwAAzQkAICgAAM4JACApAADPCQAgKgAA0AkAICsAAPUIACAsAAD2CAAgLQAA0gkAIC4AANMJACAvAADUCQAgNgAAiwgAIDcAANUJACDwBAAAyAkAMPEEAAAbABDyBAAAyAkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADKCeAGIp8FAQD3BwAhoAUBAPcHACGxBUAA6gcAIc8FAADLCeEGIr0GAQDoBwAh3AYBAOgHACHeBgAAyQneBiLhBiAAoggAIeIGIACiCAAh4wZAAOoHACHyBgAAGwAg8wYAABsAIA0jAADyCAAg8AQAAJQJADDxBAAAfgAQ8gQAAJQJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGiBQEA9wcAIacFAQD3BwAhtwUBAPcHACHIBQAA6QcAIMwFAACVCcwFIs0FIACiCAAhBIEFAAAAzAUCggUAAADMBQiDBQAAAMwFCIgFAACbCMwFIhcVAACZCQAgFgAAkwkAIPAEAACWCQAw8QQAADEAEPIEAACWCQAw8wQBAPcHACH8BAEA6AcAIf8EQADrBwAhgAVAAOsHACGYBQAAlwn_BSLIBQAA6QcAIPAFQADqBwAh8QUBAPcHACH6BQEA6AcAIfsFAgD6BwAh_AUCAPoHACH9BQEA6AcAIf8FIACiCAAhgAYCAPEIACGBBgEA6AcAIYIGQADqBwAhhAYAAJgJhAYihQZAAOoHACEEgQUAAAD_BQKCBQAAAP8FCIMFAAAA_wUIiAUAAMsI_wUiBIEFAAAAhAYCggUAAACEBgiDBQAAAIQGCIgFAADJCIQGIhQJAADiCAAgEAAA7AcAIBQAAL8JACAXAADACQAgGgAAtgkAIPAEAAC9CQAw8QQAACIAEPIEAAC9CQAw8wQBAPcHACH0BAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAvgmMBiKHBgEA9wcAIYgGAQDoBwAhiQYBAOgHACGKBgEA6AcAIYwGQADqBwAh8gYAACIAIPMGAAAiACACtwUBAAAAAb4FAAAAvgUCCiMAAPIIACDwBAAAmwkAMPEEAABwABDyBAAAmwkAMPMEAQD3BwAhtwUBAPcHACG-BQAAnAm-BSK_BSAAoggAIcAFQADrBwAhwQVAAOoHACEEgQUAAAC-BQKCBQAAAL4FCIMFAAAAvgUIiAUAAJMIvgUiCCMAAPIIACDwBAAAnQkAMPEEAABsABDyBAAAnQkAMPMEAQD3BwAhtwUBAPcHACHQBgEA9wcAIdEGAQDoBwAhDCMAAPIIACDwBAAAngkAMPEEAABoABDyBAAAngkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIbcFAQD3BwAhvAVAAOsHACHJBQEA6AcAIcoFAQDoBwAhzwYBAPcHACEC0gYBAAAAAdQGAQAAAAESIwAA8ggAIPAEAACgCQAw8QQAAGQAEPIEAACgCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhtwUBAPcHACHSBgEA9wcAIdMGAQD3BwAh1AYBAPcHACHVBgEA6AcAIdYGAQDoBwAh1wYBAOgHACHYBgEA6AcAIdkGQADqBwAh2gZAAOoHACHbBgEA6AcAIRYGAACkCQAgIwAA8ggAICQAAPcIACDwBAAAoQkAMPEEAABZABDyBAAAoQkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACiCdgFIrcFAQD3BwAhyAUAAOkHACDPBQAAoQjPBSLVBQEA6AcAIdYFAQDoBwAh2AUEAKMJACHZBQEA9wcAIdoFAQDoBwAh2wUBAOgHACHcBQEA6AcAId0FQADqBwAh3gVAAOoHACEEgQUAAADYBQKCBQAAANgFCIMFAAAA2AUIiAUAAKoI2AUiCIEFBAAAAAGCBQQAAAAEgwUEAAAABIQFBAAAAAGFBQQAAAABhgUEAAAAAYcFBAAAAAGIBQQAqAgAIRYBAADyCAAgIQAA9QgAICIAAPYIACAkAAD3CAAgJQAAtggAIPAEAAD0CAAw8QQAAAMAEPIEAAD0CAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhnwUBAPcHACGoBQEA9wcAIbEFQADqBwAhtQUBAOgHACHHBgEA6AcAIcgGAQDoBwAhyQYBAOgHACHKBiAAoggAIcsGAQD3BwAh8gYAAAMAIPMGAAADACACqAUBAAAAAdUFAQAAAAEZBgAAtQgAIAcAAPIIACAKAACpCQAgDwAArAkAIB4AAKoJACAfAACrCQAg8AQAAKYJADDxBAAAUwAQ8gQAAKYJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGnBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA9wcAIcwFAACnCaYGItUFAQD3BwAhpwYAAKgJpwYiqAYBAOgHACGpBiAAoggAIaoGAgD6BwAhqwYCAPEIACGsBgEA9wcAIa0GIACiCAAhBIEFAAAApgYCggUAAACmBgiDBQAAAKYGCIgFAADqCKYGIgSBBQAAAKcGAoIFAAAApwYIgwUAAACnBgiIBQAA6AinBiILCQAA4ggAIB0AAOMIACDwBAAA4AgAMPEEAAAPABDyBAAA4AgAMPMEAQD3BwAhzAUAAOEIpAYihwYBAPcHACGkBgEA6AcAIfIGAAAPACDzBgAADwAgA7IFAAA-ACCzBQAAPgAgtAUAAD4AIAOyBQAACwAgswUAAAsAILQFAAALACADsgUAACIAILMFAAAiACC0BQAAIgAgEAgAALAJACAQAADsBwAg8AQAAK0JADDxBAAAJgAQ8gQAAK0JADDzBAEA9wcAIfQEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACvCe8FIuoFAQD3BwAh6wUCAPoHACHsBQIA-gcAIe0FCACuCQAh7wUCAPEIACHwBUAA6gcAIQiBBQgAAAABggUIAAAABIMFCAAAAASEBQgAAAABhQUIAAAAAYYFCAAAAAGHBQgAAAABiAUIAPIHACEEgQUAAADvBQKCBQAAAO8FCIMFAAAA7wUIiAUAAMII7wUiJQQAAOIJACAFAAD1CAAgBgAAtQgAIAcAAPIIACAMAAC0CQAgGAAA4wkAIB8AAKsJACAgAADRCQAg8AQAAOAJADDxBAAABQAQ8gQAAOAJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAA4QmzBiKnBQEA9wcAIagFAQD3BwAhrgVAAOoHACGxBUAA6gcAIbUFAQDoBwAh1QUBAPcHACHsBQIA-gcAIawGAQD3BwAhrgYBAOgHACGvBgIA-gcAIbAGAgD6BwAhsQYCAPoHACGzBkAA6gcAIbQGQADqBwAhtQYgAKIIACG2BiAAoggAIbcGIACiCAAhuAYCAPoHACG5BiAAoggAIboGAQDoBwAh8gYAAAUAIPMGAAAFACACoAUBAAAAAeoFAQAAAAERCAAAsAkAIAsAAJMJACAMAAC0CQAg8AQAALIJADDxBAAAGQAQ8gQAALIJADDzBAEA9wcAIZgFAACzCZUGIqAFAQD3BwAhvAVAAOoHACHqBQEA9wcAIY0GAQDoBwAhlQYBAPcHACGWBkAA6wcAIZcGQADqBwAhmAZAAOoHACGZBkAA6gcAIQSBBQAAAJUGAoIFAAAAlQYIgwUAAACVBgiIBQAA2AiVBiIDsgUAAB0AILMFAAAdACC0BQAAHQAgDgkAAOIIACAYAAC2CQAg8AQAALUJADDxBAAAPgAQ8gQAALUJADDzBAEA9wcAIf8EQADrBwAh9QUBAPcHACH4BQIA-gcAIYcGAQD3BwAhnAYBAOgHACGdBiAAoggAIZ4GAgDxCAAhnwYCAPEIACEDsgUAADQAILMFAAA0ACC0BQAANAAgAvEFAQAAAAHyBQEAAAABEBUAAJkJACAZAAC5CQAg8AQAALgJADDxBAAANAAQ8gQAALgJADDzBAEA9wcAIf8EQADrBwAh8QUBAPcHACHyBQEA9wcAIfMFIACiCAAh9AUBAOgHACH1BQEA6AcAIfYFAgDxCAAh9wUCAPEIACH4BQIA-gcAIfkFAQDoBwAhEAkAAOIIACAYAAC2CQAg8AQAALUJADDxBAAAPgAQ8gQAALUJADDzBAEA9wcAIf8EQADrBwAh9QUBAPcHACH4BQIA-gcAIYcGAQD3BwAhnAYBAOgHACGdBiAAoggAIZ4GAgDxCAAhnwYCAPEIACHyBgAAPgAg8wYAAD4AIAkQAADsBwAg8AQAALoJADDxBAAAKgAQ8gQAALoJADDzBAEA9wcAIfQEAQD3BwAhkgUAALsJ6QUiyAUAAOkHACDpBUAA6wcAIQSBBQAAAOkFAoIFAAAA6QUIgwUAAADpBQiIBQAAugjpBSIC9AQBAAAAAYcGAQAAAAESCQAA4ggAIBAAAOwHACAUAAC_CQAgFwAAwAkAIBoAALYJACDwBAAAvQkAMPEEAAAiABDyBAAAvQkAMPMEAQD3BwAh9AQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAL4JjAYihwYBAPcHACGIBgEA6AcAIYkGAQDoBwAhigYBAOgHACGMBkAA6gcAIQSBBQAAAIwGAoIFAAAAjAYIgwUAAACMBgiIBQAA0AiMBiIDsgUAABUAILMFAAAVACC0BQAAFQAgGRUAAJkJACAWAACTCQAg8AQAAJYJADDxBAAAMQAQ8gQAAJYJADDzBAEA9wcAIfwEAQDoBwAh_wRAAOsHACGABUAA6wcAIZgFAACXCf8FIsgFAADpBwAg8AVAAOoHACHxBQEA9wcAIfoFAQDoBwAh-wUCAPoHACH8BQIA-gcAIf0FAQDoBwAh_wUgAKIIACGABgIA8QgAIYEGAQDoBwAhggZAAOoHACGEBgAAmAmEBiKFBkAA6gcAIfIGAAAxACDzBgAAMQAgA-oFAQAAAAGNBgEAAAABjwYCAAAAARkIAACwCQAgCwAA8ggAIA4AAMQJACAPAACsCQAgEQAAxQkAIBIAAMYJACATAADHCQAg8AQAAMIJADDxBAAAHQAQ8gQAAMIJADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAwwmRBiK8BUAA6wcAIckFAQDoBwAhygUBAOgHACHqBQEA9wcAIYwGQADqBwAhjQYBAPcHACGOBgEA6AcAIY8GAgD6BwAhkQZAAOoHACGSBkAA6gcAIZMGAgD6BwAhBIEFAAAAkQYCggUAAACRBgiDBQAAAJEGCIgFAADUCJEGIhMIAACwCQAgCwAAkwkAIAwAALQJACDwBAAAsgkAMPEEAAAZABDyBAAAsgkAMPMEAQD3BwAhmAUAALMJlQYioAUBAPcHACG8BUAA6gcAIeoFAQD3BwAhjQYBAOgHACGVBgEA9wcAIZYGQADrBwAhlwZAAOoHACGYBkAA6gcAIZkGQADqBwAh8gYAABkAIPMGAAAZACASCAAAsAkAIBAAAOwHACDwBAAArQkAMPEEAAAmABDyBAAArQkAMPMEAQD3BwAh9AQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAK8J7wUi6gUBAPcHACHrBQIA-gcAIewFAgD6BwAh7QUIAK4JACHvBQIA8QgAIfAFQADqBwAh8gYAACYAIPMGAAAmACATEAAA7AcAIPAEAADmBwAw8QQAACgAEPIEAADmBwAw8wQBAPcHACH0BAEA9wcAIfYEAADnB_YEI_cEAQDoBwAh-AQBAOgHACH5BAAA6QcAIPoEAADpBwAg-wQBAOgHACH8BAEA6AcAIf0EQADqBwAh_gRAAOoHACH_BEAA6wcAIYAFQADrBwAh8gYAACgAIPMGAAAoACADsgUAACoAILMFAAAqACC0BQAAKgAgIQYAAKQJACAMAAC0CQAgIAAA0QkAICUAALYIACAmAADMCQAgJwAAzQkAICgAAM4JACApAADPCQAgKgAA0AkAICsAAPUIACAsAAD2CAAgLQAA0gkAIC4AANMJACAvAADUCQAgNgAAiwgAIDcAANUJACDwBAAAyAkAMPEEAAAbABDyBAAAyAkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADKCeAGIp8FAQD3BwAhoAUBAPcHACGxBUAA6gcAIc8FAADLCeEGIr0GAQDoBwAh3AYBAOgHACHeBgAAyQneBiLhBiAAoggAIeIGIACiCAAh4wZAAOoHACEEgQUAAADeBgKCBQAAAN4GCIMFAAAA3gYIiAUAAIcJ3gYiBIEFAAAA4AYCggUAAADgBgiDBQAAAOAGCIgFAACFCeAGIgSBBQAAAOEGAoIFAAAA4QYIgwUAAADhBgiIBQAAgwnhBiIDsgUAAGQAILMFAABkACC0BQAAZAAgA7IFAABoACCzBQAAaAAgtAUAAGgAIAOyBQAAbAAgswUAAGwAILQFAABsACADsgUAAHAAILMFAABwACC0BQAAcAAgFyMAAPIIACDwBAAA8AgAMPEEAAB0ABDyBAAA8AgAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIbEFQADqBwAhtwUBAPcHACG7BgEA6AcAIbwGAQDoBwAhvQYBAOgHACG-BgEA6AcAIb8GAQDoBwAhwAYBAOgHACHBBgEA6AcAIcIGAQDoBwAhwwYAAOkHACDEBgIA8QgAIcUGQADqBwAhxgYgAKIIACHyBgAAdAAg8wYAAHQAIAOyBQAAGQAgswUAABkAILQFAAAZACADsgUAADEAILMFAAAxACC0BQAAMQAgA7IFAAB-ACCzBQAAfgAgtAUAAH4AIAOyBQAAggEAILMFAACCAQAgtAUAAIIBACADsgUAAJQBACCzBQAAlAEAILQFAACUAQAgAvEFAQAAAAGGBgEAAAABCRUAAJkJACAbAADYCQAg8AQAANcJADDxBAAAFQAQ8gQAANcJADDzBAEA9wcAIf8EQADrBwAh8QUBAPcHACGGBgEA9wcAIQwKAADbCQAgHAAAvwkAIPAEAADaCQAw8QQAABEAEPIEAADaCQAw8wQBAPcHACGaBgIA-gcAIaAGAQD3BwAhoQYBAPcHACGiBiAAoggAIfIGAAARACDzBgAAEQAgApoGAgAAAAGgBgEAAAABCgoAANsJACAcAAC_CQAg8AQAANoJADDxBAAAEQAQ8gQAANoJADDzBAEA9wcAIZoGAgD6BwAhoAYBAPcHACGhBgEA9wcAIaIGIACiCAAhCwkAAOIIACAdAADjCAAg8AQAAOAIADDxBAAADwAQ8gQAAOAIADDzBAEA9wcAIcwFAADhCKQGIocGAQD3BwAhpAYBAOgHACHyBgAADwAg8wYAAA8AIALqBQEAAAABhwYBAAAAAQLqBQEAAAABmgYCAAAAAQsIAACwCQAgCQAA4ggAIPAEAADeCQAw8QQAAAsAEPIEAADeCQAw8wQBAPcHACH_BEAA6wcAIeoFAQD3BwAhhwYBAPcHACGaBgIA-gcAIZsGAgD6BwAhA6gFAQAAAAHVBQEAAAABuAYCAAAAASMEAADiCQAgBQAA9QgAIAYAALUIACAHAADyCAAgDAAAtAkAIBgAAOMJACAfAACrCQAgIAAA0QkAIPAEAADgCQAw8QQAAAUAEPIEAADgCQAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAOEJswYipwUBAPcHACGoBQEA9wcAIa4FQADqBwAhsQVAAOoHACG1BQEA6AcAIdUFAQD3BwAh7AUCAPoHACGsBgEA9wcAIa4GAQDoBwAhrwYCAPoHACGwBgIA-gcAIbEGAgD6BwAhswZAAOoHACG0BkAA6gcAIbUGIACiCAAhtgYgAKIIACG3BiAAoggAIbgGAgD6BwAhuQYgAKIIACG6BgEA6AcAIQSBBQAAALMGAoIFAAAAswYIgwUAAACzBgiIBQAA7gizBiIlBAAA4gkAIAUAAPUIACAGAAC1CAAgBwAA8ggAIAwAALQJACAYAADjCQAgHwAAqwkAICAAANEJACDwBAAA4AkAMPEEAAAFABDyBAAA4AkAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADhCbMGIqcFAQD3BwAhqAUBAPcHACGuBUAA6gcAIbEFQADqBwAhtQUBAOgHACHVBQEA9wcAIewFAgD6BwAhrAYBAPcHACGuBgEA6AcAIa8GAgD6BwAhsAYCAPoHACGxBgIA-gcAIbMGQADqBwAhtAZAAOoHACG1BiAAoggAIbYGIACiCAAhtwYgAKIIACG4BgIA-gcAIbkGIACiCAAhugYBAOgHACHyBgAABQAg8wYAAAUAIAOyBQAAJgAgswUAACYAILQFAAAmACAAAAAAAfcGAQAAAAEB9wYAAAD2BAMB9wYBAAAAAQH3BkAAAAABAfcGQAAAAAEFRAAAmBIAIEUAAJsSACD0BgAAmRIAIPUGAACaEgAg-gYAAB8AIANEAACYEgAg9AYAAJkSACD6BgAAHwAgDQgAAJEQACALAADyDQAgDgAAlhAAIA8AAJAQACARAACXEAAgEgAAmBAAIBMAAJkQACDJBQAA5AkAIMoFAADkCQAgjAYAAOQJACCOBgAA5AkAIJEGAADkCQAgkgYAAOQJACAAAAAAAAH3BgAAAJgFAgX3BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAAAABgAcCAAAAAQAAAAH3BgAAAKQFAgAAAAVEAACQEgAgRQAAlhIAIPQGAACREgAg9QYAAJUSACD6BgAAiQEAIAVEAACOEgAgRQAAkxIAIPQGAACPEgAg9QYAAJISACD6BgAAwwYAIANEAACQEgAg9AYAAJESACD6BgAAiQEAIANEAACOEgAg9AYAAI8SACD6BgAAwwYAIAAAAAAAAfcGAAAArQUCBUQAAIUSACBFAACMEgAg9AYAAIYSACD1BgAAixIAIPoGAAABACAFRAAAgxIAIEUAAIkSACD0BgAAhBIAIPUGAACIEgAg-gYAAKoGACALRAAAiwoAMEUAAJAKADD0BgAAjAoAMPUGAACNCgAw9gYAAI4KACD3BgAAjwoAMPgGAACPCgAw-QYAAI8KADD6BgAAjwoAMPsGAACRCgAw_AYAAJIKADACNAAAgQoAIKYFAQAAAAECAAAAjwEAIEQAAJYKACADAAAAjwEAIEQAAJYKACBFAACVCgAgAT0AAIcSADAIMwAAjAkAIDQAAI0JACDwBAAAiwkAMPEEAACNAQAQ8gQAAIsJADClBQEA9wcAIaYFAQD3BwAh5QYAAIoJACACAAAAjwEAID0AAJUKACACAAAAkwoAID0AAJQKACAF8AQAAJIKADDxBAAAkwoAEPIEAACSCgAwpQUBAPcHACGmBQEA9wcAIQXwBAAAkgoAMPEEAACTCgAQ8gQAAJIKADClBQEA9wcAIaYFAQD3BwAhAaYFAQDoCQAhAjQAAP8JACCmBQEA6AkAIQI0AACBCgAgpgUBAAAAAQNEAACFEgAg9AYAAIYSACD6BgAAAQAgA0QAAIMSACD0BgAAhBIAIPoGAACqBgAgBEQAAIsKADD0BgAAjAoAMPYGAACOCgAg-gYAAI8KADAAAAALRAAAngoAMEUAAKIKADD0BgAAnwoAMPUGAACgCgAw9gYAAKEKACD3BgAAjwoAMPgGAACPCgAw-QYAAI8KADD6BgAAjwoAMPsGAACjCgAw_AYAAJIKADACMwAAgAoAIKUFAQAAAAECAAAAjwEAIEQAAKYKACADAAAAjwEAIEQAAKYKACBFAAClCgAgAT0AAIISADACAAAAjwEAID0AAKUKACACAAAAkwoAID0AAKQKACABpQUBAOgJACECMwAA_gkAIKUFAQDoCQAhAjMAAIAKACClBQEAAAABBEQAAJ4KADD0BgAAnwoAMPYGAAChCgAg-gYAAI8KADAAAAAAC0QAAK0KADBFAACyCgAw9AYAAK4KADD1BgAArwoAMPYGAACwCgAg9wYAALEKADD4BgAAsQoAMPkGAACxCgAw-gYAALEKADD7BgAAswoAMPwGAAC0CgAwDzAAAJcKACA1AACZCgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACtBQKnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAa0FAgAAAAGuBUAAAAABrwUBAAAAAbEFQAAAAAECAAAAiQEAIEQAALgKACADAAAAiQEAIEQAALgKACBFAAC3CgAgAT0AAIESADAUMAAA8ggAIDIAAJAJACA1AACICAAg8AQAAI4JADDxBAAAhwEAEPIEAACOCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGYBQAAjwmtBSKnBQEA9wcAIagFAQAAAAGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAhAgAAAIkBACA9AAC3CgAgAgAAALUKACA9AAC2CgAgEfAEAAC0CgAw8QQAALUKABDyBAAAtAoAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAPcHACGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAhEfAEAAC0CgAw8QQAALUKABDyBAAAtAoAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACPCa0FIqcFAQD3BwAhqAUBAPcHACGpBQEA9wcAIaoFAQD3BwAhqwUBAOgHACGtBQIA-gcAIa4FQADqBwAhrwUBAPcHACGwBQEA9wcAIbEFQADqBwAhDfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACHCq0FIqcFAQDoCQAhqAUBAOgJACGpBQEA6AkAIaoFAQDoCQAhqwUBAOoJACGtBQIA9gkAIa4FQADrCQAhrwUBAOgJACGxBUAA6wkAIQ8wAACICgAgNQAAigoAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACHCq0FIqcFAQDoCQAhqAUBAOgJACGpBQEA6AkAIaoFAQDoCQAhqwUBAOoJACGtBQIA9gkAIa4FQADrCQAhrwUBAOgJACGxBUAA6wkAIQ8wAACXCgAgNQAAmQoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAArQUCpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGtBQIAAAABrgVAAAAAAa8FAQAAAAGxBUAAAAABBEQAAK0KADD0BgAArgoAMPYGAACwCgAg-gYAALEKADAAAAAAAAAFRAAA_BEAIEUAAP8RACD0BgAA_REAIPUGAAD-EQAg-gYAAAEAIANEAAD8EQAg9AYAAP0RACD6BgAAAQAgAAAAAfcGAAAAvgUCAfcGIAAAAAEFRAAA9xEAIEUAAPoRACD0BgAA-BEAIPUGAAD5EQAg-gYAAAEAIANEAAD3EQAg9AYAAPgRACD6BgAAAQAgAAAAAfcGAAAAwwUCB0QAAPIRACBFAAD1EQAg9AYAAPMRACD1BgAA9BEAIPgGAAAbACD5BgAAGwAg-gYAAAEAIANEAADyEQAg9AYAAPMRACD6BgAAAQAgAAAAAfcGAAAAzAUCBUQAAO0RACBFAADwEQAg9AYAAO4RACD1BgAA7xEAIPoGAAABACADRAAA7REAIPQGAADuEQAg-gYAAAEAIAAAAAAAAfcGAAAAzwUCAAAAAAAB9wYAAADYBQIF9wYEAAAAAf0GBAAAAAH-BgQAAAAB_wYEAAAAAYAHBAAAAAEFRAAA4hEAIEUAAOsRACD0BgAA4xEAIPUGAADqEQAg-gYAAAEAIAdEAADgEQAgRQAA6BEAIPQGAADhEQAg9QYAAOcRACD4BgAAAwAg-QYAAAMAIPoGAACXAgAgB0QAAN4RACBFAADlEQAg9AYAAN8RACD1BgAA5BEAIPgGAABXACD5BgAAVwAg-gYAAIUFACADRAAA4hEAIPQGAADjEQAg-gYAAAEAIANEAADgEQAg9AYAAOERACD6BgAAlwIAIANEAADeEQAg9AYAAN8RACD6BgAAhQUAIAAAAAH3BgAAAOAFAgH3BgAAAOIFAgVEAADYEQAgRQAA3BEAIPQGAADZEQAg9QYAANsRACD6BgAAlwIAIAtEAADvCgAwRQAA9AoAMPQGAADwCgAw9QYAAPEKADD2BgAA8goAIPcGAADzCgAw-AYAAPMKADD5BgAA8woAMPoGAADzCgAw-wYAAPUKADD8BgAA9goAMBEGAADmCgAgIwAA5QoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA2AUCtwUBAAAAAcgFgAAAAAHPBQAAAM8FAtUFAQAAAAHYBQQAAAAB2QUBAAAAAdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FQAAAAAHeBUAAAAABAgAAAFsAIEQAAPoKACADAAAAWwAgRAAA-goAIEUAAPkKACABPQAA2hEAMBYGAACkCQAgIwAA8ggAICQAAPcIACDwBAAAoQkAMPEEAABZABDyBAAAoQkAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhmAUAAKIJ2AUitwUBAPcHACHIBQAA6QcAIM8FAAChCM8FItUFAQDoBwAh1gUBAOgHACHYBQQAowkAIdkFAQD3BwAh2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QVAAOoHACHeBUAA6gcAIQIAAABbACA9AAD5CgAgAgAAAPcKACA9AAD4CgAgE_AEAAD2CgAw8QQAAPcKABDyBAAA9goAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAACiCdgFIrcFAQD3BwAhyAUAAOkHACDPBQAAoQjPBSLVBQEA6AcAIdYFAQDoBwAh2AUEAKMJACHZBQEA9wcAIdoFAQDoBwAh2wUBAOgHACHcBQEA6AcAId0FQADqBwAh3gVAAOoHACET8AQAAPYKADDxBAAA9woAEPIEAAD2CgAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAKIJ2AUitwUBAPcHACHIBQAA6QcAIM8FAAChCM8FItUFAQDoBwAh1gUBAOgHACHYBQQAowkAIdkFAQD3BwAh2gUBAOgHACHbBQEA6AcAIdwFAQDoBwAh3QVAAOoHACHeBUAA6gcAIQ_zBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA4ArYBSK3BQEA6AkAIcgFgAAAAAHPBQAA2grPBSLVBQEA6gkAIdgFBADhCgAh2QUBAOgJACHaBQEA6gkAIdsFAQDqCQAh3AUBAOoJACHdBUAA6wkAId4FQADrCQAhEQYAAOMKACAjAADiCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAOAK2AUitwUBAOgJACHIBYAAAAABzwUAANoKzwUi1QUBAOoJACHYBQQA4QoAIdkFAQDoCQAh2gUBAOoJACHbBQEA6gkAIdwFAQDqCQAh3QVAAOsJACHeBUAA6wkAIREGAADmCgAgIwAA5QoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA2AUCtwUBAAAAAcgFgAAAAAHPBQAAAM8FAtUFAQAAAAHYBQQAAAAB2QUBAAAAAdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FQAAAAAHeBUAAAAABA0QAANgRACD0BgAA2REAIPoGAACXAgAgBEQAAO8KADD0BgAA8AoAMPYGAADyCgAg-gYAAPMKADAKAQAA8g0AICEAAKMOACAiAACkDgAgJAAApQ4AICUAAP4KACCxBQAA5AkAILUFAADkCQAgxwYAAOQJACDIBgAA5AkAIMkGAADkCQAgAAAAAAH3BgAAAOkFAgVEAADTEQAgRQAA1hEAIPQGAADUEQAg9QYAANURACD6BgAAHwAgA0QAANMRACD0BgAA1BEAIPoGAAAfACAAAAAAAAX3BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAAAABgAcIAAAAAQH3BgAAAO8FAgX3BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAAAABgAcCAAAAAQVEAADLEQAgRQAA0REAIPQGAADMEQAg9QYAANARACD6BgAAHwAgBUQAAMkRACBFAADOEQAg9AYAAMoRACD1BgAAzREAIPoGAAAHACADRAAAyxEAIPQGAADMEQAg-gYAAB8AIANEAADJEQAg9AYAAMoRACD6BgAABwAgAAAAAAAFRAAAwREAIEUAAMcRACD0BgAAwhEAIPUGAADGEQAg-gYAACQAIAVEAAC_EQAgRQAAxBEAIPQGAADAEQAg9QYAAMMRACD6BgAAQAAgA0QAAMERACD0BgAAwhEAIPoGAAAkACADRAAAvxEAIPQGAADAEQAg-gYAAEAAIAAAAAAAAfcGAAAA_wUCAfcGAAAAhAYCBUQAALcRACBFAAC9EQAg9AYAALgRACD1BgAAvBEAIPoGAAAkACAHRAAAtREAIEUAALoRACD0BgAAthEAIPUGAAC5EQAg-AYAABsAIPkGAAAbACD6BgAAAQAgA0QAALcRACD0BgAAuBEAIPoGAAAkACADRAAAtREAIPQGAAC2EQAg-gYAAAEAIAAAAAVEAACtEQAgRQAAsxEAIPQGAACuEQAg9QYAALIRACD6BgAAJAAgBUQAAKsRACBFAACwEQAg9AYAAKwRACD1BgAArxEAIPoGAAATACADRAAArREAIPQGAACuEQAg-gYAACQAIANEAACrEQAg9AYAAKwRACD6BgAAEwAgAAAAAfcGAAAAjAYCBUQAAKERACBFAACpEQAg9AYAAKIRACD1BgAAqBEAIPoGAAAfACAFRAAAnxEAIEUAAKYRACD0BgAAoBEAIPUGAAClEQAg-gYAAFUAIAtEAADGCwAwRQAAywsAMPQGAADHCwAw9QYAAMgLADD2BgAAyQsAIPcGAADKCwAw-AYAAMoLADD5BgAAygsAMPoGAADKCwAw-wYAAMwLADD8BgAAzQsAMAdEAADBCwAgRQAAxAsAIPQGAADCCwAg9QYAAMMLACD4BgAAMQAg-QYAADEAIPoGAAB7ACALRAAAtQsAMEUAALoLADD0BgAAtgsAMPUGAAC3CwAw9gYAALgLACD3BgAAuQsAMPgGAAC5CwAw-QYAALkLADD6BgAAuQsAMPsGAAC7CwAw_AYAALwLADALGQAAmQsAIPMEAQAAAAH_BEAAAAAB8gUBAAAAAfMFIAAAAAH0BQEAAAAB9QUBAAAAAfYFAgAAAAH3BQIAAAAB-AUCAAAAAfkFAQAAAAECAAAANgAgRAAAwAsAIAMAAAA2ACBEAADACwAgRQAAvwsAIAE9AACkEQAwERUAAJkJACAZAAC5CQAg8AQAALgJADDxBAAANAAQ8gQAALgJADDzBAEAAAAB_wRAAOsHACHxBQEA9wcAIfIFAQD3BwAh8wUgAKIIACH0BQEA6AcAIfUFAQDoBwAh9gUCAPEIACH3BQIA8QgAIfgFAgD6BwAh-QUBAOgHACHqBgAAtwkAIAIAAAA2ACA9AAC_CwAgAgAAAL0LACA9AAC-CwAgDvAEAAC8CwAw8QQAAL0LABDyBAAAvAsAMPMEAQD3BwAh_wRAAOsHACHxBQEA9wcAIfIFAQD3BwAh8wUgAKIIACH0BQEA6AcAIfUFAQDoBwAh9gUCAPEIACH3BQIA8QgAIfgFAgD6BwAh-QUBAOgHACEO8AQAALwLADDxBAAAvQsAEPIEAAC8CwAw8wQBAPcHACH_BEAA6wcAIfEFAQD3BwAh8gUBAPcHACHzBSAAoggAIfQFAQDoBwAh9QUBAOgHACH2BQIA8QgAIfcFAgDxCAAh-AUCAPoHACH5BQEA6AcAIQrzBAEA6AkAIf8EQADsCQAh8gUBAOgJACHzBSAAxgoAIfQFAQDqCQAh9QUBAOoJACH2BQIAjAsAIfcFAgCMCwAh-AUCAPYJACH5BQEA6gkAIQsZAACXCwAg8wQBAOgJACH_BEAA7AkAIfIFAQDoCQAh8wUgAMYKACH0BQEA6gkAIfUFAQDqCQAh9gUCAIwLACH3BQIAjAsAIfgFAgD2CQAh-QUBAOoJACELGQAAmQsAIPMEAQAAAAH_BEAAAAAB8gUBAAAAAfMFIAAAAAH0BQEAAAAB9QUBAAAAAfYFAgAAAAH3BQIAAAAB-AUCAAAAAfkFAQAAAAESFgAApAsAIPMEAQAAAAH8BAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAP8FAsgFgAAAAAHwBUAAAAAB-gUBAAAAAfsFAgAAAAH8BQIAAAAB_QUBAAAAAf8FIAAAAAGABgIAAAABgQYBAAAAAYIGQAAAAAGEBgAAAIQGAoUGQAAAAAECAAAAewAgRAAAwQsAIAMAAAAxACBEAADBCwAgRQAAxQsAIBQAAAAxACAWAACiCwAgPQAAxQsAIPMEAQDoCQAh_AQBAOoJACH_BEAA7AkAIYAFQADsCQAhmAUAAJ8L_wUiyAWAAAAAAfAFQADrCQAh-gUBAOoJACH7BQIA9gkAIfwFAgD2CQAh_QUBAOoJACH_BSAAxgoAIYAGAgCMCwAhgQYBAOoJACGCBkAA6wkAIYQGAACgC4QGIoUGQADrCQAhEhYAAKILACDzBAEA6AkAIfwEAQDqCQAh_wRAAOwJACGABUAA7AkAIZgFAACfC_8FIsgFgAAAAAHwBUAA6wkAIfoFAQDqCQAh-wUCAPYJACH8BQIA9gkAIf0FAQDqCQAh_wUgAMYKACGABgIAjAsAIYEGAQDqCQAhggZAAOsJACGEBgAAoAuEBiKFBkAA6wkAIQQbAACrCwAg8wQBAAAAAf8EQAAAAAGGBgEAAAABAgAAABcAIEQAANELACADAAAAFwAgRAAA0QsAIEUAANALACABPQAAoxEAMAoVAACZCQAgGwAA2AkAIPAEAADXCQAw8QQAABUAEPIEAADXCQAw8wQBAAAAAf8EQADrBwAh8QUBAPcHACGGBgEA9wcAIe0GAADWCQAgAgAAABcAID0AANALACACAAAAzgsAID0AAM8LACAH8AQAAM0LADDxBAAAzgsAEPIEAADNCwAw8wQBAPcHACH_BEAA6wcAIfEFAQD3BwAhhgYBAPcHACEH8AQAAM0LADDxBAAAzgsAEPIEAADNCwAw8wQBAPcHACH_BEAA6wcAIfEFAQD3BwAhhgYBAPcHACED8wQBAOgJACH_BEAA7AkAIYYGAQDoCQAhBBsAAKkLACDzBAEA6AkAIf8EQADsCQAhhgYBAOgJACEEGwAAqwsAIPMEAQAAAAH_BEAAAAABhgYBAAAAAQNEAAChEQAg9AYAAKIRACD6BgAAHwAgA0QAAJ8RACD0BgAAoBEAIPoGAABVACAERAAAxgsAMPQGAADHCwAw9gYAAMkLACD6BgAAygsAMANEAADBCwAg9AYAAMILACD6BgAAewAgBEQAALULADD0BgAAtgsAMPYGAAC4CwAg-gYAALkLADAAAAAAAAH3BgAAAJEGAgVEAACSEQAgRQAAnREAIPQGAACTEQAg9QYAAJwRACD6BgAABwAgBUQAAJARACBFAACaEQAg9AYAAJERACD1BgAAmREAIPoGAAABACAHRAAAjhEAIEUAAJcRACD0BgAAjxEAIPUGAACWEQAg-AYAABkAIPkGAAAZACD6BgAASAAgC0QAAPoLADBFAAD_CwAw9AYAAPsLADD1BgAA_AsAMPYGAAD9CwAg9wYAAP4LADD4BgAA_gsAMPkGAAD-CwAw-gYAAP4LADD7BgAAgAwAMPwGAACBDAAwB0QAAPULACBFAAD4CwAg9AYAAPYLACD1BgAA9wsAIPgGAAAmACD5BgAAJgAg-gYAAEwAIAdEAADwCwAgRQAA8wsAIPQGAADxCwAg9QYAAPILACD4BgAAKAAg-QYAACgAIPoGAAC6BwAgC0QAAOQLADBFAADpCwAw9AYAAOULADD1BgAA5gsAMPYGAADnCwAg9wYAAOgLADD4BgAA6AsAMPkGAADoCwAw-gYAAOgLADD7BgAA6gsAMPwGAADrCwAwBPMEAQAAAAGSBQAAAOkFAsgFgAAAAAHpBUAAAAABAgAAACwAIEQAAO8LACADAAAALAAgRAAA7wsAIEUAAO4LACABPQAAlREAMAkQAADsBwAg8AQAALoJADDxBAAAKgAQ8gQAALoJADDzBAEAAAAB9AQBAPcHACGSBQAAuwnpBSLIBQAA6QcAIOkFQADrBwAhAgAAACwAID0AAO4LACACAAAA7AsAID0AAO0LACAI8AQAAOsLADDxBAAA7AsAEPIEAADrCwAw8wQBAPcHACH0BAEA9wcAIZIFAAC7CekFIsgFAADpBwAg6QVAAOsHACEI8AQAAOsLADDxBAAA7AsAEPIEAADrCwAw8wQBAPcHACH0BAEA9wcAIZIFAAC7CekFIsgFAADpBwAg6QVAAOsHACEE8wQBAOgJACGSBQAAggvpBSLIBYAAAAAB6QVAAOwJACEE8wQBAOgJACGSBQAAggvpBSLIBYAAAAAB6QVAAOwJACEE8wQBAAAAAZIFAAAA6QUCyAWAAAAAAekFQAAAAAEM8wQBAAAAAfYEAAAA9gQD9wQBAAAAAfgEAQAAAAH5BIAAAAAB-gSAAAAAAfsEAQAAAAH8BAEAAAAB_QRAAAAAAf4EQAAAAAH_BEAAAAABgAVAAAAAAQIAAAC6BwAgRAAA8AsAIAMAAAAoACBEAADwCwAgRQAA9AsAIA4AAAAoACA9AAD0CwAg8wQBAOgJACH2BAAA6Qn2BCP3BAEA6gkAIfgEAQDqCQAh-QSAAAAAAfoEgAAAAAH7BAEA6gkAIfwEAQDqCQAh_QRAAOsJACH-BEAA6wkAIf8EQADsCQAhgAVAAOwJACEM8wQBAOgJACH2BAAA6Qn2BCP3BAEA6gkAIfgEAQDqCQAh-QSAAAAAAfoEgAAAAAH7BAEA6gkAIfwEAQDqCQAh_QRAAOsJACH-BEAA6wkAIf8EQADsCQAhgAVAAOwJACELCAAAkAsAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA7wUC6gUBAAAAAesFAgAAAAHsBQIAAAAB7QUIAAAAAe8FAgAAAAHwBUAAAAABAgAAAEwAIEQAAPULACADAAAAJgAgRAAA9QsAIEUAAPkLACANAAAAJgAgCAAAjgsAID0AAPkLACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAiwvvBSLqBQEA6AkAIesFAgD2CQAh7AUCAPYJACHtBQgAigsAIe8FAgCMCwAh8AVAAOsJACELCAAAjgsAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACLC-8FIuoFAQDoCQAh6wUCAPYJACHsBQIA9gkAIe0FCACKCwAh7wUCAIwLACHwBUAA6wkAIQ0JAADTCwAgFAAA1AsAIBcAANULACAaAADWCwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACMBgKHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABjAZAAAAAAQIAAAAkACBEAACFDAAgAwAAACQAIEQAAIUMACBFAACEDAAgAT0AAJQRADATCQAA4ggAIBAAAOwHACAUAAC_CQAgFwAAwAkAIBoAALYJACDwBAAAvQkAMPEEAAAiABDyBAAAvQkAMPMEAQAAAAH0BAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAvgmMBiKHBgEA9wcAIYgGAQDoBwAhiQYBAOgHACGKBgEA6AcAIYwGQADqBwAh6wYAALwJACACAAAAJAAgPQAAhAwAIAIAAACCDAAgPQAAgwwAIA3wBAAAgQwAMPEEAACCDAAQ8gQAAIEMADDzBAEA9wcAIfQEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAAC-CYwGIocGAQD3BwAhiAYBAOgHACGJBgEA6AcAIYoGAQDoBwAhjAZAAOoHACEN8AQAAIEMADDxBAAAggwAEPIEAACBDAAw8wQBAPcHACH0BAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAAvgmMBiKHBgEA9wcAIYgGAQDoBwAhiQYBAOgHACGKBgEA6AcAIYwGQADqBwAhCfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIocGAQDoCQAhiAYBAOoJACGJBgEA6gkAIYoGAQDqCQAhjAZAAOsJACENCQAAsQsAIBQAALILACAXAACzCwAgGgAAtAsAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIocGAQDoCQAhiAYBAOoJACGJBgEA6gkAIYoGAQDqCQAhjAZAAOsJACENCQAA0wsAIBQAANQLACAXAADVCwAgGgAA1gsAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAjAYChwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYwGQAAAAAEDRAAAkhEAIPQGAACTEQAg-gYAAAcAIANEAACQEQAg9AYAAJERACD6BgAAAQAgA0QAAI4RACD0BgAAjxEAIPoGAABIACAERAAA-gsAMPQGAAD7CwAw9gYAAP0LACD6BgAA_gsAMANEAAD1CwAg9AYAAPYLACD6BgAATAAgA0QAAPALACD0BgAA8QsAIPoGAAC6BwAgBEQAAOQLADD0BgAA5QsAMPYGAADnCwAg-gYAAOgLADAAAAAB9wYAAACVBgIFRAAAhREAIEUAAIwRACD0BgAAhhEAIPUGAACLEQAg-gYAAAcAIAdEAACDEQAgRQAAiREAIPQGAACEEQAg9QYAAIgRACD4BgAAGwAg-QYAABsAIPoGAAABACALRAAAlAwAMEUAAJkMADD0BgAAlQwAMPUGAACWDAAw9gYAAJcMACD3BgAAmAwAMPgGAACYDAAw-QYAAJgMADD6BgAAmAwAMPsGAACaDAAw_AYAAJsMADAUCAAAhgwAIAsAAIcMACAPAACJDAAgEQAAigwAIBIAAIsMACATAACMDAAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACRBgK8BUAAAAAByQUBAAAAAcoFAQAAAAHqBQEAAAABjAZAAAAAAY0GAQAAAAGPBgIAAAABkQZAAAAAAZIGQAAAAAGTBgIAAAABAgAAAB8AIEQAAJ8MACADAAAAHwAgRAAAnwwAIEUAAJ4MACABPQAAhxEAMBoIAACwCQAgCwAA8ggAIA4AAMQJACAPAACsCQAgEQAAxQkAIBIAAMYJACATAADHCQAg8AQAAMIJADDxBAAAHQAQ8gQAAMIJADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIZgFAADDCZEGIrwFQADrBwAhyQUBAOgHACHKBQEA6AcAIeoFAQD3BwAhjAZAAOoHACGNBgEA9wcAIY4GAQDoBwAhjwYCAPoHACGRBkAA6gcAIZIGQADqBwAhkwYCAPoHACHsBgAAwQkAIAIAAAAfACA9AACeDAAgAgAAAJwMACA9AACdDAAgEvAEAACbDAAw8QQAAJwMABDyBAAAmwwAMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADDCZEGIrwFQADrBwAhyQUBAOgHACHKBQEA6AcAIeoFAQD3BwAhjAZAAOoHACGNBgEA9wcAIY4GAQDoBwAhjwYCAPoHACGRBkAA6gcAIZIGQADqBwAhkwYCAPoHACES8AQAAJsMADDxBAAAnAwAEPIEAACbDAAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhmAUAAMMJkQYivAVAAOsHACHJBQEA6AcAIcoFAQDoBwAh6gUBAPcHACGMBkAA6gcAIY0GAQD3BwAhjgYBAOgHACGPBgIA-gcAIZEGQADqBwAhkgZAAOoHACGTBgIA-gcAIQ7zBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACHqBQEA6AkAIYwGQADrCQAhjQYBAOgJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRQIAADdCwAgCwAA3gsAIA8AAOALACARAADhCwAgEgAA4gsAIBMAAOMLACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACHqBQEA6AkAIYwGQADrCQAhjQYBAOgJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRQIAACGDAAgCwAAhwwAIA8AAIkMACARAACKDAAgEgAAiwwAIBMAAIwMACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAeoFAQAAAAGMBkAAAAABjQYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAEDRAAAhREAIPQGAACGEQAg-gYAAAcAIANEAACDEQAg9AYAAIQRACD6BgAAAQAgBEQAAJQMADD0BgAAlQwAMPYGAACXDAAg-gYAAJgMADAAAAAAAAVEAAD7EAAgRQAAgREAIPQGAAD8EAAg9QYAAIARACD6BgAABwAgBUQAAPkQACBFAAD-EAAg9AYAAPoQACD1BgAA_RAAIPoGAABVACADRAAA-xAAIPQGAAD8EAAg-gYAAAcAIANEAAD5EAAg9AYAAPoQACD6BgAAVQAgAAAAAAAFRAAA8xAAIEUAAPcQACD0BgAA9BAAIPUGAAD2EAAg-gYAAFUAIAtEAACzDAAwRQAAtwwAMPQGAAC0DAAw9QYAALUMADD2BgAAtgwAIPcGAAC5CwAw-AYAALkLADD5BgAAuQsAMPoGAAC5CwAw-wYAALgMADD8BgAAvAsAMAsVAACYCwAg8wQBAAAAAf8EQAAAAAHxBQEAAAAB8wUgAAAAAfQFAQAAAAH1BQEAAAAB9gUCAAAAAfcFAgAAAAH4BQIAAAAB-QUBAAAAAQIAAAA2ACBEAAC7DAAgAwAAADYAIEQAALsMACBFAAC6DAAgAT0AAPUQADACAAAANgAgPQAAugwAIAIAAAC9CwAgPQAAuQwAIArzBAEA6AkAIf8EQADsCQAh8QUBAOgJACHzBSAAxgoAIfQFAQDqCQAh9QUBAOoJACH2BQIAjAsAIfcFAgCMCwAh-AUCAPYJACH5BQEA6gkAIQsVAACWCwAg8wQBAOgJACH_BEAA7AkAIfEFAQDoCQAh8wUgAMYKACH0BQEA6gkAIfUFAQDqCQAh9gUCAIwLACH3BQIAjAsAIfgFAgD2CQAh-QUBAOoJACELFQAAmAsAIPMEAQAAAAH_BEAAAAAB8QUBAAAAAfMFIAAAAAH0BQEAAAAB9QUBAAAAAfYFAgAAAAH3BQIAAAAB-AUCAAAAAfkFAQAAAAEDRAAA8xAAIPQGAAD0EAAg-gYAAFUAIAREAACzDAAw9AYAALQMADD2BgAAtgwAIPoGAAC5CwAwAAAAAAAFRAAA7RAAIEUAAPEQACD0BgAA7hAAIPUGAADwEAAg-gYAAPUCACALRAAAxQwAMEUAAMkMADD0BgAAxgwAMPUGAADHDAAw9gYAAMgMACD3BgAAygsAMPgGAADKCwAw-QYAAMoLADD6BgAAygsAMPsGAADKDAAw_AYAAM0LADAEFQAAqgsAIPMEAQAAAAH_BEAAAAAB8QUBAAAAAQIAAAAXACBEAADNDAAgAwAAABcAIEQAAM0MACBFAADMDAAgAT0AAO8QADACAAAAFwAgPQAAzAwAIAIAAADOCwAgPQAAywwAIAPzBAEA6AkAIf8EQADsCQAh8QUBAOgJACEEFQAAqAsAIPMEAQDoCQAh_wRAAOwJACHxBQEA6AkAIQQVAACqCwAg8wQBAAAAAf8EQAAAAAHxBQEAAAABA0QAAO0QACD0BgAA7hAAIPoGAAD1AgAgBEQAAMUMADD0BgAAxgwAMPYGAADIDAAg-gYAAMoLADAAAAAB9wYAAACkBgIFRAAA5xAAIEUAAOsQACD0BgAA6BAAIPUGAADqEAAg-gYAAFUAIAtEAADWDAAwRQAA2wwAMPQGAADXDAAw9QYAANgMADD2BgAA2QwAIPcGAADaDAAw-AYAANoMADD5BgAA2gwAMPoGAADaDAAw-wYAANwMADD8BgAA3QwAMAUcAADPDAAg8wQBAAAAAZoGAgAAAAGhBgEAAAABogYgAAAAAQIAAAATACBEAADhDAAgAwAAABMAIEQAAOEMACBFAADgDAAgAT0AAOkQADALCgAA2wkAIBwAAL8JACDwBAAA2gkAMPEEAAARABDyBAAA2gkAMPMEAQAAAAGaBgIA-gcAIaAGAQD3BwAhoQYBAPcHACGiBiAAoggAIe4GAADZCQAgAgAAABMAID0AAOAMACACAAAA3gwAID0AAN8MACAI8AQAAN0MADDxBAAA3gwAEPIEAADdDAAw8wQBAPcHACGaBgIA-gcAIaAGAQD3BwAhoQYBAPcHACGiBiAAoggAIQjwBAAA3QwAMPEEAADeDAAQ8gQAAN0MADDzBAEA9wcAIZoGAgD6BwAhoAYBAPcHACGhBgEA9wcAIaIGIACiCAAhBPMEAQDoCQAhmgYCAPYJACGhBgEA6AkAIaIGIADGCgAhBRwAAMQMACDzBAEA6AkAIZoGAgD2CQAhoQYBAOgJACGiBiAAxgoAIQUcAADPDAAg8wQBAAAAAZoGAgAAAAGhBgEAAAABogYgAAAAAQNEAADnEAAg9AYAAOgQACD6BgAAVQAgBEQAANYMADD0BgAA1wwAMPYGAADZDAAg-gYAANoMADAJBgAA_QoAIAcAAPINACAKAACNEAAgDwAAkBAAIB4AAI4QACAfAACPEAAgsQUAAOQJACCoBgAA5AkAIKsGAADkCQAgAAAAAAAAAfcGAAAApgYCAfcGAAAApwYCBUQAANwQACBFAADlEAAg9AYAAN0QACD1BgAA5BAAIPoGAACXAgAgBUQAANoQACBFAADiEAAg9AYAANsQACD1BgAA4RAAIPoGAAABACAHRAAAlA0AIEUAAJcNACD0BgAAlQ0AIPUGAACWDQAg-AYAAA8AIPkGAAAPACD6BgAA9QIAIAtEAACIDQAwRQAAjQ0AMPQGAACJDQAw9QYAAIoNADD2BgAAiw0AIPcGAACMDQAw-AYAAIwNADD5BgAAjA0AMPoGAACMDQAw-wYAAI4NADD8BgAAjw0AMAtEAAD8DAAwRQAAgQ0AMPQGAAD9DAAw9QYAAP4MADD2BgAA_wwAIPcGAACADQAw-AYAAIANADD5BgAAgA0AMPoGAACADQAw-wYAAIINADD8BgAAgw0AMAtEAADzDAAwRQAA9wwAMPQGAAD0DAAw9QYAAPUMADD2BgAA9gwAIPcGAAD-CwAw-AYAAP4LADD5BgAA_gsAMPoGAAD-CwAw-wYAAPgMADD8BgAAgQwAMA0QAADSCwAgFAAA1AsAIBcAANULACAaAADWCwAg8wQBAAAAAfQEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAjAYCiAYBAAAAAYkGAQAAAAGKBgEAAAABjAZAAAAAAQIAAAAkACBEAAD7DAAgAwAAACQAIEQAAPsMACBFAAD6DAAgAT0AAOAQADACAAAAJAAgPQAA-gwAIAIAAACCDAAgPQAA-QwAIAnzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIogGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhDRAAALALACAUAACyCwAgFwAAswsAIBoAALQLACDzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIogGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhDRAAANILACAUAADUCwAgFwAA1QsAIBoAANYLACDzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACMBgKIBgEAAAABiQYBAAAAAYoGAQAAAAGMBkAAAAABBggAAKoMACDzBAEAAAAB_wRAAAAAAeoFAQAAAAGaBgIAAAABmwYCAAAAAQIAAAANACBEAACHDQAgAwAAAA0AIEQAAIcNACBFAACGDQAgAT0AAN8QADANCAAAsAkAIAkAAOIIACDwBAAA3gkAMPEEAAALABDyBAAA3gkAMPMEAQAAAAH_BEAA6wcAIeoFAQD3BwAhhwYBAPcHACGaBgIA-gcAIZsGAgD6BwAh7wYAANwJACDwBgAA3QkAIAIAAAANACA9AACGDQAgAgAAAIQNACA9AACFDQAgCfAEAACDDQAw8QQAAIQNABDyBAAAgw0AMPMEAQD3BwAh_wRAAOsHACHqBQEA9wcAIYcGAQD3BwAhmgYCAPoHACGbBgIA-gcAIQnwBAAAgw0AMPEEAACEDQAQ8gQAAIMNADDzBAEA9wcAIf8EQADrBwAh6gUBAPcHACGHBgEA9wcAIZoGAgD6BwAhmwYCAPoHACEF8wQBAOgJACH_BEAA7AkAIeoFAQDoCQAhmgYCAPYJACGbBgIA9gkAIQYIAACoDAAg8wQBAOgJACH_BEAA7AkAIeoFAQDoCQAhmgYCAPYJACGbBgIA9gkAIQYIAACqDAAg8wQBAAAAAf8EQAAAAAHqBQEAAAABmgYCAAAAAZsGAgAAAAEJGAAAvQwAIPMEAQAAAAH_BEAAAAAB9QUBAAAAAfgFAgAAAAGcBgEAAAABnQYgAAAAAZ4GAgAAAAGfBgIAAAABAgAAAEAAIEQAAJMNACADAAAAQAAgRAAAkw0AIEUAAJINACABPQAA3hAAMA4JAADiCAAgGAAAtgkAIPAEAAC1CQAw8QQAAD4AEPIEAAC1CQAw8wQBAAAAAf8EQADrBwAh9QUBAPcHACH4BQIA-gcAIYcGAQD3BwAhnAYBAOgHACGdBiAAoggAIZ4GAgDxCAAhnwYCAPEIACECAAAAQAAgPQAAkg0AIAIAAACQDQAgPQAAkQ0AIAzwBAAAjw0AMPEEAACQDQAQ8gQAAI8NADDzBAEA9wcAIf8EQADrBwAh9QUBAPcHACH4BQIA-gcAIYcGAQD3BwAhnAYBAOgHACGdBiAAoggAIZ4GAgDxCAAhnwYCAPEIACEM8AQAAI8NADDxBAAAkA0AEPIEAACPDQAw8wQBAPcHACH_BEAA6wcAIfUFAQD3BwAh-AUCAPoHACGHBgEA9wcAIZwGAQDoBwAhnQYgAKIIACGeBgIA8QgAIZ8GAgDxCAAhCPMEAQDoCQAh_wRAAOwJACH1BQEA6AkAIfgFAgD2CQAhnAYBAOoJACGdBiAAxgoAIZ4GAgCMCwAhnwYCAIwLACEJGAAAsgwAIPMEAQDoCQAh_wRAAOwJACH1BQEA6AkAIfgFAgD2CQAhnAYBAOoJACGdBiAAxgoAIZ4GAgCMCwAhnwYCAIwLACEJGAAAvQwAIPMEAQAAAAH_BEAAAAAB9QUBAAAAAfgFAgAAAAGcBgEAAAABnQYgAAAAAZ4GAgAAAAGfBgIAAAABBB0AAOMMACDzBAEAAAABzAUAAACkBgKkBgEAAAABAgAAAPUCACBEAACUDQAgAwAAAA8AIEQAAJQNACBFAACYDQAgBgAAAA8AIB0AANUMACA9AACYDQAg8wQBAOgJACHMBQAA0wykBiKkBgEA6gkAIQQdAADVDAAg8wQBAOgJACHMBQAA0wykBiKkBgEA6gkAIQNEAADcEAAg9AYAAN0QACD6BgAAlwIAIANEAADaEAAg9AYAANsQACD6BgAAAQAgA0QAAJQNACD0BgAAlQ0AIPoGAAD1AgAgBEQAAIgNADD0BgAAiQ0AMPYGAACLDQAg-gYAAIwNADAERAAA_AwAMPQGAAD9DAAw9gYAAP8MACD6BgAAgA0AMAREAADzDAAw9AYAAPQMADD2BgAA9gwAIPoGAAD-CwAwAAAAAAAB9wYAAACzBgIHRAAAxhAAIEUAANgQACD0BgAAxxAAIPUGAADXEAAg-AYAAAUAIPkGAAAFACD6BgAABwAgC0QAANcNADBFAADcDQAw9AYAANgNADD1BgAA2Q0AMPYGAADaDQAg9wYAANsNADD4BgAA2w0AMPkGAADbDQAw-gYAANsNADD7BgAA3Q0AMPwGAADeDQAwBUQAAMoQACBFAADVEAAg9AYAAMsQACD1BgAA1BAAIPoGAACXAgAgBUQAAMgQACBFAADSEAAg9AYAAMkQACD1BgAA0RAAIPoGAAABACALRAAAzg0AMEUAANINADD0BgAAzw0AMPUGAADQDQAw9gYAANENACD3BgAAgA0AMPgGAACADQAw-QYAAIANADD6BgAAgA0AMPsGAADTDQAw_AYAAIMNADALRAAAwg0AMEUAAMcNADD0BgAAww0AMPUGAADEDQAw9gYAAMUNACD3BgAAxg0AMPgGAADGDQAw-QYAAMYNADD6BgAAxg0AMPsGAADIDQAw_AYAAMkNADALRAAAuQ0AMEUAAL0NADD0BgAAug0AMPUGAAC7DQAw9gYAALwNACD3BgAAmAwAMPgGAACYDAAw-QYAAJgMADD6BgAAmAwAMPsGAAC-DQAw_AYAAJsMADALRAAArQ0AMEUAALINADD0BgAArg0AMPUGAACvDQAw9gYAALANACD3BgAAsQ0AMPgGAACxDQAw-QYAALENADD6BgAAsQ0AMPsGAACzDQAw_AYAALQNADALEAAAjwsAIPMEAQAAAAH0BAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAO8FAusFAgAAAAHsBQIAAAAB7QUIAAAAAe8FAgAAAAHwBUAAAAABAgAAAEwAIEQAALgNACADAAAATAAgRAAAuA0AIEUAALcNACABPQAA0BAAMBAIAACwCQAgEAAA7AcAIPAEAACtCQAw8QQAACYAEPIEAACtCQAw8wQBAAAAAfQEAQAAAAH_BEAA6wcAIYAFQADrBwAhmAUAAK8J7wUi6gUBAPcHACHrBQIA-gcAIewFAgD6BwAh7QUIAK4JACHvBQIA8QgAIfAFQADqBwAhAgAAAEwAID0AALcNACACAAAAtQ0AID0AALYNACAO8AQAALQNADDxBAAAtQ0AEPIEAAC0DQAw8wQBAPcHACH0BAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAArwnvBSLqBQEA9wcAIesFAgD6BwAh7AUCAPoHACHtBQgArgkAIe8FAgDxCAAh8AVAAOoHACEO8AQAALQNADDxBAAAtQ0AEPIEAAC0DQAw8wQBAPcHACH0BAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAArwnvBSLqBQEA9wcAIesFAgD6BwAh7AUCAPoHACHtBQgArgkAIe8FAgDxCAAh8AVAAOoHACEK8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAiwvvBSLrBQIA9gkAIewFAgD2CQAh7QUIAIoLACHvBQIAjAsAIfAFQADrCQAhCxAAAI0LACDzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACLC-8FIusFAgD2CQAh7AUCAPYJACHtBQgAigsAIe8FAgCMCwAh8AVAAOsJACELEAAAjwsAIPMEAQAAAAH0BAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAO8FAusFAgAAAAHsBQIAAAAB7QUIAAAAAe8FAgAAAAHwBUAAAAABFAsAAIcMACAOAACIDAAgDwAAiQwAIBEAAIoMACASAACLDAAgEwAAjAwAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAkQYCvAVAAAAAAckFAQAAAAHKBQEAAAABjAZAAAAAAY0GAQAAAAGOBgEAAAABjwYCAAAAAZEGQAAAAAGSBkAAAAABkwYCAAAAAQIAAAAfACBEAADBDQAgAwAAAB8AIEQAAMENACBFAADADQAgAT0AAM8QADACAAAAHwAgPQAAwA0AIAIAAACcDAAgPQAAvw0AIA7zBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACGMBkAA6wkAIY0GAQDoCQAhjgYBAOoJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRQLAADeCwAgDgAA3wsAIA8AAOALACARAADhCwAgEgAA4gsAIBMAAOMLACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACGMBkAA6wkAIY0GAQDoCQAhjgYBAOoJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRQLAACHDAAgDgAAiAwAIA8AAIkMACARAACKDAAgEgAAiwwAIBMAAIwMACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAYwGQAAAAAGNBgEAAAABjgYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAEMCwAAoQwAIAwAAKIMACDzBAEAAAABmAUAAACVBgKgBQEAAAABvAVAAAAAAY0GAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAGYBkAAAAABmQZAAAAAAQIAAABIACBEAADNDQAgAwAAAEgAIEQAAM0NACBFAADMDQAgAT0AAM4QADASCAAAsAkAIAsAAJMJACAMAAC0CQAg8AQAALIJADDxBAAAGQAQ8gQAALIJADDzBAEAAAABmAUAALMJlQYioAUBAPcHACG8BUAA6gcAIeoFAQD3BwAhjQYBAOgHACGVBgEAAAABlgZAAOsHACGXBkAA6gcAIZgGQADqBwAhmQZAAOoHACHpBgAAsQkAIAIAAABIACA9AADMDQAgAgAAAMoNACA9AADLDQAgDvAEAADJDQAw8QQAAMoNABDyBAAAyQ0AMPMEAQD3BwAhmAUAALMJlQYioAUBAPcHACG8BUAA6gcAIeoFAQD3BwAhjQYBAOgHACGVBgEA9wcAIZYGQADrBwAhlwZAAOoHACGYBkAA6gcAIZkGQADqBwAhDvAEAADJDQAw8QQAAMoNABDyBAAAyQ0AMPMEAQD3BwAhmAUAALMJlQYioAUBAPcHACG8BUAA6gcAIeoFAQD3BwAhjQYBAOgHACGVBgEA9wcAIZYGQADrBwAhlwZAAOoHACGYBkAA6gcAIZkGQADqBwAhCvMEAQDoCQAhmAUAAJAMlQYioAUBAOgJACG8BUAA6wkAIY0GAQDqCQAhlQYBAOgJACGWBkAA7AkAIZcGQADrCQAhmAZAAOsJACGZBkAA6wkAIQwLAACSDAAgDAAAkwwAIPMEAQDoCQAhmAUAAJAMlQYioAUBAOgJACG8BUAA6wkAIY0GAQDqCQAhlQYBAOgJACGWBkAA7AkAIZcGQADrCQAhmAZAAOsJACGZBkAA6wkAIQwLAAChDAAgDAAAogwAIPMEAQAAAAGYBQAAAJUGAqAFAQAAAAG8BUAAAAABjQYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAZgGQAAAAAGZBkAAAAABBgkAAKsMACDzBAEAAAAB_wRAAAAAAYcGAQAAAAGaBgIAAAABmwYCAAAAAQIAAAANACBEAADWDQAgAwAAAA0AIEQAANYNACBFAADVDQAgAT0AAM0QADACAAAADQAgPQAA1Q0AIAIAAACEDQAgPQAA1A0AIAXzBAEA6AkAIf8EQADsCQAhhwYBAOgJACGaBgIA9gkAIZsGAgD2CQAhBgkAAKkMACDzBAEA6AkAIf8EQADsCQAhhwYBAOgJACGaBgIA9gkAIZsGAgD2CQAhBgkAAKsMACDzBAEAAAAB_wRAAAAAAYcGAQAAAAGaBgIAAAABmwYCAAAAAR4FAADjDQAgBgAA5A0AIAcAAOUNACAMAADoDQAgGAAA6Q0AIB8AAOYNACAgAADnDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACzBgKnBQEAAAABqAUBAAAAAa4FQAAAAAGxBUAAAAABtQUBAAAAAdUFAQAAAAHsBQIAAAABrAYBAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABAgAAAAcAIEQAAOINACADAAAABwAgRAAA4g0AIEUAAOENACABPQAAzBAAMCQEAADiCQAgBQAA9QgAIAYAALUIACAHAADyCAAgDAAAtAkAIBgAAOMJACAfAACrCQAgIAAA0QkAIPAEAADgCQAw8QQAAAUAEPIEAADgCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGYBQAA4QmzBiKnBQEA9wcAIagFAQD3BwAhrgVAAOoHACGxBUAA6gcAIbUFAQDoBwAh1QUBAPcHACHsBQIA-gcAIawGAQD3BwAhrgYBAOgHACGvBgIA-gcAIbAGAgD6BwAhsQYCAPoHACGzBkAA6gcAIbQGQADqBwAhtQYgAKIIACG2BiAAoggAIbcGIACiCAAhuAYCAPoHACG5BiAAoggAIboGAQDoBwAh8QYAAN8JACACAAAABwAgPQAA4Q0AIAIAAADfDQAgPQAA4A0AIBvwBAAA3g0AMPEEAADfDQAQ8gQAAN4NADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGYBQAA4QmzBiKnBQEA9wcAIagFAQD3BwAhrgVAAOoHACGxBUAA6gcAIbUFAQDoBwAh1QUBAPcHACHsBQIA-gcAIawGAQD3BwAhrgYBAOgHACGvBgIA-gcAIbAGAgD6BwAhsQYCAPoHACGzBkAA6gcAIbQGQADqBwAhtQYgAKIIACG2BiAAoggAIbcGIACiCAAhuAYCAPoHACG5BiAAoggAIboGAQDoBwAhG_AEAADeDQAw8QQAAN8NABDyBAAA3g0AMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIZgFAADhCbMGIqcFAQD3BwAhqAUBAPcHACGuBUAA6gcAIbEFQADqBwAhtQUBAOgHACHVBQEA9wcAIewFAgD6BwAhrAYBAPcHACGuBgEA6AcAIa8GAgD6BwAhsAYCAPoHACGxBgIA-gcAIbMGQADqBwAhtAZAAOoHACG1BiAAoggAIbYGIACiCAAhtwYgAKIIACG4BgIA-gcAIbkGIACiCAAhugYBAOgHACEX8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAKQNswYipwUBAOgJACGoBQEA6AkAIa4FQADrCQAhsQVAAOsJACG1BQEA6gkAIdUFAQDoCQAh7AUCAPYJACGsBgEA6AkAIa4GAQDqCQAhrwYCAPYJACGwBgIA9gkAIbEGAgD2CQAhswZAAOsJACG0BkAA6wkAIbUGIADGCgAhtgYgAMYKACG3BiAAxgoAIbgGAgD2CQAhuQYgAMYKACEeBQAApg0AIAYAAKcNACAHAACoDQAgDAAAqw0AIBgAAKwNACAfAACpDQAgIAAAqg0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhHgUAAOMNACAGAADkDQAgBwAA5Q0AIAwAAOgNACAYAADpDQAgHwAA5g0AICAAAOcNACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB1QUBAAAAAewFAgAAAAGsBgEAAAABrgYBAAAAAa8GAgAAAAGwBgIAAAABsQYCAAAAAbMGQAAAAAG0BkAAAAABtQYgAAAAAbYGIAAAAAG3BiAAAAABuAYCAAAAAbkGIAAAAAEERAAA1w0AMPQGAADYDQAw9gYAANoNACD6BgAA2w0AMANEAADKEAAg9AYAAMsQACD6BgAAlwIAIANEAADIEAAg9AYAAMkQACD6BgAAAQAgBEQAAM4NADD0BgAAzw0AMPYGAADRDQAg-gYAAIANADAERAAAwg0AMPQGAADDDQAw9gYAAMUNACD6BgAAxg0AMAREAAC5DQAw9AYAALoNADD2BgAAvA0AIPoGAACYDAAwBEQAAK0NADD0BgAArg0AMPYGAACwDQAg-gYAALENADADRAAAxhAAIPQGAADHEAAg-gYAAAcAIAAAAAAABUQAAMEQACBFAADEEAAg9AYAAMIQACD1BgAAwxAAIPoGAAABACADRAAAwRAAIPQGAADCEAAg-gYAAAEAIBQGAAD9CgAgDAAAhBAAICAAAIMQACAlAAD-CgAgJgAA_g8AICcAAP8PACAoAACAEAAgKQAAgRAAICoAAIIQACArAACjDgAgLAAApA4AIC0AAIUQACAuAACGEAAgLwAAhxAAIDYAALoKACA3AACIEAAgsQUAAOQJACC9BgAA5AkAINwGAADkCQAg4wYAAOQJACAAAAAFRAAAuRAAIEUAAL8QACD0BgAAuhAAIPUGAAC-EAAg-gYAAAEAIAtEAACVDgAwRQAAmQ4AMPQGAACWDgAw9QYAAJcOADD2BgAAmA4AIPcGAADbDQAw-AYAANsNADD5BgAA2w0AMPoGAADbDQAw-wYAAJoOADD8BgAA3g0AMAtEAACJDgAwRQAAjg4AMPQGAACKDgAw9QYAAIsOADD2BgAAjA4AIPcGAACNDgAw-AYAAI0OADD5BgAAjQ4AMPoGAACNDgAw-wYAAI8OADD8BgAAkA4AMAdEAACEDgAgRQAAhw4AIPQGAACFDgAg9QYAAIYOACD4BgAAVwAg-QYAAFcAIPoGAACFBQAgC0QAAPsNADBFAAD_DQAw9AYAAPwNADD1BgAA_Q0AMPYGAAD-DQAg9wYAAPMKADD4BgAA8woAMPkGAADzCgAw-gYAAPMKADD7BgAAgA4AMPwGAAD2CgAwESMAAOUKACAkAADnCgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADYBQK3BQEAAAAByAWAAAAAAc8FAAAAzwUC1gUBAAAAAdgFBAAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QVAAAAAAd4FQAAAAAECAAAAWwAgRAAAgw4AIAMAAABbACBEAACDDgAgRQAAgg4AIAE9AAC9EAAwAgAAAFsAID0AAIIOACACAAAA9woAID0AAIEOACAP8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAOAK2AUitwUBAOgJACHIBYAAAAABzwUAANoKzwUi1gUBAOoJACHYBQQA4QoAIdkFAQDoCQAh2gUBAOoJACHbBQEA6gkAIdwFAQDqCQAh3QVAAOsJACHeBUAA6wkAIREjAADiCgAgJAAA5AoAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADgCtgFIrcFAQDoCQAhyAWAAAAAAc8FAADaCs8FItYFAQDqCQAh2AUEAOEKACHZBQEA6AkAIdoFAQDqCQAh2wUBAOoJACHcBQEA6gkAId0FQADrCQAh3gVAAOsJACERIwAA5QoAICQAAOcKACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAANgFArcFAQAAAAHIBYAAAAABzwUAAADPBQLWBQEAAAAB2AUEAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBUAAAAAB3gVAAAAAAQwlAAD8CgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADiBQLgBQAAAOAFAuIFAQAAAAHjBQEAAAAB5AVAAAAAAeUFQAAAAAHmBSAAAAAB5wVAAAAAAQIAAACFBQAgRAAAhA4AIAMAAABXACBEAACEDgAgRQAAiA4AIA4AAABXACAlAADuCgAgPQAAiA4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADsCuIFIuAFAADrCuAFIuIFAQDqCQAh4wUBAOoJACHkBUAA6wkAIeUFQADrCQAh5gUgAMYKACHnBUAA6wkAIQwlAADuCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAOwK4gUi4AUAAOsK4AUi4gUBAOoJACHjBQEA6gkAIeQFQADrCQAh5QVAAOsJACHmBSAAxgoAIecFQADrCQAhFAcAAJoNACAKAACbDQAgDwAAng0AIB4AAJwNACAfAACdDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABpwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAcwFAAAApgYCpwYAAACnBgKoBgEAAAABqQYgAAAAAaoGAgAAAAGrBgIAAAABrAYBAAAAAa0GIAAAAAECAAAAVQAgRAAAlA4AIAMAAABVACBEAACUDgAgRQAAkw4AIAE9AAC8EAAwGgYAALUIACAHAADyCAAgCgAAqQkAIA8AAKwJACAeAACqCQAgHwAAqwkAIPAEAACmCQAw8QQAAFMAEPIEAACmCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGnBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA9wcAIcwFAACnCaYGItUFAQD3BwAhpwYAAKgJpwYiqAYBAOgHACGpBiAAoggAIaoGAgD6BwAhqwYCAPEIACGsBgEA9wcAIa0GIACiCAAh6AYAAKUJACACAAAAVQAgPQAAkw4AIAIAAACRDgAgPQAAkg4AIBPwBAAAkA4AMPEEAACRDgAQ8gQAAJAOADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACGnBQEA9wcAIagFAQD3BwAhsQVAAOoHACG1BQEA9wcAIcwFAACnCaYGItUFAQD3BwAhpwYAAKgJpwYiqAYBAOgHACGpBiAAoggAIaoGAgD6BwAhqwYCAPEIACGsBgEA9wcAIa0GIACiCAAhE_AEAACQDgAw8QQAAJEOABDyBAAAkA4AMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIacFAQD3BwAhqAUBAPcHACGxBUAA6gcAIbUFAQD3BwAhzAUAAKcJpgYi1QUBAPcHACGnBgAAqAmnBiKoBgEA6AcAIakGIACiCAAhqgYCAPoHACGrBgIA8QgAIawGAQD3BwAhrQYgAKIIACEP8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhpwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOgJACHMBQAA6wymBiKnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIawGAQDoCQAhrQYgAMYKACEUBwAA7gwAIAoAAO8MACAPAADyDAAgHgAA8AwAIB8AAPEMACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGnBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6AkAIcwFAADrDKYGIqcGAADsDKcGIqgGAQDqCQAhqQYgAMYKACGqBgIA9gkAIasGAgCMCwAhrAYBAOgJACGtBiAAxgoAIRQHAACaDQAgCgAAmw0AIA8AAJ4NACAeAACcDQAgHwAAnQ0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAacFAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHMBQAAAKYGAqcGAAAApwYCqAYBAAAAAakGIAAAAAGqBgIAAAABqwYCAAAAAawGAQAAAAGtBiAAAAABHgQAAOoNACAFAADjDQAgBwAA5Q0AIAwAAOgNACAYAADpDQAgHwAA5g0AICAAAOcNACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAECAAAABwAgRAAAnQ4AIAMAAAAHACBEAACdDgAgRQAAnA4AIAE9AAC7EAAwAgAAAAcAID0AAJwOACACAAAA3w0AID0AAJsOACAX8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAKQNswYipwUBAOgJACGoBQEA6AkAIa4FQADrCQAhsQVAAOsJACG1BQEA6gkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACEeBAAApQ0AIAUAAKYNACAHAACoDQAgDAAAqw0AIBgAAKwNACAfAACpDQAgIAAAqg0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHgQAAOoNACAFAADjDQAgBwAA5Q0AIAwAAOgNACAYAADpDQAgHwAA5g0AICAAAOcNACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAEDRAAAuRAAIPQGAAC6EAAg-gYAAAEAIAREAACVDgAw9AYAAJYOADD2BgAAmA4AIPoGAADbDQAwBEQAAIkOADD0BgAAig4AMPYGAACMDgAg-gYAAI0OADADRAAAhA4AIPQGAACFDgAg-gYAAIUFACAERAAA-w0AMPQGAAD8DQAw9gYAAP4NACD6BgAA8woAMAAABwYAAP0KACAlAAD-CgAg4gUAAOQJACDjBQAA5AkAIOQFAADkCQAg5QUAAOQJACDnBQAA5AkAIAAAAAAAAAVEAAC0EAAgRQAAtxAAIPQGAAC1EAAg9QYAALYQACD6BgAAAQAgA0QAALQQACD0BgAAtRAAIPoGAAABACAAAAAFRAAArxAAIEUAALIQACD0BgAAsBAAIPUGAACxEAAg-gYAAAEAIANEAACvEAAg9AYAALAQACD6BgAAAQAgAAAABUQAAKoQACBFAACtEAAg9AYAAKsQACD1BgAArBAAIPoGAAABACADRAAAqhAAIPQGAACrEAAg-gYAAAEAIAAAAAH3BgAAAN4GAgH3BgAAAOAGAgH3BgAAAOEGAgdEAADpDwAgRQAA7A8AIPQGAADqDwAg9QYAAOsPACD4BgAAAwAg-QYAAAMAIPoGAACXAgAgC0QAAN0PADBFAADiDwAw9AYAAN4PADD1BgAA3w8AMPYGAADgDwAg9wYAAOEPADD4BgAA4Q8AMPkGAADhDwAw-gYAAOEPADD7BgAA4w8AMPwGAADkDwAwC0QAANEPADBFAADWDwAw9AYAANIPADD1BgAA0w8AMPYGAADUDwAg9wYAANUPADD4BgAA1Q8AMPkGAADVDwAw-gYAANUPADD7BgAA1w8AMPwGAADYDwAwC0QAAMUPADBFAADKDwAw9AYAAMYPADD1BgAAxw8AMPYGAADIDwAg9wYAAMkPADD4BgAAyQ8AMPkGAADJDwAw-gYAAMkPADD7BgAAyw8AMPwGAADMDwAwC0QAALkPADBFAAC-DwAw9AYAALoPADD1BgAAuw8AMPYGAAC8DwAg9wYAAL0PADD4BgAAvQ8AMPkGAAC9DwAw-gYAAL0PADD7BgAAvw8AMPwGAADADwAwB0QAALQPACBFAAC3DwAg9AYAALUPACD1BgAAtg8AIPgGAAB0ACD5BgAAdAAg-gYAAK8CACALRAAAqw8AMEUAAK8PADD0BgAArA8AMPUGAACtDwAw9gYAAK4PACD3BgAA2w0AMPgGAADbDQAw-QYAANsNADD6BgAA2w0AMPsGAACwDwAw_AYAAN4NADALRAAAog8AMEUAAKYPADD0BgAAow8AMPUGAACkDwAw9gYAAKUPACD3BgAAxg0AMPgGAADGDQAw-QYAAMYNADD6BgAAxg0AMPsGAACnDwAw_AYAAMkNADALRAAAmQ8AMEUAAJ0PADD0BgAAmg8AMPUGAACbDwAw9gYAAJwPACD3BgAAmAwAMPgGAACYDAAw-QYAAJgMADD6BgAAmAwAMPsGAACeDwAw_AYAAJsMADALRAAAkA8AMEUAAJQPADD0BgAAkQ8AMPUGAACSDwAw9gYAAJMPACD3BgAAjQ4AMPgGAACNDgAw-QYAAI0OADD6BgAAjQ4AMPsGAACVDwAw_AYAAJAOADALRAAAhA8AMEUAAIkPADD0BgAAhQ8AMPUGAACGDwAw9gYAAIcPACD3BgAAiA8AMPgGAACIDwAw-QYAAIgPADD6BgAAiA8AMPsGAACKDwAw_AYAAIsPADALRAAA-w4AMEUAAP8OADD0BgAA_A4AMPUGAAD9DgAw9gYAAP4OACD3BgAA8woAMPgGAADzCgAw-QYAAPMKADD6BgAA8woAMPsGAACADwAw_AYAAPYKADALRAAA7w4AMEUAAPQOADD0BgAA8A4AMPUGAADxDgAw9gYAAPIOACD3BgAA8w4AMPgGAADzDgAw-QYAAPMOADD6BgAA8w4AMPsGAAD1DgAw_AYAAPYOADALRAAA4w4AMEUAAOgOADD0BgAA5A4AMPUGAADlDgAw9gYAAOYOACD3BgAA5w4AMPgGAADnDgAw-QYAAOcOADD6BgAA5w4AMPsGAADpDgAw_AYAAOoOADALRAAA2g4AMEUAAN4OADD0BgAA2w4AMPUGAADcDgAw9gYAAN0OACD3BgAAsQoAMPgGAACxCgAw-QYAALEKADD6BgAAsQoAMPsGAADfDgAw_AYAALQKADALRAAAzg4AMEUAANMOADD0BgAAzw4AMPUGAADQDgAw9gYAANEOACD3BgAA0g4AMPgGAADSDgAw-QYAANIOADD6BgAA0g4AMPsGAADUDgAw_AYAANUOADAI8wQBAAAAAf8EQAAAAAG2BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwUCAAAAAbwFQAAAAAECAAAAlgEAIEQAANkOACADAAAAlgEAIEQAANkOACBFAADYDgAgAT0AAKkQADAOIwAA8ggAIPAEAACJCQAw8QQAAJQBABDyBAAAiQkAMPMEAQAAAAH_BEAA6wcAIbYFAQD3BwAhtwUBAPcHACG4BQEA9wcAIbkFAQD3BwAhugUAAPgHACC7BQIA-gcAIbwFQADrBwAh5AYAAIgJACACAAAAlgEAID0AANgOACACAAAA1g4AID0AANcOACAM8AQAANUOADDxBAAA1g4AEPIEAADVDgAw8wQBAPcHACH_BEAA6wcAIbYFAQD3BwAhtwUBAPcHACG4BQEA9wcAIbkFAQD3BwAhugUAAPgHACC7BQIA-gcAIbwFQADrBwAhDPAEAADVDgAw8QQAANYOABDyBAAA1Q4AMPMEAQD3BwAh_wRAAOsHACG2BQEA9wcAIbcFAQD3BwAhuAUBAPcHACG5BQEA9wcAIboFAAD4BwAguwUCAPoHACG8BUAA6wcAIQjzBAEA6AkAIf8EQADsCQAhtgUBAOgJACG4BQEA6AkAIbkFAQDoCQAhugWAAAAAAbsFAgD2CQAhvAVAAOwJACEI8wQBAOgJACH_BEAA7AkAIbYFAQDoCQAhuAUBAOgJACG5BQEA6AkAIboFgAAAAAG7BQIA9gkAIbwFQADsCQAhCPMEAQAAAAH_BEAAAAABtgUBAAAAAbgFAQAAAAG5BQEAAAABugWAAAAAAbsFAgAAAAG8BUAAAAABDzIAAJgKACA1AACZCgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACtBQKnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAa0FAgAAAAGuBUAAAAABsAUBAAAAAbEFQAAAAAECAAAAiQEAIEQAAOIOACADAAAAiQEAIEQAAOIOACBFAADhDgAgAT0AAKgQADACAAAAiQEAID0AAOEOACACAAAAtQoAID0AAOAOACAN8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAIcKrQUipwUBAOgJACGoBQEA6AkAIakFAQDoCQAhqgUBAOgJACGrBQEA6gkAIa0FAgD2CQAhrgVAAOsJACGwBQEA6AkAIbEFQADrCQAhDzIAAIkKACA1AACKCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAIcKrQUipwUBAOgJACGoBQEA6AkAIakFAQDoCQAhqgUBAOgJACGrBQEA6gkAIa0FAgD2CQAhrgVAAOsJACGwBQEA6AkAIbEFQADrCQAhDzIAAJgKACA1AACZCgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACtBQKnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAa0FAgAAAAGuBUAAAAABsAUBAAAAAbEFQAAAAAEK8wQBAAAAAf8EQAAAAAHDBQAAAMMFAsQFAQAAAAHFBQEAAAABxgWAAAAAAccFgAAAAAHIBYAAAAAByQUBAAAAAcoFAQAAAAECAAAAhAEAIEQAAO4OACADAAAAhAEAIEQAAO4OACBFAADtDgAgAT0AAKcQADAPIwAAkwkAIPAEAACRCQAw8QQAAIIBABDyBAAAkQkAMPMEAQAAAAH_BEAA6wcAIbcFAQDoBwAhwwUAAJIJwwUixAUBAPcHACHFBQEA6AcAIcYFAADpBwAgxwUAAOkHACDIBQAA6QcAIMkFAQDoBwAhygUBAOgHACECAAAAhAEAID0AAO0OACACAAAA6w4AID0AAOwOACAO8AQAAOoOADDxBAAA6w4AEPIEAADqDgAw8wQBAPcHACH_BEAA6wcAIbcFAQDoBwAhwwUAAJIJwwUixAUBAPcHACHFBQEA6AcAIcYFAADpBwAgxwUAAOkHACDIBQAA6QcAIMkFAQDoBwAhygUBAOgHACEO8AQAAOoOADDxBAAA6w4AEPIEAADqDgAw8wQBAPcHACH_BEAA6wcAIbcFAQDoBwAhwwUAAJIJwwUixAUBAPcHACHFBQEA6AcAIcYFAADpBwAgxwUAAOkHACDIBQAA6QcAIMkFAQDoBwAhygUBAOgHACEK8wQBAOgJACH_BEAA7AkAIcMFAADMCsMFIsQFAQDoCQAhxQUBAOoJACHGBYAAAAABxwWAAAAAAcgFgAAAAAHJBQEA6gkAIcoFAQDqCQAhCvMEAQDoCQAh_wRAAOwJACHDBQAAzArDBSLEBQEA6AkAIcUFAQDqCQAhxgWAAAAAAccFgAAAAAHIBYAAAAAByQUBAOoJACHKBQEA6gkAIQrzBAEAAAAB_wRAAAAAAcMFAAAAwwUCxAUBAAAAAcUFAQAAAAHGBYAAAAABxwWAAAAAAcgFgAAAAAHJBQEAAAABygUBAAAAAQjzBAEAAAAB_wRAAAAAAYAFQAAAAAGiBQEAAAABpwUBAAAAAcgFgAAAAAHMBQAAAMwFAs0FIAAAAAECAAAAgAEAIEQAAPoOACADAAAAgAEAIEQAAPoOACBFAAD5DgAgAT0AAKYQADANIwAA8ggAIPAEAACUCQAw8QQAAH4AEPIEAACUCQAw8wQBAAAAAf8EQADrBwAhgAVAAOsHACGiBQEA9wcAIacFAQD3BwAhtwUBAPcHACHIBQAA6QcAIMwFAACVCcwFIs0FIACiCAAhAgAAAIABACA9AAD5DgAgAgAAAPcOACA9AAD4DgAgDPAEAAD2DgAw8QQAAPcOABDyBAAA9g4AMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIaIFAQD3BwAhpwUBAPcHACG3BQEA9wcAIcgFAADpBwAgzAUAAJUJzAUizQUgAKIIACEM8AQAAPYOADDxBAAA9w4AEPIEAAD2DgAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhogUBAPcHACGnBQEA9wcAIbcFAQD3BwAhyAUAAOkHACDMBQAAlQnMBSLNBSAAoggAIQjzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGiBQEA6AkAIacFAQDoCQAhyAWAAAAAAcwFAADSCswFIs0FIADGCgAhCPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIaIFAQDoCQAhpwUBAOgJACHIBYAAAAABzAUAANIKzAUizQUgAMYKACEI8wQBAAAAAf8EQAAAAAGABUAAAAABogUBAAAAAacFAQAAAAHIBYAAAAABzAUAAADMBQLNBSAAAAABEQYAAOYKACAkAADnCgAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADYBQLIBYAAAAABzwUAAADPBQLVBQEAAAAB1gUBAAAAAdgFBAAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QVAAAAAAd4FQAAAAAECAAAAWwAgRAAAgw8AIAMAAABbACBEAACDDwAgRQAAgg8AIAE9AAClEAAwAgAAAFsAID0AAIIPACACAAAA9woAID0AAIEPACAP8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAOAK2AUiyAWAAAAAAc8FAADaCs8FItUFAQDqCQAh1gUBAOoJACHYBQQA4QoAIdkFAQDoCQAh2gUBAOoJACHbBQEA6gkAIdwFAQDqCQAh3QVAAOsJACHeBUAA6wkAIREGAADjCgAgJAAA5AoAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADgCtgFIsgFgAAAAAHPBQAA2grPBSLVBQEA6gkAIdYFAQDqCQAh2AUEAOEKACHZBQEA6AkAIdoFAQDqCQAh2wUBAOoJACHcBQEA6gkAId0FQADrCQAh3gVAAOsJACERBgAA5goAICQAAOcKACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAANgFAsgFgAAAAAHPBQAAAM8FAtUFAQAAAAHWBQEAAAAB2AUEAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBUAAAAAB3gVAAAAAARIVAACjCwAg8wQBAAAAAfwEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA_wUCyAWAAAAAAfAFQAAAAAHxBQEAAAAB-wUCAAAAAfwFAgAAAAH9BQEAAAAB_wUgAAAAAYAGAgAAAAGBBgEAAAABggZAAAAAAYQGAAAAhAYChQZAAAAAAQIAAAB7ACBEAACPDwAgAwAAAHsAIEQAAI8PACBFAACODwAgAT0AAKQQADAXFQAAmQkAIBYAAJMJACDwBAAAlgkAMPEEAAAxABDyBAAAlgkAMPMEAQAAAAH8BAEA6AcAIf8EQADrBwAhgAVAAOsHACGYBQAAlwn_BSLIBQAA6QcAIPAFQADqBwAh8QUBAAAAAfoFAQDoBwAh-wUCAPoHACH8BQIA-gcAIf0FAQDoBwAh_wUgAKIIACGABgIA8QgAIYEGAQDoBwAhggZAAOoHACGEBgAAmAmEBiKFBkAA6gcAIQIAAAB7ACA9AACODwAgAgAAAIwPACA9AACNDwAgFfAEAACLDwAw8QQAAIwPABDyBAAAiw8AMPMEAQD3BwAh_AQBAOgHACH_BEAA6wcAIYAFQADrBwAhmAUAAJcJ_wUiyAUAAOkHACDwBUAA6gcAIfEFAQD3BwAh-gUBAOgHACH7BQIA-gcAIfwFAgD6BwAh_QUBAOgHACH_BSAAoggAIYAGAgDxCAAhgQYBAOgHACGCBkAA6gcAIYQGAACYCYQGIoUGQADqBwAhFfAEAACLDwAw8QQAAIwPABDyBAAAiw8AMPMEAQD3BwAh_AQBAOgHACH_BEAA6wcAIYAFQADrBwAhmAUAAJcJ_wUiyAUAAOkHACDwBUAA6gcAIfEFAQD3BwAh-gUBAOgHACH7BQIA-gcAIfwFAgD6BwAh_QUBAOgHACH_BSAAoggAIYAGAgDxCAAhgQYBAOgHACGCBkAA6gcAIYQGAACYCYQGIoUGQADqBwAhEfMEAQDoCQAh_AQBAOoJACH_BEAA7AkAIYAFQADsCQAhmAUAAJ8L_wUiyAWAAAAAAfAFQADrCQAh8QUBAOgJACH7BQIA9gkAIfwFAgD2CQAh_QUBAOoJACH_BSAAxgoAIYAGAgCMCwAhgQYBAOoJACGCBkAA6wkAIYQGAACgC4QGIoUGQADrCQAhEhUAAKELACDzBAEA6AkAIfwEAQDqCQAh_wRAAOwJACGABUAA7AkAIZgFAACfC_8FIsgFgAAAAAHwBUAA6wkAIfEFAQDoCQAh-wUCAPYJACH8BQIA9gkAIf0FAQDqCQAh_wUgAMYKACGABgIAjAsAIYEGAQDqCQAhggZAAOsJACGEBgAAoAuEBiKFBkAA6wkAIRIVAACjCwAg8wQBAAAAAfwEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA_wUCyAWAAAAAAfAFQAAAAAHxBQEAAAAB-wUCAAAAAfwFAgAAAAH9BQEAAAAB_wUgAAAAAYAGAgAAAAGBBgEAAAABggZAAAAAAYQGAAAAhAYChQZAAAAAARQGAACZDQAgCgAAmw0AIA8AAJ4NACAeAACcDQAgHwAAnQ0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAacFAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHMBQAAAKYGAtUFAQAAAAGnBgAAAKcGAqgGAQAAAAGpBiAAAAABqgYCAAAAAasGAgAAAAGtBiAAAAABAgAAAFUAIEQAAJgPACADAAAAVQAgRAAAmA8AIEUAAJcPACABPQAAoxAAMAIAAABVACA9AACXDwAgAgAAAJEOACA9AACWDwAgD_MEAQDoCQAh_wRAAOwJACGABUAA7AkAIacFAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDoCQAhzAUAAOsMpgYi1QUBAOgJACGnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIa0GIADGCgAhFAYAAO0MACAKAADvDAAgDwAA8gwAIB4AAPAMACAfAADxDAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhpwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOgJACHMBQAA6wymBiLVBQEA6AkAIacGAADsDKcGIqgGAQDqCQAhqQYgAMYKACGqBgIA9gkAIasGAgCMCwAhrQYgAMYKACEUBgAAmQ0AIAoAAJsNACAPAACeDQAgHgAAnA0AIB8AAJ0NACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGnBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABzAUAAACmBgLVBQEAAAABpwYAAACnBgKoBgEAAAABqQYgAAAAAaoGAgAAAAGrBgIAAAABrQYgAAAAARQIAACGDAAgDgAAiAwAIA8AAIkMACARAACKDAAgEgAAiwwAIBMAAIwMACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAeoFAQAAAAGMBkAAAAABjgYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAECAAAAHwAgRAAAoQ8AIAMAAAAfACBEAAChDwAgRQAAoA8AIAE9AACiEAAwAgAAAB8AID0AAKAPACACAAAAnAwAID0AAJ8PACAO8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAANwLkQYivAVAAOwJACHJBQEA6gkAIcoFAQDqCQAh6gUBAOgJACGMBkAA6wkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACEUCAAA3QsAIA4AAN8LACAPAADgCwAgEQAA4QsAIBIAAOILACATAADjCwAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAANwLkQYivAVAAOwJACHJBQEA6gkAIcoFAQDqCQAh6gUBAOgJACGMBkAA6wkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACEUCAAAhgwAIA4AAIgMACAPAACJDAAgEQAAigwAIBIAAIsMACATAACMDAAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACRBgK8BUAAAAAByQUBAAAAAcoFAQAAAAHqBQEAAAABjAZAAAAAAY4GAQAAAAGPBgIAAAABkQZAAAAAAZIGQAAAAAGTBgIAAAABDAgAAKAMACAMAACiDAAg8wQBAAAAAZgFAAAAlQYCoAUBAAAAAbwFQAAAAAHqBQEAAAABlQYBAAAAAZYGQAAAAAGXBkAAAAABmAZAAAAAAZkGQAAAAAECAAAASAAgRAAAqg8AIAMAAABIACBEAACqDwAgRQAAqQ8AIAE9AAChEAAwAgAAAEgAID0AAKkPACACAAAAyg0AID0AAKgPACAK8wQBAOgJACGYBQAAkAyVBiKgBQEA6AkAIbwFQADrCQAh6gUBAOgJACGVBgEA6AkAIZYGQADsCQAhlwZAAOsJACGYBkAA6wkAIZkGQADrCQAhDAgAAJEMACAMAACTDAAg8wQBAOgJACGYBQAAkAyVBiKgBQEA6AkAIbwFQADrCQAh6gUBAOgJACGVBgEA6AkAIZYGQADsCQAhlwZAAOsJACGYBkAA6wkAIZkGQADrCQAhDAgAAKAMACAMAACiDAAg8wQBAAAAAZgFAAAAlQYCoAUBAAAAAbwFQAAAAAHqBQEAAAABlQYBAAAAAZYGQAAAAAGXBkAAAAABmAZAAAAAAZkGQAAAAAEeBAAA6g0AIAUAAOMNACAGAADkDQAgDAAA6A0AIBgAAOkNACAfAADmDQAgIAAA5w0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABugYBAAAAAQIAAAAHACBEAACzDwAgAwAAAAcAIEQAALMPACBFAACyDwAgAT0AAKAQADACAAAABwAgPQAAsg8AIAIAAADfDQAgPQAAsQ8AIBfzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIa4GAQDqCQAhrwYCAPYJACGwBgIA9gkAIbEGAgD2CQAhswZAAOsJACG0BkAA6wkAIbUGIADGCgAhtgYgAMYKACG3BiAAxgoAIbgGAgD2CQAhuQYgAMYKACG6BgEA6gkAIR4EAAClDQAgBQAApg0AIAYAAKcNACAMAACrDQAgGAAArA0AIB8AAKkNACAgAACqDQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAKQNswYipwUBAOgJACGoBQEA6AkAIa4FQADrCQAhsQVAAOsJACG1BQEA6gkAIdUFAQDoCQAh7AUCAPYJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACEeBAAA6g0AIAUAAOMNACAGAADkDQAgDAAA6A0AIBgAAOkNACAfAADmDQAgIAAA5w0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABugYBAAAAARDzBAEAAAAB_wRAAAAAAYAFQAAAAAGxBUAAAAABuwYBAAAAAbwGAQAAAAG9BgEAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwQYBAAAAAcIGAQAAAAHDBoAAAAABxAYCAAAAAcUGQAAAAAHGBiAAAAABAgAAAK8CACBEAAC0DwAgAwAAAHQAIEQAALQPACBFAAC4DwAgEgAAAHQAID0AALgPACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGxBUAA6wkAIbsGAQDqCQAhvAYBAOoJACG9BgEA6gkAIb4GAQDqCQAhvwYBAOoJACHABgEA6gkAIcEGAQDqCQAhwgYBAOoJACHDBoAAAAABxAYCAIwLACHFBkAA6wkAIcYGIADGCgAhEPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIbEFQADrCQAhuwYBAOoJACG8BgEA6gkAIb0GAQDqCQAhvgYBAOoJACG_BgEA6gkAIcAGAQDqCQAhwQYBAOoJACHCBgEA6gkAIcMGgAAAAAHEBgIAjAsAIcUGQADrCQAhxgYgAMYKACEF8wQBAAAAAb4FAAAAvgUCvwUgAAAAAcAFQAAAAAHBBUAAAAABAgAAAHIAIEQAAMQPACADAAAAcgAgRAAAxA8AIEUAAMMPACABPQAAnxAAMAsjAADyCAAg8AQAAJsJADDxBAAAcAAQ8gQAAJsJADDzBAEAAAABtwUBAPcHACG-BQAAnAm-BSK_BSAAoggAIcAFQADrBwAhwQVAAOoHACHmBgAAmgkAIAIAAAByACA9AADDDwAgAgAAAMEPACA9AADCDwAgCfAEAADADwAw8QQAAMEPABDyBAAAwA8AMPMEAQD3BwAhtwUBAPcHACG-BQAAnAm-BSK_BSAAoggAIcAFQADrBwAhwQVAAOoHACEJ8AQAAMAPADDxBAAAwQ8AEPIEAADADwAw8wQBAPcHACG3BQEA9wcAIb4FAACcCb4FIr8FIACiCAAhwAVAAOsHACHBBUAA6gcAIQXzBAEA6AkAIb4FAADFCr4FIr8FIADGCgAhwAVAAOwJACHBBUAA6wkAIQXzBAEA6AkAIb4FAADFCr4FIr8FIADGCgAhwAVAAOwJACHBBUAA6wkAIQXzBAEAAAABvgUAAAC-BQK_BSAAAAABwAVAAAAAAcEFQAAAAAED8wQBAAAAAdAGAQAAAAHRBgEAAAABAgAAAG4AIEQAANAPACADAAAAbgAgRAAA0A8AIEUAAM8PACABPQAAnhAAMAgjAADyCAAg8AQAAJ0JADDxBAAAbAAQ8gQAAJ0JADDzBAEAAAABtwUBAAAAAdAGAQD3BwAh0QYBAOgHACECAAAAbgAgPQAAzw8AIAIAAADNDwAgPQAAzg8AIAfwBAAAzA8AMPEEAADNDwAQ8gQAAMwPADDzBAEA9wcAIbcFAQD3BwAh0AYBAPcHACHRBgEA6AcAIQfwBAAAzA8AMPEEAADNDwAQ8gQAAMwPADDzBAEA9wcAIbcFAQD3BwAh0AYBAPcHACHRBgEA6AcAIQPzBAEA6AkAIdAGAQDoCQAh0QYBAOoJACED8wQBAOgJACHQBgEA6AkAIdEGAQDqCQAhA_MEAQAAAAHQBgEAAAAB0QYBAAAAAQfzBAEAAAAB_wRAAAAAAYAFQAAAAAG8BUAAAAAByQUBAAAAAcoFAQAAAAHPBgEAAAABAgAAAGoAIEQAANwPACADAAAAagAgRAAA3A8AIEUAANsPACABPQAAnRAAMAwjAADyCAAg8AQAAJ4JADDxBAAAaAAQ8gQAAJ4JADDzBAEAAAAB_wRAAOsHACGABUAA6wcAIbcFAQD3BwAhvAVAAOsHACHJBQEA6AcAIcoFAQDoBwAhzwYBAAAAAQIAAABqACA9AADbDwAgAgAAANkPACA9AADaDwAgC_AEAADYDwAw8QQAANkPABDyBAAA2A8AMPMEAQD3BwAh_wRAAOsHACGABUAA6wcAIbcFAQD3BwAhvAVAAOsHACHJBQEA6AcAIcoFAQDoBwAhzwYBAPcHACEL8AQAANgPADDxBAAA2Q8AEPIEAADYDwAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhtwUBAPcHACG8BUAA6wcAIckFAQDoBwAhygUBAOgHACHPBgEA9wcAIQfzBAEA6AkAIf8EQADsCQAhgAVAAOwJACG8BUAA7AkAIckFAQDqCQAhygUBAOoJACHPBgEA6AkAIQfzBAEA6AkAIf8EQADsCQAhgAVAAOwJACG8BUAA7AkAIckFAQDqCQAhygUBAOoJACHPBgEA6AkAIQfzBAEAAAAB_wRAAAAAAYAFQAAAAAG8BUAAAAAByQUBAAAAAcoFAQAAAAHPBgEAAAABDfMEAQAAAAH_BEAAAAABgAVAAAAAAdIGAQAAAAHTBgEAAAAB1AYBAAAAAdUGAQAAAAHWBgEAAAAB1wYBAAAAAdgGAQAAAAHZBkAAAAAB2gZAAAAAAdsGAQAAAAECAAAAZgAgRAAA6A8AIAMAAABmACBEAADoDwAgRQAA5w8AIAE9AACcEAAwEyMAAPIIACDwBAAAoAkAMPEEAABkABDyBAAAoAkAMPMEAQAAAAH_BEAA6wcAIYAFQADrBwAhtwUBAPcHACHSBgEA9wcAIdMGAQD3BwAh1AYBAPcHACHVBgEA6AcAIdYGAQDoBwAh1wYBAOgHACHYBgEA6AcAIdkGQADqBwAh2gZAAOoHACHbBgEA6AcAIecGAACfCQAgAgAAAGYAID0AAOcPACACAAAA5Q8AID0AAOYPACAR8AQAAOQPADDxBAAA5Q8AEPIEAADkDwAw8wQBAPcHACH_BEAA6wcAIYAFQADrBwAhtwUBAPcHACHSBgEA9wcAIdMGAQD3BwAh1AYBAPcHACHVBgEA6AcAIdYGAQDoBwAh1wYBAOgHACHYBgEA6AcAIdkGQADqBwAh2gZAAOoHACHbBgEA6AcAIRHwBAAA5A8AMPEEAADlDwAQ8gQAAOQPADDzBAEA9wcAIf8EQADrBwAhgAVAAOsHACG3BQEA9wcAIdIGAQD3BwAh0wYBAPcHACHUBgEA9wcAIdUGAQDoBwAh1gYBAOgHACHXBgEA6AcAIdgGAQDoBwAh2QZAAOoHACHaBkAA6gcAIdsGAQDoBwAhDfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIdIGAQDoCQAh0wYBAOgJACHUBgEA6AkAIdUGAQDqCQAh1gYBAOoJACHXBgEA6gkAIdgGAQDqCQAh2QZAAOsJACHaBkAA6wkAIdsGAQDqCQAhDfMEAQDoCQAh_wRAAOwJACGABUAA7AkAIdIGAQDoCQAh0wYBAOgJACHUBgEA6AkAIdUGAQDqCQAh1gYBAOoJACHXBgEA6gkAIdgGAQDqCQAh2QZAAOsJACHaBkAA6wkAIdsGAQDqCQAhDfMEAQAAAAH_BEAAAAABgAVAAAAAAdIGAQAAAAHTBgEAAAAB1AYBAAAAAdUGAQAAAAHWBgEAAAAB1wYBAAAAAdgGAQAAAAHZBkAAAAAB2gZAAAAAAdsGAQAAAAEPIQAAnw4AICIAAKAOACAkAAChDgAgJQAAog4AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZ8FAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBiAAAAABAgAAAJcCACBEAADpDwAgAwAAAAMAIEQAAOkPACBFAADtDwAgEQAAAAMAICEAAPcNACAiAAD4DQAgJAAA-Q0AICUAAPoNACA9AADtDwAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIQ8hAAD3DQAgIgAA-A0AICQAAPkNACAlAAD6DQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIQNEAADpDwAg9AYAAOoPACD6BgAAlwIAIAREAADdDwAw9AYAAN4PADD2BgAA4A8AIPoGAADhDwAwBEQAANEPADD0BgAA0g8AMPYGAADUDwAg-gYAANUPADAERAAAxQ8AMPQGAADGDwAw9gYAAMgPACD6BgAAyQ8AMAREAAC5DwAw9AYAALoPADD2BgAAvA8AIPoGAAC9DwAwA0QAALQPACD0BgAAtQ8AIPoGAACvAgAgBEQAAKsPADD0BgAArA8AMPYGAACuDwAg-gYAANsNADAERAAAog8AMPQGAACjDwAw9gYAAKUPACD6BgAAxg0AMAREAACZDwAw9AYAAJoPADD2BgAAnA8AIPoGAACYDAAwBEQAAJAPADD0BgAAkQ8AMPYGAACTDwAg-gYAAI0OADAERAAAhA8AMPQGAACFDwAw9gYAAIcPACD6BgAAiA8AMAREAAD7DgAw9AYAAPwOADD2BgAA_g4AIPoGAADzCgAwBEQAAO8OADD0BgAA8A4AMPYGAADyDgAg-gYAAPMOADAERAAA4w4AMPQGAADkDgAw9gYAAOYOACD6BgAA5w4AMAREAADaDgAw9AYAANsOADD2BgAA3Q4AIPoGAACxCgAwBEQAAM4OADD0BgAAzw4AMPYGAADRDgAg-gYAANIOADAAAAAADSMAAPINACCxBQAA5AkAILsGAADkCQAgvAYAAOQJACC9BgAA5AkAIL4GAADkCQAgvwYAAOQJACDABgAA5AkAIMEGAADkCQAgwgYAAOQJACDDBgAA5AkAIMQGAADkCQAgxQYAAOQJACAAAAAAAAAGMAAA8g0AIDIAAIsQACA1AACoCgAgqwUAAOQJACCuBQAA5AkAILEFAADkCQAgATEAAKgKACACMQAAugoAILUFAADkCQAgCQkAAOQMACAQAADvCQAgFAAAlBAAIBcAAJUQACAaAACSEAAgiAYAAOQJACCJBgAA5AkAIIoGAADkCQAgjAYAAOQJACADCQAA5AwAIB0AAOUMACCkBgAA5AkAIAAAAA8EAACREAAgBQAAow4AIAYAAP0KACAHAADyDQAgDAAAhBAAIBgAAJsQACAfAACPEAAgIAAAgxAAIK4FAADkCQAgsQUAAOQJACC1BQAA5AkAIK4GAADkCQAgswYAAOQJACC0BgAA5AkAILoGAADkCQAgAAUJAADkDAAgGAAAkhAAIJwGAADkCQAgngYAAOQJACCfBgAA5AkAIAALFQAAjBAAIBYAAPINACD8BAAA5AkAIMgFAADkCQAg8AUAAOQJACD6BQAA5AkAIP0FAADkCQAggAYAAOQJACCBBgAA5AkAIIIGAADkCQAghQYAAOQJACAICAAAkRAAIAsAAPINACAMAACEEAAgvAUAAOQJACCNBgAA5AkAIJcGAADkCQAgmAYAAOQJACCZBgAA5AkAIAQIAACREAAgEAAA7wkAIO8FAADkCQAg8AUAAOQJACAKEAAA7wkAIPYEAADkCQAg9wQAAOQJACD4BAAA5AkAIPkEAADkCQAg-gQAAOQJACD7BAAA5AkAIPwEAADkCQAg_QQAAOQJACD-BAAA5AkAIAACCgAAjRAAIBwAAJQQACAADfMEAQAAAAH_BEAAAAABgAVAAAAAAdIGAQAAAAHTBgEAAAAB1AYBAAAAAdUGAQAAAAHWBgEAAAAB1wYBAAAAAdgGAQAAAAHZBkAAAAAB2gZAAAAAAdsGAQAAAAEH8wQBAAAAAf8EQAAAAAGABUAAAAABvAVAAAAAAckFAQAAAAHKBQEAAAABzwYBAAAAAQPzBAEAAAAB0AYBAAAAAdEGAQAAAAEF8wQBAAAAAb4FAAAAvgUCvwUgAAAAAcAFQAAAAAHBBUAAAAABF_MEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABugYBAAAAAQrzBAEAAAABmAUAAACVBgKgBQEAAAABvAVAAAAAAeoFAQAAAAGVBgEAAAABlgZAAAAAAZcGQAAAAAGYBkAAAAABmQZAAAAAAQ7zBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAeoFAQAAAAGMBkAAAAABjgYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAEP8wQBAAAAAf8EQAAAAAGABUAAAAABpwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAcwFAAAApgYC1QUBAAAAAacGAAAApwYCqAYBAAAAAakGIAAAAAGqBgIAAAABqwYCAAAAAa0GIAAAAAER8wQBAAAAAfwEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA_wUCyAWAAAAAAfAFQAAAAAHxBQEAAAAB-wUCAAAAAfwFAgAAAAH9BQEAAAAB_wUgAAAAAYAGAgAAAAGBBgEAAAABggZAAAAAAYQGAAAAhAYChQZAAAAAAQ_zBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAANgFAsgFgAAAAAHPBQAAAM8FAtUFAQAAAAHWBQEAAAAB2AUEAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBUAAAAAB3gVAAAAAAQjzBAEAAAAB_wRAAAAAAYAFQAAAAAGiBQEAAAABpwUBAAAAAcgFgAAAAAHMBQAAAMwFAs0FIAAAAAEK8wQBAAAAAf8EQAAAAAHDBQAAAMMFAsQFAQAAAAHFBQEAAAABxgWAAAAAAccFgAAAAAHIBYAAAAAByQUBAAAAAcoFAQAAAAEN8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACtBQKnBQEAAAABqAUBAAAAAakFAQAAAAGqBQEAAAABqwUBAAAAAa0FAgAAAAGuBUAAAAABsAUBAAAAAbEFQAAAAAEI8wQBAAAAAf8EQAAAAAG2BQEAAAABuAUBAAAAAbkFAQAAAAG6BYAAAAABuwUCAAAAAbwFQAAAAAEdBgAA7g8AIAwAAPYPACAgAAD1DwAgJQAA-Q8AICcAAPAPACAoAADxDwAgKQAA8g8AICoAAPMPACArAAD0DwAgLAAA9w8AIC0AAPgPACAuAAD6DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAAqhAAIAMAAAAbACBEAACqEAAgRQAArhAAIB8AAAAbACAGAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACA9AACuEAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAO4PACAMAAD2DwAgIAAA9Q8AICUAAPkPACAmAADvDwAgJwAA8A8AICkAAPIPACAqAADzDwAgKwAA9A8AICwAAPcPACAtAAD4DwAgLgAA-g8AIC8AAPsPACA2AAD8DwAgNwAA_Q8AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4AYCnwUBAAAAAaAFAQAAAAGxBUAAAAABzwUAAADhBgK9BgEAAAAB3AYBAAAAAd4GAAAA3gYC4QYgAAAAAeIGIAAAAAHjBkAAAAABAgAAAAEAIEQAAK8QACADAAAAGwAgRAAArxAAIEUAALMQACAfAAAAGwAgBgAAvg4AIAwAAMYOACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAgPQAAsxAAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdBgAAvg4AIAwAAMYOACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAADuDwAgDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICgAAPEPACApAADyDwAgKgAA8w8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNgAA_A8AIDcAAP0PACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQIAAAABACBEAAC0EAAgAwAAABsAIEQAALQQACBFAAC4EAAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AALgQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKQAA8g8AICoAAPMPACArAAD0DwAgLAAA9w8AIC0AAPgPACAuAAD6DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAAuRAAIBfzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAEP8wQBAAAAAf8EQAAAAAGABUAAAAABpwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAcwFAAAApgYCpwYAAACnBgKoBgEAAAABqQYgAAAAAaoGAgAAAAGrBgIAAAABrAYBAAAAAa0GIAAAAAEP8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADYBQK3BQEAAAAByAWAAAAAAc8FAAAAzwUC1gUBAAAAAdgFBAAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QVAAAAAAd4FQAAAAAEDAAAAGwAgRAAAuRAAIEUAAMAQACAfAAAAGwAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAgPQAAwBAAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAADuDwAgDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKQAA8g8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNgAA_A8AIDcAAP0PACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQIAAAABACBEAADBEAAgAwAAABsAIEQAAMEQACBFAADFEAAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AAMUQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEfBAAA6g0AIAYAAOQNACAHAADlDQAgDAAA6A0AIBgAAOkNACAfAADmDQAgIAAA5w0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAECAAAABwAgRAAAxhAAIB0GAADuDwAgDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKQAA8g8AICoAAPMPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNgAA_A8AIDcAAP0PACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQIAAAABACBEAADIEAAgEAEAAJ4OACAiAACgDgAgJAAAoQ4AICUAAKIOACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGfBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYgAAAAAcsGAQAAAAECAAAAlwIAIEQAAMoQACAX8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACzBgKnBQEAAAABqAUBAAAAAa4FQAAAAAGxBUAAAAABtQUBAAAAAdUFAQAAAAHsBQIAAAABrAYBAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABBfMEAQAAAAH_BEAAAAABhwYBAAAAAZoGAgAAAAGbBgIAAAABCvMEAQAAAAGYBQAAAJUGAqAFAQAAAAG8BUAAAAABjQYBAAAAAZUGAQAAAAGWBkAAAAABlwZAAAAAAZgGQAAAAAGZBkAAAAABDvMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAkQYCvAVAAAAAAckFAQAAAAHKBQEAAAABjAZAAAAAAY0GAQAAAAGOBgEAAAABjwYCAAAAAZEGQAAAAAGSBkAAAAABkwYCAAAAAQrzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADvBQLrBQIAAAAB7AUCAAAAAe0FCAAAAAHvBQIAAAAB8AVAAAAAAQMAAAAbACBEAADIEAAgRQAA0xAAIB8AAAAbACAGAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACA9AADTEAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhAwAAAAMAIEQAAMoQACBFAADWEAAgEgAAAAMAIAEAAPYNACAiAAD4DQAgJAAA-Q0AICUAAPoNACA9AADWEAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIcsGAQDoCQAhEAEAAPYNACAiAAD4DQAgJAAA-Q0AICUAAPoNACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGfBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6gkAIccGAQDqCQAhyAYBAOoJACHJBgEA6gkAIcoGIADGCgAhywYBAOgJACEDAAAABQAgRAAAxhAAIEUAANkQACAhAAAABQAgBAAApQ0AIAYAAKcNACAHAACoDQAgDAAAqw0AIBgAAKwNACAfAACpDQAgIAAAqg0AID0AANkQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHwQAAKUNACAGAACnDQAgBwAAqA0AIAwAAKsNACAYAACsDQAgHwAAqQ0AICAAAKoNACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHQYAAO4PACAMAAD2DwAgIAAA9Q8AICUAAPkPACAmAADvDwAgJwAA8A8AICgAAPEPACApAADyDwAgKgAA8w8AICsAAPQPACAtAAD4DwAgLgAA-g8AIC8AAPsPACA2AAD8DwAgNwAA_Q8AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4AYCnwUBAAAAAaAFAQAAAAGxBUAAAAABzwUAAADhBgK9BgEAAAAB3AYBAAAAAd4GAAAA3gYC4QYgAAAAAeIGIAAAAAHjBkAAAAABAgAAAAEAIEQAANoQACAQAQAAng4AICEAAJ8OACAkAAChDgAgJQAAog4AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZ8FAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBiAAAAABywYBAAAAAQIAAACXAgAgRAAA3BAAIAjzBAEAAAAB_wRAAAAAAfUFAQAAAAH4BQIAAAABnAYBAAAAAZ0GIAAAAAGeBgIAAAABnwYCAAAAAQXzBAEAAAAB_wRAAAAAAeoFAQAAAAGaBgIAAAABmwYCAAAAAQnzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACMBgKIBgEAAAABiQYBAAAAAYoGAQAAAAGMBkAAAAABAwAAABsAIEQAANoQACBFAADjEAAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AAOMQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEDAAAAAwAgRAAA3BAAIEUAAOYQACASAAAAAwAgAQAA9g0AICEAAPcNACAkAAD5DQAgJQAA-g0AID0AAOYQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGfBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6gkAIccGAQDqCQAhyAYBAOoJACHJBgEA6gkAIcoGIADGCgAhywYBAOgJACEQAQAA9g0AICEAAPcNACAkAAD5DQAgJQAA-g0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZ8FAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDqCQAhxwYBAOoJACHIBgEA6gkAIckGAQDqCQAhygYgAMYKACHLBgEA6AkAIRUGAACZDQAgBwAAmg0AIA8AAJ4NACAeAACcDQAgHwAAnQ0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAacFAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHMBQAAAKYGAtUFAQAAAAGnBgAAAKcGAqgGAQAAAAGpBiAAAAABqgYCAAAAAasGAgAAAAGsBgEAAAABrQYgAAAAAQIAAABVACBEAADnEAAgBPMEAQAAAAGaBgIAAAABoQYBAAAAAaIGIAAAAAEDAAAAUwAgRAAA5xAAIEUAAOwQACAXAAAAUwAgBgAA7QwAIAcAAO4MACAPAADyDAAgHgAA8AwAIB8AAPEMACA9AADsEAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhpwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOgJACHMBQAA6wymBiLVBQEA6AkAIacGAADsDKcGIqgGAQDqCQAhqQYgAMYKACGqBgIA9gkAIasGAgCMCwAhrAYBAOgJACGtBiAAxgoAIRUGAADtDAAgBwAA7gwAIA8AAPIMACAeAADwDAAgHwAA8QwAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIacFAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDoCQAhzAUAAOsMpgYi1QUBAOgJACGnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIawGAQDoCQAhrQYgAMYKACEFCQAA4gwAIPMEAQAAAAHMBQAAAKQGAocGAQAAAAGkBgEAAAABAgAAAPUCACBEAADtEAAgA_MEAQAAAAH_BEAAAAAB8QUBAAAAAQMAAAAPACBEAADtEAAgRQAA8hAAIAcAAAAPACAJAADUDAAgPQAA8hAAIPMEAQDoCQAhzAUAANMMpAYihwYBAOgJACGkBgEA6gkAIQUJAADUDAAg8wQBAOgJACHMBQAA0wykBiKHBgEA6AkAIaQGAQDqCQAhFQYAAJkNACAHAACaDQAgCgAAmw0AIA8AAJ4NACAfAACdDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABpwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAcwFAAAApgYC1QUBAAAAAacGAAAApwYCqAYBAAAAAakGIAAAAAGqBgIAAAABqwYCAAAAAawGAQAAAAGtBiAAAAABAgAAAFUAIEQAAPMQACAK8wQBAAAAAf8EQAAAAAHxBQEAAAAB8wUgAAAAAfQFAQAAAAH1BQEAAAAB9gUCAAAAAfcFAgAAAAH4BQIAAAAB-QUBAAAAAQMAAABTACBEAADzEAAgRQAA-BAAIBcAAABTACAGAADtDAAgBwAA7gwAIAoAAO8MACAPAADyDAAgHwAA8QwAID0AAPgQACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGnBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6AkAIcwFAADrDKYGItUFAQDoCQAhpwYAAOwMpwYiqAYBAOoJACGpBiAAxgoAIaoGAgD2CQAhqwYCAIwLACGsBgEA6AkAIa0GIADGCgAhFQYAAO0MACAHAADuDAAgCgAA7wwAIA8AAPIMACAfAADxDAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhpwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOgJACHMBQAA6wymBiLVBQEA6AkAIacGAADsDKcGIqgGAQDqCQAhqQYgAMYKACGqBgIA9gkAIasGAgCMCwAhrAYBAOgJACGtBiAAxgoAIRUGAACZDQAgBwAAmg0AIAoAAJsNACAPAACeDQAgHgAAnA0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAacFAQAAAAGoBQEAAAABsQVAAAAAAbUFAQAAAAHMBQAAAKYGAtUFAQAAAAGnBgAAAKcGAqgGAQAAAAGpBiAAAAABqgYCAAAAAasGAgAAAAGsBgEAAAABrQYgAAAAAQIAAABVACBEAAD5EAAgHwQAAOoNACAFAADjDQAgBgAA5A0AIAcAAOUNACAMAADoDQAgGAAA6Q0AICAAAOcNACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB1QUBAAAAAewFAgAAAAGsBgEAAAABrgYBAAAAAa8GAgAAAAGwBgIAAAABsQYCAAAAAbMGQAAAAAG0BkAAAAABtQYgAAAAAbYGIAAAAAG3BiAAAAABuAYCAAAAAbkGIAAAAAG6BgEAAAABAgAAAAcAIEQAAPsQACADAAAAUwAgRAAA-RAAIEUAAP8QACAXAAAAUwAgBgAA7QwAIAcAAO4MACAKAADvDAAgDwAA8gwAIB4AAPAMACA9AAD_EAAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhpwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOgJACHMBQAA6wymBiLVBQEA6AkAIacGAADsDKcGIqgGAQDqCQAhqQYgAMYKACGqBgIA9gkAIasGAgCMCwAhrAYBAOgJACGtBiAAxgoAIRUGAADtDAAgBwAA7gwAIAoAAO8MACAPAADyDAAgHgAA8AwAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIacFAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDoCQAhzAUAAOsMpgYi1QUBAOgJACGnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIawGAQDoCQAhrQYgAMYKACEDAAAABQAgRAAA-xAAIEUAAIIRACAhAAAABQAgBAAApQ0AIAUAAKYNACAGAACnDQAgBwAAqA0AIAwAAKsNACAYAACsDQAgIAAAqg0AID0AAIIRACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHwQAAKUNACAFAACmDQAgBgAApw0AIAcAAKgNACAMAACrDQAgGAAArA0AICAAAKoNACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHQYAAO4PACAMAAD2DwAgJQAA-Q8AICYAAO8PACAnAADwDwAgKAAA8Q8AICkAAPIPACAqAADzDwAgKwAA9A8AICwAAPcPACAtAAD4DwAgLgAA-g8AIC8AAPsPACA2AAD8DwAgNwAA_Q8AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4AYCnwUBAAAAAaAFAQAAAAGxBUAAAAABzwUAAADhBgK9BgEAAAAB3AYBAAAAAd4GAAAA3gYC4QYgAAAAAeIGIAAAAAHjBkAAAAABAgAAAAEAIEQAAIMRACAfBAAA6g0AIAUAAOMNACAGAADkDQAgBwAA5Q0AIAwAAOgNACAYAADpDQAgHwAA5g0AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAswYCpwUBAAAAAagFAQAAAAGuBUAAAAABsQVAAAAAAbUFAQAAAAHVBQEAAAAB7AUCAAAAAawGAQAAAAGuBgEAAAABrwYCAAAAAbAGAgAAAAGxBgIAAAABswZAAAAAAbQGQAAAAAG1BiAAAAABtgYgAAAAAbcGIAAAAAG4BgIAAAABuQYgAAAAAboGAQAAAAECAAAABwAgRAAAhREAIA7zBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAeoFAQAAAAGMBkAAAAABjQYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAEDAAAAGwAgRAAAgxEAIEUAAIoRACAfAAAAGwAgBgAAvg4AIAwAAMYOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAgPQAAihEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdBgAAvg4AIAwAAMYOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA3AADNDgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIQMAAAAFACBEAACFEQAgRQAAjREAICEAAAAFACAEAAClDQAgBQAApg0AIAYAAKcNACAHAACoDQAgDAAAqw0AIBgAAKwNACAfAACpDQAgPQAAjREAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACEfBAAApQ0AIAUAAKYNACAGAACnDQAgBwAAqA0AIAwAAKsNACAYAACsDQAgHwAAqQ0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACENCAAAoAwAIAsAAKEMACDzBAEAAAABmAUAAACVBgKgBQEAAAABvAVAAAAAAeoFAQAAAAGNBgEAAAABlQYBAAAAAZYGQAAAAAGXBkAAAAABmAZAAAAAAZkGQAAAAAECAAAASAAgRAAAjhEAIB0GAADuDwAgIAAA9Q8AICUAAPkPACAmAADvDwAgJwAA8A8AICgAAPEPACApAADyDwAgKgAA8w8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNgAA_A8AIDcAAP0PACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQIAAAABACBEAACQEQAgHwQAAOoNACAFAADjDQAgBgAA5A0AIAcAAOUNACAYAADpDQAgHwAA5g0AICAAAOcNACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAALMGAqcFAQAAAAGoBQEAAAABrgVAAAAAAbEFQAAAAAG1BQEAAAAB1QUBAAAAAewFAgAAAAGsBgEAAAABrgYBAAAAAa8GAgAAAAGwBgIAAAABsQYCAAAAAbMGQAAAAAG0BkAAAAABtQYgAAAAAbYGIAAAAAG3BiAAAAABuAYCAAAAAbkGIAAAAAG6BgEAAAABAgAAAAcAIEQAAJIRACAJ8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACMBgKHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABjAZAAAAAAQTzBAEAAAABkgUAAADpBQLIBYAAAAAB6QVAAAAAAQMAAAAZACBEAACOEQAgRQAAmBEAIA8AAAAZACAIAACRDAAgCwAAkgwAID0AAJgRACDzBAEA6AkAIZgFAACQDJUGIqAFAQDoCQAhvAVAAOsJACHqBQEA6AkAIY0GAQDqCQAhlQYBAOgJACGWBkAA7AkAIZcGQADrCQAhmAZAAOsJACGZBkAA6wkAIQ0IAACRDAAgCwAAkgwAIPMEAQDoCQAhmAUAAJAMlQYioAUBAOgJACG8BUAA6wkAIeoFAQDoCQAhjQYBAOoJACGVBgEA6AkAIZYGQADsCQAhlwZAAOsJACGYBkAA6wkAIZkGQADrCQAhAwAAABsAIEQAAJARACBFAACbEQAgHwAAABsAIAYAAL4OACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AAJsRACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEDAAAABQAgRAAAkhEAIEUAAJ4RACAhAAAABQAgBAAApQ0AIAUAAKYNACAGAACnDQAgBwAAqA0AIBgAAKwNACAfAACpDQAgIAAAqg0AID0AAJ4RACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhHwQAAKUNACAFAACmDQAgBgAApw0AIAcAAKgNACAYAACsDQAgHwAAqQ0AICAAAKoNACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAApA2zBiKnBQEA6AkAIagFAQDoCQAhrgVAAOsJACGxBUAA6wkAIbUFAQDqCQAh1QUBAOgJACHsBQIA9gkAIawGAQDoCQAhrgYBAOoJACGvBgIA9gkAIbAGAgD2CQAhsQYCAPYJACGzBkAA6wkAIbQGQADrCQAhtQYgAMYKACG2BiAAxgoAIbcGIADGCgAhuAYCAPYJACG5BiAAxgoAIboGAQDqCQAhFQYAAJkNACAHAACaDQAgCgAAmw0AIB4AAJwNACAfAACdDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABpwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAcwFAAAApgYC1QUBAAAAAacGAAAApwYCqAYBAAAAAakGIAAAAAGqBgIAAAABqwYCAAAAAawGAQAAAAGtBiAAAAABAgAAAFUAIEQAAJ8RACAVCAAAhgwAIAsAAIcMACAOAACIDAAgEQAAigwAIBIAAIsMACATAACMDAAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACRBgK8BUAAAAAByQUBAAAAAcoFAQAAAAHqBQEAAAABjAZAAAAAAY0GAQAAAAGOBgEAAAABjwYCAAAAAZEGQAAAAAGSBkAAAAABkwYCAAAAAQIAAAAfACBEAAChEQAgA_MEAQAAAAH_BEAAAAABhgYBAAAAAQrzBAEAAAAB_wRAAAAAAfIFAQAAAAHzBSAAAAAB9AUBAAAAAfUFAQAAAAH2BQIAAAAB9wUCAAAAAfgFAgAAAAH5BQEAAAABAwAAAFMAIEQAAJ8RACBFAACnEQAgFwAAAFMAIAYAAO0MACAHAADuDAAgCgAA7wwAIB4AAPAMACAfAADxDAAgPQAApxEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIacFAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDoCQAhzAUAAOsMpgYi1QUBAOgJACGnBgAA7AynBiKoBgEA6gkAIakGIADGCgAhqgYCAPYJACGrBgIAjAsAIawGAQDoCQAhrQYgAMYKACEVBgAA7QwAIAcAAO4MACAKAADvDAAgHgAA8AwAIB8AAPEMACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGnBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6AkAIcwFAADrDKYGItUFAQDoCQAhpwYAAOwMpwYiqAYBAOoJACGpBiAAxgoAIaoGAgD2CQAhqwYCAIwLACGsBgEA6AkAIa0GIADGCgAhAwAAAB0AIEQAAKERACBFAACqEQAgFwAAAB0AIAgAAN0LACALAADeCwAgDgAA3wsAIBEAAOELACASAADiCwAgEwAA4wsAID0AAKoRACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACHqBQEA6AkAIYwGQADrCQAhjQYBAOgJACGOBgEA6gkAIY8GAgD2CQAhkQZAAOsJACGSBkAA6wkAIZMGAgD2CQAhFQgAAN0LACALAADeCwAgDgAA3wsAIBEAAOELACASAADiCwAgEwAA4wsAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADcC5EGIrwFQADsCQAhyQUBAOoJACHKBQEA6gkAIeoFAQDoCQAhjAZAAOsJACGNBgEA6AkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACEGCgAAzgwAIPMEAQAAAAGaBgIAAAABoAYBAAAAAaEGAQAAAAGiBiAAAAABAgAAABMAIEQAAKsRACAOCQAA0wsAIBAAANILACAXAADVCwAgGgAA1gsAIPMEAQAAAAH0BAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAIwGAocGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGMBkAAAAABAgAAACQAIEQAAK0RACADAAAAEQAgRAAAqxEAIEUAALERACAIAAAAEQAgCgAAwwwAID0AALERACDzBAEA6AkAIZoGAgD2CQAhoAYBAOgJACGhBgEA6AkAIaIGIADGCgAhBgoAAMMMACDzBAEA6AkAIZoGAgD2CQAhoAYBAOgJACGhBgEA6AkAIaIGIADGCgAhAwAAACIAIEQAAK0RACBFAAC0EQAgEAAAACIAIAkAALELACAQAACwCwAgFwAAswsAIBoAALQLACA9AAC0EQAg8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAArwuMBiKHBgEA6AkAIYgGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhDgkAALELACAQAACwCwAgFwAAswsAIBoAALQLACDzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIocGAQDoCQAhiAYBAOoJACGJBgEA6gkAIYoGAQDqCQAhjAZAAOsJACEdBgAA7g8AIAwAAPYPACAgAAD1DwAgJQAA-Q8AICYAAO8PACAnAADwDwAgKAAA8Q8AICkAAPIPACAqAADzDwAgKwAA9A8AICwAAPcPACAuAAD6DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAAtREAIA4JAADTCwAgEAAA0gsAIBQAANQLACAaAADWCwAg8wQBAAAAAfQEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAjAYChwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYwGQAAAAAECAAAAJAAgRAAAtxEAIAMAAAAbACBEAAC1EQAgRQAAuxEAIB8AAAAbACAGAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACA9AAC7EQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC4AAMoOACAvAADLDgAgNgAAzA4AIDcAAM0OACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhAwAAACIAIEQAALcRACBFAAC-EQAgEAAAACIAIAkAALELACAQAACwCwAgFAAAsgsAIBoAALQLACA9AAC-EQAg8wQBAOgJACH0BAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAArwuMBiKHBgEA6AkAIYgGAQDqCQAhiQYBAOoJACGKBgEA6gkAIYwGQADrCQAhDgkAALELACAQAACwCwAgFAAAsgsAIBoAALQLACDzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIocGAQDoCQAhiAYBAOoJACGJBgEA6gkAIYoGAQDqCQAhjAZAAOsJACEKCQAAvAwAIPMEAQAAAAH_BEAAAAAB9QUBAAAAAfgFAgAAAAGHBgEAAAABnAYBAAAAAZ0GIAAAAAGeBgIAAAABnwYCAAAAAQIAAABAACBEAAC_EQAgDgkAANMLACAQAADSCwAgFAAA1AsAIBcAANULACDzBAEAAAAB9AQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACMBgKHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABjAZAAAAAAQIAAAAkACBEAADBEQAgAwAAAD4AIEQAAL8RACBFAADFEQAgDAAAAD4AIAkAALEMACA9AADFEQAg8wQBAOgJACH_BEAA7AkAIfUFAQDoCQAh-AUCAPYJACGHBgEA6AkAIZwGAQDqCQAhnQYgAMYKACGeBgIAjAsAIZ8GAgCMCwAhCgkAALEMACDzBAEA6AkAIf8EQADsCQAh9QUBAOgJACH4BQIA9gkAIYcGAQDoCQAhnAYBAOoJACGdBiAAxgoAIZ4GAgCMCwAhnwYCAIwLACEDAAAAIgAgRAAAwREAIEUAAMgRACAQAAAAIgAgCQAAsQsAIBAAALALACAUAACyCwAgFwAAswsAID0AAMgRACDzBAEA6AkAIfQEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACvC4wGIocGAQDoCQAhiAYBAOoJACGJBgEA6gkAIYoGAQDqCQAhjAZAAOsJACEOCQAAsQsAIBAAALALACAUAACyCwAgFwAAswsAIPMEAQDoCQAh9AQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAK8LjAYihwYBAOgJACGIBgEA6gkAIYkGAQDqCQAhigYBAOoJACGMBkAA6wkAIR8EAADqDQAgBQAA4w0AIAYAAOQNACAHAADlDQAgDAAA6A0AIB8AAOYNACAgAADnDQAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACzBgKnBQEAAAABqAUBAAAAAa4FQAAAAAGxBUAAAAABtQUBAAAAAdUFAQAAAAHsBQIAAAABrAYBAAAAAa4GAQAAAAGvBgIAAAABsAYCAAAAAbEGAgAAAAGzBkAAAAABtAZAAAAAAbUGIAAAAAG2BiAAAAABtwYgAAAAAbgGAgAAAAG5BiAAAAABugYBAAAAAQIAAAAHACBEAADJEQAgFQgAAIYMACALAACHDAAgDgAAiAwAIA8AAIkMACASAACLDAAgEwAAjAwAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAAkQYCvAVAAAAAAckFAQAAAAHKBQEAAAAB6gUBAAAAAYwGQAAAAAGNBgEAAAABjgYBAAAAAY8GAgAAAAGRBkAAAAABkgZAAAAAAZMGAgAAAAECAAAAHwAgRAAAyxEAIAMAAAAFACBEAADJEQAgRQAAzxEAICEAAAAFACAEAAClDQAgBQAApg0AIAYAAKcNACAHAACoDQAgDAAAqw0AIB8AAKkNACAgAACqDQAgPQAAzxEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACEfBAAApQ0AIAUAAKYNACAGAACnDQAgBwAAqA0AIAwAAKsNACAfAACpDQAgIAAAqg0AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACkDbMGIqcFAQDoCQAhqAUBAOgJACGuBUAA6wkAIbEFQADrCQAhtQUBAOoJACHVBQEA6AkAIewFAgD2CQAhrAYBAOgJACGuBgEA6gkAIa8GAgD2CQAhsAYCAPYJACGxBgIA9gkAIbMGQADrCQAhtAZAAOsJACG1BiAAxgoAIbYGIADGCgAhtwYgAMYKACG4BgIA9gkAIbkGIADGCgAhugYBAOoJACEDAAAAHQAgRAAAyxEAIEUAANIRACAXAAAAHQAgCAAA3QsAIAsAAN4LACAOAADfCwAgDwAA4AsAIBIAAOILACATAADjCwAgPQAA0hEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADcC5EGIrwFQADsCQAhyQUBAOoJACHKBQEA6gkAIeoFAQDoCQAhjAZAAOsJACGNBgEA6AkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACEVCAAA3QsAIAsAAN4LACAOAADfCwAgDwAA4AsAIBIAAOILACATAADjCwAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAANwLkQYivAVAAOwJACHJBQEA6gkAIcoFAQDqCQAh6gUBAOgJACGMBkAA6wkAIY0GAQDoCQAhjgYBAOoJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRUIAACGDAAgCwAAhwwAIA4AAIgMACAPAACJDAAgEQAAigwAIBIAAIsMACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAJEGArwFQAAAAAHJBQEAAAABygUBAAAAAeoFAQAAAAGMBkAAAAABjQYBAAAAAY4GAQAAAAGPBgIAAAABkQZAAAAAAZIGQAAAAAGTBgIAAAABAgAAAB8AIEQAANMRACADAAAAHQAgRAAA0xEAIEUAANcRACAXAAAAHQAgCAAA3QsAIAsAAN4LACAOAADfCwAgDwAA4AsAIBEAAOELACASAADiCwAgPQAA1xEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADcC5EGIrwFQADsCQAhyQUBAOoJACHKBQEA6gkAIeoFAQDoCQAhjAZAAOsJACGNBgEA6AkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACEVCAAA3QsAIAsAAN4LACAOAADfCwAgDwAA4AsAIBEAAOELACASAADiCwAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAANwLkQYivAVAAOwJACHJBQEA6gkAIcoFAQDqCQAh6gUBAOgJACGMBkAA6wkAIY0GAQDoCQAhjgYBAOoJACGPBgIA9gkAIZEGQADrCQAhkgZAAOsJACGTBgIA9gkAIRABAACeDgAgIQAAnw4AICIAAKAOACAlAACiDgAg8wQBAAAAAf8EQAAAAAGABUAAAAABnwUBAAAAAagFAQAAAAGxBUAAAAABtQUBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGIAAAAAHLBgEAAAABAgAAAJcCACBEAADYEQAgD_MEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA2AUCtwUBAAAAAcgFgAAAAAHPBQAAAM8FAtUFAQAAAAHYBQQAAAAB2QUBAAAAAdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FQAAAAAHeBUAAAAABAwAAAAMAIEQAANgRACBFAADdEQAgEgAAAAMAIAEAAPYNACAhAAD3DQAgIgAA-A0AICUAAPoNACA9AADdEQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIcsGAQDoCQAhEAEAAPYNACAhAAD3DQAgIgAA-A0AICUAAPoNACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGfBQEA6AkAIagFAQDoCQAhsQVAAOsJACG1BQEA6gkAIccGAQDqCQAhyAYBAOoJACHJBgEA6gkAIcoGIADGCgAhywYBAOgJACENBgAA-woAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4gUC1QUBAAAAAeAFAAAA4AUC4gUBAAAAAeMFAQAAAAHkBUAAAAAB5QVAAAAAAeYFIAAAAAHnBUAAAAABAgAAAIUFACBEAADeEQAgEAEAAJ4OACAhAACfDgAgIgAAoA4AICQAAKEOACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGfBQEAAAABqAUBAAAAAbEFQAAAAAG1BQEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYgAAAAAcsGAQAAAAECAAAAlwIAIEQAAOARACAdBgAA7g8AIAwAAPYPACAgAAD1DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKQAA8g8AICoAAPMPACArAAD0DwAgLAAA9w8AIC0AAPgPACAuAAD6DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAA4hEAIAMAAABXACBEAADeEQAgRQAA5hEAIA8AAABXACAGAADtCgAgPQAA5hEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADsCuIFItUFAQDoCQAh4AUAAOsK4AUi4gUBAOoJACHjBQEA6gkAIeQFQADrCQAh5QVAAOsJACHmBSAAxgoAIecFQADrCQAhDQYAAO0KACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA7AriBSLVBQEA6AkAIeAFAADrCuAFIuIFAQDqCQAh4wUBAOoJACHkBUAA6wkAIeUFQADrCQAh5gUgAMYKACHnBUAA6wkAIQMAAAADACBEAADgEQAgRQAA6REAIBIAAAADACABAAD2DQAgIQAA9w0AICIAAPgNACAkAAD5DQAgPQAA6REAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZ8FAQDoCQAhqAUBAOgJACGxBUAA6wkAIbUFAQDqCQAhxwYBAOoJACHIBgEA6gkAIckGAQDqCQAhygYgAMYKACHLBgEA6AkAIRABAAD2DQAgIQAA9w0AICIAAPgNACAkAAD5DQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbEFQADrCQAhtQUBAOoJACHHBgEA6gkAIcgGAQDqCQAhyQYBAOoJACHKBiAAxgoAIcsGAQDoCQAhAwAAABsAIEQAAOIRACBFAADsEQAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AAOwRACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdBgAA7g8AIAwAAPYPACAgAAD1DwAgJQAA-Q8AICYAAO8PACAnAADwDwAgKAAA8Q8AICkAAPIPACAqAADzDwAgKwAA9A8AICwAAPcPACAtAAD4DwAgLwAA-w8AIDYAAPwPACA3AAD9DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAA7REAIAMAAAAbACBEAADtEQAgRQAA8REAIB8AAAAbACAGAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAvAADLDgAgNgAAzA4AIDcAAM0OACA9AADxEQAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAvAADLDgAgNgAAzA4AIDcAAM0OACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAO4PACAMAAD2DwAgIAAA9Q8AICUAAPkPACAmAADvDwAgJwAA8A8AICgAAPEPACApAADyDwAgKgAA8w8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACA2AAD8DwAgNwAA_Q8AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4AYCnwUBAAAAAaAFAQAAAAGxBUAAAAABzwUAAADhBgK9BgEAAAAB3AYBAAAAAd4GAAAA3gYC4QYgAAAAAeIGIAAAAAHjBkAAAAABAgAAAAEAIEQAAPIRACADAAAAGwAgRAAA8hEAIEUAAPYRACAfAAAAGwAgBgAAvg4AIAwAAMYOACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIDYAAMwOACA3AADNDgAgPQAA9hEAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdBgAAvg4AIAwAAMYOACAgAADFDgAgJQAAyQ4AICYAAL8OACAnAADADgAgKAAAwQ4AICkAAMIOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIDYAAMwOACA3AADNDgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAADuDwAgDAAA9g8AICAAAPUPACAlAAD5DwAgJgAA7w8AICcAAPAPACAoAADxDwAgKgAA8w8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNgAA_A8AIDcAAP0PACDzBAEAAAAB_wRAAAAAAYAFQAAAAAGYBQAAAOAGAp8FAQAAAAGgBQEAAAABsQVAAAAAAc8FAAAA4QYCvQYBAAAAAdwGAQAAAAHeBgAAAN4GAuEGIAAAAAHiBiAAAAAB4wZAAAAAAQIAAAABACBEAAD3EQAgAwAAABsAIEQAAPcRACBFAAD7EQAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AID0AAPsRACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACAqAADDDgAgKwAAxA4AICwAAMcOACAtAADIDgAgLgAAyg4AIC8AAMsOACA2AADMDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEdBgAA7g8AIAwAAPYPACAgAAD1DwAgJQAA-Q8AICYAAO8PACAnAADwDwAgKAAA8Q8AICkAAPIPACAqAADzDwAgKwAA9A8AICwAAPcPACAtAAD4DwAgLgAA-g8AIC8AAPsPACA2AAD8DwAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAADgBgKfBQEAAAABoAUBAAAAAbEFQAAAAAHPBQAAAOEGAr0GAQAAAAHcBgEAAAAB3gYAAADeBgLhBiAAAAAB4gYgAAAAAeMGQAAAAAECAAAAAQAgRAAA_BEAIAMAAAAbACBEAAD8EQAgRQAAgBIAIB8AAAAbACAGAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACA9AACAEgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAALwO4AYinwUBAOgJACGgBQEA6AkAIbEFQADrCQAhzwUAAL0O4QYivQYBAOoJACHcBgEA6gkAId4GAAC7Dt4GIuEGIADGCgAh4gYgAMYKACHjBkAA6wkAIR0GAAC-DgAgDAAAxg4AICAAAMUOACAlAADJDgAgJgAAvw4AICcAAMAOACAoAADBDgAgKQAAwg4AICoAAMMOACArAADEDgAgLAAAxw4AIC0AAMgOACAuAADKDgAgLwAAyw4AIDYAAMwOACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhDfMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAArQUCpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGtBQIAAAABrgVAAAAAAa8FAQAAAAGxBUAAAAABAaUFAQAAAAEG8wQBAAAAAf8EQAAAAAGABUAAAAABnwUBAAAAAagFAQAAAAG1BQEAAAABAgAAAKoGACBEAACDEgAgHQYAAO4PACAMAAD2DwAgIAAA9Q8AICUAAPkPACAmAADvDwAgJwAA8A8AICgAAPEPACApAADyDwAgKgAA8w8AICsAAPQPACAsAAD3DwAgLQAA-A8AIC4AAPoPACAvAAD7DwAgNwAA_Q8AIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAA4AYCnwUBAAAAAaAFAQAAAAGxBUAAAAABzwUAAADhBgK9BgEAAAAB3AYBAAAAAd4GAAAA3gYC4QYgAAAAAeIGIAAAAAHjBkAAAAABAgAAAAEAIEQAAIUSACABpgUBAAAAAQMAAACtBgAgRAAAgxIAIEUAAIoSACAIAAAArQYAID0AAIoSACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGfBQEA6AkAIagFAQDoCQAhtQUBAOoJACEG8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhnwUBAOgJACGoBQEA6AkAIbUFAQDqCQAhAwAAABsAIEQAAIUSACBFAACNEgAgHwAAABsAIAYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNwAAzQ4AID0AAI0SACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAAvA7gBiKfBQEA6AkAIaAFAQDoCQAhsQVAAOsJACHPBQAAvQ7hBiK9BgEA6gkAIdwGAQDqCQAh3gYAALsO3gYi4QYgAMYKACHiBiAAxgoAIeMGQADrCQAhHQYAAL4OACAMAADGDgAgIAAAxQ4AICUAAMkOACAmAAC_DgAgJwAAwA4AICgAAMEOACApAADCDgAgKgAAww4AICsAAMQOACAsAADHDgAgLQAAyA4AIC4AAMoOACAvAADLDgAgNwAAzQ4AIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAAC8DuAGIp8FAQDoCQAhoAUBAOgJACGxBUAA6wkAIc8FAAC9DuEGIr0GAQDqCQAh3AYBAOoJACHeBgAAuw7eBiLhBiAAxgoAIeIGIADGCgAh4wZAAOsJACEE8wQBAAAAAf8EQAAAAAGfBQEAAAABqAUBAAAAAQIAAADDBgAgRAAAjhIAIBAwAACXCgAgMgAAmAoAIPMEAQAAAAH_BEAAAAABgAVAAAAAAZgFAAAArQUCpwUBAAAAAagFAQAAAAGpBQEAAAABqgUBAAAAAasFAQAAAAGtBQIAAAABrgVAAAAAAa8FAQAAAAGwBQEAAAABsQVAAAAAAQIAAACJAQAgRAAAkBIAIAMAAADGBgAgRAAAjhIAIEUAAJQSACAGAAAAxgYAID0AAJQSACDzBAEA6AkAIf8EQADsCQAhnwUBAOgJACGoBQEA6AkAIQTzBAEA6AkAIf8EQADsCQAhnwUBAOgJACGoBQEA6AkAIQMAAACHAQAgRAAAkBIAIEUAAJcSACASAAAAhwEAIDAAAIgKACAyAACJCgAgPQAAlxIAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAACHCq0FIqcFAQDoCQAhqAUBAOgJACGpBQEA6AkAIaoFAQDoCQAhqwUBAOoJACGtBQIA9gkAIa4FQADrCQAhrwUBAOgJACGwBQEA6AkAIbEFQADrCQAhEDAAAIgKACAyAACJCgAg8wQBAOgJACH_BEAA7AkAIYAFQADsCQAhmAUAAIcKrQUipwUBAOgJACGoBQEA6AkAIakFAQDoCQAhqgUBAOgJACGrBQEA6gkAIa0FAgD2CQAhrgVAAOsJACGvBQEA6AkAIbAFAQDoCQAhsQVAAOsJACEVCAAAhgwAIAsAAIcMACAOAACIDAAgDwAAiQwAIBEAAIoMACATAACMDAAg8wQBAAAAAf8EQAAAAAGABUAAAAABmAUAAACRBgK8BUAAAAAByQUBAAAAAcoFAQAAAAHqBQEAAAABjAZAAAAAAY0GAQAAAAGOBgEAAAABjwYCAAAAAZEGQAAAAAGSBkAAAAABkwYCAAAAAQIAAAAfACBEAACYEgAgAwAAAB0AIEQAAJgSACBFAACcEgAgFwAAAB0AIAgAAN0LACALAADeCwAgDgAA3wsAIA8AAOALACARAADhCwAgEwAA4wsAID0AAJwSACDzBAEA6AkAIf8EQADsCQAhgAVAAOwJACGYBQAA3AuRBiK8BUAA7AkAIckFAQDqCQAhygUBAOoJACHqBQEA6AkAIYwGQADrCQAhjQYBAOgJACGOBgEA6gkAIY8GAgD2CQAhkQZAAOsJACGSBkAA6wkAIZMGAgD2CQAhFQgAAN0LACALAADeCwAgDgAA3wsAIA8AAOALACARAADhCwAgEwAA4wsAIPMEAQDoCQAh_wRAAOwJACGABUAA7AkAIZgFAADcC5EGIrwFQADsCQAhyQUBAOoJACHKBQEA6gkAIeoFAQDoCQAhjAZAAOsJACGNBgEA6AkAIY4GAQDqCQAhjwYCAPYJACGRBkAA6wkAIZIGQADrCQAhkwYCAPYJACERBgQCDHgKDQAtIHcLJX0bJmceJ2sfKG8gKXMhKnUiK3YDLHkFLXwRLoEBIy-FASQ2igElN5cBLAYBAAENAB0hCAMiVgUkWBolYBsJBAkDBQoDBgACBwABDEoKDQAZGE0NHw4EIEkLAggAAwkABQcGAAIHAAEKEAYNABgPQwkeQRMfQgQDCQAFDQAXHRQHAwoABg0AFhwYCAIVAAkbAAcGCQAFDQAVEAAKFDAIFzIRGjcSCAgAAwsAAQ0AEA4aCw8lCREnDRIpDhMtDwQIAAMLHAEMIAoNAAwBDCEAAggAAxAACgEQAAoBEAAKAg8uABMvAAIVAAkWMwECFQAJGQATAwkABQ0AFBg4EgEYOQACFDoAGjsAARw8AAEdPQADD0YAHkQAH0UABQVOAAxRABhSAB9PACBQAAMGAAINABwlXBsDBl0CIwABJF4aASVfAAMhYQAiYgAlYwABIwABASMAAQEjAAEBIwABASMAAQEjAAEBI4YBAQQNACswAAEyACY1kAEoAg0AJzGLASUBMYwBAAIzACU0ACkCDQAqMZEBKAExkgEAATWTAQABIwABDgyeAQAgnQEAJaEBACaYAQAnmQEAKJoBACmbAQArnAEALJ8BAC2gAQAuogEAL6MBADakAQA3pQEAAAAAAw0AMkoAM0sANAAAAAMNADJKADNLADQBIwABASMAAQMNADlKADpLADsAAAADDQA5SgA6SwA7ASMAAQEjAAEDDQBASgBBSwBCAAAAAw0AQEoAQUsAQgEjAAEBIwABAw0AR0oASEsASQAAAAMNAEdKAEhLAEkAAAADDQBPSgBQSwBRAAAAAw0AT0oAUEsAUQEBAAEBAQABAw0AVkoAV0sAWAAAAAMNAFZKAFdLAFgBIwABASMAAQUNAF1KAGBLAGGsAQBerQEAXwAAAAAABQ0AXUoAYEsAYawBAF6tAQBfAwTRAgMGAAIHAAEDBNcCAwYAAgcAAQUNAGZKAGlLAGqsAQBnrQEAaAAAAAAABQ0AZkoAaUsAaqwBAGetAQBoAgYAAgcAAQIGAAIHAAEFDQBvSgBySwBzrAEAcK0BAHEAAAAAAAUNAG9KAHJLAHOsAQBwrQEAcQEJAAUBCQAFAw0AeEoAeUsAegAAAAMNAHhKAHlLAHoBCgAGAQoABgUNAH9KAIIBSwCDAawBAIABrQEAgQEAAAAAAAUNAH9KAIIBSwCDAawBAIABrQEAgQEBCQAFAQkABQUNAIgBSgCLAUsAjAGsAQCJAa0BAIoBAAAAAAAFDQCIAUoAiwFLAIwBrAEAiQGtAQCKAQIIAAMJAAUCCAADCQAFBQ0AkQFKAJQBSwCVAawBAJIBrQEAkwEAAAAAAAUNAJEBSgCUAUsAlQGsAQCSAa0BAJMBAggAAwvZAwECCAADC98DAQMNAJoBSgCbAUsAnAEAAAADDQCaAUoAmwFLAJwBAwgAAwsAAQ7xAwsDCAADCwABDvcDCwUNAKEBSgCkAUsApQGsAQCiAa0BAKMBAAAAAAAFDQChAUoApAFLAKUBrAEAogGtAQCjAQIJAAUQAAoCCQAFEAAKAw0AqgFKAKsBSwCsAQAAAAMNAKoBSgCrAUsArAECFQAJGwAHAhUACRsABwMNALEBSgCyAUsAswEAAAADDQCxAUoAsgFLALMBAhUACRa1BAECFQAJFrsEAQUNALgBSgC7AUsAvAGsAQC5Aa0BALoBAAAAAAAFDQC4AUoAuwFLALwBrAEAuQGtAQC6AQIVAAkZABMCFQAJGQATBQ0AwQFKAMQBSwDFAawBAMIBrQEAwwEAAAAAAAUNAMEBSgDEAUsAxQGsAQDCAa0BAMMBAggAAxAACgIIAAMQAAoFDQDKAUoAzQFLAM4BrAEAywGtAQDMAQAAAAAABQ0AygFKAM0BSwDOAawBAMsBrQEAzAEBEAAKARAACgMNANMBSgDUAUsA1QEAAAADDQDTAUoA1AFLANUBAQYAAgEGAAIDDQDaAUoA2wFLANwBAAAAAw0A2gFKANsBSwDcAQMGpwUCIwABJKgFGgMGrgUCIwABJK8FGgUNAOEBSgDkAUsA5QGsAQDiAa0BAOMBAAAAAAAFDQDhAUoA5AFLAOUBrAEA4gGtAQDjAQAAAAUNAOsBSgDuAUsA7wGsAQDsAa0BAO0BAAAAAAAFDQDrAUoA7gFLAO8BrAEA7AGtAQDtAQEjAAEBIwABAw0A9AFKAPUBSwD2AQAAAAMNAPQBSgD1AUsA9gEBI_AFAQEj9gUBAw0A-wFKAPwBSwD9AQAAAAMNAPsBSgD8AUsA_QEBIwABASMAAQMNAIICSgCDAksAhAIAAAADDQCCAkoAgwJLAIQCASMAAQEjAAEFDQCJAkoAjAJLAI0CrAEAigKtAQCLAgAAAAAABQ0AiQJKAIwCSwCNAqwBAIoCrQEAiwIAAAMNAJICSgCTAksAlAIAAAADDQCSAkoAkwJLAJQCAAADDQCZAkoAmgJLAJsCAAAAAw0AmQJKAJoCSwCbAgIwAAEyACYCMAABMgAmBQ0AoAJKAKMCSwCkAqwBAKECrQEAogIAAAAAAAUNAKACSgCjAksApAKsAQChAq0BAKICAjMAJTQAKQIzACU0ACkDDQCpAkoAqgJLAKsCAAAAAw0AqQJKAKoCSwCrAgAAAAMNALECSgCyAksAswIAAAADDQCxAkoAsgJLALMCAAAABQ0AuQJKALwCSwC9AqwBALoCrQEAuwIAAAAAAAUNALkCSgC8AksAvQKsAQC6Aq0BALsCARAACgEQAAoDDQDCAkoAwwJLAMQCAAAAAw0AwgJKAMMCSwDEAjgCATmmAQE6qAEBO6kBATyqAQE-rAEBP64BLkCvAS9BsQEBQrMBLkO0ATBGtQEBR7YBAUi3AS5MugExTbsBNU68AR5PvQEeUL4BHlG_AR5SwAEeU8IBHlTEAS5VxQE2VscBHlfJAS5YygE3WcsBHlrMAR5bzQEuXNABOF3RATxe0gEgX9MBIGDUASBh1QEgYtYBIGPYASBk2gEuZdsBPWbdASBn3wEuaOABPmnhASBq4gEga-MBLmzmAT9t5wFDbugBH2_pAR9w6gEfcesBH3LsAR9z7gEfdPABLnXxAUR28wEfd_UBLnj2AUV59wEfevgBH3v5AS58_AFGff0BSn7_AUt_gAJLgAGDAkuBAYQCS4IBhQJLgwGHAkuEAYkCLoUBigJMhgGMAkuHAY4CLogBjwJNiQGQAkuKAZECS4sBkgIujAGVAk6NAZYCUo4BmAICjwGZAgKQAZsCApEBnAICkgGdAgKTAZ8CApQBoQIulQGiAlOWAaQCApcBpgIumAGnAlSZAagCApoBqQICmwGqAi6cAa0CVZ0BrgJZngGwAiKfAbECIqABswIioQG0AiKiAbUCIqMBtwIipAG5Ai6lAboCWqYBvAIipwG-Ai6oAb8CW6kBwAIiqgHBAiKrAcICLq4BxQJcrwHGAmKwAccCA7EByAIDsgHJAgOzAcoCA7QBywIDtQHNAgO2Ac8CLrcB0AJjuAHTAgO5AdUCLroB1gJkuwHYAgO8AdkCA70B2gIuvgHdAmW_Ad4Ca8AB3wIFwQHgAgXCAeECBcMB4gIFxAHjAgXFAeUCBcYB5wIuxwHoAmzIAeoCBckB7AIuygHtAm3LAe4CBcwB7wIFzQHwAi7OAfMCbs8B9AJ00AH2AgbRAfcCBtIB-QIG0wH6AgbUAfsCBtUB_QIG1gH_Ai7XAYADddgBggMG2QGEAy7aAYUDdtsBhgMG3AGHAwbdAYgDLt4BiwN33wGMA3vgAY0DB-EBjgMH4gGPAwfjAZADB-QBkQMH5QGTAwfmAZUDLucBlgN86AGYAwfpAZoDLuoBmwN96wGcAwfsAZ0DB-0BngMu7gGhA37vAaIDhAHwAaMDE_EBpAMT8gGlAxPzAaYDE_QBpwMT9QGpAxP2AasDLvcBrAOFAfgBrgMT-QGwAy76AbEDhgH7AbIDE_wBswMT_QG0Ay7-AbcDhwH_AbgDjQGAArkDBIECugMEggK7AwSDArwDBIQCvQMEhQK_AwSGAsEDLocCwgOOAYgCxAMEiQLGAy6KAscDjwGLAsgDBIwCyQMEjQLKAy6OAs0DkAGPAs4DlgGQAs8DC5EC0AMLkgLRAwuTAtIDC5QC0wMLlQLVAwuWAtcDLpcC2AOXAZgC2wMLmQLdAy6aAt4DmAGbAuADC5wC4QMLnQLiAy6eAuUDmQGfAuYDnQGgAucDCqEC6AMKogLpAwqjAuoDCqQC6wMKpQLtAwqmAu8DLqcC8AOeAagC8wMKqQL1Ay6qAvYDnwGrAvgDCqwC-QMKrQL6Ay6uAv0DoAGvAv4DpgGwAv8DCbECgAQJsgKBBAmzAoIECbQCgwQJtQKFBAm2AocELrcCiASnAbgCigQJuQKMBC66Ao0EqAG7Ao4ECbwCjwQJvQKQBC6-ApMEqQG_ApQErQHAApUECMEClgQIwgKXBAjDApgECMQCmQQIxQKbBAjGAp0ELscCngSuAcgCoAQIyQKiBC7KAqMErwHLAqQECMwCpQQIzQKmBC7OAqkEsAHPAqoEtAHQAqsEEdECrAQR0gKtBBHTAq4EEdQCrwQR1QKxBBHWArMELtcCtAS1AdgCtwQR2QK5BC7aAroEtgHbArwEEdwCvQQR3QK-BC7eAsEEtwHfAsIEvQHgAsMEEuECxAQS4gLFBBLjAsYEEuQCxwQS5QLJBBLmAssELucCzAS-AegCzgQS6QLQBC7qAtEEvwHrAtIEEuwC0wQS7QLUBC7uAtcEwAHvAtgExgHwAtkEDfEC2gQN8gLbBA3zAtwEDfQC3QQN9QLfBA32AuEELvcC4gTHAfgC5AQN-QLmBC76AucEyAH7AugEDfwC6QQN_QLqBC7-Au0EyQH_Au4EzwGAA-8ED4ED8AQPggPxBA-DA_IED4QD8wQPhQP1BA-GA_cELocD-ATQAYgD-gQPiQP8BC6KA_0E0QGLA_4ED4wD_wQPjQOABS6OA4MF0gGPA4QF1gGQA4YFGpEDhwUakgOJBRqTA4oFGpQDiwUalQONBRqWA48FLpcDkAXXAZgDkgUamQOUBS6aA5UF2AGbA5YFGpwDlwUanQOYBS6eA5sF2QGfA5wF3QGgA50FG6EDngUbogOfBRujA6AFG6QDoQUbpQOjBRumA6UFLqcDpgXeAagDqgUbqQOsBS6qA60F3wGrA7AFG6wDsQUbrQOyBS6uA7UF4AGvA7YF5gGwA7gF5wGxA7kF5wGyA7wF5wGzA70F5wG0A74F5wG1A8AF5wG2A8IFLrcDwwXoAbgDxQXnAbkDxwUuugPIBekBuwPJBecBvAPKBecBvQPLBS6-A84F6gG_A88F8AHAA9AFI8ED0QUjwgPSBSPDA9MFI8QD1AUjxQPWBSPGA9gFLscD2QXxAcgD2wUjyQPdBS7KA94F8gHLA98FI8wD4AUjzQPhBS7OA-QF8wHPA-UF9wHQA-YFJNED5wUk0gPoBSTTA-kFJNQD6gUk1QPsBSTWA-4FLtcD7wX4AdgD8gUk2QP0BS7aA_UF-QHbA_cFJNwD-AUk3QP5BS7eA_wF-gHfA_0F_gHgA_4FIeED_wUh4gOABiHjA4EGIeQDggYh5QOEBiHmA4YGLucDhwb_AegDiQYh6QOLBi7qA4wGgALrA40GIewDjgYh7QOPBi7uA5IGgQLvA5MGhQLwA5QGLPEDlQYs8gOWBizzA5cGLPQDmAYs9QOaBiz2A5wGLvcDnQaGAvgDnwYs-QOhBi76A6IGhwL7A6MGLPwDpAYs_QOlBi7-A6gGiAL_A6kGjgKABKsGJoEErAYmggSvBiaDBLAGJoQEsQYmhQSzBiaGBLUGLocEtgaPAogEuAYmiQS6Bi6KBLsGkAKLBLwGJowEvQYmjQS-Bi6OBMEGkQKPBMIGlQKQBMQGKZEExQYpkgTIBimTBMkGKZQEygYplQTMBimWBM4GLpcEzwaWApgE0QYpmQTTBi6aBNQGlwKbBNUGKZwE1gYpnQTXBi6eBNoGmAKfBNsGnAKgBNwGJaEE3QYlogTeBiWjBN8GJaQE4AYlpQTiBiWmBOQGLqcE5QadAqgE5wYlqQTpBi6qBOoGngKrBOsGJawE7AYlrQTtBi6uBPAGnwKvBPEGpQKwBPIGKLEE8wYosgT0BiizBPUGKLQE9gYotQT4Bii2BPoGLrcE-wamArgE_QYouQT_Bi66BIAHpwK7BIEHKLwEggcovQSDBy6-BIYHqAK_BIcHrALABIkHrQLBBIoHrQLCBI0HrQLDBI4HrQLEBI8HrQLFBJEHrQLGBJMHLscElAeuAsgElgetAskEmAcuygSZB68CywSaB60CzASbB60CzQScBy7OBJ8HsALPBKAHtALQBKIHtQLRBKMHtQLSBKYHtQLTBKcHtQLUBKgHtQLVBKoHtQLWBKwHLtcErQe2AtgErwe1AtkEsQcu2gSyB7cC2wSzB7UC3AS0B7UC3QS1By7eBLgHuALfBLkHvgLgBLsHDuEEvAcO4gS-Bw7jBL8HDuQEwAcO5QTCBw7mBMQHLucExQe_AugExwcO6QTJBy7qBMoHwALrBMsHDuwEzAcO7QTNBy7uBNAHwQLvBNEHxQI"
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
  AttemptReportScalarFieldEnum: () => AttemptReportScalarFieldEnum,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  AutomationEventScalarFieldEnum: () => AutomationEventScalarFieldEnum,
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
  ContactMessage: "ContactMessage",
  AutomationEvent: "AutomationEvent",
  AttemptReport: "AttemptReport"
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
  resumeParsedAt: "resumeParsedAt",
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
  rubric: "rubric",
  isAiGenerated: "isAiGenerated",
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
  completedAt: "completedAt",
  reminderSentAt: "reminderSentAt"
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
  aiScore: "aiScore",
  aiFeedback: "aiFeedback",
  aiModel: "aiModel",
  aiEvaluatedAt: "aiEvaluatedAt",
  reviewStatus: "reviewStatus",
  reviewedAt: "reviewedAt",
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
var AutomationEventScalarFieldEnum = {
  id: "id",
  eventType: "eventType",
  aggregateType: "aggregateType",
  aggregateId: "aggregateId",
  dedupeKey: "dedupeKey",
  payload: "payload",
  status: "status",
  retryCount: "retryCount",
  maxRetries: "maxRetries",
  lockedAt: "lockedAt",
  nextRetryAt: "nextRetryAt",
  lastError: "lastError",
  deliveredAt: "deliveredAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AttemptReportScalarFieldEnum = {
  id: "id",
  attemptId: "attemptId",
  riskLevel: "riskLevel",
  riskSummary: "riskSummary",
  summary: "summary",
  strengths: "strengths",
  weaknesses: "weaknesses",
  recommendation: "recommendation",
  aiModel: "aiModel",
  riskAnalyzedAt: "riskAnalyzedAt",
  generatedAt: "generatedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
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
import { Router as Router19 } from "express";

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

// src/app/modules/automation/automation.routes.ts
import { Router as Router18 } from "express";

// src/app/modules/automation/automation.controller.ts
import { StatusCodes as StatusCodes51 } from "http-status-codes";

// src/app/utils/sendResponse.ts
var sendResponse = (res, payload) => {
  const { success, statusCode, message, data, meta } = payload;
  res.status(statusCode).json({ success, statusCode, message, data, ...meta && { meta } });
};

// src/app/modules/automation/automation.const.ts
var AUTOMATION_DISPATCH = {
  BATCH_SIZE: 10,
  REQUEST_TIMEOUT_MS: 8e3,
  LOCK_TIMEOUT_MS: 5 * 60 * 1e3,
  BASE_RETRY_DELAY_SECONDS: 30,
  MAX_RETRY_DELAY_SECONDS: 3600,
  LOCAL_INTERVAL_MS: 5e3
};
var AUTOMATION_EVENT_TYPES = {
  SYSTEM_TEST: "system.test"
};

// src/app/modules/automation/automation.service.ts
import { StatusCodes as StatusCodes50 } from "http-status-codes";

// src/app/modules/automation/automation.signature.ts
import { createHmac, timingSafeEqual as timingSafeEqual2 } from "crypto";
var signAutomationPayload = (body, secret, timestamp) => createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
var safeEqual = (a, b) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual2(aBuffer, bBuffer);
};

// src/app/modules/automation/automation.service.ts
var emitEvent = async (input, db = prisma) => {
  await db.automationEvent.createMany({
    data: [
      {
        eventType: input.eventType,
        aggregateType: input.aggregateType,
        aggregateId: input.aggregateId,
        payload: input.payload,
        dedupeKey: input.dedupeKey ?? null
      }
    ],
    skipDuplicates: true
  });
};
var claimEvents = async (limit) => {
  const now = /* @__PURE__ */ new Date();
  const staleBefore = new Date(
    now.getTime() - AUTOMATION_DISPATCH.LOCK_TIMEOUT_MS
  );
  const claimable = {
    OR: [
      {
        status: "PENDING",
        OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }]
      },
      { status: "PROCESSING", lockedAt: { lt: staleBefore } }
    ]
  };
  const candidates = await prisma.automationEvent.findMany({
    where: claimable,
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true }
  });
  if (candidates.length === 0) return [];
  const ids = candidates.map((candidate) => candidate.id);
  await prisma.automationEvent.updateMany({
    where: { AND: [{ id: { in: ids } }, claimable] },
    data: { status: "PROCESSING", lockedAt: now }
  });
  return prisma.automationEvent.findMany({
    where: { id: { in: ids }, status: "PROCESSING", lockedAt: now },
    orderBy: { createdAt: "asc" }
  });
};
var markDelivered = async (id) => {
  await prisma.automationEvent.update({
    where: { id },
    data: {
      status: "DELIVERED",
      deliveredAt: /* @__PURE__ */ new Date(),
      lockedAt: null,
      lastError: null
    }
  });
};
var markFailedAttempt = async (event, message) => {
  const retryCount = event.retryCount + 1;
  const exhausted = retryCount >= event.maxRetries;
  const delaySeconds = Math.min(
    AUTOMATION_DISPATCH.BASE_RETRY_DELAY_SECONDS * 2 ** retryCount,
    AUTOMATION_DISPATCH.MAX_RETRY_DELAY_SECONDS
  );
  await prisma.automationEvent.update({
    where: { id: event.id },
    data: {
      status: exhausted ? "FAILED" : "PENDING",
      retryCount,
      lockedAt: null,
      lastError: message.slice(0, 500),
      nextRetryAt: exhausted ? null : new Date(Date.now() + delaySeconds * 1e3)
    }
  });
};
var deliverEvent = async (event, webhookUrl, webhookSecret) => {
  const body = JSON.stringify({
    id: event.id,
    type: event.eventType,
    aggregateType: event.aggregateType,
    aggregateId: event.aggregateId,
    occurredAt: event.createdAt.toISOString(),
    data: event.payload
  });
  const timestamp = Date.now().toString();
  const signature = signAutomationPayload(body, webhookSecret, timestamp);
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Event-Type": event.eventType,
        "X-Idempotency-Key": event.id,
        "X-Timestamp": timestamp,
        "X-Signature": `sha256=${signature}`
      },
      body,
      signal: AbortSignal.timeout(AUTOMATION_DISPATCH.REQUEST_TIMEOUT_MS)
    });
    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }
    await markDelivered(event.id);
    return true;
  } catch (error) {
    await markFailedAttempt(
      event,
      error instanceof Error ? error.message : "Unknown delivery error"
    );
    return false;
  }
};
var dispatchPendingEvents = async () => {
  const { webhookUrl, webhookSecret } = config_default.n8n;
  if (!webhookUrl || !webhookSecret) {
    throw new appError_default(
      StatusCodes50.SERVICE_UNAVAILABLE,
      "n8n webhook is not configured.",
      "AUTOMATION_NOT_CONFIGURED"
    );
  }
  const events = await claimEvents(AUTOMATION_DISPATCH.BATCH_SIZE);
  const results = await Promise.all(
    events.map((event) => deliverEvent(event, webhookUrl, webhookSecret))
  );
  const delivered = results.filter(Boolean).length;
  return {
    claimed: events.length,
    delivered,
    failed: events.length - delivered
  };
};
var automationService = {
  emitEvent,
  dispatchPendingEvents
};

// src/app/modules/automation/automation.controller.ts
var dispatch = catchAsync(async (_req, res) => {
  const result = await automationService.dispatchPendingEvents();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes51.OK,
    message: "Automation events dispatched.",
    data: result
  });
});
var emitTestEvent = catchAsync(async (_req, res) => {
  await automationService.emitEvent({
    eventType: AUTOMATION_EVENT_TYPES.SYSTEM_TEST,
    aggregateType: "System",
    aggregateId: "test",
    payload: {
      message: "Hello from Evalora",
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes51.CREATED,
    message: "Test event queued.",
    data: null
  });
});
var automationController = {
  dispatch,
  emitTestEvent
};

// src/app/middlewares/requireAutomationApiKey.ts
import { StatusCodes as StatusCodes52 } from "http-status-codes";
var requireAutomationApiKey = (req, _res, next) => {
  const expected = config_default.n8n.apiKey;
  const provided = req.header("x-api-key");
  if (!expected || !provided || !safeEqual(provided, expected)) {
    return next(
      new appError_default(
        StatusCodes52.UNAUTHORIZED,
        "Invalid or missing API key.",
        "INVALID_API_KEY"
      )
    );
  }
  next();
};

// src/app/modules/automation/automation.routes.ts
var router18 = Router18();
router18.use(requireAutomationApiKey);
router18.post("/dispatch", automationController.dispatch);
router18.post("/test-event", automationController.emitTestEvent);
var automationRoutes = router18;

// src/app/routes/index.ts
var router19 = Router19();
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
  { path: "/contact", route: contactRoutes },
  { path: "/internal/automation", route: automationRoutes }
];
for (const { path: path2, route } of moduleRoutes) {
  router19.use(path2, route);
}
var globalRoutes = router19;

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

// src/app/modules/automation/automation.local.ts
var startLocalDispatcher = () => {
  if (config_default.app.env === "production" || !config_default.n8n.localDispatcher) {
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

// src/server.ts
var PORT = config_default.app.port;
var server;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    server = app_default.listen(PORT, () => {
      console.log(`\u{1F680} Evalora server is running on port ${PORT}`);
      startLocalDispatcher();
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