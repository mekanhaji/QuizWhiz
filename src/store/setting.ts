"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SettingStore = {
  autoNextQuestion: boolean;
  setAutoNextQuestion: (value: boolean) => void;
  autoNextQuestionDelay: number;
  setAutoNextQuestionDelay: (value: number) => void;
  // TODO
  repeatWrongedQuestions: boolean;
  setRepeatWrongedQuestions: (value: boolean) => void;
};

const SETTING_STORAGE_KEY = "settings";

export const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      autoNextQuestion: true,
      setAutoNextQuestion: (value) => set({ autoNextQuestion: value }),
      autoNextQuestionDelay: 15,
      setAutoNextQuestionDelay: (value) =>
        set({ autoNextQuestionDelay: value }),
      repeatWrongedQuestions: false,
      setRepeatWrongedQuestions: (value) =>
        set({ repeatWrongedQuestions: value }),
    }),
    {
      name: SETTING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
