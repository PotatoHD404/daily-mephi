/*
  Warnings:

  - You are about to drop the column `score` on the `Quote` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Quote_score_idx";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "score";
