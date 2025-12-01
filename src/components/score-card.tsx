"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

type ScoreCardProps = {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
};

export function ScoreCard({ score, totalQuestions, onRestart }: ScoreCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! You're a true QuizWhiz!";
    if (percentage >= 80) return "Great job! You really know your stuff.";
    if (percentage >= 60) return "Good effort! A little more practice and you'll be an expert.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "Keep trying! Every master was once a beginner.";
  };

  return (
    <Card className="w-full text-center animate-in zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline">Quiz Complete!</CardTitle>
        <CardDescription>{getFeedback()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-muted-foreground">You scored</p>
            <p className="text-6xl font-bold text-primary">{score}<span className="text-2xl text-muted-foreground">/{totalQuestions}</span></p>
        </div>
        <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl font-bold text-accent">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Correct</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}
