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

export async function updateMyProfile(payload: {
  firstName: string;
  lastName: string;
  phone: string;
  documentId: string;
  department: string;
  city: string;
  addressLine: string;
}): Promise<UserProfile> {
  const token = getToken();
  const res = await fetch(apiUrl("/users/me"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar el perfil");
  return res.json();
}

export async function updateMyPassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const token = getToken();
  const res = await fetch(apiUrl("/users/me/password"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("No se pudo actualizar la contraseña");
}
