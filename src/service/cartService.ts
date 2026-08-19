import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "../types/cart";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

function getToken() {
  return localStorage.getItem("threadverse_token");
}

async function getJson<T>(
  response: Response,
): Promise<T> {
  const rawText = await response.text();

  let data: any = null;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        rawText ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

function authHeaders() {
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

export async function getCart(
  userId: number,
): Promise<Cart> {
  const response = await fetch(
    `${API_BASE_URL}/cart?userId=${userId}`,
    {
      headers: authHeaders(),
    },
  );

  return getJson<Cart>(response);
}

export async function addCartItem(
  userId: number,
  data: AddCartItemRequest,
): Promise<Cart> {
  const response = await fetch(
    `${API_BASE_URL}/cart/items?userId=${userId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );

  return getJson<Cart>(response);
}

export async function updateCartItem(
  userId: number,
  cartItemId: number,
  data: UpdateCartItemRequest,
): Promise<Cart> {
  const response = await fetch(
    `${API_BASE_URL}/cart/items/${cartItemId}?userId=${userId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );

  return getJson<Cart>(response);
}

export async function removeCartItem(
  userId: number,
  cartItemId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/cart/items/${cartItemId}?userId=${userId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    const rawText = await response.text();

    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = null;
    }

    throw new Error(
      data?.message ||
        data?.error ||
        rawText ||
        `Request failed with status ${response.status}`,
    );
  }
}