-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "score" FLOAT8 NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Comment_score_idx" ON "Comment"("score");

-- CreateIndex
CREATE INDEX "Material_score_idx" ON "Material"("score");

-- CreateIndex
CREATE INDEX "Quote_score_idx" ON "Quote"("score");

-- CreateIndex
CREATE INDEX "Review_score_idx" ON "Review"("score");
