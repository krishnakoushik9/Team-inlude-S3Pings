'use client';

import React from 'react';
import Link from 'next/link';
import {
    BookOpen, CheckCircle, Award, Shield,
    Mail, Wifi, Cpu, Sparkles, ChevronRight,
    Eye
} from 'lucide-react';
import styles from './page.module.css';
import { useSystem } from '@/contexts/SystemContext';
import { courseModules } from './courseData';
import { useProgress } from './useProgress';

const iconMap: Record<string, React.ReactNode> = {
    Mail: <Mail size={32} />,
    Eye: <Eye size={32} />,
    Wifi: <Wifi size={32} />,
};

const badgeIconMap: Record<string, React.ReactNode> = {
    Mail: <Mail size={24} />,
    Eye: <Eye size={24} />,
    Wifi: <Wifi size={24} />,
};

export default function LearningHub() {
    const { systemInfo } = useSystem();
    const progress = useProgress();

    const isAMD = systemInfo?.cpuInfo?.vendor === 'AMD';
    const isIntel = systemInfo?.cpuInfo?.vendor === 'Intel';
    const hasNPU = systemInfo?.cpuInfo?.hasNPU || false;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><BookOpen size={28} /> CyberSafe Academy</h1>
                <p>Structured learning paths to master your digital safety — from beginner to expert.</p>
            </div>

            {/* AMD RYZEN AI INTEGRATION WIDGET */}
            {isAMD ? (
                <div className={styles.amdWidget} style={{ borderLeft: '8px solid #ED1C24' }}>
                    <div className={styles.amdInfo}>
                        <h3><Cpu size={24} /> <span className={styles.amdLogo}>AMD</span> Ryzen™ AI Accelerated</h3>
                        <p>
                            Detected: <b>{systemInfo?.cpuInfo?.model}</b>
                            {hasNPU ? " with NPU Support ✓" : " (Dedicated NPU not found, using Ryzen GPU cores)"}
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            Your privacy is boosted by local hardware. Sensitive data is
                            <b> scrubbed locally</b> on your Ryzen™ processor before analysis.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: '#ED1C24', fontWeight: 800, fontSize: '1.5rem', opacity: 0.2 }}>AMD RYZEN</div>
                    </div>
                </div>
            ) : isIntel ? (
                <div className={styles.amdWidget} style={{ background: 'linear-gradient(135deg, #0071C5, #00AEEF)', borderLeft: '8px solid #00C7FF' }}>
                    <div className={styles.amdInfo}>
                        <h3><Cpu size={24} /> Intel® Hardware Detected</h3>
                        <p>Detected: <b>{systemInfo?.cpuInfo?.model}</b></p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            ⚠️ Hardware-accelerated PII scrubbing optimized for <b>AMD Ryzen™ AI</b>.
                            Standard Privacy Mode active.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', opacity: 0.2 }}>INTEL</div>
                    </div>
                </div>
            ) : (
                <div className={styles.amdWidget} style={{ background: '#434C5E' }}>
                    <div className={styles.amdInfo}>
                        <h3><Cpu size={24} /> Detecting Hardware...</h3>
                        <p>Checking your hardware capabilities for privacy acceleration.</p>
                    </div>
                </div>
            )}

            {/* Achievement Section — dynamic badges */}
            <div className={styles.achievementSection}>
                <h2><Award size={20} /> My Achievements</h2>
                <div className={styles.badgeGrid}>
                    {courseModules.map((mod) => {
                        const unlocked = progress.isModuleComplete(mod.id, mod.lessons.length);
                        return (
                            <div key={mod.id} className={`${styles.badge} ${unlocked ? styles.unlocked : ''}`}>
                                <div className={styles.badgeIcon}>
                                    {badgeIconMap[mod.icon] || <Shield size={24} />}
                                </div>
                                <span className={styles.badgeName}>{mod.badge}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modules Grid */}
            <div className={styles.academyGrid}>
                {courseModules.map((mod) => {
                    const pct = progress.getModuleProgress(mod.id, mod.lessons.length);
                    const nextLesson = progress.getNextLesson(mod.id, mod.lessons.length);
                    const lessonTarget = nextLesson === -1 ? 0 : nextLesson;

                    return (
                        <div key={mod.id} className={`${styles.moduleCard} ${pct === 100 ? styles.completed : ''}`}>
                            <div className={styles.moduleImage} style={{ background: `linear-gradient(135deg, ${mod.color}, #2E3440)` }}>
                                {iconMap[mod.icon] || <BookOpen size={32} />}
                                <span className={styles.progressBadge}>{pct}% Complete</span>
                            </div>
                            <div className={styles.moduleContent}>
                                <h3>{mod.title}</h3>
                                <p>{mod.description}</p>
                                <div className={styles.lessonList}>
                                    {mod.lessons.map((lesson, idx) => (
                                        <Link
                                            key={idx}
                                            href={`/learning-hub/lesson?module=${mod.id}&lesson=${idx}`}
                                            className={`${styles.lessonItem} ${progress.isLessonComplete(mod.id, idx) ? styles.done : ''}`}
                                        >
                                            <CheckCircle size={14} />
                                            <span>{lesson.title}</span>
                                            {progress.isLessonComplete(mod.id, idx) && (
                                                <span className={styles.lessonScore}>
                                                    {progress.getQuizScore(mod.id, idx)}%
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    href={`/learning-hub/lesson?module=${mod.id}&lesson=${lessonTarget}`}
                                    className={styles.startBtn}
                                >
                                    {pct === 100 ? 'Review Module' : pct > 0 ? 'Continue Lesson' : 'Start Module'}
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Banner */}
            <div style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid rgba(136,192,208,0.1)', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Complete all modules to unlock every badge. Your progress is saved locally.
            </div>
        </div>
    );
}
