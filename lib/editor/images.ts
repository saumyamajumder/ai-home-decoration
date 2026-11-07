import type { RoomCategoryId } from "@/lib/catalog";

/** An image held in the browser (object URL) with its natural size. */
export interface LoadedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  name: string;
}

export function loadImage(blob: Blob, name = "room-photo"): Promise<LoadedImage> {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ blob, url, width: img.naturalWidth, height: img.naturalHeight, name });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file isn’t a valid image. Use a JPG, PNG or WebP photo."));
    };
    img.src = url;
  });
}

/**
 * Hand-off from the Create page to the editor during client-side navigation.
 * Lives in memory only (a full reload clears it).
 */
export interface PendingUpload {
  image: LoadedImage;
  roomCategory: RoomCategoryId;
}

let pending: PendingUpload | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function setPendingUpload(image: LoadedImage, roomCategory: RoomCategoryId) {
  pending = { image, roomCategory };
  emit();
}

/** Idempotent read (safe under React Strict Mode double rendering). */
export function peekPendingUpload(): PendingUpload | null {
  return pending;
}

export function clearPendingUpload() {
  if (!pending) return;
  pending = null;
  emit();
}

/**
 * For useSyncExternalStore. Next keeps visited pages mounted (hidden) with Cache
 * Components, so an editor that is already mounted must react to a new hand-off.
 */
export function subscribePendingUpload(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
