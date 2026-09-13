import Link from "next/link";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { inputClass, primaryButtonClass, cardClass } from "@/lib/ui";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const result = q ? await botApi.users.list({ search: q, limit: 10 }).catch(() => null) : null;

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Inventories belong to individual users in the bot — search for one to view theirs."
      />

      <form method="get" className="mb-4 flex gap-3">
        <input type="text" name="q" defaultValue={q} placeholder="Username or Discord ID…" className={`${inputClass} max-w-sm`} />
        <button type="submit" className={primaryButtonClass}>
          Search
        </button>
      </form>

      {q && !result && <UnavailableNotice label="Inventory" />}

      {result && (
        <div className={`${cardClass} space-y-2`}>
          {result.items.length === 0 && <p className="text-sm text-hl-muted">No matches.</p>}
          {result.items.map((u) => (
            <Link
              key={u.discord_id}
              href={`/dashboard/users/${u.discord_id}`}
              className="block rounded-lg px-3 py-2 text-sm text-hl-text hover:bg-hl-surface-raised"
            >
              {u.username} <span className="text-hl-faint">— view inventory →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
