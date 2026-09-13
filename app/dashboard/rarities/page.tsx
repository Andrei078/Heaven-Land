import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { inputClass, labelClass, primaryButtonClass, cardClass } from "@/lib/ui";
import { upsertRarityAction, deleteRarityAction } from "./actions";

export default async function RaritiesPage() {
  let rarities: Record<string, Awaited<ReturnType<typeof botApi.rarities.list>>[string]> = {};
  let error = false;

  try {
    rarities = await botApi.rarities.list();
  } catch {
    error = true;
  }

  const rows = Object.values(rarities);

  return (
    <div>
      <PageHeader title="Rarities" description={`${rows.length} rarities`} />

      {error ? (
        <UnavailableNotice label="Rarities" />
      ) : (
        <>
          <details className={`${cardClass} mb-6`}>
            <summary className="cursor-pointer text-sm font-medium text-hl-text">
              + Create rarity
            </summary>
            <RarityForm />
          </details>

          <div className="space-y-3">
            {rows.map((r) => (
              <details key={r.name} className={cardClass}>
                <summary className="cursor-pointer text-sm text-hl-text">
                  <span className="font-medium">{r.name}</span>{" "}
                  <span className="text-hl-muted">— {(r.chance * 100).toFixed(2)}% chance</span>
                </summary>
                <RarityForm rarity={r} locked />
                <form action={deleteRarityAction} className="mt-2">
                  <input type="hidden" name="name" value={r.name} />
                  <ConfirmButton message="Delete this rarity?">
                    Delete rarity
                  </ConfirmButton>
                </form>
              </details>
            ))}
            {rows.length === 0 && <p className="text-sm text-hl-muted">No rarities yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function RarityForm({
  rarity,
  locked,
}: {
  rarity?: Awaited<ReturnType<typeof botApi.rarities.list>>[string];
  locked?: boolean;
}) {
  return (
    <form action={upsertRarityAction} className="mt-4 grid gap-4 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Name</label>
        <input
          name="name"
          defaultValue={rarity?.name}
          required
          readOnly={locked}
          className={`${inputClass} ${locked ? "opacity-60" : ""}`}
        />
      </div>
      <div>
        <label className={labelClass}>Chance (0–1)</label>
        <input type="number" step="0.0001" name="chance" defaultValue={rarity?.chance} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Summon cost</label>
        <input type="number" name="summon_cost" defaultValue={rarity?.summon_cost} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Max ascension</label>
        <input type="number" name="max_ascension" defaultValue={rarity?.max_ascension} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Max level</label>
        <input type="number" name="max_level" defaultValue={rarity?.max_level} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Color (decimal)</label>
        <input type="number" name="color" defaultValue={rarity?.color} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Border label</label>
        <input name="border" defaultValue={rarity?.border} className={inputClass} />
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          name="special"
          defaultChecked={rarity?.special}
          className="h-4 w-4 rounded border-hl-border accent-[var(--hl-accent)]"
        />
        <label className="text-sm text-hl-text">Special</label>
      </div>
      <div className="sm:col-span-3">
        <button type="submit" className={primaryButtonClass}>
          Save
        </button>
      </div>
    </form>
  );
}
