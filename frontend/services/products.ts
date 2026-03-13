import { apiGet } from "./api";

export type ProductVariant = {
  id: number;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
};

export type ProductImage = {
  id: number;
  imageUrl: string;
};

export type Product = {
  id: number;
  name: string;
  refCode: string;
  description: string;
  brand: string | null;
  category: string | null;
  basePrice: number;
  createdAt: string;
  variants: ProductVariant[];
  images: ProductImage[];
};

export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`/products/${id}`);
  } catch {
    return null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  return apiGet<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
}

export async function filterProducts(params: {
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return apiGet<Product[]>(`/products/filter?${query.toString()}`);
}
