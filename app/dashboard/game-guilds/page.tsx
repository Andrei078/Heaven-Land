import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { cardClass } from "@/lib/ui";

export default async function GameGuildsPage() {
  const guilds = await botApi.gameGuilds.list().catch(() => null);

  return (
    <div>
      <PageHeader
        title="In-Game Guilds"
        description="Player clans (not Discord server settings) — read-only for now."
      />

      {!guilds ? (
        <UnavailableNotice label="In-Game Guilds" />
      ) : (
        <div className="space-y-3">
          {Object.values(guilds).map((g) => (
            <details key={g.id} className={cardClass}>
              <summary className="cursor-pointer text-sm text-hl-text">
                <span className="font-medium">{g.name}</span>{" "}
                <span className="text-hl-faint">#{g.id}</span>{" "}
                <span className="text-hl-muted">— {g.members?.length ?? 0} members</span>
              </summary>
              <div className="mt-3 space-y-1 text-sm text-hl-muted">
                <p>Founder: {g.founder_name}</p>
                <p>{g.description}</p>
                <p>
                  Requirements: level {g.requirements?.min_level ?? 0}, money{" "}
                  {g.requirements?.min_money ?? 0}
                </p>
              </div>
            </details>
          ))}
          {Object.keys(guilds).length === 0 && (
            <p className="text-sm text-hl-muted">No in-game guilds yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
