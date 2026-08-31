import { SectionHead } from "@/app/_components/sticker-primitives";

/**
 * Single source of truth for the FAQ: feeds both the visible section below
 * and the FAQPage JSON-LD on the home page, so the two can never drift apart.
 */
export const FAQ_ITEMS = [
  {
    q: "Is M.I.Ready free? Do I need an account?",
    a: "Yes — M.I.Ready is completely free and there's no account or sign-up. Your quizzes are saved in your browser's local storage, so nothing is uploaded to a server. Clearing your browser data removes them, and quizzes don't sync between devices.",
  },
  {
    q: "Does M.I.Ready generate the quiz questions itself?",
    a: "Not yet — built-in generation is under development. Today, M.I.Ready builds a ready-to-use prompt from your topics, question count, difficulty and language, and opens it in your own AI assistant: ChatGPT, Claude, Le Chat or Perplexity. You paste the JSON the assistant returns back into M.I.Ready — or upload it as a file — and start drilling. Any assistant that can return JSON works, and this bring-your-own-AI option will stick around even after in-app generation ships.",
  },
  {
    q: "Can I make a quiz from my own notes?",
    a: "Yes. When you create a quiz, tell M.I.Ready you'll attach notes. The prompt it builds instructs your AI assistant to write the questions from the material you attach in that chat — then you paste the result back.",
  },
  {
    q: "How do the review rounds work?",
    a: "After the first pass, M.I.Ready re-asks every question you got wrong — and every question that took you more than 1.5× your own average answer time. Review rounds repeat, up to five, until each question is answered correctly at your normal speed. That's when it counts as mastered.",
  },
  {
    q: "What do the results show?",
    a: "More than a score: your mastered count, your average answer time, and the exact questions that needed review — including how many times you've missed each one across every attempt.",
  },
  {
    q: "What format do the questions use?",
    a: "Multiple choice, as JSON: each item has a question, its options, the correct answer and an explanation. The explanation appears right after you answer, so you learn while you drill.",
  },
  {
    q: "Does it work offline?",
    a: "Once the app has loaded, drilling a saved quiz runs entirely in your browser — questions, review rounds and results never touch a server. You only need a connection in your AI chat when generating new questions.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="mx-auto max-w-[980px] px-6 sm:px-8 pb-16">
      <SectionHead title="FAQ" index="03" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.q}
            className="pt-4 border-t-[2.5px] border-foreground"
          >
            <h3 className="font-display font-bold text-[17px] mb-2">
              {item.q}
            </h3>
            <p className="text-[14px] text-muted-foreground leading-[1.5]">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
