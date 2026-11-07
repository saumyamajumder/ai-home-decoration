"use client";

import { Loader2, RotateCw, ScanSearch, TriangleAlert } from "lucide-react";

import { roomCategories, type RoomCategoryId } from "@/lib/catalog";
import { ROOM_ELEMENT_KEYS, type RoomAnalysis } from "@/lib/ai/room-analysis";
import { cn } from "@/lib/utils";

export type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; analysis: RoomAnalysis; model: string }
  | { status: "error"; message: string };

interface AnalysisCardProps {
  state: AnalysisState;
  roomCategory: RoomCategoryId;
  onUseRoom: (room: RoomCategoryId) => void;
  onRetry: () => void;
}

const elementLabel = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

/** Shows Gemini's analysis of the uploaded photo. */
export function AnalysisCard({ state, roomCategory, onUseRoom, onRetry }: AnalysisCardProps) {
  if (state.status === "idle") return null;

  return (
    <section aria-label="Photo analysis" aria-live="polite" className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ScanSearch className="size-4 text-primary" />
        Photo analysis
        {state.status === "done" && <span className="ml-auto text-xs font-normal text-muted-foreground">by {state.model}</span>}
      </div>

      {state.status === "loading" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Gemini is analysing your photo…
        </p>
      )}

      {state.status === "error" && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </p>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <RotateCw className="size-3.5" />
            Retry analysis
          </button>
        </div>
      )}

      {state.status === "done" && <AnalysisDetails analysis={state.analysis} roomCategory={roomCategory} onUseRoom={onUseRoom} />}
    </section>
  );
}

function AnalysisDetails({ analysis, roomCategory, onUseRoom }: { analysis: RoomAnalysis; roomCategory: RoomCategoryId; onUseRoom: (room: RoomCategoryId) => void }) {
  const detected = roomCategories.find((r) => r.id === analysis.roomType);
  const present = ROOM_ELEMENT_KEYS.filter((key) => analysis.elements[key].present);

  return (
    <div className="mt-3 space-y-3 text-sm">
      <p className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {detected?.name ?? "Unrecognised room"} · {Math.round(analysis.confidence * 100)}%
        </span>
        {analysis.layout.type && <span className="text-xs text-muted-foreground">Layout: {analysis.layout.type}</span>}
        {detected && detected.id !== roomCategory && (
          <button type="button" onClick={() => onUseRoom(detected.id)} className="text-xs font-medium text-primary hover:underline">
            Switch room to {detected.name}
          </button>
        )}
      </p>
      <p className="leading-relaxed text-muted-foreground">{analysis.summary}</p>

      <details className="group rounded-xl border border-border bg-background">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium select-none marker:hidden">
          <span className="text-primary group-open:hidden">Show detected elements ({present.length + analysis.furniture.length})</span>
          <span className="hidden text-primary group-open:inline">Hide detected elements</span>
        </summary>
        <dl className="grid gap-x-4 gap-y-2 border-t border-border px-3 py-3 text-xs sm:grid-cols-2">
          {ROOM_ELEMENT_KEYS.map((key) => {
            const el = analysis.elements[key];
            return (
              <div key={key} className={cn(!el.present && "opacity-60")}>
                <dt className="font-semibold">
                  {elementLabel(key)}
                  {!el.present && <span className="font-normal text-muted-foreground"> · not visible</span>}
                </dt>
                {el.present && <dd className="text-muted-foreground">{el.description}</dd>}
              </div>
            );
          })}
          {analysis.furniture.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="font-semibold">Furniture & other items</dt>
              <dd className="text-muted-foreground">{analysis.furniture.map((f) => `${f.name} (${f.location})`).join(" · ")}</dd>
            </div>
          )}
        </dl>
      </details>
    </div>
  );
}
