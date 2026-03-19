"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orders";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getMyOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Mis pedidos</h1>
      <ul className="mt-6 space-y-4" aria-label="Listado de pedidos">
        {orders.map((order) => (
          <li key={order.id} className="bg-white/70 border border-sand rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/70">Pedido #{order.id}</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString("es-CO")} ·{" "}
                {new Date(order.createdAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-sm">Estado: {order.status}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${order.totalAmount.toLocaleString("es-CO")}</p>
              <Link href={`/mis-pedidos/${order.id}`} className="text-terracotta text-sm" aria-label={`Ver detalle del pedido ${order.id}`}>Ver detalle</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
