"use client";

import { useEffect, useState } from "react";
import { createCoupon, deactivateCoupon, getAdminCoupons, updateCoupon } from "../../../services/coupons";
import { useToast } from "../../../components/ToastProvider";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minimumOrderAmount: 0,
    usageLimit: 0,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
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

  const handleCreate = async () => {
    if (!form.code.trim()) {
      show("El código del cupón es obligatorio", "error");
      return;
    }
    try {
      setSaving(true);
      await createCoupon(form);
      setForm({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minimumOrderAmount: 0,
        usageLimit: 0,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Código</label>
            <input
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              placeholder="Ej: TIENDA10"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Descripción</label>
            <input
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              placeholder="Ej: 10% en compras superiores a 200.000"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Tipo de descuento</label>
            <select
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
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
              placeholder={form.discountType === "PERCENTAGE" ? "10" : "15000"}
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Mínimo de compra</label>
            <input
              type="number"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              placeholder="0"
              value={form.minimumOrderAmount}
              onChange={(e) => setForm({ ...form, minimumOrderAmount: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Límite de usos</label>
            <input
              type="number"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              placeholder="0"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Válido desde</label>
            <input
              type="datetime-local"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              value={form.validFrom.slice(0,16)}
              onChange={(e) => setForm({ ...form, validFrom: new Date(e.target.value).toISOString() })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Válido hasta</label>
            <input
              type="datetime-local"
              className="mt-2 w-full border border-sand rounded-xl px-3 py-2"
              value={form.validUntil.slice(0,16)}
              onChange={(e) => setForm({ ...form, validUntil: new Date(e.target.value).toISOString() })}
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
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="rounded-full bg-terracotta text-cream px-4 py-2 uppercase tracking-[0.2em]"
        >
          {saving ? "Creando..." : "Crear cupón"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Usos</th>
              <th className="p-3">Vigencia</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
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
                  <button onClick={() => handleDeactivate(c.id)} className="text-terracotta">Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
