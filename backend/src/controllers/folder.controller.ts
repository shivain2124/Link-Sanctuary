import { Request, Response } from "express";
import { FolderModel } from "../models/folder.model";
import { connectDB } from "../config/db";
import { CreateFolderSchema } from "../validators/folder.validator";
import { z } from "zod";

// create new folder
export const CreateFolderController = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await connectDB();

    const existingFolder = await FolderModel.findOne({
      name,
      parentId: parentId || null,
      userId,
    });
    if (existingFolder)
      return res.status(409).json({ message: "Name already taken" });

    if (parentId) {
      const parentExists = await FolderModel.findOne({ _id: parentId, userId });
      if (!parentExists)
        return res.status(404).json({ message: "Parent folder not found" });
    }

    const newFolder = new FolderModel({
      name,
      parentId: parentId || null,
      userId,
    });
    await newFolder.save();

    return res
      .status(201)
      .json({ message: "Folder Created", folder: newFolder });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error while creating a folder" });
  }
};

// get all root folders
export const getRootFolders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const folders = await FolderModel.find({ userId, parentId: null }).sort({
      name: 1,
    });

    res.status(200).json({ success: true, data: folders });
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch root folders" });
  }
};

// get children folder of a specific folder
export const getChildFolders = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const userId = req.user?.id;

    const children = await FolderModel.find({
      userId,
      parentId: folderId,
    }).sort({
      name: 1,
    });

    res.json({ success: true, data: children });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch children folder" });
  }
};

//delete folder and all its children
// have to optimise
export const deleteFolderRecursively = async (
  folderId: string,
  userId: string
) => {
  const children = await FolderModel.find({ parentId: folderId, userId });

  for (const child of children) {
    await deleteFolderRecursively(child._id.toString(), userId);
  }
  await FolderModel.findOneAndDelete({ _id: folderId, userId });
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { folderId } = req.params;

    await deleteFolderRecursively(folderId, userId);
    res.json({ message: "Folder and all subfolders deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder" });
  }
};
