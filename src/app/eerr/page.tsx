"use client";

import { useApi } from "@/lib/hooks/use-api";
import { formatCLP } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ApiResponse, DashboardFinanciero } from "@/lib/types";

export default function EERRPage() {
  const { data, loading, error } = useApi<ApiResponse<DashboardFinanciero>>("dashboard-financiero");
  const fin = data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estado de Resultados</h1>

      <EmptyState loading={loading} error={error}>
        {fin?.message ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">{fin.message}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Ano {fin.año} - Los datos se cargan desde la tabla EERR en Supabase
              </p>
            </CardContent>
          </Card>
        ) : fin?.ytd ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* YTD Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen Acumulado (YTD {fin.año})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ingresos Totales</span>
                    <span className="font-medium">{formatCLP(fin.ytd.ingresos_totales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo Directo</span>
                    <span className="font-medium text-red-400">{formatCLP(fin.ytd.costo_directo)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Margen Bruto</span>
                    <span>{formatCLP(fin.ytd.margen_bruto)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gastos Operacionales</span>
                    <span className="font-medium text-red-400">{formatCLP(fin.ytd.total_gastos_op)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Utilidad Neta</span>
                    <span className={(fin.ytd.utilidad_neta || 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
                      {formatCLP(fin.ytd.utilidad_neta)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Basado en {fin.ytd.meses_reportados} meses reportados
                </p>
              </CardContent>
            </Card>

            {/* Mes Actual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mes Actual (Mes {fin.mes})</CardTitle>
              </CardHeader>
              <CardContent>
                {fin.mes_actual ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Ingresos</h4>
                    <div className="flex justify-between text-sm">
                      <span>Ventas</span>
                      <span>{formatCLP(fin.mes_actual.ingresos_ventas)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Servicios</span>
                      <span>{formatCLP(fin.mes_actual.venta_servicios)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Otros</span>
                      <span>{formatCLP(fin.mes_actual.ingresos_otros)}</span>
                    </div>
                    <Separator />
                    <h4 className="text-sm font-medium text-muted-foreground">Costos</h4>
                    <div className="flex justify-between text-sm">
                      <span>Compra Vehiculo</span>
                      <span>{formatCLP(fin.mes_actual.compra_vehiculo)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reparacion</span>
                      <span>{formatCLP(fin.mes_actual.reparacion_vehiculo)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Comision Venta</span>
                      <span>{formatCLP(fin.mes_actual.comision_venta)}</span>
                    </div>
                    <Separator />
                    <h4 className="text-sm font-medium text-muted-foreground">Gastos Operacionales</h4>
                    <div className="flex justify-between text-sm">
                      <span>Sueldos</span>
                      <span>{formatCLP(fin.mes_actual.sueldos)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Arriendo</span>
                      <span>{formatCLP(fin.mes_actual.arriendo)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Otros Gastos</span>
                      <span>{formatCLP(fin.mes_actual.otros_gastos)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Sin datos para el mes {fin.mes}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">Sin datos financieros disponibles</p>
            </CardContent>
          </Card>
        )}
      </EmptyState>
    </div>
  );
}
