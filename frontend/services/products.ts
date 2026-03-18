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
  featured: boolean;
  tags: string | null;
  discountPercentage: number;
  basePrice: number;
  createdAt: string;
  variants: ProductVariant[];
  images: ProductImage[];
};

export type ProductPage = {
  items: Product[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products");
}

export async function getProductsPaged(params: {
  page: number;
  size: number;
  sort?: string;
  dir?: string;
}): Promise<ProductPage> {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("size", String(params.size));
  if (params.sort) query.set("sort", params.sort);
  if (params.dir) query.set("dir", params.dir);
  return apiGet<ProductPage>(`/products/paged?${query.toString()}`);
}

export async function getProductsAdvanced(params: {
  search?: string;
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  sizeParam?: number;
  sort?: string;
  dir?: string;
}): Promise<ProductPage> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.size) query.set("sizeParam", params.size);
  if (params.color) query.set("color", params.color);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.sizeParam !== undefined) query.set("size", String(params.sizeParam));
  if (params.sort) query.set("sort", params.sort);
  if (params.dir) query.set("dir", params.dir);
  return apiGet<ProductPage>(`/products?${query.toString()}`);
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`/products/${id}`);
  } catch {
    return null;
  }
}

export async function searchProducts(query: string, page = 0, size = 20): Promise<ProductPage> {
  return apiGet<ProductPage>(`/products/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
}

export async function filterProducts(params: {
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<ProductPage> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return apiGet<ProductPage>(`/products/filter?${query.toString()}`);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return apiGet<Product[]>(`/products/featured?limit=${limit}`);
}

export async function getNewestProducts(limit = 8): Promise<Product[]> {
  return apiGet<Product[]>(`/products/new?limit=${limit}`);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return apiGet<Product[]>(`/products/best-sellers?limit=${limit}`);
}

export async function getRelatedProducts(id: string, limit = 6): Promise<Product[]> {
  return apiGet<Product[]>(`/products/${id}/related?limit=${limit}`);
}

export async function getProductsByIds(ids: string): Promise<Product[]> {
  return apiGet<Product[]>(`/products/by-ids?ids=${encodeURIComponent(ids)}`);
}
