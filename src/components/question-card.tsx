"use client";

import type { Question } from "@/lib/quiz-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";

type QuestionCardProps = {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isAnswered: boolean;
  correctAnswer: string;
};

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  isAnswered,
  correctAnswer,
}: QuestionCardProps) {
  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return selectedAnswer === option
        ? "border-primary ring-2 ring-primary/50 bg-primary/5"
        : "border-border hover:bg-accent/50";
    }

    const isCorrect = option === correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return "border-success bg-success/10 text-success-foreground ring-2 ring-success";
    }
    if (isSelected && !isCorrect) {
      return "border-destructive bg-destructive/10 ring-2 ring-destructive";
    }
    return "border-border";
  };
  
  const getIcon = (option: string) => {
    if (!isAnswered) return null;

    const isCorrect = option === correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) return <CheckCircle className="h-5 w-5 text-success" />;
    if (isSelected && !isCorrect) return <XCircle className="h-5 w-5 text-destructive" />;
    
    return null;
  }

  return (
    <Card className="w-full animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-xl md:text-2xl">{question.question}</CardTitle>
        <CardDescription>Select one of the options below.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ""}
          onValueChange={onSelectAnswer}
          disabled={isAnswered}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${question.id}-${index}`}
              className={cn(
                "flex items-center justify-between space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                getOptionStyle(option)
              )}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value={option} id={`option-${question.id}-${index}`} className="text-primary" />
                <span className="text-base font-medium">{option}</span>
              </div>
              {getIcon(option)}
            </Label>
          ))}
        </RadioGroup>
        {isAnswered && (
          <div className="mt-6 rounded-lg border bg-card p-4 animate-in fade-in duration-500">
            <h3 className="font-bold text-lg text-primary">Explanation</h3>
            <p className="text-muted-foreground mt-2">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuestionCardSkeleton() {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }
