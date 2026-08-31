import type { Metadata } from "next";
import { CreateQuizForm } from "@/app/quiz/new/_components/create-quiz-form";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Create a Quiz with Your AI Assistant",
  description:
    "Pick topics, difficulty, question count and language. M.I.Ready builds the prompt, opens it in ChatGPT, Claude, Le Chat or Perplexity, and turns the JSON you paste back into a drill.",
  path: "/quiz/new",
});

export default function CreateNewQuizPage() {
  return (
    <div className="w-full max-w-2xl">
      <CreateQuizForm />
    </div>
  );
}
