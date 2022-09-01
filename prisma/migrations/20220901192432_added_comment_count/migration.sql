-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "comment_count" INT4 NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "comment_count" INT4 NOT NULL DEFAULT 0;
