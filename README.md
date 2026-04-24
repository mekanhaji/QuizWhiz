# QuizWhiz
<img width="1900" height="1120" alt="QuizWhiz" src="https://github.com/user-attachments/assets/f2c88e5d-2db1-40e1-9b80-35d0509fdcae" />

QuizWhiz is a Next.js quiz app where users can upload or paste question JSON,
save quizzes locally, and run quiz sessions in the browser.

## Dynamic MCQ Prompt System

The app includes a configurable MCQ prompt builder for generating quiz JSON with
an AI assistant.

The required output structure remains:

```ts
[{ question: string, option: string[], answer: string, explanation: string }]
```

### Runtime Parameters

Supported dynamic fields:

- `numQuestions`
- `difficulty` (`easy` / `medium` / `hard` or numeric scale)
- `topics` (string list)
- `language` (optional)
- `includeExplanations` (optional)
- `randomizeOptions` (optional)
- `optionsPerQuestion` (optional)
- `willAttachNotes` (optional)

### Defaults and Overrides

Defaults are defined in `src/lib/mcq-prompt.ts` via
`DEFAULT_MCQ_PROMPT_CONFIG`. These defaults are used by the prompt UI and can
be overridden:

1. At runtime in the prompt configuration card.
2. Programmatically by passing partial config to `buildMcqPrompt(...)`.
3. Programmatically by passing `defaultConfig` to `PromptSuggestionCard`.

Example:

```ts
import { buildMcqPrompt } from "@/lib/mcq-prompt";

const prompt = buildMcqPrompt({
  numQuestions: 15,
  difficulty: "hard",
  topics: ["JavaScript", "TypeScript", "Node.js"],
  language: "English",
  includeExplanations: true,
});
```

## Local Development

```bash
npm install
npm run dev
```
