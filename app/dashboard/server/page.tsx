import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { cardClass } from "@/lib/ui";

export default async function ServerOverviewPage() {
  const overview = await botApi.server.overview().catch(() => null);

  return (
    <div>
      <PageHeader title="Server Overview" description="Live from Discord, via the bot." />

      {!overview ? (
        <UnavailableNotice label="Server Overview" />
      ) : (
        <div className={`${cardClass} flex items-center gap-4`}>
          {overview.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={overview.icon_url} alt="" className="h-16 w-16 rounded-2xl border border-hl-border" />
          ) : (
            <div className="h-16 w-16 rounded-2xl border border-hl-border bg-hl-surface-raised" />
          )}
          <div>
            <p className="font-display text-xl text-hl-text">{overview.name}</p>
            <p className="mt-1 text-sm text-hl-muted">
              {overview.member_count.toLocaleString()} members · {overview.channel_count} channels ·{" "}
              {overview.role_count} roles
            </p>
            <p className="mt-1 text-xs text-hl-faint">
              Created {new Date(overview.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
