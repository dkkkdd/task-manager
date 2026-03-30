import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UpdateUserSchema,
  CreateUserSchema,
  LoginUserSchema,
} from "../schemas/auth.schema";
import { Static } from "@sinclair/typebox";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

function setAuthCookie(reply: FastifyReply, token: string) {
  reply.setCookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function register(
  request: FastifyRequest<{ Body: Static<typeof CreateUserSchema> }>,
  reply: FastifyReply,
) {
  const { userName, password, email } = request.body;

  const normalizedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        userName: userName || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash: hashedPassword,
      },
      include: {
        _count: {
          select: { projects: true, tasks: true },
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    setAuthCookie(reply, token);

    return reply.code(201).send({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    });
  } catch (error) {
    request.log.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.code(400).send({ error: "User already exists" });
      }
    }
    return reply.code(500).send({ error: "Failed to register user" });
  }
}
export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId;

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
      return reply.code(404).send({ error: "User not found" });
    }

    return user;
  } catch (error) {
    return reply.code(500).send({ error: "Internal server error" });
  }
}

export async function login(
  request: FastifyRequest<{ Body: Static<typeof LoginUserSchema> }>,
  reply: FastifyReply,
) {
  const { password, email } = request.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        _count: {
          select: { projects: true, tasks: true },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    setAuthCookie(reply, token);

    return {
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    };
  } catch (error) {
    return reply.code(500).send({ error: "Internal server error" });
  }
}

export async function updateMe(
  request: FastifyRequest<{ Body: Static<typeof UpdateUserSchema> }>,
  reply: FastifyReply,
) {
  const userId = request.userId;
  const { userName, email } = request.body;

  const normalizedEmail = email?.toLowerCase();
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(userName !== undefined && { userName }),
        ...(normalizedEmail !== undefined && { email: normalizedEmail }),
      },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.code(400).send({ error: "User already exists" });
      }
    }
    return reply.code(500).send({ error: "Internal server error" });
  }
}
export async function deleteAcc(request: FastifyRequest, reply: FastifyReply) {
  try {
    await prisma.user.delete({
      where: { id: request.userId },
    });

    return reply.code(204).send();
  } catch (error) {
    return reply.code(500).send({ error: "Failed to delete account" });
  }
}

export async function logout(_request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return { message: "Logged out successfully" };
}
