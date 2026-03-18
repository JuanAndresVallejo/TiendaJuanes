"use client";

import { useEffect, useMemo, useState } from "react";
import { addToCart } from "../services/cart";
import { addFavorite, isFavorite, removeFavorite } from "../services/favorites";
import type { Product } from "../services/products";
import { useToast } from "./ToastProvider";

export default function ProductDetailClient({ product }: { product: Product }) {
  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product.variants]);
  const sizes = useMemo(() => Array.from(new Set(product.variants.map((v) => v.size))), [product.variants]);

  const [color, setColor] = useState(colors[0] || "");
  const [size, setSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const { show } = useToast();

  const selectedVariant = product.variants.find((v) => v.color === color && v.size === size);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  useEffect(() => {
    isFavorite(product.id)
      .then(setFavorite)
      .catch(() => setFavorite(false));
  }, [product.id]);

  const handleAdd = async () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    try {
      setLoading(true);
      await addToCart(selectedVariant.id, quantity);
      show("Producto anadido al carrito");
    } catch (error) {
      show("Debes iniciar sesion para agregar al carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      setFavoriting(true);
      if (favorite) {
        await removeFavorite(product.id);
        setFavorite(false);
        show("Removido de favoritos");
      } else {
        await addFavorite(product.id);
        setFavorite(true);
        show("Agregado a favoritos");
      }
    } catch (error) {
      show("Debes iniciar sesion para usar favoritos", "error");
    } finally {
      setFavoriting(false);
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
      <div className="grid gap-3">
        <button
          onClick={handleAdd}
          disabled={loading || isOutOfStock}
          className="mt-2 w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
        >
          {isOutOfStock ? "Sin stock" : loading ? "Agregando..." : "Anadir al carrito"}
        </button>
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={favoriting}
          className="w-full rounded-full border border-ink py-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
        >
          {favoriting ? "Actualizando..." : favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        </button>
      </div>
    </div>
  );
}
