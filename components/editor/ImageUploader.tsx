"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { ImageUp, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/uploads/limits";

interface ImageUploaderProps {
  onSelect: (file: File) => void;
  className?: string;
}

/** Checks type and size in the browser for instant feedback (the server checks again). */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_BYTES) return `This image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.`;
  return null;
}

/** Drag-and-drop or click/tap to choose a room photo. */
export function ImageUploader({ onSelect, className }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    setError(problem);
    if (!problem) onSelect(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex aspect-4/3 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors",
          "has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
          dragging ? "border-primary bg-secondary" : "border-border bg-muted/40 hover:border-primary/50 hover:bg-secondary/50",
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
          <ImageUp className="size-6" />
        </span>
        <span>
          <span className="block text-base font-semibold">
            <span className="hidden sm:inline">Drag & drop your room photo, or </span>
            <span className="text-primary sm:underline sm:underline-offset-4">choose a photo</span>
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">JPG, PNG or WebP · up to 10 MB</span>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          aria-label="Upload room photo"
          onChange={(event) => {
            accept(event.target.files?.[0]);
            event.target.value = ""; // allow choosing the same file again
          }}
        />
      </label>
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
