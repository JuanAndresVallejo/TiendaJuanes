"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "../services/products";
import { addToCart } from "../services/cart";
import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider";
import { getRole, getToken } from "../services/auth";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.imageUrl;
  const tags = (product.tags || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const hasDiscount = (product.discountPercentage || 0) > 0;
  const discountFactor = 1 - (product.discountPercentage || 0) / 100;
  const finalPrice = hasDiscount ? Math.round(product.basePrice * discountFactor) : product.basePrice;
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const { show } = useToast();

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const outOfStock = product.variants.every((v) => v.stock <= 0);
  const token = getToken();
  const role = getRole();
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  const canBuy = !!token && !isAdmin;

  const handleAdd = async (variantId: number) => {
    try {
      setLoading(true);
      await addToCart(variantId, quantity);
      show("Producto añadido al carrito");
      setShowPicker(false);
      setQuantity(1);
    } catch (error) {
      show("Debes iniciar sesión para agregar al carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!token) {
      show("Debes iniciar sesión", "error");
      return;
    }
    if (isAdmin) {
      show("Los administradores no pueden comprar productos", "error");
      return;
    }
    setShowPicker(true);
  };

  useEffect(() => {
    if (!showPicker) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowPicker(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPicker]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedColor, selectedSize]);

  return (
    <div className="bg-white/70 rounded-3xl overflow-hidden shadow-card border border-sand">
      <div className="aspect-[4/5] bg-sand/60 relative">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm">Sin imagen</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-terracotta text-cream text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full">
              Oferta
            </span>
          )}
          {tags.includes("nuevo") && (
            <span className="bg-ink text-cream text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full">
              Nuevo
            </span>
          )}
          {tags.includes("limitado") && (
            <span className="bg-olive text-cream text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full">
              Limitado
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg">{product.name}</h3>
        <p className="text-sm text-ink/70 mt-2 max-h-10 overflow-hidden">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-terracotta font-semibold">
              ${finalPrice.toLocaleString("es-CO")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-ink/50 line-through">
                ${product.basePrice.toLocaleString("es-CO")}
              </span>
            )}
          </div>
          <Link href={`/producto/${product.id}`} className="text-sm uppercase tracking-[0.2em]">
            Ver detalle
          </Link>
        </div>
        {!isAdmin && (
          <button
            onClick={handleAddClick}
            disabled={loading || outOfStock}
            className="mt-4 w-full rounded-full bg-ink text-cream py-2 uppercase tracking-[0.2em] text-xs"
          >
            {outOfStock ? "Sin stock" : loading ? "Agregando..." : "Añadir al carrito"}
          </button>
        )}
      </div>
      {showPicker && canBuy && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPicker(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar especificaciones del producto"
        >
          <div className="bg-cream rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-display text-lg">Selecciona especificaciones</h4>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
              >
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Talla</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-3 py-2"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Cantidad</label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full border border-sand"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="min-w-[40px] text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => {
                      const maxStock = selectedVariant?.stock || 1;
                      return Math.min(maxStock, prev + 1);
                    })
                  }
                  className="w-8 h-8 rounded-full border border-sand"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
            {selectedVariant && selectedVariant.stock <= 0 && (
              <p className="text-sm text-terracotta">Sin stock para esta combinación.</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="flex-1 rounded-full border border-ink py-2 uppercase tracking-[0.2em] text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => selectedVariant && handleAdd(selectedVariant.id)}
                disabled={!selectedVariant || selectedVariant.stock <= 0 || loading}
                className="flex-1 rounded-full bg-terracotta text-cream py-2 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
