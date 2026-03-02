"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ALERTA_COLORS } from "@/lib/constants";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Alerta } from "@/lib/types";

const ALERTA_ICONS = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

interface AlertasPanelProps {
  alertas: Alerta[];
  loading?: boolean;
}

export function AlertasPanel({ alertas, loading }: AlertasPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alertas ({alertas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sin alertas</p>
        ) : (
          <div className="space-y-2">
            {alertas.map((alerta, i) => {
              const Icon = ALERTA_ICONS[alerta.nivel] || Info;
              return (
                <div
                  key={i}
                  className={cn("flex items-start gap-3 rounded-md border p-3", ALERTA_COLORS[alerta.nivel])}
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alerta.tipo}</p>
                    <p className="text-xs opacity-80 mt-0.5">{alerta.mensaje}</p>
                  </div>
                  {alerta.cantidad != null && (
                    <span className="text-sm font-bold">{alerta.cantidad}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
