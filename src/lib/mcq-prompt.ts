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

export const MCQ_PROMPT_TEMPLATE = `You are an expert quiz author. Create exactly {{{numQuestions}}} multiple-choice questions and return them as a single JSON array.

Topics: {{{topics}}}
Difficulty: {{{difficulty}}} (easy = basic recall, medium = understanding and application, hard = analysis, edge cases, multi-step reasoning)
Language: write every question, option, and explanation in {{{language}}}.

Output format return ONLY the raw JSON array. No markdown code fences, no commentary before or after.
The structure must be exactly: {{{outputShape}}}

Example item (illustrative only copy the key names exactly; note "option" is singular):
{ "question": "Which planet is closest to the Sun?", "option": ["Venus", "Mercury", "Earth", "Mars"], "answer": "Mercury", "explanation": "Mercury orbits nearest to the Sun, at an average distance of about 58 million km." }

Rules:
- Give each question exactly {{{optionsPerQuestion}}} options with exactly one correct answer.
- "answer" must match one of that question's options character for character.
- Make wrong options plausible and similar to the correct one in length and style. Never use "All of the above", "None of the above", or combined options like "Both A and B".
- Vary the position of the correct answer across questions.
- Do not repeat or trivially rephrase questions; spread coverage evenly across the listed topics.
- Every question must be answerable on its own, without seeing the other questions.
- Output strict JSON: double quotes for all strings, quotes inside text escaped, no trailing commas.
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
  }

  if (
    !Number.isFinite(merged.optionsPerQuestion) ||
    merged.optionsPerQuestion < 2
  ) {
    merged.optionsPerQuestion = DEFAULT_MCQ_PROMPT_CONFIG.optionsPerQuestion;
  }

  return merged;
}

export function buildMcqPrompt(config: Partial<McqPromptConfig> = {}): string {
  const normalized = normalizeMcqPromptConfig(config);
  const topics =
    normalized.topics.join(", ") || DEFAULT_MCQ_PROMPT_CONFIG.topics[0];
  const notesRule = normalized.willAttachNotes
    ? "- I am attaching notes. Base every question on the attached notes and do not introduce facts they don't support; use the listed topics only to prioritize within the notes."
    : "- Base the questions on the listed topics using accurate, well-established knowledge.";
  const explanationRule = normalized.includeExplanations
    ? '- Write a 1-2 sentence "explanation" for each question stating why the correct answer is right (and, when useful, why the closest wrong option is wrong).'
    : '- Set "explanation" to an empty string ("") for every question.';

  return MCQ_PROMPT_TEMPLATE.replaceAll(
    "{{{numQuestions}}}",
    String(normalized.numQuestions),
  )
    .replaceAll("{{{outputShape}}}", MCQ_JSON_OUTPUT_SHAPE)
    .replaceAll("{{{topics}}}", topics)
    .replaceAll("{{{difficulty}}}", String(normalized.difficulty))
    .replaceAll("{{{language}}}", normalized.language)
    .replaceAll(
      "{{{optionsPerQuestion}}}",
      String(normalized.optionsPerQuestion),
    )
    .replaceAll("{{{notesRule}}}", notesRule)
    .replaceAll("{{{explanationRule}}}", explanationRule);
}
