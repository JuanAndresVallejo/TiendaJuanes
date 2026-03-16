import { getToken } from "./auth";
import { apiUrl } from "./api";

export type Address = {
  id: number;
  department: string;
  city: string;
  addressLine: string;
  isDefault: boolean;
};

function authHeaders() {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getAddresses(): Promise<Address[]> {
  const res = await fetch(apiUrl("/addresses"), { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("No se pudieron cargar las direcciones");
  return res.json();
}

export async function addAddress(payload: {
  department: string;
  city: string;
  addressLine: string;
  isDefault?: boolean;
}) {
  const res = await fetch(apiUrl("/addresses"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo guardar la direccion");
  return res.json();
}

export async function setDefaultAddress(id: number) {
  const res = await fetch(apiUrl(`/addresses/${id}/default`), {
    method: "PUT",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("No se pudo actualizar la direccion");
}

export async function updateAddress(id: number, payload: {
  department: string;
  city: string;
  addressLine: string;
  isDefault?: boolean;
}) {
  const res = await fetch(apiUrl(`/addresses/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar la direccion");
  return res.json();
}

export async function deleteAddress(id: number) {
  const res = await fetch(apiUrl(`/addresses/${id}`), {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error("No se pudo eliminar la direccion");
}
