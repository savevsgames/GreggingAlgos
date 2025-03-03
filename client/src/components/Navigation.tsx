import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Data Structures", href: "/#data-structures" },
    { name: "Algorithms", href: "/#algorithms" },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Gregging Algorithms
          </Link>

          {isMobile ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex gap-8">
              <NavLinks />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}