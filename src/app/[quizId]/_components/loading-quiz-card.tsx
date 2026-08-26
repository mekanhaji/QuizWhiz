import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingQuizCard = () => {
  return (
    <Card className="w-full max-w-md my-4">
      <CardHeader>
        <CardTitle>Loading Quiz...</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Preparing your questions. This will only take a moment.
        </p>
      </CardContent>
    </Card>
  );
};
