import axios from 'axios';

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
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401, 403, and refresh token logic
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      // Handle 403 Forbidden
      if (status === 403) {
        window.location.href = '/403';
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        isRefreshing = true;
        try {
          const response = await axiosInstance.post('/refresh'); if (response.status === 200) {
            const newToken = response.data.accessToken;
            localStorage.setItem('accessToken', newToken);

            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            processQueue(null, newToken);

            // Retry the original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // If the refresh token fails, log out the user and redirect to login
          processQueue(refreshError, null);
          localStorage.removeItem('accessToken');
          window.location.href = '/login'; 
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
