import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { secondaryButtonClass, cardClass } from "@/lib/ui";

export default function SystemSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Dashboard-level information." />

      <div className={`${cardClass} space-y-4`}>
        <div>
          <p className="text-sm font-medium text-hl-text">Bot configuration</p>
          <p className="mt-1 text-sm text-hl-muted">
            Prefix, summon cost, and other bot-wide values live under Bot →
            Bot Settings, not here.
          </p>
          <Link href="/dashboard/bot/settings" className={`${secondaryButtonClass} mt-3`}>
            Go to Bot Settings
          </Link>
        </div>

        <div className="border-t border-hl-border pt-4">
          <p className="text-sm font-medium text-hl-text">Access control</p>
          <p className="mt-1 text-sm text-hl-muted">
            Anyone with Administrator permission on the Heaven Land Discord
            server can sign in here — there&apos;s no separate dashboard user
            list to manage.
          </p>
        </div>
      </div>
    </div>
  );
}
