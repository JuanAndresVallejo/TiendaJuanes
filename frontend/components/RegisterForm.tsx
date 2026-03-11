"use client";

import { useState } from "react";
import { register } from "../services/auth";
import { useToast } from "./ToastProvider";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    documentId: "",
    phone: "",
    email: "",
    department: "Antioquia",
    city: "Medellin",
    addressLine: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (form.password.length < 8) {
      show("La contraseña debe tener mínimo 8 caracteres", "error");
      return;
    }
    if (form.password !== form.confirmPassword) {
      show("Las contraseñas no coinciden", "error");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      show("Registro exitoso");
      window.location.href = "/";
    } catch {
      show("No se pudo registrar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Nombre</label>
        <input
          type="text"
          placeholder="Juan"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Apellido</label>
        <input
          type="text"
          placeholder="Perez"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Cedula</label>
        <input
          type="text"
          placeholder="1000000000"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.documentId}
          onChange={(e) => handleChange("documentId", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Celular</label>
        <input
          type="text"
          placeholder="3001234567"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Correo</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Departamento</label>
        <input
          type="text"
          placeholder="Antioquia"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Ciudad</label>
        <input
          type="text"
          placeholder="Medellin"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Direccion</label>
        <input
          type="text"
          placeholder="Calle 123 #45-67"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.addressLine}
          onChange={(e) => handleChange("addressLine", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Contraseña</label>
        <input
          type="password"
          placeholder="********"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Confirmar contraseña</label>
        <input
          type="password"
          placeholder="********"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
