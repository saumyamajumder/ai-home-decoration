import Link from "next/link";

import { roomCategories } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";

const productLinks = [
  { title: "Create a design", href: "/create" },
  { title: "AI Room Editor", href: "/editor" },
  { title: "Design Gallery", href: "/gallery" },
  { title: "My Projects", href: "/projects" },
  { title: "Dashboard", href: "/dashboard" },
];

const learnLinks = [
  { title: "How it works", href: "/#how-it-works" },
  { title: "Design styles", href: "/#styles" },
  { title: "Features", href: "/#features" },
  { title: "Settings", href: "/settings" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn
            title="Rooms"
            links={roomCategories.slice(0, 5).map((room) => ({
              title: room.name,
              href: `/create?room=${room.id}`,
            }))}
          />
          <FooterColumn title="Learn" links={learnLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}. Interior photography via Unsplash.</p>
          <p>Frontend preview: AI results shown here are sample images, not live generations.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
