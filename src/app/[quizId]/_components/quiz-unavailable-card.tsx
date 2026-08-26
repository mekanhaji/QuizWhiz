import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const QuizUnavailableCard = ({
  error,
  handleReturnHome,
}: {
  error: string | null;
  handleReturnHome: () => void;
}) => {
  return (
    <Card className="w-full max-w-md my-4">
      <CardHeader>
        <CardTitle>Quiz Unavailable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {error ?? "We couldn't load this quiz. Please try again."}
          </AlertDescription>
        </Alert>
        <Button onClick={handleReturnHome}>Back to Saved Quizzes</Button>
      </CardContent>
    </Card>
  );
};
