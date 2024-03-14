"use client";

import type { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ImageIcon, Smile, X } from "lucide-react";
import { Button } from "./ui/button";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/useCoverImageStore";

export function Toolbar({
  initialData,
  preview,
}: {
  initialData: Doc<"documents">;
  preview?: boolean;
}) {
  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);

  const coverImage = useCoverImage();

  function handleIconChange(icon: string) {
    update({
      id: initialData._id,
      icon,
    });
  }

  function handleRemoveIcon() {
    removeIcon({
      id: initialData._id,
    });
  }

  function enableInput() {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, initialData.title.length);
    }, 0);
  }

  function disableInput() {
    setIsEditing(false);
  }

  function onInput(title: string) {
    setTitle(title);
    update({
      id: initialData._id,
      title: title !== "" ? title : "Untitled",
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  }

  return (
    <div className="pl-14 group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={handleIconChange}>
            <p className="text-6xl hover:opacity-75 transition-opacity">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity text-muted-foreground text-xs"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={handleIconChange} asChild>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" /> Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={coverImage.open}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
}
