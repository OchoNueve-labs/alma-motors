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
import type { Cliente } from "@/lib/types";

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  onSuccess: () => void;
}

export function ClienteForm({ open, onOpenChange, cliente, onSuccess }: ClienteFormProps) {
  const isEdit = !!cliente;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: cliente?.nombre || "",
    rut: cliente?.rut || "",
    email: cliente?.email || "",
    telefono: cliente?.telefono || "",
    direccion: cliente?.direccion || "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre || null,
        rut: form.rut || null,
        email: form.email || null,
        telefono: form.telefono || null,
        direccion: form.direccion || null,
      };

      if (isEdit) {
        await apiPut(`cliente-update?id=${cliente!.id}`, payload);
      } else {
        await apiPost("clientes", payload);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Nombre *</Label>
            <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </div>
          <div>
            <Label>RUT</Label>
            <Input value={form.rut} onChange={(e) => set("rut", e.target.value)} placeholder="12.345.678-9" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Telefono</Label>
            <Input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </div>
          <div>
            <Label>Direccion</Label>
            <Input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.nombre}>
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
