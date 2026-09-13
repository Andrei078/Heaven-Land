import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-40" />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
