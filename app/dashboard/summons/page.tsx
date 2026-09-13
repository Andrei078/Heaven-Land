import Link from "next/link";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { secondaryButtonClass, cardClass } from "@/lib/ui";

export default async function SummonsPage() {
  const [settings, rarities] = await Promise.all([
    botApi.settings.get().catch(() => null),
    botApi.rarities.list().catch(() => null),
  ]);

  return (
    <div>
      <PageHeader
        title="Summons"
        description="Summon cost lives in Bot Settings; odds come from each rarity's chance."
      />

      {!settings || !rarities ? (
        <UnavailableNotice label="Summons" />
      ) : (
        <div className="space-y-4">
          <div className={`${cardClass} flex items-center justify-between`}>
            <div>
              <p className="text-xs uppercase tracking-wide text-hl-faint">Summon cost</p>
              <p className="mt-1 font-display text-2xl text-hl-text">{settings.summon_cost}</p>
            </div>
            <Link href="/dashboard/bot/settings" className={secondaryButtonClass}>
              Edit in Bot Settings →
            </Link>
          </div>

          <div className={cardClass}>
            <p className="mb-3 text-sm font-medium text-hl-text">Odds by rarity</p>
            <div className="space-y-2">
              {Object.values(rarities)
                .sort((a, b) => b.chance - a.chance)
                .map((r) => (
                  <div key={r.name} className="flex items-center justify-between border-t border-hl-border py-2 text-sm first:border-t-0">
                    <span className="text-hl-text">{r.name}</span>
                    <span className="text-hl-muted">{(r.chance * 100).toFixed(2)}%</span>
                  </div>
                ))}
            </div>
            <Link href="/dashboard/rarities" className={`${secondaryButtonClass} mt-4`}>
              Edit rarities →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
