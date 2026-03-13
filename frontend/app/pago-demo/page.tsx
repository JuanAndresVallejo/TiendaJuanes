export default function PagoDemoPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl">Pago de prueba</h1>
      <p className="mt-4 text-ink/70">
        Esta es una pagina generica para validar el flujo de pago mientras se configura MercadoPago.
        Cuando conectemos las credenciales reales, aqui se abrira la pasarela oficial.
      </p>
      <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-olive">Estado</p>
        <p className="mt-2">Checkout abierto correctamente.</p>
      </div>
    </section>
  );
}
