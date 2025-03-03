import { TopicCard } from "@/components/TopicCard";
import { topics } from "../../../public/data/topics";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
          Gregging Algorithms
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A journey to understand and master the language of computers, inspired by Grokking Algorithms
          and fueled by a passion for discovery.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Data Structures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics
            .filter((topic) => topic.category === "data-structures")
            .map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics
            .filter((topic) => topic.category === "algorithms")
            .map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
        </div>
      </div>
    </div>
  );
}
