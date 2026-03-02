"use client";

import { useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { formatCLP, formatDate } from "@/lib/utils";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { VentaForm } from "@/components/forms/VentaForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { ApiResponse, Venta, NotaVenta } from "@/lib/types";

export default function VentasPage() {
  const ventasApi = useApi<ApiResponse<Venta[]>>("ventas");
  const notasApi = useApi<ApiResponse<NotaVenta[]>>("notas-venta");
  const [formOpen, setFormOpen] = useState(false);
  const [detailNota, setDetailNota] = useState<NotaVenta | null>(null);

  const ventas = ventasApi.data?.data || [];
  const notas = notasApi.data?.data || [];

  const ventasColumns: Column<Venta>[] = [
    { key: "id", label: "ID" },
    { key: "id_vehiculo", label: "Vehiculo" },
    { key: "modelo", label: "Modelo" },
    { key: "fecha_venta", label: "Fecha", render: (v) => formatDate(v.fecha_venta) },
    { key: "precio_final", label: "Precio Final", render: (v) => formatCLP(v.precio_final) },
    { key: "vendedor", label: "Vendedor" },
    {
      key: "utilidad_real",
      label: "Utilidad",
      render: (v) => (
        <span className={((v.utilidad_real || 0) >= 0) ? "text-emerald-400" : "text-red-400"}>
          {formatCLP(v.utilidad_real)}
        </span>
      ),
    },
  ];

  const notasColumns: Column<NotaVenta>[] = [
    { key: "id", label: "ID" },
    { key: "vehiculo_id", label: "Vehiculo" },
    { key: "cliente_nombre", label: "Cliente" },
    { key: "fecha", label: "Fecha", render: (n) => formatDate(n.fecha) },
    { key: "valor_final", label: "Valor Final", render: (n) => formatCLP(n.valor_final) },
    { key: "forma_pago", label: "Forma Pago" },
    { key: "vendedor", label: "Vendedor" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Venta
        </Button>
      </div>

      <Tabs defaultValue="ventas">
        <TabsList>
          <TabsTrigger value="ventas">Ventas ({ventas.length})</TabsTrigger>
          <TabsTrigger value="notas">Notas de Venta ({notas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas">
          <EmptyState loading={ventasApi.loading} error={ventasApi.error} empty={ventas.length === 0} emptyMessage="No hay ventas registradas">
            <DataTable
              data={ventas}
              columns={ventasColumns}
              searchKeys={["id", "id_vehiculo", "modelo", "vendedor", "cliente_nombre"]}
              searchPlaceholder="Buscar venta..."
            />
          </EmptyState>
        </TabsContent>

        <TabsContent value="notas">
          <EmptyState loading={notasApi.loading} error={notasApi.error} empty={notas.length === 0} emptyMessage="No hay notas de venta">
            <DataTable
              data={notas}
              columns={notasColumns}
              searchKeys={["id", "vehiculo_id", "cliente_nombre", "vendedor"]}
              searchPlaceholder="Buscar nota de venta..."
              onRowClick={(item) => setDetailNota(item)}
            />
          </EmptyState>
        </TabsContent>
      </Tabs>

      <VentaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => { ventasApi.refetch(); notasApi.refetch(); }}
      />

      <Dialog open={!!detailNota} onOpenChange={(open) => !open && setDetailNota(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nota de Venta: {detailNota?.id}</DialogTitle>
          </DialogHeader>
          {detailNota && (
            <Card>
              <CardContent className="pt-6 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground text-xs">Vehiculo</p><p className="font-medium">{detailNota.vehiculo_id || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Detalle</p><p className="font-medium">{detailNota.vehiculo_detalle || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Cliente</p><p className="font-medium">{detailNota.cliente_nombre || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">RUT</p><p className="font-medium">{detailNota.cliente_rut || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{detailNota.cliente_email || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Telefono</p><p className="font-medium">{detailNota.cliente_telefono || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Valor Vehiculo</p><p className="font-medium">{formatCLP(detailNota.valor_vehiculo)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Descuento</p><p className="font-medium">{formatCLP(detailNota.descuento)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Valor Final</p><p className="font-medium font-bold">{formatCLP(detailNota.valor_final)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Forma Pago</p><p className="font-medium">{detailNota.forma_pago || "-"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Retoma</p><p className="font-medium">{detailNota.tiene_retoma ? "Si" : "No"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Vendedor</p><p className="font-medium">{detailNota.vendedor || "-"}</p></div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
