export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
  bookmarks?: string[];
};

export const parseQuizQuestions = (jsonString: string): Question[] => {
  const data: UserQuestion[] = JSON.parse(jsonString);

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
      question: q.question,
      options: q.option,
      correctAnswer: q.answer,
      explanation: q.explanation,
      bookmarks: q.bookmarks || [],
    };
  });
};
