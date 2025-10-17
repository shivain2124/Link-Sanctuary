import axios from "axios";

export const handleApiError = (err: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(err) && err.response) {
    const errorMessage = err.response.data?.message || defaultMessage;
    throw new Error(errorMessage);
  }
  throw new Error(defaultMessage);
};
