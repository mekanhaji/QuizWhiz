"use client";

import { useState, useEffect, useMemo } from 'react';
import { quizQuestions, type Question } from '@/lib/quiz-data';
import { QuestionCard, QuestionCardSkeleton } from '@/components/question-card';
import { ScoreCard } from '@/components/score-card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Shuffle questions on component mount on the client-side to avoid hydration mismatch
    const shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
  }, []);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progressValue = useMemo(() => questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0, [currentQuestionIndex, questions.length]);


  const handleSelectAnswer = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    const shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <QuestionCardSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return <ScoreCard score={score} totalQuestions={questions.length} onRestart={handleRestart} />;
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm font-semibold text-primary">{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
      <QuestionCard
        key={currentQuestionIndex}
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        isAnswered={isAnswered}
        correctAnswer={currentQuestion.correctAnswer}
      />
      <div className="mt-6 flex justify-end px-4 pb-4">
        {isAnswered ? (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === questions.length - 1 ? 'Show Results' : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
            Submit Answer
          </Button>
        )}
      </div>
    </div>
  );
}
