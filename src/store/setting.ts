"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SettingStore = {
  autoNextQuestion: boolean;
  setAutoNextQuestion: (value: boolean) => void;
  autoNextQuestionDelay: number;
  setAutoNextQuestionDelay: (value: number) => void;
  repeatWrongedQuestions: boolean;
  setRepeatWrongedQuestions: (value: boolean) => void;
  repeatSlowQuestions: boolean;
  setRepeatSlowQuestions: (value: boolean) => void;
  slowAnswerMultiplier: number;
  setSlowAnswerMultiplier: (value: number) => void;
  maxRepeatRounds: number;
  setMaxRepeatRounds: (value: number) => void;
};

const SETTING_STORAGE_KEY = "settings";

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      autoNextQuestion: true,
      setAutoNextQuestion: (value) => set({ autoNextQuestion: value }),
      autoNextQuestionDelay: 15,
      setAutoNextQuestionDelay: (value) =>
        set({ autoNextQuestionDelay: value }),
      repeatWrongedQuestions: true,
      setRepeatWrongedQuestions: (value) =>
        set({ repeatWrongedQuestions: value }),
      repeatSlowQuestions: true,
      setRepeatSlowQuestions: (value) => set({ repeatSlowQuestions: value }),
      slowAnswerMultiplier: 1.5,
      setSlowAnswerMultiplier: (value) =>
        set({ slowAnswerMultiplier: value }),
      maxRepeatRounds: 5,
      setMaxRepeatRounds: (value) => set({ maxRepeatRounds: value }),
    }),
    {
      name: SETTING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        autoNextQuestion: state.autoNextQuestion,
        autoNextQuestionDelay: state.autoNextQuestionDelay,
        repeatWrongedQuestions: state.repeatWrongedQuestions,
        repeatSlowQuestions: state.repeatSlowQuestions,
        slowAnswerMultiplier: state.slowAnswerMultiplier,
        maxRepeatRounds: state.maxRepeatRounds,
      }),
    },
  ),
);
