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
    "name" STRING(100),
    "image" STRING,
    "rating" INT4 NOT NULL DEFAULT 0,
    "role" STRING NOT NULL DEFAULT 'default',
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "postId" UUID NOT NULL,
    "parentId" UUID,

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
    "id" UUID NOT NULL,
    "url" STRING(1400) NOT NULL,
    "uploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" STRING(200) NOT NULL,
    "isImage" BOOL NOT NULL DEFAULT false,
    "userId" UUID,
    "tutorId" UUID,
    "materialId" UUID,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" STRING,
    "header" STRING(280) NOT NULL,
    "userId" UUID,
    "tutorId" UUID,
    "uploaded" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

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
    "body" STRING NOT NULL,
    "header" STRING(280) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

    CONSTRAINT "LegacyRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "body" STRING NOT NULL,
    "tutorId" UUID NOT NULL,
    "userId" UUID,
    "uploaded" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

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
    "header" STRING(280) NOT NULL,
    "body" STRING NOT NULL,
    "uploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "legacyNickname" STRING(200),
    "userId" UUID,
    "tutorId" UUID NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" STRING(64),
    "lastName" STRING(64),
    "fatherName" STRING(64),
    "nickName" STRING(64),
    "url" STRING,
    "updated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

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
CREATE TABLE "_materials_likes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_materials_dislikes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_MaterialToSemester" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_quotes_likes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_quotes_dislikes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_reviews_likes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_reviews_dislikes" (
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
CREATE UNIQUE INDEX "User_image_key" ON "User"("image");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

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
CREATE INDEX "File_uploaded_idx" ON "File"("uploaded");

-- CreateIndex
CREATE INDEX "Material_uploaded_idx" ON "Material"("uploaded");

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
CREATE INDEX "Quote_uploaded_idx" ON "Quote"("uploaded");

-- CreateIndex
CREATE INDEX "Quote_userId_idx" ON "Quote"("userId");

-- CreateIndex
CREATE INDEX "Quote_tutorId_idx" ON "Quote"("tutorId");

-- CreateIndex
CREATE INDEX "Rate_userId_idx" ON "Rate"("userId");

-- CreateIndex
CREATE INDEX "Rate_tutorId_idx" ON "Rate"("tutorId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_tutorId_idx" ON "Review"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_tutorId_key" ON "Review"("userId", "tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_nickName_key" ON "Tutor"("nickName");

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
CREATE UNIQUE INDEX "_materials_likes_AB_unique" ON "_materials_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_materials_likes_B_index" ON "_materials_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_materials_dislikes_AB_unique" ON "_materials_dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_materials_dislikes_B_index" ON "_materials_dislikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToSemester_AB_unique" ON "_MaterialToSemester"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToSemester_B_index" ON "_MaterialToSemester"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_quotes_likes_AB_unique" ON "_quotes_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_quotes_likes_B_index" ON "_quotes_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_quotes_dislikes_AB_unique" ON "_quotes_dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_quotes_dislikes_B_index" ON "_quotes_dislikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_reviews_likes_AB_unique" ON "_reviews_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_reviews_likes_B_index" ON "_reviews_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_reviews_dislikes_AB_unique" ON "_reviews_dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_reviews_dislikes_B_index" ON "_reviews_dislikes"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "reviews_comments" FOREIGN KEY ("postId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "materials_comments" FOREIGN KEY ("postId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "news_comments" FOREIGN KEY ("postId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "_materials_likes" ADD CONSTRAINT "_materials_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_materials_likes" ADD CONSTRAINT "_materials_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_materials_dislikes" ADD CONSTRAINT "_materials_dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_materials_dislikes" ADD CONSTRAINT "_materials_dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToSemester" ADD CONSTRAINT "_MaterialToSemester_B_fkey" FOREIGN KEY ("B") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_quotes_likes" ADD CONSTRAINT "_quotes_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_quotes_likes" ADD CONSTRAINT "_quotes_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_quotes_dislikes" ADD CONSTRAINT "_quotes_dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_quotes_dislikes" ADD CONSTRAINT "_quotes_dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reviews_likes" ADD CONSTRAINT "_reviews_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reviews_likes" ADD CONSTRAINT "_reviews_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reviews_dislikes" ADD CONSTRAINT "_reviews_dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reviews_dislikes" ADD CONSTRAINT "_reviews_dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
