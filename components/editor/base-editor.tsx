"use client";

import type { PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { useEdgeStore } from "@/lib/edgestore";

export function BaseEditor({
  onChange,
  initialData,
  preview,
}: {
  onChange: (value: string) => void;
  initialData?: string;
  preview?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const editor = useCreateBlockNote({
    initialContent: initialData
      ? (JSON.parse(initialData) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  async function handleUpload(file: File) {
    const response = await edgestore.publicFiles.upload({ file });

    return response.url;
  }

  function handleChange() {
    onChange(JSON.stringify(editor.document, null, 2));
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={!preview}
        onChange={handleChange}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        imageToolbar
      />
    </div>
  );
}
