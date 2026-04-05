"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Count } from "@/classes/count";
import { BackendApi } from "@/services/api";
import AboutModal from "./about";

export default function Home() {
    const [levels, setLevels] = useState<Count[]>([]);
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {
        const initializeCounts = async () => {
            try {
                const counts = await BackendApi.fetchCounts();
                setLevels(counts);
            } catch (error) {
                alert(error);
                console.error(error);
            }
        };
        initializeCounts();
    }, []);

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <p className={styles.headerLabel}>a curated vocabulary list</p>
                <h1 className={styles.headerTitle}>語彙 · Goi</h1>
                <div className={styles.headerDivider} />
            </header>

            <ul className={styles.levelList}>
                {levels.map(({ level, count }) => (
                    <li key={level} className={styles.levelRow}>
                        <span className={styles.levelTag}>{level}</span>
                        <span className={styles.wordCount}>{count.toLocaleString()} words</span>
                        <div className={styles.actions}>
                            <Link href={`/${level}/list`} className={`${styles.btn} ${styles.btnGhost}`}>
                                full list
                            </Link>
                            <Link href={`/${level}/random`} className={`${styles.btn} ${styles.btnFill}`}>
                                random
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>

            <button className={styles.footerBtn} onClick={() => setShowAbout(true)}>
                about · source · contact
            </button>

            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        </main>
    );
}