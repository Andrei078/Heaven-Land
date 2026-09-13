import Link from "next/link";
import { Search } from "lucide-react";
import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { Badge } from "@/components/ui/Badge";
import { inputClass, primaryButtonClass, tableWrapClass, tableClass, theadClass, trClass } from "@/lib/ui";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const result = await botApi.users.list({ search: q, limit: 50 }).catch(() => null);

  return (
    <div>
      <PageHeader title="Users" description={result ? `${result.total} total users` : undefined} />

      {!result ? (
        <UnavailableNotice label="Users" />
      ) : (
        <>
          <form method="get" className="mb-4 flex gap-2.5">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by username or Discord ID…"
              className={`${inputClass} max-w-sm`}
            />
            <button type="submit" className={primaryButtonClass}>
              <Search size={14} /> Search
            </button>
          </form>

          <div className={tableWrapClass}>
            <table className={tableClass}>
              <thead className={theadClass}>
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Discord ID</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">XP</th>
                  <th className="px-4 py-3 font-medium">Money</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((u) => (
                  <tr key={u.discord_id} className={trClass}>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/users/${u.discord_id}`} className="text-hl-text hover:text-hl-blue-strong">
                        {u.username}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-hl-faint">{u.discord_id}</td>
                    <td className="px-4 py-3">
                      <Badge tone="accent">Lv. {u.level}</Badge>
                    </td>
                    <td className="px-4 py-3 text-hl-muted">{u.xp.toLocaleString()}</td>
                    <td className="px-4 py-3 text-hl-muted">{u.money.toLocaleString()}</td>
                  </tr>
                ))}
                {result.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-hl-muted">
                      No users found.
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
