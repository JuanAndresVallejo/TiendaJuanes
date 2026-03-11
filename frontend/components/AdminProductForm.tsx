"use client";

import { useState } from "react";

type Variant = {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
};

type Image = {
  imageUrl: string;
};

type ProductFormData = {
  name: string;
  refCode: string;
  description: string;
  brand: string;
  category: string;
  basePrice: number;
  images: Image[];
  variants: Variant[];
};

export default function AdminProductForm({
  initial,
  onSubmit,
  loading
}: {
  initial?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(
    initial || {
      name: "",
      refCode: "",
      description: "",
      brand: "",
      category: "",
      basePrice: 0,
      images: [{ imageUrl: "" }],
      variants: [{ color: "", size: "", sku: "", price: 0, stock: 0 }]
    }
  );

  const updateField = (key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateVariant = (index: number, key: keyof Variant, value: any) => {
    const variants = [...form.variants];
    variants[index] = { ...variants[index], [key]: value };
    updateField("variants", variants);
  };

  const updateImage = (index: number, value: string) => {
    const images = [...form.images];
    images[index] = { imageUrl: value };
    updateField("images", images);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Nombre</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Referencia</label>
          <input
            value={form.refCode}
            onChange={(e) => updateField("refCode", e.target.value)}
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Marca</label>
          <input
            value={form.brand}
            onChange={(e) => updateField("brand", e.target.value)}
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Categoria</label>
          <input
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Precio base</label>
          <input
            type="number"
            value={form.basePrice}
            onChange={(e) => updateField("basePrice", Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Descripcion</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Imagenes</h3>
          <button
            type="button"
            onClick={() => updateField("images", [...form.images, { imageUrl: "" }])}
            className="text-terracotta"
          >
            Agregar imagen
          </button>
        </div>
        {form.images.map((img, index) => (
          <div key={index} className="flex gap-3">
            <input
              value={img.imageUrl}
              onChange={(e) => updateImage(index, e.target.value)}
              className="flex-1 rounded-xl border border-sand bg-white/80 px-4 py-3"
              placeholder="https://..."
            />
            {form.images.length > 1 && (
              <button
                type="button"
                onClick={() => updateField("images", form.images.filter((_, i) => i !== index))}
                className="text-terracotta"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Variantes</h3>
          <button
            type="button"
            onClick={() => updateField("variants", [...form.variants, { color: "", size: "", sku: "", price: 0, stock: 0 }])}
            className="text-terracotta"
          >
            Agregar variante
          </button>
        </div>
        {form.variants.map((variant, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-5">
            <input
              value={variant.color}
              onChange={(e) => updateVariant(index, "color", e.target.value)}
              className="rounded-xl border border-sand bg-white/80 px-3 py-2"
              placeholder="Color"
            />
            <input
              value={variant.size}
              onChange={(e) => updateVariant(index, "size", e.target.value)}
              className="rounded-xl border border-sand bg-white/80 px-3 py-2"
              placeholder="Talla"
            />
            <input
              value={variant.sku}
              onChange={(e) => updateVariant(index, "sku", e.target.value)}
              className="rounded-xl border border-sand bg-white/80 px-3 py-2"
              placeholder="SKU"
            />
            <input
              type="number"
              value={variant.price}
              onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
              className="rounded-xl border border-sand bg-white/80 px-3 py-2"
              placeholder="Precio"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                className="rounded-xl border border-sand bg-white/80 px-3 py-2 w-full"
                placeholder="Stock"
              />
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => updateField("variants", form.variants.filter((_, i) => i !== index))}
                  className="text-terracotta"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-terracotta text-cream px-6 py-3 uppercase tracking-[0.2em]"
      >
        {loading ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
