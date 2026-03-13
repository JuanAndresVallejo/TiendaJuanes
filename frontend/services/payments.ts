import { getToken } from "./auth";
import { apiUrl } from "./api";

export async function createPreference(orderId: number): Promise<{ preferenceId: string; initPoint: string }> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(apiUrl("/payments/create-preference"), {
    method: "POST",
    headers,
    body: JSON.stringify({ orderId })
  });
  if (!res.ok) throw new Error("No se pudo crear la preferencia de pago");
  return res.json();
}
