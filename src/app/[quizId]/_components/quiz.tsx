"use client";

import { useState, useEffect, useMemo } from "react";
import type { Question } from "@/lib/quiz-data";
import {
  QuestionCard,
  QuestionCardSkeleton,
} from "@/app/[quizId]/_components/question-card";
import { ScoreCard } from "@/app/[quizId]/_components/score-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettingStore } from "@/store/setting";
import { useShallow } from "zustand/react/shallow";

type QuizProps = {
  questions: Question[];
  onRestartQuiz: () => void;
};

export function Quiz({
  questions: initialQuestions,
  onRestartQuiz,
}: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [countDwn, setCountDwn] = useState(0);

  const { autoNextQuestion, autoNextQuestionDelay } = useSettingStore(
    useShallow((state) => ({
      autoNextQuestion: state.autoNextQuestion,
      autoNextQuestionDelay: state.autoNextQuestionDelay,
    })),
  );

  useEffect(() => {
    if (autoNextQuestion && isAnswered) {
      setCountDwn(autoNextQuestionDelay);
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
        }
      }, autoNextQuestionDelay * 1000);

      const countdownTimer = setInterval(() => {
        setCountDwn((prevCount) => {
          if (prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(countdownTimer);
            return 0;
          }
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [autoNextQuestion, autoNextQuestionDelay, isAnswered]);

  useEffect(() => {
    if (!shuffled) {
      const shuffledQuestions = [...initialQuestions].sort(
        () => Math.random() - 0.5,
      );
      setQuestions(shuffledQuestions);
      setShuffled(true);
    }
  }, [initialQuestions, shuffled]);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex],
  );
  const progressValue = useMemo(
    () =>
      questions.length > 0
        ? ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) *
          100
        : 0,
    [currentQuestionIndex, questions.length, isAnswered],
  );

  const handleSelectAnswer = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    const shuffledQuestions = [...initialQuestions].sort(
      () => Math.random() - 0.5,
    );
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setCountDwn(0);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <QuestionCardSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <ScoreCard
        score={score}
        totalQuestions={questions.length}
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
              Question {currentQuestionIndex + 1} of {questions.length}
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
        key={currentQuestion.id}
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        isAnswered={isAnswered}
        correctAnswer={currentQuestion.correctAnswer}
      />
      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 px-4 pb-4">
        {isAnswered ? (
          <>
            {autoNextQuestion && currentQuestionIndex < questions.length - 1 && (
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
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex === questions.length - 1
                ? "Show Results"
                : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}
