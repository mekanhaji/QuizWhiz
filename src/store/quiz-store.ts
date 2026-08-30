"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { usePerformanceStore } from "@/store/performance-store";

export type SavedQuiz = {
  name: string;
  quizId: string;
  in_progress?: boolean;
  json: string; // JSON string containing the quiz data
};

type StoredQuizRecord = Omit<SavedQuiz, "quizId"> & { quizId?: string };

type QuizStore = {
  savedQuizzes: SavedQuiz[];
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  addSavedQuiz: (quiz: StoredQuizRecord) => SavedQuiz;
  deleteSavedQuiz: (quizId: string) => void;
  findSavedQuizById: (quizId: string) => SavedQuiz | undefined;
};

const QUIZ_STORAGE_KEY = "savedQuizzes";

const withQuizId = (quiz: StoredQuizRecord): SavedQuiz => ({
  ...quiz,
  quizId: quiz.quizId ?? crypto.randomUUID(),
  in_progress: quiz.in_progress ?? false,
});

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      savedQuizzes: [],
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      addSavedQuiz: (quiz) => {
        const normalizedQuiz = withQuizId(quiz);
        set((state) => ({
          savedQuizzes: [...state.savedQuizzes, normalizedQuiz],
        }));
        return normalizedQuiz;
      },
      deleteSavedQuiz: (quizId) => {
        set((state) => ({
          savedQuizzes: state.savedQuizzes.filter(
            (quiz) => quiz.quizId !== quizId,
          ),
        }));
        usePerformanceStore.getState().resetQuizPerf(quizId);
      },
      /**
       * `deprecated` Use startSavedQuizzes
       * */
      findSavedQuizById: (quizId) => {
        return get().savedQuizzes.find((quiz) => quiz.quizId === quizId);
      },
      /**
       * Starts a saved quiz by setting its in_progress status to true.
       * @param quizId - The ID of the quiz to start.
       * @returns The updated quiz or undefined if not found.
       */
      startSavedQuizzes: (quizId: string): SavedQuiz | undefined => {
        const quiz = get().savedQuizzes.find((q) => q.quizId === quizId);
        // toggle in_progress status
        if (!quiz) {
          return undefined;
        }
        const updatedQuiz = { ...quiz, in_progress: true };
        set((state) => ({
          savedQuizzes: state.savedQuizzes.map((q) =>
            q.quizId === quizId ? updatedQuiz : q,
          ),
        }));

        return quiz;
      },
      /**
       * Ends a saved quiz by setting its in_progress status to false.
       * It updated the quiz as well to updates bookmarks if there are any.
       * @param quizId - The ID of the quiz to end.
       * @returns The updated quiz or undefined if not found.
       */
      endSavedQuiz: (quiz: SavedQuiz): SavedQuiz | undefined => {
        // toggle in_progress status
        if (!quiz) {
          return undefined;
        }
        const updatedQuiz = { ...quiz, in_progress: false };
        set((state) => ({
          savedQuizzes: state.savedQuizzes.map((q) =>
            q.quizId === quiz.quizId ? updatedQuiz : q,
          ),
        }));
        return updatedQuiz;
      },
    }),
    {
      name: QUIZ_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as
          | {
              savedQuizzes?: StoredQuizRecord[];
            }
          | undefined;

        return {
          savedQuizzes: Array.isArray(state?.savedQuizzes)
            ? state.savedQuizzes.map(withQuizId)
            : [],
        };
      },
      partialize: (state) => ({
        savedQuizzes: state.savedQuizzes,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate saved quizzes", error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
