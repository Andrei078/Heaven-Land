export const inputClass =
  "w-full rounded-lg border border-hl-border bg-hl-surface-raised px-3 py-2 text-sm text-hl-text outline-none transition-colors placeholder:text-hl-faint focus:border-hl-accent-border focus:ring-2 focus:ring-hl-accent-soft";

export const labelClass = "mb-1.5 block text-xs font-medium text-hl-muted";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-hl-blue px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] transition-all hover:bg-hl-blue-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-hl-border bg-hl-surface-raised px-4 py-2 text-sm font-medium text-hl-text transition-all hover:border-hl-border-strong hover:bg-hl-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-hl-muted transition-colors hover:bg-hl-surface-raised hover:text-hl-text";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-hl-danger/30 bg-hl-danger-soft px-4 py-2 text-sm font-medium text-hl-danger transition-all hover:bg-hl-danger/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const cardClass =
  "rounded-xl border border-hl-border bg-hl-surface-solid p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]";

export const subtleCardClass = "rounded-xl border border-hl-border bg-hl-bg-elevated p-5";

export const tableWrapClass = "overflow-hidden rounded-xl border border-hl-border";

export const tableClass = "w-full text-left text-sm";

export const theadClass = "border-b border-hl-border bg-hl-surface-raised text-xs uppercase tracking-wide text-hl-faint";

export const trClass = "border-b border-hl-border bg-hl-surface-solid transition-colors last:border-b-0 hover:bg-hl-surface-raised/60";

export function badgeClass(tone: "success" | "danger" | "warning" | "neutral" | "accent" = "neutral"): string {
  const tones: Record<string, string> = {
    success: "bg-hl-success-soft text-hl-success",
    danger: "bg-hl-danger-soft text-hl-danger",
    warning: "bg-hl-warning-soft text-hl-warning",
    accent: "bg-hl-accent-soft text-hl-blue-strong",
    neutral: "bg-hl-surface-raised text-hl-muted",
  };
  return `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`;
}

export const skeletonClass = "animate-pulse rounded-lg bg-hl-surface-raised";
