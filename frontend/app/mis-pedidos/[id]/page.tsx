"use client";

import { useEffect, useState } from "react";
import { getOrder, getOrderTracking, reorderOrder } from "../../../services/orders";
import { useToast } from "../../../components/ToastProvider";

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
  const [reordering, setReordering] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    getOrderTracking(Number(params.id)).then(setHistory).catch(() => setHistory([]));
    getOrder(Number(params.id)).then(setOrder).catch(() => setOrder(null));
  }, [params.id]);

  const currentStatus = history.length ? history[history.length - 1].status : "PENDING";

  const handleReorder = async () => {
    try {
      setReordering(true);
      await reorderOrder(Number(params.id));
      show("Productos añadidos al carrito");
      window.location.href = "/carrito";
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo reordenar";
      show(message, "error");
    } finally {
      setReordering(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <a href="/mis-pedidos" className="text-xs uppercase tracking-[0.2em] text-ink/60">Atras</a>
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
              <div key={item.productVariantId} className="flex items-center justify-between gap-3">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-sand/60 flex-shrink-0">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-ink/60 text-xs ml-2">REF: {item.productReference}</span>
                  <div className="text-xs text-ink/60">
                    {item.color} · {item.size}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>Unitario: ${Number(item.price).toLocaleString("es-CO")}</div>
                  <div>Cantidad: {item.quantity}</div>
                  <div className="font-semibold">
                    Subtotal: ${(Number(item.price) * item.quantity).toLocaleString("es-CO")}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleReorder}
            disabled={reordering}
            className="mt-4 rounded-full border border-ink px-4 py-2 uppercase tracking-[0.2em] text-xs"
            aria-label="Comprar nuevamente los productos de este pedido"
          >
            {reordering ? "Reordenando..." : "Comprar nuevamente"}
          </button>
        </div>
      )}
      <ol className="mt-8 space-y-4" aria-label="Progreso del pedido">
        {steps.map((step) => {
          const currentIndex = steps.indexOf(currentStatus);
          const completed = currentIndex >= 0 && steps.indexOf(step) <= currentIndex;
          return (
            <li key={step} className="flex items-center gap-3" aria-current={step === currentStatus ? "step" : undefined}>
              <div className={`w-3 h-3 rounded-full ${completed ? "bg-olive" : "bg-sand"}`} />
              <span className={completed ? "text-ink" : "text-ink/50"}>{labels[step]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
