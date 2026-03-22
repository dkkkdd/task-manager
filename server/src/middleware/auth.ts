import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = request.cookies.accessToken;

  if (!token) {
    return reply.code(401).send({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    request.userId = decoded.userId;
  } catch (e) {
    return reply.code(401).send({ error: "Invalid token" });
  }
};
