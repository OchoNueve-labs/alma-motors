"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getVal(item: any, key: string): unknown {
  return item[key];
}

export function DataTable<T>({
  data,
  columns,
  searchKeys = [],
  searchPlaceholder = "Buscar...",
  pageSize = 15,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = getVal(item, key);
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = getVal(a, sortKey);
      const bv = getVal(b, sortKey);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
                {col.sortable !== false ? (
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
            {actions && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                No hay registros
              </TableCell>
            </TableRow>
          ) : (
            paged.map((item, i) => (
              <TableRow
                key={i}
                className={onRowClick ? "cursor-pointer" : undefined}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(item) : (getVal(item, col.key) != null ? String(getVal(item, col.key)) : "-")}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sorted.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
