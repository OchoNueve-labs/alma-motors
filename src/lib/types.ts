export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total: number;
  error?: { code: string; message: string };
}

export interface Vehiculo {
  patente: string;
  codigo_interno: string | null;
  vehiculo: string | null;
  modelo: string | null;
  ano: number | null;
  estado: string | null;
  km: number | null;
  fecha_llegada: string | null;
  fecha_venta: string | null;
  precio_compra: number | null;
  total_inversion: number | null;
  precio_publicado: number | null;
  precio_venta: number | null;
  utilidad_pre_comision: number | null;
  utilidad_post_comision: number | null;
  utilidad_pct: number | null;
  facturado: string | null;
  mes: string | null;
  dias_stock: number | null;
  tipo_compra: string | null;
  forma_pago: string | null;
  empresa_leasing: string | null;
  estado_financiamiento: string | null;
  transferencia: number | null;
  bencina: number | null;
  compra_repuesto: number | null;
  pintura: number | null;
  pulido: number | null;
  polarizado: number | null;
  radio: number | null;
  tapiz: number | null;
  volante: number | null;
  llantas_neumaticos: number | null;
  parachoque: number | null;
  tapabarro: number | null;
  barras: number | null;
  grua: number | null;
  chofer: number | null;
  dpf: number | null;
  cuatro_x_cuatro: number | null;
  chasis: number | null;
  papeles: number | null;
  comision_compra: number | null;
  comision_vendedor: number | null;
  comision_financiamiento: number | null;
  comision_pagada: string | null;
  comision: number | null;
  comision_para: string | null;
  monto_financiado: number | null;
  monto_retenido: number | null;
  margen_bruto: number | null;
  margen_neto: number | null;
  mes_preparada: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Compra {
  id: number;
  fecha: string | null;
  patente: string;
  proveedor: string | null;
  marca: string | null;
  cliente_destino: string | null;
  modelo: string | null;
  año: number | null;
  valor: number | null;
  transferencia: number | null;
  flete: number | null;
  transferido: string | null;
  tag: string | null;
  estado: string | null;
  comprador: string | null;
  telefono: string | null;
  fecha_venta: string | null;
  transferencia_venta: number | null;
  km: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Cliente {
  id: string;
  nombre: string | null;
  rut: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Vendedor {
  id: string;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Venta {
  id: string;
  id_vehiculo: string | null;
  id_cliente: string | null;
  modelo: string | null;
  fecha_venta: string | null;
  precio_final: number | null;
  forma_pago: string | null;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  vendedor: string | null;
  vendedor_id: string | null;
  comision: number | null;
  comision_porcentaje: number | null;
  comision_monto: number | null;
  costo_total: number | null;
  utilidad_real: number | null;
  dias_en_stock: number | null;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface NotaVenta {
  id: string;
  fecha: string | null;
  id_cliente: string | null;
  vehiculo_id: string | null;
  vehiculo_detalle: string | null;
  cliente_nombre: string | null;
  cliente_rut: string | null;
  cliente_email: string | null;
  cliente_telefono: string | null;
  cliente_direccion: string | null;
  valor_vehiculo: number | null;
  descuento: number | null;
  valor_final: number | null;
  total_cliente: number | null;
  forma_pago: string | null;
  reserva: number | null;
  tiene_retoma: boolean;
  retoma_detalle: string | null;
  vendedor: string | null;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface DashboardGeneral {
  en_stock: number;
  vendidos_mes: number;
  valor_inventario: number;
  ventas_mes: number;
  utilidad_mes: number;
  total_alertas: number;
}

export interface DashboardCompras {
  total_compras: number;
  pendientes_transferencia: number;
  compras_mes: number;
  gasto_mes: number;
}

export interface DashboardInventario {
  total_stock: number;
  valor_total: number;
  promedio_dias_stock: number;
  por_estado: Record<string, number>;
}

export interface DashboardVentas {
  ventas_mes: number;
  ingresos_mes: number;
  utilidad_mes: number;
  promedio_dias_venta: number;
}

export interface DashboardFinanciero {
  mes_actual: Record<string, number> | null;
  ytd: {
    ingresos_totales: number;
    costo_directo: number;
    margen_bruto: number;
    total_gastos_op: number;
    utilidad_neta: number;
    meses_reportados: number;
  };
  año: number;
  mes: number;
  message?: string;
}

export interface Alerta {
  tipo: string;
  nivel: "danger" | "warning" | "info";
  mensaje: string;
  cantidad?: number;
}

export interface DashboardAlertas {
  alertas: Alerta[];
  total: number;
}
