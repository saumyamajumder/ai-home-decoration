import type { Metadata } from "next";

import { EditorWorkspace } from "@/components/editor/EditorWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "AI Room Editor" };

export default function EditorPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="AI Room Editor" description="Choose the room, describe your redesign and pick a style." />
      <div className="mt-6">
        <EditorWorkspace />
      </div>
    </div>
  );
}
