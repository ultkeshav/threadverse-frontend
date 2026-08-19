import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

async function handleResponse(
  response: Response,
): Promise<AuthResponse> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong. Please try again.",
    );
  }

  return data as AuthResponse;
}

export async function loginUser(
  data: LoginRequest,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function registerUser(
  data: RegisterRequest,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}