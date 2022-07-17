/*
  Warnings:

  - You are about to drop the column `block` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `File_block_idx` ON `File`;

-- DropIndex
DROP INDEX `File_block_key` ON `File`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `block`;
