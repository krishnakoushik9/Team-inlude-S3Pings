'use client';

import React, { useState } from 'react';
import {
    Shield, CheckCircle, Circle, Lightbulb, Loader2, Sparkles,
    Lock, Wifi, Eye, Mail, Smartphone, RefreshCw
} from 'lucide-react';
import styles from './page.module.css';

interface HygieneCheck {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    done: boolean;
}

const initialChecks: HygieneCheck[] = [
    { id: '2fa', title: 'Enable Two-Factor Authentication', description: 'Add an extra lock to your accounts — like having two keys for your dorm room.', icon: <Lock size={20} />, done: false },
    { id: 'passwords', title: 'Use Unique Passwords', description: 'Don\'t reuse passwords — it\'s like using the same key for your car, house, and locker.', icon: <Shield size={20} />, done: false },
    { id: 'wifi', title: 'VPN on Public WiFi', description: 'Use a VPN on campus WiFi — it wraps your data in a sealed envelope instead of a postcard.', icon: <Wifi size={20} />, done: true },
    { id: 'privacy', title: 'Social Media Privacy Check', description: 'Set profiles to private and review who can see your posts and personal info.', icon: <Eye size={20} />, done: false },
    { id: 'phishing', title: 'Complete Phishing Training', description: 'Practice spotting fake emails in the Phishing Lab.', icon: <Mail size={20} />, done: true },
    { id: 'updates', title: 'Keep Apps Updated', description: 'Updates patch security holes — like fixing a broken window before someone climbs in.', icon: <Smartphone size={20} />, done: false },
];

export default function DigitalHygiene() {
    const [checks, setChecks] = useState<HygieneCheck[]>(initialChecks);
    const [tipData, setTipData] = useState<{ title: string; tip: string; difficulty: string; actionItems: string[]; funFact: string } | null>(null);
    const [reportData, setReportData] = useState<{ score: number; grade: string; strengths: string[]; improvements: string[]; nextSteps: string[] } | null>(null);
    const [loadingTip, setLoadingTip] = useState(false);
    const [loadingReport, setLoadingReport] = useState(false);

    const completedCount = checks.filter(c => c.done).length;
    const score = Math.round((completedCount / checks.length) * 100);

    const toggleCheck = (id: string) => {
        setChecks(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
    };

    const generateTip = async () => {
        setLoadingTip(true);
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generateTip' }),
            });
            const data = await res.json();
            if (data.result) setTipData(data.result);
        } catch (e) { console.error(e); }
        finally { setLoadingTip(false); }
    };

    const generateReport = async () => {
        setLoadingReport(true);
        try {
            const answers = {
                uses2FA: checks.find(c => c.id === '2fa')?.done ?? false,
                uniquePasswords: checks.find(c => c.id === 'passwords')?.done ?? false,
                publicWifi: !(checks.find(c => c.id === 'wifi')?.done ?? false),
                socialMediaPrivate: checks.find(c => c.id === 'privacy')?.done ?? false,
                clicksLinks: !(checks.find(c => c.id === 'phishing')?.done ?? false),
                updatesApps: checks.find(c => c.id === 'updates')?.done ?? false,
            };
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generateHygieneReport', answers }),
            });
            const data = await res.json();
            if (data.result) setReportData(data.result);
        } catch (e) { console.error(e); }
        finally { setLoadingReport(false); }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><Shield size={28} /> Digital Hygiene Companion</h1>
                <p>Your personal cybersecurity health check — build good habits, one step at a time</p>
            </div>

            {/* Score Card */}
            <div className={styles.scoreCard}>
                <div className={styles.scoreRing} style={{ '--score': score } as React.CSSProperties}>
                    <span className={styles.scoreBig}>{score}%</span>
                    <span className={styles.scoreGrade}>{completedCount}/{checks.length} complete</span>
                </div>
                <h3 style={{ marginTop: '0.5rem' }}>Your Hygiene Score</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {score >= 80 ? '🎉 Great job! You\'re very well protected.' : score >= 50 ? '👍 Good progress! A few more steps to go.' : '📚 Let\'s get you secured — check off the items below.'}
                </p>
                <button className={styles.generateBtn} onClick={generateReport} disabled={loadingReport} style={{ margin: '1rem auto 0' }}>
                    {loadingReport ? <><Loader2 size={16} /> Generating...</> : <><Sparkles size={16} /> Get AI Health Report</>}
                </button>
            </div>

            {/* AI Report */}
            {reportData && (
                <div className={styles.reportSection}>
                    <h2><Sparkles size={20} /> Your Security Health Report — Grade: {reportData.grade}</h2>
                    <div className={styles.reportList}>
                        {reportData.strengths.map((s, i) => (
                            <div key={`s-${i}`} className={`${styles.reportItem} ${styles.strength}`}>
                                <CheckCircle size={16} color="var(--color-accent-green)" /> {s}
                            </div>
                        ))}
                        {reportData.improvements.map((s, i) => (
                            <div key={`i-${i}`} className={`${styles.reportItem} ${styles.improvement}`}>
                                <Lightbulb size={16} color="var(--color-warning)" /> {s}
                            </div>
                        ))}
                        {reportData.nextSteps.map((s, i) => (
                            <div key={`n-${i}`} className={`${styles.reportItem} ${styles.step}`}>
                                <Shield size={16} color="var(--color-accent-blue)" /> {s}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Checklist */}
            <div className={styles.checklistGrid}>
                {checks.map((check) => (
                    <div
                        key={check.id}
                        className={`${styles.checkItem} ${check.done ? styles.completed : styles.incomplete}`}
                        onClick={() => toggleCheck(check.id)}
                    >
                        <div className={`${styles.checkIcon} ${check.done ? styles.done : styles.todo}`}>
                            {check.done ? <CheckCircle size={22} /> : check.icon}
                        </div>
                        <div className={styles.checkText}>
                            <h4>{check.title}</h4>
                            <p>{check.description}</p>
                            <button className={styles.toggleBtn} onClick={(e) => { e.stopPropagation(); toggleCheck(check.id); }}>
                                {check.done ? 'Mark Incomplete' : 'Mark Complete ✓'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Tip */}
            <div className={styles.tipsSection}>
                <h2><Lightbulb size={20} /> AI Security Tip</h2>
                {tipData ? (
                    <div className={styles.tipCard}>
                        <h3>{tipData.title}</h3>
                        <p>{tipData.tip}</p>
                        <ul className={styles.tipActions}>
                            {tipData.actionItems.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                        <div className={styles.funFact}>💡 Fun fact: {tipData.funFact}</div>
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Click below to get a personalized security tip from AI.</p>
                )}
                <button className={styles.generateBtn} onClick={generateTip} disabled={loadingTip}>
                    {loadingTip ? <><Loader2 size={16} /> Generating...</> : <><RefreshCw size={16} /> {tipData ? 'Get Another Tip' : 'Generate a Tip'}</>}
                </button>
            </div>
        </div>
    );
}
