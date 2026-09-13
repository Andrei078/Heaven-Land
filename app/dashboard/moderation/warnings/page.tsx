import { PageHeader } from "@/components/dashboard/PageHeader";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function Page() {
  return (
    <div>
      <PageHeader title="Warnings" />
      <ComingSoon title="Warnings" />
    </div>
  );
}
