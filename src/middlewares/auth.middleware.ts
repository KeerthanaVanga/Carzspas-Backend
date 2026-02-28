import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    req.userId = payload.userId;
    next();
  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
