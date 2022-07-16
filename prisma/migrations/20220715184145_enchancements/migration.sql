-- AlterTable
ALTER TABLE `File` ADD COLUMN `tutorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Tutor` MODIFY `lastName` VARCHAR(191) NULL;
