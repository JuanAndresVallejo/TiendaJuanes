"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getRole, getToken } from "../../services/auth";
import { createOrder } from "../../services/orders";
import { createPreference } from "../../services/payments";
import { addAddress, getAddresses, Address } from "../../services/addresses";
import { getCart, CartItem } from "../../services/cart";
import { useToast } from "../../components/ToastProvider";
import { validateCoupon } from "../../services/coupons";
import { FaUniversity, FaMoneyBillWave, FaBoxOpen } from "react-icons/fa";

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
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MERCADOPAGO");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const cityOptions = useMemo(() => departments[department] || [], [department]);
  const [isBeforeTwoPm, setIsBeforeTwoPm] = useState(() => {
    const now = new Date();
    return now.getHours() < 14;
  });

  useEffect(() => {
    if (!token) return;
    if (["ADMIN", "ROLE_ADMIN"].includes(getRole() || "")) {
      show("Los administradores no pueden realizar pedidos", "error");
      window.location.href = "/admin/dashboard";
      return;
    }
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
  }, [token, show]);

  useEffect(() => {
    if (!cityOptions.includes(city)) {
      setCity(cityOptions[0] || "");
    }
  }, [cityOptions, city]);

  const expressAllowed = department === "Antioquia" && ["Medellin", "Bello", "Sabaneta", "Itagui", "La Estrella"].includes(city);
  const canUseExpress = expressAllowed && isBeforeTwoPm;
  const shippingCost = express && canUseExpress
    ? city === "Medellin" ? 10000 : 20000
    : 0;

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setIsBeforeTwoPm(now.getHours() < 14);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!canUseExpress && express) {
      setExpress(false);
    }
  }, [canUseExpress, express]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingCost - discount);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!token) {
      window.location.href = "/login?redirect=/checkout";
      return;
    }

    if (couponCode.trim() && !appliedCoupon) {
      show("Debes validar el cupón antes de continuar", "error");
      return;
    }
    if (!window.confirm("¿Confirmas que deseas finalizar esta compra con los productos seleccionados?")) {
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
        express: express && canUseExpress,
        notes: notes.trim() || undefined,
        couponCode: appliedCoupon || undefined,
        paymentMethod
      });

      if (paymentMethod === "MERCADOPAGO") {
        const preference = await createPreference(order.id);
        window.open(preference.initPoint, "_blank");
      } else {
        show("Pedido creado. Te contactaremos para coordinar el pago.", "success");
        window.location.href = "/mis-pedidos";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar el checkout";
      show(message, "error");
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
      setAppliedCoupon(couponCode.trim());
      show("Cupón aplicado");
    } catch {
      show("El cupón no es válido", "error");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <a href="/carrito" className="text-xs uppercase tracking-[0.2em] text-ink/60">Atras</a>
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="text-ink/70 mt-3">Direccion de envio y opciones de entrega.</p>

      <form className="mt-8 bg-white/70 border border-sand rounded-3xl p-6 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Direccion guardada</label>
          <select
            className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            value={selectedAddressId}
            disabled={addresses.length === 0}
            aria-label="Seleccionar dirección guardada"
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
            {addresses.length === 0 && <option value="">No tienes direcciones guardadas</option>}
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
            aria-label="Usar una nueva dirección"
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
                aria-label="Departamento de envío"
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
                aria-label="Ciudad de envío"
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
                aria-label="Dirección de envío"
              />
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={express}
            onChange={(e) => setExpress(e.target.checked)}
            disabled={!canUseExpress}
            className="mt-1"
            aria-label="Activar envío express"
          />
          <div>
            <p className="font-semibold">Envio express</p>
            <p className="text-sm text-ink/70">
              Entrega el mismo dia si el pedido se realiza antes de las 2:00 PM.
            </p>
            {!expressAllowed && (
              <p className="text-xs text-terracotta mt-1">Disponible solo en Antioquia (Medellin y municipios cercanos).</p>
            )}
            {expressAllowed && !isBeforeTwoPm && (
              <p className="text-xs text-terracotta mt-1">Disponible solo antes de las 2:00 PM.</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Cupón</label>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCoupon();
                }
              }}
              className="flex-1 rounded-xl border border-sand bg-white/80 px-4 py-3"
              placeholder="Ingresa tu cupón"
              aria-label="Código de cupón"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="rounded-full border border-ink px-4"
              aria-label="Aplicar cupón"
            >
              Aplicar
            </button>
          </div>
          {appliedCoupon && (
            <p className="text-xs text-olive">Cupón aplicado: {appliedCoupon}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Método de pago</label>
          <div className="grid gap-2 md:grid-cols-3" role="radiogroup" aria-label="Métodos de pago disponibles">
            <button
              type="button"
              onClick={() => setPaymentMethod("MERCADOPAGO")}
              className={`rounded-2xl border px-4 py-3 text-left ${paymentMethod === "MERCADOPAGO" ? "border-ink bg-ink text-cream" : "border-sand bg-white/80"}`}
              role="radio"
              aria-checked={paymentMethod === "MERCADOPAGO"}
            >
              <span className="flex items-center gap-2"><FaUniversity /> PSE</span>
              <span className="mt-1 block text-xs opacity-80">MercadoPago</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("TRANSFERENCIA")}
              className={`rounded-2xl border px-4 py-3 text-left ${paymentMethod === "TRANSFERENCIA" ? "border-ink bg-ink text-cream" : "border-sand bg-white/80"}`}
              role="radio"
              aria-checked={paymentMethod === "TRANSFERENCIA"}
            >
              <span className="flex items-center gap-2"><FaMoneyBillWave /> Transferencia</span>
              <span className="mt-1 block text-xs opacity-80">Pago bancario</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("CONTRAENTREGA")}
              className={`rounded-2xl border px-4 py-3 text-left ${paymentMethod === "CONTRAENTREGA" ? "border-ink bg-ink text-cream" : "border-sand bg-white/80"}`}
              role="radio"
              aria-checked={paymentMethod === "CONTRAENTREGA"}
            >
              <span className="flex items-center gap-2"><FaBoxOpen /> Contraentrega</span>
              <span className="mt-1 block text-xs opacity-80">Pagas al recibir</span>
            </button>
          </div>
          {paymentMethod !== "MERCADOPAGO" && (
            <p className="text-xs text-ink/60">
              Te contactaremos para confirmar el pago y coordinar la entrega.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Notas u observaciones</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
            className="w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
            placeholder="Ej: Entregar en portería, timbre no funciona, etc."
            aria-label="Notas u observaciones del pedido"
          />
          <p className="text-xs text-ink/60 text-right">{notes.length}/300</p>
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
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </form>
    </section>
  );
}
