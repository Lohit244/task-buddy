import { NextFunction, Request, Response } from "express";
import { User } from "./db/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { UserDocument } from "./db/user";

export type AuthenticatedRequest = Request & {
  user: UserDocument & { _id: string };
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  let userId = "";
  let payload: any = null;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token. Please Try Again" });
  }

  if (!payload || !payload.userId) {
    console.log("payload not found");
    return res.status(401).json({ error: "Invalid Token. Please Try Again" });
  }

  userId = payload.userId;

  if (!userId || userId === "") {
    console.log("userId not found");
    return res.status(401).json({ error: "Invalid Token. Please Try Again" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  (req as any).user = user;
  next();
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  const { password, ...userWithoutPassword } = (user as any).toJSON();
  res.json({ user: userWithoutPassword });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(403).json({ error: "Invalid password or email" });
  }

  try {
    bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.status(200).json({ token, name: user.name });
  } catch (err) {
    return res.status(403).json({ error: "Invalid password or email" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(422)
      .json({ error: "Must provide name, email and password" });
  }

  const emailInUse = await User.findOne({ email: email.toLowerCase() });
  if (emailInUse) {
    return res.status(409).json({ error: "Email already in use" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.status(201).json({ token, name: user.name });
  } catch (err) {
    return res.status(422).json({ error: "Invalid password or email" });
  }
};
