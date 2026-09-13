import { PageHeader } from "@/components/dashboard/PageHeader";
import { cardClass } from "@/lib/ui";

export default function BattlesPage() {
  return (
    <div>
      <PageHeader title="Battles" description="Battle / Dungeon system status." />

      <div className={cardClass}>
        <p className="text-sm text-hl-text">
          The battle/dungeon system is live in the bot (attack, heavy attack,
          shield, leave), but it doesn&apos;t have any bot-wide configuration
          yet — difficulty, enemy stats, etc. aren&apos;t stored as editable
          data.
        </p>
        <p className="mt-2 text-sm text-hl-muted">
          Per-user dungeon progress is visible on each user&apos;s profile
          page, under the raw record.
        </p>
      </div>
    </div>
  );
}
