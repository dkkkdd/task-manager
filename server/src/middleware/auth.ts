import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};
