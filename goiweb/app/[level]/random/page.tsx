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

        let cancelled = false;

        const initializeVocabs = async () => {
            try {
                const fetchedVocabs = await BackendApi.fetchRandomVocabsByLevel(level.toUpperCase());
                if (!cancelled) {
                    setVocabs(fetchedVocabs.vocabs);
                    if (fetchedVocabs.vocabs.length === 0) {
                        alert("No vocab found for this level.");
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    alert(error);
                    console.error(error);
                }
            }
        };

        initializeVocabs();
        return () => { cancelled = true; };
    }, [level]);

    function go(next: number) {
        setShowKana(false);
        setShowDefs(false);
        setTransitioning(true);

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
    const usuallyKana = vocab.definitions.some(def =>
        def.tags.some(tag => tag.toLowerCase().includes("usually written using kana"))
    );

    // When usuallyKana: hero shows kana, "show reading" reveals kanji
    // Otherwise:        hero shows kanji, "show reading" reveals kana
    const heroText    = usuallyKana ? vocab.kana  : vocab.kanji;
    const revealText  = usuallyKana ? vocab.kanji : vocab.kana;

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
                {/* Hero character */}
                <div className={styles.kanjiBlock}>
                    <span className={styles.levelBadge}>{vocab.level}</span>
                    <p className={styles.kanji}>{heroText}</p>
                </div>

                {/* Revealed reading (kanji or kana depending on usuallyKana) */}
                {!sameAsKanji && (
                    <div className={`${styles.revealBlock} ${showKana && !transitioning ? styles.revealed : ""}`}>
                        <p className={styles.kana}>{revealText}</p>
                    </div>
                )}

                {/* Definitions & Examples */}
                <div className={`${styles.revealBlock} ${styles.defsBlock} ${showDefs && !transitioning ? styles.revealed : ""}`}>
                    {vocab.definitions.map((def, di) => (
                        <div key={di} className={styles.definition}>
                            <p className={styles.pos}>
                                {def.parts_of_speech.join(" · ")}
                                {def.tags.length > 0 && def.tags.map((tag, ti) => {
                                    const isKanaTag = tag.toLowerCase().includes("usually written using kana");
                                    return (
                                        <span key={ti} className={isKanaTag ? styles.tagKana : styles.tag}>
                                            {" "}[{tag}]
                                        </span>
                                    );
                                })}
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
                        {showKana
                            ? "hide reading"
                            : usuallyKana ? "show kanji" : "show reading"
                        }
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