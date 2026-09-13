import { CheckCircle2, XCircle } from "lucide-react";

export function Banner({ tone, children }: { tone: "success" | "danger"; children: React.ReactNode }) {
  const isSuccess = tone === "success";
  return (
    <div
      className={`hl-animate-in mb-4 flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm ${
        isSuccess
          ? "border-hl-success/25 bg-hl-success-soft text-hl-success"
          : "border-hl-danger/25 bg-hl-danger-soft text-hl-danger"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={16} strokeWidth={1.75} className="shrink-0" />
      ) : (
        <XCircle size={16} strokeWidth={1.75} className="shrink-0" />
      )}
      <span className="text-hl-text/90">{children}</span>
    </div>
  );
}
