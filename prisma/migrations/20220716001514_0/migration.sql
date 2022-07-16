/*
  Warnings:

  - You are about to alter the column `legacyNickname` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `Review` MODIFY `header` VARCHAR(200) NOT NULL,
    MODIFY `legacyNickname` VARCHAR(100) NULL;
