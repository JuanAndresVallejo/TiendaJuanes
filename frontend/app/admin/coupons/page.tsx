"use client";

import { FormEvent, useEffect, useState } from "react";
import { createCoupon, deactivateCoupon, getAdminCoupons } from "../../../services/coupons";
import { useToast } from "../../../components/ToastProvider";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const nowLocal = new Date().toISOString().slice(0, 16);
  const weekLocal = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrderAmount: "",
    usageLimit: "",
    validFrom: nowLocal,
    validUntil: weekLocal,
    active: true
  });
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  const load = async () => {
    try {
      const data = await getAdminCoupons();
      setCoupons(data);
    } catch (error) {
      show("No se pudieron cargar los cupones", "error");
      setCoupons([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!form.code.trim()) {
      show("El código del cupón es obligatorio", "error");
      return;
    }
    if (!form.discountValue.trim()) {
      show("El valor del descuento es obligatorio", "error");
      return;
    }
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount || "0"),
      usageLimit: Number(form.usageLimit || "0"),
      validFrom: new Date(form.validFrom).toISOString(),
      validUntil: new Date(form.validUntil).toISOString()
    };
    if (!Number.isFinite(payload.discountValue) || payload.discountValue <= 0) {
      show("El descuento debe ser mayor a 0", "error");
      return;
    }
    if (!Number.isFinite(payload.minimumOrderAmount) || payload.minimumOrderAmount < 0) {
      show("El mínimo de compra no es válido", "error");
      return;
    }
    if (!Number.isFinite(payload.usageLimit) || payload.usageLimit < 0) {
      show("El límite de usos no es válido", "error");
      return;
    }
    if (new Date(payload.validUntil).getTime() <= new Date(payload.validFrom).getTime()) {
      show("La fecha de vigencia final debe ser posterior a la inicial", "error");
      return;
    }
    try {
      setSaving(true);
      await createCoupon(payload);
      setForm({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minimumOrderAmount: "",
        usageLimit: "",
        validFrom: nowLocal,
        validUntil: weekLocal,
        active: true
      });
      show("Cupón creado");
      await load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el cupón";
      show(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateCoupon(id);
      show("Cupón desactivado");
      await load();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo desactivar el cupón";
      show(message, "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 border border-sand rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl">Crear cupón</h2>
          <p className="text-sm text-ink/60">Define descuentos claros para campañas promocionales.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Código</label>
            <input
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Código del cupón"
              placeholder="Ej: TIENDA10"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Descripción</label>
            <input
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Descripción del cupón"
              placeholder="Ej: 10% en compras superiores a 200.000"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Tipo de descuento</label>
            <select
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Tipo de descuento"
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            >
              <option value="PERCENTAGE">Porcentaje</option>
              <option value="FIXED">Valor fijo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">
              {form.discountType === "PERCENTAGE" ? "Porcentaje (%)" : "Valor fijo ($)"}
            </label>
            <input
              type="number"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label={form.discountType === "PERCENTAGE" ? "Porcentaje de descuento" : "Valor fijo del descuento"}
              placeholder={form.discountType === "PERCENTAGE" ? "10" : "15000"}
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Mínimo de compra</label>
            <input
              type="number"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Mínimo de compra"
              placeholder="0"
              value={form.minimumOrderAmount}
              onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Límite de usos</label>
            <input
              type="number"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Límite de usos"
              placeholder="0"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Válido desde</label>
            <input
              type="datetime-local"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Fecha inicial de vigencia"
              value={form.validFrom}
              onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Válido hasta</label>
            <input
              type="datetime-local"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              aria-label="Fecha final de vigencia"
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Cupón activo
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-terracotta text-cream px-4 py-2 uppercase tracking-[0.2em]"
          >
            {saving ? "Creando..." : "Crear cupón"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <caption className="sr-only">Listado de cupones</caption>
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th scope="col" className="p-3">Código</th>
              <th scope="col" className="p-3">Tipo</th>
              <th scope="col" className="p-3">Valor</th>
              <th scope="col" className="p-3">Usos</th>
              <th scope="col" className="p-3">Vigencia</th>
              <th scope="col" className="p-3">Estado</th>
              <th scope="col" className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-sand/60">
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.discountType}</td>
                <td className="p-3">{c.discountValue}</td>
                <td className="p-3">{c.usedCount}/{c.usageLimit}</td>
                <td className="p-3">{new Date(c.validUntil).toLocaleDateString("es-CO")}</td>
                <td className="p-3">{c.active ? "Activo" : "Inactivo"}</td>
                <td className="p-3">
                  <button onClick={() => handleDeactivate(c.id)} className="text-terracotta" aria-label={`Desactivar cupón ${c.code}`}>Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
