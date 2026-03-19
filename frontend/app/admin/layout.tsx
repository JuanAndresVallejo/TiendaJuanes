"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRole, getToken } from "../../services/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token) {
      window.location.href = "/login?redirect=/admin/dashboard";
      return;
    }
    if (role !== "ADMIN" && role !== "ROLE_ADMIN") {
      window.location.href = "/";
      return;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-ink/70">Validando sesión...</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="font-display text-3xl">Panel administrativo</h1>
        <nav className="flex gap-4 text-sm uppercase tracking-[0.2em]" aria-label="Navegación del panel administrativo">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Productos</Link>
          <Link href="/admin/orders">Pedidos</Link>
          <Link href="/admin/inventory">Inventario</Link>
          <Link href="/admin/coupons">Cupones</Link>
          <Link href="/admin/banners">Banners</Link>
          <Link href="/admin/users">Usuarios</Link>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
