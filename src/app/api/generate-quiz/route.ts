import { generateQuiz } from "@/lib/ai-clients/groq.client";
// import { generateQuiz } from "@/lib/ai-clients/mistral.client";
import type { McqPromptConfig } from "@/lib/mcq-prompt";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body: Partial<McqPromptConfig> = await request.json().catch(() => ({}));

  try {
    const questions = await generateQuiz(body);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("generate-quiz failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate quiz.",
      },
      { status: 500 },
    );
  }
}
