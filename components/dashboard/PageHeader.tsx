export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.7rem] leading-tight text-hl-text">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-hl-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
