/*
  Warnings:

  - You are about to drop the column `avg_rate` on the `Tutor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Course" AS ENUM ('B1', 'B2', 'B3', 'B4', 'S1', 'S2', 'S3', 'S4', 'S5', 'M1', 'M2', 'A1', 'A2', 'A3', 'A4');

-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "avg_rate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userCourse" "Course";
