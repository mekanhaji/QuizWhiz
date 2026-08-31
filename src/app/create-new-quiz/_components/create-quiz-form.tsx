"use client";

import { GenerateTab } from "@/app/create-new-quiz/_components/generate-tab";
import { PromptTab } from "@/app/create-new-quiz/_components/prompt-tab";
import { QuizConfigFields } from "@/app/create-new-quiz/_components/quiz-config-fields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildMcqPrompt,
  normalizeMcqPromptConfig,
  type McqPromptConfig,
} from "@/lib/mcq-prompt";
import { extractJsonArray } from "@/lib/quiz-data";
import { useQuizStore } from "@/store/quiz-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
};

type DraftPayload = {
  json?: string;
  name?: string;
};

const DEFAULTS = normalizeMcqPromptConfig();

export function CreateQuizForm() {
  const [tab, setTab] = useState<"prompt" | "generate">("prompt");

  const [quizName, setQuizName] = useState("");
  const [topicsInput, setTopicsInput] = useState(DEFAULTS.topics.join(", "));
  const [numQuestions, setNumQuestions] = useState(DEFAULTS.numQuestions);
  const [difficulty, setDifficulty] = useState(String(DEFAULTS.difficulty));
  const [optionsPerQuestion, setOptionsPerQuestion] = useState(
    DEFAULTS.optionsPerQuestion,
  );
  const [language, setLanguage] = useState(DEFAULTS.language);
  const [includeExplanations, setIncludeExplanations] = useState(
    DEFAULTS.includeExplanations,
  );
  const [willAttachNotes, setWillAttachNotes] = useState(
    DEFAULTS.willAttachNotes,
  );

  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addSavedQuiz = useQuizStore((state) => state.addSavedQuiz);
  const hasHydrated = useQuizStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    const draft = sessionStorage.getItem("create-quiz-draft");
    if (!draft) {
      return;
    }

    try {
      const parsed: DraftPayload = JSON.parse(draft);
      if (typeof parsed.json === "string") {
        setJsonInput(parsed.json);
      }
      if (typeof parsed.name === "string") {
        setQuizName(parsed.name);
      }
      setTab("prompt");
    } catch (parseError) {
      console.warn("Failed to load draft quiz", parseError);
    } finally {
      sessionStorage.removeItem("create-quiz-draft");
    }
  }, []);

  const runtimeConfig: McqPromptConfig = useMemo(() => {
    const parsedTopics = topicsInput
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    return normalizeMcqPromptConfig({
      numQuestions,
      difficulty,
      topics: parsedTopics,
      language,
      includeExplanations,
      optionsPerQuestion,
      willAttachNotes,
    });
  }, [
    difficulty,
    includeExplanations,
    language,
    numQuestions,
    optionsPerQuestion,
    topicsInput,
    willAttachNotes,
  ]);

  const generatedPrompt = useMemo(
    () => buildMcqPrompt(runtimeConfig),
    [runtimeConfig],
  );

  const validateJson = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) {
        setError("JSON data cannot be empty.");
        return false;
      }
      const data: UserQuestion[] = JSON.parse(extractJsonArray(jsonString));

      if (!Array.isArray(data) || data.length === 0) {
        setError(
          "Invalid JSON format. Expected a non-empty array of questions.",
        );
        return false;
      }

      for (let i = 0; i < data.length; i++) {
        const q = data[i];
        if (!q.question || !q.option || !q.answer || !q.explanation) {
          throw new Error(
            `Question at index ${i} is missing required fields (question, option, answer, explanation).`,
          );
        }
        if (!Array.isArray(q.option) || q.option.length === 0) {
          throw new Error(
            `Question "${q.question}" must have at least one option.`,
          );
        }
      }
      setError(null);
      return true;
    } catch (e: any) {
      setError(`Failed to parse JSON: ${e.message}`);
      return false;
    }
  };

  const deriveQuizName = (jsonString: string) => {
    try {
      const data: UserQuestion[] = JSON.parse(extractJsonArray(jsonString));
      const firstQuestion = data?.[0]?.question?.trim();
      if (firstQuestion) {
        return firstQuestion.length > 60
          ? `${firstQuestion.slice(0, 57)}...`
          : firstQuestion;
      }
    } catch (err) {
      console.warn("Failed to derive quiz name", err);
    }
    return "Custom Quiz";
  };

  const handleSaveQuiz = () => {
    if (!validateJson(jsonInput)) {
      return;
    }

    if (!hasHydrated) {
      setError(
        "Saved quizzes are still loading. Please try again in a moment.",
      );
      return;
    }

    const finalName = quizName.trim() || deriveQuizName(jsonInput);

    try {
      addSavedQuiz({
        name: finalName,
        json: jsonInput,
      });
      setQuizName(finalName);
      router.push("/");
    } catch (storageError) {
      setError("Failed to save quiz. Please try again.");
      console.warn("Failed to save quiz", storageError);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      validateJson(text);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Create Your Quiz</CardTitle>
        <CardDescription>
          Set up your quiz, then generate questions with AI or paste your own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />

        <QuizConfigFields
          quizName={quizName}
          topicsInput={topicsInput}
          numQuestions={numQuestions}
          difficulty={difficulty}
          optionsPerQuestion={optionsPerQuestion}
          language={language}
          includeExplanations={includeExplanations}
          onQuizNameChange={setQuizName}
          onTopicsInputChange={setTopicsInput}
          onNumQuestionsChange={setNumQuestions}
          onDifficultyChange={setDifficulty}
          onOptionsPerQuestionChange={setOptionsPerQuestion}
          onLanguageChange={setLanguage}
          onIncludeExplanationsChange={setIncludeExplanations}
        />

        <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
          <TabsList>
            <TabsTrigger value="prompt">Prompt for AI</TabsTrigger>
            <TabsTrigger value="generate">Generate with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt">
            <PromptTab
              prompt={generatedPrompt}
              willAttachNotes={willAttachNotes}
              onWillAttachNotesChange={setWillAttachNotes}
              jsonInput={jsonInput}
              onJsonInputChange={(value) => {
                setJsonInput(value);
                setError(null);
              }}
              error={error}
              hasHydrated={hasHydrated}
              onSave={handleSaveQuiz}
              onUploadClick={() => fileInputRef.current?.click()}
            />
          </TabsContent>

          <TabsContent value="generate">
            <GenerateTab
              config={runtimeConfig}
              quizName={quizName}
              deriveQuizName={deriveQuizName}
              hasHydrated={hasHydrated}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
