"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQuizStore, type SavedQuiz } from "@/store/quiz-store";
import { EMPTY_QUIZ_PERF, usePerformanceStore } from "@/store/performance-store";
import { parseQuizQuestions } from "@/lib/quiz-data";
import { cn } from "@/lib/utils";

function SavedQuizPerformanceSummary({ quiz }: { quiz: SavedQuiz }) {
  const quizPerf = usePerformanceStore(
    (state) => state.perf[quiz.quizId] ?? EMPTY_QUIZ_PERF,
  );

  const totalQuestions = useMemo(() => {
    try {
      return parseQuizQuestions(quiz.json).length;
    } catch {
      return 0;
    }
  }, [quiz.json]);

  const records = Object.values(quizPerf);

  if (records.length === 0 || totalQuestions === 0) {
    return (
      <span className="text-xs text-muted-foreground">Not attempted yet</span>
    );
  }

  const masteredCount = records.filter((r) => r.mastered).length;
  const totalWrongCount = records.reduce((sum, r) => sum + r.wrongCount, 0);
  const lastSeenAt = Math.max(...records.map((r) => r.lastSeenAt));

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-code text-xs text-muted-foreground">
      <span>
        Mastered{" "}
        <span
          className={cn(
            "font-bold",
            masteredCount === totalQuestions
              ? "text-success"
              : "text-foreground",
          )}
        >
          {masteredCount}/{totalQuestions}
        </span>
      </span>
      {totalWrongCount > 0 && (
        <span>
          Missed{" "}
          <span className="font-bold text-destructive">
            {totalWrongCount}x
          </span>
        </span>
      )}
      <span>{formatDistanceToNow(lastSeenAt, { addSuffix: true })}</span>
    </div>
  );
}

export function QuizForm() {
  const savedQuizzes = useQuizStore((state) => state.savedQuizzes);
  const hasHydrated = useQuizStore((state) => state.hasHydrated);
  const deleteSavedQuiz = useQuizStore((state) => state.deleteSavedQuiz);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && savedQuizzes.length === 0) {
      router.replace("/create-new-quiz");
    }
  }, [hasHydrated, savedQuizzes, router]);

  const startSavedQuiz = (quiz: SavedQuiz) => {
    try {
      sessionStorage.setItem(
        `quiz-${quiz.quizId}`,
        JSON.stringify({ json: quiz.json, name: quiz.name }),
      );
    } catch (storageError) {
      console.warn("Failed to persist quiz payload", storageError);
    }
    router.push(`/${quiz.quizId}`);
  };

  const loadQuizForEdit = (quiz: SavedQuiz) => {
    try {
      sessionStorage.setItem(
        "create-quiz-draft",
        JSON.stringify({ json: quiz.json, name: quiz.name }),
      );
    } catch (storageError) {
      console.warn("Failed to persist quiz draft", storageError);
    }
    router.push("/create-new-quiz");
  };

  const deleteQuiz = (quizIdToDelete: string) => {
    deleteSavedQuiz(quizIdToDelete);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Saved Quizzes</CardTitle>
            <CardDescription>
              Load a previously saved quiz to start or edit it.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => router.push("/create-new-quiz")}>
            Add New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          {savedQuizzes.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No saved quizzes yet. Redirecting to create a new quiz...
            </div>
          ) : (
            <ul className="space-y-3">
              {savedQuizzes.map((quiz) => (
                <li
                  key={quiz.quizId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                    <span className="font-medium block">{quiz.name}</span>
                    <SavedQuizPerformanceSummary quiz={quiz} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadQuizForEdit(quiz)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => startSavedQuiz(quiz)}>
                      Start
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteQuiz(quiz.quizId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {quiz.name}</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
