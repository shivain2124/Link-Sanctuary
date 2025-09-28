import mongoose from "mongoose";
import config from "../config/config";
// mongoose is an odm. makes mongodb easy to use. mongodb is a document db

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};
