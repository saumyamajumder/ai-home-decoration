"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { roomCategories, type RoomCategoryId } from "@/lib/catalog";
import { loadImage, setPendingUpload } from "@/lib/editor/images";
import { ImageUploader } from "@/components/editor/ImageUploader";
import { RoomCategoryPicker } from "@/components/editor/RoomCategoryPicker";

/** Step 1 of a new design: choose the room type and upload a photo, then open it in the editor. */
export function CreateDesignFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const fromQuery = roomCategories.find((r) => r.id === params.get("room"))?.id;
  const [room, setRoom] = useState<RoomCategoryId>(fromQuery ?? "kitchen");
  const [loading, setLoading] = useState(false);
  const [navigating, startNavigation] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Tied to the navigation itself, so it clears once the editor is shown (this page stays mounted, hidden).
  const opening = loading || navigating;

  const onSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const image = await loadImage(file, file.name);
      setPendingUpload(image, room);
      startNavigation(() => router.push("/editor"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "This file could not be opened.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="mb-3 text-sm font-semibold">1. What kind of room is it?</p>
          <RoomCategoryPicker value={room} onChange={setRoom} />
        </div>
        <div className="relative rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="mb-3 text-sm font-semibold">2. Upload a photo of the room</p>
          <ImageUploader onSelect={onSelect} />
          {error && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {opening && (
            <div role="status" className="absolute inset-0 grid place-items-center rounded-2xl bg-background/70 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="size-4 animate-spin text-primary" />
                Opening the editor…
              </span>
            </div>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
        <p className="font-semibold">What happens next</p>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-muted-foreground">
          <li>Gemini analyses the photo: room type, layout, cabinets, appliances, walls, windows and furniture.</li>
          <li>You describe the changes or pick suggested instructions.</li>
          <li>Generate Design edits your actual photo. Keep adding instructions to refine the result.</li>
        </ol>
      </aside>
    </div>
  );
}
