"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCLP } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";

const MESES = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface EERRRow {
  mes: number;
  venta_vehiculos: number;
  venta_servicios: number;
  otros_ingresos: number;
  ingresos_totales: number;
  compra_vehiculo: number;
  reparacion_vehiculo: number;
  comision_venta: number;
  costo_directo: number;
  margen_bruto: number;
  sueldos: number;
  resp_sociales: number;
  arriendo: number;
  gastos_comunes: number;
  servicios_contables: number;
  otros_gastos: number;
  total_gastos_op: number;
  utilidad_antes_impuesto: number;
  utilidad_neta: number;
}

interface EERRData {
  rows: EERRRow[];
  ytd: {
    ingresos_totales: number;
    costo_directo: number;
    margen_bruto: number;
    total_gastos_op: number;
    utilidad_neta: number;
    meses_reportados: number;
  };
  year: number;
}

export default function EERRPage() {
  const [year, setYear] = useState("2025");
  const [data, setData] = useState<EERRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/eerr?year=${year}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error?.message || "Error");
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rows = data?.rows || [];
  const ytd = data?.ytd;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estado de Resultados</h1>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <EmptyState loading={loading} error={error} empty={rows.length === 0} emptyMessage={`No hay datos de EERR para ${year}`}>
        {/* YTD Summary Cards */}
        {ytd && (
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Ingresos Totales</p>
                <p className="text-lg font-bold mt-1">{formatCLP(ytd.ingresos_totales)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Costo Directo</p>
                <p className="text-lg font-bold mt-1 text-red-400">{formatCLP(ytd.costo_directo)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Margen Bruto</p>
                <p className="text-lg font-bold mt-1">{formatCLP(ytd.margen_bruto)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Gastos Op.</p>
                <p className="text-lg font-bold mt-1 text-red-400">{formatCLP(ytd.total_gastos_op)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Utilidad Neta</p>
                <p className={`text-lg font-bold mt-1 flex items-center gap-1 ${ytd.utilidad_neta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {ytd.utilidad_neta >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {formatCLP(ytd.utilidad_neta)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{ytd.meses_reportados} meses</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Breakdown Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detalle Mensual {year}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-max min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground sticky left-0 z-10 bg-muted/90 backdrop-blur-sm min-w-[180px]">Concepto</th>
                    {rows.map((r) => (
                      <th key={r.mes} className="px-3 py-2.5 text-right font-medium text-muted-foreground min-w-[110px]">
                        {MESES[r.mes]}
                      </th>
                    ))}
                    {ytd && <th className="px-3 py-2.5 text-right font-medium text-primary min-w-[120px]">YTD</th>}
                  </tr>
                </thead>
                <tbody>
                  {/* INGRESOS */}
                  <tr className="bg-muted/20">
                    <td colSpan={rows.length + 2} className="px-3 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Ingresos</td>
                  </tr>
                  <Row label="Venta Vehiculos" rows={rows} field="venta_vehiculos" ytdVal={ytd ? rows.reduce((s, r) => s + (r.venta_vehiculos || 0), 0) : undefined} />
                  <Row label="Venta Servicios" rows={rows} field="venta_servicios" ytdVal={ytd ? rows.reduce((s, r) => s + (r.venta_servicios || 0), 0) : undefined} />
                  <Row label="Otros Ingresos" rows={rows} field="otros_ingresos" ytdVal={ytd ? rows.reduce((s, r) => s + (r.otros_ingresos || 0), 0) : undefined} />
                  <Row label="Ingresos Totales" rows={rows} field="ingresos_totales" bold ytdVal={ytd?.ingresos_totales} />

                  <tr><td colSpan={rows.length + 2}><Separator /></td></tr>

                  {/* COSTOS */}
                  <tr className="bg-muted/20">
                    <td colSpan={rows.length + 2} className="px-3 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Costos Directos</td>
                  </tr>
                  <Row label="Compra Vehiculo" rows={rows} field="compra_vehiculo" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.compra_vehiculo || 0), 0) : undefined} />
                  <Row label="Reparacion Vehiculo" rows={rows} field="reparacion_vehiculo" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.reparacion_vehiculo || 0), 0) : undefined} />
                  <Row label="Comision Venta" rows={rows} field="comision_venta" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.comision_venta || 0), 0) : undefined} />
                  <Row label="Costo Directo" rows={rows} field="costo_directo" bold negative ytdVal={ytd?.costo_directo} />
                  <Row label="Margen Bruto" rows={rows} field="margen_bruto" bold highlight ytdVal={ytd?.margen_bruto} />

                  <tr><td colSpan={rows.length + 2}><Separator /></td></tr>

                  {/* GASTOS OPERACIONALES */}
                  <tr className="bg-muted/20">
                    <td colSpan={rows.length + 2} className="px-3 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Gastos Operacionales</td>
                  </tr>
                  <Row label="Sueldos" rows={rows} field="sueldos" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.sueldos || 0), 0) : undefined} />
                  <Row label="Resp. Sociales" rows={rows} field="resp_sociales" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.resp_sociales || 0), 0) : undefined} />
                  <Row label="Arriendo" rows={rows} field="arriendo" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.arriendo || 0), 0) : undefined} />
                  <Row label="Gastos Comunes" rows={rows} field="gastos_comunes" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.gastos_comunes || 0), 0) : undefined} />
                  <Row label="Serv. Contables" rows={rows} field="servicios_contables" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.servicios_contables || 0), 0) : undefined} />
                  <Row label="Otros Gastos" rows={rows} field="otros_gastos" negative ytdVal={ytd ? rows.reduce((s, r) => s + (r.otros_gastos || 0), 0) : undefined} />
                  <Row label="Total Gastos Op." rows={rows} field="total_gastos_op" bold negative ytdVal={ytd?.total_gastos_op} />

                  <tr><td colSpan={rows.length + 2}><Separator /></td></tr>

                  {/* RESULTADO */}
                  <tr className="bg-muted/20">
                    <td colSpan={rows.length + 2} className="px-3 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Resultado</td>
                  </tr>
                  <Row label="Utilidad Neta" rows={rows} field="utilidad_neta" bold highlight ytdVal={ytd?.utilidad_neta} />
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </EmptyState>
    </div>
  );
}

function Row({
  label,
  rows,
  field,
  bold,
  negative,
  highlight,
  ytdVal,
}: {
  label: string;
  rows: EERRRow[];
  field: keyof EERRRow;
  bold?: boolean;
  negative?: boolean;
  highlight?: boolean;
  ytdVal?: number;
}) {
  return (
    <tr className="border-b hover:bg-muted/30">
      <td className={`px-3 py-2 sticky left-0 z-10 bg-card whitespace-nowrap ${bold ? "font-semibold" : "text-muted-foreground"}`}>
        {label}
      </td>
      {rows.map((r) => {
        const val = r[field] as number;
        const colorClass = highlight
          ? val >= 0 ? "text-emerald-400" : "text-red-400"
          : negative && val > 0 ? "text-red-400" : "";
        return (
          <td key={r.mes} className={`px-3 py-2 text-right tabular-nums whitespace-nowrap ${bold ? "font-semibold" : ""} ${colorClass}`}>
            {val ? formatCLP(val) : <span className="text-muted-foreground">-</span>}
          </td>
        );
      })}
      {ytdVal !== undefined && (
        <td className={`px-3 py-2 text-right tabular-nums whitespace-nowrap font-semibold ${highlight ? (ytdVal >= 0 ? "text-emerald-400" : "text-red-400") : ""}`}>
          {formatCLP(ytdVal)}
        </td>
      )}
    </tr>
  );
}
