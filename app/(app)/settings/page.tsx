import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Settings" description="Manage your profile and preferences." />
      <ComingSoon
        phase={7}
        icon={Settings}
        title="Settings are on their way"
        items={["Profile", "Appearance", "Notifications", "Language", "Account"]}
      />
    </div>
  );
}
