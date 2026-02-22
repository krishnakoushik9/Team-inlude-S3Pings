'use client';

import { useState, useEffect, useCallback } from 'react';

// Progress shape stored in localStorage
interface LessonProgress {
    completed: boolean;
    quizScore: number | null; // null = not attempted, 0-100 = score
}

interface ModuleProgress {
    lessons: Record<number, LessonProgress>;
}

interface ProgressData {
    [moduleId: string]: ModuleProgress;
}

const STORAGE_KEY = 'cybersafe-progress';

function loadProgress(): ProgressData {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveProgress(data: ProgressData) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        console.error('Failed to save progress');
    }
}

export function useProgress() {
    const [progress, setProgress] = useState<ProgressData>({});

    // Load from localStorage on mount
    useEffect(() => {
        setProgress(loadProgress());
    }, []);

    // Persist to localStorage on every change
    const persist = useCallback((updated: ProgressData) => {
        setProgress(updated);
        saveProgress(updated);
    }, []);

    // Get progress percentage for a module (0–100)
    const getModuleProgress = useCallback((moduleId: string, totalLessons: number): number => {
        const mod = progress[moduleId];
        if (!mod) return 0;

        let completed = 0;
        for (let i = 0; i < totalLessons; i++) {
            if (mod.lessons[i]?.completed) {
                completed++;
            }
        }
        return Math.round((completed / totalLessons) * 100);
    }, [progress]);

    // Check if a specific lesson is complete
    const isLessonComplete = useCallback((moduleId: string, lessonIdx: number): boolean => {
        return progress[moduleId]?.lessons[lessonIdx]?.completed || false;
    }, [progress]);

    // Get quiz score for a lesson (null if not attempted)
    const getQuizScore = useCallback((moduleId: string, lessonIdx: number): number | null => {
        return progress[moduleId]?.lessons[lessonIdx]?.quizScore ?? null;
    }, [progress]);

    // Mark a lesson as complete with its quiz score
    const markLessonComplete = useCallback((moduleId: string, lessonIdx: number, quizScore: number) => {
        const updated = { ...progress };
        if (!updated[moduleId]) {
            updated[moduleId] = { lessons: {} };
        }
        updated[moduleId].lessons[lessonIdx] = {
            completed: true,
            quizScore
        };
        persist(updated);
    }, [progress, persist]);

    // Get the next incomplete lesson index (or -1 if all done)
    const getNextLesson = useCallback((moduleId: string, totalLessons: number): number => {
        const mod = progress[moduleId];
        if (!mod) return 0;

        for (let i = 0; i < totalLessons; i++) {
            if (!mod.lessons[i]?.completed) return i;
        }
        return -1; // all done
    }, [progress]);

    // Check if all lessons in a module are complete
    const isModuleComplete = useCallback((moduleId: string, totalLessons: number): boolean => {
        return getModuleProgress(moduleId, totalLessons) === 100;
    }, [getModuleProgress]);

    // Reset all progress
    const resetProgress = useCallback(() => {
        persist({});
    }, [persist]);

    return {
        getModuleProgress,
        isLessonComplete,
        getQuizScore,
        markLessonComplete,
        getNextLesson,
        isModuleComplete,
        resetProgress
    };
}
