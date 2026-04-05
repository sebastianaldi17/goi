"use client";

import styles from "./page.module.css";
import { useEffect } from "react";

export default function AboutModal({ onClose }: { onClose: () => void }) {
    // Close on backdrop click
    function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose();
    }

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className={styles.modalBackdrop} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="About Goi">
            <div className={styles.modal}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>

                <h2 className={styles.modalTitle}>About Goi</h2>
                <div className={styles.modalDivider} />

                <div className={styles.modalBody}>
                    <p>
                        <strong>語彙 (Goi)</strong> is a vocabulary list that I curated myself while studying for the JLPT. My current weak point is the lack of vocabulary, so I help this can help myself (and others) overcome this weakness.
                    </p>
                    <p>
                        Definition & example data is sourced from <a href="https://jisho.org" target="_blank" rel="noopener noreferrer" className={styles.modalLink}>Jisho</a>.
                    </p>

                    <div className={styles.modalSection}>
                        <p className={styles.modalSectionLabel}>Links</p>
                        <div className={styles.modalLinks}>
                            <a
                                href="https://github.com/sebastianaldi17/goi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.modalLinkBtn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.654 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.371.813 1.102.813 2.222 0 1.606-.014 2.902-.014 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                Source code
                            </a>
                        </div>
                    </div>

                    <div className={styles.modalSection}>
                        <p className={styles.modalSectionLabel}>Contact</p>
                        <p>
                            Report any bugs to the <a href="https://github.com/sebastianaldi17/goi/issues" target="_blank" rel="noopener noreferrer" className={styles.modalLink}>repository issue page</a> or reach out to me via <a href="https://www.linkedin.com/in/sebastianaldi17/" target="_blank" rel="noopener noreferrer" className={styles.modalLink}>LinkedIn</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}