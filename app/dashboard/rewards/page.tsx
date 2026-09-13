import Link from "next/link";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { secondaryButtonClass, cardClass } from "@/lib/ui";

export default async function RewardsPage() {
  const quests = await botApi.quests.list().catch(() => null);

  return (
    <div>
      <PageHeader
        title="Rewards"
        description="Rewards aren't a separate system in the bot — each quest carries its own XP and money reward."
      />

      {!quests ? (
        <UnavailableNotice label="Rewards" />
      ) : (
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-hl-text">{Object.keys(quests).length} quests with rewards</p>
            <Link href="/dashboard/quests" className={secondaryButtonClass}>
              Manage in Quests →
            </Link>
          </div>
          <div className="space-y-2">
            {Object.values(quests).map((q) => (
              <div key={q.id} className="flex items-center justify-between border-t border-hl-border py-2 text-sm first:border-t-0">
                <span className="text-hl-text">{q.name}</span>
                <span className="text-hl-muted">
                  {(q.rewards?.xp as number) ?? 0} XP · {(q.rewards?.money as number) ?? 0} money
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
