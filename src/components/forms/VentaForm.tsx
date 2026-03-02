"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";

interface VentaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VentaForm({ open, onOpenChange, onSuccess }: VentaFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id_vehiculo: "",
    id_cliente: "",
    modelo: "",
    precio_final: "",
    forma_pago: "",
    cliente_nombre: "",
    cliente_telefono: "",
    vendedor: "",
    vendedor_id: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiPost("ventas", {
        id_vehiculo: form.id_vehiculo || null,
        id_cliente: form.id_cliente || null,
        modelo: form.modelo || null,
        precio_final: form.precio_final ? Number(form.precio_final) : 0,
        forma_pago: form.forma_pago || null,
        cliente_nombre: form.cliente_nombre || null,
        cliente_telefono: form.cliente_telefono || null,
        vendedor: form.vendedor || null,
        vendedor_id: form.vendedor_id || null,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Venta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Patente Vehiculo *</Label>
              <Input value={form.id_vehiculo} onChange={(e) => set("id_vehiculo", e.target.value.toUpperCase())} />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input value={form.modelo} onChange={(e) => set("modelo", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Precio Final *</Label>
              <Input type="number" value={form.precio_final} onChange={(e) => set("precio_final", e.target.value)} />
            </div>
            <div>
              <Label>Forma de Pago</Label>
              <Input value={form.forma_pago} onChange={(e) => set("forma_pago", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cliente Nombre</Label>
              <Input value={form.cliente_nombre} onChange={(e) => set("cliente_nombre", e.target.value)} />
            </div>
            <div>
              <Label>Cliente Telefono</Label>
              <Input value={form.cliente_telefono} onChange={(e) => set("cliente_telefono", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vendedor</Label>
              <Input value={form.vendedor} onChange={(e) => set("vendedor", e.target.value)} />
            </div>
            <div>
              <Label>ID Cliente</Label>
              <Input value={form.id_cliente} onChange={(e) => set("id_cliente", e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.id_vehiculo}>
            {loading ? "Guardando..." : "Registrar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
