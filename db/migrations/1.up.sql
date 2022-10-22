
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

CREATE INDEX "Account_type_provider_providerAccountId_idx" ON "Account"("type", "provider", "providerAccountId");

CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

CREATE TABLE "Session" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  "userId" UUID NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

CREATE INDEX "Session_userId_idx" ON "Session"("userId");

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

CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

CREATE UNIQUE INDEX "User_imageId_key" ON "User"("imageId");

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE INDEX "User_rating_idx" ON "User"("rating");

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

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

CREATE INDEX "Comment_score_idx" ON "Comment"("score");

CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

CREATE INDEX "Comment_reviewId_idx" ON "Comment"("reviewId");

CREATE INDEX "Comment_materialId_idx" ON "Comment"("materialId");

CREATE INDEX "Comment_newsId_idx" ON "Comment"("newsId");

CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

CREATE TABLE "Discipline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(400) NOT NULL
);

CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

CREATE TABLE "Faculty" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(200) NOT NULL
);

CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

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

CREATE INDEX "File_userId_idx" ON "File"("userId");

CREATE INDEX "File_tutorId_idx" ON "File"("tutorId");

CREATE INDEX "File_materialId_idx" ON "File"("materialId");

CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

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

CREATE INDEX "Material_score_idx" ON "Material"("score");

CREATE INDEX "Material_createdAt_idx" ON "Material"("createdAt");

CREATE INDEX "Material_userId_idx" ON "Material"("userId");

CREATE INDEX "Material_tutorId_idx" ON "Material"("tutorId");

CREATE TABLE "Semester" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" CHAR(3) NOT NULL
);

CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");

CREATE TABLE "News" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT NOT NULL,
  "title" VARCHAR(280) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "commentCount" INT4 NOT NULL DEFAULT 0
);

CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");

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
  "ratingCount" INT4 GENERATED ALWAYS AS (ceil(("personalityCount" + "examsCount" + "qualityCount")::DECIMAL / 3)) STORED NOT NULL
);

CREATE UNIQUE INDEX "LegacyRating_tutorId_key" ON "LegacyRating"("tutorId");

CREATE INDEX "LegacyRating_tutorId_idx" ON "LegacyRating"("tutorId");

CREATE INDEX "LegacyRating_personality_idx" ON "LegacyRating"("personality");

CREATE INDEX "LegacyRating_personalityCount_idx" ON "LegacyRating"("personalityCount");

CREATE INDEX "LegacyRating_exams_idx" ON "LegacyRating"("exams");

CREATE INDEX "LegacyRating_examsCount_idx" ON "LegacyRating"("examsCount");

CREATE INDEX "LegacyRating_quality_idx" ON "LegacyRating"("quality");

CREATE INDEX "LegacyRating_qualityCount_idx" ON "LegacyRating"("qualityCount");

CREATE INDEX "LegacyRating_avgRating_idx" ON "LegacyRating"("avgRating");

CREATE INDEX "LegacyRating_ratingCount_idx" ON "LegacyRating"("ratingCount");

CREATE TABLE "Rating" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tutorId" UUID NOT NULL,
  "punctuality" FLOAT8 NOT NULL,
  "personality" FLOAT8 NOT NULL,
  "exams" FLOAT8 NOT NULL,
  "quality" FLOAT8 NOT NULL,
  "ratingCount" INT4 NOT NULL DEFAULT 0,
  "avgRating" FLOAT8 NOT NULL GENERATED ALWAYS AS ( ("punctuality" + "personality" + "exams" + "quality") / 4 ) STORED
);

CREATE INDEX "Rating_tutorId_idx" ON "Rating"("tutorId");

CREATE INDEX "Rating_personality_idx" ON "Rating"("personality");

CREATE INDEX "Rating_exams_idx" ON "Rating"("exams");

CREATE INDEX "Rating_quality_idx" ON "Rating"("quality");

CREATE INDEX "Rating_punctuality_idx" ON "Rating"("punctuality");

CREATE INDEX "Rating_avgRating_idx" ON "Rating"("avgRating");

CREATE INDEX "Rating_ratingCount_idx" ON "Rating"("ratingCount");

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

CREATE INDEX "Quote_score_idx" ON "Quote"("score");

CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

CREATE INDEX "Quote_userId_idx" ON "Quote"("userId");

CREATE INDEX "Quote_tutorId_idx" ON "Quote"("tutorId");

CREATE TABLE "Rate" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "punctuality" INT4 NOT NULL,
  "personality" INT4 NOT NULL,
  "exams" INT4 NOT NULL,
  "quality" INT4 NOT NULL,
  "tutorId" UUID NOT NULL,
  "userId" UUID NOT NULL
);

CREATE INDEX "Rate_userId_idx" ON "Rate"("userId");

CREATE INDEX "Rate_tutorId_idx" ON "Rate"("tutorId");

CREATE UNIQUE INDEX "Rate_userId_tutorId_key" ON "Rate"("userId", "tutorId");

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

CREATE INDEX "Review_score_idx" ON "Review"("score");

CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

CREATE INDEX "Review_userId_idx" ON "Review"("userId");

