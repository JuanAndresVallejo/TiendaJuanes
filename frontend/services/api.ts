const DEFAULT_API_BASE = "/api";
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") {
    if (API_BASE.startsWith("http")) {
      return `${API_BASE}${normalized}`;
    }
    const internalBase = process.env.INTERNAL_API_URL || "http://backend:8080/api";
    return `${internalBase}${normalized}`;
  }
  if (window.location.port === "3000" && API_BASE === DEFAULT_API_BASE) {
    return `http://localhost:8080${normalized}`;
  }
  return `${API_BASE}${normalized}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
