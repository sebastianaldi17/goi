import { Count } from "@/classes/count";
import { GetPaginatedVocabRes } from "@/classes/get_paginated_vocabs_res";
import { GetRandomVocabsRes } from "@/classes/get_random_vocabs_res";
import { Vocab } from "@/classes/vocab";

export class BackendApi {
    static async fetchCounts(): Promise<Count[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vocabs/counts`);
        if (!response.ok) {
            throw new Error("Failed to fetch counts");
        }
        return response.json();
    }

    static async fetchRandomVocabsByLevel(level: string): Promise<GetRandomVocabsRes> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vocabs/${level}/random`);
        if (!response.ok) {
            throw new Error("Failed to fetch random vocabs");
        }
        return response.json();
    }

    static async fetchPaginatedVocabsByLevel(level: string, page: number, size: number): Promise<GetPaginatedVocabRes> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vocabs/${level}/list?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error("Failed to fetch paginated vocabs");
        }
        return response.json();
    }

    static async fetchVocabById(id: number): Promise<Vocab> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vocabs/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch vocab by id");
        }
        return response.json();
    }
}