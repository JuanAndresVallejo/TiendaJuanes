"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFullName, getRole, getToken, logout } from "../services/auth";
import { getCart } from "../services/cart";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncAuth = () => {
      setFullName(getFullName());
      setRole(getRole());
      setIsAuthenticated(!!getToken());
    };
    syncAuth();
    const loadCartCount = () => {
      if (getToken() && !["ADMIN", "ROLE_ADMIN"].includes(getRole() || "")) {
        getCart()
          .then((items) => {
            const total = items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total);
          })
          .catch(() => setCartCount(0));
      } else {
        setCartCount(0);
      }
    };
    loadCartCount();
    const handler = () => loadCartCount();
    const authHandler = () => {
      syncAuth();
      loadCartCount();
    };
    window.addEventListener("cart-updated", handler);
    window.addEventListener("auth-updated", authHandler);
    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("auth-updated", authHandler);
    };
  }, []);

  const isRoleAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  const profileHref = isRoleAdmin ? "/admin/dashboard" : "/mi-perfil";
  const profileLabel = fullName ? `Mi perfil (${fullName.split(" ")[0]})` : "Mi perfil";
  const isAdmin = isAuthenticated && isRoleAdmin;
  const isCustomer = isAuthenticated && !isRoleAdmin;
  const canUseSearch = !isAdmin;

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
        {canUseSearch && (
          <form onSubmit={handleSubmit} className="flex-1 min-w-[220px] max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos o referencia"
              className="w-full rounded-full border border-sand bg-white/80 px-4 py-2 text-sm"
            />
          </form>
        )}
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.2em]">
          {!isAuthenticated && (
            <>
              <Link href="/productos" className="hover:text-terracotta">Productos</Link>
              <Link href="/login" className="hover:text-terracotta">Iniciar sesion</Link>
            </>
          )}
          {isCustomer && (
            <>
              <Link href="/productos" className="hover:text-terracotta">Productos</Link>
              <Link href="/carrito" className="hover:text-terracotta relative">
                Mi carrito
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center text-[10px] w-5 h-5 rounded-full bg-terracotta text-cream">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/mis-pedidos" className="hover:text-terracotta">Mis pedidos</Link>
              <Link href="/mi-cuenta/favoritos" className="hover:text-terracotta">Favoritos</Link>
              <Link href={profileHref} className="hover:text-terracotta">
                {profileLabel}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-terracotta uppercase tracking-[0.2em]"
              >
                Cerrar sesion
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/dashboard" className="hover:text-terracotta">Panel admin</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-terracotta uppercase tracking-[0.2em]"
              >
                Cerrar sesion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
