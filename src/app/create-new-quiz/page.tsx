import { CreateQuizForm } from "@/app/create-new-quiz/_components/create-quiz-form";

export default function CreateNewQuizPage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-24 bg-background mt-2">
      <div className="w-full max-w-2xl">
        <CreateQuizForm />
      </div>
    </main>
  );
}
