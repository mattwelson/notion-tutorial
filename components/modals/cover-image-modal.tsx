"use client";

import { useCoverImage } from "@/hooks/useCoverImageStore";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { SingleImageDropzone } from "../ui/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

export function CoverImageModal() {
  const update = useMutation(api.documents.update);
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, close, url } = useCoverImage();
  const { edgestore } = useEdgeStore();

  function closeModal() {
    setIsSubmitting(false);
    setFile(undefined);
    close();
  }

  async function handleFileUpload(file?: File) {
    setFile(file);

    if (!file) return;

    setIsSubmitting(true);

    const res = await edgestore.publicFiles.upload({
      file,
      options: {
        replaceTargetUrl: url,
      },
    });

    await update({
      id: params.documentId as Id<"documents">,
      coverImage: res.url,
    });

    closeModal();
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          onChange={handleFileUpload}
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
        />
      </DialogContent>
    </Dialog>
  );
}
