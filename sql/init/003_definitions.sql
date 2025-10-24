CREATE TABLE IF NOT EXISTS definitions (
    id SERIAL PRIMARY KEY,
    vocab_id INTEGER NOT NULL,
    parts_of_speech TEXT[] NOT NULL,
    meanings TEXT[] NOT NULL,
    tags TEXT[] NOT NULL,

    FOREIGN KEY (vocab_id) REFERENCES vocabs(id) ON DELETE CASCADE
);