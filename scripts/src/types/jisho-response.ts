export interface JishoAPIResponse {
    data: JishoAPIResponseDatum[];
}

export interface JishoAPIResponseDatum {
    slug:        string;
    is_common:   boolean;
    tags:        any[];
    jlpt:        string[];
    japanese:    Japanese[];
    senses:      Sense[];
    attribution: Attribution;
}

export interface Attribution {
    jmdict:   boolean;
    jmnedict: boolean;
    dbpedia:  boolean;
}

export interface Japanese {
    word:    string;
    reading: string;
}

export interface Sense {
    english_definitions: string[];
    parts_of_speech:     string[];
    tags:                string[];
}