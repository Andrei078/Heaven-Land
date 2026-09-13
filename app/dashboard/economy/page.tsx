import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { inputClass, primaryButtonClass, secondaryButtonClass, cardClass } from "@/lib/ui";
import { addMoneyAction, addXpAction } from "@/app/dashboard/users/actions";

export default async function EconomyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const result = q ? await botApi.users.list({ search: q, limit: 10 }).catch(() => null) : null;

  return (
    <div>
      <PageHeader
        title="Economy"
        description="Adjust a user's money or XP directly. Settings like summon cost and market tax live under Bot Settings."
      />

      <form method="get" className="mb-4 flex gap-3">
        <input type="text" name="q" defaultValue={q} placeholder="Username or Discord ID…" className={`${inputClass} max-w-sm`} />
        <button type="submit" className={primaryButtonClass}>
          Search
        </button>
      </form>

      {q && !result && <UnavailableNotice label="Economy" />}

      {result && (
        <div className="space-y-3">
          {result.items.length === 0 && <p className="text-sm text-hl-muted">No matches.</p>}
          {result.items.map((u) => (
            <div key={u.discord_id} className={`${cardClass} flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <p className="text-sm text-hl-text">{u.username}</p>
                <p className="text-xs text-hl-faint">
                  Level {u.level} · {u.money} money · {u.xp} XP
                </p>
              </div>
              <div className="flex gap-2">
                <form action={addMoneyAction.bind(null, u.discord_id)} className="flex gap-1">
                  <input type="number" name="amount" placeholder="±money" className={`${inputClass} w-28`} />
                  <button type="submit" className={secondaryButtonClass}>
                    Apply
                  </button>
                </form>
                <form action={addXpAction.bind(null, u.discord_id)} className="flex gap-1">
                  <input type="number" name="amount" placeholder="±xp" className={`${inputClass} w-28`} />
                  <button type="submit" className={secondaryButtonClass}>
                    Apply
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
