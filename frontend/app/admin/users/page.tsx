"use client";

import { useEffect, useState } from "react";
import { getAdminUserDetail, getAdminUsers } from "../../../services/admin";
import { useToast } from "../../../components/ToastProvider";

type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  orderCount: number;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (id: number) => {
    try {
      setLoadingDetail(true);
      const data = await getAdminUserDetail(id);
      setSelected(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cargar el detalle";
      show(message, "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Usuarios</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="bg-white/70 border border-sand rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">Listado de clientes registrados</caption>
            <thead className="bg-sand/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-3">Nombre</th>
                <th scope="col" className="px-4 py-3">Correo</th>
                <th scope="col" className="px-4 py-3"># Pedidos</th>
                <th scope="col" className="px-4 py-3">Fecha</th>
                <th scope="col" className="px-4 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-sand/60">
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.orderCount}</td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openDetail(user.id)}
                      className="text-terracotta uppercase tracking-[0.2em] text-xs"
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={5}>No hay usuarios para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detalle de usuario"
          onClick={() => setSelected(null)}
        >
          <div className="bg-cream rounded-2xl w-full max-w-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl">{selected.fullName}</h3>
                <p className="text-sm text-ink/70">{selected.email}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-xs uppercase tracking-[0.2em] text-ink/60">
                Cerrar
              </button>
            </div>
            {loadingDetail ? (
              <p className="text-sm text-ink/70">Cargando detalle...</p>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <p><strong>Celular:</strong> {selected.phone || "-"}</p>
                  <p><strong>Documento:</strong> {selected.documentId || "-"}</p>
                  <p><strong>Fecha creación:</strong> {new Date(selected.createdAt).toLocaleString("es-CO")}</p>
                  <p><strong># Pedidos:</strong> {selected.orderCount}</p>
                </div>
                <div>
                  <h4 className="font-display text-lg">Direcciones</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    {(selected.addresses || []).map((addr: any) => (
                      <div key={addr.id} className="border border-sand rounded-xl p-2">
                        {addr.department} - {addr.city} | {addr.addressLine} {addr.isDefault ? "(Principal)" : ""}
                      </div>
                    ))}
                    {(!selected.addresses || selected.addresses.length === 0) && <p className="text-ink/60">Sin direcciones registradas.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-lg">Últimos pedidos</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    {(selected.recentOrders || []).map((order: any) => (
                      <div key={order.id} className="border border-sand rounded-xl p-2 flex items-center justify-between">
                        <span>#{order.id} · {order.status}</span>
                        <span>${Number(order.totalAmount || 0).toLocaleString("es-CO")}</span>
                      </div>
                    ))}
                    {(!selected.recentOrders || selected.recentOrders.length === 0) && <p className="text-ink/60">Sin pedidos.</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
