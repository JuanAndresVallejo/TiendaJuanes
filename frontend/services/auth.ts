export type AuthResponse = {
  token: string;
  fullName: string;
  email: string;
  role: string;
};

const TOKEN_KEY = "tj_token";
const ROLE_KEY = "tj_role";

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

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error("Credenciales invalidas");
  }
  const data: AuthResponse = await res.json();
  saveToken(data.token);
  saveRole(data.role);
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
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error("No se pudo registrar");
  }
  const data: AuthResponse = await res.json();
  saveToken(data.token);
  saveRole(data.role);
  return data;
}
