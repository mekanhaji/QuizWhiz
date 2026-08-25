"use client";

import { PromptSuggestionCard } from "@/app/create-new-quiz/_components/prompt-suggestion-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuizStore } from "@/store/quiz-store";
import { AlertCircle, Rocket, Save, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export function CreateQuizForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quizName, setQuizName] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
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
    } catch (parseError) {
      console.warn("Failed to load draft quiz", parseError);
    } finally {
      sessionStorage.removeItem("create-quiz-draft");
    }
  }, []);

  const validateJson = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) {
        setError("JSON data cannot be empty.");
        return false;
      }
      const data: UserQuestion[] = JSON.parse(jsonString);

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
      const data: UserQuestion[] = JSON.parse(jsonString);
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

  const handleStartQuiz = () => {
    if (!validateJson(jsonInput)) {
      return;
    }

    const runtimeQuizId = crypto.randomUUID();
    const runtimeQuizName = quizName.trim() || deriveQuizName(jsonInput);

    try {
      sessionStorage.setItem(
        `quiz-${runtimeQuizId}`,
        JSON.stringify({ json: jsonInput, name: runtimeQuizName }),
      );
    } catch (storageError) {
      console.warn("Failed to persist quiz payload", storageError);
    }

    router.push(`/${runtimeQuizId}`);
  };

  const handleOpenSaveDialog = () => {
    if (validateJson(jsonInput)) {
      setIsSaveModalOpen(true);
    }
  };

  const handleSaveQuiz = () => {
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
      setIsSaveModalOpen(false);
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
    <>
      <Card className="mt-6">
        <CardHeader className="space-y-2 flex flex-row justify-between">
          <div>
            <CardTitle>Create Your Quiz</CardTitle>
            <CardDescription>
              Paste your quiz JSON, upload a JSON file, save the quiz, then
              start.
            </CardDescription>
          </div>
          <Button onClick={() => setIsPromptOpen(true)}>Prompt For AI</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="space-y-2">
            <Label htmlFor="quiz-name-input">Quiz Name (optional)</Label>
            <Input
              id="quiz-name-input"
              value={quizName}
              onChange={(event) => setQuizName(event.target.value)}
              placeholder="e.g., JavaScript Basics"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="json-input">Quiz JSON Data</Label>
              <Button
                variant="ghost"
                size="sm"
                disabled={!jsonInput}
                onClick={() => {
                  setJsonInput("");
                  setError(null);
                }}
              >
                Clear Text
              </Button>
              {/* {jsonInput && (
              )} */}
            </div>
            <Textarea
              id="json-input"
              value={jsonInput}
              onChange={(event) => {
                setJsonInput(event.target.value);
                setError(null);
              }}
              placeholder='[{"question": "...", "option": ["..."], "answer": "...", "explanation": "..."}]'
              rows={10}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleOpenSaveDialog}
              disabled={!jsonInput || !hasHydrated}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload JSON
            </Button>
          </div>

          <Button
            className="w-full"
            onClick={handleStartQuiz}
            disabled={!jsonInput}
          >
            <Rocket className="mr-2 h-4 w-4" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <PromptSuggestionCard />
        </DialogContent>
      </Dialog>

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Quiz</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <Label htmlFor="quiz-name">Quiz Name</Label>
            <Input
              id="quiz-name"
              value={quizName}
              onChange={(event) => setQuizName(event.target.value)}
              placeholder="e.g., General Knowledge"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveQuiz}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
