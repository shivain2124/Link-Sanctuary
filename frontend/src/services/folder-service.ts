import axiosClient from "../api/axios-instance";
import { handleApiError } from "../api/handle-error";

export const createFolder = async (name: string, parentId?: string) => {
  try {
    const res = await axiosClient.post("/folders", {
      name,
      parentId,
    });
    return res.data;
  } catch (err) {
    handleApiError(err, "Cannot create folder");
  }
};

export const getRootFolders = async () => {
  try {
    const res = await axiosClient.get("/folders/root");
    return res.data;
  } catch (err) {
    handleApiError(err, "Cannot fetch the folder");
  }
};

export const getChildFolders = async (parentId: string) => {
  try {
    const res = await axiosClient.get(`/folders/${parentId}/children`);
    return res.data.data;
  } catch (err) {
    handleApiError(err, "Cannot fetch your folders. Please try again later");
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const res = await axiosClient.delete(`/folders/${folderId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "Cannot delete folders. Try again later");
  }
};
