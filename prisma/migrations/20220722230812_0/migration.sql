/*
  Warnings:

  - A unique constraint covering the columns `[nickName]` on the table `Tutor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tutor_nickName_key` ON `Tutor`(`nickName`);
