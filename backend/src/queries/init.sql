CREATE TABLE IF NOT EXISTS users (
	id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	username VARCHAR(30) NOT NULL UNIQUE,
	-- Hashed password, 128 characters long
	password VARCHAR(128) NOT NULL,
	-- PostgreSQL UTC created_at. Gets set automatically and is not editable
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE "utc")
);
