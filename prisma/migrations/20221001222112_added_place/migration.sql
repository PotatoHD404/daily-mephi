/*
  Warnings:

  - The `place` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "place" INT8 NOT NULL DEFAULT unique_rowid();
