import {
  FolderKanban,
  Images,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Shorter label for the mobile bottom bar. */
  shortTitle?: string;
}

export const appNavItems: NavItem[] = [
  { title: "Dashboard", shortTitle: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Create Design", shortTitle: "Create", href: "/create", icon: PlusCircle },
  { title: "AI Room Editor", shortTitle: "Editor", href: "/editor", icon: Wand2 },
  { title: "My Projects", shortTitle: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Design Gallery", shortTitle: "Gallery", href: "/gallery", icon: Images },
  { title: "Settings", href: "/settings", icon: Settings },
];

/** Items shown in the mobile bottom bar (Settings lives in the header menu). */
export const mobileNavItems = appNavItems.filter((item) =>
  ["/dashboard", "/create", "/editor", "/projects", "/gallery"].includes(item.href),
);

export const marketingNavItems = [
  { title: "How it works", href: "/#how-it-works" },
  { title: "Rooms", href: "/#rooms" },
  { title: "Styles", href: "/#styles" },
  { title: "Features", href: "/#features" },
  { title: "Gallery", href: "/gallery" },
];

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
