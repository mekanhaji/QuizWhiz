import { SYSTEM_INSTRUCTION } from "@/constants";
import { buildMcqPrompt, type McqPromptConfig } from "@/lib/mcq-prompt";
import { parseQuizQuestions, type Question } from "@/lib/quiz-data";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const GROQ_MODEL = "qwen/qwen3.8-27b";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateQuiz = async (
  config: Partial<McqPromptConfig> = {},
): Promise<Question[]> => {
  const prompt = buildMcqPrompt(config);

  const { text } = await generateText({
    model: groq(GROQ_MODEL),
    system: SYSTEM_INSTRUCTION,
    prompt,
    temperature: 0.7,
  });

  return parseQuizQuestions(text);
};
