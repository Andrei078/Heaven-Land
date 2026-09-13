import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { inputClass, labelClass, primaryButtonClass, cardClass } from "@/lib/ui";
import { createQuestAction, updateQuestAction, deleteQuestAction } from "./actions";

type Quest = Awaited<ReturnType<typeof botApi.quests.list>>[string];

export default async function QuestsPage() {
  let quests: Record<string, Quest> = {};
  let error = false;

  try {
    quests = await botApi.quests.list();
  } catch {
    error = true;
  }

  const rows = Object.values(quests).sort((a, b) => a.id - b.id);

  return (
    <div>
      <PageHeader title="Quests" description={`${rows.length} quests`} />

      {error ? (
        <UnavailableNotice label="Quests" />
      ) : (
        <>
          <details className={`${cardClass} mb-6`}>
            <summary className="cursor-pointer text-sm font-medium text-hl-text">+ Create quest</summary>
            <QuestForm action={createQuestAction} />
          </details>

          <div className="space-y-3">
            {rows.map((q) => (
              <details key={q.id} className={cardClass}>
                <summary className="cursor-pointer text-sm text-hl-text">
                  <span className="font-medium">{q.name}</span>{" "}
                  <span className="text-hl-faint">#{q.id}</span>{" "}
                  <span className="text-hl-muted">— {q.difficulty}, {q.type}</span>
                  {!q.enabled && <span className="ml-2 text-hl-danger">(disabled)</span>}
                </summary>
                <QuestForm quest={q} action={updateQuestAction.bind(null, q.id)} />
                <form action={deleteQuestAction} className="mt-2">
                  <input type="hidden" name="id" value={q.id} />
                  <ConfirmButton message="Delete this quest?">
                    Delete quest
                  </ConfirmButton>
                </form>
              </details>
            ))}
            {rows.length === 0 && <p className="text-sm text-hl-muted">No quests yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function QuestForm({
  quest,
  action,
}: {
  quest?: Quest;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="mt-4 grid gap-4 sm:grid-cols-3">
      <div className="sm:col-span-3">
        <label className={labelClass}>Name</label>
        <input name="name" defaultValue={quest?.name} required className={inputClass} />
      </div>
      <div className="sm:col-span-3">
        <label className={labelClass}>Description</label>
        <textarea name="description" defaultValue={quest?.description} rows={2} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Type</label>
        <input name="type" defaultValue={quest?.type} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Difficulty</label>
        <input name="difficulty" defaultValue={quest?.difficulty} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Target</label>
        <input type="number" name="target" defaultValue={quest?.target} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Min level</label>
        <input type="number" name="min_level" defaultValue={quest?.min_level} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Max level</label>
        <input type="number" name="max_level" defaultValue={quest?.max_level} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Reward XP</label>
        <input type="number" name="reward_xp" defaultValue={quest?.rewards?.xp as number} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Reward money</label>
        <input type="number" name="reward_money" defaultValue={quest?.rewards?.money as number} className={inputClass} />
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input type="checkbox" name="repeatable" defaultChecked={quest?.repeatable} className="h-4 w-4 rounded border-hl-border accent-[var(--hl-accent)]" />
        <label className="text-sm text-hl-text">Repeatable</label>
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input type="checkbox" name="enabled" defaultChecked={quest?.enabled ?? true} className="h-4 w-4 rounded border-hl-border accent-[var(--hl-accent)]" />
        <label className="text-sm text-hl-text">Enabled</label>
      </div>
      <div className="sm:col-span-3">
        <button type="submit" className={primaryButtonClass}>
          Save
        </button>
      </div>
    </form>
  );
}
