import Link from "next/link";
import {
  Users2,
  Users,
  Swords,
  BookOpen,
  Gem,
  Shield,
  UserPlus,
  Sparkles,
  SlidersHorizontal,
  Gavel,
} from "lucide-react";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { StatusDot } from "@/components/ui/StatusDot";
import { cardClass } from "@/lib/ui";

export default async function OverviewPage() {
  const [health, stats, overview] = await Promise.all([
    botApi.health().catch(() => null),
    botApi.stats().catch(() => null),
    botApi.server.overview().catch(() => null),
  ]);

  const online = health?.status === "online";

  return (
    <div>
      <PageHeader title="Dashboard" description="Command center for the Heaven Land bot." />

      {!health && !stats && !overview && <UnavailableNotice label="The dashboard overview" />}

      {/* Bot status + Server */}
      <section className="grid gap-4 lg:grid-cols-5">
        <div className={`${cardClass} lg:col-span-2`}>
          <p className="text-xs font-medium uppercase tracking-wide text-hl-faint">Bot status</p>
          <div className="mt-3 flex items-center gap-2">
            <StatusDot tone={online ? "success" : "danger"} pulse={online} />
            <span className="font-display text-2xl text-hl-text">
              {online ? "Online" : health ? "Starting" : "Offline"}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-hl-faint">Latency</p>
              <p className="mt-0.5 text-hl-text">{health?.latency_ms !== null && health?.latency_ms !== undefined ? `${health.latency_ms}ms` : "—"}</p>
            </div>
            <div>
              <p className="text-hl-faint">Bot account</p>
              <p className="mt-0.5 truncate text-hl-text">{health?.bot_user ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} lg:col-span-3`}>
          <p className="text-xs font-medium uppercase tracking-wide text-hl-faint">Server</p>
          {overview ? (
            <div className="mt-3 flex items-center gap-4">
              {overview.icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={overview.icon_url} alt="" className="h-14 w-14 rounded-2xl border border-hl-border" />
              ) : (
                <div className="h-14 w-14 rounded-2xl border border-hl-border bg-hl-surface-raised" />
              )}
              <div>
                <p className="font-display text-lg text-hl-text">{overview.name}</p>
                <p className="mt-0.5 text-sm text-hl-muted">
                  {overview.member_count.toLocaleString()} members · {overview.channel_count} channels · {overview.role_count} roles
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-hl-muted">Server data unavailable.</p>
          )}
        </div>
      </section>

      {/* Game statistics */}
      <section className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Users} label="Users" value={stats?.users} href="/dashboard/users" />
        <StatCard icon={Users2} label="Characters" value={stats?.characters} href="/dashboard/characters" />
        <StatCard icon={Swords} label="Quests" value={stats?.quests} href="/dashboard/quests" />
        <StatCard icon={BookOpen} label="Series" value={stats?.series} href="/dashboard/series" />
        <StatCard icon={Gem} label="Rarities" value={stats?.rarities} href="/dashboard/rarities" />
        <StatCard icon={Shield} label="Guilds" value={stats?.in_game_guilds} href="/dashboard/game-guilds" />
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-hl-text">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon={Users2} label="Create Character" href="/dashboard/characters/new" />
          <QuickAction icon={Sparkles} label="Create Quest" href="/dashboard/quests" />
          <QuickAction icon={SlidersHorizontal} label="Edit Bot Settings" href="/dashboard/bot/settings" />
          <QuickAction icon={Gavel} label="Moderation" href="/dashboard/moderation" />
        </div>
      </section>

      {/* Activity */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className="mb-1 text-sm font-semibold text-hl-text">Activity overview</h2>
          <p className="mb-4 text-xs text-hl-faint">
            No time-series data exists in the bot yet, so there&apos;s nothing honest to chart here.
          </p>
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-hl-border text-sm text-hl-faint">
            A real chart will render here once the bot tracks activity over time.
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="mb-1 text-sm font-semibold text-hl-text">Recent activity</h2>
          <p className="mb-4 text-xs text-hl-faint">Requires an audit log, not yet implemented.</p>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hl-border px-4 py-8 text-center">
            <UserPlus size={18} className="mb-2 text-hl-faint" strokeWidth={1.5} />
            <p className="text-sm text-hl-muted">Nothing to show yet.</p>
            <p className="mt-1 text-xs text-hl-faint">
              Actions taken here already reach the bot in real time — a
              dedicated activity log can be added later.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Users;
  label: string;
  value: number | undefined;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-hl-border bg-hl-surface-solid p-4 transition-all hover:border-hl-accent-border hover:bg-hl-surface-raised"
    >
      <Icon size={16} strokeWidth={1.75} className="mb-2.5 text-hl-faint transition-colors group-hover:text-hl-blue-strong" />
      <p className="font-display text-2xl text-hl-text">{value !== undefined ? value.toLocaleString() : "—"}</p>
      <p className="mt-0.5 text-xs text-hl-muted">{label}</p>
    </Link>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Users;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-hl-border bg-hl-surface-solid px-4 py-3.5 text-sm text-hl-text transition-all hover:border-hl-accent-border hover:bg-hl-surface-raised"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-hl-accent-soft text-hl-blue-strong">
        <Icon size={15} strokeWidth={1.75} />
      </span>
      {label}
    </Link>
  );
}
