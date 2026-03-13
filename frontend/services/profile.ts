import { getToken } from "./auth";
import { apiUrl } from "./api";

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  documentId: string;
  department: string;
  city: string;
  addressLine: string;
};

export async function getMyProfile(): Promise<UserProfile> {
  const token = getToken();
  const res = await fetch(apiUrl("/users/me"), {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("No se pudo cargar el perfil");
  return res.json();
}
