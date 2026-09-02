/*
  Warnings:

  - A unique constraint covering the columns `[issuer,accountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issuer` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "accounts_providerId_accountId_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "issuer" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "accounts_providerId_idx" ON "accounts"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_issuer_accountId_key" ON "accounts"("issuer", "accountId");
