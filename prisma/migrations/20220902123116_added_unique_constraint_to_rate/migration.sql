/*
  Warnings:

  - A unique constraint covering the columns `[userId,tutorId]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rate_userId_tutorId_key" ON "Rate"("userId", "tutorId");
