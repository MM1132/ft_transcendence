CREATE TABLE IF NOT EXISTS users (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	username VARCHAR(30) NOT NULL UNIQUE,
	-- Hashed password, 128 characters long
	password VARCHAR(128) NOT NULL,
	-- PostgreSQL UTC created_at. Gets set automatically and is not editable
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
	token VARCHAR(32) PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	valid_until TIMESTAMPTZ NOT NULL
);
