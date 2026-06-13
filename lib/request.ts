import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class HTTPError extends Error {
  constructor(public response?: AxiosResponse) {
    super(
      response?.data?.message ?? `Failed to Fetch. Status: ${response?.status}`,
    );
  }
}
const BASE_URL = process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL ?? "";

export const backend = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

backend.interceptors.response.use(
  (response) => {
    if (response.data?.error) {
      throw new Error(response.data.error);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if(typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register")) {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }
    }
    return Promise.reject(new HTTPError(error.response));
  },
);

export const request = async <T = any>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  const res = await backend({ url, ...config });
  return res.data;
};
