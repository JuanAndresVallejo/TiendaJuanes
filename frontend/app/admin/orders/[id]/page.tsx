"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getOrderDetail, updateOrderStatus } from "../../../../services/admin";
import { useToast } from "../../../../components/ToastProvider";

type OrderItem = {
  productName: string;
  productReference: string;
  variantSize: string;
  variantColor: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string | null;
};

type OrderDetail = {
  orderId: number;
  customer: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = Number(params?.id);
  const { show } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [packed, setPacked] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetail(orderId);
        setOrder(data);
        const initialPacked: Record<number, boolean> = {};
        data.items.forEach((item: OrderItem, index: number) => {
          initialPacked[index] = false;
        });
        setPacked(initialPacked);
      } catch (error) {
        show("No se pudo cargar el pedido", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, show]);

  const allPacked = useMemo(() => {
    if (!order) return false;
    return order.items.every((_, index) => packed[index]);
  }, [order, packed]);

  const togglePacked = (index: number) => {
    setPacked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMarkPacked = async () => {
    if (!order) return;
    if (order.status !== "PACKING") {
      show("El pedido debe estar en estado EMPACANDO", "error");
      return;
    }
    try {
      setUpdating(true);
      await updateOrderStatus(order.orderId, "SHIPPED");
      setOrder({ ...order, status: "SHIPPED" });
      show("Pedido marcado como enviado");
    } catch (error) {
      show("No se pudo actualizar el pedido", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-ink/70">Cargando pedido...</div>;
  }

  if (!order) {
    return <div className="text-sm text-ink/70">No se encontró el pedido.</div>;
  }

  const qrUrl = typeof window !== "undefined"
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.origin + "/admin/orders/" + order.orderId)}`
    : "";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-2">Pedido #{order.orderId}</h2>
        <p className="text-sm text-ink/70">Detalle para empaque</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 bg-white/70 border border-sand rounded-2xl p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Cliente</p>
          <p className="font-medium">{order.customer}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Correo</p>
          <p>{order.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Teléfono</p>
          <p>{order.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Dirección</p>
          <p>{order.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Método de pago</p>
          <p>{order.paymentMethod || "MercadoPago"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Estado</p>
          <p className="font-semibold">{order.status}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Fecha</p>
          <p>{new Date(order.createdAt).toLocaleDateString("es-CO")}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Total</p>
          <p className="font-semibold">${order.total.toLocaleString("es-CO")}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">QR rápido</p>
          {qrUrl ? (
            <img src={qrUrl} alt="QR pedido" className="mt-2 w-24 h-24 rounded-lg border border-sand" />
          ) : (
            <p className="text-sm text-ink/60 mt-2">QR no disponible</p>
          )}
        </div>
      </section>

      <section className="bg-white/70 border border-sand rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Checklist de empaque</h3>
          {allPacked ? (
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-700">Pedido listo para envío</span>
          ) : (
            <span className="text-xs uppercase tracking-[0.2em] text-ink/50">Pendiente por empacar</span>
          )}
        </div>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <label
              key={`${item.productReference}-${index}`}
              className="flex items-start gap-4 border border-sand/60 rounded-xl p-4 bg-cream/40"
            >
              <input
                type="checkbox"
                className="mt-2 h-4 w-4"
                checked={!!packed[index]}
                onChange={() => togglePacked(index)}
              />
              <div className="w-16 h-20 bg-sand/60 rounded-lg overflow-hidden relative flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-ink/60">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-xs text-ink/70">REF: {item.productReference}</p>
                <p className="text-xs text-ink/70">Talla: {item.variantSize}</p>
                <p className="text-xs text-ink/70">Color: {item.variantColor}</p>
                <p className="text-xs text-ink/70">Cantidad: {item.quantity}</p>
                <p className="text-xs text-ink/70">
                  Precio unitario: ${Number(item.unitPrice).toLocaleString("es-CO")}
                </p>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={handleMarkPacked}
          disabled={updating || order.status !== "PACKING" || !allPacked}
          className="w-full md:w-auto rounded-full bg-ink text-cream px-6 py-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
        >
          {updating ? "Actualizando..." : "Pedido empacado"}
        </button>
      </section>
    </div>
  );
}
