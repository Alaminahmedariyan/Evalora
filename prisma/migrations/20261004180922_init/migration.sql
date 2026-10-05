-- AlterTable
ALTER TABLE "candidate_profiles" ADD COLUMN     "isVisibleToRecruiters" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "candidate_profiles_isVisibleToRecruiters_deletedAt_idx" ON "candidate_profiles"("isVisibleToRecruiters", "deletedAt");
