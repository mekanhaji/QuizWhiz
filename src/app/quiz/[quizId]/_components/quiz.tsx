"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Question } from "@/lib/quiz-data";
import {
  QuestionCard,
  QuestionCardSkeleton,
} from "@/app/quiz/[quizId]/_components/question-card";
import { ScoreCard } from "@/app/quiz/[quizId]/_components/score-card";
import {
  buildOutcomes,
  initialQuizState,
  quizReducer,
  type RoundSettings,
} from "@/app/quiz/[quizId]/_components/quiz-machine";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettingStore } from "@/store/setting";
import { EMPTY_QUIZ_PERF, usePerformanceStore } from "@/store/performance-store";
import { useShallow } from "zustand/react/shallow";

type QuizProps = {
  quizId: string;
  questions: Question[];
  onRestartQuiz: () => void;
};

export function Quiz({ quizId, questions: initialQuestions, onRestartQuiz }: QuizProps) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [countDwn, setCountDwn] = useState(0);

  const {
    autoNextQuestion,
    autoNextQuestionDelay,
    repeatWrongedQuestions,
    repeatSlowQuestions,
    slowAnswerMultiplier,
    maxRepeatRounds,
  } = useSettingStore(
    useShallow((state) => ({
      autoNextQuestion: state.autoNextQuestion,
      autoNextQuestionDelay: state.autoNextQuestionDelay,
      repeatWrongedQuestions: state.repeatWrongedQuestions,
      repeatSlowQuestions: state.repeatSlowQuestions,
      slowAnswerMultiplier: state.slowAnswerMultiplier,
      maxRepeatRounds: state.maxRepeatRounds,
    })),
  );

  const recordAttempt = usePerformanceStore((s) => s.recordAttempt);
  const quizPerf = usePerformanceStore((s) => s.perf[quizId] ?? EMPTY_QUIZ_PERF);

  const roundSettings: RoundSettings = useMemo(
    () => ({
      repeatWrongedQuestions,
      repeatSlowQuestions,
      slowAnswerMultiplier,
      maxRepeatRounds,
    }),
    [repeatWrongedQuestions, repeatSlowQuestions, slowAnswerMultiplier, maxRepeatRounds],
  );

  useEffect(() => {
    dispatch({ type: "INIT", questions: initialQuestions });
  }, [initialQuestions]);

  // Timing instrumentation. shownAtRef marks when the current question first appeared;
  // hiddenSinceShownRef flags an unreliable answerMs if the tab was backgrounded before submit.
  const shownAtRef = useRef(0);
  const hiddenSinceShownRef = useRef(false);
  const isAnsweredRef = useRef(state.isAnswered);
  isAnsweredRef.current = state.isAnswered;

  useEffect(() => {
    shownAtRef.current = performance.now();
    hiddenSinceShownRef.current = false;
  }, [state.round, state.roundIndex]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && !isAnsweredRef.current) {
        hiddenSinceShownRef.current = true;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Persist each round's attempts to the performance store as soon as the round ends.
  useEffect(() => {
    if (!state.lastRoundSummary) return;
    for (const attempt of state.lastRoundSummary.attempts) {
      recordAttempt(quizId, attempt.key, {
        correct: attempt.correct,
        answerMs: attempt.answerMs,
        questionMs: attempt.questionMs,
        mastered: attempt.mastered,
      });
    }
  }, [state.lastRoundSummary, quizId, recordAttempt]);

  const currentQuestion = state.roundQueue[state.roundIndex];

  const progressValue = useMemo(
    () =>
      state.roundQueue.length > 0
        ? ((state.roundIndex + (state.isAnswered ? 1 : 0)) /
            state.roundQueue.length) *
          100
        : 0,
    [state.roundIndex, state.roundQueue.length, state.isAnswered],
  );

  const handleSelectAnswer = (answer: string) => {
    dispatch({ type: "SELECT_ANSWER", answer });
  };

  const handleSubmitAnswer = () => {
    if (state.selectedAnswer === null) return;
    const answerMs = performance.now() - shownAtRef.current;
    dispatch({
      type: "SUBMIT_ANSWER",
      answerMs,
      timingReliable: !hiddenSinceShownRef.current,
    });
  };

  const handleAdvance = useCallback(() => {
    const questionMs = performance.now() - shownAtRef.current;
    dispatch({ type: "ADVANCE", questionMs, settings: roundSettings });
  }, [roundSettings]);

  const handleRestart = () => {
    setCountDwn(0);
    dispatch({ type: "INIT", questions: initialQuestions });
  };

  useEffect(() => {
    if (autoNextQuestion && state.isAnswered && state.status === "answering") {
      setCountDwn(autoNextQuestionDelay);
      const timer = setTimeout(() => {
        handleAdvance();
      }, autoNextQuestionDelay * 1000);

      const countdownTimer = setInterval(() => {
        setCountDwn((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [
    autoNextQuestion,
    autoNextQuestionDelay,
    state.isAnswered,
    state.status,
    state.round,
    state.roundIndex,
    handleAdvance,
  ]);

  const avgAnswerMs = useMemo(() => {
    const reliable = state.attempts.filter((a) => a.timingReliable);
    if (reliable.length === 0) return 0;
    return reliable.reduce((sum, a) => sum + a.answerMs, 0) / reliable.length;
  }, [state.attempts]);

  const outcomes = useMemo(
    () => buildOutcomes(state.allQuestions, state.attempts, quizPerf),
    [state.allQuestions, state.attempts, quizPerf],
  );

  if (state.status === "loading" || !currentQuestion) {
    return (
      <Card>
        <CardContent className="p-4">
          <QuestionCardSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (state.status === "finished") {
    return (
      <ScoreCard
        score={state.firstPassScore}
        totalQuestions={state.totalQuestions}
        rounds={state.round}
        avgAnswerMs={avgAnswerMs}
        outcomes={outcomes}
        cappedOut={state.cappedOut}
        onRestart={handleRestart}
        onShowAllQuizzes={onRestartQuiz}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
              {state.round > 1
                ? `Round ${state.round} · Reviewing question ${state.roundIndex + 1} of ${state.roundQueue.length}`
                : `Question ${state.roundIndex + 1} of ${state.roundQueue.length}`}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={onRestartQuiz}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Quiz Setup</span>
        </Button>
      </div>
      <QuestionCard
        key={`${state.round}-${state.roundIndex}-${currentQuestion.id}`}
        question={currentQuestion}
        selectedAnswer={state.selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        isAnswered={state.isAnswered}
        correctAnswer={currentQuestion.correctAnswer}
      />
      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 px-4 pb-4">
        {state.isAnswered ? (
          <>
            {autoNextQuestion && (
              <div className="flex flex-1 items-center gap-3">
                <span className="font-code text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Next in
                </span>
                <progress
                  className="timer-progress w-full max-w-[200px] flex-1"
                  value={countDwn}
                  max={autoNextQuestionDelay}
                  aria-label={`Advancing to the next question in ${countDwn} seconds`}
                />
                <span className="font-code text-sm font-bold tabular-nums">
                  {countDwn}s
                </span>
              </div>
            )}
            <Button onClick={handleAdvance}>
              {state.roundIndex === state.roundQueue.length - 1
                ? "Continue"
                : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmitAnswer} disabled={!state.selectedAnswer}>
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}
