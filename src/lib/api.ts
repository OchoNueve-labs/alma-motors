const BASE = "/api/alma";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE}/${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function apiGet<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint);
}

export function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "DELETE" });
}
