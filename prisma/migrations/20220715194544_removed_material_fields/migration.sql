/*
  Warnings:

  - You are about to drop the column `block` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Material` DROP COLUMN `block`,
    DROP COLUMN `time`;
