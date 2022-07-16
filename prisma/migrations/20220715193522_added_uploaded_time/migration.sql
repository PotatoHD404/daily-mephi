/*
  Warnings:

  - You are about to drop the column `time` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `File` DROP COLUMN `time`,
    ADD COLUMN `uploaded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Material` ADD COLUMN `uploaded` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
