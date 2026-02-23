"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PromptSuggestionCardProps = {
  prompts: string[];
};

export function PromptSuggestionCard({ prompts }: PromptSuggestionCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Prompt Ideas</CardTitle>
        <CardDescription>
          Use these sample prompts with your AI assistant to generate quiz JSON.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {prompts.map((prompt, index) => (
            <li key={index} className="group relative rounded-md border p-3">
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {prompt}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleCopy(prompt, index)}
              >
                {copiedIndex === index ? (
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
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
