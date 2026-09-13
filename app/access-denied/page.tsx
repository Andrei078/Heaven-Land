const REASONS: Record<string, { title: string; body: string }> = {
  insufficient_permissions: {
    title: "Administrator access required",
    body: "This dashboard is private and only available to Heaven Land administrators. Your Discord account doesn't currently have Administrator permission on the server.",
  },
  not_in_guild: {
    title: "Server membership required",
    body: "Your account isn't a member of the Heaven Land Discord server, which this panel controls.",
  },
  bot_unreachable: {
    title: "Bot is unreachable",
    body: "The dashboard couldn't reach the Heaven Land Bot API to verify your access. The bot may be offline or the Bot API connection may be misconfigured.",
  },
  oauth_cancelled: {
    title: "Sign-in cancelled",
    body: "The Discord sign-in was cancelled before it could complete.",
  },
  oauth_error: {
    title: "Sign-in failed",
    body: "Something went wrong verifying your Discord account. Please try signing in again.",
  },
};

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const info = (reason && REASONS[reason]) || {
    title: "Access denied",
    body: "This dashboard is private and only available to the Heaven Land owner.",
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-hl-bg px-6">
      <div className="w-full max-w-sm text-center">
        <p className="hl-gradient-text font-display text-2xl">Heaven Land</p>

        <div className="mt-8 rounded-2xl border border-hl-border bg-hl-surface-solid p-8">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-hl-danger-soft text-hl-danger">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-base font-semibold text-hl-text">
            {info.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-hl-muted">
            {info.body}
          </p>

          <a
            href="/login"
            className="mt-6 inline-block rounded-lg border border-hl-border px-4 py-2 text-sm font-medium text-hl-text transition-colors hover:border-hl-accent-border hover:text-hl-blue-strong"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </main>
  );
}
