'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, ChevronRight, ChevronLeft, CheckCircle,
    HelpCircle, RotateCcw, Trophy, BookOpen
} from 'lucide-react';
import styles from './page.module.css';
import { courseModules } from '../courseData';
import { useProgress } from '../useProgress';
import MarkdownRenderer from '../markdownRenderer';

function LessonContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const progress = useProgress();

    const moduleId = searchParams.get('module') || '';
    const lessonIdx = parseInt(searchParams.get('lesson') || '0', 10);

    // Find the module and lesson
    const mod = useMemo(() => courseModules.find(m => m.id === moduleId), [moduleId]);
    const lesson = mod?.lessons[lessonIdx];

    // Quiz state
    const [answers, setAnswers] = useState<Record<number, number>>({}); // questionIdx -> selectedOptionIdx
    const [quizComplete, setQuizComplete] = useState(false);

    // Reset quiz state when navigating between lessons
    useEffect(() => {
        setAnswers({});
        setQuizComplete(false);
    }, [moduleId, lessonIdx]);

    if (!mod || !lesson) {
        return (
            <div className={styles.lessonPage}>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>Module not found</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        The requested lesson doesn&apos;t exist.
                    </p>
                    <button className={styles.navBtn} onClick={() => router.push('/learning-hub')}
                        style={{ marginTop: '1rem' }}>
                        <ArrowLeft size={16} /> Back to Academy
                    </button>
                </div>
            </div>
        );
    }

    const totalQuestions = lesson.quiz.length;
    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.entries(answers).filter(
        ([qIdx, aIdx]) => lesson.quiz[parseInt(qIdx)]?.correctIndex === aIdx
    ).length;
    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercent >= 50;
    const alreadyComplete = progress.isLessonComplete(moduleId, lessonIdx);

    const handleAnswer = (questionIdx: number, optionIdx: number) => {
        if (answers[questionIdx] !== undefined) return; // already answered
        const updated = { ...answers, [questionIdx]: optionIdx };
        setAnswers(updated);

        // Check if all questions answered
        if (Object.keys(updated).length === totalQuestions) {
            setQuizComplete(true);
        }
    };

    const handleComplete = () => {
        progress.markLessonComplete(moduleId, lessonIdx, scorePercent);

        // Navigate to next lesson or back to hub
        if (lessonIdx < mod.lessons.length - 1) {
            router.push(`/learning-hub/lesson?module=${moduleId}&lesson=${lessonIdx + 1}`);
        } else {
            router.push('/learning-hub');
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setQuizComplete(false);
    };

    const goToLesson = (idx: number) => {
        router.push(`/learning-hub/lesson?module=${moduleId}&lesson=${idx}`);
    };

    return (
        <div className={styles.lessonPage}>
            {/* Top Navigation */}
            <div className={styles.topNav}>
                <button className={styles.backLink} onClick={() => router.push('/learning-hub')}>
                    <ArrowLeft size={16} /> Back to Academy
                </button>
                <div className={styles.lessonBreadcrumb}>
                    {mod.title} / <span>Lesson {lessonIdx + 1}</span>
                </div>
            </div>

            {/* Progress Dots */}
            <div className={styles.progressBar}>
                <div className={styles.progressDots}>
                    {mod.lessons.map((_, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dot} ${progress.isLessonComplete(moduleId, idx) ? styles.completed : ''} ${idx === lessonIdx ? styles.current : ''}`}
                            onClick={() => goToLesson(idx)}
                            title={`Lesson ${idx + 1}: ${mod.lessons[idx].title}`}
                        />
                    ))}
                </div>
                <span className={styles.progressLabel}>
                    {progress.getModuleProgress(moduleId, mod.lessons.length)}% Complete
                </span>
            </div>

            {/* Already completed banner */}
            {alreadyComplete && (
                <div className={styles.completedBanner}>
                    <CheckCircle size={18} />
                    You&apos;ve already completed this lesson
                    {progress.getQuizScore(moduleId, lessonIdx) !== null && (
                        <span> — Quiz score: {progress.getQuizScore(moduleId, lessonIdx)}%</span>
                    )}
                </div>
            )}

            {/* Lesson Header */}
            <div className={styles.lessonHeader}>
                <h1>{lesson.title}</h1>
                <span className={styles.moduleBadge} style={{
                    background: `${mod.color}20`,
                    color: mod.color,
                    border: `1px solid ${mod.color}40`
                }}>
                    {mod.title}
                </span>
            </div>

            {/* Notes Panel */}
            <div className={styles.notesPanel}>
                <MarkdownRenderer content={lesson.notes} />
            </div>

            {/* Quiz Section */}
            <div className={styles.quizSection}>
                <h2 className={styles.quizTitle}>
                    <HelpCircle size={20} /> Test Your Knowledge
                </h2>

                {lesson.quiz.map((q, qIdx) => {
                    const userAnswer = answers[qIdx];
                    const isAnswered = userAnswer !== undefined;
                    const isCorrect = isAnswered && userAnswer === q.correctIndex;

                    return (
                        <div key={qIdx} className={styles.questionCard}>
                            <div className={styles.questionNumber}>Question {qIdx + 1} of {totalQuestions}</div>
                            <div className={styles.questionText}>{q.question}</div>

                            <div className={styles.optionsGrid}>
                                {q.options.map((option, oIdx) => {
                                    let className = styles.optionBtn;

                                    if (isAnswered) {
                                        className += ` ${styles.selected}`;
                                        if (oIdx === q.correctIndex) {
                                            className += ` ${styles.correct}`;
                                        } else if (oIdx === userAnswer && userAnswer !== q.correctIndex) {
                                            className += ` ${styles.wrong}`;
                                        } else {
                                            className += ` ${styles.dimmed}`;
                                        }
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            className={className}
                                            onClick={() => handleAnswer(qIdx, oIdx)}
                                            disabled={isAnswered}
                                        >
                                            <span className={styles.optionLetter}>
                                                {String.fromCharCode(65 + oIdx)}
                                            </span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Show explanation after answering */}
                            {isAnswered && (
                                <div className={styles.explanationBox}>
                                    {isCorrect ? '✅ ' : '❌ '}
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Score Summary */}
                {quizComplete && (
                    <div className={styles.scoreSummary}>
                        <div className={`${styles.scoreCircle} ${passed ? styles.pass : styles.fail}`}>
                            {correctCount}/{totalQuestions}
                        </div>
                        <h3>
                            {passed ? (
                                scorePercent === 100 ? '🎉 Perfect Score!' : '✅ You Passed!'
                            ) : (
                                '📚 Keep Learning!'
                            )}
                        </h3>
                        <p>
                            You got {correctCount} out of {totalQuestions} correct ({scorePercent}%).
                            {passed
                                ? ' You can now mark this lesson as complete.'
                                : ' You need at least 50% to pass. Review the notes and try again!'}
                        </p>

                        {passed ? (
                            <button className={styles.completeBtn} onClick={handleComplete}>
                                <Trophy size={16} />
                                {alreadyComplete ? 'Update Score & Continue' : 'Mark Complete & Continue'}
                            </button>
                        ) : (
                            <button className={styles.retryBtn} onClick={handleRetry}>
                                <RotateCcw size={16} /> Retry Quiz
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className={styles.navButtons}>
                <button
                    className={styles.navBtn}
                    onClick={() => goToLesson(lessonIdx - 1)}
                    disabled={lessonIdx === 0}
                >
                    <ChevronLeft size={16} /> Previous Lesson
                </button>
                <button
                    className={styles.navBtn}
                    onClick={() => {
                        if (lessonIdx < mod.lessons.length - 1) {
                            goToLesson(lessonIdx + 1);
                        } else {
                            router.push('/learning-hub');
                        }
                    }}
                >
                    {lessonIdx < mod.lessons.length - 1 ? (
                        <> Next Lesson <ChevronRight size={16} /></>
                    ) : (
                        <><BookOpen size={16} /> Back to Academy</>
                    )}
                </button>
            </div>
        </div>
    );
}

// Wrap in Suspense boundary for useSearchParams
export default function LessonPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--color-text-muted)' }}>
                Loading lesson...
            </div>
        }>
            <LessonContent />
        </Suspense>
    );
}