CREATE INDEX "Review_tutorId_idx" ON "Review"("tutorId");

CREATE UNIQUE INDEX "Review_userId_tutorId_key" ON "Review"("userId", "tutorId");

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

CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");

CREATE INDEX "Reaction_quoteId_idx" ON "Reaction"("quoteId");

CREATE INDEX "Reaction_materialId_idx" ON "Reaction"("materialId");

CREATE INDEX "Reaction_reviewId_idx" ON "Reaction"("reviewId");

CREATE INDEX "Reaction_commentId_idx" ON "Reaction"("commentId");

CREATE INDEX "Reaction_newsId_idx" ON "Reaction"("newsId");

CREATE UNIQUE INDEX "Reaction_userId_quoteId_key" ON "Reaction"("userId", "quoteId");

CREATE UNIQUE INDEX "Reaction_userId_materialId_key" ON "Reaction"("userId", "materialId");

CREATE UNIQUE INDEX "Reaction_userId_reviewId_key" ON "Reaction"("userId", "reviewId");

CREATE UNIQUE INDEX "Reaction_userId_commentId_key" ON "Reaction"("userId", "commentId");

CREATE UNIQUE INDEX "Reaction_userId_newsId_key" ON "Reaction"("userId", "newsId");

CREATE TABLE "Document" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "data" TEXT,
  "userId" UUID,
  "tutorId" UUID,
  "materialId" UUID,
  "reviewId" UUID,
  "quoteId" UUID,
  "newsId" UUID
);

CREATE UNIQUE INDEX "Document_userId_key" ON "Document"("userId");

CREATE UNIQUE INDEX "Document_tutorId_key" ON "Document"("tutorId");

CREATE UNIQUE INDEX "Document_materialId_key" ON "Document"("materialId");

CREATE UNIQUE INDEX "Document_reviewId_key" ON "Document"("reviewId");

CREATE UNIQUE INDEX "Document_quoteId_key" ON "Document"("quoteId");

CREATE UNIQUE INDEX "Document_newsId_key" ON "Document"("newsId");

-- CREATE INDEX "Document_data_idx" ON "Document" USING GIN ("data" gin_trgm_ops); //TODO: add this index


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

CREATE UNIQUE INDEX "Tutor_nickName_key" ON "Tutor"("nickName");

CREATE INDEX "Tutor_score_idx" ON "Tutor"("score");

CREATE TABLE "Internal" (
    "name" VARCHAR(200) NOT NULL,
    "value" TEXT NOT NULL,
    "expires" TIMESTAMP(3)
);

CREATE TABLE "_DisciplineToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE UNIQUE INDEX "_DisciplineToTutor_AB_unique" ON "_DisciplineToTutor"("A", "B");

CREATE INDEX "_DisciplineToTutor_B_index" ON "_DisciplineToTutor"("B");

CREATE TABLE "_DisciplineToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE UNIQUE INDEX "_DisciplineToMaterial_AB_unique" ON "_DisciplineToMaterial"("A", "B");

CREATE INDEX "_DisciplineToMaterial_B_index" ON "_DisciplineToMaterial"("B");

CREATE TABLE "_FacultyToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE UNIQUE INDEX "_FacultyToTutor_AB_unique" ON "_FacultyToTutor"("A", "B");

CREATE INDEX "_FacultyToTutor_B_index" ON "_FacultyToTutor"("B");

CREATE TABLE "_FacultyToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE UNIQUE INDEX "_FacultyToMaterial_AB_unique" ON "_FacultyToMaterial"("A", "B");

CREATE INDEX "_FacultyToMaterial_B_index" ON "_FacultyToMaterial"("B");

CREATE TABLE "_MaterialToSemester" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

CREATE UNIQUE INDEX "_MaterialToSemester_AB_unique" ON "_MaterialToSemester"("A", "B");

CREATE INDEX "_MaterialToSemester_B_index" ON "_MaterialToSemester"("B");

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "reviews_comments" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "materials_comments" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "news_comments" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "File" ADD CONSTRAINT "File_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "File" ADD CONSTRAINT "File_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Material" ADD CONSTRAINT "Material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Material" ADD CONSTRAINT "Material_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LegacyRating" ADD CONSTRAINT "LegacyRating_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Rating" ADD CONSTRAINT "Rating_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Quote" ADD CONSTRAINT "Quote_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Rate" ADD CONSTRAINT "Rate_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Rate" ADD CONSTRAINT "Rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DisciplineToTutor" ADD CONSTRAINT "_DisciplineToTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DisciplineToTutor" ADD CONSTRAINT "_DisciplineToTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DisciplineToMaterial" ADD CONSTRAINT "_DisciplineToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_DisciplineToMaterial" ADD CONSTRAINT "_DisciplineToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_FacultyToTutor" ADD CONSTRAINT "_FacultyToTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_FacultyToTutor" ADD CONSTRAINT "_FacultyToTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_FacultyToMaterial" ADD CONSTRAINT "_FacultyToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_FacultyToMaterial" ADD CONSTRAINT "_FacultyToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_B_fkey" FOREIGN KEY ("B") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
