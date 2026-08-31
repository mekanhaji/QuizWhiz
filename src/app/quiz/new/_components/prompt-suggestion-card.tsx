"use client";

import { Button } from "@/components/ui/button";
import { PasteButton } from "@/components/paste-button";
import { AiAssistantLinks } from "./ai-assistant-links";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  buildMcqPrompt,
  type McqPromptConfig,
  normalizeMcqPromptConfig,
} from "@/lib/mcq-prompt";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type PromptSuggestionCardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultConfig?: Partial<McqPromptConfig>;
};

export function PromptSuggestionCard({
  open,
  onOpenChange,
  defaultConfig,
}: PromptSuggestionCardProps) {
  const mergedDefaults = useMemo(
    () => normalizeMcqPromptConfig(defaultConfig),
    [defaultConfig],
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prompt Ideas</DialogTitle>
          <DialogDescription>
            Configure prompt parameters, then copy the generated MCQ prompt for
            your AI assistant.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-end justify-between mb-4 ">
                <Label htmlFor="prompt-topics">Topics</Label>
                <PasteButton onPaste={(text) => setTopicsInput(text)} />
              </div>
              <Textarea
                id="prompt-topics"
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                placeholder="JavaScript closures, async/await"
                rows={2}
              />
            </div>

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
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="prompt-difficulty">
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

            <div className="flex items-center justify-between rounded-md border p-3">
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
          <AiAssistantLinks prompt={generatedPrompt} onCopy={handleCopy} />
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
            <div className="relative">
              <pre
                className={cn(
                  "whitespace-pre-wrap text-sm font-sans pb-6 pr-8",
                  !isPromptExpanded && "line-clamp-3",
                )}
              >
                {generatedPrompt}
              </pre>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 h-7 w-7"
                onClick={() => setIsPromptExpanded((prev) => !prev)}
              >
                {isPromptExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isPromptExpanded ? "Collapse prompt" : "Expand prompt"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
