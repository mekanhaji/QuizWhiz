"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { McqPromptConfig } from "@/lib/mcq-prompt";
import { toUserQuestions, type Question } from "@/lib/quiz-data";
import { useQuizStore } from "@/store/quiz-store";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GenerateTabProps = {
  config: McqPromptConfig;
  quizName: string;
  deriveQuizName: (jsonString: string) => string;
  hasHydrated: boolean;
};

export function GenerateTab({
  config,
  quizName,
  deriveQuizName,
  hasHydrated,
}: GenerateTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const addSavedQuiz = useQuizStore((state) => state.addSavedQuiz);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!hasHydrated || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // willAttachNotes only applies to the prompt-for-AI tab, where the
        // user pastes notes into their own assistant. Force it off here so
        // the system prompt doesn't tell the model to expect attached notes
        // that were never sent.
        body: JSON.stringify({ ...config, willAttachNotes: false }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to generate quiz.");
      }

      const json = JSON.stringify(
        toUserQuestions(data.questions as Question[]),
        null,
        2,
      );
      const name = quizName.trim() || deriveQuizName(json);
      const saved = addSavedQuiz({ name, json });

      try {
        sessionStorage.setItem(
          `quiz-${saved.quizId}`,
          JSON.stringify({ json: saved.json, name: saved.name }),
        );
      } catch (storageError) {
        console.warn("Failed to persist quiz payload", storageError);
      }

      router.push(`/${saved.quizId}`);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Failed to generate quiz.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Generate {config.numQuestions} {config.difficulty} question
        {config.numQuestions === 1 ? "" : "s"} on{" "}
        <span className="font-medium text-foreground">
          {config.topics.join(", ")}
        </span>{" "}
        directly with AI, then jump straight into the quiz.
      </p>

      {generateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{generateError}</AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={!hasHydrated || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Quiz
          </>
        )}
      </Button>
    </div>
  );
}
