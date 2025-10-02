import { Request, Response } from "express";
import { FolderModel } from "../models/folder.model";
import { connectDB } from "../config/db";
import { CreateFolderSchema } from "../validators/folder.validator";

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentId, userId } = req.body;

    await connectDB();

    const existingFolder = await FolderModel.findOne({
      name,
      parentId,
      userId,
    });
    if (existingFolder)
      return res.status(409).json({ message: "Name already taken" });

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
