import mongoose from "mongoose";
// mongoose is an odm. makes mongodb easy to use. mongodb is a document db

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1/test";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};
