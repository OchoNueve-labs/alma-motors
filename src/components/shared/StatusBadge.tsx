import { cn } from "@/lib/utils";
import { ESTADO_COLORS } from "@/lib/constants";

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">-</span>;

  const colorClass = ESTADO_COLORS[status] || "bg-secondary text-secondary-foreground border-border";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", colorClass)}>
      {status}
    </span>
  );
}
