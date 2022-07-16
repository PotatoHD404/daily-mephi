/*
  Warnings:

  - You are about to alter the column `legacyNickname` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `Review` MODIFY `header` VARCHAR(1000) NOT NULL,
    MODIFY `legacyNickname` VARCHAR(64) NULL;
