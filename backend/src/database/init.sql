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

	birthday DATE DEFAULT NULL
		CHECK (birthday >= '1900-01-01' AND birthday <= CURRENT_DATE),
	full_name VARCHAR(100) DEFAULT NULL,
	bio VARCHAR(500) DEFAULT NULL,
	is_online BOOLEAN NOT NULL DEFAULT FALSE
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

CREATE TABLE IF NOT EXISTS friends (
	user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	CHECK (user1_id <> user2_id),
	PRIMARY KEY (user1_id, user2_id)
);

-- CREATE TABLE room_players (
--     room_id INTEGER NOT NULL,
--     user_id INTEGER NOT NULL,
--     player_slot INTEGER NOT NULL,
--     is_ready BOOLEAN NOT NULL DEFAULT FALSE,
--     joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
--     PRIMARY KEY (room_id, user_id),
--     FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- i add it to check the Rooms creation when we fix the migrations we can delete it 
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN NOT NULL DEFAULT FALSE;

DO $$ BEGIN CREATE TYPE room_status AS ENUM ('WAITING', 'IN_GAME', 'FINISHED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE win_condition AS ENUM ('BEST_OF', 'SCORE', 'TIME'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE game_status AS ENUM ('ACTIVE', 'PAUSED', 'FINISHED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    max_players INT NOT NULL DEFAULT 2 CHECK (max_players >= 2 AND max_players <= 4),
    buy_in_amount INT NOT NULL DEFAULT 0,
    time_limit_seconds INT DEFAULT NULL,
    win_condition win_condition NOT NULL DEFAULT 'SCORE',
    status room_status NOT NULL DEFAULT 'WAITING',
    is_permanent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_players (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    player_slot INT NOT NULL CHECK (player_slot >= 1 AND player_slot <= 4),
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(room_id, player_slot)
);

CREATE INDEX IF NOT EXISTS idx_room_players_room_id ON room_players(room_id);

CREATE TABLE IF NOT EXISTS games (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    status game_status NOT NULL DEFAULT 'ACTIVE',
    game_state JSONB,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_games_room_id ON games(room_id);

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);











-- DUMMY DATA
INSERT INTO users
(id, username, password, email, balance)
VALUES (
	'019c8f02-765b-7865-b202-97008ab62579', 
	'DevUser', 
	'f8373c5c44d24505fdd7e4ab7a97ab391dc199ed60dee48270c7280d78707fc1f973ee26955bd3c284213aec3191071c4de16264a08d37cad935f197e1a4e885',
	'dev@user.de',
	1000
)
ON CONFLICT DO NOTHING;

