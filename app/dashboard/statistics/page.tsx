import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { cardClass } from "@/lib/ui";

export default async function StatisticsPage() {
  const stats = await botApi.stats().catch(() => null);

  const rows = stats
    ? [
        ["Users", stats.users],
        ["Characters", stats.characters],
        ["Quests", stats.quests],
        ["Series", stats.series],
        ["Rarities", stats.rarities],
        ["In-Game Guilds", stats.in_game_guilds],
      ]
    : [];

  return (
    <div>
      <PageHeader title="Statistics" description="Live counts across the bot's data." />

      {!stats ? (
        <UnavailableNotice label="Statistics" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label as string} className={cardClass}>
              <p className="text-xs uppercase tracking-wide text-hl-faint">{label}</p>
              <p className="mt-2 font-display text-3xl text-hl-text">{(value as number).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
