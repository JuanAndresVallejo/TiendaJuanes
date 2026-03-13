import DevStatusBar from "./DevStatusBar";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl">Tienda Juanes</h3>
          <p className="text-sm text-cream/70 mt-3">
            Importadores de ropa americana para hombre y mujer en Colombia.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-cream/70">Atencion</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Envios nacionales</li>
            <li>Pagos seguros con MercadoPago</li>
            <li>Soporte por WhatsApp</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-cream/70">Contacto</h4>
          <p className="text-sm mt-3">Bogota, Colombia</p>
          <p className="text-sm">ventas@tiendajuanes.com</p>
        </div>
      </div>
      <DevStatusBar />
    </footer>
  );
}
