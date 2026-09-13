import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Banner } from "@/components/ui/Banner";
import { inputClass, labelClass, primaryButtonClass, cardClass } from "@/lib/ui";
import {
  banAction,
  unbanAction,
  muteAction,
  unmuteAction,
  cleanAction,
  addRoleAction,
  removeRoleAction,
} from "./actions";

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  const { ok, err } = await searchParams;

  return (
    <div>
      <PageHeader
        title="Moderation"
        description="Live actions against the Heaven Land Discord server. There's no persisted history yet — Warnings and Logs are coming soon."
      />

      {ok && <Banner tone="success">{ok}</Banner>}
      {err && <Banner tone="danger">{err}</Banner>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <p className="mb-4 text-sm font-medium text-hl-text">Ban / Unban</p>
          <form action={banAction} className="mb-3 space-y-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Reason</label>
              <input name="reason" className={inputClass} />
            </div>
            <ConfirmButton message="Ban this user from the server?">
              Ban
            </ConfirmButton>
          </form>
          <form action={unbanAction} className="space-y-3 border-t border-hl-border pt-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Reason</label>
              <input name="reason" className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Unban
            </button>
          </form>
        </div>

        <div className={cardClass}>
          <p className="mb-4 text-sm font-medium text-hl-text">Mute / Unmute (timeout)</p>
          <form action={muteAction} className="mb-3 space-y-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Minutes</label>
              <input type="number" name="minutes" defaultValue={10} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Reason</label>
              <input name="reason" className={inputClass} />
            </div>
            <ConfirmButton message="Timeout this user?">
              Mute
            </ConfirmButton>
          </form>
          <form action={unmuteAction} className="space-y-3 border-t border-hl-border pt-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Unmute
            </button>
          </form>
        </div>

        <div className={cardClass}>
          <p className="mb-4 text-sm font-medium text-hl-text">Clean messages</p>
          <form action={cleanAction} className="space-y-3">
            <div>
              <label className={labelClass}>Channel ID</label>
              <input name="channel_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Amount (max 100)</label>
              <input type="number" name="amount" defaultValue={10} max={100} className={inputClass} />
            </div>
            <ConfirmButton message="Delete these messages? This can't be undone.">
              Clean
            </ConfirmButton>
          </form>
        </div>

        <div className={cardClass}>
          <p className="mb-4 text-sm font-medium text-hl-text">Roles</p>
          <form action={addRoleAction} className="mb-3 space-y-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role ID</label>
              <input name="role_id" required className={inputClass} />
            </div>
            <button type="submit" className={primaryButtonClass}>
              Add role
            </button>
          </form>
          <form action={removeRoleAction} className="space-y-3 border-t border-hl-border pt-3">
            <div>
              <label className={labelClass}>User ID</label>
              <input name="user_id" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role ID</label>
              <input name="role_id" required className={inputClass} />
            </div>
            <ConfirmButton message="Remove this role from the user?">
              Remove role
            </ConfirmButton>
          </form>
        </div>
      </div>
    </div>
  );
}
