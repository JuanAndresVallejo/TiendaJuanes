export type CartItemProps = {
  id: number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
};

import Image from "next/image";

export default function CartItem({ name, color, size, quantity, price, imageUrl }: CartItemProps) {
  const subtotal = price * quantity;
  return (
    <div className="flex gap-4 bg-white/70 rounded-2xl p-4 border border-sand">
      <div className="w-20 h-24 bg-sand/70 rounded-xl overflow-hidden relative">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs">Sin imagen</div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-display text-lg">{name}</h4>
        <p className="text-sm text-ink/70">Color: {color} | Talla: {size}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">Cantidad: {quantity}</span>
          <span className="text-terracotta font-semibold">${price.toLocaleString("es-CO")}</span>
        </div>
        <div className="mt-2 text-base font-semibold text-terracotta">
          Subtotal: ${subtotal.toLocaleString("es-CO")}
        </div>
      </div>
    </div>
  );
}
