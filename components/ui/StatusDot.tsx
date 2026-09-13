export function StatusDot({
  tone,
  pulse,
}: {
  tone: "success" | "danger" | "warning" | "neutral";
  pulse?: boolean;
}) {
  const colors: Record<string, string> = {
    success: "bg-hl-success",
    danger: "bg-hl-danger",
    warning: "bg-hl-warning",
    neutral: "bg-hl-faint",
  };

  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${colors[tone]}`}
        />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[tone]}`} />
    </span>
  );
}
