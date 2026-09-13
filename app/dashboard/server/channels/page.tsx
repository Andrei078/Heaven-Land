import { botApi } from "@/lib/bot-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UnavailableNotice } from "@/components/dashboard/UnavailableNotice";
import { tableWrapClass, tableClass, theadClass, trClass } from "@/lib/ui";

export default async function ChannelsPage() {
  const channels = await botApi.server.channels().catch(() => null);

  return (
    <div>
      <PageHeader title="Channels" description="Live from Discord, via the bot." />

      {!channels ? (
        <UnavailableNotice label="Channels" />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.id} className={trClass}>
                  <td className="px-4 py-3 text-hl-text">{c.name}</td>
                  <td className="px-4 py-3 text-hl-muted">{c.type.replace("ChannelType.", "")}</td>
                  <td className="px-4 py-3 text-hl-faint">{c.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
