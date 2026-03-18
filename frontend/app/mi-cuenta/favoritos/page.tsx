"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import { getFavorites } from "../../../services/favorites";
import type { Product } from "../../../services/products";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => setError("No se pudieron cargar tus favoritos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Mi cuenta</p>
          <h1 className="font-display text-4xl mt-3">Mis favoritos</h1>
        </div>
        <span className="text-sm text-ink/70">{favorites.length} productos</span>
      </div>

      {loading && <p className="mt-8 text-ink/60">Cargando favoritos...</p>}
      {error && <p className="mt-8 text-terracotta">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {favorites.length === 0 && (
            <p className="text-ink/60">Aun no tienes productos favoritos.</p>
          )}
        </div>
      )}
    </section>
  );
}
