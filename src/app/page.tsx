"use client";

import { useApi } from "@/lib/hooks/use-api";
import { formatCLP, formatNumber } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
import { InventarioChart } from "@/components/dashboard/Charts";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Car,
  ShoppingCart,
  DollarSign,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
} from "lucide-react";
import type {
  ApiResponse,
  DashboardCompras,
  DashboardInventario,
  DashboardVentas,
  DashboardFinanciero,
  DashboardAlertas,
} from "@/lib/types";

export default function DashboardPage() {
  const dashboard = useApi<ApiResponse<Record<string, unknown>>>("dashboard");
  const compras = useApi<ApiResponse<DashboardCompras>>("dashboard-compras");
  const inventario = useApi<ApiResponse<DashboardInventario>>("dashboard-inventario");
  const ventas = useApi<ApiResponse<DashboardVentas>>("dashboard-ventas");
  const financiero = useApi<ApiResponse<DashboardFinanciero>>("dashboard-financiero");
  const alertas = useApi<ApiResponse<DashboardAlertas>>("dashboard-alertas");

  const loading = dashboard.loading || compras.loading || inventario.loading || ventas.loading;
  const anyError = dashboard.error || compras.error || inventario.error || ventas.error;

  const inv = inventario.data?.data;
  const comp = compras.data?.data;
  const vnt = ventas.data?.data;
  const fin = financiero.data?.data;
  const alrt = alertas.data?.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <EmptyState loading={loading} error={anyError}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            title="En Stock"
            value={formatNumber(inv?.total_stock)}
            icon={Car}
            loading={inventario.loading}
          />
          <KpiCard
            title="Vendidos (mes)"
            value={formatNumber(vnt?.ventas_mes)}
            icon={Receipt}
            loading={ventas.loading}
          />
          <KpiCard
            title="Valor Inventario"
            value={formatCLP(inv?.valor_total)}
            icon={DollarSign}
            loading={inventario.loading}
          />
          <KpiCard
            title="Ingresos Ventas"
            value={formatCLP(vnt?.ingresos_mes)}
            icon={TrendingUp}
            loading={ventas.loading}
          />
          <KpiCard
            title="Utilidad Ventas"
            value={formatCLP(vnt?.utilidad_mes)}
            icon={DollarSign}
            loading={ventas.loading}
          />
          <KpiCard
            title="Alertas"
            value={formatNumber(alrt?.total)}
            icon={AlertTriangle}
            loading={alertas.loading}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Compras summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Compras</p>
                  <p className="text-xl font-bold">{formatNumber(comp?.total_compras)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes Transf.</p>
                  <p className="text-xl font-bold">{formatNumber(comp?.pendientes_transferencia)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compras Mes</p>
                  <p className="text-xl font-bold">{formatNumber(comp?.compras_mes)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto Mes</p>
                  <p className="text-xl font-bold">{formatCLP(comp?.gasto_mes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventario summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" /> Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-xl font-bold">{formatNumber(inv?.total_stock)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">{formatCLP(inv?.valor_total)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Promedio Dias Stock
                  </p>
                  <p className="text-xl font-bold">{formatNumber(inv?.promedio_dias_stock)} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {inv?.por_estado && <InventarioChart porEstado={inv.por_estado} />}

          {/* Financiero summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Resumen Financiero (YTD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {financiero.loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 rounded bg-muted animate-pulse" />
                  ))}
                </div>
              ) : fin?.message ? (
                <p className="text-sm text-muted-foreground text-center py-4">{fin.message}</p>
              ) : fin?.ytd ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ingresos Totales</span>
                    <span className="font-medium">{formatCLP(fin.ytd.ingresos_totales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Costo Directo</span>
                    <span className="font-medium">{formatCLP(fin.ytd.costo_directo)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Margen Bruto</span>
                    <span className="font-bold">{formatCLP(fin.ytd.margen_bruto)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gastos Operacionales</span>
                    <span className="font-medium">{formatCLP(fin.ytd.total_gastos_op)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Utilidad Neta</span>
                    <span className={`font-bold ${(fin.ytd.utilidad_neta || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {formatCLP(fin.ytd.utilidad_neta)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {fin.ytd.meses_reportados} meses reportados
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Sin datos financieros</p>
              )}
            </CardContent>
          </Card>
        </div>

        {alrt && <AlertasPanel alertas={alrt.alertas || []} />}
      </EmptyState>
    </div>
  );
}
