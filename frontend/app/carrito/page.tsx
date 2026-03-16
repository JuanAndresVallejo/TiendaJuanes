"use client";

import { useEffect, useState } from "react";
import CartItem from "../../components/CartItem";
import { getCart, removeFromCart, updateCart, CartItem as CartItemType } from "../../services/cart";
import { getRole } from "../../services/auth";

export default function CartPage() {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getRole() === "ADMIN") {
      window.location.href = "/admin/dashboard";
      return;
    }
    load();
  }, []);

  const handleUpdate = async (productVariantId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productVariantId === productVariantId ? { ...item, quantity } : item
      )
    );
    try {
      await updateCart(productVariantId, quantity);
    } catch {
      await load();
    }
  };

  const handleRemove = async (productVariantId: number) => {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.productVariantId !== productVariantId));
    try {
      await removeFromCart(productVariantId);
    } catch {
      setItems(previous);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Mi carrito</h1>
      {loading ? (
        <p className="mt-6">Cargando carrito...</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.length === 0 && <p>No tienes productos en el carrito.</p>}
            {items.map((item) => (
              <div key={item.id}>
                <CartItem
                  id={item.id}
                  name={item.productName}
                  color={item.color}
                  size={item.size}
                  quantity={item.quantity}
                  price={item.price}
                  imageUrl={item.imageUrl}
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdate(item.productVariantId, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded-full border border-sand"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate(item.productVariantId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-sand"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productVariantId)}
                    className="text-sm text-terracotta"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/70 border border-sand rounded-3xl p-6 h-fit">
            <h2 className="font-display text-2xl">Resumen</h2>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span>Total</span>
              <span className="text-terracotta font-semibold">${total.toLocaleString("es-CO")}</span>
            </div>
            {items.length > 0 ? (
              <a
                href="/checkout"
                className="mt-6 block text-center rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
              >
                Finalizar compra
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-full bg-sand text-ink/50 py-3 uppercase tracking-[0.2em] cursor-not-allowed"
              >
                Finalizar compra
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
