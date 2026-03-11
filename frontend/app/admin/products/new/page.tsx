"use client";

import AdminProductForm from "../../../../components/AdminProductForm";
import { createProduct } from "../../../../services/admin";

export default function AdminProductNewPage() {
  const handleSubmit = async (data: any) => {
    await createProduct(data);
    window.location.href = "/admin/products";
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Nuevo producto</h2>
      <AdminProductForm onSubmit={handleSubmit} />
    </div>
  );
}
