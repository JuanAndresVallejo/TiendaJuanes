"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { downloadSalesReport, getOrders, updateOrderStatus } from "../../../services/admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
    await load();
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadSalesReport();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Pedidos</h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="rounded-full border border-ink px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
        >
          {exporting ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>
      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Pago</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Metodo</th>
              <th className="p-3">Direccion</th>
              <th className="p-3">Notas</th>
              <th className="p-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-sand/60">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString("es-CO")}</td>
                <td className="p-3">
                  {order.paymentDate
                    ? new Date(order.paymentDate).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
                    : "-"}
                </td>
                <td className="p-3">${order.totalAmount.toLocaleString("es-CO")}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatus(order.id, e.target.value)}
                    className="rounded-lg border border-sand bg-white/80 px-2 py-1"
                  >
                    {[
                      "PENDING",
                      "PAID",
                      "PACKING",
                      "SHIPPED",
                      "DELIVERED",
                      "CANCELLED"
                    ].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{order.paymentMethod || "MercadoPago"}</td>
                <td className="p-3">{order.shippingAddress || "-"}</td>
                <td className="p-3">{order.notes || "-"}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs uppercase tracking-[0.2em] text-terracotta"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
