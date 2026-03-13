import { getToken } from "./auth";
import { apiUrl } from "./api";

function authHeaders() {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function validateCoupon(code: string, orderAmount: number) {
  const res = await fetch(apiUrl("/coupons/validate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orderAmount })
  });
  if (!res.ok) throw new Error("El cupón no es válido");
  return res.json();
}

export async function getAdminCoupons() {
  const res = await fetch(apiUrl("/admin/coupons"), { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar cupones");
  return res.json();
}

export async function createCoupon(payload: any) {
  const res = await fetch(apiUrl("/admin/coupons"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo crear el cupón");
  return res.json();
}

export async function updateCoupon(id: number, payload: any) {
  const res = await fetch(apiUrl(`/admin/coupons/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar el cupón");
  return res.json();
}

export async function deactivateCoupon(id: number) {
  const res = await fetch(apiUrl(`/admin/coupons/${id}`), {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("No se pudo desactivar el cupón");
}
