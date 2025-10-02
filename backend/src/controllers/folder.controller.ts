import { Request, Response } from "express";
import { FolderModel } from "../models/folder.model";
import { connectDB } from "../config/db";
import { CreateFolderSchema } from "../validators/folder.validator";
import { z } from "zod";

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
