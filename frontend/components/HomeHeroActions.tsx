"use client";

import { useEffect, useState } from "react";
import { getToken } from "../services/auth";

export default function HomeHeroActions() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <a
        href="/productos"
        className="rounded-full bg-terracotta text-cream px-6 py-3 uppercase tracking-[0.2em]"
      >
        Comprar ahora
      </a>
      {!isAuthenticated && (
        <a
          href="/registro"
          className="rounded-full border border-ink px-6 py-3 uppercase tracking-[0.2em]"
        >
          Crear cuenta
        </a>
      )}
    </div>
  );
}
