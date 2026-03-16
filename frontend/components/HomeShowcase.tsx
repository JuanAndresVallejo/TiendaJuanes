"use client";

import { useEffect, useState } from "react";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewestProducts,
  Product
} from "../services/products";
import ProductCard from "./ProductCard";

function Section({ title, products }: { title: string; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function HomeShowcase() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newest, setNewest] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts(6).then(setFeatured).catch(() => setFeatured([]));
    getNewestProducts(6).then(setNewest).catch(() => setNewest([]));
    getBestSellers(6).then(setBest).catch(() => setBest([]));
  }, []);

  return (
    <>
      <Section title="Productos destacados" products={featured} />
      <Section title="Nuevos productos" products={newest} />
      <Section title="Lo más vendido" products={best} />
    </>
  );
}
