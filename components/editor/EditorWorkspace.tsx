"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { History, ImagePlus, Layers, Loader2, RefreshCw, Shuffle, Trash2, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { roomCategories, type RoomCategoryId } from "@/lib/catalog";
import { editingStyles, type EditingStyleId } from "@/lib/prompts/options";
import type { EditPlan } from "@/lib/ai/prompt-builder";
import { analyzeImage, base64ToBlob, downloadBlob, generateDesign } from "@/lib/editor/api";
import { clearPendingUpload, loadImage, peekPendingUpload, subscribePendingUpload, type LoadedImage, type PendingUpload } from "@/lib/editor/images";
import { buttonVariants } from "@/components/ui/button";
import { AnalysisCard, type AnalysisState } from "@/components/editor/AnalysisCard";
import { ImageUploader, validateImageFile } from "@/components/editor/ImageUploader";
import { PromptPanel, type GenerateStatus, type PromptSubmission } from "@/components/editor/PromptPanel";
import { ResultViewer } from "@/components/editor/ResultViewer";
import { RoomCategoryPicker } from "@/components/editor/RoomCategoryPicker";

/** Until projects are stored in Supabase, prompts are saved against this draft project. */
const DRAFT_PROJECT = { id: "draft", name: "Untitled design" };

interface Version {
  id: string;
  number: number;
  image: LoadedImage;
  prompt: string;
  styleId: EditingStyleId | null;
  roomCategory: RoomCategoryId;
  plan: EditPlan;
  /** The image this version was generated from (original or an earlier version). */
  source: { label: string; image: LoadedImage };
}

interface Failure {
  message: string;
  plan?: EditPlan;
  instruction?: string;
}

/**
 * AI Room Editor: upload a photo, describe changes, generate edits with the
 * configured image model, keep editing the latest result and compare.
 */
