import axios, {
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/zustand/auth.store";

// Every TimeStaff API response follows this shape (a backend-side response
// interceptor guarantees it) — apiRequest() below unwraps it for callers.
interface ApiEnvelope<T> {
    success: boolean;
    message?: string;
    data: T;
    errors?: unknown;
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,                     // Sends the httpOnly refresh-token cookie automatically — frontend JS never reads or writes that cookie directly.
    headers: { "Content-Type": "application/json" },
});

// Requests that arrive while a token refresh is already in flight wait here
// instead of each triggering their own refresh call.
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}> = [];

// Resolves or rejects every queued request once the in-flight refresh settles.
const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
    failedQueue = [];
};

// Request interceptor — attaches the in-memory access token to every call.
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const isRefreshEndpoint = config.url?.includes("/auth/refresh");
    const token = useAuthStore.getState().accessToken;

    // Skip attaching a (possibly stale/expired) token on the refresh call itself.
    if (token && !isRefreshEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — branches on what kind of failure this actually is.
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");

        // 403 = authenticated but not permitted for this action — never a logout.
        if (status === 403) {
            throw error;
        }

        // Subscription inactive/expired — the access-gating guard's own signal,
        // distinct from a plain auth failure, so it goes to billing, not /login.
        if (status === 402) {
            if (typeof window !== "undefined") window.location.href = "/billing";
            throw error;
        }

        // 401 on a normal request — try exactly one silent refresh-and-retry.
        if (status === 401 && !isRefreshEndpoint && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // A refresh is already underway — queue this request behind it
                // instead of firing a second, redundant refresh call.
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;
            try {
                // Raw axios call, not apiRequest() — avoids a circular import back
                // into a service file, and this one response never needs unwrapping
                // beyond the access token itself.
                const { data } = await axiosInstance.post<ApiEnvelope<{ accessToken: string }>>(
                    "/auth/refresh",
                );
                const newToken = data.data.accessToken;

                useAuthStore.getState().setAccessToken(newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
                throw refreshError;
            } finally {
                isRefreshing = false;
            }
        }

        throw error;
    },
);

// The one function every service file calls instead of using axios directly.
export const apiRequest = async <T>(
    request: AxiosRequestConfig & { fullResponse?: boolean },
): Promise<T> => {
    const response = await axiosInstance.request<ApiEnvelope<T>>(request);
    const body = response.data;

    // Caller wants status/message alongside the payload, not just the data.
    if (request.fullResponse) return body as T;

    if (!body.success) {
        const message = typeof body.errors === "string" ? body.errors : (body.message ?? "Request failed");
        throw new Error(message);
    }

    // Surface the message alongside the payload when present — e.g. a success toast.
    return body.message ? ({ ...body.data, message: body.message } as T) : body.data;
};
