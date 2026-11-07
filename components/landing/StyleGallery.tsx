import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { designStyles } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/landing/SectionHeading";

/** Bento-style layout: some tiles span two rows/columns on large screens. */
const tileLayout = [
  "lg:col-span-2 lg:row-span-2",
  "",
  "",
  "lg:row-span-2",
  "",
  "",
  "",
  "",
];

export function StyleGallery() {
  return (
    <section id="styles" aria-labelledby="styles-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="styles-title"
            align="left"
            eyebrow="Design styles"
            title="Find a style that feels like home"
            description="Curated looks you can apply in one click, or mix with your own instructions."
          />
          <Link
            href="/gallery"
            className={cn(buttonVariants({ variant: "outline", size: "xl" }), "shrink-0 self-start md:self-auto")}
          >
            Browse gallery
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>

        <ul className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] sm:gap-4 lg:grid-cols-4">
          {designStyles.map((style, index) => (
            <li key={style.id} className={cn("group relative overflow-hidden rounded-3xl bg-muted", tileLayout[index])}>
              <Image
                src={style.image}
                alt={`${style.name} style interior`}
                fill
                sizes="(min-width: 1024px) 50vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <h3 className="text-base font-semibold sm:text-lg">{style.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-white/80 sm:text-sm">{style.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
