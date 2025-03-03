import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function ShareButton() {
  const { toast } = useToast();

  const shareUrl = window.location.href;

  const shareOptions = [
    {
      name: "Copy Link",
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
          description: "Link copied to clipboard!",
        });
      },
    },
    {
      name: "Share on Twitter",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=Check out this awesome algorithm/data structure explanation!`,
          "_blank"
        );
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={option.action}
            className="cursor-pointer"
          >
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
