/*
  Warnings:

  - Added the required column `downs` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `left` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `right` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `under` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ups` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `z` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downs` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seconds` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sign` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ups` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seconds` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downs` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seconds` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sign` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ups` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "z" FLOAT8 AS (1.281551565545) VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "n" INT4 AS ("ups" + "downs") VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "p" FLOAT8 AS ("ups" / "n") VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "left" FLOAT8 AS ("p" + 1 / (2 * "n") * "z" * "z") VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "right" FLOAT8 AS ("z" * SQRT("p" * (1 - "p") / "n" + "z" * "z" / (4 * "n" + "n"))) VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "under" FLOAT8 AS (1 + 1 / "n" * "z" * "z") VIRTUAL NOT NULL;
ALTER TABLE "Comment" ADD COLUMN     "score" FLOAT8 AS (("left" - "right") / "under") STORED NOT NULL;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN     "n" INT4 AS ("ups" + "downs") VIRTUAL NOT NULL;
ALTER TABLE "Material" ADD COLUMN     "order" FLOAT8 AS (LOG10(((ABS("n") + 1) + ABS(ABS("n") - 1)) / 2)) VIRTUAL NOT NULL;
ALTER TABLE "Material" ADD COLUMN     "sign" INT4 AS (SIGN("n")) VIRTUAL NOT NULL;
ALTER TABLE "Material" ADD COLUMN     "seconds"  INT4 AS (CAST("createdAt" AS INT) - 1661887626) VIRTUAL NOT NULL;
ALTER TABLE "Material" ADD COLUMN     "score" FLOAT8 AS ("sign" * "order" + "seconds" / 45000) STORED NOT NULL;



-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "order" FLOAT8 AS (LOG10(((ABS("n") + 1) + ABS(ABS("n") - 1)) / 2)) VIRTUAL NOT NULL;
ALTER TABLE "Quote" ADD COLUMN     "seconds" INT4 AS (CAST("createdAt" AS INT) - 1661887626) VIRTUAL NOT NULL;
ALTER TABLE "Quote" ADD COLUMN     "score" FLOAT8 AS ("sign" * "order" + "seconds" / 45000) STORED NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "ups" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Review" ADD COLUMN     "downs" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Review" ADD COLUMN     "n" INT4 AS ("ups" + "downs") VIRTUAL NOT NULL;
ALTER TABLE "Review" ADD COLUMN     "order" FLOAT8 AS (LOG10(((ABS("n") + 1) + ABS(ABS("n") - 1)) / 2)) VIRTUAL NOT NULL;
ALTER TABLE "Review" ADD COLUMN     "sign" INT4 AS (SIGN("n")) VIRTUAL NOT NULL;
ALTER TABLE "Review" ADD COLUMN     "seconds" INT4 AS (CAST("createdAt" AS INT) - 1661887626) VIRTUAL NOT NULL;
ALTER TABLE "Review" ADD COLUMN     "score" FLOAT8 AS ("sign" * "order" + "seconds" / 45000) STORED NOT NULL;


-- CreateIndex
CREATE INDEX "Comment_score_idx" ON "Comment"("score");

-- CreateIndex
CREATE INDEX "Material_score_idx" ON "Material"("score");

-- CreateIndex
CREATE INDEX "Quote_score_idx" ON "Quote"("score");

-- CreateIndex
CREATE INDEX "Review_score_idx" ON "Review"("score");
