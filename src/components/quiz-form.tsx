"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { Quiz } from './quiz';
import type { Question } from '@/lib/quiz-data';

type UserQuestion = {
  question: string;
  option: string[];
  answer: string;
  explanation: string;
};

export function QuizForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseAndStartQuiz = (jsonString: string) => {
    try {
      if (!jsonString.trim()) {
        setError("JSON data cannot be empty.");
        return;
      }
      const data: UserQuestion[] = JSON.parse(jsonString);
      
      if (!Array.isArray(data) || data.length === 0) {
        setError("Invalid JSON format. Expected a non-empty array of questions.");
        return;
      }

      const formattedQuestions = data.map((q, index) => {
        if (!q.question || !q.option || !q.answer || !q.explanation) {
            throw new Error(`Question at index ${index} is missing required fields (question, option, answer, explanation).`);
        }
        if (!Array.isArray(q.option) || q.option.length === 0) {
          throw new Error(`Question "${q.question}" must have at least one option.`);
        }
        return {
          id: index + 1,
          question: q.question,
          options: q.option,
          correctAnswer: q.answer,
          explanation: q.explanation,
        };
      });

      setQuestions(formattedQuestions);
      setError(null);
    } catch (e: any) {
      setError(`Failed to parse JSON: ${e.message}`);
      setQuestions(null);
    }
  };

  const handleStartQuiz = () => {
    parseAndStartQuiz(jsonInput);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonInput(text);
        parseAndStartQuiz(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRestart = () => {
    setQuestions(null);
    setJsonInput('');
    setError(null);
  }

  if (questions) {
    return <Quiz questions={questions} onRestartQuiz={handleRestart} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Quiz</CardTitle>
        <CardDescription>
          Paste your quiz data as JSON below, or upload a JSON file to begin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="json-input">Quiz JSON Data</Label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[{"question": "...", "option": ["..."], "answer": "...", "explanation": "..."}]'
            rows={10}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload JSON File
        </Button>
        <Input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleStartQuiz} disabled={!jsonInput}>
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
