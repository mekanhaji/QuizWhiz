import type { Question } from "@/lib/quiz-data";
import type { QuestionPerf } from "@/store/performance-store";

export type RoundSettings = {
  repeatWrongedQuestions: boolean;
  repeatSlowQuestions: boolean;
  slowAnswerMultiplier: number;
  maxRepeatRounds: number;
};

export type Attempt = {
  key: string;
  questionId: number;
  round: number;
  correct: boolean;
  answerMs: number;
  questionMs: number;
  timingReliable: boolean;
  mastered: boolean;
};

type RoundSummary = {
  round: number;
  attempts: Attempt[];
  avgAnswerMs: number;
};

export type QuizState = {
  allQuestions: Question[];
  roundQueue: Question[];
  roundIndex: number;
  round: number;
  attempts: Attempt[];
  roundAttempts: Attempt[];
  selectedAnswer: string | null;
  isAnswered: boolean;
  pendingAnswerMs: number;
  pendingTimingReliable: boolean;
  firstPassScore: number;
  totalQuestions: number;
  cappedOut: boolean;
  status: "loading" | "answering" | "finished";
  lastRoundSummary: RoundSummary | null;
};

export type QuizAction =
  | { type: "INIT"; questions: Question[] }
  | { type: "SELECT_ANSWER"; answer: string }
  | { type: "SUBMIT_ANSWER"; answerMs: number; timingReliable: boolean }
  | { type: "ADVANCE"; questionMs: number; settings: RoundSettings };

