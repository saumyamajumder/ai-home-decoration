import Link from "next/link";
import { ArrowRight, Check, Sparkles, Upload, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { photos } from "@/lib/images";
import { buttonVariants } from "@/components/ui/button";
import { ImageComparison } from "@/components/editor/ImageComparison";

const highlights = ["8 room types", "8 curated styles", "No design skills needed"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dot-grid mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand-violet/15 blur-3xl" />
        <div className="absolute top-40 -right-32 size-[28rem] rounded-full bg-brand-blue/15 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground sm:text-sm">
            <Sparkles className="size-3.5" />
            AI interior design studio
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl"
          >
            Transform Your Home <span className="text-brand-gradient">with AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Upload your room photo, describe your dream design, and visualize your perfect home.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/create" className={cn(buttonVariants({ variant: "gradient", size: "xl" }), "px-6")}>
              <Upload data-icon="inline-start" />
              Upload Your Room
            </Link>
            <Link href="/gallery" className={cn(buttonVariants({ variant: "outline", size: "xl" }), "px-6")}>
              Explore Designs
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          <div className="rounded-[1.75rem] border border-border bg-card p-2.5 shadow-lift">
            <ImageComparison
              priority
              initial={42}
              sizes="(min-width: 1024px) 50vw, 100vw"
              before={{
                src: photos.livingSunlit,
                alt: "Living room with a sofa, armchairs and a gallery wall",
                className: "grayscale-[0.85] brightness-[0.82] contrast-[0.9] sepia-[0.25]",
              }}
              after={{
                src: photos.livingSunlit,
                alt: "The same living room restyled with warm, natural tones",
              }}
              beforeLabel="Original"
              afterLabel="Restyled"
              className="rounded-[1.25rem]"
            />
          </div>

          {/* Floating prompt chip */}
          <div className="absolute -bottom-6 left-4 hidden max-w-[19rem] items-start gap-3 rounded-2xl border border-border bg-card/95 p-3.5 shadow-lift backdrop-blur sm:flex lg:-left-8">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <Wand2 className="size-4.5" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Design prompt</p>
              <p className="mt-0.5 text-sm leading-snug font-medium">
                “Warm Japandi living room with natural light and soft textures”
              </p>
            </div>
          </div>

          <span className="absolute -top-3 right-5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            Sample visualisation · drag to compare
          </span>
        </div>
      </div>
    </section>
  );
}
