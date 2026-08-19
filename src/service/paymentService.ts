import type {
  CreateRazorpayOrderResponse,
  PaymentResponse,
  VerifyPaymentRequest,
} from "../types/payment";

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
      | {
          message?: string;
          error?: string;
        }
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

export async function createRazorpayOrder(
  userId: number,
  orderId: number,
): Promise<CreateRazorpayOrderResponse> {
  const response = await fetch(
    `${API_BASE_URL}/payments/razorpay/order/${orderId}?userId=${userId}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );

  return getJson<CreateRazorpayOrderResponse>(
    response,
  );
}

export async function verifyPayment(
  userId: number,
  request: VerifyPaymentRequest,
): Promise<PaymentResponse> {
  const response = await fetch(
    `${API_BASE_URL}/payments/razorpay/verify?userId=${userId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return getJson<PaymentResponse>(response);
}

export async function getPaymentByOrderId(
  userId: number,
  orderId: number,
): Promise<PaymentResponse> {
  const response = await fetch(
    `${API_BASE_URL}/payments/orders/${orderId}?userId=${userId}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return getJson<PaymentResponse>(response);
}