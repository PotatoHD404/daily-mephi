/*
  Warnings:

  - A unique constraint covering the columns `[block]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `filename` VARCHAR(200) NOT NULL,
    MODIFY `url` VARCHAR(400) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `File_block_key` ON `File`(`block`);

-- CreateIndex
CREATE INDEX `File_block_idx` ON `File`(`block`);
