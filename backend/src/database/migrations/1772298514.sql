-- Add is_online to users + rooms, room_players, and games tables for multiplayer

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
