import {
  Brush,
  Download,
  FolderHeart,
  Layers,
  MessageSquareText,
  SplitSquareHorizontal,
} from "lucide-react";

import { SectionHeading } from "@/components/landing/SectionHeading";

const features = [
  {
    icon: Brush,
    title: "Precise area selection",
    description: "Brush, rectangle and eraser tools let you mark exactly which part of the room should change.",
  },
  {
    icon: MessageSquareText,
    title: "Plain-language instructions",
    description: "Describe what you want, or start from suggestions like “Add a modern chimney”.",
  },
  {
    icon: Layers,
    title: "Curated design styles",
    description: "Apply a cohesive look from Japandi to Traditional, then fine-tune with your own words.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Before/after comparison",
    description: "A comparison slider and side-by-side view make every change easy to judge.",
  },
  {
    icon: FolderHeart,
    title: "Projects that stay organised",
    description: "Save designs by room and style, then search, filter and revisit them anytime.",
  },
  {
    icon: Download,
    title: "Download & share",
    description: "Export your favourite results to share with family, contractors or designers.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything you need to redesign with confidence"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.title}
                className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-7"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-brand-gradient group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
