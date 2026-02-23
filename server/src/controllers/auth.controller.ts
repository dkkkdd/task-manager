import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

function setAuthCookie(res: Response, token: string) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function register(req: Request, res: Response) {
  const { userName, email, password } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        userName: userName || email.split("@")[0],
        email,
        passwordHash: hashedPassword,
      },
      include: {
        _count: {
          select: {
            projects: true,
            tasks: true,
          },
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    setAuthCookie(res, token);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            tasks: { where: { isDone: false } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateMe(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { userName, email } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(userName !== undefined && { userName }),
        ...(email !== undefined && { email }),
      },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    const e = error as { code?: string; message?: string };
    if (e.code === "P2002") {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            projects: true,
            tasks: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    setAuthCookie(res, token);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteAcc(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Acc Error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",

    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
}
