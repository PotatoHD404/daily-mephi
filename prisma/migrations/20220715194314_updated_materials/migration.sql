/*
  Warnings:

  - You are about to drop the column `url` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `materialId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Material` DROP COLUMN `url`;

-- CreateTable
CREATE TABLE `_FileToMaterial` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FileToMaterial_AB_unique`(`A`, `B`),
    INDEX `_FileToMaterial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
