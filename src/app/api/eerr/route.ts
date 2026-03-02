import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://bfjbteznzhaprdkzdote.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/eerr?a%C3%B1o=eq.${year}&order=mes.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: { message: "Error fetching EERR data" } },
        { status: 500 }
      );
    }

    const rows = await res.json();

    // Calculate YTD totals
    const ytd = rows.reduce(
      (acc: Record<string, number>, row: Record<string, number>) => ({
        ingresos_totales: acc.ingresos_totales + (row.ingresos_totales || 0),
        costo_directo: acc.costo_directo + (row.costo_directo || 0),
        margen_bruto: acc.margen_bruto + (row.margen_bruto || 0),
        total_gastos_op: acc.total_gastos_op + (row.total_gastos_op || 0),
        utilidad_neta: acc.utilidad_neta + (row.utilidad_neta || 0),
        meses_reportados: acc.meses_reportados + 1,
      }),
      { ingresos_totales: 0, costo_directo: 0, margen_bruto: 0, total_gastos_op: 0, utilidad_neta: 0, meses_reportados: 0 }
    );

    return NextResponse.json({
      success: true,
      data: { rows, ytd, year: Number(year) },
      total: rows.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Error connecting to database" } },
      { status: 500 }
    );
  }
}
