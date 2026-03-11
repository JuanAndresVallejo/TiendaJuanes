import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/products";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Nueva coleccion</p>
          <h1 className="font-display text-4xl md:text-6xl mt-4">Ropa americana seleccionada para tu estilo diario</h1>
          <p className="mt-6 text-lg text-ink/70">
            Importamos piezas unicas para hombre y mujer. Calidad premium, tallas variadas y envios seguros en toda Colombia.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/productos"
              className="rounded-full bg-terracotta text-cream px-6 py-3 uppercase tracking-[0.2em]"
            >
              Comprar ahora
            </a>
            <a
              href="/registro"
              className="rounded-full border border-ink px-6 py-3 uppercase tracking-[0.2em]"
            >
              Crear cuenta
            </a>
          </div>
        </div>
        <div className="bg-ink text-cream rounded-[36px] p-8">
          <h2 className="font-display text-3xl">Envios rapidos en Colombia</h2>
          <p className="mt-4 text-cream/70">
            Pagos con MercadoPago (PSE), soporte personalizado y seguimiento de pedidos en tiempo real.
          </p>
          <div className="mt-6 grid gap-4">
            <div className="bg-cream/10 rounded-2xl p-4">Atencion por WhatsApp</div>
            <div className="bg-cream/10 rounded-2xl p-4">Descuentos por lanzamiento</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Productos destacados</h2>
          <a href="/productos" className="text-sm uppercase tracking-[0.2em]">Ver todo</a>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
