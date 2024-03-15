"use client";

import dynamic from "next/dynamic";
import { CoverImage } from "@/components/cover-image";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useMemo } from "react";

export default function DocumentPage({
  params: { documentId },
}: {
  params: { documentId: Id<"documents"> };
}) {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const document = useQuery(api.documents.getById, {
    id: documentId,
  });

  if (document === undefined)
    return (
      <div className="pb-40 h-full">
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto lg: mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  if (document === null) return <p>Not found</p>;

  return (
    <div className="pb-40 h-full">
      <CoverImage url={document.coverImage} preview />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} preview />
        <Editor initialData={document.content} preview onChange={() => {}} />
      </div>
    </div>
  );
}
