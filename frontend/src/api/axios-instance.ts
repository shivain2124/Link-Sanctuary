import axios from "axios";
import type { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo } from "react";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;

export const useApi = () => {
  const { getToken } = useAuth();

  // useMemo ensures we aren't creating a new logic instance on every render
  const api = useMemo(() => axiosClient, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        // Clerk manages the token lifecycle. getToken() will
        // return a cached token or fetch a new one if expired.
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Clean up the interceptor when the component unmounts
    // This prevents memory leaks and duplicate interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [api, getToken]);

  return api;
};
