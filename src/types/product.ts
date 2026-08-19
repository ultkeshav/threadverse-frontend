export interface Product {
  productId: number;
  name: string;
  slug: string;
  description?: string;
  price: number;

  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;

  seriesId: number;
  seriesName?: string;
}

export interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariant {
  variantId: number;
  productId: number;
  size: string;
  stock: number;
  available: boolean;
}

/* ==========================================
   PRODUCT REQUESTS
   ========================================== */

export interface CreateProductRequest {
  name: string;
  slug: string;
  description?: string;
  price: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  active?: boolean;
  seriesId: number;
}

export interface UpdateProductRequest {
  name: string;
  slug: string;
  description?: string;
  price: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  active?: boolean;
  seriesId: number;
}

/* ==========================================
   VARIANT REQUESTS
   ========================================== */

export interface CreateProductVariantRequest {
  productId: number;
  size: string;
  stock: number;
  available?: boolean;
}

export interface UpdateProductVariantRequest {
  size: string;
  stock: number;
  available?: boolean;
}

/* ==========================================
   IMAGE REQUESTS
   ========================================== */

export interface CreateProductImageRequest {
  imageUrl: string;
  displayOrder?: number;
  productId: number;
}

export interface UpdateProductImageRequest {
  imageUrl: string;
  displayOrder?: number;
}