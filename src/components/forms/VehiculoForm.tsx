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
import { Separator } from "@/components/ui/separator";
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

const s = (v: unknown) => (v != null ? String(v) : "");

export function VehiculoForm({ open, onOpenChange, vehiculo, onSuccess }: VehiculoFormProps) {
  const isEdit = !!vehiculo;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => ({
    patente: vehiculo?.patente || "",
    codigo_interno: vehiculo?.codigo_interno || "",
    vehiculo: vehiculo?.vehiculo || "",
    modelo: vehiculo?.modelo || "",
    ano: s(vehiculo?.ano),
    estado: vehiculo?.estado || "En stock",
    km: s(vehiculo?.km),
    fecha_llegada: vehiculo?.fecha_llegada || "",
    fecha_venta: vehiculo?.fecha_venta || "",
    tipo_compra: vehiculo?.tipo_compra || "",
    forma_pago: vehiculo?.forma_pago || "",
    empresa_leasing: vehiculo?.empresa_leasing || "",
    estado_financiamiento: vehiculo?.estado_financiamiento || "",
    precio_compra: s(vehiculo?.precio_compra),
    precio_publicado: s(vehiculo?.precio_publicado),
    precio_venta: s(vehiculo?.precio_venta),
    transferencia: s(vehiculo?.transferencia),
    bencina: s(vehiculo?.bencina),
    compra_repuesto: s(vehiculo?.compra_repuesto),
    pintura: s(vehiculo?.pintura),
    pulido: s(vehiculo?.pulido),
    polarizado: s(vehiculo?.polarizado),
    radio: s(vehiculo?.radio),
    tapiz: s(vehiculo?.tapiz),
    volante: s(vehiculo?.volante),
    llantas_neumaticos: s(vehiculo?.llantas_neumaticos),
    parachoque: s(vehiculo?.parachoque),
    tapabarro: s(vehiculo?.tapabarro),
    barras: s(vehiculo?.barras),
    grua: s(vehiculo?.grua),
    chofer: s(vehiculo?.chofer),
    dpf: s(vehiculo?.dpf),
    cuatro_x_cuatro: s(vehiculo?.cuatro_x_cuatro),
    chasis: s(vehiculo?.chasis),
    papeles: s(vehiculo?.papeles),
    comision_compra: s(vehiculo?.comision_compra),
    comision_vendedor: s(vehiculo?.comision_vendedor),
    comision_financiamiento: s(vehiculo?.comision_financiamiento),
    monto_financiado: s(vehiculo?.monto_financiado),
    monto_retenido: s(vehiculo?.monto_retenido),
  }));

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const n = (v: string) => (v ? Number(v) : null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        patente: form.patente.toUpperCase(),
        codigo_interno: form.codigo_interno || null,
        vehiculo: form.vehiculo || null,
        modelo: form.modelo || null,
        ano: n(form.ano),
        estado: form.estado,
        km: n(form.km),
        fecha_llegada: form.fecha_llegada || null,
        fecha_venta: form.fecha_venta || null,
        tipo_compra: form.tipo_compra || null,
        forma_pago: form.forma_pago || null,
        empresa_leasing: form.empresa_leasing || null,
        estado_financiamiento: form.estado_financiamiento || null,
        precio_compra: n(form.precio_compra),
        precio_publicado: n(form.precio_publicado),
        precio_venta: n(form.precio_venta),
        transferencia: n(form.transferencia),
        bencina: n(form.bencina),
        compra_repuesto: n(form.compra_repuesto),
        pintura: n(form.pintura),
        pulido: n(form.pulido),
        polarizado: n(form.polarizado),
        radio: n(form.radio),
        tapiz: n(form.tapiz),
        volante: n(form.volante),
        llantas_neumaticos: n(form.llantas_neumaticos),
        parachoque: n(form.parachoque),
        tapabarro: n(form.tapabarro),
        barras: n(form.barras),
        grua: n(form.grua),
        chofer: n(form.chofer),
        dpf: n(form.dpf),
        cuatro_x_cuatro: n(form.cuatro_x_cuatro),
        chasis: n(form.chasis),
        papeles: n(form.papeles),
        comision_compra: n(form.comision_compra),
        comision_vendedor: n(form.comision_vendedor),
        comision_financiamiento: n(form.comision_financiamiento),
        monto_financiado: n(form.monto_financiado),
        monto_retenido: n(form.monto_retenido),
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

  const F = ({ label, k, type = "text", disabled }: { label: string; k: string; type?: string; disabled?: boolean }) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={(form as Record<string, string>)[k] || ""}
        onChange={(e) => set(k, e.target.value)}
        disabled={disabled}
        className="h-9"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Vehiculo" : "Nuevo Vehiculo"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">DATOS GENERALES</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Patente *</Label>
              <Input value={form.patente} onChange={(e) => set("patente", e.target.value.toUpperCase())} maxLength={10} disabled={isEdit} className="h-9" />
            </div>
            <F label="Codigo Interno" k="codigo_interno" />
            <div>
              <Label className="text-xs">Estado</Label>
              <Select value={form.estado} onValueChange={(v) => set("estado", v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="En stock">En stock</SelectItem>
                  <SelectItem value="En preparacion">En preparacion</SelectItem>
                  <SelectItem value="Reservado">Reservado</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <F label="Vehiculo" k="vehiculo" />
            <F label="Modelo" k="modelo" />
            <F label="Ano" k="ano" type="number" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <F label="KM" k="km" type="number" />
            <F label="Fecha Llegada" k="fecha_llegada" type="date" />
            <F label="Fecha Venta" k="fecha_venta" type="date" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <F label="Tipo Compra" k="tipo_compra" />
            <F label="Forma Pago" k="forma_pago" />
            <F label="Empresa/Leasing" k="empresa_leasing" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <F label="Estado Financiamiento" k="estado_financiamiento" />
          </div>

          <Separator />
          <h4 className="text-sm font-semibold text-muted-foreground">PRECIOS</h4>
          <div className="grid grid-cols-3 gap-3">
            <F label="Precio Compra" k="precio_compra" type="number" />
            <F label="Precio Publicado" k="precio_publicado" type="number" />
            <F label="Precio Venta" k="precio_venta" type="number" />
          </div>

          <Separator />
          <h4 className="text-sm font-semibold text-muted-foreground">GASTOS PREPARACION</h4>
          <div className="grid grid-cols-4 gap-3">
            <F label="Transferencia" k="transferencia" type="number" />
            <F label="Bencina" k="bencina" type="number" />
            <F label="Repuestos" k="compra_repuesto" type="number" />
            <F label="Pintura" k="pintura" type="number" />
            <F label="Pulido" k="pulido" type="number" />
            <F label="Polarizado" k="polarizado" type="number" />
            <F label="Radio" k="radio" type="number" />
            <F label="Tapiz" k="tapiz" type="number" />
            <F label="Volante" k="volante" type="number" />
            <F label="Llantas/Neum." k="llantas_neumaticos" type="number" />
            <F label="Parachoque" k="parachoque" type="number" />
            <F label="Tapabarro" k="tapabarro" type="number" />
            <F label="Barras" k="barras" type="number" />
            <F label="Grua" k="grua" type="number" />
            <F label="Chofer" k="chofer" type="number" />
            <F label="DPF" k="dpf" type="number" />
            <F label="4x4" k="cuatro_x_cuatro" type="number" />
            <F label="Chasis" k="chasis" type="number" />
            <F label="Papeles" k="papeles" type="number" />
          </div>

          <Separator />
          <h4 className="text-sm font-semibold text-muted-foreground">COMISIONES Y FINANCIAMIENTO</h4>
          <div className="grid grid-cols-3 gap-3">
            <F label="Com. Compra" k="comision_compra" type="number" />
            <F label="Com. Vendedor" k="comision_vendedor" type="number" />
            <F label="Com. Financiamiento" k="comision_financiamiento" type="number" />
            <F label="Monto Financiado" k="monto_financiado" type="number" />
            <F label="Monto Retenido" k="monto_retenido" type="number" />
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
