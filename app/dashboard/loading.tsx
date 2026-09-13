import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-40" />
      <CardGridSkeleton count={4} />
    </div>
  );
}
