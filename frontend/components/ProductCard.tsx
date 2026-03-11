"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "../services/products";
import { addToCart } from "../services/cart";
import { useState } from "react";
import { useToast } from "./ToastProvider";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.imageUrl;
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleAdd = async () => {
    const variant = product.variants[0];
    if (!variant) return;
    try {
      setLoading(true);
      await addToCart(variant.id, 1);
      show("Producto añadido al carrito");
    } catch (error) {
      show("Debes iniciar sesión para agregar al carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 rounded-3xl overflow-hidden shadow-card border border-sand">
      <div className="aspect-[4/5] bg-sand/60 relative">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm">Sin imagen</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg">{product.name}</h3>
        <p className="text-sm text-ink/70 mt-2 max-h-10 overflow-hidden">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-terracotta font-semibold">
            ${product.basePrice.toLocaleString("es-CO")}
          </span>
          <Link href={`/producto/${product.id}`} className="text-sm uppercase tracking-[0.2em]">
            Ver detalle
          </Link>
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-ink text-cream py-2 uppercase tracking-[0.2em] text-xs"
        >
          {loading ? "Agregando..." : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}
