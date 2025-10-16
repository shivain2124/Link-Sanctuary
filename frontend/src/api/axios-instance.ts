import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosClient;