export function EditorWorkspace() {
  const [roomCategory, setRoomCategory] = useState<RoomCategoryId>("kitchen");
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: "idle" });
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editFrom, setEditFrom] = useState<"result" | "original">("result");
  const [generating, setGenerating] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const analysisAbort = useRef<AbortController | null>(null);
  const generateAbort = useRef<AbortController | null>(null);
  const nextNumber = useRef(1);
  const editFromName = useId();

  // A photo handed over from the Create page. Applied during render (React's "adjust state
  // when input changes" pattern) so it also works when this page is already mounted.
  const pending = useSyncExternalStore(subscribePendingUpload, peekPendingUpload, () => null);
  const [received, setReceived] = useState<PendingUpload | null>(null);
  if (pending && pending !== received) {
    setReceived(pending);
    setOriginal(pending.image);
    setRoomCategory(pending.roomCategory);
    setAnalysis({ status: "loading" });
    setVersions([]);
    setActiveId(null);
    setFailure(null);
    setEditFrom("result");
  }

  const active = versions.find((v) => v.id === activeId) ?? null;
  const room = roomCategories.find((item) => item.id === roomCategory) ?? roomCategories[0];

  const runAnalysis = (image: LoadedImage, roomId: RoomCategoryId) => {
    analysisAbort.current?.abort();
    const controller = new AbortController();
    analysisAbort.current = controller;
    setAnalysis({ status: "loading" });
    analyzeImage(image.blob, roomId, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAnalysis(result.ok ? { status: "done", analysis: result.analysis, model: result.model } : { status: "error", message: result.message });
      })
      .catch(() => {
        /* aborted */
      });
  };

  // Analyse a handed-over photo once (re-runs after Strict Mode's simulated unmount aborted it).
  const analysedHandOff = useRef<PendingUpload | null>(null);
  useEffect(() => {
    if (!received || analysedHandOff.current === received) return;
    clearPendingUpload();
    nextNumber.current = 1;
    const controller = new AbortController();
    analysisAbort.current = controller;
    analyzeImage(received.image.blob, received.roomCategory, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        analysedHandOff.current = received;
        setAnalysis(result.ok ? { status: "done", analysis: result.analysis, model: result.model } : { status: "error", message: result.message });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [received]);

  // Free object URLs when leaving the page.
  const urlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      analysisAbort.current?.abort();
      generateAbort.current?.abort();
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  const track = (image: LoadedImage) => {
    urlsRef.current.add(image.url);
    return image;
  };

  const resetResults = () => {
    generateAbort.current?.abort();
    setGenerating(false);
    setVersions([]);
    nextNumber.current = 1;
    setActiveId(null);
    setFailure(null);
    setEditFrom("result");
  };

  const selectPhoto = async (file: File) => {
    try {
      const image = track(await loadImage(file, file.name));
      resetResults();
      setOriginal(image);
      runAnalysis(image, roomCategory);
    } catch (error) {
      setAnalysis({ status: "error", message: error instanceof Error ? error.message : "This file could not be opened." });
    }
  };

  const removePhoto = () => {
    analysisAbort.current?.abort();
    resetResults();
    setOriginal(null);
    setAnalysis({ status: "idle" });
  };

  const runGeneration = async (input: { prompt: string; roomCategory: RoomCategoryId; styleId: EditingStyleId | null; source: { label: string; image: LoadedImage } }): Promise<GenerateStatus> => {
    generateAbort.current?.abort();
    const controller = new AbortController();
    generateAbort.current = controller;
    setGenerating(true);
    setFailure(null);
    try {
      const result = await generateDesign({ image: input.source.image.blob, prompt: input.prompt, roomCategory: input.roomCategory, styleId: input.styleId }, controller.signal);
      if (!result.ok) {
        const plan = result.details?.plan as EditPlan | undefined;
        setFailure({ message: result.message, plan, instruction: result.details?.instruction as string | undefined });
        return {
          tone: "error",
          message: plan ? `Your instructions were received and analysed, but no image was generated: ${result.message}` : result.message,
        };
      }
      const image = track(await loadImage(base64ToBlob(result.image.data, result.image.mimeType), "design.png"));
      const version: Version = {
        id: crypto.randomUUID(),
        number: nextNumber.current++,
        image,
        prompt: input.prompt,
        styleId: input.styleId,
        roomCategory: input.roomCategory,
        plan: result.plan,
        source: input.source,
      };
      setVersions((current) => [...current, version]);
      setActiveId(version.id);
      setEditFrom("result");
      return { tone: "info", message: `Version ${version.number} generated by ${result.models.image} from ${input.source.label.toLowerCase()}. Add another instruction to keep editing it.` };
    } catch {
      return { tone: "info", message: "Generation cancelled." };
    } finally {
      if (generateAbort.current === controller) setGenerating(false);
    }
  };

  const handleGenerate = (submission: PromptSubmission): Promise<GenerateStatus> | GenerateStatus => {
    if (!original) {
      return { tone: "error", message: "Upload a room photo first. Your instructions are applied to that photo." };
    }
    const source = editFrom === "result" && active ? { label: `Version ${active.number}`, image: active.image } : { label: "Original photo", image: original };
    return runGeneration({ ...submission, source });
  };

  const generateVariation = () => {
    if (!active) return;
    void runGeneration({ prompt: active.prompt, roomCategory: active.roomCategory, styleId: active.styleId, source: active.source });
  };

  const download = () => {
    if (!active) return;
    const ext = active.image.blob.type.split("/")[1] ?? "png";
    downloadBlob(active.image.blob, `${room.id}-design-${String(active.number).padStart(2, "0")}.${ext}`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section aria-label="Image workspace" className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="mb-3 text-sm font-semibold">Room category</p>
          <RoomCategoryPicker value={roomCategory} onChange={setRoomCategory} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-3 shadow-soft sm:p-4">
          {!original ? (
            <>
              <ImageUploader onSelect={selectPhoto} />
              <p className="px-1 pt-3 text-xs text-muted-foreground">
                Upload a photo of your {room.name.toLowerCase()}. Gemini analyses it, then your instructions are applied to this exact photo.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-semibold">
                  {active ? `Version ${active.number} of ${versions.length}` : "Original photo"}
                  <span className="ml-2 font-normal text-muted-foreground">{original.width}×{original.height}</span>
                </p>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => replaceInputRef.current?.click()} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-lg")}>
                    <RefreshCw data-icon="inline-start" />
                    Replace photo
                  </button>
                  <button type="button" onClick={removePhoto} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-lg text-muted-foreground hover:text-destructive")}>
                    <Trash2 data-icon="inline-start" />
                    Remove
                  </button>
                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    aria-label="Replace room photo"
                    tabIndex={-1}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (!file) return;
                      const problem = validateImageFile(file);
                      if (problem) setAnalysis({ status: "error", message: problem });
                      else void selectPhoto(file);
                    }}
                  />
                </div>
              </div>

              <div className="relative">
                <ResultViewer
                  original={original}
                  modified={active?.image ?? null}
                  modifiedLabel={active ? `Version ${active.number}` : undefined}
                  onDownload={download}
                />
                {generating && (
                  <div className="absolute inset-x-0 bottom-0 top-12 z-30 grid place-items-center rounded-xl bg-background/70 backdrop-blur-sm" role="status">
                    <span className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-lift">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Generating your design… this can take up to a minute
                    </span>
                  </div>
                )}
              </div>

              {versions.length > 0 && (
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <fieldset className="min-w-0">
                      <legend className="mb-1.5 text-xs font-semibold">Next instruction edits</legend>
                      <div className="inline-flex rounded-lg bg-muted p-0.5 text-xs font-medium">
                        {(["result", "original"] as const).map((value) => (
                          <label
                            key={value}
                            className={cn(
                              "relative cursor-pointer rounded-md px-2.5 py-1 has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                              editFrom === value ? "bg-background shadow-soft" : "text-muted-foreground",
                            )}
                          >
                            <input type="radio" name={editFromName} value={value} checked={editFrom === value} onChange={() => setEditFrom(value)} className="sr-only" />
                            {value === "result" ? `Version ${active?.number ?? versions.length} (continue editing)` : "Original photo"}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <button type="button" onClick={generateVariation} disabled={generating || !active} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-lg")}>
                      <Shuffle data-icon="inline-start" />
                      Another variation
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
                      <Layers className="size-3.5" />
                      Versions
                    </p>
                    <ol className="flex gap-2 overflow-x-auto pb-1">
                      {versions.map((v) => (
                        <li key={v.id} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveId(v.id)}
                            aria-pressed={v.id === activeId}
                            title={v.prompt}
                            className={cn(
                              "relative block h-16 w-24 overflow-hidden rounded-lg border-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                              v.id === activeId ? "border-primary" : "border-transparent opacity-80 hover:opacity-100",
                            )}
                          >
                            <Image src={v.image.url} alt={`Version ${v.number}`} fill unoptimized sizes="96px" className="object-cover" />
                            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[10px] font-semibold text-white">V{v.number}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                    {active && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <History className="mt-px size-3.5 shrink-0" />
                        <span>
                          From {active.source.label.toLowerCase()}: “{active.prompt}”
                          {active.styleId && ` · ${editingStyles.find((s) => s.id === active.styleId)?.name}`}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {failure && (
                <div role="alert" className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm">
                  <p className="flex items-start gap-2 font-medium text-destructive">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    No image was generated
                  </p>
                  <p className="text-muted-foreground">{failure.message}</p>
                  {failure.plan && (
                    <details className="rounded-lg bg-background px-3 py-2 text-xs">
                      <summary className="cursor-pointer font-medium text-primary">
                        Gemini understood your instructions ({failure.plan.changes.length} change{failure.plan.changes.length === 1 ? "" : "s"})
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                        {failure.plan.changes.map((c, i) => (
                          <li key={i}>
                            <span className="font-medium text-foreground">{c.target}</span> ({c.action}): {c.details}
                          </li>
                        ))}
                      </ul>
                      {failure.plan.preserve.length > 0 && <p className="mt-2 text-muted-foreground">Keeps unchanged: {failure.plan.preserve.join(", ")}.</p>}
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {original && (
          <AnalysisCard state={analysis} roomCategory={roomCategory} onUseRoom={setRoomCategory} onRetry={() => runAnalysis(original, roomCategory)} />
        )}

        {!original && (
          <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <ImagePlus className="size-3.5 shrink-0" />
            Tip: well-lit photos taken straight on give the most accurate edits.
          </p>
        )}
      </section>

      <aside aria-label="AI design instructions" className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6 xl:self-start">
        <PromptPanel roomCategory={roomCategory} onRoomCategoryChange={setRoomCategory} project={DRAFT_PROJECT} onGenerate={handleGenerate} generating={generating} />
      </aside>
    </div>
  );
}
