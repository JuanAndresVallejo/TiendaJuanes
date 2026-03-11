"use client";

import { useEffect, useState } from "react";
import { getOrderTracking } from "../../../services/orders";

const steps = [
  "PENDING",
  "PAID",
  "PACKING",
  "SHIPPED",
  "DELIVERED"
];

const labels: Record<string, string> = {
  PENDING: "Pedido recibido",
  PAID: "Pago confirmado",
  PACKING: "Empacando pedido",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado"
};

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getOrderTracking(Number(params.id)).then(setHistory).catch(() => setHistory([]));
  }, [params.id]);

  const currentStatus = history.length ? history[history.length - 1].status : "PENDING";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Tracking pedido #{params.id}</h1>
      <div className="mt-8 space-y-4">
        {steps.map((step) => {
          const completed = steps.indexOf(step) <= steps.indexOf(currentStatus);
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
