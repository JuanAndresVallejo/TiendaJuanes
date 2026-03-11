"use client";

import { useEffect, useState } from "react";
import { createCoupon, deactivateCoupon, getAdminCoupons, updateCoupon } from "../../../services/coupons";

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

  const load = async () => {
    const data = await getAdminCoupons();
    setCoupons(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
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
    await load();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateCoupon(id);
    await load();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 border border-sand rounded-2xl p-4">
        <h2 className="font-display text-2xl mb-4">Crear cupón</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="border border-sand rounded-xl px-3 py-2" placeholder="Código" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <input className="border border-sand rounded-xl px-3 py-2" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="border border-sand rounded-xl px-3 py-2" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
            <option value="PERCENTAGE">Porcentaje</option>
            <option value="FIXED">Fijo</option>
          </select>
          <input type="number" className="border border-sand rounded-xl px-3 py-2" placeholder="Valor" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
          <input type="number" className="border border-sand rounded-xl px-3 py-2" placeholder="Mínimo" value={form.minimumOrderAmount} onChange={(e) => setForm({ ...form, minimumOrderAmount: Number(e.target.value) })} />
          <input type="number" className="border border-sand rounded-xl px-3 py-2" placeholder="Usos" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} />
          <input type="datetime-local" className="border border-sand rounded-xl px-3 py-2" value={form.validFrom.slice(0,16)} onChange={(e) => setForm({ ...form, validFrom: new Date(e.target.value).toISOString() })} />
          <input type="datetime-local" className="border border-sand rounded-xl px-3 py-2" value={form.validUntil.slice(0,16)} onChange={(e) => setForm({ ...form, validUntil: new Date(e.target.value).toISOString() })} />
        </div>
        <button onClick={handleCreate} className="mt-4 rounded-full bg-terracotta text-cream px-4 py-2">Crear cupón</button>
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
