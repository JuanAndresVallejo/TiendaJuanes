"use client";

import { useEffect, useState } from "react";
import AdminProductForm from "../../../../../components/AdminProductForm";
import { updateProduct } from "../../../../../services/admin";
import { getProduct } from "../../../../../services/products";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const [initial, setInitial] = useState<any>(null);

  useEffect(() => {
    getProduct(params.id).then((product) => {
      if (!product) return;
      setInitial({
        name: product.name,
        refCode: product.refCode,
        description: product.description,
        brand: product.brand || "",
        category: product.category || "",
        basePrice: product.basePrice,
        images: product.images.map((i) => ({ imageUrl: i.imageUrl })),
        variants: product.variants.map((v) => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          price: v.price,
          stock: v.stock
        }))
      });
    });
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    await updateProduct(Number(params.id), data);
    window.location.href = "/admin/products";
  };

  if (!initial) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Editar producto</h2>
      <AdminProductForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
