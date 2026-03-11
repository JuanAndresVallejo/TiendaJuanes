"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../../services/admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

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

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Pedidos</h2>
      <div className="overflow-x-auto bg-white/70 border border-sand rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Metodo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-sand/60">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString("es-CO")}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
