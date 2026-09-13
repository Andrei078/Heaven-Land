import Link from "next/link";
import { Plus, Pencil, ImageOff } from "lucide-react";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { Badge } from "@/components/ui/Badge";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { primaryButtonClass, inputClass, tableWrapClass, tableClass, theadClass, trClass } from "@/lib/ui";
import { deleteCharacterAction } from "@/app/dashboard/characters/actions";

const RARITY_TONE: Record<string, "neutral" | "accent" | "warning" | "success"> = {
  Common: "neutral",
  Rare: "accent",
  Epic: "warning",
  Legendary: "success",
};

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rarity?: string; series?: string; status?: string; sort?: string }>;
}) {
  const { q, rarity, series, status, sort } = await searchParams;

  let characters: Record<string, Awaited<ReturnType<typeof botApi.characters.list>>[string]> = {};
  let seriesMap: Record<string, { id: number; name: string }> = {};
  let error: string | null = null;

  try {
    [characters, seriesMap] = await Promise.all([botApi.characters.list(), botApi.series.list()]);
  } catch {
    error = "Characters";
  }

  let rows = Object.values(characters);
  const total = rows.length;

  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((c) => c.name.toLowerCase().includes(needle));
  }
  if (rarity) rows = rows.filter((c) => c.rarity === rarity);
  if (series) rows = rows.filter((c) => String(c.series_id) === series);
  if (status === "enabled") rows = rows.filter((c) => c.enabled);
  if (status === "disabled") rows = rows.filter((c) => !c.enabled);

  switch (sort) {
    case "level_desc":
      rows.sort((a, b) => b.level - a.level);
      break;
    case "name_asc":
      rows.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      rows.sort((a, b) => a.global_id - b.global_id);
  }

  const rarities = [...new Set(Object.values(characters).map((c) => c.rarity))].sort();

  return (
    <div>
      <PageHeader
        title="Characters"
        description={`${rows.length} of ${total} characters`}
        action={
          <Link href="/dashboard/characters/new" className={primaryButtonClass}>
            <Plus size={15} /> Create Character
          </Link>
        }
      />

      {error ? (
        <UnavailableNotice label={error} />
      ) : (
        <>
          <form className="mb-4 flex flex-wrap gap-2.5" method="get">
            <input type="text" name="q" defaultValue={q} placeholder="Search by name…" className={`${inputClass} max-w-[14rem]`} />
            <select name="rarity" defaultValue={rarity ?? ""} className={`${inputClass} max-w-[10rem]`}>
              <option value="">All rarities</option>
              {rarities.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select name="series" defaultValue={series ?? ""} className={`${inputClass} max-w-[12rem]`}>
              <option value="">All series</option>
              {Object.values(seriesMap).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select name="status" defaultValue={status ?? ""} className={`${inputClass} max-w-[9rem]`}>
              <option value="">Any status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <select name="sort" defaultValue={sort ?? ""} className={`${inputClass} max-w-[9rem]`}>
              <option value="">Sort: ID</option>
              <option value="name_asc">Sort: Name</option>
              <option value="level_desc">Sort: Level</option>
            </select>
            <button type="submit" className={primaryButtonClass}>
              Apply
            </button>
          </form>

          <div className={tableWrapClass}>
            <table className={tableClass}>
              <thead className={theadClass}>
                <tr>
                  <th className="px-4 py-3 font-medium">Character</th>
                  <th className="px-4 py-3 font-medium">Series</th>
                  <th className="px-4 py-3 font-medium">Rarity</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.global_id} className={trClass}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-hl-border bg-hl-surface-raised">
                          {c.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageOff size={14} className="text-hl-faint" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-hl-text">{c.name}</p>
                          <p className="text-xs text-hl-faint">#{c.global_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-hl-muted">{seriesMap[c.series_id]?.name ?? c.series_id}</td>
                    <td className="px-4 py-3">
                      <Badge tone={RARITY_TONE[c.rarity] ?? "neutral"}>{c.rarity}</Badge>
                    </td>
                    <td className="px-4 py-3 text-hl-muted">{c.level}</td>
                    <td className="px-4 py-3">
                      <Badge tone={c.enabled ? "success" : "danger"}>{c.enabled ? "Enabled" : "Disabled"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/characters/${c.global_id}`}
                          className="rounded-lg p-1.5 text-hl-muted transition-colors hover:bg-hl-surface-raised hover:text-hl-blue-strong"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <form action={deleteCharacterAction}>
                          <input type="hidden" name="id" value={c.global_id} />
                          <ConfirmButton
                            message={`Delete "${c.name}"? This can't be undone.`}
                            className="rounded-lg p-1.5 text-hl-muted transition-colors hover:bg-hl-danger-soft hover:text-hl-danger"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-hl-muted">
                      No characters match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
