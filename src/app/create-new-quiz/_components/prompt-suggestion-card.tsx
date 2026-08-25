"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  buildMcqPrompt,
  type McqPromptConfig,
  normalizeMcqPromptConfig,
} from "@/lib/mcq-prompt";

type PromptSuggestionCardProps = {
  defaultConfig?: Partial<McqPromptConfig>;
};

export function PromptSuggestionCard({
  defaultConfig,
}: PromptSuggestionCardProps) {
  const mergedDefaults = useMemo(
    () => normalizeMcqPromptConfig(defaultConfig),
    [defaultConfig],
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState(mergedDefaults.numQuestions);
  const [difficulty, setDifficulty] = useState(
    String(mergedDefaults.difficulty),
  );
  const [topicsInput, setTopicsInput] = useState(
    mergedDefaults.topics.join(", "),
  );
  const [language, setLanguage] = useState(mergedDefaults.language);
  const [includeExplanations, setIncludeExplanations] = useState(
    mergedDefaults.includeExplanations,
  );
  const [randomizeOptions, setRandomizeOptions] = useState(
    mergedDefaults.randomizeOptions,
  );
  const [optionsPerQuestion, setOptionsPerQuestion] = useState(
    mergedDefaults.optionsPerQuestion,
  );
  const [willAttachNotes, setWillAttachNotes] = useState(
    mergedDefaults.willAttachNotes,
  );

  const runtimeConfig = useMemo(() => {
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
      randomizeOptions,
      optionsPerQuestion,
      willAttachNotes,
    });
  }, [
    difficulty,
    includeExplanations,
    language,
    numQuestions,
    optionsPerQuestion,
    randomizeOptions,
    topicsInput,
    willAttachNotes,
  ]);

  const generatedPrompt = useMemo(
    () => buildMcqPrompt(runtimeConfig),
    [runtimeConfig],
  );

  const handleCopy = async (prompt: string, key: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Prompt Ideas</CardTitle>
        <CardDescription>
          Configure prompt parameters, then copy the generated MCQ prompt for
          your AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="prompt-num-questions">Number of Questions</Label>
            <Input
              id="prompt-num-questions"
              type="number"
              min={1}
              value={numQuestions}
              onChange={(event) =>
                setNumQuestions(
                  Number(event.target.value || mergedDefaults.numQuestions),
                )
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prompt-difficulty">Difficulty</Label>
            <Input
              id="prompt-difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              placeholder="easy | medium | hard | 1-5"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="prompt-topics">Topics (comma-separated)</Label>
            <Input
              id="prompt-topics"
              value={topicsInput}
              onChange={(event) => setTopicsInput(event.target.value)}
              placeholder="JavaScript closures, async/await"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prompt-language">Language</Label>
            <Input
              id="prompt-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              placeholder="English"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="prompt-options-count">Options per Question</Label>
            <Input
              id="prompt-options-count"
              type="number"
              min={2}
              value={optionsPerQuestion}
              onChange={(event) =>
                setOptionsPerQuestion(
                  Number(
                    event.target.value || mergedDefaults.optionsPerQuestion,
                  ),
                )
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="prompt-include-explanations">
              Include Explanations
            </Label>
            <Switch
              id="prompt-include-explanations"
              checked={includeExplanations}
              onCheckedChange={setIncludeExplanations}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3 sm:col-span-2">
            <Label htmlFor="prompt-randomize-options">Randomize Options</Label>
            <Switch
              id="prompt-randomize-options"
              checked={randomizeOptions}
              onCheckedChange={setRandomizeOptions}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3 sm:col-span-2">
            <Label htmlFor="prompt-will-attach-notes">
              I will attach notes
            </Label>
            <Switch
              id="prompt-will-attach-notes"
              checked={willAttachNotes}
              onCheckedChange={setWillAttachNotes}
            />
          </div>
        </div>

        <div className="space-y-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Generated Prompt</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(generatedPrompt, "generated")}
            >
              {copiedKey === "generated" ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-sm font-sans">
            {generatedPrompt}
          </pre>
        </div>

        <p className="text-xs text-muted-foreground">
          Defaults are loaded from shared config and can be overridden in this
          UI or by passing a new default config object.
        </p>
      </CardContent>
    </Card>
  );
}
