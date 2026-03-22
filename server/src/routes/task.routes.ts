import { FastifyInstance } from "fastify";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth";

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get("/", getTasks);
    protectedRoutes.post("/", createTask);
    protectedRoutes.patch("/:id", updateTask);
    protectedRoutes.delete("/:id", deleteTask);
    protectedRoutes.patch("/:id/move", moveTask);
  });
}
