"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { roomCategories, type RoomCategoryId } from "@/lib/catalog";

interface RoomCategoryPickerProps {
  value: RoomCategoryId;
  onChange: (value: RoomCategoryId) => void;
}

/** Compact, horizontally scrollable room selector for the editor toolbar. */
export function RoomCategoryPicker({ value, onChange }: RoomCategoryPickerProps) {
  // Unique group name: several pickers can be mounted at once (Next keeps visited pages alive).
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Room category</legend>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {roomCategories.map((room) => {
          const Icon = room.icon;
          const checked = room.id === value;
          return (
            <label
              key={room.id}
              className={cn(
                "relative flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                checked
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={room.id}
                checked={checked}
                onChange={() => onChange(room.id)}
                className="sr-only"
              />
              <Icon className={cn("size-4", checked && "text-primary")} />
              {room.name}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
