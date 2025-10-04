
CREATE DATABASE sensors-service-db;

\c sensors-service-db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sensor_type') THEN
    CREATE TYPE sensor_type AS ENUM ('temperature');
  END IF;
END
$$;


CREATE TABLE IF NOT EXISTS homes (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS rooms (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_rooms_home FOREIGN KEY (home_id)
        REFERENCES homes(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rooms_home_id ON rooms(home_id);


CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type sensor_type NOT NULL DEFAULT 'temperature',
    location VARCHAR(255) NOT NULL,
    isEnabled BOOLEAN NOT NULL,
    value DOUBLE PRECISION DEFAULT 0,
    unit VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'unknown',
    room_id UUID NULL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_sensors_room FOREIGN KEY (room_id)
        REFERENCES rooms(uid) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sensors_type ON sensors(type);
CREATE INDEX IF NOT EXISTS idx_sensors_location ON sensors(location);
CREATE INDEX IF NOT EXISTS idx_sensors_status ON sensors(status);
CREATE INDEX IF NOT EXISTS idx_sensors_room_id ON sensors(room_id);