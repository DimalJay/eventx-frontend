export type ApiRequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const baseUrl = process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL ?? "";

const buildUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (!baseUrl) {
    throw new Error("Backend URL is not configured.");
  }

  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 204) {
    return {
      success: true,
      message: "No content",
      data: null as T,
    };
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiResponse<T>;
  }

  return {
    success: false,
    message: await response.text(),
    data: null as T,
  };
};

const getErrorMessage = async (response: Response) => {
  try {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as { message?: string };
      return data?.message || "Request failed";
    }

    const text = await response.text();
    return text || "Request failed";
  } catch {
    return "Request failed";
  }
};

export const apiRequest = async <T>(
  path: string,
  init: RequestInit & ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const url = buildUrl(path);
  const response = await fetch(url, {
    ...init,
    credentials: init.credentials ?? "include",
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  return parseResponse<T>(response);
};

export const getRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
) => apiRequest<T>(path, { ...options, method: "GET" });

const jsonBody = (body: unknown) => {
  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body ?? {});
};

const jsonHeaders = (body: unknown, headers?: Record<string, string>) => {
  if (body instanceof FormData) {
    return headers ?? {};
  }

  return {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };
};

export const postRequest = async <T>(
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {}
) =>
  apiRequest<T>(path, {
    ...options,
    method: "POST",
    headers: jsonHeaders(body, options.headers),
    body: jsonBody(body),
  });

export const putRequest = async <T>(
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {}
) =>
  apiRequest<T>(path, {
    ...options,
    method: "PUT",
    headers: jsonHeaders(body, options.headers),
    body: jsonBody(body),
  });

export const deleteRequest = async <T>(
  path: string,
  body?: unknown,
  options: ApiRequestOptions = {}
) =>
  apiRequest<T>(path, {
    ...options,
    method: "DELETE",
    headers: jsonHeaders(body, options.headers),
    body: body === undefined ? undefined : jsonBody(body),
  });
