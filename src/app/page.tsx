import { QuizForm } from "@/components/quiz-form";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center bg-background px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-2xl">
        <QuizForm />
      </div>
    </main>
  );
}
