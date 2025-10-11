export interface Phonetic {
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
        name?: string;
        url?: string;
    };
}

export interface Definition {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms?: string[];
    antonyms?: string[];
}

export interface Entry {
    word: string;
    phonetic?: string;
    phonetics?: Phonetic[];
    origin?: string;
    meanings: Meaning[];
    sourceUrls?: string[];
}

export interface PartOfSpeechInfo {
    definitions: string[];
    synonyms: Set<string>;
    antonyms: Set<string>;
}
