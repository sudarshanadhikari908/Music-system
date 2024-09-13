import axios from 'axios';
import { redirect } from 'react-router-dom';

interface FailedQueueItem {
  resolve: (value: Promise<unknown> | unknown) => void;
  reject: (reason?: unknown) => void;
  config: unknown; 
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];
let hasLoginRequest = false;

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (token) {
      prom.resolve(axiosInstance(prom?.config));
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  config => {
    if (config.url === '/auth/login') {
      hasLoginRequest = true;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    if (response.config.url === '/auth/login') {
      hasLoginRequest = false;
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      if (status === 403) {
        redirect('/403');
        return Promise.reject(error);
      }

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        if (hasLoginRequest) {
          hasLoginRequest = false;
          return Promise.reject(error);
        }

        isRefreshing = true;
        try {
          const response = await axiosInstance.post('/auth/refresh'); 
          if (response.status === 200) {
            const newToken = response.data.accessToken;
            localStorage.setItem('accessToken', newToken);

            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            processQueue(null, newToken);

            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('accessToken');
          redirect('/login');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
