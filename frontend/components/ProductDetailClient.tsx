"use client";

import { useMemo, useState } from "react";
import { addToCart } from "../services/cart";
import type { Product } from "../services/products";
import { useToast } from "./ToastProvider";

export default function ProductDetailClient({ product }: { product: Product }) {
  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  const sizes = useMemo(() => Array.from(new Set(product.variants.map((v) => v.size))), [product.variants]);

  const [color, setColor] = useState(colors[0] || "");
  const [size, setSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const selectedVariant = product.variants.find((v) => v.color === color && v.size === size);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAdd = async () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    try {
      setLoading(true);
      await addToCart(selectedVariant.id, quantity);
      show("Producto añadido al carrito");
    } catch (error) {
      show("Debes iniciar sesión para agregar al carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 grid gap-4">
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Color</label>
        <select
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          {colors.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Talla</label>
        <select
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Cantidad</label>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-sand"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="min-w-[40px] text-center">{quantity}</span>
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-sand"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={loading || isOutOfStock}
        className="mt-2 w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
      >
        {isOutOfStock ? "Sin stock" : loading ? "Agregando..." : "Añadir al carrito"}
      </button>
    </div>
  );
}
