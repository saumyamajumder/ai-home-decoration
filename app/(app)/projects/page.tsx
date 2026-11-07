import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "My Projects" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="My Projects" description="Every room you have redesigned, in one place." />
      <ComingSoon
        phase={2}
        icon={FolderKanban}
        title="Project library is on its way"
        items={["Project cards", "Search", "Filters", "Sorting", "View · Edit · Delete"]}
      />
    </div>
  );
}
