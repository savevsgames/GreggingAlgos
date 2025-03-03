import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "../../../public/data/topics";
import { Link } from "wouter";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
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
          <p className="text-muted-foreground line-clamp-3">{topic.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
