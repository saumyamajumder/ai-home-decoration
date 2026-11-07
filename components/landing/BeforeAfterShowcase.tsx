"use client";

import { useState } from "react";
import { Info, MessageSquareText, Palette, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { photos } from "@/lib/images";
import { ImageComparison } from "@/components/editor/ImageComparison";
import { SectionHeading } from "@/components/landing/SectionHeading";

/** "Before" treatment: desaturated and dimmed to suggest a dated, unstyled room. */
const BEFORE_LOOK = "grayscale-[0.9] brightness-[0.8] contrast-[0.88] sepia-[0.2]";

const examples = [
  {
    id: "living",
    label: "Living Room",
    style: "Soft Scandinavian",
    prompt: "Brighten the room, add a light linen sofa, layered throws and natural wood accents.",
    image: photos.livingSoft,
    alt: "Living room with a light grey sofa, wooden side tables and framed art",
    changes: ["Sofa & textiles", "Wall colour", "Accent decor"],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    style: "Modern White",
    prompt: "Change cabinet colour to white and replace countertop with polished marble.",
    image: photos.kitchenWhite,
    alt: "White kitchen with marble countertop and built-in appliances",
    changes: ["Cabinet colour", "Countertop", "Built-in oven"],
  },
  {
    id: "open-plan",
    label: "Open Plan",
    style: "Contemporary",
    prompt: "Add a statement art wall, round marble coffee table and pendant lights over the island.",
    image: photos.livingOpenPlan,
    alt: "Open-plan living space with grey sofa, pop-art print and kitchen island",
    changes: ["Artwork", "Coffee table", "Pendant lighting"],
  },
] as const;

export function BeforeAfterShowcase() {
  const [activeId, setActiveId] = useState<(typeof examples)[number]["id"]>(examples[0].id);
  const active = examples.find((example) => example.id === activeId) ?? examples[0];

  return (
    <section aria-labelledby="examples-title" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="examples-title"
          eyebrow="Before & after"
          title="See the transformation"
          description="Drag the slider to compare. Each example pairs a room photo with the instruction that guided the redesign."
        />

        <div
          role="tablist"
          aria-label="Example rooms"
          className="mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-border bg-background p-1 shadow-soft"
        >
          {examples.map((example) => {
            const selected = example.id === activeId;
            return (
              <button
                key={example.id}
                type="button"
                role="tab"
                id={`tab-${example.id}`}
                aria-selected={selected}
                aria-controls="example-panel"
                onClick={() => setActiveId(example.id)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  selected
                    ? "bg-brand-gradient text-white shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {example.label}
              </button>
            );
          })}
        </div>

        <div
          id="example-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]"
        >
          <div className="rounded-3xl border border-border bg-card p-2.5 shadow-soft">
            <ImageComparison
              key={active.id}
              before={{ src: active.image, alt: active.alt, className: BEFORE_LOOK }}
              after={{ src: active.image, alt: active.alt }}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="aspect-16/10 rounded-[1.1rem]"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <LayoutGrid className="size-4" /> Room
              </p>
              <p className="mt-1 text-xl font-semibold">{active.label}</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Palette className="size-4" /> Style
              </p>
              <p className="mt-1 font-medium">{active.style}</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                <MessageSquareText className="size-4" /> Instruction
              </p>
              <p className="mt-2 leading-relaxed">“{active.prompt}”</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Areas changed</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {active.changes.map((change) => (
                  <li
                    key={change}
                    className="rounded-full border border-border bg-background px-3 py-1 text-sm"
                  >
                    {change}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-auto flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Illustrative sample. Live AI generation will be available once a model is connected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
