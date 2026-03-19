"use client";

import { FormEvent, useState } from "react";
import { register } from "../services/auth";
import { useToast } from "./ToastProvider";
import { addressRegex, documentRegex, emailRegex, lastNameRegex, nameRegex, phoneRegex } from "../services/validation";

export default function RegisterForm() {
  const departmentCities: Record<string, string[]> = {
    "Amazonas": ["Leticia"],
    "Antioquia": ["Medellin", "Bello", "Sabaneta", "Itagui", "La Estrella", "Envigado", "Copacabana", "Rionegro", "La Ceja", "Marinilla"],
    "Arauca": ["Arauca"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
    "Bolívar": ["Cartagena", "Magangue"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso"],
    "Caldas": ["Manizales", "Chinchina"],
    "Caquetá": ["Florencia"],
    "Casanare": ["Yopal"],
    "Cauca": ["Popayan"],
    "Cesar": ["Valledupar"],
    "Chocó": ["Quibdo"],
    "Córdoba": ["Monteria"],
    "Cundinamarca": ["Soacha", "Zipaquira", "Chia"],
    "Guainía": ["Inirida"],
    "Guaviare": ["San Jose del Guaviare"],
    "Huila": ["Neiva"],
    "La Guajira": ["Riohacha", "Maicao"],
    "Magdalena": ["Santa Marta"],
    "Meta": ["Villavicencio"],
    "Nariño": ["Pasto", "Tumaco"],
    "Norte de Santander": ["Cucuta"],
    "Putumayo": ["Mocoa"],
    "Quindío": ["Armenia"],
    "Risaralda": ["Pereira", "Dosquebradas"],
    "San Andrés y Providencia": ["San Andres"],
    "Santander": ["Bucaramanga", "Floridablanca"],
    "Sucre": ["Sincelejo"],
    "Tolima": ["Ibague"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
    "Vaupés": ["Mitu"],
    "Vichada": ["Puerto Carreno"],
    "Bogotá D.C.": ["Bogota"]
  };
  const departmentOptions = Object.keys(departmentCities);

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { show } = useToast();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const cityOptions = departmentCities[form.department] || [];

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const nextErrors: Record<string, string> = {};
    const requiredFields = [
      form.firstName,
      form.lastName,
      form.documentId,
      form.phone,
      form.email,
      form.department,
      form.city,
      form.addressLine,
      form.password,
      form.confirmPassword
    ];
    if (requiredFields.some((field) => !field.trim())) {
      nextErrors.general = "Completa todos los campos obligatorios";
    }
    if (!nameRegex.test(form.firstName)) {
      nextErrors.firstName = "Nombre: solo letras y espacios (2-20)";
    }
    if (!lastNameRegex.test(form.lastName)) {
      nextErrors.lastName = "Apellido: solo letras y espacios (2-25)";
    }
    if (!documentRegex.test(form.documentId)) {
      nextErrors.documentId = "Cédula: solo números (6-15)";
    }
    if (!phoneRegex.test(form.phone)) {
      nextErrors.phone = "Celular: debe tener 10 números";
    }
    if (!emailRegex.test(form.email)) {
      nextErrors.email = "Correo no válido";
    }
    if (!addressRegex.test(form.addressLine)) {
      nextErrors.addressLine = "Dirección inválida (usa letras, números y # . , -)";
    }
    if (form.password.length < 8) {
      nextErrors.password = "La contraseña debe tener mínimo 8 caracteres";
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      show(nextErrors.general || "Revisa los campos marcados", "error");
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      await register(form);
      show("Registro exitoso");
      window.location.href = "/";
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo registrar";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Nombre</label>
        <input
          type="text"
          placeholder="Juan"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""))}
        />
        {errors.firstName && <p className="mt-1 text-xs text-terracotta">{errors.firstName}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Apellido</label>
        <input
          type="text"
          placeholder="Perez"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""))}
        />
        {errors.lastName && <p className="mt-1 text-xs text-terracotta">{errors.lastName}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Cedula</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1000000000"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.documentId}
          onChange={(e) => handleChange("documentId", e.target.value.replace(/\D/g, ""))}
        />
        {errors.documentId && <p className="mt-1 text-xs text-terracotta">{errors.documentId}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Celular</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="3001234567"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
        />
        {errors.phone && <p className="mt-1 text-xs text-terracotta">{errors.phone}</p>}
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
        {errors.email && <p className="mt-1 text-xs text-terracotta">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Departamento</label>
        <select
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.department}
          onChange={(e) => {
            const nextDepartment = e.target.value;
            const nextCities = departmentCities[nextDepartment] || [];
            setForm((prev) => ({
              ...prev,
              department: nextDepartment,
              city: nextCities[0] || ""
            }));
          }}
        >
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Ciudad</label>
        <select
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
        >
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
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
        {errors.addressLine && <p className="mt-1 text-xs text-terracotta">{errors.addressLine}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Contraseña</label>
        <div className="mt-2 flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="rounded-xl border border-sand px-3 text-xs uppercase tracking-[0.2em]"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-terracotta">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Confirmar contraseña</label>
        <div className="mt-2 flex gap-2">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="rounded-xl border border-sand px-3 text-xs uppercase tracking-[0.2em]"
          >
            {showConfirmPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-xs text-terracotta">{errors.confirmPassword}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
