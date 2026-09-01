"use client";

import { PasteButton } from "@/components/paste-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type QuizConfigFieldsValue = {
  quizName: string;
  topicsInput: string;
  numQuestions: number;
  difficulty: string;
  optionsPerQuestion: number;
  language: string;
  includeExplanations: boolean;
};

type QuizConfigFieldsProps = QuizConfigFieldsValue & {
  onQuizNameChange: (value: string) => void;
  onTopicsInputChange: (value: string) => void;
  onNumQuestionsChange: (value: number) => void;
  onDifficultyChange: (value: string) => void;
  onOptionsPerQuestionChange: (value: number) => void;
  onLanguageChange: (value: string) => void;
  onIncludeExplanationsChange: (value: boolean) => void;
};

export function QuizConfigFields({
  quizName,
  topicsInput,
  numQuestions,
  difficulty,
  optionsPerQuestion,
  language,
  includeExplanations,
  onQuizNameChange,
  onTopicsInputChange,
  onNumQuestionsChange,
  onDifficultyChange,
  onOptionsPerQuestionChange,
  onLanguageChange,
  onIncludeExplanationsChange,
}: QuizConfigFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quiz-name-input">Quiz Name</Label>
        <Input
          id="quiz-name-input"
          value={quizName}
          onChange={(event) => onQuizNameChange(event.target.value)}
          placeholder="e.g., JavaScript Basics"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-end justify-between mb-1">
          <Label htmlFor="quiz-topics">Topics</Label>
          <PasteButton onPaste={onTopicsInputChange} />
        </div>
        <Textarea
          id="quiz-topics"
          value={topicsInput}
          onChange={(event) => onTopicsInputChange(event.target.value)}
          placeholder="JavaScript closures, async/await"
          rows={2}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="quiz-num-questions">Number of Questions</Label>
          <Input
            id="quiz-num-questions"
            type="number"
            min={1}
            value={numQuestions}
            onChange={(event) =>
              onNumQuestionsChange(Number(event.target.value || numQuestions))
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="quiz-difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger id="quiz-difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="quiz-options-count">Options per Question</Label>
          <Input
            id="quiz-options-count"
            type="number"
            min={2}
            value={optionsPerQuestion}
            onChange={(event) =>
              onOptionsPerQuestionChange(
                Number(event.target.value || optionsPerQuestion),
              )
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="quiz-language">Language</Label>
          <Input
            id="quiz-language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            placeholder="English"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[10px] border-[2.5px] border-foreground p-3">
        <Label htmlFor="quiz-include-explanations">Include Explanations</Label>
        <Switch
          id="quiz-include-explanations"
          checked={includeExplanations}
          onCheckedChange={onIncludeExplanationsChange}
        />
      </div>
    </div>
  );
}
