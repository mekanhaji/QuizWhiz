import { questionKey } from "@/lib/question-key";

export type Question = {
  id: number;
  key: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  bookmarks?: string[];
};

export type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
  bookmarks?: string[];
};

/**
 * Strips ```json fences and surrounding prose. AI output and hand-pasted
 * chat transcripts both routinely arrive wrapped despite instructions not to.
 */
export const extractJsonArray = (raw: string): string => {
  const unfenced = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const start = unfenced.indexOf("[");
  const end = unfenced.lastIndexOf("]");
  return start !== -1 && end > start ? unfenced.slice(start, end + 1) : unfenced;
};

export const parseQuizQuestions = (jsonString: string): Question[] => {
  const data: UserQuestion[] = JSON.parse(extractJsonArray(jsonString));

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Quiz data is empty or malformed.");
  }

  return data.map((q, index) => {
    if (!q.question || !Array.isArray(q.option) || !q.option.length) {
      throw new Error(`Question ${index + 1} is missing text or options.`);
    }
    if (!q.answer || !q.explanation) {
      throw new Error(
        `Question ${index + 1} is missing an answer or explanation.`,
      );
    }

    return {
      id: index + 1,
      key: questionKey(q.question),
      question: q.question,
      options: q.option,
      correctAnswer: q.answer,
      explanation: q.explanation,
      bookmarks: q.bookmarks || [],
    };
  });
};

export const toUserQuestions = (questions: Question[]): UserQuestion[] =>
  questions.map((q) => ({
    question: q.question,
    option: q.options,
    answer: q.correctAnswer,
    explanation: q.explanation,
    ...(q.bookmarks?.length ? { bookmarks: q.bookmarks } : {}),
  }));
