"use client";

import { useEffect, useState } from "react";
import { getRelatedProducts, Product } from "../services/products";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ productId }: { productId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getRelatedProducts(productId, 6)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [productId]);

  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl">Productos relacionados</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
