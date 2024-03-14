"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/useSettings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { UserProfile } from "@clerk/clerk-react";

export function SettingsModal() {
  const { isOpen, onClose } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-xs text-muted-foreground">
              Customise how Jotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
        <UserProfile />
      </DialogContent>
    </Dialog>
  );
}
