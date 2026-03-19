import { apiUrl } from "./api";
import { getToken } from "./auth";
import type { Product } from "./products";

function authHeaders() {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function notifyFavoritesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("favorites-updated"));
  }
}

export async function getFavorites(): Promise<Product[]> {
  const res = await fetch(apiUrl("/favorites"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar favoritos");
  return res.json();
}

export async function addFavorite(productId: number) {
  const res = await fetch(apiUrl(`/favorites/${productId}`), {
    method: "POST",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("No se pudo agregar a favoritos");
  notifyFavoritesUpdated();
}

export async function removeFavorite(productId: number) {
  const res = await fetch(apiUrl(`/favorites/${productId}`), {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("No se pudo eliminar de favoritos");
  notifyFavoritesUpdated();
}

export async function isFavorite(productId: number): Promise<boolean> {
  const res = await fetch(apiUrl(`/favorites/${productId}`), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudo verificar favorito");
  return res.json();
}
