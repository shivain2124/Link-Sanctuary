import jwt from "jsonwebtoken";
import config from "../config/config";
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token present" });

  try {
    const user = verifyAccessToken(token) as { id: string };
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
