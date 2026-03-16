"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import SkeletonCard from "../../components/SkeletonCard";
import { filterProducts, getProductsPaged, searchProducts, Product, ProductPage } from "../../services/products";
import { useSearchParams } from "next/navigation";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState("created_at");
  const [dir, setDir] = useState("desc");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    size: "",
    minPrice: "",
    maxPrice: ""
  });

  const pageSize = 20;
  const hasFilters = useMemo(() => Object.values(filters).some((v) => v !== ""), [filters]);

  const load = async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const data = await searchProducts(query.trim(), page, pageSize);
        setProducts(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (hasFilters) {
        const data: ProductPage = await filterProducts({
          category: filters.category.trim() || undefined,
          brand: filters.brand.trim() || undefined,
          size: filters.size.trim() || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          page,
          pageSize: pageSize
        });
        setProducts(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else {
        const data = await getProductsPaged({ page, size: pageSize, sort, dir });
        setProducts(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
    } catch {
      setProducts([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    load();
  }, [query, hasFilters, filters, sort, dir]);

  useEffect(() => {
    load();
  }, [page]);

  const currentPage = Math.min(page + 1, totalPages);
  const pagedProducts = products;

  const categories = ["", "Hombre", "Mujer", "Calzado", "Accesorios"];
  const brands = ["", "Levis", "Nike", "Adidas", "Puma", "Calvin Klein", "Tommy Hilfiger", "Guess", "Vans"];
  const sizes = ["", "S", "M", "L", "XL"];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Catalogo</p>
          <h1 className="font-display text-4xl mt-3">Explora nuestros productos</h1>
        </div>
        <span className="text-sm text-ink/70">{totalElements} productos</span>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="bg-white/70 border border-sand rounded-3xl p-4 h-fit sticky top-24 self-start">
          <h2 className="font-display text-xl">Filtros</h2>
          <div className="mt-4 space-y-3 text-sm">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category || "Categoria"}
                </option>
              ))}
            </select>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand || "Marca"}
                </option>
              ))}
            </select>
            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size || "Talla"}
                </option>
              ))}
            </select>
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
              onClick={() => setFilters({ category: "", brand: "", size: "", minPrice: "", maxPrice: "" })}
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
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-[0.2em] text-ink/60 text-xs">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-xl border border-sand bg-white/80 px-3 py-2"
                  >
                    <option value="created_at">Nuevos</option>
                    <option value="name">Nombre</option>
                    <option value="price">Precio</option>
                    <option value="best_sellers">Más vendidos</option>
                  </select>
                  <select
                    value={dir}
                    onChange={(e) => setDir(e.target.value)}
                    className="rounded-xl border border-sand bg-white/80 px-3 py-2"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
                <span className="text-ink/60">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {pagedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="rounded-full border border-ink px-4 py-2 disabled:opacity-50"
                    disabled={page === 0}
                  >
                    Anterior
                  </button>
                  <span>
                    Pagina {currentPage} de {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    className="rounded-full border border-ink px-4 py-2 disabled:opacity-50"
                    disabled={page + 1 >= totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
