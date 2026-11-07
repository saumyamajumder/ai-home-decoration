"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Columns2, Download, Expand, Image as ImageIcon, Minimize, SplitSquareHorizontal, Sparkles, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ImageComparison } from "@/components/editor/ImageComparison";

export type ViewMode = "slider" | "side" | "original" | "modified";

interface ViewerImage {
  url: string;
  width: number;
  height: number;
}

interface ResultViewerProps {
  original: ViewerImage;
  modified: ViewerImage | null;
  /** Label for the modified image, e.g. "Version 2". */
  modifiedLabel?: string;
  onDownload?: () => void;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3];

const modes: { id: ViewMode; label: string; icon: typeof Columns2; needsResult: boolean }[] = [
  { id: "slider", label: "Slider", icon: SplitSquareHorizontal, needsResult: true },
  { id: "side", label: "Side by side", icon: Columns2, needsResult: true },
  { id: "original", label: "Original", icon: ImageIcon, needsResult: false },
  { id: "modified", label: "Modified", icon: Sparkles, needsResult: true },
];

/** Before/after viewer: slider, side-by-side, single views with zoom, fullscreen and download. */
export function ResultViewer({ original, modified, modifiedLabel = "Modified", onDownload }: ResultViewerProps) {
  const [mode, setMode] = useState<ViewMode>(modified ? "slider" : "original");
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Jump to the comparison when a new result arrives; fall back to the original when it is removed.
  const [lastModified, setLastModified] = useState(modified?.url);
  if (modified?.url !== lastModified) {
    setLastModified(modified?.url);
    setMode(modified ? "slider" : "original");
    setZoom(1);
  }

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.();
  };

  const zoomable = mode !== "slider";
  const aspect = original.width / original.height;

  const single = (img: ViewerImage, label: string, alt: string) => (
    <figure className="relative min-w-0 flex-1">
      <div className={cn("overflow-auto rounded-xl bg-muted", fullscreen ? "h-full" : "")} style={fullscreen ? undefined : { aspectRatio: aspect }}>
        <div className="relative h-full" style={{ width: `${zoom * 100}%`, aspectRatio: fullscreen ? undefined : aspect }}>
          <Image src={img.url} alt={alt} fill unoptimized sizes="100vw" className="object-contain" draggable={false} />
        </div>
      </div>
      <figcaption className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {label}
      </figcaption>
    </figure>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="View" className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {modes.map(({ id, label, icon: Icon, needsResult }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              disabled={needsResult && !modified}
              onClick={() => {
                setMode(id);
                setZoom(1);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40",
                mode === id ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={!zoomable || zoom === ZOOM_LEVELS[0]}
            onClick={() => setZoom(ZOOM_LEVELS[Math.max(0, ZOOM_LEVELS.indexOf(zoom) - 1)])}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ZoomOut />
          </button>
          <span className="w-10 text-center text-xs tabular-nums text-muted-foreground" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            aria-label="Zoom in"
            title="Zoom in"
            disabled={!zoomable || zoom === ZOOM_LEVELS.at(-1)}
            onClick={() => setZoom(ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, ZOOM_LEVELS.indexOf(zoom) + 1)])}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ZoomIn />
          </button>
          <button
            type="button"
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={toggleFullscreen}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            {fullscreen ? <Minimize /> : <Expand />}
          </button>
          {onDownload && modified && (
            <button type="button" onClick={onDownload} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-1 rounded-lg")}>
              <Download data-icon="inline-start" />
              Download
            </button>
          )}
        </div>
      </div>

      <div
        ref={frameRef}
        className={cn(fullscreen && "flex items-center justify-center bg-black p-4 [&_figure]:h-full")}
      >
        {mode === "slider" && modified ? (
          <ImageComparison
            before={{ src: original.url, alt: "Original room photo" }}
            after={{ src: modified.url, alt: `${modifiedLabel} of the room` }}
            beforeLabel="Original"
            afterLabel={modifiedLabel}
            aspectRatio={aspect}
            fit="contain"
            unoptimized
            className={cn("rounded-xl", fullscreen && "max-h-full w-auto max-w-full")}
          />
        ) : mode === "side" && modified ? (
          <div className={cn("flex flex-col gap-3 sm:flex-row", fullscreen && "h-full w-full")}>
            {single(original, "Original", "Original room photo")}
            {single(modified, modifiedLabel, `${modifiedLabel} of the room`)}
          </div>
        ) : mode === "modified" && modified ? (
          <div className={cn("flex", fullscreen && "h-full w-full")}>{single(modified, modifiedLabel, `${modifiedLabel} of the room`)}</div>
        ) : (
          <div className={cn("flex", fullscreen && "h-full w-full")}>{single(original, "Original", "Original room photo")}</div>
        )}
      </div>
    </div>
  );
}
