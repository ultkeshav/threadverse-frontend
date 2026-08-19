import type {
  ProductVariant,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
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

export async function createProductVariant(
  request: CreateProductVariantRequest,
): Promise<ProductVariant> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-variants`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<ProductVariant>(
    response,
  );
}

export async function updateProductVariant(
  variantId: number,
  request: UpdateProductVariantRequest,
): Promise<ProductVariant> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-variants/${variantId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<ProductVariant>(
    response,
  );
}

export async function deleteProductVariant(
  variantId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/admin/product-variants/${variantId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    await handleResponse<void>(response);
  }
}