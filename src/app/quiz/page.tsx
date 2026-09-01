import type { Metadata } from "next";
import { QuizForm } from "@/components/quiz-form";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Quizzes",
  description:
    "Your quizzes, saved in this browser — no account needed. Reopen any saved quiz and keep drilling until every question is mastered.",
  path: "/quiz",
});

export default function QuizesPage() {
  return (
    <div className="w-full max-w-2xl">
      <QuizForm />
    </div>
  );
}
