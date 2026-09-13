import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { discordAvatarUrlFromParts } from "@/lib/avatar";
import { botApi } from "@/lib/bot-api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const avatarUrl = discordAvatarUrlFromParts(session.sub, session.avatar);

  const [health, overview] = await Promise.all([
    botApi.health().catch(() => null),
    botApi.server.overview().catch(() => null),
  ]);

  return (
    <DashboardShell username={session.username} avatarUrl={avatarUrl} health={health} overview={overview}>
      {children}
    </DashboardShell>
  );
}
