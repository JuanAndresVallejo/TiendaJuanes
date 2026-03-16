export default async function HomePage() {
  const brands = [
    { name: "Levis", short: "LEVIS", width: 96 },
    { name: "Nike", short: "NIKE", width: 96 },
    { name: "Adidas", short: "ADIDAS", width: 96 },
    { name: "Puma", short: "PUMA", width: 96 },
    { name: "Tommy Hilfiger", short: "TOMMY HILFIGER", width: 140 },
    { name: "Calvin Klein", short: "CALVIN KLEIN", width: 140 },
    { name: "Ralph Lauren", short: "RALPH LAUREN", width: 140 },
    { name: "New Balance", short: "NEW BALANCE", width: 140 },
    { name: "Guess", short: "GUESS", width: 96 },
    { name: "Vans", short: "VANS", width: 96 },
    { name: "Reebok", short: "REEBOK", width: 96 },
    { name: "Converse", short: "CONVERSE", width: 120 }
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
                <svg
                  className="brand-logo"
                  width={brand.width}
                  height={32}
                  viewBox={`0 0 ${brand.width} 32`}
                  aria-hidden="true"
                >
                  <rect width={brand.width} height="32" rx="6" fill="#1f1c17" />
                  <text
                    x="50%"
                    y="62%"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontSize={brand.width > 120 ? 10 : 12}
                    fill="#f6f2ea"
                  >
                    {brand.short}
                  </text>
                </svg>
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
