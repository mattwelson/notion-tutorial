import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImageStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";

export function CoverImage({
  url,
  preview,
}: {
  url?: string;
  preview?: boolean;
}) {
  const { replace } = useCoverImage();
  const { edgestore } = useEdgeStore();
  const removeImage = useMutation(api.documents.removeImage);
  const params = useParams();

  async function handleRemoveImage() {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
    removeImage({
      id: params.documentId as Id<"documents">,
    });
  }

  return (
    <div
      className={cn("relative w-full h-1/3 group", {
        "h-[12vh]": !url,
        "bg-muted": !!url,
      })}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => replace(url)}
            variant="outline"
            className="text-muted-foreground text-xs"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Change cover
          </Button>
          <Button
            onClick={handleRemoveImage}
            variant="outline"
            className="text-muted-foreground text-xs"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
}

CoverImage.Skeleton = function CoverImageSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
