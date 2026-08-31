"use client";

import { AiAssistantLinks } from "./ai-assistant-links";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasteButton } from "@/components/paste-button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, ChevronUp, Copy, Save, Upload } from "lucide-react";
import { useState } from "react";

type PromptTabProps = {
  prompt: string;
  willAttachNotes: boolean;
  onWillAttachNotesChange: (value: boolean) => void;
  jsonInput: string;
  onJsonInputChange: (value: string) => void;
  error: string | null;
  hasHydrated: boolean;
  onSave: () => void;
  onUploadClick: () => void;
};

export function PromptTab({
  prompt,
  willAttachNotes,
  onWillAttachNotesChange,
  jsonInput,
  onJsonInputChange,
  error,
  hasHydrated,
  onSave,
  onUploadClick,
}: PromptTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[10px] border-[2.5px] border-foreground p-3">
        <Label htmlFor="prompt-will-attach-notes">I will attach notes</Label>
        <Switch
          id="prompt-will-attach-notes"
          checked={willAttachNotes}
          onCheckedChange={onWillAttachNotesChange}
        />
      </div>

      <AiAssistantLinks prompt={prompt} onCopy={handleCopy} />

      <div className="space-y-2 rounded-[10px] border-[2.5px] border-foreground p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Generated Prompt</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(prompt, "generated")}
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
            {prompt}
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex items-end justify-between mb-1">
          <Label htmlFor="json-input">Quiz JSON Data</Label>
          <div className="flex items-center gap-2">
            <PasteButton onPaste={onJsonInputChange} />
            <Button
              variant="ghost"
              size="sm"
              disabled={!jsonInput}
              onClick={() => onJsonInputChange("")}
            >
              Clear Text
            </Button>
          </div>
        </div>
        <Textarea
          id="json-input"
          value={jsonInput}
          onChange={(event) => onJsonInputChange(event.target.value)}
          placeholder='[{"question": "...", "option": ["..."], "answer": "...", "explanation": "..."}]'
          rows={10}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onSave}
          disabled={!jsonInput || !hasHydrated}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Quiz
        </Button>
        <Button variant="outline" className="w-full" onClick={onUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload JSON
        </Button>
      </div>
    </div>
  );
}
