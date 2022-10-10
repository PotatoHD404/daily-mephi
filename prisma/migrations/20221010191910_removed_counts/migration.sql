/*
  Warnings:

  - You are about to drop the column `childrenCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `commentCount` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `commentCount` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `commentCount` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `materialsCount` on the `Tutor` table. All the data in the column will be lost.
  - You are about to drop the column `quotesCount` on the `Tutor` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsCount` on the `Tutor` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Tutor` table. All the data in the column will be lost.
  - You are about to drop the column `materialsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `quotesCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_tutorId_fkey";

-- DropIndex
DROP INDEX "Comment_score_idx";

-- DropIndex
DROP INDEX "Material_score_idx";

-- DropIndex
DROP INDEX "Review_score_idx";

-- DropIndex
DROP INDEX "Tutor_score_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "childrenCount";
ALTER TABLE "Comment" DROP COLUMN "dislikes";
ALTER TABLE "Comment" DROP COLUMN "likes";
ALTER TABLE "Comment" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "commentCount";
ALTER TABLE "Material" DROP COLUMN "dislikes";
ALTER TABLE "Material" DROP COLUMN "likes";
ALTER TABLE "Material" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "commentCount";
ALTER TABLE "News" DROP COLUMN "dislikes";
ALTER TABLE "News" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "dislikes";
ALTER TABLE "Quote" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "commentCount";
ALTER TABLE "Review" DROP COLUMN "dislikes";
ALTER TABLE "Review" DROP COLUMN "likes";
ALTER TABLE "Review" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "materialsCount";
ALTER TABLE "Tutor" DROP COLUMN "quotesCount";
ALTER TABLE "Tutor" DROP COLUMN "reviewsCount";
ALTER TABLE "Tutor" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "materialsCount";
ALTER TABLE "User" DROP COLUMN "quotesCount";
ALTER TABLE "User" DROP COLUMN "reviewsCount";

-- DropTable
DROP TABLE "Rating";
