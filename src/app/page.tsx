"use client";

import { useMemo } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { formatCLP, formatNumber, formatDate } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AlertasPanel } from "@/components/dashboard/AlertasPanel";
import { InventarioChart } from "@/components/dashboard/Charts";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  ShoppingCart,
  DollarSign,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Package,
  Clock,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import type {
  ApiResponse,
  Vehiculo,
  Venta,
  Compra,
  DashboardCompras,
  DashboardInventario,
  DashboardVentas,
  DashboardFinanciero,
  DashboardAlertas,
} from "@/lib/types";

export default function DashboardPage() {
  const compras = useApi<ApiResponse<DashboardCompras>>("dashboard-compras");
  const inventario = useApi<ApiResponse<DashboardInventario>>("dashboard-inventario");
  const ventas = useApi<ApiResponse<DashboardVentas>>("dashboard-ventas");
  const financiero = useApi<ApiResponse<DashboardFinanciero>>("dashboard-financiero");
  const alertas = useApi<ApiResponse<DashboardAlertas>>("dashboard-alertas");

  // Real data for summary tables
  const vehiculosApi = useApi<ApiResponse<Vehiculo[]>>("vehiculos");
  const ventasApi = useApi<ApiResponse<Venta[]>>("ventas");
  const comprasApi = useApi<ApiResponse<Compra[]>>("compras");

  const loading = inventario.loading || ventas.loading;
  const anyError = inventario.error || ventas.error;

  const inv = inventario.data?.data;
  const comp = compras.data?.data;
  const vnt = ventas.data?.data;
  const fin = financiero.data?.data;
  const alrt = alertas.data?.data;

  const vehiculos = vehiculosApi.data?.data || [];
  const ventasList = ventasApi.data?.data || [];
  const comprasList = comprasApi.data?.data || [];

  // Quick tables data
  const enStock = useMemo(
    () => vehiculos.filter((v) => v.estado === "En stock" || v.estado === "En preparacion").slice(0, 8),
    [vehiculos]
  );
  const enPreparacion = useMemo(
    () => vehiculos.filter((v) => v.estado === "En preparacion"),
    [vehiculos]
  );
  const ultimasVentas = useMemo(() => ventasList.slice(0, 8), [ventasList]);
  const ultimasCompras = useMemo(() => comprasList.slice(0, 6), [comprasList]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Centro de Mando</h1>

      <EmptyState loading={loading} error={anyError}>
        {/* KPI Row */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
            title="Utilidad Mes"
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

        {/* Quick Summary Tables Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Vehiculos en Stock */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Car className="h-4 w-4" /> Vehiculos en Stock
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {vehiculos.filter((v) => v.estado === "En stock").length} unidades
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {vehiculosApi.loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Patente</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Vehiculo</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estado</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Dias</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">P. Publicado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enStock.length === 0 ? (
                        <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Sin vehiculos en stock</td></tr>
                      ) : (
                        enStock.map((v) => (
                          <tr key={v.patente} className="border-b hover:bg-muted/30">
                            <td className="px-3 py-2 font-medium">{v.patente}</td>
                            <td className="px-3 py-2 text-muted-foreground">{v.vehiculo || "-"} {v.modelo || ""}</td>
                            <td className="px-3 py-2"><StatusBadge status={v.estado} /></td>
                            <td className="px-3 py-2 text-right tabular-nums">{v.dias_stock ?? "-"}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{v.precio_publicado ? formatCLP(v.precio_publicado) : "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ultimas Ventas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> Ultimas Ventas
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {ventasList.length} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ventasApi.loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Vehiculo</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Fecha</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Precio</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Vendedor</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Utilidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasVentas.length === 0 ? (
                        <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Sin ventas registradas</td></tr>
                      ) : (
                        ultimasVentas.map((v) => (
                          <tr key={v.id} className="border-b hover:bg-muted/30">
                            <td className="px-3 py-2 font-medium">{v.id_vehiculo || "-"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{formatDate(v.fecha_venta)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatCLP(v.precio_final)}</td>
                            <td className="px-3 py-2 text-muted-foreground">{v.vendedor || "-"}</td>
                            <td className={`px-3 py-2 text-right tabular-nums font-medium ${(v.utilidad_real || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {formatCLP(v.utilidad_real)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Compras + Preparacion Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Ultimas Compras */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Ultimas Compras
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {comp?.pendientes_transferencia || 0} pend. transferencia
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {comprasApi.loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Patente</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Marca/Modelo</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Valor</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Transf.</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasCompras.length === 0 ? (
                        <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Sin compras registradas</td></tr>
                      ) : (
                        ultimasCompras.map((c) => (
                          <tr key={c.id} className="border-b hover:bg-muted/30">
                            <td className="px-3 py-2 font-medium">{c.patente}</td>
                            <td className="px-3 py-2 text-muted-foreground">{c.marca || "-"} {c.modelo || ""}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatCLP(c.valor)}</td>
                            <td className="px-3 py-2">{c.transferido || "-"}</td>
                            <td className="px-3 py-2"><StatusBadge status={c.estado} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* En Preparacion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> En Preparacion
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {enPreparacion.length} vehiculos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {vehiculosApi.loading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Patente</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Vehiculo</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Dias</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Inversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enPreparacion.length === 0 ? (
                        <tr><td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">Ninguno en preparacion</td></tr>
                      ) : (
                        enPreparacion.slice(0, 6).map((v) => (
                          <tr key={v.patente} className="border-b hover:bg-muted/30">
                            <td className="px-3 py-2 font-medium">{v.patente}</td>
                            <td className="px-3 py-2 text-muted-foreground">{v.vehiculo || "-"} {v.modelo || ""}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{v.dias_stock ?? "-"}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{v.total_inversion ? formatCLP(v.total_inversion) : "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Row: Inventario + Financiero + Compras Summary */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Inventario Chart */}
          {inv?.por_estado ? (
            <InventarioChart porEstado={inv.por_estado} />
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-base">Inventario por Estado</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground text-center py-4">Sin datos</p></CardContent>
            </Card>
          )}

          {/* Compras Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Resumen Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Compras</span>
                  <span className="text-lg font-bold">{formatNumber(comp?.total_compras)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pendientes Transf.</span>
                  <span className="text-lg font-bold text-amber-400">{formatNumber(comp?.pendientes_transferencia)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compras del Mes</span>
                  <span className="text-lg font-bold">{formatNumber(comp?.compras_mes)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-sm font-medium">Gasto del Mes</span>
                  <span className="text-lg font-bold">{formatCLP(comp?.gasto_mes)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Prom. Dias Stock
                  </span>
                  <span className="text-lg font-bold">{formatNumber(inv?.promedio_dias_stock)} dias</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financiero Summary */}
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

        {/* Alertas */}
        {alrt && <AlertasPanel alertas={alrt.alertas || []} />}
      </EmptyState>
    </div>
  );
}
