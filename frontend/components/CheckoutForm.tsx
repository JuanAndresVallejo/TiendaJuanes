export default function CheckoutForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Direccion de envio</label>
        <input
          type="text"
          placeholder="Ej: Calle 123 #45-67, Bogota"
          className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-[0.2em] text-ink/70">Tipo de envio</label>
        <select className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3">
          <option>Envio estandar</option>
          <option>Envio express</option>
        </select>
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
      >
        Finalizar compra
      </button>
    </form>
  );
}
