import type {
  Product,
  ProductImage,
  ProductVariant,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("threadverse_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as
      | {
          message?: string;
          error?: string;
        }
      | null;

    throw new Error(
      errorData?.message ||
        errorData?.error ||
        text ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

/* ==========================================
   PUBLIC PRODUCT APIs
   ========================================== */

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function getProductById(
  productId: number,
): Promise<Product> {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product>(response);
}

export async function getProductsBySeries(
  seriesId: number,
): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/series/${seriesId}/products`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/featured`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function getBestSellerProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/best-sellers`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function getNewArrivalProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/new-arrivals`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function getActiveProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/active`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

export async function searchProducts(
  keyword: string,
): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(
      keyword,
    )}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Product[]>(response);
}

/* ==========================================
   PRODUCT IMAGES
   ========================================== */

export async function getProductImages(
  productId: number,
): Promise<ProductImage[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/images`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<ProductImage[]>(
    response,
  );
}

/* ==========================================
   PRODUCT VARIANTS
   ========================================== */

export async function getProductVariants(
  productId: number,
): Promise<ProductVariant[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/variants`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<ProductVariant[]>(
    response,
  );
}

/* ==========================================
   ADMIN PRODUCT APIs
   ========================================== */

export async function createProduct(
  request: CreateProductRequest,
): Promise<Product> {
  const response = await fetch(
    `${API_BASE_URL}/admin/products`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Product>(response);
}

export async function updateProduct(
  productId: number,
  request: UpdateProductRequest,
): Promise<Product> {
  const response = await fetch(
    `${API_BASE_URL}/admin/products/${productId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Product>(response);
}

export async function deleteProduct(
  productId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    await handleResponse<void>(response);
  }
}