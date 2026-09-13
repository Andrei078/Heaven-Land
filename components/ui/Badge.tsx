import { badgeClass } from "@/lib/ui";

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "success" | "danger" | "warning" | "neutral" | "accent";
  children: React.ReactNode;
}) {
  return <span className={badgeClass(tone)}>{children}</span>;
}
