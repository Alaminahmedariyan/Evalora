-- CreateEnum
CREATE TYPE "AutomationEventStatus" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "AiReviewStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING_REVIEW', 'APPROVED', 'OVERRIDDEN');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterEnum
ALTER TYPE "ConsentType" ADD VALUE 'AI_PROCESSING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'PROCTORING_ALERT';
ALTER TYPE "NotificationType" ADD VALUE 'EVALUATION_REVIEW_NEEDED';

-- AlterTable
ALTER TABLE "assessment_invitations" ADD COLUMN     "reminderSentAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "candidate_profiles" ADD COLUMN     "resumeParsedAt" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "problems" ADD COLUMN     "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rubric" TEXT;

-- AlterTable
ALTER TABLE "submission_evaluations" ADD COLUMN     "aiEvaluatedAt" TIMESTAMPTZ(3),
ADD COLUMN     "aiFeedback" TEXT,
ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiScore" INTEGER,
ADD COLUMN     "reviewStatus" "AiReviewStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
ADD COLUMN     "reviewedAt" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "automation_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "dedupeKey" TEXT,
    "payload" JSONB NOT NULL,
    "status" "AutomationEventStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "lockedAt" TIMESTAMPTZ(3),
    "nextRetryAt" TIMESTAMPTZ(3),
    "lastError" TEXT,
    "deliveredAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "automation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_reports" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "riskLevel" "RiskLevel",
    "riskSummary" TEXT,
    "summary" TEXT,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "recommendation" TEXT,
    "aiModel" TEXT,
    "riskAnalyzedAt" TIMESTAMPTZ(3),
    "generatedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "attempt_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_events_dedupeKey_key" ON "automation_events"("dedupeKey");

-- CreateIndex
CREATE INDEX "automation_events_status_nextRetryAt_idx" ON "automation_events"("status", "nextRetryAt");

-- CreateIndex
CREATE INDEX "automation_events_aggregateType_aggregateId_idx" ON "automation_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "automation_events_createdAt_idx" ON "automation_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_reports_attemptId_key" ON "attempt_reports"("attemptId");

-- CreateIndex
CREATE INDEX "attempt_reports_riskLevel_idx" ON "attempt_reports"("riskLevel");

-- CreateIndex
CREATE INDEX "submission_evaluations_reviewStatus_idx" ON "submission_evaluations"("reviewStatus");

-- AddForeignKey
ALTER TABLE "attempt_reports" ADD CONSTRAINT "attempt_reports_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "assessment_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
