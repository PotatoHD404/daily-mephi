/*
  Warnings:

  - You are about to drop the column `material_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `news_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `review_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `words` on the `documents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[record_id]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_material_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_news_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_review_id_fkey";

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_document_id_fkey";

-- DropForeignKey
ALTER TABLE "news" DROP CONSTRAINT "news_document_id_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_document_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_document_id_fkey";

-- DropForeignKey
ALTER TABLE "tutors" DROP CONSTRAINT "tutors_document_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_document_id_fkey";

-- DropIndex
DROP INDEX "comments_material_id_idx";

-- DropIndex
DROP INDEX "comments_news_id_idx";

-- DropIndex
DROP INDEX "comments_parent_id_idx";

-- DropIndex
DROP INDEX "comments_review_id_idx";

-- DropIndex
DROP INDEX "documents_recordId_idx";

-- DropIndex
DROP INDEX "documents_recordId_key";

-- DropIndex
DROP INDEX "documents_text_idx";

-- DropIndex
DROP INDEX "documents_words_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "material_id";
ALTER TABLE "comments" DROP COLUMN "news_id";
ALTER TABLE "comments" DROP COLUMN "parent_id";
ALTER TABLE "comments" DROP COLUMN "review_id";
ALTER TABLE "comments" ADD COLUMN     "depth" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "comments" ADD COLUMN     "record_id" UUID;
ALTER TABLE "comments" ADD COLUMN     "type" STRING NOT NULL;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "recordId";
ALTER TABLE "documents" DROP COLUMN "words";
ALTER TABLE "documents" ADD COLUMN     "record_id" UUID;

-- CreateIndex
CREATE INDEX "comments_type_record_id_depth_idx" ON "comments"("type", "record_id", "depth");

-- CreateIndex
CREATE UNIQUE INDEX "documents_record_id_key" ON "documents"("record_id");

-- CreateIndex
CREATE INDEX "documents_type_record_id_idx" ON "documents"("type", "record_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_review_id_fkey" FOREIGN KEY ("record_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_material_id_fkey" FOREIGN KEY ("record_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_news_id_fkey" FOREIGN KEY ("record_id") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("record_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutors" ADD CONSTRAINT "tutors_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("record_id") ON DELETE SET NULL ON UPDATE CASCADE;
