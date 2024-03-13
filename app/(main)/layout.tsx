"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Navigation } from "./_components";
import { SearchCommand } from "@/components/search-command";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="icon" />
      </div>
    );

  if (!isAuthenticated) return redirect("/");

  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        {children}
        <SearchCommand />
      </main>
    </div>
  );
}
