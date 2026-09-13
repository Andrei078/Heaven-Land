import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { inputClass, labelClass, primaryButtonClass, cardClass } from "@/lib/ui";
import { createSeriesAction, updateSeriesAction, deleteSeriesAction } from "./actions";

export default async function SeriesPage() {
  let series: Record<string, Awaited<ReturnType<typeof botApi.series.list>>[string]> = {};
  let error = false;

  try {
    series = await botApi.series.list();
  } catch {
    error = true;
  }

  const rows = Object.values(series).sort((a, b) => a.id - b.id);

  return (
    <div>
      <PageHeader title="Series" description={`${rows.length} series`} />

      {error ? (
        <UnavailableNotice label="Series" />
      ) : (
        <>
          <details className={`${cardClass} mb-6`}>
            <summary className="cursor-pointer text-sm font-medium text-hl-text">
              + Create series
            </summary>
            <form action={createSeriesAction} className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Name</label>
                <input name="name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <input name="type" className={inputClass} placeholder="Anime, Game, ..." />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input name="description" className={inputClass} />
              </div>
              <div className="sm:col-span-3">
                <button type="submit" className={primaryButtonClass}>
                  Create
                </button>
              </div>
            </form>
          </details>

          <div className="space-y-3">
            {rows.map((s) => (
              <details key={s.id} className={cardClass}>
                <summary className="cursor-pointer text-sm text-hl-text">
                  <span className="font-medium">{s.name}</span>{" "}
                  <span className="text-hl-faint">#{s.id}</span>{" "}
                  <span className="text-hl-muted">— {s.type}</span>
                </summary>

                <form action={updateSeriesAction.bind(null, s.id)} className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input name="name" defaultValue={s.name} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <input name="type" defaultValue={s.type} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <input name="description" defaultValue={s.description} className={inputClass} />
                  </div>
                  <div className="sm:col-span-3 flex gap-3">
                    <button type="submit" className={primaryButtonClass}>
                      Save
                    </button>
                  </div>
                </form>

                <form action={deleteSeriesAction} className="mt-2">
                  <input type="hidden" name="id" value={s.id} />
                  <ConfirmButton message="Delete this series?">
                    Delete series
                  </ConfirmButton>
                </form>
              </details>
            ))}
            {rows.length === 0 && (
              <p className="text-sm text-hl-muted">No series yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
