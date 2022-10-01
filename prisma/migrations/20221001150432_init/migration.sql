-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" STRING NOT NULL,
    "provider" STRING NOT NULL,
    "providerAccountId" STRING NOT NULL,
    "refresh_token" STRING,
    "access_token" STRING,
    "expires_at" INT4,
    "token_type" STRING,
    "scope" STRING,
    "id_token" STRING,
    "session_state" STRING,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionToken" STRING NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING(50),
    "imageId" UUID,
    "role" STRING NOT NULL DEFAULT 'default',
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" FLOAT8 NOT NULL DEFAULT 0,
    "bio" STRING(150),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" STRING NOT NULL,
    "token" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "reviewId" UUID,
    "materialId" UUID,
    "newsId" UUID,
    "parentId" UUID,
    "likes" INT4 NOT NULL DEFAULT 0,
    "dislikes" INT4 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING(400) NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING(200) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" STRING(2000) NOT NULL,
    "altUrl" STRING(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" STRING(500) NOT NULL,
    "userId" UUID,
    "tutorId" UUID,
    "materialId" UUID,
    "tag" STRING(200),
    "size" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" STRING,
    "title" STRING(280) NOT NULL,
    "userId" UUID,
    "tutorId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "likes" INT4 NOT NULL DEFAULT 0,
    "dislikes" INT4 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0,
    "commentCount" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" CHAR(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" STRING NOT NULL,
    "title" STRING(280) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentCount" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyRating" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "personality" FLOAT8 NOT NULL,
    "personalityCount" INT4 NOT NULL,
    "exams" FLOAT8 NOT NULL,
    "examsCount" INT4 NOT NULL,
    "quality" FLOAT8 NOT NULL,
    "qualityCount" INT4 NOT NULL,
    "tutorId" UUID NOT NULL,
    "avgRating" FLOAT8 AS ((personality * "personalityCount"::FLOAT + exams * "examsCount"::FLOAT + quality * "qualityCount"::FLOAT) / ("personalityCount" + "examsCount" + "qualityCount")::FLOAT) STORED NOT NULL,
    "ratingCount" INT4 AS (("personalityCount" + "examsCount" + "qualityCount") // 3) STORED NOT NULL,

    CONSTRAINT "LegacyRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tutorId" UUID NOT NULL,
    "punctuality" FLOAT8 NOT NULL,
    "personality" FLOAT8 NOT NULL,
    "exams" FLOAT8 NOT NULL,
    "quality" FLOAT8 NOT NULL,
    "ratingCount" INT4 NOT NULL DEFAULT 0,
    "avgRating" FLOAT8 AS ((
        "punctuality" + "personality" + "exams" + "quality"
    ) / 4) STORED NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" STRING NOT NULL,
    "tutorId" UUID NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "likes" INT4 NOT NULL DEFAULT 0,
    "dislikes" INT4 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "punctuality" INT4 NOT NULL,
    "personality" INT4 NOT NULL,
    "exams" INT4 NOT NULL,
    "quality" INT4 NOT NULL,
    "tutorId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" STRING(280) NOT NULL,
    "text" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "legacyNickname" STRING(200),
    "userId" UUID,
    "tutorId" UUID NOT NULL,
    "likes" INT4 NOT NULL DEFAULT 0,
    "dislikes" INT4 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0,
    "commentCount" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "quoteId" UUID,
    "materialId" UUID,
    "reviewId" UUID,
    "commentId" UUID,
    "newsId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "like" BOOL NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "words" STRING[],
    "grams" STRING[],
    "userId" UUID,
    "tutorId" UUID,
    "materialId" UUID,
    "reviewId" UUID,
    "quoteId" UUID,
    "newsId" UUID,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" STRING(64),
    "lastName" STRING(64),
    "fatherName" STRING(64),
    "nickName" STRING(64),
    "url" STRING,
    "updatedAt" TIMESTAMP(3),
    "rating" FLOAT8 NOT NULL DEFAULT 0,
    "score" FLOAT8 NOT NULL DEFAULT 0,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Internal" (
    "name" STRING(200) NOT NULL,
    "value" STRING NOT NULL,
    "expires" TIMESTAMP(3),

    CONSTRAINT "Internal_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_DisciplineToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DisciplineToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FacultyToTutor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FacultyToMaterial" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_MaterialToSemester" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_type_provider_providerAccountId_idx" ON "Account"("type", "provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_imageId_key" ON "User"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Comment_score_idx" ON "Comment"("score");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_reviewId_idx" ON "Comment"("reviewId");

-- CreateIndex
CREATE INDEX "Comment_materialId_idx" ON "Comment"("materialId");

-- CreateIndex
CREATE INDEX "Comment_newsId_idx" ON "Comment"("newsId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");

-- CreateIndex
CREATE INDEX "File_tutorId_idx" ON "File"("tutorId");

-- CreateIndex
CREATE INDEX "File_materialId_idx" ON "File"("materialId");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE INDEX "Material_score_idx" ON "Material"("score");

-- CreateIndex
CREATE INDEX "Material_createdAt_idx" ON "Material"("createdAt");

-- CreateIndex
CREATE INDEX "Material_userId_idx" ON "Material"("userId");

-- CreateIndex
CREATE INDEX "Material_tutorId_idx" ON "Material"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");

-- CreateIndex
CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LegacyRating_tutorId_key" ON "LegacyRating"("tutorId");

-- CreateIndex
CREATE INDEX "LegacyRating_tutorId_idx" ON "LegacyRating"("tutorId");

-- CreateIndex
CREATE INDEX "LegacyRating_personality_idx" ON "LegacyRating"("personality");

-- CreateIndex
CREATE INDEX "LegacyRating_personalityCount_idx" ON "LegacyRating"("personalityCount");

-- CreateIndex
CREATE INDEX "LegacyRating_exams_idx" ON "LegacyRating"("exams");

-- CreateIndex
CREATE INDEX "LegacyRating_examsCount_idx" ON "LegacyRating"("examsCount");

-- CreateIndex
CREATE INDEX "LegacyRating_quality_idx" ON "LegacyRating"("quality");

-- CreateIndex
CREATE INDEX "LegacyRating_qualityCount_idx" ON "LegacyRating"("qualityCount");

-- CreateIndex
CREATE INDEX "LegacyRating_avgRating_idx" ON "LegacyRating"("avgRating");

-- CreateIndex
CREATE INDEX "LegacyRating_ratingCount_idx" ON "LegacyRating"("ratingCount");

-- CreateIndex
CREATE INDEX "Rating_tutorId_idx" ON "Rating"("tutorId");

-- CreateIndex
CREATE INDEX "Rating_personality_idx" ON "Rating"("personality");

-- CreateIndex
CREATE INDEX "Rating_exams_idx" ON "Rating"("exams");

-- CreateIndex
CREATE INDEX "Rating_quality_idx" ON "Rating"("quality");

-- CreateIndex
CREATE INDEX "Rating_punctuality_idx" ON "Rating"("punctuality");

-- CreateIndex
CREATE INDEX "Rating_avgRating_idx" ON "Rating"("avgRating");

-- CreateIndex
CREATE INDEX "Rating_ratingCount_idx" ON "Rating"("ratingCount");

-- CreateIndex
CREATE INDEX "Quote_score_idx" ON "Quote"("score");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- CreateIndex
CREATE INDEX "Quote_userId_idx" ON "Quote"("userId");

-- CreateIndex
CREATE INDEX "Quote_tutorId_idx" ON "Quote"("tutorId");

-- CreateIndex
CREATE INDEX "Rate_userId_idx" ON "Rate"("userId");

-- CreateIndex
CREATE INDEX "Rate_tutorId_idx" ON "Rate"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Rate_userId_tutorId_key" ON "Rate"("userId", "tutorId");

-- CreateIndex
CREATE INDEX "Review_score_idx" ON "Review"("score");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_tutorId_idx" ON "Review"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_tutorId_key" ON "Review"("userId", "tutorId");

-- CreateIndex
CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");

-- CreateIndex
CREATE INDEX "Reaction_quoteId_idx" ON "Reaction"("quoteId");

-- CreateIndex
CREATE INDEX "Reaction_materialId_idx" ON "Reaction"("materialId");

-- CreateIndex
CREATE INDEX "Reaction_reviewId_idx" ON "Reaction"("reviewId");

-- CreateIndex
CREATE INDEX "Reaction_commentId_idx" ON "Reaction"("commentId");

-- CreateIndex
CREATE INDEX "Reaction_newsId_idx" ON "Reaction"("newsId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_quoteId_key" ON "Reaction"("userId", "quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_materialId_key" ON "Reaction"("userId", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_reviewId_key" ON "Reaction"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_commentId_key" ON "Reaction"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_newsId_key" ON "Reaction"("userId", "newsId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_userId_key" ON "Document"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_tutorId_key" ON "Document"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_materialId_key" ON "Document"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_reviewId_key" ON "Document"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_quoteId_key" ON "Document"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_newsId_key" ON "Document"("newsId");

-- CreateIndex
CREATE INDEX "Document_words_idx" ON "Document" USING GIN ("words");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_nickName_key" ON "Tutor"("nickName");

-- CreateIndex
CREATE INDEX "Tutor_score_idx" ON "Tutor"("score");

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplineToTutor_AB_unique" ON "_DisciplineToTutor"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplineToTutor_B_index" ON "_DisciplineToTutor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplineToMaterial_AB_unique" ON "_DisciplineToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplineToMaterial_B_index" ON "_DisciplineToMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacultyToTutor_AB_unique" ON "_FacultyToTutor"("A", "B");

-- CreateIndex
CREATE INDEX "_FacultyToTutor_B_index" ON "_FacultyToTutor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacultyToMaterial_AB_unique" ON "_FacultyToMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_FacultyToMaterial_B_index" ON "_FacultyToMaterial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToSemester_AB_unique" ON "_MaterialToSemester"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToSemester_B_index" ON "_MaterialToSemester"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "reviews_comments" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "materials_comments" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "news_comments" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyRating" ADD CONSTRAINT "LegacyRating_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToTutor" ADD CONSTRAINT "_DisciplineToTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToTutor" ADD CONSTRAINT "_DisciplineToTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToMaterial" ADD CONSTRAINT "_DisciplineToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplineToMaterial" ADD CONSTRAINT "_DisciplineToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToTutor" ADD CONSTRAINT "_FacultyToTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToTutor" ADD CONSTRAINT "_FacultyToTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToMaterial" ADD CONSTRAINT "_FacultyToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToMaterial" ADD CONSTRAINT "_FacultyToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_B_fkey" FOREIGN KEY ("B") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
