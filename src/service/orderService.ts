import type {
  CreateOrderRequest,
  Order,
} from "../types/order";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

function getToken() {
  return localStorage.getItem("threadverse_token");
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

async function getJson<T>(
  response: Response,
): Promise<T> {
  const rawText = await response.text();

  let data: unknown = null;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as
      | { message?: string; error?: string }
      | null;

    throw new Error(
      errorData?.message ||
        errorData?.error ||
        rawText ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

export async function createOrder(
  userId: number,
  data: CreateOrderRequest,
): Promise<Order> {
  const response = await fetch(
    `${API_BASE_URL}/orders?userId=${userId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );

  return getJson<Order>(response);
}

export async function getUserOrders(
  userId: number,
): Promise<Order[]> {
  const response = await fetch(
    `${API_BASE_URL}/orders?userId=${userId}`,
    {
      headers: authHeaders(),
    },
  );

  return getJson<Order[]>(response);
}

export async function getOrderById(
  userId: number,
  orderId: number,
): Promise<Order> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}?userId=${userId}`,
    {
      headers: authHeaders(),
    },
  );

  return getJson<Order>(response);
}

export async function cancelOrder(
  userId: number,
  orderId: number,
): Promise<Order> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/cancel?userId=${userId}`,
    {
      method: "PUT",
      headers: authHeaders(),
    },
  );

  return getJson<Order>(response);
}