export type Vocab = {
    definitions: Definition[];
    examples: Example[];
    kana: string;
    kanji: string;
    level: string;
    id: number;
}

export type Definition = {
    meanings: string[];
    parts_of_speech: string[];
    tags: string[];
}

export type Example = {
    english: string;
    japanese: string;
}