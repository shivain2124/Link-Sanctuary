import express from "express";
import { connectDB } from "./config/db";
import { clerkMiddleware } from "@clerk/express";
import folderRoutes from "./routes/folder.routes";
import linkRoutes from "./routes/link.routes";
import cors from "cors";
import { clerkWebhookHandler } from "./controllers/webhook.controller";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/api/webhooks/clerk", express.json(), clerkWebhookHandler);
app.use(express.json());
app.use(clerkMiddleware());

connectDB();

app.use("/api/folders", folderRoutes);
app.use("/api/links", linkRoutes);

export default app;
