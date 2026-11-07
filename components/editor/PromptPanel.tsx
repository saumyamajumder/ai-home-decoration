"use client";

import { useRef, useState } from "react";
import { Info, TriangleAlert } from "lucide-react";

import { roomCategories, type RoomCategoryId } from "@/lib/catalog";
import { improvePrompt } from "@/lib/prompts/improve-prompt";
import { editingStyles, validatePrompt, PROMPT_MAX_LENGTH, type EditingStyleId } from "@/lib/prompts/options";
import { appendSuggestion, containsSuggestion, promptSuggestions, removeSuggestion } from "@/lib/prompts/suggestions";
import type { PromptHistoryEntry } from "@/lib/prompts/history";
import { usePromptHistory } from "@/hooks/use-prompt-history";
import { Separator } from "@/components/ui/separator";
import { DesignStyleSelector } from "@/components/editor/DesignStyleSelector";
import { GenerateDesignButton } from "@/components/editor/GenerateDesignButton";
import { PromptHistory } from "@/components/editor/PromptHistory";
import { PromptInput } from "@/components/editor/PromptInput";
import { SuggestedPrompts } from "@/components/editor/SuggestedPrompts";

export interface PromptSubmission {
  prompt: string;
  roomCategory: RoomCategoryId;
  styleId: EditingStyleId | null;
}

interface PromptPanelProps {
  roomCategory: RoomCategoryId;
  onRoomCategoryChange: (room: RoomCategoryId) => void;
  project: { id: string; name: string };
  /** Called with a validated request; may return a message to show under the button. */
  onGenerate?: (submission: PromptSubmission) => Promise<GenerateStatus | void> | GenerateStatus | void;
  generating?: boolean;
}

export type GenerateStatus = { tone: "info" | "error"; message: string };
type Status = GenerateStatus | null;

/** Right-hand "AI Design Instructions" panel of the editor. */
export function PromptPanel({ roomCategory, onRoomCategoryChange, project, onGenerate, generating }: PromptPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState<EditingStyleId | null>("modern");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [beforeImprove, setBeforeImprove] = useState<string | null>(null);
  const [improveNote, setImproveNote] = useState<string | null>(null);
  const history = usePromptHistory();

  const room = roomCategories.find((item) => item.id === roomCategory) ?? roomCategories[0];
  const styleName = editingStyles.find((item) => item.id === styleId)?.name;

  /** Every manual or programmatic edit goes through here so stale messages clear. */
  const changePrompt = (next: string) => {
    setPrompt(next);
    setError(null);
    setStatus(null);
    setBeforeImprove(null);
    setImproveNote(null);
  };

  const focusEnd = () => {
    const el = textareaRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return; // avoid popping the phone keyboard
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const toggleSuggestion = (suggestion: string) => {
    if (containsSuggestion(prompt, suggestion)) {
      changePrompt(removeSuggestion(prompt, suggestion));
      return;
    }
    const next = appendSuggestion(prompt, suggestion);
    if (next.length > PROMPT_MAX_LENGTH) {
      setError(`Adding this would exceed ${PROMPT_MAX_LENGTH} characters. Shorten your instructions first.`);
      return;
    }
    changePrompt(next);
    focusEnd();
  };

  const improve = () => {
    const result = improvePrompt(prompt, { roomName: room.name, styleName });
    const text = result.text.slice(0, PROMPT_MAX_LENGTH);
    if (text === prompt) {
      setImproveNote("Your prompt already looks good. Nothing to change.");
      return;
    }
    const previous = prompt;
    changePrompt(text);
    setBeforeImprove(previous);
    setImproveNote(`${result.changes.join(" · ")}. Rule-based clean-up; review before generating.`);
  };

  const undoImprove = () => {
    if (beforeImprove === null) return;
    changePrompt(beforeImprove);
  };

  const applyHistoryEntry = (entry: PromptHistoryEntry) => {
    changePrompt(entry.text);
    setStyleId(entry.styleId);
    if (entry.roomCategory !== roomCategory) onRoomCategoryChange(entry.roomCategory);
    focusEnd();
  };

  const generate = async () => {
    const validation = validatePrompt(prompt);
    if (!validation.ok) {
      setError(validation.message);
      textareaRef.current?.focus();
      return;
    }
    const submission: PromptSubmission = { prompt: prompt.trim(), roomCategory, styleId };
    history.add({ ...submission, text: submission.prompt, projectId: project.id, projectName: project.name });

    if (onGenerate) {
      setStatus(null);
      const result = await onGenerate(submission);
      if (result) setStatus(result);
    } else {
      setStatus({
        tone: "info",
        message:
          "Prompt validated and saved to history. Image generation isn’t connected yet: the backend is added in the next phases, so no image was created.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">AI design instructions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe exactly what should change in your {room.name.toLowerCase()} photo.
        </p>
      </div>

      <PromptInput
        ref={textareaRef}
        value={prompt}
        onChange={changePrompt}
        onClear={() => {
          changePrompt("");
          textareaRef.current?.focus();
        }}
        onImprove={improve}
        onUndoImprove={beforeImprove !== null ? undoImprove : undefined}
        improveNote={improveNote}
        error={error}
      />

      <SuggestedPrompts
        roomName={room.name}
        suggestions={promptSuggestions[room.id]}
        prompt={prompt}
        onToggle={toggleSuggestion}
      />

      <Separator />

      <DesignStyleSelector value={styleId} onChange={setStyleId} />

      <div className="space-y-3">
        <GenerateDesignButton onClick={generate} loading={generating} />
        {status && (
          <p
            role={status.tone === "error" ? "alert" : "status"}
            className={
              status.tone === "error"
                ? "flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-3 text-xs leading-relaxed text-destructive"
                : "flex items-start gap-2 rounded-xl bg-accent px-3.5 py-3 text-xs leading-relaxed text-accent-foreground"
            }
          >
            {status.tone === "error" ? <TriangleAlert className="mt-px size-3.5 shrink-0" /> : <Info className="mt-px size-3.5 shrink-0" />}
            {status.message}
          </p>
        )}
      </div>

      <Separator />

      <PromptHistory
        entries={history.entries}
        projectId={project.id}
        onUse={applyHistoryEntry}
        onUpdate={history.update}
        onDelete={history.remove}
        onClear={history.clear}
      />
    </div>
  );
}
