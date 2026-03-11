import ProductGallery from "../../../components/ProductGallery";
import ProductDetailClient from "../../../components/ProductDetailClient";
import { getProduct } from "../../../services/products";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return { title: "Producto no encontrado | Tienda Juanes" };
  }
  const title = `${product.name} | Tienda Juanes`;
  const description = `Compra ${product.name} original importado en Tienda Juanes.`;
  const image = product.images[0]?.imageUrl;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : []
    }
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl">Producto no encontrado</h1>
      </section>
    );
  }

  const images = product.images.map((img) => img.imageUrl);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <ProductGallery images={images} />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Detalle</p>
          <h1 className="font-display text-4xl mt-3">{product.name}</h1>
          <p className="mt-4 text-ink/70">{product.description}</p>
          <div className="mt-6">
            <span className="text-2xl text-terracotta font-semibold">
              ${product.basePrice.toLocaleString("es-CO")}
            </span>
          </div>
          <ProductDetailClient product={product} />
        </div>
      </div>
    </section>
  );
}
