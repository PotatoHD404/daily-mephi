-- AlterSequence
ALTER SEQUENCE "users_place_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "document_id" UUID;

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "document_id" UUID;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "document_id" UUID;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "document_id" UUID;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("recordId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("recordId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("recordId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("recordId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "quotes" ADD CONSTRAINT "quotes_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("recordId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "documents" ADD COLUMN "words" TSVECTOR AS (to_tsvector('russian', "text")) STORED;

CREATE INDEX ON "documents" USING GIN ("words");

CREATE INDEX ON "documents" USING GIN ("text" gin_trgm_ops);