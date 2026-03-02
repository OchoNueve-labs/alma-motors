"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil } from "lucide-react";
import type { ApiResponse, Cliente } from "@/lib/types";

export default function ClientesPage() {
  const { data, loading, error, refetch } = useApi<ApiResponse<Cliente[]>>("clientes");
  const [formOpen, setFormOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);

  const clientes = data?.data || [];

  const columns: Column<Cliente>[] = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "rut", label: "RUT" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Telefono" },
    { key: "direccion", label: "Direccion" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => { setEditCliente(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo
        </Button>
      </div>

      <EmptyState loading={loading} error={error} empty={clientes.length === 0} emptyMessage="No hay clientes registrados">
        <DataTable
          data={clientes}
          columns={columns}
          searchKeys={["nombre", "rut", "email", "telefono"]}
          searchPlaceholder="Buscar por nombre, RUT, email..."
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
                  <DropdownMenuItem onClick={() => { setEditCliente(c); setFormOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </EmptyState>

      <ClienteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editCliente}
        onSuccess={refetch}
      />
    </div>
  );
}
