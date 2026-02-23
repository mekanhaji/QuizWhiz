import { QuizForm } from "@/components/quiz-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-headline font-bold text-center mb-8 text-primary dark:text-primary-foreground">
          QuizWhiz
        </h1>
        <QuizForm />
      </div>
    </main>
  );
}
