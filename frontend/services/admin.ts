import { getToken } from "./auth";
import { apiUrl } from "./api";
import type { Product } from "./products";

function authHeaders() {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getAdminProducts(): Promise<Product[]> {
  const res = await fetch(apiUrl("/admin/products"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(apiUrl(`/admin/products/${id}`), {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("No se pudo eliminar el producto");
}

export async function createProduct(payload: any) {
  const res = await fetch(apiUrl("/admin/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo crear el producto");
  return res.json();
}

export async function updateProduct(id: number, payload: any) {
  const res = await fetch(apiUrl(`/admin/products/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar el producto");
  return res.json();
}

export async function getInventory() {
  const res = await fetch(apiUrl("/admin/inventory"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudo cargar inventario");
  return res.json();
}

export async function updateInventory(payload: { productVariantId: number; newStock?: number; delta?: number }) {
  const res = await fetch(apiUrl("/admin/inventory/update"), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar inventario");
}

export async function getOrders() {
  const res = await fetch(apiUrl("/admin/orders"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar pedidos");
  return res.json();
}

export async function updateOrderStatus(orderId: number, status: string) {
  const res = await fetch(apiUrl("/admin/orders/update-status"), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ orderId, status })
  });
  if (!res.ok) throw new Error("No se pudo actualizar el estado");
}

export async function getDashboardStats() {
  const res = await fetch(apiUrl("/admin/dashboard/stats"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar metricas");
  return res.json();
}

export async function getAdminUsers() {
  const res = await fetch(apiUrl("/admin/users"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar usuarios");
  return res.json();
}
