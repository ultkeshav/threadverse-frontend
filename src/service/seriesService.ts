import type {
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
} from "../types/series";

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

export async function getSeries(): Promise<Series[]> {
  const response = await fetch(
    `${API_BASE_URL}/series`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Series[]>(response);
}

export async function getSeriesByCollection(
  collectionId: number,
): Promise<Series[]> {
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/series`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<Series[]>(response);
}

export async function createSeries(
  request: CreateSeriesRequest,
): Promise<Series> {
  const response = await fetch(
    `${API_BASE_URL}/admin/series`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Series>(response);
}

export async function updateSeries(
  seriesId: number,
  request: UpdateSeriesRequest,
): Promise<Series> {
  const response = await fetch(
    `${API_BASE_URL}/admin/series/${seriesId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    },
  );

  return handleResponse<Series>(response);
}

export async function deleteSeries(
  seriesId: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/admin/series/${seriesId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    await handleResponse<void>(response);
  }
}