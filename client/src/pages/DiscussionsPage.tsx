import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DiscussionsPage() {
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);

  const { data: discussions, isLoading: isLoadingDiscussions } = useQuery({
    queryKey: ["/api/discussions"],
  });

  const { data: selectedDiscussion, isLoading: isLoadingDiscussion } = useQuery({
    queryKey: ["/api/discussions", selectedDiscussionId],
    enabled: !!selectedDiscussionId,
  });

  if (isLoadingDiscussions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discussions List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  {discussions?.map((discussion) => (
                    <Card
                      key={discussion.id}
                      className={`cursor-pointer transition-colors ${
                        selectedDiscussionId === discussion.id
                          ? "bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDiscussionId(discussion.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(discussion.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Discussion Content */}
        <div className="md:col-span-2">
          {selectedDiscussion ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedDiscussion.title}</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {selectedDiscussion.content}
                </div>
                
                {/* Comments section would go here */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Comments</h3>
                  {/* Comments list would go here */}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Select a discussion to view its content
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
