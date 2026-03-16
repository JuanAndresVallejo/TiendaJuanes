"use client";

import { useEffect, useState } from "react";
import { getOrder, getOrderTracking } from "../../../services/orders";

const steps = ["PAID", "PACKING", "SHIPPED", "DELIVERED"];

const labels: Record<string, string> = {
  PAID: "Pago confirmado",
  PACKING: "Empacando pedido",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado"
};

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [history, setHistory] = useState<any[]>([]);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    getOrderTracking(Number(params.id)).then(setHistory).catch(() => setHistory([]));
    getOrder(Number(params.id)).then(setOrder).catch(() => setOrder(null));
  }, [params.id]);

  const currentStatus = history.length ? history[history.length - 1].status : "PENDING";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Tracking pedido #{params.id}</h1>
      {order && (
        <div className="mt-6 bg-white/70 border border-sand rounded-2xl p-4 text-sm">
          <p>Total: <span className="font-semibold">${order.totalAmount.toLocaleString("es-CO")}</span></p>
          <p>Estado: {labels[currentStatus] || "Pago pendiente"}</p>
          {order.notes && (
            <p className="mt-2 text-ink/70">Notas: {order.notes}</p>
          )}
          <div className="mt-4 space-y-2">
            {order.items.map((item: any) => (
              <div key={item.productVariantId} className="flex items-center justify-between">
                <span>{item.name} · {item.color} · {item.size}</span>
                <span>x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 space-y-4">
        {steps.map((step) => {
          const currentIndex = steps.indexOf(currentStatus);
          const completed = currentIndex >= 0 && steps.indexOf(step) <= currentIndex;
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${completed ? "bg-olive" : "bg-sand"}`} />
              <span className={completed ? "text-ink" : "text-ink/50"}>{labels[step]}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
