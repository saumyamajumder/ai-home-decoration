"use client";

import { useId, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComparisonImage {
  src: string;
  alt: string;
  /** Optional CSS classes for this image, e.g. filters for an illustrative "before". */
  className?: string;
}

interface ImageComparisonProps {
  before: ComparisonImage;
  after: ComparisonImage;
  beforeLabel?: string;
  afterLabel?: string;
  /** Initial divider position, 0–100. */
  initial?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Width / height. Defaults to 4:3 via CSS. */
  aspectRatio?: number;
  /** "contain" keeps the whole photo visible (for user uploads). */
  fit?: "cover" | "contain";
  /** Required for blob:/data: URLs (uploaded or generated images). */
  unoptimized?: boolean;
}

/**
 * Before/after slider. A native range input sits on top of the images, so it is
 * keyboard-accessible (arrow keys, Home/End) and works with mouse and touch.
 */
export function ImageComparison({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  aspectRatio,
  fit = "cover",
  unoptimized,
}: ImageComparisonProps) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const [position, setPosition] = useState(initial);
  const dragging = useRef(false);
  const id = useId();

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  return (
    <div
      className={cn(
        "group/compare relative isolate cursor-ew-resize aspect-4/3 w-full touch-pan-y overflow-hidden rounded-2xl bg-muted select-none",
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (dragging.current) updateFromPointer(event);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {/* After (full) */}
      <Image
        src={after.src}
        alt={after.alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={cn(fitClass, after.className)}
        draggable={false}
      />

      {/* Before (clipped to the left of the divider) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden
      >
        <Image
          src={before.src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={unoptimized}
          className={cn(fitClass, before.className)}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-brand-gradient px-2.5 py-1 text-xs font-medium text-white">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-lift ring-4 ring-white/30 transition-transform group-has-[input:focus-visible]/compare:ring-primary/60 group-active/compare:scale-95">
          <MoveHorizontal className="size-4.5 text-neutral-800" />
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Compare {beforeLabel.toLowerCase()} and {afterLabel.toLowerCase()} images. {before.alt}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full appearance-none opacity-0"
      />
    </div>
  );
}
