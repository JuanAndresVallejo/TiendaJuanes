import { getToken } from "./auth";
import { apiUrl } from "./api";

export async function createOrder(payload: {
  addressId?: number | null;
  department: string;
  city: string;
  addressLine: string;
  express: boolean;
  notes?: string;
}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(apiUrl("/orders/create"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo crear la orden");
  return res.json();
}

export async function getMyOrders() {
  const token = getToken();
  const res = await fetch(apiUrl("/orders/my-orders"), {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("No se pudieron cargar pedidos");
  return res.json();
}

export async function getOrderTracking(orderId: number) {
  const token = getToken();
  const res = await fetch(apiUrl(`/orders/${orderId}/tracking`), {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("No se pudo cargar el tracking");
  return res.json();
}

export async function getOrder(orderId: number) {
  const token = getToken();
  const res = await fetch(apiUrl(`/orders/${orderId}`), {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("No se pudo cargar el pedido");
  return res.json();
}
