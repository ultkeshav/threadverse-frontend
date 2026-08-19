import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "../types/collection";

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
    const error = data as
      | {
          message?: string;
          error?: string;
        }
      | null;

    throw new Error(
      error?.message ||
        error?.error ||
        text ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

export async function getCollections(): Promise<
  Collection[]
> {
  const response = await fetch(
    `${API_BASE_URL}/collections`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Collection[]>(
    response,
  );
}

export async function createCollection(
  request: CreateCollectionRequest,
): Promise<Collection> {
  const response = await fetch(
    `${API_BASE_URL}/admin/collections`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Collection>(
    response,
  );
}

export async function updateCollection(
  collectionId: number,
  request: UpdateCollectionRequest,
): Promise<Collection> {
  const response = await fetch(
    `${API_BASE_URL}/admin/collections/${collectionId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Collection>(
    response,
  );
}

export async function deleteCollection(
  collectionId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/admin/collections/${collectionId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    await handleResponse<void>(response);
  }
}