/*
  Warnings:

  - You are about to drop the column `uploaded` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Tutor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_uploaded_idx";

-- DropIndex
DROP INDEX "Material_uploaded_idx";

-- DropIndex
DROP INDEX "Quote_uploaded_idx";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "File" RENAME COLUMN "uploaded" TO "createdAt";

-- AlterTable
ALTER TABLE "Material" RENAME COLUMN "uploaded" TO "createdAt";
ALTER TABLE "Material" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quote" RENAME COLUMN "uploaded" TO "createdAt";
ALTER TABLE "Quote" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" RENAME COLUMN "uploaded" TO "createdAt";
ALTER TABLE "Review" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tutor" RENAME COLUMN "updated" TO "updatedAt";
ALTER TABLE "Tutor" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE INDEX "Material_createdAt_idx" ON "Material"("createdAt");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");
