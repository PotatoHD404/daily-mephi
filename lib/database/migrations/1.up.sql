CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255),
  access_token VARCHAR(255),
  created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP(0),
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token VARCHAR(255),
  session_state VARCHAR(255)
);

CREATE INDEX accounts_type_provider_provider_accounts_id_idx ON accounts(type, provider, provider_account_id);

CREATE INDEX accounts_user_id_idx ON accounts(user_id);

CREATE UNIQUE INDEX accounts_provider_provider_accounts_id_key ON accounts(provider, provider_account_id);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL,
  expires TIMESTAMP(0) NOT NULL,
  created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX sessions_session_token_key ON sessions(session_token);

CREATE INDEX sessions_user_id_idx ON sessions(user_id);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(50),
  image_id UUID,
  image UUID GENERATED ALWAYS AS (image_id) STORED,
  role VARCHAR(255) NOT NULL DEFAULT 'default',
  email VARCHAR(255),
  email_verified TIMESTAMP(0),
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  banned BOOLEAN DEFAULT FALSE NOT NULL,
  banned_reason VARCHAR(255),
  banned_at TIMESTAMP(0),
  ban_expires_at TIMESTAMP(0),
  rating FLOAT8 NOT NULL DEFAULT 0,
  bio VARCHAR(150)
);

CREATE UNIQUE INDEX users_name_key ON users(name);

CREATE UNIQUE INDEX users_image_id_key ON users(image_id);

CREATE UNIQUE INDEX users_email_key ON users(email);

CREATE INDEX users_rating_idx ON users(rating);

CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP(0) NOT NULL,
  created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX verification_tokens_token_key ON verification_tokens(token);

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON verification_tokens(identifier, token);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
  user_id UUID NOT NULL,
  review_id UUID,
  material_id UUID,
  news_id UUID,
  parent_id UUID
);

CREATE INDEX comments_created_at_idx ON comments(created_at);

CREATE INDEX comments_user_id_idx ON comments(user_id);

CREATE INDEX comments_review_id_idx ON comments(review_id);

CREATE INDEX comments_material_id_idx ON comments(material_id);

CREATE INDEX comments_news_id_idx ON comments(news_id);

CREATE INDEX comments_parent_id_idx ON comments(parent_id);

CREATE TABLE disciplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(400) NOT NULL
);

CREATE UNIQUE INDEX disciplines_name_key ON disciplines(name);

CREATE TABLE faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(200) NOT NULL
);

CREATE UNIQUE INDEX faculties_name_key ON faculties(name);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  url VARCHAR(2000) NOT NULL,
  alt_url VARCHAR(2000),
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
  filename VARCHAR(500) NOT NULL,
  user_id UUID,
  tutor_id UUID,
  material_id UUID,
  tag VARCHAR(200),
  size INT4 NOT NULL DEFAULT 0
);

CREATE INDEX files_user_id_idx ON files(user_id);

CREATE INDEX files_tutor_id_idx ON files(tutor_id);

CREATE INDEX files_material_id_idx ON files(material_id);

CREATE INDEX files_created_at_idx ON files(created_at);

CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  text TEXT,
  title VARCHAR(280) NOT NULL,
  user_id UUID,
  tutor_id UUID,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
);

CREATE INDEX materials_created_at_idx ON materials(created_at);

CREATE INDEX materials_user_id_idx ON materials(user_id);

CREATE INDEX materials_tutor_id_idx ON materials(tutor_id);

CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name CHAR(3) NOT NULL
);

CREATE UNIQUE INDEX semesters_name_key ON semesters(name);

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  text TEXT NOT NULL,
  title VARCHAR(280) NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
);

CREATE INDEX news_created_at_idx ON news(created_at);

CREATE TABLE legacy_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  personality FLOAT8 NOT NULL,
  personality_count INT4 NOT NULL,
  exams FLOAT8 NOT NULL,
  exams_count INT4 NOT NULL,
  quality FLOAT8 NOT NULL,
  quality_count INT4 NOT NULL,
  tutor_id UUID NOT NULL,
  avg_rating FLOAT8 GENERATED ALWAYS AS ((personality * personality_count::FLOAT8 + exams * exams_count::FLOAT8 + quality * quality_count::FLOAT8) / (personality_count + exams_count + quality_count)::FLOAT8) STORED NOT NULL,
  rating_count INT4 GENERATED ALWAYS AS (ceil((personality_count + exams_count + quality_count)::DECIMAL / 3)) STORED NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
);

