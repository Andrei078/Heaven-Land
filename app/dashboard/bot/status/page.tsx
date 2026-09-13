import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { cardClass } from "@/lib/ui";

export default async function BotStatusPage() {
  const health = await botApi.health().catch(() => null);
  const overview = await botApi.server.overview().catch(() => null);

  return (
    <div>
      <PageHeader title="Bot Status" description="Live connection state, straight from the bot." />

      {!health ? (
        <UnavailableNotice label="Bot Status" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wide text-hl-faint">Connection</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${health.status === "online" ? "bg-hl-success" : "bg-hl-danger"}`} />
              <span className="font-display text-xl text-hl-text capitalize">{health.status}</span>
            </div>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wide text-hl-faint">Bot account</p>
            <p className="mt-2 text-lg text-hl-text">{health.bot_user ?? "—"}</p>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wide text-hl-faint">Gateway latency</p>
            <p className="mt-2 text-lg text-hl-text">{health.latency_ms !== null ? `${health.latency_ms}ms` : "—"}</p>
          </div>
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wide text-hl-faint">Servers connected</p>
            <p className="mt-2 text-lg text-hl-text">{health.guild_count}</p>
          </div>
          {overview && (
            <div className={`${cardClass} sm:col-span-2`}>
              <p className="text-xs uppercase tracking-wide text-hl-faint">Heaven Land server</p>
              <p className="mt-2 text-lg text-hl-text">{overview.name}</p>
              <p className="mt-1 text-sm text-hl-muted">
                {overview.member_count.toLocaleString()} members · {overview.channel_count} channels · {overview.role_count} roles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
