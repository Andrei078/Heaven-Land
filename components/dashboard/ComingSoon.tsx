import { Clock } from "lucide-react";

export function ComingSoon({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="hl-animate-in rounded-xl border border-dashed border-hl-border bg-hl-bg-elevated px-8 py-14 text-center">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-hl-border bg-hl-surface-raised text-hl-faint">
        <Clock size={18} strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-hl-text">{title} is coming soon</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-hl-muted">
        {note ??
          "This isn't implemented in the Heaven Land bot yet, so there's nothing real to show here. It'll appear once the underlying bot feature exists."}
      </p>
    </div>
  );
}
