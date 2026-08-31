import Link from "next/link";
import {
  BrandLockup,
  SectionHead,
  StickerBtn,
} from "@/app/_components/sticker-primitives";
import { FaqSection } from "@/app/_components/faq-section";

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className="bg-background relative z-10">
        <div className="mx-auto max-w-[980px] px-6 sm:px-8 flex items-center justify-between py-6">
          <BrandLockup />
          {/* single CTA link — matches the mockup minimal nav */}
          <Link
            href="/quiz"
            className="font-code text-[13px] border-b border-foreground pb-0.5 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open app
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[980px] px-6 sm:px-8 pt-1 pb-16">
        {/* exam-sheet field row */}
        <div className="flex flex-wrap gap-x-8 gap-y-1 font-code text-[12.5px] text-muted-foreground pb-8">
          <span>
            SUBJECT:{" "}
            <span className="text-foreground font-medium border-b border-muted-foreground/40 pb-px">
              Everything you&apos;re studying
            </span>
          </span>
          <span>
            FORMAT:{" "}
            <span className="text-foreground font-medium border-b border-muted-foreground/40 pb-px">
              multiple choice, with explanations
            </span>
          </span>
          <span>
            STATUS:{" "}
            <span className="text-foreground font-medium border-b border-muted-foreground/40 pb-px">
              not ready yet
            </span>
          </span>
        </div>

        {/* two-column hero grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          {/* left — copy */}
          <div className="animate-[rise_0.7s_ease-out_0.1s_both]">
            <h1 className="font-display font-bold text-[52px] sm:text-[64px] leading-[1.03] tracking-tight mb-6">
              Grind smarter,
              <br />
              not{" "}
              <em className="font-display not-italic text-primary">harder</em>.
            </h1>
            <p className="text-[17px] leading-[1.6] text-muted-foreground max-w-[46ch] mb-8">
              Have your AI assistant write the questions, paste them in, and
              drill. M.I.Ready keeps re-asking whatever you got wrong — or
              answered too slowly — until it sticks.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <StickerBtn href="/quiz/new" variant="primary">
                Build your first quiz
              </StickerBtn>
              <span className="font-code text-[12.5px] text-muted-foreground">
                no account — it all stays in your browser
              </span>
            </div>
          </div>

          {/* right — demo question card */}
          <div
            className="rotate-[1.2deg] animate-[rise_0.8s_ease-out_0.35s_both] relative bg-muted border-[3px] border-foreground p-6 shadow-[8px_8px_0_hsl(var(--foreground))]"
            aria-hidden="true"
          >
            {/* sticky-tape highlight */}
            <span className="absolute -top-3 left-6 w-11 h-4 bg-accent/75 rotate-[-3deg] rounded-sm" />

            <p className="font-code text-[11.5px] text-muted-foreground mb-3">
              ROUND 2 — REVIEWING QUESTION 4 OF 12
            </p>
            <p className="font-display font-bold text-[18px] leading-[1.35] mb-4">
              Which organelle is responsible for producing most of a cell&apos;s
              ATP?
            </p>

            {/* options */}
            {[
              { label: "Golgi apparatus", correct: false },
              { label: "Mitochondrion", correct: true },
              { label: "Ribosome", correct: false },
              { label: "Nucleus", correct: false },
            ].map((opt) => (
              <div
                key={opt.label}
                className={`flex items-center gap-3 text-[14.5px] py-[6px] ${
                  opt.correct
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span
                  className={`relative w-5 h-5 rounded-full border-[1.5px] flex-shrink-0 ${
                    opt.correct
                      ? "border-primary after:absolute after:inset-[-6px] after:border-2 after:border-primary after:rounded-full after:rotate-[-8deg] after:scale-x-[1.15] after:scale-y-[0.95]"
                      : "border-muted-foreground/50"
                  }`}
                />
                {opt.label}
              </div>
            ))}

            <div className="mt-4 pt-3 border-t border-dashed border-muted-foreground/30">
              <p className="font-code text-[11px] uppercase tracking-[0.06em] text-primary mb-1">
                Explanation
              </p>
              <p className="text-[13px] leading-[1.5] text-muted-foreground">
                Mitochondria generate most of the cell&apos;s ATP through
                oxidative phosphorylation.
              </p>
              <p className="font-code text-[11.5px] text-muted-foreground mt-3">
                next in 15s — or skip ahead yourself
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── WHAT IT DOES ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[980px] px-6 sm:px-8 pb-16">
        <SectionHead title="What it does" index="01" />

        {/* rubric grid — 3 cols with 1px gap rule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
          {[
            {
              num: "01",
              title: "Turns any AI assistant into your question bank",
              body: "Set the topics, count, difficulty and language. M.I.Ready writes the prompt and opens it in ChatGPT, Claude, Le Chat or Perplexity — you paste the questions back in, or upload the file.",
            },
            {
              num: "02",
              title: "Re-asks what you haven't mastered",
              body: "Miss a question — or take far longer on it than your own average — and it comes back in a review round. Rounds keep running until every question lands right, and fast.",
            },
            {
              num: "03",
              title: "Results that name what you missed",
              body: "Not just a percentage. Mastered count, average answer time, and the exact questions that needed another look — including how many times you've missed them all-time.",
            },
          ].map((item) => (
            <div key={item.num} className="bg-background px-6 py-7">
              <p className="font-code text-[12px] text-primary mb-4">
                {item.num}
              </p>
              <h3 className="font-display font-bold text-[19px] leading-[1.25] mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[980px] px-6 sm:px-8 pb-16">
        <SectionHead title="How it works" index="02" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          {[
            {
              step: "Step 1",
              title: "Generate the questions",
              body: "Tell M.I.Ready your topics and how many questions you want. It builds the prompt — copy it, or open it straight in your AI assistant.",
            },
            {
              step: "Step 2",
              title: "Paste it back and save",
              body: "Drop the returned JSON into the editor or upload the file, give the quiz a name, and it is saved to this browser.",
            },
            {
              step: "Step 3",
              title: "Drill, explain, repeat",
              body: "Answer, read the explanation, and let the review rounds bring back everything you missed or answered slowly.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="pt-4 border-t-[2.5px] border-foreground"
            >
              <p className="font-code text-[11.5px] text-muted-foreground uppercase tracking-[0.04em] mb-2">
                {item.step}
              </p>
              <h3 className="font-display font-bold text-[17px] mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] text-muted-foreground leading-[1.5]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────────────── */}
      <div className="bg-foreground text-background py-14">
        <div className="mx-auto max-w-[980px] px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              num: "0",
              highlight: true,
              label:
                "accounts, servers or sign-ups — your quizzes live in this browser",
            },
            {
              num: "4",
              highlight: false,
              label:
                "AI assistants wired in — ChatGPT, Claude, Le Chat, Perplexity",
            },
            {
              num: "∞",
              highlight: false,
              label:
                "retakes — restart any saved quiz as many times as it takes",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-l border-background/25 pl-5"
            >
              <p className="font-display font-bold text-[44px] leading-none mb-2">
                <span className={stat.highlight ? "text-accent" : ""}>
                  {stat.num}
                </span>
              </p>
              <p className="font-code text-[12.5px] text-background/65 leading-[1.4]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── CLOSING CTA + FOOTER ────────────────────────────────────── */}
      <section className="mx-auto max-w-[980px] px-6 sm:px-8">
        <div className="pt-16 pb-8">
          <h2 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.12] tracking-tight max-w-[18ch] mb-7">
            Stop guessing what to study. Find out.
          </h2>
          <StickerBtn href="/quiz/new" variant="primary">
            Build your first quiz
          </StickerBtn>
        </div>

        <footer className="border-t border-muted py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <BrandLockup markClassName="h-5" wordClassName="text-[15px]" />
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="font-code text-[12px] text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              About
            </Link>
            <span className="font-code text-[12px] text-muted-foreground">
              built for the night before the test
            </span>
          </div>
        </footer>
      </section>
    </div>
  );
}
