"use client";

import { useEffect, useState } from "react";
import { getProductsByIds, Product } from "../services/products";
import ProductCard from "./ProductCard";

const STORAGE_KEY = "tj_recently_viewed";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    return [];
  }
  return [];
}

function writeIds(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function RecentlyViewed({ currentId }: { currentId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const existing = readIds().filter((id) => id !== currentId);
    const next = [currentId, ...existing].slice(0, 8);
    writeIds(next);

    const idsForFetch = existing.slice(0, 6);
    if (!idsForFetch.length) {
      setProducts([]);
      return;
    }
    getProductsByIds(idsForFetch.join(","))
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [currentId]);

  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl">Recientemente vistos</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
