-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;
