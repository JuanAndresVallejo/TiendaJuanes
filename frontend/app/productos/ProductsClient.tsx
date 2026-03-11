"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import SkeletonCard from "../../components/SkeletonCard";
import { filterProducts, getProducts, searchProducts, Product } from "../../services/products";
import { useSearchParams } from "next/navigation";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: ""
  });

  const hasFilters = useMemo(() => Object.values(filters).some((v) => v !== ""), [filters]);

  const load = async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const data = await searchProducts(query.trim());
        setProducts(data);
      } else if (hasFilters) {
        const data = await filterProducts({
          category: filters.category || undefined,
          brand: filters.brand || undefined,
          size: filters.size || undefined,
          color: filters.color || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined
        });
        setProducts(data);
      } else {
        const data = await getProducts();
        setProducts(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query, hasFilters]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Catalogo</p>
          <h1 className="font-display text-4xl mt-3">Explora nuestros productos</h1>
        </div>
        <span className="text-sm text-ink/70">{products.length} productos</span>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="bg-white/70 border border-sand rounded-3xl p-4 h-fit">
          <h2 className="font-display text-xl">Filtros</h2>
          <div className="mt-4 space-y-3 text-sm">
            <input
              placeholder="Categoria"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <input
              placeholder="Marca"
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <input
              placeholder="Talla"
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <input
              placeholder="Color"
              value={filters.color}
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <input
              placeholder="Precio minimo"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <input
              placeholder="Precio maximo"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setFilters({ category: "", brand: "", size: "", color: "", minPrice: "", maxPrice: "" })}
              className="text-terracotta"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
