import { Suspense } from "react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { CreateDesignFlow } from "@/components/create/CreateDesignFlow";

export const metadata: Metadata = { title: "Create New Design" };

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Create New Design" description="Upload a room photo and choose what kind of space it is." />
      {/* useSearchParams (?room=) needs a Suspense boundary for static rendering */}
      <Suspense>
        <CreateDesignFlow />
      </Suspense>
    </div>
  );
}
