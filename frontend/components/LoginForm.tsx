"use client";

import { FormEvent, useState } from "react";
import { login } from "../services/auth";
import { useToast } from "./ToastProvider";
import Link from "next/link";
import { isValidEmail } from "../services/validation";

export default function LoginForm({ redirect }: { redirect?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!isValidEmail(email)) {
      show("Ingresa un correo válido", "error");
      return;
    }
    if (!password.trim()) {
      show("Ingresa tu contraseña", "error");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      show("Inicio de sesión exitoso");
      window.location.href = redirect || "/";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Credenciales inválidas";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Correo</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Contraseña</label>
        <input
          type="password"
          placeholder="********"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
      <div className="text-right">
        <Link href="/recuperar-password" className="text-xs uppercase tracking-[0.2em] text-ink/70">
          Recuperar contraseña
        </Link>
      </div>
    </form>
  );
}
