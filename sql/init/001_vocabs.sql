CREATE TABLE IF NOT EXISTS vocabs (
    id SERIAL PRIMARY KEY,
    kanji TEXT NOT NULL,
    kana TEXT NOT NULL,
    level TEXT NOT NULL,
    jisho_raw_response JSONB NOT NULL,

    UNIQUE(kanji, kana)
);