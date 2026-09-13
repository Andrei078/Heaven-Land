import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { tableWrapClass, tableClass, theadClass, trClass } from "@/lib/ui";

export default async function RolesPage() {
  const roles = await botApi.server.roles().catch(() => null);

  return (
    <div>
      <PageHeader title="Roles" description="Live from Discord, via the bot." />

      {!roles ? (
        <UnavailableNotice label="Roles" />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Members</th>
                <th className="px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {roles
                .sort((a, b) => b.position - a.position)
                .map((r) => (
                  <tr key={r.id} className={trClass}>
                    <td className="px-4 py-3 text-hl-text">
                      {r.name}
                      {r.managed && <span className="ml-2 text-xs text-hl-faint">(managed)</span>}
                    </td>
                    <td className="px-4 py-3 text-hl-muted">{r.member_count}</td>
                    <td className="px-4 py-3 text-hl-muted">{r.color}</td>
                    <td className="px-4 py-3 text-hl-faint">{r.id}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
