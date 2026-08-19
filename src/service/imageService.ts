import type {
  ProductImage,
  CreateProductImageRequest,
  UpdateProductImageRequest,
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

export async function createProductImage(
  request: CreateProductImageRequest,
): Promise<ProductImage> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-images`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<ProductImage>(
    response,
  );
}

export async function updateProductImage(
  imageId: number,
  request: UpdateProductImageRequest,
): Promise<ProductImage> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-images/${imageId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<ProductImage>(
    response,
  );
}

export async function deleteProductImage(
  imageId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-images/${imageId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    await handleResponse<void>(response);
  }
}