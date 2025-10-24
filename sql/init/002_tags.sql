CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    vocab_id INTEGER NOT NULL,
    tag_name TEXT NOT NULL,

    UNIQUE(vocab_id, tag_name),
    FOREIGN KEY (vocab_id) REFERENCES vocabs(id) ON DELETE CASCADE
);