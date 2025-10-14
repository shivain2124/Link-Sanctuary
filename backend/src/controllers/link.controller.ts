import { Request, Response } from "express";
import { LinkModel } from "../models/link.model";
import { FolderModel } from "../models/folder.model";

//create link
export const createLink = async (req: Request, res: Response) => {
  try {
    const { title, url, description, folderId, tags } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingTitle = await LinkModel.findOne({
      title,
      folderId: folderId || null,
      userId,
    });
    if (existingTitle)
      return res.status(409).json({ message: "Name already taken" });

    if (folderId) {
      const folderExists = await FolderModel.findOne({ _id: folderId, userId });
      if (!folderExists)
        return res.status(404).json({ message: "Parent folder not found" });
    }

    const newLink = new LinkModel({
      title,
      url,
      description,
      folderId,
      userId,
      tags,
    });
    await newLink.save();

    return res.status(201).json({ message: "Link Created", link: newLink });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while creating a link" });
  }
};

// get all links of a folder
export const getLinks = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const userId = req.user?.id;

    const links = await LinkModel.find({
      userId,
      folderId,
    }).sort({ title: 1 });

    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch any links" });
  }
};

//delete links
export const deleteLinks = async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const userId = req.user!.id;

    const result = await LinkModel.findOneAndDelete({ _id: linkId, userId });

    if (!result) return res.status(404).json({ message: "Link not found" });

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete link" });
  }
};

//update links
export const updateLinks = async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    const link = await LinkModel.findOne({ _id: linkId, userId });
    if (!link) return res.status(404).json({ message: "Link not found" });

    if (updates.title) {
      const duplicate = await LinkModel.findOne({
        title: updates.title,
        folderId: link.folderId,
        userId,
        _id: { $ne: linkId },
      });

      if (duplicate)
        return res.status(409).json({ message: "Name already taken" });
    }
    Object.assign(link, updates);
    await link.save();

    return res.status(200).json({ message: "Link updated!", link });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update the link" });
  }
};

//all unique tags for a user
export const getUserTags = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const tags = await LinkModel.distinct("tags", { userId });

    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// mark link as favourite
export const toggleFavourite = async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const userId = req.user!.id;

    const link = await LinkModel.findOne({ _id: linkId, userId });

    if (!link) return res.status(404).json({ message: "link not found!" });

    link.isFavourite = !link.isFavourite;
    await link.save();

    res.status(200).json({ message: "Favourite updated", link });
  } catch (err) {
    res.status(500).json({ message: "Failed to update favourite" });
  }
};

// get favs
export const getFavouriteLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const links = await LinkModel.find({
      userId,
      isFavourite: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
};

// SEARCH LOGIC
export const universalSearch = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { q, tags, folderId } = req.query;

    const searchQuery: any = { userId };

    //Text search
    if (q && typeof q === "string" && q.trim()) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { url: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    //check box search
    if (tags && typeof tags === "string") {
      const tagArray = tags.split(",").map((t) => t.trim());
      searchQuery.tags = { $all: tagArray };
    }

    if (folderId) {
      searchQuery.folderId = folderId;
    }

    const links = await LinkModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ error: "Couldnt search" });
  }
};
