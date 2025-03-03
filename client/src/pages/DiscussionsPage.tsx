import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertDiscussionSchema } from "@shared/schema";

export default function DiscussionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: discussions, isLoading: isLoadingDiscussions } = useQuery({
    queryKey: ["/api/discussions"],
  });

  const { data: selectedDiscussion, isLoading: isLoadingDiscussion } = useQuery({
    queryKey: ["/api/discussions", selectedDiscussionId],
    enabled: !!selectedDiscussionId,
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/discussions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully.",
      });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ discussionId, content }: { discussionId: number; content: string }) => {
      const res = await apiRequest("POST", `/api/discussions/${discussionId}/comments`, { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions", selectedDiscussionId] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const commentForm = useForm({
    defaultValues: {
      content: "",
    },
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Discussions</CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((data) => createDiscussionMutation.mutate(data))}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Discussion title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your discussion here..."
                                className="min-h-[200px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={createDiscussionMutation.isPending}
                      >
                        {createDiscussionMutation.isPending
                          ? "Creating discussion..."
                          : "Create Discussion"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
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

                {/* Comments section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Comments</h3>
                  <div className="space-y-4">
                    {selectedDiscussion.comments?.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <p>{comment.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <img
                              src={comment.author.profile?.avatarUrl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{comment.author.profile?.displayName || comment.author.username}</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Add comment form */}
                  <Form {...commentForm}>
                    <form
                      onSubmit={commentForm.handleSubmit((data) =>
                        createCommentMutation.mutate({
                          discussionId: selectedDiscussion.id,
                          content: data.content,
                        })
                      )}
                      className="mt-4"
                    >
                      <FormField
                        control={commentForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Write a comment..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="mt-2"
                        disabled={createCommentMutation.isPending}
                      >
                        {createCommentMutation.isPending
                          ? "Adding comment..."
                          : "Add Comment"}
                      </Button>
                    </form>
                  </Form>
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