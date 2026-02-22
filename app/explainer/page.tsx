'use client';

import React, { useState } from 'react';
import {
    Search, Lightbulb, Shield, AlertTriangle, BookOpen,
    Loader2, Sparkles, ArrowRight, Info
} from 'lucide-react';
import styles from './page.module.css';

interface ExplanationResult {
    title: string;
    simpleExplanation: string;
    analogy: string;
    whyItMatters: string;
    whatToDo: string;
    riskLevel: 'low' | 'medium' | 'high';
}

const quickTerms = [
    'Phishing', 'Two-Factor Authentication', 'VPN', 'Ransomware', 'Firewall',
    'Encryption', 'Malware', 'Social Engineering', 'Dark Web', 'DDoS Attack',
    'Zero-Day Exploit', 'Man-in-the-Middle', 'Keylogger', 'Trojan Horse', 'Brute Force',
];

export default function Explainer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<ExplanationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleExplain = async (term?: string) => {
        const query = term || searchTerm;
        if (!query.trim()) return;
        setSearchTerm(query);
        setIsLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'explainConcept', concept: query }),
            });
            const data = await res.json();
            if (data.result) setResult(data.result);
        } catch (error) {
            console.error('Explain error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleExplain();
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><Search size={28} /> Security Jargon Translator</h1>
                <p>Type any security term — we'll explain it like you're a first-year student</p>
            </div>

            {/* Search */}
            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <input
                        className={styles.searchInput}
                        placeholder="Type a security term... (e.g., 'phishing', 'VPN', 'ransomware')"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className={styles.searchBtn}
                        onClick={() => handleExplain()}
                        disabled={isLoading || !searchTerm.trim()}
                    >
                        {isLoading ? <Loader2 size={16} /> : <Sparkles size={16} />}
                        Explain
                    </button>
                </div>

                {/* Quick Terms */}
                <div className={styles.quickTerms}>
                    {quickTerms.map(term => (
                        <button key={term} className={styles.termChip} onClick={() => handleExplain(term)}>
                            {term}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className={styles.loadingSpinner}>
                    <Loader2 size={20} /> Translating security jargon into plain English...
                </div>
            )}

            {/* Result */}
            {result && !isLoading && (
                <div className={styles.resultCard}>
                    <h2 className={styles.resultTitle}>
                        <BookOpen size={22} /> {result.title}
                    </h2>

                    <div className={styles.resultGrid}>
                        <div className={styles.infoBlock}>
                            <h4><Info size={14} /> Simple Explanation</h4>
                            <p>{result.simpleExplanation}</p>
                        </div>

                        <div className={styles.infoBlock}>
                            <h4><Lightbulb size={14} /> Real-World Analogy</h4>
                            <p>{result.analogy}</p>
                        </div>

                        <div className={styles.infoBlock}>
                            <h4><AlertTriangle size={14} /> Why You Should Care</h4>
                            <p>{result.whyItMatters}</p>
                        </div>

                        <div className={styles.infoBlock}>
                            <h4><ArrowRight size={14} /> What To Do</h4>
                            <p>{result.whatToDo}</p>
                        </div>
                    </div>

                    {/* Risk Meter */}
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: '10px' }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <Shield size={14} /> Risk Level
                        </h4>
                        <div className={styles.riskMeter}>
                            <div className={styles.riskBar}>
                                <div className={`${styles.riskFill} ${styles[result.riskLevel]}`} />
                            </div>
                            <span className={`${styles.riskLabel} ${styles[result.riskLevel]}`}>
                                {result.riskLevel}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
