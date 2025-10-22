import axiosClient from "../api/axios-instance";
import { handleApiError } from "../api/handle-error";

export const createLinkService = async (
  title: string,
  url: string,
  description: string,
  folderId: string,
  tags: string[]
) => {
  try {
    const res = await axiosClient.post("/links", {
      title,
      url,
      description,
      folderId,
      tags,
    });
    return res.data;
  } catch (err) {
    handleApiError(err, "Error creating a link. Please try again later");
  }
};

export const getLinkService = async (folderId: string) => {
  try {
    const res = await axiosClient.get(`/links/folders/${folderId}`);
    return res.data.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch links.");
  }
};

export const deleteLinkService = async (linkId: string) => {
  try {
    const res = await axiosClient.delete(`/links/${linkId}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed deleting link");
  }
};

export const updateLinkService = async (
  linkId: string,
  updates: {
    title?: string;
    folderId?: string;
    url?: string;
    description?: string;
    tags?: string[];
  }
) => {
  try {
    const res = await axiosClient.put(`/links/${linkId}`, updates);
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed updating link");
  }
};

export const getUserTagService = async () => {
  try {
    const res = await axiosClient.get("/links/tags");
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch tags");
  }
};

export const toggleFavouriteTagService = async (linkId: string) => {
  try {
    const res = await axiosClient.patch(`/links/${linkId}/favourite`);
    return res.data;
  } catch (err) {
    handleApiError(
      err,
      "Couldn't proceed with your request. Please try again later"
    );
  }
};
export const getFavouriteService = async () => {
  try {
    const res = await axiosClient.get("/links/favourites");
    return res.data;
  } catch (err) {
    handleApiError(
      err,
      "Couldn't proceed with your request. Please try again later"
    );
  }
};

export const searchService = async (universalSearch: {
  q?: string;
  tags?: string;
  folderId?: string;
}) => {
  try {
    const res = await axiosClient.get("/links/search", {
      params: universalSearch,
    });
    return res.data;
  } catch (err) {
    handleApiError(
      err,
      "Couldn't proceed with your request. Please try again later"
    );
  }
};
