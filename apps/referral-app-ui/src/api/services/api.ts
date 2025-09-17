import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

//  Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = import.meta.env.VITE_BEARER_TOKEN || '';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);

    // Example: refresh token or handle global errors
    if (error.response?.status === 401) {
      // logout or refresh token logic here
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosClient.post<T>(url, body, config).then((res) => res.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosClient.put<T>(url, body, config).then((res) => res.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosClient.patch<T>(url, body, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.delete<T>(url, config).then((res) => res.data),
};

export default axiosClient;
