-- CreateTable
CREATE TABLE `Account` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_type_provider_providerAccountId_idx`(`type`, `provider`, `providerAccountId`),
    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` CHAR(36) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NULL,
    `image` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `role` VARCHAR(191) NOT NULL DEFAULT 'default',
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,

    UNIQUE INDEX `User_name_key`(`name`),
    UNIQUE INDEX `User_image_key`(`image`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` CHAR(36) NOT NULL,
    `text` MEDIUMTEXT NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` CHAR(36) NOT NULL,
    `postId` CHAR(36) NOT NULL,
    `parentId` CHAR(36) NULL,

    INDEX `Comment_time_idx`(`time`),
    INDEX `Comment_userId_idx`(`userId`),
    INDEX `Comment_postId_idx`(`postId`),
    INDEX `Comment_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discipline` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(400) NOT NULL,

    UNIQUE INDEX `Discipline_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faculty` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `Faculty_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` CHAR(36) NOT NULL,
    `url` VARCHAR(200) NOT NULL,
    `block` CHAR(36) NOT NULL,
    `uploaded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` CHAR(36) NULL,
    `tutorId` CHAR(36) NULL,
    `materialId` CHAR(36) NULL,

    INDEX `File_userId_idx`(`userId`),
    INDEX `File_tutorId_idx`(`tutorId`),
    INDEX `File_materialId_idx`(`materialId`),
    INDEX `File_uploaded_idx`(`uploaded`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` CHAR(36) NOT NULL,
    `description` TEXT NULL,
    `header` VARCHAR(280) NOT NULL,
    `userId` CHAR(36) NULL,
    `tutorId` CHAR(36) NULL,
    `uploaded` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Material_uploaded_idx`(`uploaded`),
    INDEX `Material_userId_idx`(`userId`),
    INDEX `Material_tutorId_idx`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Semester` (
    `id` CHAR(36) NOT NULL,
    `name` CHAR(3) NOT NULL,

    UNIQUE INDEX `Semester_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` CHAR(36) NOT NULL,
    `body` TEXT NOT NULL,
    `header` VARCHAR(280) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `News_time_idx`(`time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegacyRating` (
    `id` CHAR(36) NOT NULL,
    `personality` DOUBLE NOT NULL,
    `personalityCount` INTEGER NOT NULL,
    `exams` DOUBLE NOT NULL,
    `examsCount` INTEGER NOT NULL,
    `quality` DOUBLE NOT NULL,
    `qualityCount` INTEGER NOT NULL,
    `tutorId` CHAR(36) NOT NULL,

    UNIQUE INDEX `LegacyRating_tutorId_key`(`tutorId`),
    INDEX `LegacyRating_tutorId_idx`(`tutorId`),
    INDEX `LegacyRating_personality_idx`(`personality`),
    INDEX `LegacyRating_personalityCount_idx`(`personalityCount`),
    INDEX `LegacyRating_exams_idx`(`exams`),
    INDEX `LegacyRating_examsCount_idx`(`examsCount`),
    INDEX `LegacyRating_quality_idx`(`quality`),
    INDEX `LegacyRating_qualityCount_idx`(`qualityCount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` CHAR(36) NOT NULL,
    `body` TEXT NOT NULL,
    `tutorId` CHAR(36) NOT NULL,
    `userId` CHAR(36) NULL,
    `uploaded` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Quote_uploaded_idx`(`uploaded`),
    INDEX `Quote_userId_idx`(`userId`),
    INDEX `Quote_tutorId_idx`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rate` (
    `id` CHAR(36) NOT NULL,
    `punctuality` INTEGER NOT NULL,
    `personality` INTEGER NOT NULL,
    `exams` INTEGER NOT NULL,
    `quality` INTEGER NOT NULL,
    `tutorId` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,

    INDEX `Rate_userId_idx`(`userId`),
    INDEX `Rate_tutorId_idx`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` CHAR(36) NOT NULL,
    `header` VARCHAR(280) NOT NULL,
    `body` TEXT NOT NULL,
    `uploaded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `legacyNickname` VARCHAR(200) NULL,
    `userId` CHAR(36) NULL,
    `tutorId` CHAR(36) NOT NULL,

    INDEX `Review_userId_idx`(`userId`),
    INDEX `Review_tutorId_idx`(`tutorId`),
    UNIQUE INDEX `Review_userId_tutorId_key`(`userId`, `tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutor` (
    `id` CHAR(36) NOT NULL,
    `firstName` VARCHAR(64) NULL,
    `lastName` VARCHAR(64) NULL,
    `fatherName` VARCHAR(64) NULL,
    `nickName` VARCHAR(64) NULL,
    `url` VARCHAR(191) NULL,
    `updated` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Tutor_nickName_key`(`nickName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Internal` (
    `name` VARCHAR(200) NOT NULL,
    `value` TEXT NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DisciplineToTutor` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_DisciplineToTutor_AB_unique`(`A`, `B`),
    INDEX `_DisciplineToTutor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DisciplineToMaterial` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_DisciplineToMaterial_AB_unique`(`A`, `B`),
    INDEX `_DisciplineToMaterial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FacultyToTutor` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_FacultyToTutor_AB_unique`(`A`, `B`),
    INDEX `_FacultyToTutor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FacultyToMaterial` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_FacultyToMaterial_AB_unique`(`A`, `B`),
    INDEX `_FacultyToMaterial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FileToMaterial` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_FileToMaterial_AB_unique`(`A`, `B`),
    INDEX `_FileToMaterial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_materials_likes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_materials_likes_AB_unique`(`A`, `B`),
    INDEX `_materials_likes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_materials_dislikes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_materials_dislikes_AB_unique`(`A`, `B`),
    INDEX `_materials_dislikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MaterialToSemester` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_MaterialToSemester_AB_unique`(`A`, `B`),
    INDEX `_MaterialToSemester_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_quotes_likes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_quotes_likes_AB_unique`(`A`, `B`),
    INDEX `_quotes_likes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_quotes_dislikes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_quotes_dislikes_AB_unique`(`A`, `B`),
    INDEX `_quotes_dislikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_reviews_likes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_reviews_likes_AB_unique`(`A`, `B`),
    INDEX `_reviews_likes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_reviews_dislikes` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_reviews_dislikes_AB_unique`(`A`, `B`),
    INDEX `_reviews_dislikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
