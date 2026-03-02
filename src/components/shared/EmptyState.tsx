import { Loader2, AlertCircle, Inbox } from "lucide-react";

interface EmptyStateProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export function EmptyState({ loading, error, empty, emptyMessage, children }: EmptyStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p className="text-sm">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <AlertCircle className="h-8 w-8 mb-3" />
        <p className="text-sm font-medium">Error al cargar datos</p>
        <p className="text-xs mt-1 text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Inbox className="h-8 w-8 mb-3" />
        <p className="text-sm">{emptyMessage || "No hay datos disponibles"}</p>
      </div>
    );
  }

  return <>{children}</>;
}
