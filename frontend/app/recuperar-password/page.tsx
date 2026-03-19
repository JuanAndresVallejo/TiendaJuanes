"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { forgotPassword, resetPassword } from "../../services/auth";
import { useToast } from "../../components/ToastProvider";
import { isValidEmail } from "../../services/validation";

function RecoverPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const submitRequest = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!isValidEmail(email)) {
      show("Ingresa un correo válido", "error");
      return;
    }
    try {
      setLoading(true);
      await forgotPassword(email);
      show("Si el correo existe, te enviamos un enlace de recuperación.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar la solicitud";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (newPassword.length < 8) {
      show("La nueva contraseña debe tener mínimo 8 caracteres", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      show("Las contraseñas no coinciden", "error");
      return;
    }
    try {
      setLoading(true);
      await resetPassword({ token, newPassword, confirmPassword });
      show("Contraseña actualizada. Ya puedes iniciar sesión.");
      window.location.href = "/login";
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la contraseña";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-12">
      <a href="/login" className="text-xs uppercase tracking-[0.2em] text-ink/60">Atras</a>
      <h1 className="font-display text-4xl mt-2">Recuperar contraseña</h1>
      <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6 space-y-4">
        {!token ? (
          <form className="space-y-4" onSubmit={submitRequest}>
            <p className="text-sm text-ink/70">Ingresa tu correo para recibir un enlace de recuperación.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={submitReset}>
            <p className="text-sm text-ink/70">Define tu nueva contraseña.</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function RecoverPasswordPage() {
  return (
    <Suspense fallback={<section className="max-w-xl mx-auto px-6 py-12">Cargando...</section>}>
      <RecoverPasswordContent />
    </Suspense>
  );
}
