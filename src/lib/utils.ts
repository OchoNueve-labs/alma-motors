import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(value: number | null | undefined): string {
  if (value == null) return "$0";
  return "$" + Math.round(value).toLocaleString("es-CL");
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "0";
  return value.toLocaleString("es-CL");
}
