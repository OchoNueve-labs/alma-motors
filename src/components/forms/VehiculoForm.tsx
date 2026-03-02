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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { apiPost, apiPut } from "@/lib/api";
import type { Vehiculo } from "@/lib/types";

interface VehiculoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiculo?: Vehiculo | null;
  onSuccess: () => void;
}

export function VehiculoForm({ open, onOpenChange, vehiculo, onSuccess }: VehiculoFormProps) {
  const isEdit = !!vehiculo;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patente: vehiculo?.patente || "",
    vehiculo: vehiculo?.vehiculo || "",
    modelo: vehiculo?.modelo || "",
    ano: vehiculo?.ano?.toString() || "",
    estado: vehiculo?.estado || "En stock",
    km: vehiculo?.km?.toString() || "",
    precio_compra: vehiculo?.precio_compra?.toString() || "",
    precio_publicado: vehiculo?.precio_publicado?.toString() || "",
    tipo_compra: vehiculo?.tipo_compra || "",
    forma_pago: vehiculo?.forma_pago || "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        patente: form.patente.toUpperCase(),
        vehiculo: form.vehiculo || null,
        modelo: form.modelo || null,
        ano: form.ano ? Number(form.ano) : null,
        estado: form.estado,
        km: form.km ? Number(form.km) : null,
        precio_compra: form.precio_compra ? Number(form.precio_compra) : null,
        precio_publicado: form.precio_publicado ? Number(form.precio_publicado) : null,
        tipo_compra: form.tipo_compra || null,
        forma_pago: form.forma_pago || null,
      };

      if (isEdit) {
        await apiPut(`vehiculo-update?patente=${vehiculo!.patente}`, payload);
      } else {
        await apiPost("vehiculos", payload);
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
          <DialogTitle>{isEdit ? "Editar Vehiculo" : "Nuevo Vehiculo"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Patente *</Label>
              <Input
                value={form.patente}
                onChange={(e) => set("patente", e.target.value.toUpperCase())}
                maxLength={10}
                disabled={isEdit}
                placeholder="ABCD-12"
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => set("estado", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="En stock">En stock</SelectItem>
                  <SelectItem value="En preparacion">En preparacion</SelectItem>
                  <SelectItem value="Reservado">Reservado</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Vehiculo</Label>
            <Input value={form.vehiculo} onChange={(e) => set("vehiculo", e.target.value)} placeholder="Ej: Toyota Yaris" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modelo</Label>
              <Input value={form.modelo} onChange={(e) => set("modelo", e.target.value)} />
            </div>
            <div>
              <Label>Ano</Label>
              <Input type="number" value={form.ano} onChange={(e) => set("ano", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kilometraje</Label>
              <Input type="number" value={form.km} onChange={(e) => set("km", e.target.value)} />
            </div>
            <div>
              <Label>Tipo Compra</Label>
              <Input value={form.tipo_compra} onChange={(e) => set("tipo_compra", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Precio Compra</Label>
              <Input type="number" value={form.precio_compra} onChange={(e) => set("precio_compra", e.target.value)} />
            </div>
            <div>
              <Label>Precio Publicado</Label>
              <Input type="number" value={form.precio_publicado} onChange={(e) => set("precio_publicado", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Forma de Pago</Label>
            <Input value={form.forma_pago} onChange={(e) => set("forma_pago", e.target.value)} />
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
