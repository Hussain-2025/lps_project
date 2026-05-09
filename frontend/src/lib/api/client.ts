import axios from "axios";

import { tokenStore } from "../../auth/tokenStore";
import { env } from "../env";
import { refreshClient } from "./refreshClient";

export const client = axios.create({
  baseURL: `${env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token = tokenStore.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

function flushQueue(error?: unknown, token?: string) {
  for (const request of refreshQueue) {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  }

  refreshQueue = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    const errorCode = error.response?.data?.error?.code;

    if (error.response?.status === 401 && errorCode === "TOKEN_EXPIRED" && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        const token = await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      }

      isRefreshing = true;

      try {
        const response = await refreshClient.post<{ success: true; data: { accessToken: string } }>(
          "/auth/refresh",
        );
        const nextToken = response.data.data.accessToken;
        tokenStore.set(nextToken);
        flushQueue(undefined, nextToken);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${nextToken}`;
        return client(original);
      } catch (refreshError) {
        tokenStore.clear();
        flushQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
