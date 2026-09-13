import { notFound } from "next/navigation";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass, cardClass } from "@/lib/ui";
import { updateUserAction, addMoneyAction, addXpAction } from "../actions";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await botApi.users.get(id).catch(() => null);

  if (!user) notFound();

  const inventory = Array.isArray(user.inventory) ? user.inventory : [];
  const boundUpdate = updateUserAction.bind(null, id);
  const boundAddMoney = addMoneyAction.bind(null, id);
  const boundAddXp = addXpAction.bind(null, id);

  return (
    <div>
      <PageHeader title={user.username as string} description={`Discord ID: ${user.discord_id}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form action={boundUpdate} className={`${cardClass} lg:col-span-2`}>
          <p className="mb-4 text-sm font-medium text-hl-text">Profile</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Level</label>
              <input type="number" name="level" defaultValue={user.level as number} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>XP</label>
              <input type="number" name="xp" defaultValue={user.xp as number} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Money</label>
              <input type="number" name="money" defaultValue={user.money as number} className={inputClass} />
            </div>
          </div>
          <button type="submit" className={`${primaryButtonClass} mt-4`}>
            Save profile
          </button>
        </form>

        <div className={cardClass}>
          <p className="mb-4 text-sm font-medium text-hl-text">Quick economy actions</p>

          <form action={boundAddMoney} className="mb-3 flex gap-2">
            <input type="number" name="amount" placeholder="Amount" required className={inputClass} />
            <button type="submit" className={secondaryButtonClass}>
              + Money
            </button>
          </form>

          <form action={boundAddXp} className="flex gap-2">
            <input type="number" name="amount" placeholder="Amount" required className={inputClass} />
            <button type="submit" className={secondaryButtonClass}>
              + XP
            </button>
          </form>
        </div>
      </div>

      <div className={`${cardClass} mt-6`}>
        <p className="mb-4 text-sm font-medium text-hl-text">
          Inventory ({inventory.length} characters)
        </p>
        {inventory.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-hl-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-hl-surface-raised text-xs uppercase text-hl-faint">
                <tr>
                  <th className="px-3 py-2 font-medium">Local ID</th>
                  <th className="px-3 py-2 font-medium">Global ID</th>
                  <th className="px-3 py-2 font-medium">Level</th>
                  <th className="px-3 py-2 font-medium">Ascension</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hl-border">
                {inventory.map((item, i) => {
                  const c = item as Record<string, unknown>;
                  return (
                    <tr key={i}>
                      <td className="px-3 py-2 text-hl-muted">{String(c.local_id ?? "—")}</td>
                      <td className="px-3 py-2 text-hl-muted">{String(c.global_id ?? "—")}</td>
                      <td className="px-3 py-2 text-hl-muted">{String(c.level ?? "—")}</td>
                      <td className="px-3 py-2 text-hl-muted">{String(c.ascension ?? "—")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-hl-muted">This user has no characters yet.</p>
        )}
      </div>

      <details className={`${cardClass} mt-6`}>
        <summary className="cursor-pointer text-sm font-medium text-hl-text">
          Full raw record (quests, stats, daily, battle, dungeon…)
        </summary>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-hl-bg p-4 text-xs text-hl-muted">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
}
