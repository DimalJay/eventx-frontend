import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";

export class HTTPError extends Error {
  constructor(public response?: AxiosResponse) {
    super(
      response?.data.message ?? `Failed to Fetch. Status: ${response?.status}`
    );
  }
}
const BASE_URL = process.env.NEXT_PUBLIC_EVENTX_BACKEND_URL ?? "";

export const backend = axios.create({
  baseURL: BASE_URL,
});
/**
 * Used for more customization from the raw axios response
 * @param config
 * @returns
 */
export const rawRequest = async (config: AxiosRequestConfig) => {
  try {
    return await backend(config);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HTTPError(error.response);
    }
    throw error;
  }
};

export const request = async <T = any>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const req = await rawRequest({ url, ...config });
  const res = await req.data;
  if (res.error) throw new Error(res.error);
  return res;
};

export const authRequest = async (
  url: string,
  config: AxiosRequestConfig = {}
) => {
  try {
    const res = await request(url, { ...config, withCredentials: true });
    return res;
  } catch (error) {
    if (error instanceof HTTPError) {
      // auth token missing/expired
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("loggedIn");
        }
      }
    }
    throw error;
  }
};