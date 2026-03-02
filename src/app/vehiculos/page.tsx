"use client";

import { useState, useMemo } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { formatCLP, formatDate } from "@/lib/utils";
import { apiDelete } from "@/lib/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { VehiculoForm } from "@/components/forms/VehiculoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import type { ApiResponse, Vehiculo } from "@/lib/types";

// Column definitions grouped by category
const COL_GENERAL = [
  { key: "patente", label: "Patente", sticky: true },
  { key: "codigo_interno", label: "Cod. Interno" },
  { key: "vehiculo", label: "Vehiculo" },
  { key: "modelo", label: "Modelo" },
  { key: "ano", label: "Ano" },
  { key: "estado", label: "Estado", type: "status" as const },
  { key: "km", label: "KM" },
  { key: "fecha_llegada", label: "F. Llegada", type: "date" as const },
  { key: "fecha_venta", label: "F. Venta", type: "date" as const },
  { key: "dias_stock", label: "Dias Stock" },
  { key: "mes", label: "Mes" },
  { key: "tipo_compra", label: "Tipo Compra" },
  { key: "forma_pago", label: "Forma Pago" },
  { key: "empresa_leasing", label: "Empresa/Leasing" },
  { key: "estado_financiamiento", label: "Est. Financ." },
  { key: "facturado", label: "Facturado" },
];

const COL_PRECIOS = [
  { key: "patente", label: "Patente", sticky: true },
  { key: "vehiculo", label: "Vehiculo" },
  { key: "estado", label: "Estado", type: "status" as const },
  { key: "precio_compra", label: "Precio Compra", type: "money" as const },
  { key: "total_inversion", label: "Total Inversion", type: "money" as const },
  { key: "precio_publicado", label: "P. Publicado", type: "money" as const },
  { key: "precio_venta", label: "P. Venta", type: "money" as const },
  { key: "utilidad_pre_comision", label: "Util. Pre Com.", type: "money" as const },
  { key: "utilidad_post_comision", label: "Util. Post Com.", type: "money" as const },
  { key: "utilidad_pct", label: "Util. %", type: "pct" as const },
  { key: "margen_bruto", label: "Margen Bruto", type: "money" as const },
  { key: "margen_neto", label: "Margen Neto", type: "money" as const },
];

const COL_PREPARACION = [
  { key: "patente", label: "Patente", sticky: true },
  { key: "vehiculo", label: "Vehiculo" },
  { key: "transferencia", label: "Transferencia", type: "money" as const },
  { key: "bencina", label: "Bencina", type: "money" as const },
  { key: "compra_repuesto", label: "Repuestos", type: "money" as const },
  { key: "pintura", label: "Pintura", type: "money" as const },
  { key: "pulido", label: "Pulido", type: "money" as const },
  { key: "polarizado", label: "Polarizado", type: "money" as const },
  { key: "radio", label: "Radio", type: "money" as const },
  { key: "tapiz", label: "Tapiz", type: "money" as const },
  { key: "volante", label: "Volante", type: "money" as const },
  { key: "llantas_neumaticos", label: "Llantas/Neum.", type: "money" as const },
  { key: "parachoque", label: "Parachoque", type: "money" as const },
  { key: "tapabarro", label: "Tapabarro", type: "money" as const },
  { key: "barras", label: "Barras", type: "money" as const },
  { key: "grua", label: "Grua", type: "money" as const },
  { key: "chofer", label: "Chofer", type: "money" as const },
  { key: "dpf", label: "DPF", type: "money" as const },
  { key: "cuatro_x_cuatro", label: "4x4", type: "money" as const },
  { key: "chasis", label: "Chasis", type: "money" as const },
  { key: "papeles", label: "Papeles", type: "money" as const },
];

const COL_COMISIONES = [
  { key: "patente", label: "Patente", sticky: true },
  { key: "vehiculo", label: "Vehiculo" },
  { key: "comision_compra", label: "Com. Compra", type: "money" as const },
  { key: "comision_vendedor", label: "Com. Vendedor", type: "money" as const },
  { key: "comision_financiamiento", label: "Com. Financ.", type: "money" as const },
  { key: "comision_pagada", label: "Com. Pagada" },
  { key: "comision", label: "Comision" },
  { key: "comision_para", label: "Com. Para" },
  { key: "monto_financiado", label: "Mto. Financiado", type: "money" as const },
  { key: "monto_retenido", label: "Mto. Retenido", type: "money" as const },
];

type ColDef = { key: string; label: string; sticky?: boolean; type?: "money" | "date" | "status" | "pct" };

function formatCell(v: Vehiculo, col: ColDef): React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (v as any)[col.key];
  if (raw == null || raw === "") return <span className="text-muted-foreground">-</span>;
  if (col.type === "money") return formatCLP(Number(raw));
  if (col.type === "date") return formatDate(String(raw));
  if (col.type === "status") return <StatusBadge status={String(raw)} />;
  if (col.type === "pct") return `${(Number(raw) * 100).toFixed(1)}%`;
  if (typeof raw === "boolean") return raw ? "Si" : "No";
  return String(raw);
}

export default function VehiculosPage() {
  const { data, loading, error, refetch } = useApi<ApiResponse<Vehiculo[]>>("vehiculos");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editVehiculo, setEditVehiculo] = useState<Vehiculo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const vehiculos = data?.data || [];
  const estados = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.estado).filter(Boolean))) as string[],
    [vehiculos]
  );

  const filtered = useMemo(() => {
    let list = vehiculos;
    if (estadoFilter !== "all") list = list.filter((v) => v.estado === estadoFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.patente?.toLowerCase().includes(q) ||
          v.vehiculo?.toLowerCase().includes(q) ||
          v.modelo?.toLowerCase().includes(q) ||
          v.codigo_interno?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vehiculos, estadoFilter, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`vehiculo-delete?patente=${deleteTarget.patente}`);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  function renderTable(columns: ColDef[]) {
    return (
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-max min-w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap ${
                    col.sticky ? "sticky left-0 z-10 bg-muted/90 backdrop-blur-sm" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-2 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.patente} className="border-b hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2 whitespace-nowrap ${
                      col.sticky ? "sticky left-0 z-10 bg-card font-medium" : ""
                    } ${col.type === "money" ? "text-right tabular-nums" : ""}`}
                  >
                    {formatCell(v, col)}
                  </td>
                ))}
                <td className="px-2 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditVehiculo(v); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(v)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehiculos</h1>
        <Button onClick={() => { setEditVehiculo(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar patente, vehiculo, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-72"
          />
        </div>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos ({vehiculos.length})</SelectItem>
            {estados.map((e) => (
              <SelectItem key={e} value={e}>
                {e} ({vehiculos.filter((v) => v.estado === e).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} resultados</span>
      </div>

      <EmptyState loading={loading} error={error} empty={filtered.length === 0} emptyMessage="No hay vehiculos">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="precios">Precios y Utilidad</TabsTrigger>
            <TabsTrigger value="preparacion">Preparacion</TabsTrigger>
            <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
          </TabsList>

          <TabsContent value="general">{renderTable(COL_GENERAL)}</TabsContent>
          <TabsContent value="precios">{renderTable(COL_PRECIOS)}</TabsContent>
          <TabsContent value="preparacion">{renderTable(COL_PREPARACION)}</TabsContent>
          <TabsContent value="comisiones">{renderTable(COL_COMISIONES)}</TabsContent>
        </Tabs>
      </EmptyState>

      <VehiculoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vehiculo={editVehiculo}
        onSuccess={refetch}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar vehiculo"
        description={`Estas seguro de eliminar el vehiculo ${deleteTarget?.patente}?`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
