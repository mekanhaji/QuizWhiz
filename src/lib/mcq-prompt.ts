export const MCQ_JSON_OUTPUT_SHAPE =
  "[{ question: string, option: string[], answer: string, explanation: string }]";

export type PromptDifficulty = "easy" | "medium" | "hard" | number | string;

export type McqPromptConfig = {
  numQuestions: number;
  difficulty: PromptDifficulty;
  topics: string[];
  language: string;
  includeExplanations: boolean;
  optionsPerQuestion: number;
  willAttachNotes: boolean;
};

export const DEFAULT_MCQ_PROMPT_CONFIG: McqPromptConfig = {
  numQuestions: 10,
  difficulty: "medium",
  topics: ["general knowledge"],
  language: "English",
  includeExplanations: true,
  optionsPerQuestion: 4,
  willAttachNotes: false,
};

export const MCQ_PROMPT_TEMPLATE = `Create {{{numQuestions}}} multiple-choice questions in JSON format.
The JSON structure must be {{{outputShape}}}.

Parameters:
- topics: {{{topics}}}
- difficulty: {{{difficulty}}}
- language: {{{language}}}
- includeExplanations: {{{includeExplanations}}}
- optionsPerQuestion: {{{optionsPerQuestion}}}
- willAttachNotes: {{{willAttachNotes}}}

Requirements:
- Return ONLY valid JSON (no markdown, no commentary).
- For each question, provide exactly {{{optionsPerQuestion}}} options.
- The answer must be exactly one of the options.
- Keep answer choices concise and non-overlapping.
{{{notesRule}}}
{{{explanationRule}}}`;

export const MCQ_PROMPT_PARAMETER_HELP = [
  "numQuestions: Number of questions to generate.",
  "difficulty: Can be easy, medium, hard, or a numeric scale value.",
  "topics: Comma-separated list of domains to cover.",
  "language: Output language for questions, answers, and explanations.",
  "includeExplanations: Whether each question includes an explanation.",
  "optionsPerQuestion: Number of answer choices for each question.",
  "willAttachNotes: Whether the user will attach notes the model must refer to.",
];

export function normalizeMcqPromptConfig(
  overrides: Partial<McqPromptConfig> = {},
): McqPromptConfig {
  const merged: McqPromptConfig = {
    ...DEFAULT_MCQ_PROMPT_CONFIG,
    ...overrides,
    topics:
      overrides.topics && overrides.topics.length > 0
        ? overrides.topics.filter((topic) => topic.trim().length > 0)
        : DEFAULT_MCQ_PROMPT_CONFIG.topics,
  };

  if (!Number.isFinite(merged.numQuestions) || merged.numQuestions < 1) {
    merged.numQuestions = DEFAULT_MCQ_PROMPT_CONFIG.numQuestions;
  } else {
    merged.numQuestions = Math.min(Math.round(merged.numQuestions), 50);
  }

  if (
    !Number.isFinite(merged.optionsPerQuestion) ||
    merged.optionsPerQuestion < 2
  ) {
    merged.optionsPerQuestion = DEFAULT_MCQ_PROMPT_CONFIG.optionsPerQuestion;
  } else {
    merged.optionsPerQuestion = Math.min(
      Math.round(merged.optionsPerQuestion),
      6,
    );
  }

  return merged;
}

export function buildMcqPrompt(config: Partial<McqPromptConfig> = {}): string {
  const normalized = normalizeMcqPromptConfig(config);
  const topics =
    normalized.topics.join(", ") || DEFAULT_MCQ_PROMPT_CONFIG.topics[0];
  const notesRule = normalized.willAttachNotes
    ? "- The user will attach notes. Use the attached notes as the primary source and align questions to them."
    : "- If no notes are attached, rely on the provided topics and general domain knowledge.";
  const explanationRule = normalized.includeExplanations
    ? "- Provide a clear explanation for each answer."
    : "- Set explanation to an empty string for every item.";

  return MCQ_PROMPT_TEMPLATE.replaceAll(
    "{{{numQuestions}}}",
    String(normalized.numQuestions),
  )
    .replaceAll("{{{outputShape}}}", MCQ_JSON_OUTPUT_SHAPE)
    .replaceAll("{{{topics}}}", topics)
    .replaceAll("{{{difficulty}}}", String(normalized.difficulty))
    .replaceAll("{{{language}}}", normalized.language)
    .replaceAll(
      "{{{includeExplanations}}}",
      String(normalized.includeExplanations),
    )
    .replaceAll("{{{optionsPerQuestion}}}", String(normalized.optionsPerQuestion))
    .replaceAll("{{{willAttachNotes}}}", String(normalized.willAttachNotes))
    .replaceAll("{{{notesRule}}}", notesRule)
    .replaceAll("{{{explanationRule}}}", explanationRule);
}
