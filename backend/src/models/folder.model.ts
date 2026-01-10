import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const FolderModel = mongoose.model("Folder", folderSchema);
