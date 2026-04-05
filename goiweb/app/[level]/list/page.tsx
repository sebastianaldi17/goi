"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BackendApi } from "@/services/api";
import { GetPaginatedVocabRes } from "@/classes/get_paginated_vocabs_res";
import { Vocab } from "@/classes/vocab";
import styles from "./page.module.css";

const PAGE_SIZE = 20;

export default function ListPage() {
    const params = useParams();
    const level = params.level as string;
    const router = useRouter();

    const [data, setData] = useState<GetPaginatedVocabRes | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!level) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const result = await BackendApi.fetchPaginatedVocabsByLevel(level.toUpperCase(), page, PAGE_SIZE);
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [level, page]);

    function goToPage(n: number) {
        setPage(n);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className={styles.page}>
            <Link href="/" className={styles.backLink}>← back</Link>

            <header className={styles.header}>
                <span className={styles.levelBadge}>{level?.toUpperCase()}</span>
                <h1 className={styles.title}>Full List</h1>
                {data && (
                    <p className={styles.subtitle}>
                        {data.totalElements.toLocaleString()} words
                    </p>
                )}
            </header>

            {loading ? (
                <p className={styles.loading}>Loading…</p>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Word</th>
                                <th className={styles.th}>Reading</th>
                                <th className={`${styles.th} ${styles.thMeaning}`}>Primary meaning</th>
                                <th className={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.vocabs.map((vocab: Vocab, i) => {
                                const firstMeaning = vocab.definitions?.[0]?.meanings?.[0] ?? "—";
                                const sameAsKanji = vocab.kanji === vocab.kana;
                                return (
                                    <tr
                                        key={vocab.id}
                                        className={styles.row}
                                        style={{ animationDelay: `${i * 0.03}s` }}
                                        onClick={() => router.push(`/${level}/vocab/${vocab.id}`)}
                                    >
                                        <td className={styles.tdKanji}>{vocab.kanji}</td>
                                        <td className={styles.tdKana}>
                                            {sameAsKanji ? <span className={styles.dash}>—</span> : vocab.kana}
                                        </td>
                                        <td className={`${styles.tdMeaning} ${styles.tdMeaningHide}`}>
                                            {firstMeaning}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {data && data.totalPages > 1 && (
                        <nav className={styles.pagination}>
                            <button
                                className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 0}
                            >
                                ← prev
                            </button>

                            <div className={styles.pageNumbers}>
                                {Array.from({ length: data.totalPages }, (_, i) => {
                                    // Show first, last, current ±1, and ellipses
                                    const isEdge = i === 0 || i === data.totalPages - 1;
                                    const isNear = Math.abs(i - page) <= 1;
                                    if (!isEdge && !isNear) {
                                        if (i === 1 || i === data.totalPages - 2) {
                                            return <span key={i} className={styles.ellipsis}>…</span>;
                                        }
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={i}
                                            className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ""}`}
                                            onClick={() => goToPage(i)}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                                onClick={() => goToPage(page + 1)}
                                disabled={page === data.totalPages - 1}
                            >
                                next →
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}