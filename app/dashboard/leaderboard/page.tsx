import Link from "next/link";
import { Trophy } from "lucide-react";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { Badge } from "@/components/ui/Badge";
import { tableWrapClass, tableClass, theadClass, trClass } from "@/lib/ui";

const MEDAL_COLORS = ["text-hl-warning", "text-hl-muted", "text-[#cd7f32]"];

export default async function LeaderboardPage() {
  const entries = await botApi.leaderboard(25).catch(() => null);

  return (
    <div>
      <PageHeader title="Leaderboard" description="Top users by level, then XP." />

      {!entries ? (
        <UnavailableNotice label="Leaderboard" />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">XP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.discord_id} className={trClass}>
                  <td className="px-4 py-3">
                    {i < 3 ? (
                      <Trophy size={15} className={MEDAL_COLORS[i]} strokeWidth={1.75} />
                    ) : (
                      <span className="text-hl-faint">{i + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/users/${e.discord_id}`} className="text-hl-text hover:text-hl-blue-strong">
                      {e.username}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="accent">Lv. {e.level}</Badge>
                  </td>
                  <td className="px-4 py-3 text-hl-muted">{e.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
