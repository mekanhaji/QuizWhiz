"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Quiz } from "@/components/quiz";
import type { Question } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuizStore } from "@/store/quiz-store";

type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
  bookmarks?: string[];
};

const parseQuizQuestions = (jsonString: string): Question[] => {
  const data: UserQuestion[] = JSON.parse(jsonString);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Quiz data is empty or malformed.");
  }

  return data.map((q, index) => {
    if (!q.question || !Array.isArray(q.option) || !q.option.length) {
      throw new Error(`Question ${index + 1} is missing text or options.`);
    }
    if (!q.answer || !q.explanation) {
      throw new Error(
        `Question ${index + 1} is missing an answer or explanation.`,
      );
    }

    return {
      id: index + 1,
      question: q.question,
      options: q.option,
      correctAnswer: q.answer,
      explanation: q.explanation,
      bookmarks: q.bookmarks || [],
    };
  });
};

export default function QuizRunnerPage() {
  const router = useRouter();
  const { quizId } = useParams<{ quizId: string }>();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("M.I.Ready");
  const hasHydrated = useQuizStore((state) => state.hasHydrated);
  const findSavedQuizById = useQuizStore((state) => state.findSavedQuizById);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const loadQuiz = () => {
      try {
        let quizJson: string | null = null;
        let payloadFromSession = false;
        const savedQuiz = findSavedQuizById(quizId);

        if (savedQuiz?.json) {
          quizJson = savedQuiz.json;
          if (savedQuiz.name) {
            setQuizTitle(savedQuiz.name);
          }
        }

        if (!quizJson) {
          const sessionPayload = sessionStorage.getItem(`quiz-${quizId}`);
          if (sessionPayload) {
            payloadFromSession = true;
            try {
              const parsedPayload = JSON.parse(sessionPayload);
              if (
                parsedPayload &&
                typeof parsedPayload === "object" &&
                "json" in parsedPayload
              ) {
                quizJson = parsedPayload.json;
                if (typeof parsedPayload.name === "string") {
                  setQuizTitle(parsedPayload.name);
                }
              } else {
                quizJson = sessionPayload;
              }
            } catch (parseError) {
              quizJson = sessionPayload;
            }
          }
        }

        if (!quizJson) {
          setError("We couldn't find that quiz. Please go back and try again.");
          return;
        }

        const parsedQuestions = parseQuizQuestions(quizJson);
        setQuestions(parsedQuestions);

        if (payloadFromSession) {
          sessionStorage.removeItem(`quiz-${quizId}`);
        }
      } catch (quizError: any) {
        setError(
          quizError?.message ?? "Unable to load this quiz. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, hasHydrated, findSavedQuizById]);

  const handleReturnHome = () => router.push("/");

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Preparing your questions. This will only take a moment.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !questions) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {error ?? "We couldn't load this quiz. Please try again."}
              </AlertDescription>
            </Alert>
            <Button onClick={handleReturnHome}>Back to Saved Quizzes</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl font-headline font-bold text-center py-4 text-primary dark:text-primary-foreground">
        {quizTitle}
      </h1>
      <Quiz questions={questions} onRestartQuiz={handleReturnHome} />
    </div>
  );
}
