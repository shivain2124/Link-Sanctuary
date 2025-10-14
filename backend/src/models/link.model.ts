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
      default: "",
    },
    tags: [String],

    isFavourite: {
      type: Boolean,
      default: false,
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
linkSchema.index({ userId: 1, tags: 1 });
linkSchema.index({ userId: 1, isFavourite: 1 });

export const LinkModel = mongoose.model("Link", linkSchema);
