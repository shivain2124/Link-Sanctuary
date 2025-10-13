import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";
import linkRoutes from "./routes/link.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/links", linkRoutes);

export default app;
