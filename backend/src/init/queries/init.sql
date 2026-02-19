CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	username VARCHAR(30) NOT NULL UNIQUE,
	-- Hashed password, 128 characters long
	password VARCHAR(128) NOT NULL,
	email TEXT NOT NULL UNIQUE,
	-- PostgreSQL UTC created_at. Gets set automatically and is not editable
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_action_at TIMESTAMPTZ DEFAULT NULL,
	balance BIGINT DEFAULT 0 CHECK (balance >= 0),
	avatar_filename TEXT DEFAULT NULL,
	birthday DATE DEFAULT NULL CHECK (birthday >= '1900-01-01' AND birthday <= CURRENT_DATE),
	full_name VARCHAR(100) DEFAULT NULL,
	bio VARCHAR(500) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	token VARCHAR(128) PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	valid_until TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS friend_requests (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	user_from_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	user_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	CHECK (user_from_id <> user_to_id),
	UNIQUE (user_from_id, user_to_id)
);
