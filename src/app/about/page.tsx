import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SectionHead, StickerBtn } from "@/app/_components/sticker-primitives";
import { buildPageMetadata } from "@/lib/site-config";
import { aboutPage } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "What M.I.Ready is: a free, browser-only MCQ drilling app where your own AI assistant writes the questions and adaptive review rounds re-ask what you miss until you master it.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="w-full max-w-2xl pb-12">
      <JsonLd data={aboutPage} />

      <h1 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.15] tracking-tight mt-6 mb-4">
        About M.I.Ready
      </h1>
      <p className="text-[16px] leading-[1.6] text-muted-foreground mb-10">
        M.I.Ready is a free multiple-choice quiz app for people cramming for
        a test. Your own AI assistant writes the questions; M.I.Ready turns
        them into a drill that keeps re-asking whatever you haven&apos;t
        mastered. No account, no server, nothing to install — your quizzes
        live in your browser.
      </p>

      <SectionHead title="Why bring your own AI" index="01" />
      <p className="text-[15px] leading-[1.6] text-muted-foreground mb-10">
        M.I.Ready doesn&apos;t ship a model of its own, and it doesn&apos;t
        charge you for API calls. Instead it builds a precise prompt from
        your topics, question count, difficulty and language, and opens it
        in ChatGPT, Claude, Le Chat or Perplexity. You paste the JSON that
        comes back — or upload it as a file — and start drilling. You can
        also attach your own notes in that chat, so the questions come from
        your actual course material instead of generic filler.
      </p>

      <SectionHead title="How the adaptive review works" index="02" />
      <p className="text-[15px] leading-[1.6] text-muted-foreground mb-10">
        During a quiz, M.I.Ready tracks two things per question: whether you
        answered correctly, and how long you took compared to your own
        running average. Anything wrong — or slower than 1.5× your average
        — comes back in a review round. Rounds repeat until every question
        is mastered, capped at five. After each answer you see the
        explanation, and results show your mastered count, average answer
        time, and how often you&apos;ve missed each question all-time.
      </p>

      <SectionHead title="Private by default" index="03" />
      <p className="text-[15px] leading-[1.6] text-muted-foreground mb-10">
        Quizzes are stored only in your browser&apos;s local storage — never
        on a server, and never shared between devices. Nothing about your
        quiz content is sent to analytics. Clearing your browser data
        removes it for good.
      </p>

      <StickerBtn href="/quiz/new" variant="primary">
        Build your first quiz
      </StickerBtn>
    </div>
  );
}
