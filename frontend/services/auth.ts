import { apiUrl } from "./api";

export type AuthResponse = {
  token: string;
  fullName: string;
  email: string;
  role: string;
};

const TOKEN_KEY = "tj_token";
const ROLE_KEY = "tj_role";
const FULL_NAME_KEY = "tj_full_name";

function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-updated"));
  }
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function saveRole(role: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function saveFullName(fullName: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(FULL_NAME_KEY, fullName);
    notifyAuthChanged();
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function getFullName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FULL_NAME_KEY);
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(FULL_NAME_KEY);
    notifyAuthChanged();
  }
}

async function parseErrorMessage(res: Response) {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
  } catch {
    // ignore
  }
  try {
    const text = await res.text();
    if (text) return text;
  } catch {
    // ignore
  }
  return null;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "Credenciales invalidas");
  }
  const data: AuthResponse = await res.json();
  saveToken(data.token);
  saveRole(data.role);
  saveFullName(data.fullName);
  return data;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  documentId: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  addressLine: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "No se pudo registrar");
  }
  const data: AuthResponse = await res.json();
  saveToken(data.token);
  saveRole(data.role);
  saveFullName(data.fullName);
  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(apiUrl("/auth/forgot-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "No se pudo procesar la solicitud");
  }
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await fetch(apiUrl("/auth/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "No se pudo actualizar la contraseña");
  }
}
