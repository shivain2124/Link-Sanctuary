import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);

export default app;
