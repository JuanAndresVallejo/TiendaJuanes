import ProductGallery from "../../../components/ProductGallery";
import ProductDetailClient from "../../../components/ProductDetailClient";
import RelatedProducts from "../../../components/RelatedProducts";
import RecentlyViewed from "../../../components/RecentlyViewed";
import { getProduct } from "../../../services/products";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return { title: "Producto no encontrado | Tienda Juanes" };
  }
  const title = `${product.name} | Tienda Juanes`;
  const brand = product.brand ? ` de ${product.brand}` : "";
  const category = product.category ? ` en ${product.category}` : "";
  const description = `Compra ${product.name}${brand}${category} en Tienda Juanes.`;
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
  const hasDiscount = (product.discountPercentage || 0) > 0;
  const discountFactor = 1 - (product.discountPercentage || 0) / 100;
  const finalPrice = hasDiscount ? Math.round(product.basePrice * discountFactor) : product.basePrice;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <a href="/productos" className="text-xs uppercase tracking-[0.2em] text-ink/60">Atras</a>
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <ProductGallery images={images} />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive">Detalle</p>
          <h1 className="font-display text-4xl mt-3">{product.name}</h1>
          <p className="mt-4 text-ink/70">{product.description}</p>
          <div className="mt-6">
            <span className="text-2xl text-terracotta font-semibold">
              ${finalPrice.toLocaleString("es-CO")}
            </span>
            {hasDiscount && (
              <span className="ml-3 text-sm text-ink/50 line-through">
                ${product.basePrice.toLocaleString("es-CO")}
              </span>
            )}
          </div>
          <ProductDetailClient product={product} />
        </div>
      </div>
      <RelatedProducts productId={params.id} />
      <RecentlyViewed currentId={params.id} />
    </section>
  );
}
