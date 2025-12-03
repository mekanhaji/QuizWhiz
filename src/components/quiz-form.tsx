"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, Save, Trash2, Rocket } from "lucide-react";
import { Quiz } from "./quiz";
import type { Question } from "@/lib/quiz-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
};

type SavedQuiz = {
  name: string;
  json: string;
};

export function QuizForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [isAddQuizDialogOpen, setIsAddQuizDialogOpen] = useState(false);
  const [hasLoadedSavedQuizzes, setHasLoadedSavedQuizzes] = useState(false);

  useEffect(() => {
    try {
      const storedQuizzes = localStorage.getItem("savedQuizzes");
      if (storedQuizzes) {
        setSavedQuizzes(JSON.parse(storedQuizzes));
      }
    } catch (e) {
      console.error("Failed to load quizzes from localStorage", e);
    } finally {
      setHasLoadedSavedQuizzes(true);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedSavedQuizzes && savedQuizzes.length === 0) {
      setIsAddQuizDialogOpen(true);
    }
  }, [hasLoadedSavedQuizzes, savedQuizzes]);

  const validateJson = (jsonString: string): boolean => {
    try {
      if (!jsonString.trim()) {
        setError("JSON data cannot be empty.");
        return false;
      }
      const data: UserQuestion[] = JSON.parse(jsonString);

      if (!Array.isArray(data) || data.length === 0) {
        setError(
          "Invalid JSON format. Expected a non-empty array of questions."
        );
        return false;
      }

      for (let i = 0; i < data.length; i++) {
        const q = data[i];
        if (!q.question || !q.option || !q.answer || !q.explanation) {
          throw new Error(
            `Question at index ${i} is missing required fields (question, option, answer, explanation).`
          );
        }
        if (!Array.isArray(q.option) || q.option.length === 0) {
          throw new Error(
            `Question "${q.question}" must have at least one option.`
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

  const parseAndStartQuiz = (jsonString: string) => {
    if (!validateJson(jsonString)) {
      setQuestions(null);
      return;
    }
    const data: UserQuestion[] = JSON.parse(jsonString);
    const formattedQuestions = data.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.option,
      correctAnswer: q.answer,
      explanation: q.explanation,
    }));

    setQuestions(formattedQuestions);
    setError(null);
  };

  const handleStartQuiz = () => {
    parseAndStartQuiz(jsonInput);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonInput(text);
        if (validateJson(text)) {
          parseAndStartQuiz(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRestart = () => {
    setQuestions(null);
    // Keep jsonInput and error for user to see
  };

  const handleOpenSaveDialog = () => {
    if (validateJson(jsonInput)) {
      setIsSaveModalOpen(true);
    }
  };

  const handleSaveQuiz = () => {
    if (!quizName.trim()) {
      alert("Please enter a name for the quiz.");
      return;
    }
    const newQuiz: SavedQuiz = { name: quizName, json: jsonInput };
    const updatedQuizzes = [...savedQuizzes, newQuiz];
    setSavedQuizzes(updatedQuizzes);
    localStorage.setItem("savedQuizzes", JSON.stringify(updatedQuizzes));
    setIsSaveModalOpen(false);
    setQuizName("");
  };

  const loadQuiz = (json: string) => {
    setJsonInput(json);
    setError(null);
  };

  const startSavedQuiz = (json: string) => {
    loadQuiz(json);
    parseAndStartQuiz(json);
  };

  const deleteQuiz = (quizNameToDelete: string) => {
    const updatedQuizzes = savedQuizzes.filter(
      (q) => q.name !== quizNameToDelete
    );
    setSavedQuizzes(updatedQuizzes);
    localStorage.setItem("savedQuizzes", JSON.stringify(updatedQuizzes));
  };

  if (questions) {
    return <Quiz questions={questions} onRestartQuiz={handleRestart} />;
  }

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
          <Button size="sm" onClick={() => setIsAddQuizDialogOpen(true)}>
            Add New Qiiz
          </Button>
        </CardHeader>
        <CardContent>
          {savedQuizzes.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No saved quizzes yet. Use "Add New Qiiz" to get started.
            </div>
          ) : (
            <ul className="space-y-3">
              {savedQuizzes.map((quiz, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium flex-1 mb-2 sm:mb-0">
                    {quiz.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadQuiz(quiz.json)}
                    >
                      Load
                    </Button>
                    <Button size="sm" onClick={() => startSavedQuiz(quiz.json)}>
                      Start
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteQuiz(quiz.name)}
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

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Quiz</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="quiz-name">Quiz Name</Label>
            <Input
              id="quiz-name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
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

      <Dialog
        open={isAddQuizDialogOpen || savedQuizzes.length == 0}
        onOpenChange={setIsAddQuizDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Quiz</DialogTitle>
            <DialogDescription>
              Paste your quiz data as JSON below, or upload a JSON file to
              begin.
            </DialogDescription>
          </DialogHeader>
          <div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="json-input">Quiz JSON Data</Label>
              <Textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setError(null); // Clear error on edit
                }}
                placeholder='[{"question": "...", "option": ["..."], "answer": "...", "explanation": "..."}]'
                rows={8}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleOpenSaveDialog}
              disabled={!jsonInput}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleUploadClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload JSON
            </Button>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={handleStartQuiz}
              disabled={!jsonInput}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
