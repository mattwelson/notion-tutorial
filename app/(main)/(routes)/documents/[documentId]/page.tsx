"use client";

import { Toolbar } from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function DocumentPage({
  params: { documentId },
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getById, {
    id: documentId,
  });

  if (document === undefined) return <p>Loading...</p>;
  if (document === null) return <p>Not found</p>;

  return (
    <div className="pb-40 h-full">
      <div className="h-1/3" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
}
