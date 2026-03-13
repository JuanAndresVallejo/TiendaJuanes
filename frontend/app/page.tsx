export default async function HomePage() {
  const brands = [
    { name: "Levis", logo: "/brands/levis.svg" },
    { name: "Nike", logo: "/brands/nike.svg" },
    { name: "Adidas", logo: "/brands/adidas.svg" },
    { name: "Puma", logo: "/brands/puma.svg" },
    { name: "Tommy Hilfiger", logo: "/brands/tommy.svg" },
    { name: "Calvin Klein", logo: "/brands/calvin.svg" },
    { name: "Ralph Lauren", logo: "/brands/ralph.svg" },
    { name: "New Balance", logo: "/brands/newbalance.svg" },
    { name: "Guess", logo: "/brands/guess.svg" },
    { name: "Vans", logo: "/brands/vans.svg" },
    { name: "Reebok", logo: "/brands/reebok.svg" },
    { name: "Converse", logo: "/brands/converse.svg" }
  ];
  const track = [...brands, ...brands];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Nueva coleccion</p>
          <h1 className="font-display text-4xl md:text-6xl mt-4">Ropa americana seleccionada para tu estilo diario</h1>
          <p className="mt-6 text-lg text-ink/70">
            Importamos piezas unicas para hombre y mujer. Calidad premium, tallas variadas y envios seguros en toda Colombia.
          </p>
          <HomeHeroActions />
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
          <h2 className="font-display text-3xl">Marcas</h2>
          <a href="/productos" className="text-sm uppercase tracking-[0.2em]">Ver catalogo</a>
        </div>
        <div className="mt-8 overflow-hidden">
          <div className="brand-marquee">
            {track.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="brand-tile"
                aria-label={brand.name}
                title={brand.name}
              >
                <img
                  src={brand.logo}
                  alt=""
                  className="brand-logo"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  aria-hidden="true"
                />
                <span className="text-sm uppercase tracking-[0.2em]">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import HomeHeroActions from "../components/HomeHeroActions";
