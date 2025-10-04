import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

linkSchema.index({ userId: 1, folderId: 1, title: 1 });

export const LinkModel = mongoose.model("Link", linkSchema);
