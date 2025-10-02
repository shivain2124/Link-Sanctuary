import { Request, Response, NextFunction } from "express";

export default function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "User is not logged in" });
  }
  next();
}
