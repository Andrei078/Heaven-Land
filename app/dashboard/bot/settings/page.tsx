import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { inputClass, labelClass, primaryButtonClass, cardClass } from "@/lib/ui";
import { updateSettingsAction } from "./actions";

export default async function BotSettingsPage() {
  const settings = await botApi.settings.get().catch(() => null);

  return (
    <div>
      <PageHeader
        title="Bot Settings"
        description="Global settings — these apply to every user, immediately."
      />

      {!settings ? (
        <UnavailableNotice label="Bot Settings" />
      ) : (
        <form action={updateSettingsAction} className={cardClass}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Bot name</label>
              <input name="bot_name" defaultValue={settings.bot_name} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Command prefix</label>
              <input name="prefix" defaultValue={settings.prefix} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Market tax</label>
              <input type="number" step="0.01" name="market_tax" defaultValue={settings.market_tax} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Summon cost</label>
              <input type="number" name="summon_cost" defaultValue={settings.summon_cost} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Daily cooldown (seconds)</label>
              <input type="number" name="daily_cooldown" defaultValue={settings.daily_cooldown} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Daily summon cooldown (seconds)</label>
              <input type="number" name="daily_summon_cooldown" defaultValue={settings.daily_summon_cooldown} className={inputClass} />
            </div>
          </div>

          <button type="submit" className={`${primaryButtonClass} mt-6`}>
            Save settings
          </button>
        </form>
      )}
    </div>
  );
}