export const initialQuizState: QuizState = {
  allQuestions: [],
  roundQueue: [],
  roundIndex: 0,
  round: 1,
  attempts: [],
  roundAttempts: [],
  selectedAnswer: null,
  isAnswered: false,
  pendingAnswerMs: 0,
  pendingTimingReliable: true,
  firstPassScore: 0,
  totalQuestions: 0,
  cappedOut: false,
  status: "loading",
  lastRoundSummary: null,
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/**
 * `pool` is the policy-driven set of attempts that get repeated (what the settings
 * choose to re-ask). `masteredKeys` is the objective "correct AND fast" judgment used
 * for the results screen — the two are independent, since a user can turn off
 * repeating wrong answers and still want to see that a question was missed.
 */
export function buildRepeatPool(
  roundAttempts: Attempt[],
  settings: RoundSettings,
): { pool: Attempt[]; avgAnswerMs: number; masteredKeys: Set<string> } {
  const reliable = roundAttempts.filter((a) => a.timingReliable);
  const avgAnswerMs =
    reliable.length > 0
      ? reliable.reduce((sum, a) => sum + a.answerMs, 0) / reliable.length
      : 0;
  const threshold = avgAnswerMs * settings.slowAnswerMultiplier;
  const canJudgeSlow = reliable.length >= 2;

  const isFast = (a: Attempt) =>
    !canJudgeSlow || !a.timingReliable || a.answerMs <= threshold;

  const masteredKeys = new Set(
    roundAttempts.filter((a) => a.correct && isFast(a)).map((a) => a.key),
  );

  const pool = roundAttempts.filter((a) => {
    if (settings.repeatWrongedQuestions && !a.correct) return true;
    if (
      settings.repeatSlowQuestions &&
      canJudgeSlow &&
      a.correct &&
      a.timingReliable &&
      a.answerMs > threshold
    ) {
      return true;
    }
    return false;
  });

  return { pool, avgAnswerMs, masteredKeys };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "INIT": {
      const shuffled = shuffle(action.questions);
      return {
        ...initialQuizState,
        allQuestions: shuffled,
        roundQueue: shuffled,
        totalQuestions: shuffled.length,
        status: shuffled.length > 0 ? "answering" : "loading",
      };
    }

    case "SELECT_ANSWER": {
      if (state.isAnswered) return state;
      return { ...state, selectedAnswer: action.answer };
    }

    case "SUBMIT_ANSWER": {
      if (state.isAnswered || state.selectedAnswer === null) return state;
      const question = state.roundQueue[state.roundIndex];
      const correct = state.selectedAnswer === question.correctAnswer;
      return {
        ...state,
        isAnswered: true,
        pendingAnswerMs: action.answerMs,
        pendingTimingReliable: action.timingReliable,
        firstPassScore:
          state.round === 1 && correct
            ? state.firstPassScore + 1
            : state.firstPassScore,
      };
    }

    case "ADVANCE": {
      if (!state.isAnswered) return state;

      const question = state.roundQueue[state.roundIndex];
      const attempt: Attempt = {
        key: question.key,
        questionId: question.id,
        round: state.round,
        correct: state.selectedAnswer === question.correctAnswer,
        answerMs: state.pendingAnswerMs,
        questionMs: action.questionMs,
        timingReliable: state.pendingTimingReliable,
        mastered: false,
      };

      const roundAttempts = [...state.roundAttempts, attempt];
      const nextIndex = state.roundIndex + 1;

      if (nextIndex < state.roundQueue.length) {
        return {
          ...state,
          attempts: [...state.attempts, attempt],
          roundAttempts,
          roundIndex: nextIndex,
          selectedAnswer: null,
          isAnswered: false,
          pendingAnswerMs: 0,
          pendingTimingReliable: true,
        };
      }

      // Round complete — decide what happens next.
      const { pool, avgAnswerMs, masteredKeys } = buildRepeatPool(
        roundAttempts,
        action.settings,
      );
      const markRoundAttempts = (list: Attempt[]) =>
        list.map((a) =>
          a.round === state.round ? { ...a, mastered: masteredKeys.has(a.key) } : a,
        );
      const finishedRoundAttempts = markRoundAttempts(roundAttempts);
      const allAttempts = markRoundAttempts([...state.attempts, attempt]);
      const summary: RoundSummary = {
        round: state.round,
        attempts: finishedRoundAttempts,
        avgAnswerMs,
      };

      if (pool.length === 0) {
        return {
          ...state,
          attempts: allAttempts,
          roundAttempts: [],
          status: "finished",
          cappedOut: false,
          lastRoundSummary: summary,
        };
      }

      if (state.round >= action.settings.maxRepeatRounds) {
        return {
          ...state,
          attempts: allAttempts,
          roundAttempts: [],
          status: "finished",
          cappedOut: true,
          lastRoundSummary: summary,
        };
      }

      const poolKeys = new Set(pool.map((a) => a.key));
      const nextRoundQuestions = shuffle(
        state.roundQueue.filter((q) => poolKeys.has(q.key)),
      );

      return {
        ...state,
        attempts: allAttempts,
        roundAttempts: [],
        round: state.round + 1,
        roundQueue: nextRoundQuestions,
        roundIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        pendingAnswerMs: 0,
        pendingTimingReliable: true,
        lastRoundSummary: summary,
      };
    }

    default:
      return state;
  }
}

export type QuestionOutcome = {
  key: string;
  id: number;
  question: string;
  firstPassCorrect: boolean;
  sessionWrongCount: number;
  lifetimeWrongCount: number;
  repeats: number;
  avgAnswerMs: number;
  mastered: boolean;
};

export function buildOutcomes(
  allQuestions: Question[],
  attempts: Attempt[],
  quizPerf: Record<string, QuestionPerf>,
): QuestionOutcome[] {
  return allQuestions.map((q) => {
    const qAttempts = attempts.filter((a) => a.key === q.key);
    const firstAttempt = qAttempts.find((a) => a.round === 1);
    const lastAttempt = qAttempts[qAttempts.length - 1];
    const sessionWrongCount = qAttempts.filter((a) => !a.correct).length;
    const repeats = qAttempts.filter((a) => a.round > 1).length;
    const avgAnswerMs =
      qAttempts.length > 0
        ? qAttempts.reduce((sum, a) => sum + a.answerMs, 0) / qAttempts.length
        : 0;

    return {
      key: q.key,
      id: q.id,
      question: q.question,
      firstPassCorrect: firstAttempt?.correct ?? false,
      sessionWrongCount,
      lifetimeWrongCount: quizPerf[q.key]?.wrongCount ?? 0,
      repeats,
      avgAnswerMs,
      mastered: lastAttempt?.mastered ?? firstAttempt?.correct ?? false,
    };
  });
}
