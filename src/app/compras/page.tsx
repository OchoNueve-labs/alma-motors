"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { formatCLP } from "@/lib/utils";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CompraForm } from "@/components/forms/CompraForm";
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
import { Plus, MoreHorizontal, Pencil } from "lucide-react";
import type { ApiResponse, Compra } from "@/lib/types";

export default function ComprasPage() {
  const { data, loading, error, refetch } = useApi<ApiResponse<Compra[]>>("compras");
  const [transferidoFilter, setTransferidoFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editCompra, setEditCompra] = useState<Compra | null>(null);

  const compras = data?.data || [];
  const filtered = transferidoFilter === "all"
    ? compras
    : compras.filter((c) =>
        transferidoFilter === "si"
          ? c.transferido?.toLowerCase() === "si" || c.transferido?.toLowerCase() === "sí"
          : c.transferido?.toLowerCase() !== "si" && c.transferido?.toLowerCase() !== "sí"
      );

  const columns: Column<Compra>[] = [
    { key: "patente", label: "Patente" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "año", label: "Ano" },
    { key: "valor", label: "Valor", render: (c) => formatCLP(c.valor) },
    { key: "transferencia", label: "Transferencia", render: (c) => formatCLP(c.transferencia) },
    { key: "flete", label: "Flete", render: (c) => formatCLP(c.flete) },
    { key: "transferido", label: "Transferido", render: (c) => <StatusBadge status={c.transferido} /> },
    { key: "estado", label: "Estado", render: (c) => <StatusBadge status={c.estado} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compras</h1>
        <Button onClick={() => { setEditCompra(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nueva
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={transferidoFilter} onValueChange={setTransferidoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar transferido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="si">Transferidos</SelectItem>
            <SelectItem value="no">No transferidos</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} compras</span>
      </div>

      <EmptyState loading={loading} error={error} empty={filtered.length === 0} emptyMessage="No hay compras registradas">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["patente", "marca", "modelo", "proveedor"]}
          searchPlaceholder="Buscar por patente, marca, modelo..."
          actions={(item) => {
            const c = item;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setEditCompra(c); setFormOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </EmptyState>

      <CompraForm
        open={formOpen}
        onOpenChange={setFormOpen}
        compra={editCompra}
        onSuccess={refetch}
      />
    </div>
  );
}
