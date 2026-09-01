import type { Metadata } from "next";

/**
 * Quiz data here lives only in the visitor's own browser (localStorage /
 * sessionStorage) — a crawler can never see anything but a "quiz not found"
 * state, so this route is noindexed rather than given a canonical.
 */
export const metadata: Metadata = {
  title: "Quiz",
  robots: {
    index: false,
    follow: true,
  },
};

export default function QuizRunnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
