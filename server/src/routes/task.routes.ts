import { FastifyInstance } from "fastify";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth";
import {
  CreateTaskSchema,
  TaskResponseSchema,
  UpdateTaskSchema,
} from "../schemas/task.schema";
import { Type } from "@sinclair/typebox";

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get(
      "/",
      {
        schema: {
          tags: ["Tasks"],
          summary: "Get all user tasks",
          description:
            "Returns a list of all tasks belonging to the authenticated user across all projects and sections.",
          response: {
            200: {
              ...Type.Array(TaskResponseSchema),
              description: "List of tasks retrieved successfully",
            },
          },
        },
      },
      getTasks,
    );

    protectedRoutes.post(
      "/",
      {
        schema: {
          tags: ["Tasks"],
          summary: "Create a new task",
          description:
            "Creates a task. Can be standalone or linked to a specific project and section.",
          body: CreateTaskSchema,
          response: {
            201: {
              ...TaskResponseSchema,
              description: "Task created successfully",
            },
          },
        },
      },
      createTask,
    );

    protectedRoutes.patch(
      "/:id",
      {
        schema: {
          tags: ["Tasks"],
          summary: "Update task details",
          description:
            "Updates task properties like title, content, priority, or due date.",
          params: Type.Object({
            id: Type.String({
              description: "The unique identifier of the task",
            }),
          }),
          body: UpdateTaskSchema,
          response: {
            200: {
              ...TaskResponseSchema,
              description: "Task updated successfully",
            },
          },
        },
      },
      updateTask,
    );

    protectedRoutes.delete(
      "/:id",
      {
        schema: {
          tags: ["Tasks"],
          summary: "Delete task",
          description: "Permanently removes a task from the database.",
          params: Type.Object({
            id: Type.String({ description: "ID of the task to delete" }),
          }),
          response: {
            204: {
              ...Type.Null(),
              description: "Task deleted successfully",
            },
            401: Type.Object({ error: Type.String() }),
            404: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      deleteTask,
    );

    protectedRoutes.patch(
      "/:id/move",
      {
        schema: {
          tags: ["Tasks"],
          summary: "Move task",
          description:
            "Changes the task's position, section, or project. Ideal for drag-and-drop operations.",
          params: Type.Object({
            id: Type.String({ description: "ID of the task being moved" }),
          }),
          body: UpdateTaskSchema,
          response: {
            200: {
              ...TaskResponseSchema,
              description: "Task moved successfully",
            },
          },
        },
      },
      moveTask,
    );
  });
}
