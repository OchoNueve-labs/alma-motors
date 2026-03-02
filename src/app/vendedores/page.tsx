"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { VendedorForm } from "@/components/forms/VendedorForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil } from "lucide-react";
import type { ApiResponse, Vendedor } from "@/lib/types";

export default function VendedoresPage() {
  const { data, loading, error, refetch } = useApi<ApiResponse<Vendedor[]>>("vendedores");
  const [formOpen, setFormOpen] = useState(false);
  const [editVendedor, setEditVendedor] = useState<Vendedor | null>(null);

  const vendedores = data?.data || [];

  const columns: Column<Vendedor>[] = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "telefono", label: "Telefono" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendedores</h1>
        <Button onClick={() => { setEditVendedor(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo
        </Button>
      </div>

      <EmptyState loading={loading} error={error} empty={vendedores.length === 0} emptyMessage="No hay vendedores registrados">
        <DataTable
          data={vendedores}
          columns={columns}
          searchKeys={["nombre", "email", "telefono"]}
          searchPlaceholder="Buscar por nombre, email..."
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
                  <DropdownMenuItem onClick={() => { setEditVendedor(v); setFormOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </EmptyState>

      <VendedorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vendedor={editVendedor}
        onSuccess={refetch}
      />
    </div>
  );
}
