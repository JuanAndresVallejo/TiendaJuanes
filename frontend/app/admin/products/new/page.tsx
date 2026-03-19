"use client";

import { useState } from "react";
import AdminProductForm from "../../../../components/AdminProductForm";
import { createProduct } from "../../../../services/admin";
import { useToast } from "../../../../components/ToastProvider";

export default function AdminProductNewPage() {
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      setSaving(true);
      await createProduct(data);
      show("Producto creado");
      window.location.href = "/admin/products";
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el producto";
      show(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Nuevo producto</h2>
      <AdminProductForm onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
