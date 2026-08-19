import type {
  Address,
  AddAddressRequest,
  UpdateAddressRequest,
} from "../types/address";

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

export async function getAddresses(
  userId: number,
): Promise<Address[]> {
  const response = await fetch(
    `${API_BASE_URL}/addresses?userId=${userId}`,
    {
      headers: authHeaders(),
    },
  );

  return getJson<Address[]>(response);
}

export async function addAddress(
  userId: number,
  data: AddAddressRequest,
): Promise<Address> {
  const response = await fetch(
    `${API_BASE_URL}/addresses?userId=${userId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );

  return getJson<Address>(response);
}

export async function updateAddress(
  userId: number,
  addressId: number,
  data: UpdateAddressRequest,
): Promise<Address> {
  const response = await fetch(
    `${API_BASE_URL}/addresses/${addressId}?userId=${userId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );

  return getJson<Address>(response);
}

export async function deleteAddress(
  userId: number,
  addressId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/addresses/${addressId}?userId=${userId}`,
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