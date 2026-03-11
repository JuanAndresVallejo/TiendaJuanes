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

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Chaqueta vintage",
    refCode: "REF.001",
    description: "Chaqueta americana para clima frio con estilo urbano.",
    brand: "Vintage USA",
    category: "Hombre",
    basePrice: 189000,
    createdAt: new Date().toISOString(),
    variants: [
      { id: 101, color: "Azul", size: "M", sku: "CHAQ-AZ-M", price: 189000, stock: 5 },
      { id: 102, color: "Negro", size: "L", sku: "CHAQ-NE-L", price: 189000, stock: 2 }
    ],
    images: [
      { id: 1001, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" }
    ]
  },
  {
    id: 2,
    name: "Vestido floral",
    refCode: "REF.002",
    description: "Vestido fresco importado, ideal para dias soleados.",
    brand: "American Style",
    category: "Mujer",
    basePrice: 149000,
    createdAt: new Date().toISOString(),
    variants: [
      { id: 201, color: "Rojo", size: "S", sku: "VEST-RO-S", price: 149000, stock: 6 },
      { id: 202, color: "Blanco", size: "M", sku: "VEST-BL-M", price: 149000, stock: 4 }
    ],
    images: [
      { id: 2001, imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" }
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    return await apiGet<Product[]>("/products");
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`/products/${id}`);
  } catch {
    const numericId = Number(id);
    return fallbackProducts.find((product) => product.id === numericId) || null;
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
