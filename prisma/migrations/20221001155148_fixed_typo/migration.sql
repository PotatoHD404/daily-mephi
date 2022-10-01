/*
  Warnings:

  - You are about to drop the column `rating` on the `Tutor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tutorId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "rating";

-- CreateIndex
CREATE UNIQUE INDEX "Rating_tutorId_key" ON "Rating"("tutorId");
