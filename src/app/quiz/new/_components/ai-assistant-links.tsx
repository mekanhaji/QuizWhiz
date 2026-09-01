import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type AiAssistantLinksProps = {
  prompt: string;
  onCopy: (prompt: string, key: string) => void;
};

const aiAssistants = [
  {
    name: "ChatGPT",
    buildUrl: (prompt: string) =>
      `https://chatgpt.com/?${new URLSearchParams({ prompt })}`,
  },
  {
    name: "Claude",
    buildUrl: (prompt: string) =>
      `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
  },
  {
    name: "Le Chat",
    buildUrl: (prompt: string) =>
      `https://chat.mistral.ai/chat?${new URLSearchParams({ q: prompt })}`,
  },
  {
    name: "Perplexity",
    buildUrl: (prompt: string) =>
      `https://www.perplexity.ai/?${new URLSearchParams({ q: prompt })}`,
  },
] as const;

export function AiAssistantLinks({ prompt, onCopy }: AiAssistantLinksProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Open prompt in</p>
      <div className="flex flex-wrap gap-2">
        {aiAssistants.map((assistant) => (
          <Button key={assistant.name} asChild variant="outline" size="sm">
            <a
              href={assistant.buildUrl(prompt)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onCopy(prompt, assistant.name)}
              aria-label={`Open prompt in ${assistant.name}`}
            >
              {assistant.name}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