CREATE UNIQUE INDEX legacy_ratings_tutor_id_key ON legacy_ratings(tutor_id);

CREATE INDEX legacy_ratings_tutor_id_idx ON legacy_ratings(tutor_id);

CREATE INDEX legacy_ratings_personality_idx ON legacy_ratings(personality);

CREATE INDEX legacy_ratings_personality_count_idx ON legacy_ratings(personality_count);

CREATE INDEX legacy_ratings_exams_idx ON legacy_ratings(exams);

CREATE INDEX legacy_ratings_exams_count_idx ON legacy_ratings(exams_count);

CREATE INDEX legacy_ratings_quality_idx ON legacy_ratings(quality);

CREATE INDEX legacy_ratings_quality_count_idx ON legacy_ratings(quality_count);

CREATE INDEX legacy_ratings_avg_rating_idx ON legacy_ratings(avg_rating);

CREATE INDEX legacy_ratings_rating_count_idx ON legacy_ratings(rating_count);

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  text TEXT NOT NULL,
  tutor_id UUID NOT NULL,
  user_id UUID,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
);

CREATE INDEX quotes_created_at_idx ON quotes(created_at);

CREATE INDEX quotes_user_id_idx ON quotes(user_id);

CREATE INDEX quotes_tutor_id_idx ON quotes(tutor_id);

CREATE TABLE rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  punctuality INT4 NOT NULL,
  personality INT4 NOT NULL,
  exams INT4 NOT NULL,
  quality INT4 NOT NULL,
  tutor_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
);

CREATE INDEX rates_user_id_idx ON rates(user_id);

CREATE INDEX rates_tutor_id_idx ON rates(tutor_id);

CREATE UNIQUE INDEX rates_user_id_tutor_id_key ON rates(user_id, tutor_id);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  title VARCHAR(280) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(0),
  legacy_nickname VARCHAR(200),
  user_id UUID,
  tutor_id UUID NOT NULL
);

CREATE INDEX reviews_created_at_idx ON reviews(created_at);

CREATE INDEX reviews_user_id_idx ON reviews(user_id);

CREATE INDEX reviews_tutor_id_idx ON reviews(tutor_id);

CREATE UNIQUE INDEX reviews_user_id_tutor_id_key ON reviews(user_id, tutor_id);

CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  quote_id UUID,
  material_id UUID,
  review_id UUID,
  comment_id UUID,
  news_id UUID,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  like BOOL NOT NULL
);

CREATE INDEX reactions_user_id_idx ON reactions(user_id);

CREATE INDEX reactions_quote_id_idx ON reactions(quote_id);

CREATE INDEX reactions_material_id_idx ON reactions(material_id);

CREATE INDEX reactions_review_id_idx ON reactions(review_id);

CREATE INDEX reactions_comment_id_idx ON reactions(comment_id);

CREATE INDEX reactions_news_id_idx ON reactions(news_id);

CREATE UNIQUE INDEX reactions_user_id_quote_id_key ON reactions(user_id, quote_id);

CREATE UNIQUE INDEX reactions_user_id_material_id_key ON reactions(user_id, material_id);

CREATE UNIQUE INDEX reactions_user_id_review_id_key ON reactions(user_id, review_id);

CREATE UNIQUE INDEX reactions_user_id_comment_id_key ON reactions(user_id, comment_id);

CREATE UNIQUE INDEX reactions_user_id_news_id_key ON reactions(user_id, news_id);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  data TEXT,
  user_id UUID,
  tutor_id UUID,
  material_id UUID,
  review_id UUID,
  quote_id UUID,
  news_id UUID,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
);

CREATE UNIQUE INDEX documents_user_id_key ON documents(user_id);

CREATE UNIQUE INDEX documents_tutor_id_key ON documents(tutor_id);

CREATE UNIQUE INDEX documents_material_id_key ON documents(material_id);

CREATE UNIQUE INDEX documents_review_id_key ON documents(review_id);

CREATE UNIQUE INDEX documents_quote_id_key ON documents(quote_id);

CREATE UNIQUE INDEX documents_news_id_key ON documents(news_id);

CREATE INDEX documents_type_key ON documents(type);

CREATE INDEX documents_created_at_key ON documents(created_at);

CREATE INDEX documents_data_idx ON documents USING GIN ((to_tsvector('russian', data) || to_tsvector('english', data)));

CREATE INDEX documents_data_idx2 ON documents USING GIN (data gin_trgm_ops);

