const BASE_URL = import.meta.env.VITE_API_URL;

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  signal?: AbortSignal;
}
async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, signal, ...customConfig } = options;

  const headers: Record<string, string> = {};

  if (customConfig.method !== "DELETE" && customConfig.method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }
  const config: RequestInit = {
    ...customConfig,
    signal,
    headers: { ...headers, ...customConfig.headers },
    credentials: "include",
  };

  if (body !== undefined) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || errorData.message || response.statusText;

      if (response.status === 401) {
        console.warn("Unauthorized! Redirecting...");
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) return {} as T;

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return new Promise(() => {});
      }
      throw error;
    }

    throw new Error("An unknown error occurred");
  }
}

export const api = {
  get: <T>(url: string, options?: ApiRequestOptions) =>
    apiRequest<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(url, { ...options, method: "POST", body }),
  patch: <T>(url: string, body: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(url, { ...options, method: "PATCH", body }),
  delete: <T>(url: string, options?: ApiRequestOptions) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }),
};
