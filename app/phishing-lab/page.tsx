'use client';

import React, { useState } from 'react';
import {
    Mail, AlertTriangle, Brain, FileText, CheckCircle, XCircle,
    Upload, Lightbulb, Target, Loader2, HelpCircle
} from 'lucide-react';
import styles from './page.module.css';

type Tab = 'analyze' | 'practice';

interface AnalysisResult {
    isAIGenerated: boolean;
    confidence: number;
    indicators: string[];
    verdict: string;
    explanation: string;
    teachBack: { question: string; correctAnswer: string; hint: string }[];
}

// Practice emails for inbox simulation
const practiceEmails = [
    {
        id: 1,
        subject: 'Urgent: Your Scholarship Application Expires Today!',
        sender: 'scholarships@university-aid.com',
        isPhishing: true,
        explanation: 'Real scholarship offices use your university\'s official domain, not generic ones. The urgency is a pressure tactic.',
    },
    {
        id: 2,
        subject: 'Library Book Due Reminder',
        sender: 'library@youruniversity.edu',
        isPhishing: false,
        explanation: 'This is from your university\'s official domain and has a neutral, informational tone.',
    },
    {
        id: 3,
        subject: 'Free MacBook Pro — Campus Giveaway Winner!!',
        sender: 'campus-rewards@student-deals.net',
        isPhishing: true,
        explanation: 'If it sounds too good to be true, it probably is. Universities don\'t do giveaways from external domains.',
    },
    {
        id: 4,
        subject: 'Course Registration Opens Monday',
        sender: 'registrar@youruniversity.edu',
        isPhishing: false,
        explanation: 'Official domain, normal language, no urgency pressure or suspicious links.',
    },
    {
        id: 5,
        subject: 'Your account will be suspended — verify immediately',
        sender: 'security@g00gle-verify.com',
        isPhishing: true,
        explanation: 'Notice the suspicious domain with zeroes instead of \'o\'s. Real Google would never email from this domain.',
    },
];

import { useSystem } from '@/contexts/SystemContext';

