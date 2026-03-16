"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFullName, getRole, getToken, logout } from "../services/auth";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setFullName(getFullName());
    setRole(getRole());
    setIsAuthenticated(!!getToken());
  }, []);

  const profileHref = role === "ADMIN" ? "/admin/dashboard" : "/mi-perfil";
  const profileLabel = fullName ? `Mi perfil (${fullName.split(" ")[0]})` : "Mi perfil";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setFullName(null);
    setRole(null);
    router.push("/");
  };

  return (
    <header className="bg-cream/80 backdrop-blur border-b border-sand sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-display tracking-wide">
          Tienda Juanes
        </Link>
        <form onSubmit={handleSubmit} className="flex-1 min-w-[220px] max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos o referencia"
            className="w-full rounded-full border border-sand bg-white/80 px-4 py-2 text-sm"
          />
        </form>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.2em]">
          <Link href="/productos" className="hover:text-terracotta">Productos</Link>
          {role !== "ADMIN" && (
            <Link href="/carrito" className="hover:text-terracotta">Mi carrito</Link>
          )}
          {isAuthenticated && role !== "ADMIN" ? (
            <>
              <Link href="/mis-pedidos" className="hover:text-terracotta">Mis pedidos</Link>
              <Link href={profileHref} className="hover:text-terracotta">
                {profileLabel}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-terracotta uppercase tracking-[0.2em]"
              >
                Cerrar sesión
              </button>
            </>
          ) : isAuthenticated && role === "ADMIN" ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-terracotta">Panel admin</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-terracotta uppercase tracking-[0.2em]"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-terracotta">Iniciar sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
