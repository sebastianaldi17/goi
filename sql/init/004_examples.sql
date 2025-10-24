CREATE TABLE IF NOT EXISTS examples (
    id SERIAL PRIMARY KEY,
    vocab_id INTEGER NOT NULL,
    japanese TEXT NOT NULL,
    english TEXT NOT NULL,

    FOREIGN KEY (vocab_id) REFERENCES vocabs(id) ON DELETE CASCADE
);