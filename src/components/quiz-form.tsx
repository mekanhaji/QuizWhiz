"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
                  <span className="font-medium flex-1 mb-2 sm:mb-0">
                    {quiz.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadQuizForEdit(quiz)}
                    >
                      Load
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
