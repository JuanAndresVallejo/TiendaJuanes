"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getRole, getToken } from "../../services/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token) {
      window.location.href = "/login?redirect=/admin/dashboard";
      return;
    }
    if (role !== "ADMIN") {
      window.location.href = "/";
    }
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="font-display text-3xl">Panel administrativo</h1>
        <nav className="flex gap-4 text-sm uppercase tracking-[0.2em]">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Productos</Link>
          <Link href="/admin/orders">Pedidos</Link>
          <Link href="/admin/inventory">Inventario</Link>
          <Link href="/admin/coupons">Cupones</Link>
          <Link href="/admin/users">Usuarios</Link>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
