import { paths } from '@/paths';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Generic API Response Type
export interface ApiResponse<T = any> {
  meta: {
    code: number;
    status: boolean;
    message: string;
    reqId: string;
  };
  data: T;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('custom-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       localStorage.removeItem('custom-auth-token');
//       alert('Session expired or invalid. Please log in again.');
//       window.location.href = paths.auth.signIn; // redirect ไป login
//     }
//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Extract data from the nested structure
    // From: { data: { meta: {...}, data: {...} } }
    // To: { data: {...}, meta: {...} }
    if (response.data && response.data.data !== undefined) {
      // console.log('data >>>', response);
      return {
        ...response,
        data: response.data.data,
        meta: response.data.meta,
      } as any;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('custom-auth-refreshToken');
      if (refreshToken) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/refresh`, { refreshToken });
          const newToken = res.data?.accessToken?.token;
          localStorage.setItem('custom-auth-token', newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = 'Bearer ' + newToken;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('custom-auth-token');
          localStorage.removeItem('custom-auth-refreshToken');
          window.location.href = paths.auth.signIn;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('custom-auth-token');
        window.location.href = paths.auth.signIn;
      }
    }
    return Promise.reject(error);
  }
);

export default api;