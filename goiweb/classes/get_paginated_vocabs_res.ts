import { Vocab } from "./vocab";

export type GetPaginatedVocabRes = {
    totalElements: number;
    totalPages:    number;
    currentPage:   number;
    totalInPage:   number;
    vocabs:        Vocab[];
}