CREATE TABLE tutors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    father_name VARCHAR(64),
    nick_name VARCHAR(64),
    url TEXT,
    full_name VARCHAR(255) GENERATED ALWAYS AS (CASE WHEN first_name IS NULL AND last_name IS NULL
                                            AND father_name IS NULL THEN NULL ELSE (CASE WHEN last_name IS NULL THEN ''
                                            ELSE last_name END || CASE WHEN first_name IS NULL THEN '' ELSE ' ' || first_name
                                            END || CASE WHEN father_name IS NULL THEN '' ELSE ' ' || father_name END) END) STORED,

    short_name VARCHAR(128) GENERATED ALWAYS AS (CASE WHEN first_name IS NULL AND last_name IS NULL
                                                AND father_name IS NULL THEN NULL ELSE (CASE WHEN last_name IS NULL THEN ''
                                                ELSE last_name END || CASE WHEN first_name IS NULL THEN '' ELSE ' ' || LEFT(first_name, 1) || '.'
                                                END || CASE WHEN father_name IS NULL THEN '' ELSE ' ' || father_name || '.' END) END) STORED,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP(0)
);

CREATE UNIQUE INDEX tutors_nick_name_key ON tutors(nick_name);

CREATE TABLE internals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name VARCHAR(200) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    expires TIMESTAMP(0)
);

CREATE TABLE tutors_disciplines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    discipline_id UUID NOT NULL,
    tutor_id UUID NOT NULL
);

CREATE UNIQUE INDEX tutors_disciplines_discipline_id_tutor_id_unique ON tutors_disciplines(discipline_id, tutor_id);

CREATE INDEX tutors_disciplines_tutor_id_index ON tutors_disciplines(tutor_id);

CREATE TABLE materials_disciplines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    discipline_id UUID NOT NULL,
    material_id UUID NOT NULL
);

CREATE UNIQUE INDEX materials_disciplines_discipline_id_material_id_unique ON materials_disciplines (discipline_id, material_id);

CREATE INDEX materials_disciplines_material_id_index ON materials_disciplines (material_id);

CREATE TABLE tutors_faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    tutor_id UUID NOT NULL,
    faculty_id UUID NOT NULL
);

CREATE UNIQUE INDEX tutors_faculties_tutor_id_faculty_id_unique ON tutors_faculties (tutor_id, faculty_id);

CREATE INDEX tutors_faculties_faculty_id_index ON tutors_faculties (faculty_id);

CREATE TABLE materials_faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    faculty_id UUID NOT NULL,
    material_id UUID NOT NULL
);

CREATE UNIQUE INDEX materials_faculties_faculty_id_material_id_unique ON materials_faculties (faculty_id, material_id);

CREATE INDEX materials_faculties_material_id_index ON materials_faculties (material_id);

CREATE TABLE material_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    material_id UUID NOT NULL,
    semester_id UUID NOT NULL
);

CREATE UNIQUE INDEX materials_semesters_material_id_semester_id_unique ON materials_semesters(material_id, semester_id);

CREATE INDEX materials_semesters_semester_id_index ON materials_semesters(semester_id);

ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE users ADD CONSTRAINT users_image_id_fkey FOREIGN KEY (image_id) REFERENCES files(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT reviews_comments FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT materials_comments FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT news_comments FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE files ADD CONSTRAINT files_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE files ADD CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE files ADD CONSTRAINT files_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE materials ADD CONSTRAINT materials_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials ADD CONSTRAINT materials_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE legacy_ratings ADD CONSTRAINT legacy_ratings_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE quotes ADD CONSTRAINT quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE quotes ADD CONSTRAINT quotes_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE rates ADD CONSTRAINT rates_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE rates ADD CONSTRAINT rates_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT reviews_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE reactions ADD CONSTRAINT reactions_news_id_fkey FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_news_id_fkey FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tutors_disciplines ADD CONSTRAINT tutors_disciplines_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tutors_disciplines ADD CONSTRAINT tutors_disciplines_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_disciplines ADD CONSTRAINT materials_disciplines_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_disciplines ADD CONSTRAINT materials_disciplines_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tutors_faculties ADD CONSTRAINT tutors_faculties_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tutors_faculties ADD CONSTRAINT tutors_faculties_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_faculties ADD CONSTRAINT materials_faculties_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_faculties ADD CONSTRAINT materials_faculties_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_semesters ADD CONSTRAINT materials_semesters_material_id_fkey FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE materials_semesters ADD CONSTRAINT materials_semesters_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE ON UPDATE CASCADE;
