"use client";

import { useEffect, useState } from "react";
import { getInventory, updateInventory } from "../../../services/admin";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const load = async () => {
    try {
      setError(null);
      const data = await getInventory();
      setItems(data);
    } catch (e) {
      setItems([]);
      setError("No se pudo cargar el inventario");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (productVariantId: number) => {
    const raw = adjustments[productVariantId];
    const delta = Number(raw);
    if (!Number.isFinite(delta) || delta === 0) {
      setError("Ingresa un ajuste válido (ej: 10 o -5)");
      return;
    }
    await updateInventory({ productVariantId, delta });
    setAdjustments((prev) => ({ ...prev, [productVariantId]: "" }));
    await load();
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Inventario</h2>
      {error && <p className="text-terracotta mb-4">{error}</p>}
      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Referencia</th>
              <th className="p-3">Color</th>
              <th className="p-3">Talla</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Stock actual</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const lowStock = item.stock <= 5;
              return (
              <tr key={item.productVariantId} className="border-t border-sand/60">
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [item.productVariantId]: !prev[item.productVariantId]
                      }))
                    }
                    className="text-left"
                  >
                    {item.productName}
                  </button>
                  {lowStock && <span className="ml-2 text-xs text-terracotta">Bajo stock</span>}
                </td>
                <td className="p-3">{item.refCode}</td>
                <td className="p-3">{item.color}</td>
                <td className="p-3">{item.size}</td>
                <td className="p-3">{item.sku}</td>
                <td className={`p-3 ${lowStock ? "text-terracotta font-semibold" : ""}`}>{item.stock}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={adjustments[item.productVariantId] ?? ""}
                      onChange={(e) =>
                        setAdjustments((prev) => ({ ...prev, [item.productVariantId]: e.target.value }))
                      }
                      placeholder="+20 o -15"
                      className="w-24 rounded-lg border border-sand bg-white/80 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => adjust(item.productVariantId)}
                      className="rounded-full border border-ink px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    >
                      Aplicar
                    </button>
                  </div>
                </td>
              </tr>
              {expanded[item.productVariantId] && (
                <tr className="border-t border-sand/60 bg-cream/40">
                  <td colSpan={7} className="p-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-24 h-28 object-cover rounded-xl border border-sand"
                      />
                    ) : (
                      <span className="text-xs text-ink/60">Sin imagen disponible</span>
                    )}
                  </td>
                </tr>
              )}
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
