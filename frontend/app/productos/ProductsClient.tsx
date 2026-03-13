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
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    size: "",
    minPrice: "",
    maxPrice: ""
  });

  const hasFilters = useMemo(() => Object.values(filters).some((v) => v !== ""), [filters]);

  const applyLocalFilters = (allProducts: Product[]) => {
    const category = filters.category.trim().toLowerCase();
    const brand = filters.brand.trim().toLowerCase();
    const size = filters.size.trim().toLowerCase();
    const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;

    return allProducts.filter((product) => {
      const productCategory = (product.category || "").toLowerCase();
      const productBrand = (product.brand || "").toLowerCase();
      const matchesCategory = !category || productCategory.includes(category);
      const matchesBrand = !brand || productBrand.includes(brand);
      const matchesSize = !size || product.variants.some((variant) => variant.size.toLowerCase().includes(size));
      const matchesMin = minPrice === undefined || product.basePrice >= minPrice;
      const matchesMax = maxPrice === undefined || product.basePrice <= maxPrice;
      return matchesCategory && matchesBrand && matchesSize && matchesMin && matchesMax;
    });
  };

  const load = async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const data = await searchProducts(query.trim());
        setProducts(data);
      } else if (hasFilters) {
        try {
          const data = await filterProducts({
            category: filters.category.trim() || undefined,
            brand: filters.brand.trim() || undefined,
            size: filters.size.trim() || undefined,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined
          });
          setProducts(data);
        } catch {
          const all = await getProducts();
          setProducts(applyLocalFilters(all));
        }
      } else {
        const data = await getProducts();
        setProducts(data);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load();
  }, [query, hasFilters, filters]);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <span className="text-sm text-ink/70">{products.length} productos</span>
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
              <div className="grid gap-6 md:grid-cols-3">
                {pagedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {products.length > pageSize && (
                <div className="mt-8 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-ink px-4 py-2 disabled:opacity-50"
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Pagina {currentPage} de {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-full border border-ink px-4 py-2 disabled:opacity-50"
                    disabled={currentPage === totalPages}
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
