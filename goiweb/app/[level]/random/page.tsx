"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { BackendApi } from "@/services/api";
import { Vocab } from "@/classes/vocab";
import { useParams } from "next/navigation";

const TRANSITION_MS = 400; // must match CSS max-height transition duration

export default function RandomPage() {
    const params = useParams();
    const level = params.level as string;

    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [index, setIndex] = useState(0);
    const [showKana, setShowKana] = useState(false);
    const [showDefs, setShowDefs] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (level === "") return;

        const initializeVocabs = async () => {
            try {
                const fetchedVocabs = await BackendApi.fetchRandomVocabsByLevel(level.toUpperCase());
                setVocabs(fetchedVocabs.vocabs);

                if (fetchedVocabs.vocabs.length === 0) {
                    alert("No vocab found for this level.");
                }
            } catch (error) {
                alert(error);
                console.error(error);
            }
        };

        initializeVocabs();
    }, [level]);

    function go(next: number) {
        // 1. Close all revealed panels
        setShowKana(false);
        setShowDefs(false);
        setTransitioning(true);

        // 2. Wait for CSS transition to finish, then swap the word
        setTimeout(() => {
            setIndex(next);
            setTransitioning(false);
        }, TRANSITION_MS);
    }

    if (vocabs.length === 0) {
        return <main className={styles.page}><p className={styles.loading}>Loading…</p></main>;
    }

    const vocab: Vocab = vocabs[index];
    const total = vocabs.length;
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const sameAsKanji = vocab.kanji === vocab.kana;

    return (
        <main className={styles.page}>
            {/* ── Back link ── */}
            <Link href="/" className={styles.backLink}>← back</Link>

            {/* ── Progress ── */}
            <p className={styles.progress}>
                <span className={styles.progressCurrent}>{index + 1}</span>
                <span className={styles.progressSep}> of </span>
                <span>{total}</span>
            </p>

            {/* ── Card ── */}
            <div className={styles.card}>
                {/* Kanji */}
                <div className={styles.kanjiBlock}>
                    <span className={styles.levelBadge}>{vocab.level}</span>
                    <p className={styles.kanji}>{vocab.kanji}</p>
                </div>

                {/* Kana */}
                <div className={`${styles.revealBlock} ${showKana && !transitioning ? styles.revealed : ""}`}>
                    <p className={styles.kana}>{vocab.kana}</p>
                </div>

                {/* Definitions & Examples */}
                <div className={`${styles.revealBlock} ${styles.defsBlock} ${showDefs && !transitioning ? styles.revealed : ""}`}>
                    {vocab.definitions.map((def, di) => (
                        <div key={di} className={styles.definition}>
                            <p className={styles.pos}>
                                {def.parts_of_speech.join(" · ")}
                                {def.tags.length > 0 && (
                                    <span className={styles.tag}> [{def.tags.join(", ")}]</span>
                                )}
                            </p>
                            <p className={styles.meanings}>
                                {`${di + 1}. ` + def.meanings.join("; ")}
                            </p>
                        </div>
                    ))}

                    {vocab.examples.length > 0 && (
                        <div className={styles.examples}>
                            <p className={styles.examplesLabel}>Examples</p>
                            {[...vocab.examples]
                                .sort((a, b) => a.japanese.length - b.japanese.length)
                                .map((ex, ei) => (
                                    <div key={ei} className={styles.example}>
                                        <p className={styles.exJp}>{ex.japanese}</p>
                                        <p className={styles.exEn}>{ex.english}</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Toggle buttons ── */}
            <div className={styles.toggleRow}>
                {!sameAsKanji && (
                    <button
                        className={`${styles.btn} ${showKana ? styles.btnActive : styles.btnGhost}`}
                        onClick={() => setShowKana(v => !v)}
                        disabled={transitioning}
                    >
                        {showKana ? "hide reading" : "show reading"}
                    </button>
                )}
                <button
                    className={`${styles.btn} ${showDefs ? styles.btnActive : styles.btnGhost}`}
                    onClick={() => setShowDefs(v => !v)}
                    disabled={transitioning}
                >
                    {showDefs ? "hide details" : "show details"}
                </button>
            </div>

            {/* ── Navigation ── */}
            <div className={styles.navRow}>
                <button
                    className={`${styles.btn} ${styles.btnFill} ${styles.btnNav}`}
                    onClick={() => go(index - 1)}
                    disabled={isFirst || transitioning}
                >
                    ← prev
                </button>
                <button
                    className={`${styles.btn} ${styles.btnFill} ${styles.btnNav}`}
                    onClick={() => go(index + 1)}
                    disabled={isLast || transitioning}
                >
                    next →
                </button>
            </div>
        </main>
    );
}