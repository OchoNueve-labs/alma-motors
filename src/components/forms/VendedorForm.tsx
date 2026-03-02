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
import type { Vendedor } from "@/lib/types";

interface VendedorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendedor?: Vendedor | null;
  onSuccess: () => void;
}

export function VendedorForm({ open, onOpenChange, vendedor, onSuccess }: VendedorFormProps) {
  const isEdit = !!vendedor;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: vendedor?.nombre || "",
    telefono: vendedor?.telefono || "",
    email: vendedor?.email || "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre || null,
        telefono: form.telefono || null,
        email: form.email || null,
      };

      if (isEdit) {
        await apiPut(`vendedor-update?id=${vendedor!.id}`, payload);
      } else {
        await apiPost("vendedores", payload);
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
          <DialogTitle>{isEdit ? "Editar Vendedor" : "Nuevo Vendedor"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Nombre *</Label>
            <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </div>
          <div>
            <Label>Telefono</Label>
            <Input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
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
