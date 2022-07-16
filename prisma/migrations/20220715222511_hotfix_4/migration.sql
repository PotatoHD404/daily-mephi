/*
  Warnings:

  - You are about to drop the column `time` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Quote` ADD COLUMN `uploaded` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `time`,
    ADD COLUMN `legacyNickname` VARCHAR(191) NULL,
    ADD COLUMN `uploaded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `userId` VARCHAR(191) NULL;
