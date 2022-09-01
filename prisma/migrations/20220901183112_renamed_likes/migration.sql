/*
  Warnings:

  - You are about to drop the column `downs` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `ups` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `downs` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `ups` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `downs` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `ups` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `downs` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `ups` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "downs";
ALTER TABLE "Comment" DROP COLUMN "ups";
ALTER TABLE "Comment" ADD COLUMN     "dislikes" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "likes" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "downs";
ALTER TABLE "Material" DROP COLUMN "ups";
ALTER TABLE "Material" ADD COLUMN     "dislikes" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN     "likes" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "downs";
ALTER TABLE "Quote" DROP COLUMN "ups";
ALTER TABLE "Quote" ADD COLUMN     "dislikes" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN     "likes" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "downs";
ALTER TABLE "Review" DROP COLUMN "ups";
ALTER TABLE "Review" ADD COLUMN     "dislikes" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Review" ADD COLUMN     "likes" INT4 NOT NULL DEFAULT 0;
