"use client";

import { useEffect, useState } from "react";
import AdminProductForm from "../../../../../components/AdminProductForm";
import { updateProduct } from "../../../../../services/admin";
import { getProduct } from "../../../../../services/products";
import { useToast } from "../../../../../components/ToastProvider";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const [initial, setInitial] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    getProduct(params.id).then((product) => {
      if (!product) return;
      setInitial({
        name: product.name,
        refCode: product.refCode,
        description: product.description,
        brand: product.brand || "",
        category: product.category || "",
        featured: product.featured || false,
        tags: product.tags || "",
        discountPercentage: product.discountPercentage || 0,
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
    try {
      setSaving(true);
      await updateProduct(Number(params.id), data);
      show("Producto actualizado");
      window.location.href = "/admin/products";
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el producto";
      show(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!initial) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Editar producto</h2>
      <AdminProductForm initial={initial} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
