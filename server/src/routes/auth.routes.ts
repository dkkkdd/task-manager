import { FastifyInstance } from "fastify";
import {
  register,
  login,
  deleteAcc,
  getMe,
  updateMe,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", register);
  fastify.post("/login", login);
  fastify.post("/logout", logout);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get("/me", getMe);
    protectedRoutes.patch("/me", updateMe);
    protectedRoutes.delete("/me", deleteAcc);
  });
}
