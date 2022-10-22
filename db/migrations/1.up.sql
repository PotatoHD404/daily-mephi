DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS "Session";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "VerificationToken";
DROP TABLE IF EXISTS "Comment";
DROP TABLE IF EXISTS "Discipline";
DROP TABLE IF EXISTS "Faculty";
DROP TABLE IF EXISTS "File";
DROP TABLE IF EXISTS "Material";
DROP TABLE IF EXISTS "Semester";
DROP TABLE IF EXISTS "News";
DROP TABLE IF EXISTS "LegacyRating";
DROP TABLE IF EXISTS "Rating";
DROP TABLE IF EXISTS "Quote";
DROP TABLE IF EXISTS "Rate";
DROP TABLE IF EXISTS "Review";
DROP TABLE IF EXISTS "Reaction";
DROP TABLE IF EXISTS "Document";
DROP TABLE IF EXISTS "Tutor";
DROP TABLE IF EXISTS "Internal";
DROP TABLE IF EXISTS "_DisciplineToTutor";
DROP TABLE IF EXISTS "_DisciplineToMaterial";
DROP TABLE IF EXISTS "_FacultyToTutor";
DROP TABLE IF EXISTS "_FacultyToMaterial";
DROP TABLE IF EXISTS "_MaterialToSemester";

CREATE TABLE "Account" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "provider" VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  "refresh_token" VARCHAR(255),
  "access_token" VARCHAR(255),
  "expires_at" TIMESTAMP,
  "token_type" VARCHAR(255),
  "scope" VARCHAR(255),
  "id_token" VARCHAR(255),
  "session_state" VARCHAR(255)
);

CREATE TABLE "Session" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  "userId" UUID NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(50),
  "imageId" UUID,
  "role" VARCHAR(255) NOT NULL DEFAULT 'default',
  "email" VARCHAR(255),
  "emailVerified" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "rating" FLOAT8 NOT NULL DEFAULT 0,
  "bio" VARCHAR(150)
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Comment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "userId" UUID NOT NULL,
  "reviewId" UUID,
  "materialId" UUID,
  "newsId" UUID,
  "parentId" UUID,
  "likes" INT4 NOT NULL DEFAULT 0,
  "dislikes" INT4 NOT NULL DEFAULT 0,
  "score" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "Discipline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(400) NOT NULL
);

CREATE TABLE "Faculty" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(200) NOT NULL
);

CREATE TABLE "File" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "url" VARCHAR(2000) NOT NULL,
  "altUrl" VARCHAR(2000),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "filename" VARCHAR(500) NOT NULL,
  "userId" UUID,
  "tutorId" UUID,
  "materialId" UUID,
  "tag" VARCHAR(200),
  "size" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "Material" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT,
  "title" VARCHAR(280) NOT NULL,
  "userId" UUID,
  "tutorId" UUID,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "likes" INT4 NOT NULL DEFAULT 0,
  "dislikes" INT4 NOT NULL DEFAULT 0,
  "score" FLOAT8 NOT NULL DEFAULT 0,
  "commentCount" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "Semester" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" CHAR(3) NOT NULL
);

CREATE TABLE "News" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT NOT NULL,
  "title" VARCHAR(280) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "commentCount" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "LegacyRating" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "personality" FLOAT8 NOT NULL,
  "personalityCount" INT4 NOT NULL,
  "exams" FLOAT8 NOT NULL,
  "examsCount" INT4 NOT NULL,
  "quality" FLOAT8 NOT NULL,
  "qualityCount" INT4 NOT NULL,
  "tutorId" UUID NOT NULL,
  "avgRating" FLOAT8 GENERATED ALWAYS AS ((personality * "personalityCount"::FLOAT8 + exams * "examsCount"::FLOAT8 + quality * "qualityCount"::FLOAT8) / ("personalityCount" + "examsCount" + "qualityCount")::FLOAT8) STORED NOT NULL,
--   "ratingCount" INT4 GENERATED ALWAYS AS (ceil(("personalityCount" + "examsCount" + "qualityCount")::DECIMAL / 3)) STORED NOT NULL
);

CREATE TABLE "Rating" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tutorId" UUID NOT NULL,
  "punctuality" FLOAT8 NOT NULL,
  "personality" FLOAT8 NOT NULL,
  "exams" FLOAT8 NOT NULL,
  "quality" FLOAT8 NOT NULL,
  "ratingCount" INT4 NOT NULL DEFAULT 0,
  "avgRating" FLOAT8 GENERATED ALWAYS AS (("punctuality" + "personality" + "exams" + "quality") / 4) STORED NOT NULL
);

CREATE TABLE "Quote" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT NOT NULL,
  "tutorId" UUID NOT NULL,
  "userId" UUID,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "likes" INT4 NOT NULL DEFAULT 0,
  "dislikes" INT4 NOT NULL DEFAULT 0,
  "score" FLOAT8 NOT NULL DEFAULT 0
);

CREATE TABLE "Rate" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "punctuality" INT4 NOT NULL,
  "personality" INT4 NOT NULL,
  "exams" INT4 NOT NULL,
  "quality" INT4 NOT NULL,
  "tutorId" UUID NOT NULL,
  "userId" UUID NOT NULL
);

CREATE TABLE "Review" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" VARCHAR(280) NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "legacyNickname" VARCHAR(200),
  "userId" UUID,
  "tutorId" UUID NOT NULL,
  "likes" INT4 NOT NULL DEFAULT 0,
  "dislikes" INT4 NOT NULL DEFAULT 0,
  "score" FLOAT8 NOT NULL DEFAULT 0,
  "commentCount" INT4 NOT NULL DEFAULT 0
);

CREATE TABLE "Reaction" (
  "id" UUID DEFAULT gen_random_uuid() NOT NULL ,
  "userId" UUID NOT NULL,
  "quoteId" UUID,
  "materialId" UUID,
  "reviewId" UUID,
  "commentId" UUID,
  "newsId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "like" BOOL NOT NULL
);

CREATE TABLE "Document" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "words" TEXT,
  "grams" TEXT,
  "userId" UUID,
  "tutorId" UUID,
  "materialId" UUID,
  "reviewId" UUID,
  "quoteId" UUID,
  "newsId" UUID
);

CREATE TABLE "Tutor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "fatherName" VARCHAR(64),
    "nickName" VARCHAR(64),
    "url" TEXT,
    "updatedAt" TIMESTAMP(3),
    "rating" FLOAT8 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0
);

CREATE TABLE "Internal" (
    "name" VARCHAR(200) NOT NULL,
    "value" TEXT NOT NULL,
    "expires" TIMESTAMP(3)
);

CREATE TABLE "_DisciplineToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE TABLE "_DisciplineToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE TABLE "_FacultyToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE TABLE "_FacultyToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE TABLE "_MaterialToSemester" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);