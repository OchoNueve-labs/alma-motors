import { NextRequest, NextResponse } from "next/server";

const N8N_URL = process.env.N8N_ALMA_API_URL!;

async function proxy(req: NextRequest, method: string) {
  const pathSegments = req.nextUrl.pathname.replace("/api/alma/", "");
  const search = req.nextUrl.search;
  const targetUrl = `${N8N_URL}/${pathSegments}${search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const options: RequestInit = { method, headers };

  if (method !== "GET" && method !== "DELETE") {
    try {
      const body = await req.json();
      options.body = JSON.stringify(body);
    } catch {
      // No body — that's fine for some requests
    }
  }

  try {
    const res = await fetch(targetUrl, options);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: String(err) } },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}

export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}

export async function PUT(req: NextRequest) {
  return proxy(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return proxy(req, "DELETE");
}
