DROP DATABASE IF EXISTS pokedeck;
CREATE DATABASE pokedeck;
\c pokedeck

CREATE TABLE types (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO types (name) VALUES
  ('normal'),
  ('fire'),
  ('water'),
  ('electric'),
  ('grass'),
  ('ice'),
  ('fighting'),
  ('poison'),
  ('ground'),
  ('flying'),
  ('psychic'),
  ('bug'),
  ('rock'),
  ('ghost'),
  ('dragon'),
  ('dark'),
  ('steel'),
  ('fairy');

CREATE TABLE pokemon (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  image VARCHAR(255),
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  special_attack INTEGER NOT NULL,
  special_defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  total INTEGER NOT NULL
);

CREATE TABLE pokemon_types (
  id SERIAL PRIMARY KEY,
  pokemon_id INTEGER
  REFERENCES pokemon(id)
  ON DELETE CASCADE,
  type_id INTEGER
  REFERENCES types(id)
  ON DELETE CASCADE
);

CREATE INDEX idx_pokemon_name ON pokemon(name);

CREATE INDEX idx_types_name ON types(name);


