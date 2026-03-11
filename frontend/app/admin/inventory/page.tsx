"use client";

import { useEffect, useState } from "react";
import { getInventory, updateInventory } from "../../../services/admin";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const data = await getInventory();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (productVariantId: number, delta: number) => {
    await updateInventory({ productVariantId, delta });
    await load();
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Inventario</h2>
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
            {items.map((item) => (
              <tr key={item.productVariantId} className="border-t border-sand/60">
                <td className="p-3">{item.productName}</td>
                <td className="p-3">{item.refCode}</td>
                <td className="p-3">{item.color}</td>
                <td className="p-3">{item.size}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.stock}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => adjust(item.productVariantId, 1)} className="text-olive">+1</button>
                  <button onClick={() => adjust(item.productVariantId, -1)} className="text-terracotta">-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
