"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct, getAdminProducts } from "../../../services/admin";
import type { Product } from "../../../services/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const load = async () => {
    const data = await getAdminProducts();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar producto?")) return;
    await deleteProduct(id);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Productos</h2>
        <Link href="/admin/products/new" className="rounded-full bg-terracotta text-cream px-4 py-2 text-sm">
          Nuevo producto
        </Link>
      </div>
      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Referencia</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock total</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              const image = product.images[0]?.imageUrl;
              return (
                <tr key={product.id} className="border-t border-sand/60">
                  <td className="p-3">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-sand/60 rounded-lg" />
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.refCode}</td>
                  <td className="p-3">${product.basePrice.toLocaleString("es-CO")}</td>
                  <td className="p-3">{totalStock}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 flex gap-2">
                    <Link href={`/admin/products/edit/${product.id}`} className="text-olive">Editar</Link>
                    <button onClick={() => handleDelete(product.id)} className="text-terracotta">Eliminar</button>
                    <Link href={`/producto/${product.id}`} className="text-ink">Ver</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
