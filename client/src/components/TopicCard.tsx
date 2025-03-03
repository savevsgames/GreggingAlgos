import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "../../../public/data/topics";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const { user } = useAuth();
  const { data: score } = useQuery({
    queryKey: [`/api/tests/${topic.slug}/scores`],
    enabled: !!user,
  });

  return (
    <Link href={`/topic/${topic.slug}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className={`${
          topic.category === "data-structures" 
            ? "bg-blue-50" 
            : "bg-green-50"
        } p-4`}>
          <h3 className="text-xl font-semibold">{topic.title}</h3>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-muted-foreground line-clamp-3 mb-4">{topic.description}</p>
          {user && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{score ? `${score}%` : 'Not started'}</span>
              </div>
              <Progress value={score || 0} />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}