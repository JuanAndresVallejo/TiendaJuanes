import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-12">Cargando productos...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
