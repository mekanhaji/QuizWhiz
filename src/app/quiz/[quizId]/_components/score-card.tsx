"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";
import type { QuestionOutcome } from "@/app/quiz/[quizId]/_components/quiz-machine";
import { cn } from "@/lib/utils";

type ScoreCardProps = {
  score: number;
  totalQuestions: number;
  rounds: number;
  avgAnswerMs: number;
  outcomes: QuestionOutcome[];
  cappedOut: boolean;
  onRestart: () => void;
  onShowAllQuizzes: () => void;
};

function formatMs(ms: number): string {
  if (!ms || ms <= 0) return "0s";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function ScoreCard({
  score,
  totalQuestions,
  rounds,
  avgAnswerMs,
  outcomes,
  cappedOut,
  onRestart,
  onShowAllQuizzes,
}: ScoreCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const masteredCount = outcomes.filter((o) => o.mastered).length;
  const needsReview = outcomes.filter(
    (o) => o.repeats > 0 || !o.firstPassCorrect,
  );

  const getTitle = () => {
    if (cappedOut) return "Session ended";
    if (masteredCount === outcomes.length && rounds > 1) return "All Mastered!";
    return "Quiz Complete!";
  };

  const getFeedback = () => {
    if (cappedOut) {
      return "You hit the review-round limit — a few questions still need practice.";
    }
    if (percentage === 100) return "Perfect Score! You're fully M.I.Ready!";
    if (percentage >= 80) return "Great job! You really know your stuff.";
    if (percentage >= 60)
      return "Good effort! A little more practice and you'll be an expert.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "Keep trying! Every master was once a beginner.";
  };

  return (
    <Card className="w-full text-center animate-in zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline">
          {getTitle()}
        </CardTitle>
        <CardDescription>{getFeedback()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-muted-foreground">You scored</p>
          <p className="text-6xl font-bold text-primary">
            {score}
            <span className="text-2xl text-muted-foreground">
              /{totalQuestions}
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="text-2xl font-bold text-accent">{percentage}%</div>
          <div className="text-sm text-muted-foreground">Correct</div>
        </div>

        <div className="flex items-center justify-center gap-6 rounded-lg border bg-card p-4 font-code">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">{rounds}</span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              Rounds
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">{formatMs(avgAnswerMs)}</span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              Avg answer
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "text-xl font-bold",
                cappedOut ? "text-destructive" : "text-success",
              )}
            >
              {masteredCount}/{outcomes.length}
            </span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              Mastered
            </span>
          </div>
        </div>

        {needsReview.length > 0 && (
          <div className="text-left">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Needed another look
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
              {needsReview.map((outcome) => (
                <div
                  key={outcome.key}
                  className="flex items-center justify-between gap-3 rounded-md border bg-card p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {outcome.question}
                    </p>
                    <p className="font-code text-xs text-muted-foreground">
                      {outcome.repeats > 0
                        ? `${outcome.repeats} repeat${outcome.repeats > 1 ? "s" : ""} · `
                        : ""}
                      avg {formatMs(outcome.avgAnswerMs)}
                      {outcome.lifetimeWrongCount > outcome.sessionWrongCount
                        ? ` · missed ${outcome.lifetimeWrongCount}x all-time`
                        : ""}
                    </p>
                  </div>
                  <Badge
                    variant={outcome.mastered ? "default" : "destructive"}
                    className={cn(
                      "shrink-0",
                      outcome.mastered && "bg-success text-success-foreground",
                    )}
                  >
                    {outcome.mastered ? "Mastered" : "Not yet"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={onShowAllQuizzes}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Quizzes
        </Button>
        <Button onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}
