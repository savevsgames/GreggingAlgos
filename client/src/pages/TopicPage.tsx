import { useRoute } from "wouter";
import { topics } from "../../../public/data/topics";
import { ShareButton } from "@/components/ShareButton";
import { Card, CardContent } from "@/components/ui/card";

export default function TopicPage() {
  const [, params] = useRoute("/topic/:slug");
  const topic = topics.find((t) => t.slug === params?.slug);

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  topic.category === "data-structures" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {topic.category === "data-structures" ? "Data Structure" : "Algorithm"}
                </span>
              </div>
            </div>
            <ShareButton />
          </div>
          <p className="text-muted-foreground">{topic.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        </CardContent>
      </Card>
    </div>
  );
}
