"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type QuestionPerf = {
  attempts: number;
  correctCount: number;
  wrongCount: number;
  totalAnswerMs: number;
  lastAnswerMs: number;
  lastQuestionMs: number;
  lastSeenAt: number;
  mastered: boolean;
};

export type AttemptInput = {
  correct: boolean;
  answerMs: number;
  questionMs: number;
  mastered: boolean;
};

type QuizPerf = Record<string, QuestionPerf>;

// Stable reference so `usePerformanceStore((s) => s.perf[quizId] ?? EMPTY_QUIZ_PERF)`
// doesn't create a new object on every read and trigger a re-render loop.
export const EMPTY_QUIZ_PERF: QuizPerf = {};

type PerfState = {
  perf: Record<string, QuizPerf>;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  recordAttempt: (quizId: string, key: string, attempt: AttemptInput) => void;
  getQuizPerf: (quizId: string) => QuizPerf;
  resetQuizPerf: (quizId: string) => void;
  clearAllPerf: () => void;
};

const PERF_STORAGE_KEY = "quizPerformance";

export const usePerformanceStore = create<PerfState>()(
  persist(
    (set, get) => ({
      perf: {},
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      recordAttempt: (quizId, key, attempt) => {
        set((state) => {
          const quizPerf = state.perf[quizId] ?? {};
          const existing = quizPerf[key];
          const updated: QuestionPerf = {
            attempts: (existing?.attempts ?? 0) + 1,
            correctCount: (existing?.correctCount ?? 0) + (attempt.correct ? 1 : 0),
            wrongCount: (existing?.wrongCount ?? 0) + (attempt.correct ? 0 : 1),
            totalAnswerMs: (existing?.totalAnswerMs ?? 0) + attempt.answerMs,
            lastAnswerMs: attempt.answerMs,
            lastQuestionMs: attempt.questionMs,
            lastSeenAt: Date.now(),
            mastered: attempt.mastered,
          };
          return {
            perf: {
              ...state.perf,
              [quizId]: { ...quizPerf, [key]: updated },
            },
          };
        });
      },
      getQuizPerf: (quizId) => get().perf[quizId] ?? EMPTY_QUIZ_PERF,
      resetQuizPerf: (quizId) => {
        set((state) => {
          if (!(quizId in state.perf)) return state;
          const { [quizId]: _removed, ...rest } = state.perf;
          return { perf: rest };
        });
      },
      clearAllPerf: () => set({ perf: {} }),
    }),
    {
      name: PERF_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as { perf?: Record<string, QuizPerf> } | undefined;
        return {
          perf: state?.perf && typeof state.perf === "object" ? state.perf : {},
        };
      },
      partialize: (state) => ({ perf: state.perf }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate quiz performance", error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
