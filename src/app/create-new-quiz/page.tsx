import { CreateQuizForm } from "@/components/create-quiz-form";

export default function CreateNewQuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-2xl">
        <CreateQuizForm />
      </div>
    </main>
  );
}
