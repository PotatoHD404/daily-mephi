/*
  Warnings:

  - You are about to drop the `_comments_dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_comments_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_materials_dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_materials_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_quotes_dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_quotes_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_reviews_dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_reviews_likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_comments_dislikes" DROP CONSTRAINT "_comments_dislikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_comments_dislikes" DROP CONSTRAINT "_comments_dislikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_comments_likes" DROP CONSTRAINT "_comments_likes_A_fkey";

-- DropForeignKey
ALTER TABLE "_comments_likes" DROP CONSTRAINT "_comments_likes_B_fkey";

-- DropForeignKey
ALTER TABLE "_materials_dislikes" DROP CONSTRAINT "_materials_dislikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_materials_dislikes" DROP CONSTRAINT "_materials_dislikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_materials_likes" DROP CONSTRAINT "_materials_likes_A_fkey";

-- DropForeignKey
ALTER TABLE "_materials_likes" DROP CONSTRAINT "_materials_likes_B_fkey";

-- DropForeignKey
ALTER TABLE "_quotes_dislikes" DROP CONSTRAINT "_quotes_dislikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_quotes_dislikes" DROP CONSTRAINT "_quotes_dislikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_quotes_likes" DROP CONSTRAINT "_quotes_likes_A_fkey";

-- DropForeignKey
ALTER TABLE "_quotes_likes" DROP CONSTRAINT "_quotes_likes_B_fkey";

-- DropForeignKey
ALTER TABLE "_reviews_dislikes" DROP CONSTRAINT "_reviews_dislikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_reviews_dislikes" DROP CONSTRAINT "_reviews_dislikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_reviews_likes" DROP CONSTRAINT "_reviews_likes_A_fkey";

-- DropForeignKey
ALTER TABLE "_reviews_likes" DROP CONSTRAINT "_reviews_likes_B_fkey";

-- DropTable
DROP TABLE "_comments_dislikes";

-- DropTable
DROP TABLE "_comments_likes";

-- DropTable
DROP TABLE "_materials_dislikes";

-- DropTable
DROP TABLE "_materials_likes";

-- DropTable
DROP TABLE "_quotes_dislikes";

-- DropTable
DROP TABLE "_quotes_likes";

-- DropTable
DROP TABLE "_reviews_dislikes";

-- DropTable
DROP TABLE "_reviews_likes";

-- CreateTable
CREATE TABLE "ReviewLike" (
    "userId" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "like" BOOL NOT NULL,

    CONSTRAINT "ReviewLike_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "userId" UUID NOT NULL,
    "commentId" UUID NOT NULL,
    "like" BOOL NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "MaterialLike" (
    "userId" UUID NOT NULL,
    "materialId" UUID NOT NULL,
    "like" BOOL NOT NULL,

    CONSTRAINT "MaterialLike_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "QuoteLike" (
    "userId" UUID NOT NULL,
    "quoteId" UUID NOT NULL,
    "like" BOOL NOT NULL,

    CONSTRAINT "QuoteLike_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "ReviewLike_reviewId_idx" ON "ReviewLike"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewLike_like_idx" ON "ReviewLike"("like");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLike_userId_reviewId_key" ON "ReviewLike"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "CommentLike_commentId_idx" ON "CommentLike"("commentId");

-- CreateIndex
CREATE INDEX "CommentLike_like_idx" ON "CommentLike"("like");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE INDEX "MaterialLike_materialId_idx" ON "MaterialLike"("materialId");

-- CreateIndex
CREATE INDEX "MaterialLike_like_idx" ON "MaterialLike"("like");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialLike_userId_materialId_key" ON "MaterialLike"("userId", "materialId");

-- CreateIndex
CREATE INDEX "QuoteLike_quoteId_idx" ON "QuoteLike"("quoteId");

-- CreateIndex
CREATE INDEX "QuoteLike_like_idx" ON "QuoteLike"("like");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteLike_userId_quoteId_key" ON "QuoteLike"("userId", "quoteId");

-- CreateIndex
CREATE INDEX "Comment_score_idx" ON "Comment"("score");

-- CreateIndex
CREATE INDEX "Material_score_idx" ON "Material"("score");

-- CreateIndex
CREATE INDEX "Quote_score_idx" ON "Quote"("score");

-- CreateIndex
CREATE INDEX "Review_score_idx" ON "Review"("score");

-- AddForeignKey
ALTER TABLE "ReviewLike" ADD CONSTRAINT "ReviewLike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLike" ADD CONSTRAINT "ReviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialLike" ADD CONSTRAINT "MaterialLike_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialLike" ADD CONSTRAINT "MaterialLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLike" ADD CONSTRAINT "QuoteLike_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLike" ADD CONSTRAINT "QuoteLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
