import { WifiOff } from "lucide-react";

export function UnavailableNotice({ label }: { label: string }) {
  return (
    <div className="hl-animate-in flex items-start gap-3 rounded-xl border border-hl-danger/25 bg-hl-danger-soft px-4 py-3.5">
      <WifiOff size={16} className="mt-0.5 shrink-0 text-hl-danger" strokeWidth={1.75} />
      <p className="text-sm text-hl-text">
        <span className="font-medium">{label} is unavailable.</span>{" "}
        <span className="text-hl-muted">
          The dashboard couldn&apos;t reach the Bot API to fetch it — the bot
          may be offline, or the connection may be misconfigured.
        </span>
      </p>
    </div>
  );
}
