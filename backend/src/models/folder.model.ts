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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const FolderModel = mongoose.model("Folder", folderSchema);
