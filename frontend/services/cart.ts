import { getToken } from "./auth";
import { apiUrl } from "./api";

export type CartItem = {
  id: number;
  productVariantId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
};

function authHeaders() {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch(apiUrl("/cart"), { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("No se pudo cargar el carrito");
  return res.json();
}

export async function addToCart(productVariantId: number, quantity: number) {
  const res = await fetch(apiUrl("/cart/add"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ productVariantId, quantity })
  });
  if (!res.ok) throw new Error("No se pudo agregar al carrito");
}

export async function updateCart(productVariantId: number, quantity: number) {
  const res = await fetch(apiUrl("/cart/update"), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ productVariantId, quantity })
  });
  if (!res.ok) throw new Error("No se pudo actualizar el carrito");
}

export async function removeFromCart(productVariantId: number) {
  const res = await fetch(apiUrl(`/cart/remove?productVariantId=${productVariantId}`), {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("No se pudo eliminar del carrito");
}
