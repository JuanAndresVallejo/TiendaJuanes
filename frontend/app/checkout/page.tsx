"use client";

import { useEffect, useMemo, useState } from "react";
import { getToken } from "../../services/auth";
import { createOrder } from "../../services/orders";
import { createPreference } from "../../services/payments";
import { addAddress, getAddresses, Address } from "../../services/addresses";
import { getCart, CartItem } from "../../services/cart";
import { useToast } from "../../components/ToastProvider";
import { validateCoupon } from "../../services/coupons";

const departments: Record<string, string[]> = {
  Antioquia: ["Medellin", "Bello", "Sabaneta", "Itagui", "La Estrella", "Envigado"]
};

export default function CheckoutPage() {
  const token = getToken();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [department, setDepartment] = useState("Antioquia");
  const [city, setCity] = useState("Medellin");
  const [addressLine, setAddressLine] = useState("");
  const [express, setExpress] = useState(false);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const cityOptions = useMemo(() => departments[department] || [], [department]);

  useEffect(() => {
    if (!token) return;
    getAddresses()
      .then((data) => {
        setAddresses(data);
        const def = data.find((a) => a.isDefault);
        if (def) {
          setSelectedAddressId(String(def.id));
        }
      })
      .catch(() => setAddresses([]));

    getCart().then(setCartItems).catch(() => setCartItems([]));
  }, [token]);

  useEffect(() => {
    if (!cityOptions.includes(city)) {
      setCity(cityOptions[0] || "");
    }
  }, [cityOptions, city]);

  const expressAllowed = department === "Antioquia" && ["Medellin", "Bello", "Sabaneta", "Itagui", "La Estrella"].includes(city);
  const shippingCost = express && expressAllowed
    ? city === "Medellin" ? 10000 : 20000
    : 0;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingCost - discount);

  const handleSubmit = async () => {
    if (!token) {
      window.location.href = "/login?redirect=/checkout";
      return;
    }

    try {
      setLoading(true);

      let addressId: number | null = null;
      if (!useNewAddress && selectedAddressId) {
        addressId = Number(selectedAddressId);
      } else {
        const created = await addAddress({
          department,
          city,
          addressLine,
          isDefault: addresses.length === 0
        });
        addressId = created.id;
      }

      const order = await createOrder({
        addressId,
        department,
        city,
        addressLine,
        express: express && expressAllowed
      });

      const preference = await createPreference(order.id);
      window.location.href = preference.initPoint;
    } catch (error) {
      show("No se pudo procesar el checkout", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (!res.valid) {
        show(res.message || "El cupón no es válido", "error");
        return;
      }
      setDiscount(Number(res.discount));
      show("Cupón aplicado");
    } catch {
      show("El cupón no es válido", "error");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="text-ink/70 mt-3">Direccion de envio y opciones de entrega.</p>

      <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6 space-y-6">
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Direccion guardada</label>
          <select
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            value={selectedAddressId}
            onChange={(e) => {
              setSelectedAddressId(e.target.value);
              setUseNewAddress(false);
              const selected = addresses.find((a) => String(a.id) === e.target.value);
              if (selected) {
                setDepartment(selected.department);
                setCity(selected.city);
                setAddressLine(selected.addressLine);
              }
            }}
          >
            <option value="">Selecciona una direccion</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.department} - {addr.city} | {addr.addressLine}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setUseNewAddress(true)}
            className="mt-3 text-sm text-terracotta"
          >
            Usar nueva direccion
          </button>
        </div>

        {useNewAddress && (
          <div className="grid gap-4">
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Departamento</label>
              <select
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {Object.keys(departments).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Ciudad</label>
              <select
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Direccion</label>
              <input
                type="text"
                placeholder="Ej: Calle 123 #45-67"
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={express}
            onChange={(e) => setExpress(e.target.checked)}
            disabled={!expressAllowed}
            className="mt-1"
          />
          <div>
            <p className="font-semibold">Envio express</p>
            <p className="text-sm text-ink/70">
              Entrega el mismo dia si el pedido se realiza antes de las 2:00 PM.
            </p>
            {!expressAllowed && (
              <p className="text-xs text-terracotta mt-1">Disponible solo en Antioquia (Medellin y municipios cercanos).</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Cupón</label>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 rounded-xl border border-sand bg-white/80 px-4 py-3"
              placeholder="Ingresa tu cupón"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="rounded-full border border-ink px-4"
            >
              Aplicar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString("es-CO")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Descuento</span>
          <span>-${discount.toLocaleString("es-CO")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Envio</span>
          <span>${shippingCost.toLocaleString("es-CO")}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>${total.toLocaleString("es-CO")}</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </section>
  );
}
