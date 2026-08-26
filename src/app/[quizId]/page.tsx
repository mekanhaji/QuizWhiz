"use client";

import { Quiz } from "@/app/[quizId]/_components/quiz";
import type { Question } from "@/lib/quiz-data";
import { parseQuizQuestions } from "@/lib/quiz-data";
import { useQuizStore } from "@/store/quiz-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingQuizCard } from "./_components/loading-quiz-card";
import { QuizUnavailableCard } from "./_components/quiz-unavailable-card";

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
    return <LoadingQuizCard />;
  }

  if (error || !questions) {
    return (
      <QuizUnavailableCard error={error} handleReturnHome={handleReturnHome} />
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
