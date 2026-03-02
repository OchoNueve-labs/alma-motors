"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { formatCLP, formatNumber } from "@/lib/utils";
import { apiDelete } from "@/lib/api";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { VehiculoForm } from "@/components/forms/VehiculoForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { ApiResponse, Vehiculo } from "@/lib/types";

export default function VehiculosPage() {
  const { data, loading, error, refetch } = useApi<ApiResponse<Vehiculo[]>>("vehiculos");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editVehiculo, setEditVehiculo] = useState<Vehiculo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detailVehiculo, setDetailVehiculo] = useState<Vehiculo | null>(null);

  const vehiculos = data?.data || [];
  const filtered = estadoFilter === "all"
    ? vehiculos
    : vehiculos.filter((v) => v.estado === estadoFilter);

  const estados = Array.from(new Set(vehiculos.map((v) => v.estado).filter(Boolean))) as string[];

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

  const columns: Column<Vehiculo>[] = [
    { key: "patente", label: "Patente" },
    { key: "vehiculo", label: "Vehiculo" },
    { key: "modelo", label: "Modelo" },
    { key: "ano", label: "Ano" },
    {
      key: "estado",
      label: "Estado",
      render: (v) => <StatusBadge status={v.estado} />,
    },
    {
      key: "precio_compra",
      label: "Precio Compra",
      render: (v) => formatCLP(v.precio_compra),
    },
    {
      key: "precio_venta",
      label: "Precio Venta",
      render: (v) => formatCLP(v.precio_venta),
    },
    {
      key: "dias_stock",
      label: "Dias Stock",
      render: (v) => formatNumber(v.dias_stock),
    },
    {
      key: "utilidad_post_comision",
      label: "Utilidad",
      render: (v) => (
        <span className={((v.utilidad_post_comision || 0) >= 0) ? "text-emerald-400" : "text-red-400"}>
          {formatCLP(v.utilidad_post_comision)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehiculos</h1>
        <Button onClick={() => { setEditVehiculo(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {estados.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} vehiculos
        </span>
      </div>

      <EmptyState loading={loading} error={error} empty={filtered.length === 0} emptyMessage="No hay vehiculos registrados">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["patente", "vehiculo", "modelo"]}
          searchPlaceholder="Buscar por patente, vehiculo o modelo..."
          onRowClick={(item) => setDetailVehiculo(item)}
          actions={(item) => {
            const v = item;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
            );
          }}
        />
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

      {/* Detail dialog */}
      <Dialog open={!!detailVehiculo} onOpenChange={(open) => !open && setDetailVehiculo(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle: {detailVehiculo?.patente}</DialogTitle>
          </DialogHeader>
          {detailVehiculo && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {Object.entries(detailVehiculo).map(([key, val]) => (
                <div key={key}>
                  <p className="text-muted-foreground text-xs">{key}</p>
                  <p className="font-medium">{val != null ? String(val) : "-"}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
