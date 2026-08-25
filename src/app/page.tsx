import { QuizForm } from "@/components/quiz-form";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-background px-4 sm:px-8 mt-2">
      <div className="w-full max-w-2xl">
        <QuizForm />
      </div>
    </main>
  );
}
