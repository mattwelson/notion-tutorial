"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { produce } from "immer";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

export function DocumentList({
  parentDocument,
  level = 0,
}: {
  parentDocument?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}) {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function onExpand(documentId: string) {
    setExpanded(
      produce((current) => {
        current[documentId] = !current[documentId];
      })
    );
  }

  const documents = useQuery(api.documents.getSidebar, { parentDocument });

  function onRedirect(documentId: string) {
    router.push(`/documents/${documentId}`);
  }

  if (documents === undefined)
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );

  return (
    <>
      <p
        style={{
          paddingLeft: `${level * 12 + 25}px`,
        }}
        className={cn("hidden text-sm font-medium text-muted-foreground/80", {
          "last:block": expanded,
          hidden: level === 0,
        })}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            label={document.title}
            onClick={() => onRedirect(document._id)}
            onExpand={() => onExpand(document._id)}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            expanded={expanded[document._id]}
            level={level}
          />
          {expanded[document._id] && (
            <DocumentList parentDocument={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}
