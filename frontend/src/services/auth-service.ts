import axiosClient from "../api/axios-instance";
import axios from "axios";

export const registerUser = async (username: string, password: string) => {
  try {
    const res = await axiosClient.post("/auth/register", {
      username,
      password,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};
