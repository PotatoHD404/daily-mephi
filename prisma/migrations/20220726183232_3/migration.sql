/*
  Warnings:

  - You are about to drop the column `time` on the `Comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Comment_time_idx` ON `Comment`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `time`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `Comment_createdAt_idx` ON `Comment`(`createdAt`);