export default function PhishingLab() {
    const { localScrubbing } = useSystem();
    const [activeTab, setActiveTab] = useState<Tab>('analyze');
    const [emailContent, setEmailContent] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [practiceAnswers, setPracticeAnswers] = useState<Record<number, 'safe' | 'phishing' | null>>({});
    const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string | null>>({});

    const handleAnalyze = async () => {
        if (!emailContent.trim()) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'detectPhishing', emailContent, localScrubbing }),
            });
            const data = await res.json();
            if (data.result) {
                setAnalysisResult(data.result);
            }
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePracticeAnswer = (emailId: number, answer: 'safe' | 'phishing') => {
        setPracticeAnswers(prev => ({ ...prev, [emailId]: answer }));
        setShowExplanation(prev => ({ ...prev, [emailId]: true }));
    };

    const practiceScore = Object.entries(practiceAnswers).filter(([id, answer]) => {
        const email = practiceEmails.find(e => e.id === Number(id));
        if (!email) return false;
        return (answer === 'phishing') === email.isPhishing;
    }).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><Mail size={28} /> Phishing Lab</h1>
                <p>Learn to spot phishing emails with AI-powered analysis and interactive practice</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'analyze' ? styles.active : ''}`}
                    onClick={() => setActiveTab('analyze')}
                >
                    <Brain size={16} /> Analyze an Email
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'practice' ? styles.active : ''}`}
                    onClick={() => setActiveTab('practice')}
                >
                    <Target size={16} /> Practice Inbox ({practiceScore}/{Object.keys(practiceAnswers).length} correct)
                </button>
            </div>

            {/* Analyze Tab */}
            {activeTab === 'analyze' && (
                <>
                    <div className={styles.analyzerSection}>
                        <h2><Brain size={20} /> Email Analyzer</h2>
                        <textarea
                            className={styles.emailInput}
                            placeholder="Paste a suspicious email here to analyze it for phishing patterns. Our AI will explain what to look for..."
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                        />
                        <button
                            className={styles.analyzeBtn}
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !emailContent.trim()}
                        >
                            {isAnalyzing ? <><Loader2 size={16} /> Analyzing...</> : <><Upload size={16} /> Analyze Email</>}
                        </button>
                    </div>

                    {/* Analysis Result */}
                    {analysisResult && (
                        <div className={styles.resultsSection}>
                            <h2><FileText size={20} /> Analysis Result</h2>
                            <div className={`${styles.resultCard} ${styles[analysisResult.verdict]}`}>
                                <div className={styles.resultHeader}>
                                    <div className={styles.resultInfo}>
                                        <h3>{analysisResult.verdict === 'phishing' ? '🚨 Phishing Detected' : analysisResult.verdict === 'suspicious' ? '⚠️ Suspicious Email' : '✅ Looks Legitimate'}</h3>
                                    </div>
                                    <div className={styles.resultScore}>
                                        <span className={styles.aiScore}>{analysisResult.confidence}%</span>
                                        <span className={styles.aiLabel}>AI Confidence</span>
                                    </div>
                                </div>

                                <div className={styles.resultBody}>
                                    <span className={`${styles.verdictBadge} ${styles[analysisResult.verdict]}`}>
                                        {analysisResult.verdict === 'phishing' && <XCircle size={14} />}
                                        {analysisResult.verdict === 'legitimate' && <CheckCircle size={14} />}
                                        {analysisResult.verdict === 'suspicious' && <AlertTriangle size={14} />}
                                        {analysisResult.verdict}
                                    </span>

                                    <div className={styles.reasons}>
                                        <strong>🔍 Red Flags Found:</strong>
                                        <ul>
                                            {analysisResult.indicators.map((indicator, idx) => (
                                                <li key={idx}>{indicator}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Explanation Card */}
                                    <div className={styles.explainCard}>
                                        <h4><Lightbulb size={16} /> Why is this dangerous?</h4>
                                        <p>{analysisResult.explanation}</p>
                                    </div>

                                    {/* Teach-Back Quiz */}
                                    {analysisResult.teachBack && analysisResult.teachBack.length > 0 && (
                                        <div className={styles.teachBack}>
                                            <h4><HelpCircle size={16} /> Test Your Understanding</h4>
                                            {analysisResult.teachBack.map((q, idx) => {
                                                const key = `tb-${idx}`;
                                                return (
                                                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                                                        <p className={styles.quizQuestion}>{q.question}</p>
                                                        {quizAnswers[key] === null || quizAnswers[key] === undefined ? (
                                                            <>
                                                                <button
                                                                    className={styles.quizOption}
                                                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [key]: q.correctAnswer }))}
                                                                >
                                                                    Show Answer
                                                                </button>
                                                                <p className={styles.hintText}>💡 Hint: {q.hint}</p>
                                                            </>
                                                        ) : (
                                                            <div className={`${styles.quizOption} ${styles.correct}`}>
                                                                ✅ {q.correctAnswer}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Practice Tab */}
            {activeTab === 'practice' && (
                <div className={styles.resultsSection}>
                    <h2><Target size={20} /> Spot the Phishing — Practice Inbox</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        For each email, decide: is it <strong>safe</strong> or <strong>phishing</strong>?
                    </p>
                    <div className={styles.inboxGrid}>
                        {practiceEmails.map((email) => {
                            const userAnswer = practiceAnswers[email.id];
                            const isCorrect = userAnswer ? (userAnswer === 'phishing') === email.isPhishing : null;
                            return (
                                <div key={email.id}>
                                    <div className={`${styles.inboxItem} ${userAnswer ? styles.selected : ''}`}>
                                        <div className={styles.inboxIcon}>
                                            <Mail size={20} />
                                        </div>
                                        <div className={styles.inboxContent}>
                                            <div className={styles.inboxSubject}>{email.subject}</div>
                                            <div className={styles.inboxSender}>From: {email.sender}</div>
                                        </div>
                                        {!userAnswer ? (
                                            <div className={styles.inboxBtns}>
                                                <button className={styles.safeBtn} onClick={() => handlePracticeAnswer(email.id, 'safe')}>
                                                    ✅ Safe
                                                </button>
                                                <button className={styles.phishBtn} onClick={() => handlePracticeAnswer(email.id, 'phishing')}>
                                                    🚨 Phishing
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                color: isCorrect ? 'var(--color-accent-green)' : 'var(--color-danger)',
                                            }}>
                                                {isCorrect ? '✅ Correct!' : '❌ Wrong'}
                                            </span>
                                        )}
                                    </div>
                                    {showExplanation[email.id] && (
                                        <div className={styles.explainCard} style={{ marginTop: '0.25rem' }}>
                                            <p style={{ fontSize: '0.85rem' }}>
                                                <strong>{email.isPhishing ? '🚨 This IS phishing:' : '✅ This is legitimate:'}</strong>{' '}
                                                {email.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {Object.keys(practiceAnswers).length === practiceEmails.length && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(163, 190, 140, 0.1)',
                            borderRadius: '12px',
                        }}>
                            <h3 style={{ color: 'var(--color-accent-green)' }}>
                                Your Score: {practiceScore}/{practiceEmails.length}
                            </h3>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                {practiceScore === practiceEmails.length
                                    ? '🎉 Perfect! You\'re a phishing detection pro!'
                                    : practiceScore >= 3
                                        ? '👍 Good job! Review the explanations to improve.'
                                        : '📚 Keep learning! Check the explanations for each email.'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
