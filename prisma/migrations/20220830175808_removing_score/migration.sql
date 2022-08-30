/*
  Warnings:

  - You are about to drop the column `score` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Review` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_score_idx";

-- DropIndex
DROP INDEX "Material_score_idx";

-- DropIndex
DROP INDEX "Quote_score_idx";

-- DropIndex
DROP INDEX "Review_score_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "score" DROP DEFAULT;
