import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { connectDB } from "../config/db";
import argon2 from "argon2";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

//registeration logic
export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    await connectDB();

    const existingUser = await UserModel.findOne({ username });
    if (existingUser)
      return res.status(409).json({ message: "Username already taken" });

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error while registering a user" });
  }
};

//login logic
export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await connectDB();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User doesnt exists" });
    }

    const isValid = await verifyPassword(user.password, password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid Credentials" });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 3600 * 1000,
      path: "/",
    });

    return res
      .status(201)
      .json({ message: "Logged in Successfully", accessToken });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
};

// hash password with argon2
async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw new Error("Password hashing failed");
  }
}

// verify password
async function verifyPassword(
  hashFromDatabase: string,
  submittedPassword: string
): Promise<boolean> {
  try {
    const match = await argon2.verify(hashFromDatabase, submittedPassword);
    return match;
  } catch (err) {
    return false;
  }
}
