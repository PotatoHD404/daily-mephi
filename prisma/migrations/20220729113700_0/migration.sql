/*
  Warnings:

  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "materials_comments";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "news_comments";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "reviews_comments";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postId";
ALTER TABLE "Comment" ADD COLUMN     "materialId" UUID;
ALTER TABLE "Comment" ADD COLUMN     "newsId" UUID;
ALTER TABLE "Comment" ADD COLUMN     "reviewId" UUID;

-- CreateIndex
CREATE INDEX "Comment_reviewId_idx" ON "Comment"("reviewId");

-- CreateIndex
CREATE INDEX "Comment_materialId_idx" ON "Comment"("materialId");

-- CreateIndex
CREATE INDEX "Comment_newsId_idx" ON "Comment"("newsId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "reviews_comments" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "materials_comments" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "news_comments" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
