/*
  Warnings:

  - Added the required column `name` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "fullName" STRING(256) AS (CONCAT("lastName", ' ', "firstName", ' ', "fatherName")) STORED NOT NULL;
ALTER TABLE "Tutor" ADD COLUMN     "shortName" STRING(80) AS (CONCAT("lastName", ' ', LEFT("firstName", 1), '.', LEFT("fatherName", 1), '.')) STORED NOT NULL;
