import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1f1f1f]">
      <Logo />
      <div className="md:ml-auto w-full flex justify-between md:justify-end items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </footer>
  );
}
