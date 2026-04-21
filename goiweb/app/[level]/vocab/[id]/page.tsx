"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BackendApi } from "@/services/api";
import { Vocab } from "@/classes/vocab";
import styles from "./page.module.css";

export default function VocabDetailPage() {
    const params = useParams();
    const level = params.level as string;
    const id = Number(params.id);

    const [vocab, setVocab] = useState<Vocab | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const result = await BackendApi.fetchVocabById(id);
                if (!cancelled) setVocab(result);
            } catch (err) {
                if (!cancelled) console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <main className={styles.page}>
                <Link href={`/${level}/list`} className={styles.backLink}>← list</Link>
                <p className={styles.loading}>Loading…</p>
            </main>
        );
    }

    if (!vocab) {
        return (
            <main className={styles.page}>
                <Link href={`/${level}/list`} className={styles.backLink}>← list</Link>
                <p className={styles.loading}>Word not found.</p>
            </main>
        );
    }

    const sameAsKanji = vocab.kanji === vocab.kana;
    const levelMismatch = vocab.level.toUpperCase() !== level.toUpperCase();
    const usuallyKana = vocab.definitions.some(def =>
        def.tags.some(tag => tag.toLowerCase().includes("usually written using kana"))
    );
    const sortedExamples = [...vocab.examples]
        .sort((a, b) => a.japanese.length - b.japanese.length);

    return (
        <main className={styles.page}>
            <Link href={`/${level}/list`} className={styles.backLink}>← list</Link>

            {/* ── Word header ── */}
            <header className={styles.header}>
                {levelMismatch && (
                    <p className={styles.levelWarning}>
                        ⚠ This word is {vocab.level}, not {level.toUpperCase()}
                    </p>
                )}
                <span className={styles.levelBadge}>{vocab.level}</span>
                {usuallyKana ? (
                    <>
                        <h1 className={styles.kanji}>{vocab.kana}</h1>
                        {!sameAsKanji && <p className={styles.kana}>{vocab.kanji}</p>}
                    </>
                ) : (
                    <>
                        <h1 className={styles.kanji}>{vocab.kanji}</h1>
                        {!sameAsKanji && <p className={styles.kana}>{vocab.kana}</p>}
                    </>
                )}
            </header>

            {/* ── Definitions ── */}
            <section className={styles.section}>
                <h2 className={styles.sectionLabel}>Definitions</h2>
                <div className={styles.definitions}>
                    {vocab.definitions.map((def, di) => (
                        <div key={di} className={styles.definition}>
                            <p className={styles.pos}>
                                {def.parts_of_speech.join(" · ")}
                                {def.tags.length > 0 && def.tags.map((tag, ti) => {
                                    const isKanaTag = tag.toLowerCase().includes("usually written using kana");
                                    return (
                                        <span
                                            key={ti}
                                            className={isKanaTag ? styles.tagKana : styles.tag}
                                        > [{tag}]</span>
                                    );
                                })}
                            </p>
                            <ol className={styles.meanings}>
                                {def.meanings.map((m, mi) => (
                                    <li key={mi}>{m}</li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Examples ── */}
            {sortedExamples.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionLabel}>Examples</h2>
                    <div className={styles.examples}>
                        {sortedExamples.map((ex, i) => (
                            <div key={i} className={styles.example}>
                                <p className={styles.exJp}>{ex.japanese}</p>
                                <p className={styles.exEn}>{ex.english}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}