/*
  Warnings:

  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - The `rating` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "score";
ALTER TABLE "User" DROP COLUMN "rating";
ALTER TABLE "User" ADD COLUMN     "rating" FLOAT8 NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");
