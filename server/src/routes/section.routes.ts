import { FastifyInstance } from "fastify";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controller";
import { authMiddleware } from "../middleware/auth";

export default async function sectionRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.post("/", createSection);
    protectedRoutes.patch("/:id", updateSection);
    protectedRoutes.delete("/:id", deleteSection);
  });
}
