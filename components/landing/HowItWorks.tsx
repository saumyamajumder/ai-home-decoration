import { Brush, ImageUp, LayoutGrid, SplitSquareHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/landing/SectionHeading";

const steps = [
  {
    icon: ImageUp,
    title: "Upload your room",
    description: "Drop in a photo of any room. JPG, PNG and WebP are supported.",
  },
  {
    icon: LayoutGrid,
    title: "Pick room & style",
    description: "Choose the room type and a design style such as Japandi, Modern or Scandinavian.",
  },
  {
    icon: Brush,
    title: "Mark & describe",
    description: "Brush or box the area to change, then describe it in plain words.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Compare & save",
    description: "Review the redesign side by side, try variations and save it to a project.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="From photo to redesign in four steps"
          description="A guided flow that keeps you in control of exactly what changes."
        />

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* connector line on desktop */}
          <span
            aria-hidden
            className="absolute top-10 right-[12%] left-[12%] hidden h-px bg-linear-to-r from-transparent via-border to-transparent lg:block"
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_8px_20px_-10px_var(--brand-violet)]">
                    <Icon className="size-5.5" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground/70 tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
