CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
  "parentId" UUID
);

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
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

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
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
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

CREATE TABLE "Quote" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "text" TEXT NOT NULL,
  "tutorId" UUID NOT NULL,
  "userId" UUID,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

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
  "tutorId" UUID NOT NULL
);

CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

CREATE INDEX "Review_userId_idx" ON "Review"("userId");

CREATE INDEX "Review_tutorId_idx" ON "Review"("tutorId");

CREATE UNIQUE INDEX "Review_userId_tutorId_key" ON "Review"("userId", "tutorId");

CREATE TABLE "Reaction" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
  "newsId" UUID,
  "type" VARCHAR(20) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "Document_userId_key" ON "Document"("userId");

CREATE UNIQUE INDEX "Document_tutorId_key" ON "Document"("tutorId");

CREATE UNIQUE INDEX "Document_materialId_key" ON "Document"("materialId");

CREATE UNIQUE INDEX "Document_reviewId_key" ON "Document"("reviewId");

CREATE UNIQUE INDEX "Document_quoteId_key" ON "Document"("quoteId");

CREATE UNIQUE INDEX "Document_newsId_key" ON "Document"("newsId");

CREATE INDEX "Document_type_key" ON "Document"("type");

CREATE INDEX "Document_createdAt_key" ON "Document"("createdAt");

CREATE INDEX "Document_data_idx" ON "Document" USING GIN ((to_tsvector('russian', "data") || to_tsvector('english', "data")));

CREATE INDEX "Document_data_idx2" ON "Document" USING GIN ("data" gin_trgm_ops);

CREATE TABLE "Tutor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "firstName" VARCHAR(64),
    "lastName" VARCHAR(64),
    "fatherName" VARCHAR(64),
    "nickName" VARCHAR(64),
    "url" TEXT,
    "updatedAt" TIMESTAMP(3),
    "fullName" VARCHAR(255) GENERATED ALWAYS AS (CASE WHEN "firstName" IS NULL AND "lastName" IS NULL
                                            AND "fatherName" IS NULL THEN NULL ELSE (CASE WHEN "lastName" IS NULL THEN ''
                                            ELSE "lastName" END || CASE WHEN "firstName" IS NULL THEN '' ELSE ' ' || "firstName"
                                            END || CASE WHEN "fatherName" IS NULL THEN '' ELSE ' ' || "fatherName" END) END) STORED,

    "shortName" VARCHAR(128) GENERATED ALWAYS AS (CASE WHEN "firstName" IS NULL AND "lastName" IS NULL
                                                AND "fatherName" IS NULL THEN NULL ELSE (CASE WHEN "lastName" IS NULL THEN ''
                                                ELSE "lastName" END || CASE WHEN "firstName" IS NULL THEN '' ELSE ' ' || LEFT("firstName", 1) || '.'
                                                END || CASE WHEN "fatherName" IS NULL THEN '' ELSE ' ' || "fatherName" || '.' END) END) STORED
);

CREATE UNIQUE INDEX "Tutor_nickName_key" ON "Tutor"("nickName");

CREATE TABLE "Internal" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "value" TEXT NOT NULL,
    "expires" TIMESTAMP(3)
);

CREATE TABLE "DisciplineTutor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "disciplineId" UUID NOT NULL,
    "tutorId" UUID NOT NULL
);

CREATE UNIQUE INDEX "DisciplineTutor_disciplineId_tutorId_unique" ON "DisciplineTutor"("disciplineId", "tutorId");

CREATE INDEX "DisciplineTutor_tutorId_index" ON "DisciplineTutor"("tutorId");

CREATE TABLE "DisciplineMaterial" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "disciplineId" UUID NOT NULL,
    "materialId" UUID NOT NULL
);

CREATE UNIQUE INDEX "DisciplineMaterial_disciplineId_materialId_unique" ON "DisciplineMaterial" ("disciplineId", "materialId");

CREATE INDEX "DisciplineMaterial_materialId_index" ON "DisciplineMaterial" ("materialId");

CREATE TABLE "FacultyTutor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "tutorId" UUID NOT NULL,
    "facultyId" UUID NOT NULL
);

CREATE UNIQUE INDEX "FacultyTutor_tutorId_facultyId_unique" ON "FacultyTutor" ("tutorId", "facultyId");

CREATE INDEX "FacultyTutor_facultyId_index" ON "FacultyTutor" ("facultyId");

CREATE TABLE "FacultyMaterial" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "facultyId" UUID NOT NULL,
    "materialId" UUID NOT NULL
);

CREATE UNIQUE INDEX "FacultyMaterial_facultyId_materialId_unique" ON "FacultyMaterial" ("facultyId", "materialId");

CREATE INDEX "FacultyMaterial_materialId_index" ON "FacultyMaterial" ("materialId");

CREATE TABLE "MaterialSemester" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "materialId" UUID NOT NULL,
    "semesterId" UUID NOT NULL
);

CREATE UNIQUE INDEX "MaterialSemester_materialId_semesterId_unique" ON "MaterialSemester"("materialId", "semesterId");

CREATE INDEX "MaterialSemester_semesterId_index" ON "MaterialSemester"("semesterId");

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

ALTER TABLE "DisciplineTutor" ADD CONSTRAINT "DisciplineTutor_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DisciplineTutor" ADD CONSTRAINT "DisciplineTutor_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DisciplineMaterial" ADD CONSTRAINT "DisciplineMaterial_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DisciplineMaterial" ADD CONSTRAINT "DisciplineMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FacultyTutor" ADD CONSTRAINT "FacultyTutor_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FacultyTutor" ADD CONSTRAINT "FacultyTutor_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FacultyMaterial" ADD CONSTRAINT "FacultyMaterial_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FacultyMaterial" ADD CONSTRAINT "FacultyMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MaterialSemester" ADD CONSTRAINT "MaterialSemester_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MaterialSemester" ADD CONSTRAINT "MaterialSemester_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
