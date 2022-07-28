/*
  Warnings:

  - You are about to drop the column `time` on the `News` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `News_time_idx` ON `News`;

-- AlterTable
ALTER TABLE `News` DROP COLUMN `time`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `News_createdAt_idx` ON `News`(`createdAt`);
