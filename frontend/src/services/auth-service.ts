import axiosClient from "../api/axios-instance";
import { handleApiError } from "../api/handle-error";

export const registerUser = async (username: string, password: string) => {
  try {
    const res = await axiosClient.post("/auth/register", {
      username,
      password,
    });
    return res.data;
  } catch (err) {
    handleApiError(err, "Registration failed");
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const res = await axiosClient.post("/auth/login", { username, password });
    return res.data;
  } catch (err) {
    handleApiError(err, "Login failed");
  }
};

export const refreshToken = async () => {
  try {
    const res = await axiosClient.post("/auth/refresh");
    return res.data;
  } catch (err) {
    handleApiError(err, "Token refresh failed");
  }
};
