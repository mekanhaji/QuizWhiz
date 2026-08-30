import { SYSTEM_INSTRUCTION } from "@/constants";
import { buildMcqPrompt, type McqPromptConfig } from "@/lib/mcq-prompt";
import { parseQuizQuestions, type Question } from "@/lib/quiz-data";
import { createMistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

const MISTRAL_MODEL = "mistral-small-latest";

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateQuiz = async (
  config: Partial<McqPromptConfig> = {},
): Promise<Question[]> => {
  const prompt = buildMcqPrompt(config);

  const { text } = await generateText({
    model: mistral(MISTRAL_MODEL),
    system: SYSTEM_INSTRUCTION,
    prompt,
    temperature: 0.7,
  });

  return parseQuizQuestions(text);
};
