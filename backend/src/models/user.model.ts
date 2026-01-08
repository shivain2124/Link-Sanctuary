import mongoose from "mongoose";
const { Schema } = mongoose;

//define schema
const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//create model
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
