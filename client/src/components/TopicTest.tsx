import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Question {
  id: number;
  questionText: string;
  correctAnswer: string;
  explanation: string;
}

interface TopicTestProps {
  topicSlug: string;
}

export function TopicTest({ topicSlug }: TopicTestProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const { data: questions } = useQuery({
    queryKey: [`/api/tests/${topicSlug}/questions`],
  });

  const submitScoreMutation = useMutation({
    mutationFn: async (score: number) => {
      if (!user) return;
      await apiRequest("POST", `/api/tests/${topicSlug}/scores`, { score });
    },
    onSuccess: () => {
      toast({
        title: "Progress saved!",
        description: "Your test results have been recorded.",
      });
    },
  });

  const handleSubmit = () => {
    if (!questions) return;

    const correctAnswers = questions.reduce((count, q) => {
      return count + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (user) {
      submitScoreMutation.mutate(finalScore);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No test available for this topic yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question: Question) => (
          <div key={question.id} className="space-y-4">
            <h3 className="font-medium">{question.questionText}</h3>
            <RadioGroup
              value={answers[question.id]}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            >
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>Option {option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        {showResults ? (
          <div className="space-y-4">
            <div className="text-lg font-semibold">
              Your Score: {score}%
            </div>
            {!user && score > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Save Your Progress</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create an Account</DialogTitle>
                    <DialogDescription>
                      Sign up to save your progress and track your learning journey!
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    onClick={() => window.location.href = '/auth'}
                    className="w-full"
                  >
                    Sign Up Now
                  </Button>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit Test
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
