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
import { apiPost, apiPut } from "@/lib/api";
import type { Compra } from "@/lib/types";

interface CompraFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compra?: Compra | null;
  onSuccess: () => void;
}

export function CompraForm({ open, onOpenChange, compra, onSuccess }: CompraFormProps) {
  const isEdit = !!compra;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patente: compra?.patente || "",
    marca: compra?.marca || "",
    modelo: compra?.modelo || "",
    año: compra?.año?.toString() || "",
    valor: compra?.valor?.toString() || "",
    proveedor: compra?.proveedor || "",
    transferencia: compra?.transferencia?.toString() || "",
    flete: compra?.flete?.toString() || "",
    comprador: compra?.comprador || "",
    estado: compra?.estado || "",
    km: compra?.km?.toString() || "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        patente: form.patente.toUpperCase(),
        marca: form.marca || null,
        modelo: form.modelo || null,
        año: form.año ? Number(form.año) : null,
        valor: form.valor ? Number(form.valor) : null,
        proveedor: form.proveedor || null,
        transferencia: form.transferencia ? Number(form.transferencia) : null,
        flete: form.flete ? Number(form.flete) : null,
        comprador: form.comprador || null,
        estado: form.estado || null,
        km: form.km ? Number(form.km) : null,
      };

      if (isEdit) {
        await apiPut(`compra-update?patente=${compra!.patente}`, payload);
      } else {
        await apiPost("compras", payload);
      }
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
          <DialogTitle>{isEdit ? "Editar Compra" : "Nueva Compra"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Patente *</Label>
              <Input value={form.patente} onChange={(e) => set("patente", e.target.value.toUpperCase())} maxLength={10} disabled={isEdit} />
            </div>
            <div>
              <Label>Marca</Label>
              <Input value={form.marca} onChange={(e) => set("marca", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modelo</Label>
              <Input value={form.modelo} onChange={(e) => set("modelo", e.target.value)} />
            </div>
            <div>
              <Label>Ano</Label>
              <Input type="number" value={form.año} onChange={(e) => set("año", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor</Label>
              <Input type="number" value={form.valor} onChange={(e) => set("valor", e.target.value)} />
            </div>
            <div>
              <Label>Proveedor</Label>
              <Input value={form.proveedor} onChange={(e) => set("proveedor", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Transferencia</Label>
              <Input type="number" value={form.transferencia} onChange={(e) => set("transferencia", e.target.value)} />
            </div>
            <div>
              <Label>Flete</Label>
              <Input type="number" value={form.flete} onChange={(e) => set("flete", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Comprador</Label>
              <Input value={form.comprador} onChange={(e) => set("comprador", e.target.value)} />
            </div>
            <div>
              <Label>KM</Label>
              <Input type="number" value={form.km} onChange={(e) => set("km", e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.patente}>
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
