import mongoose from "mongoose";
const { Schema } = mongoose;

//define schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//create model
const UserModel = mongoose.model("User,userSchema");
export default UserModel;
