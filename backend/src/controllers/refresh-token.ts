import { verifyRefreshToken, generateAccessToken } from "../utils/jwt";
import { Request, Response } from "express";

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = verifyRefreshToken(refreshToken) as { id: string };
    const newAccessToken = generateAccessToken(decoded.id);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
