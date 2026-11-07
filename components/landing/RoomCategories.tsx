import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { roomCategories } from "@/lib/catalog";
import { SectionHeading } from "@/components/landing/SectionHeading";

export function RoomCategories() {
  return (
    <section id="rooms" aria-labelledby="rooms-title" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="rooms-title"
            align="left"
            eyebrow="Room categories"
            title="Every room, indoors and out"
            description="Start with the space you want to change. Each category has prompts tuned to it."
          />
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {roomCategories.map((room) => {
            const Icon = room.icon;
            return (
              <li key={room.id}>
                <Link
                  href={`/create?room=${room.id}`}
                  className="group relative block aspect-4/5 overflow-hidden rounded-3xl bg-muted shadow-soft outline-none focus-visible:ring-3 focus-visible:ring-ring/60 sm:aspect-square"
                >
                  <Image
                    src={room.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
                  <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 text-neutral-900 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    <span className="mb-2 inline-grid size-8 place-items-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <Icon className="size-4" />
                    </span>
                    <span className="block text-base font-semibold sm:text-lg">{room.name}</span>
                    <span className="mt-0.5 hidden text-sm text-white/80 sm:block">
                      {room.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
