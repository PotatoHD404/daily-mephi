/*
  Warnings:

  - You are about to drop the column `commentCount` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commentCount";
ALTER TABLE "Comment" ADD COLUMN     "childrenCount" INT4 NOT NULL DEFAULT 0;
