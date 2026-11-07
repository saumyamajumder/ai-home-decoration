import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { photos } from "@/lib/images";
import { buttonVariants } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-14 text-white shadow-lift sm:px-12 sm:py-16 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
          <div aria-hidden className="absolute -top-24 -left-24 -z-10 size-80 rounded-full bg-white/10 blur-2xl" />
          <div>
            <h2 id="cta-title" className="text-3xl font-semibold sm:text-4xl">
              Ready to see your room reimagined?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-white/85">
              Upload a photo, pick a style and start experimenting. It only takes a minute.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "bg-white px-6 text-neutral-900 hover:bg-white/90",
                )}
              >
                <Upload data-icon="inline-start" />
                Upload Your Room
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "xl" }),
                  "px-6 text-white ring-1 ring-white/40 hover:bg-white/10 hover:text-white",
                )}
              >
                Open dashboard
                <ArrowRight data-icon="inline-end" />
              </Link>
            </div>
          </div>

          <div className="relative mt-10 hidden aspect-4/3 overflow-hidden rounded-3xl ring-1 ring-white/30 sm:block lg:mt-0">
            <Image
              src={photos.livingBoho}
              alt="Warm living room with rattan pendants, grey sofa and leather ottomans"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
