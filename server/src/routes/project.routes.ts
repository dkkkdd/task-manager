import { FastifyInstance } from "fastify";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth";

export default async function projectsRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get("/", getProjects);
    protectedRoutes.post("/", createProject);
    protectedRoutes.patch("/:id", updateProject);
    protectedRoutes.delete("/:id", deleteProject);
  });
}
