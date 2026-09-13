import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="hl-brand-glow relative flex min-h-screen items-center justify-center overflow-hidden bg-hl-bg px-6">
      <div className="hl-gatefield pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative w-full max-w-sm">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-hl-blue to-hl-violet text-lg font-bold text-white shadow-lg shadow-hl-blue/20">
            H
          </div>
          <p className="hl-gradient-text font-display text-3xl">Heaven Land</p>
          <p className="mt-2 text-sm text-hl-muted">Private Bot Control Panel</p>
        </div>

        <div className="rounded-2xl border border-hl-border bg-hl-surface-solid/80 p-8 backdrop-blur-sm">
          <p className="mb-6 text-center text-sm leading-relaxed text-hl-muted">
            This panel controls a private Discord bot. Sign in with the
            Discord account that has Administrator access on the server.
          </p>

          <a
            href="/api/auth/discord"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4a55d6]"
          >
            <DiscordMark />
            Continue with Discord
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-hl-faint">
          Access requires Administrator permission on the Heaven Land server.
        </p>
      </div>
    </main>
  );
}

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.8 19.8 0 0 0 15.885 3c-.211.375-.457.88-.626 1.281a18.3 18.3 0 0 0-5.518 0A12.6 12.6 0 0 0 9.115 3a19.7 19.7 0 0 0-4.435 1.372C1.914 8.146 1.165 11.81 1.539 15.423a19.9 19.9 0 0 0 5.993 3.03c.483-.66.913-1.36 1.283-2.098a12.9 12.9 0 0 1-2.021-.973c.17-.124.336-.253.497-.386 3.899 1.8 8.126 1.8 11.977 0 .163.133.329.262.497.386-.641.381-1.317.708-2.023.974.37.738.8 1.438 1.283 2.098a19.85 19.85 0 0 0 6-3.031c.472-4.188-.6-7.815-2.708-11.054ZM8.68 13.22c-1.17 0-2.13-1.066-2.13-2.375 0-1.31.94-2.376 2.13-2.376 1.199 0 2.15 1.076 2.13 2.376 0 1.309-.94 2.375-2.13 2.375Zm6.652 0c-1.17 0-2.13-1.066-2.13-2.375 0-1.31.94-2.376 2.13-2.376 1.2 0 2.15 1.076 2.13 2.376 0 1.309-.93 2.375-2.13 2.375Z" />
    </svg>
  );
}
