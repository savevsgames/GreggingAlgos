import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatDrawerProps {
  editorContent: string;
}

export function AIChatDrawer({ editorContent }: AIChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content }]);

      const response = await apiRequest("POST", "/api/chat", { message: content });
      const data = await response.json();

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainCode = () => {
    const message = `Can you explain this code to me:\n\n${editorContent}`;
    sendMessage(message);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed right-4 bottom-4">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Code Explanation</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Button 
            onClick={handleExplainCode} 
            disabled={isLoading || !editorContent}
            className="w-full"
          >
            Explain Current Code
          </Button>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-primary/10 ml-4"
                      : "bg-muted mr-4"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {message.content}
                  </pre>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
