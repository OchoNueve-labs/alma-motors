import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Receipt,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Vehiculos", href: "/vehiculos", icon: Car },
  { label: "Compras", href: "/compras", icon: ShoppingCart },
  { label: "Ventas", href: "/ventas", icon: Receipt },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Vendedores", href: "/vendedores", icon: UserCheck },
  { label: "EERR", href: "/eerr", icon: BarChart3 },
] as const;

export const ESTADO_COLORS: Record<string, string> = {
  "En stock": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Vendido": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "En preparacion": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "En preparación": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Reservado": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "transferido": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "pendiente": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "generado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export const ALERTA_COLORS: Record<string, string> = {
  danger: "border-red-500/50 bg-red-500/10 text-red-400",
  warning: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  info: "border-blue-500/50 bg-blue-500/10 text-blue-400",
};
