import type { Metadata } from "next";
import { Images } from "lucide-react";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Design Gallery" };

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Design Gallery" description="Inspiration from curated interiors." />
      <ComingSoon
        phase={2}
        icon={Images}
        title="Inspiration gallery is on its way"
        items={["Modern Kitchen", "Luxury Kitchen", "Minimalist Bedroom", "Scandinavian Living Room", "Modern Bathroom", "Category filters"]}
      />
    </div>
  );
}
