import { FastifyInstance } from "fastify";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth";
import {
  CreateProjectSchema,
  ProjectResponseSchema,
  UpdateProjectSchema,
} from "../schemas/project.schema";
import { Type } from "@sinclair/typebox";

export default async function projectsRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get(
      "/",
      {
        schema: {
          tags: ["Projects"],
          summary: "Get all user projects",
          description:
            "Returns a list of all projects owned by the authenticated user, including section data and task counts.",
          response: {
            200: {
              ...Type.Array(ProjectResponseSchema),
              description: "List of projects retrieved successfully",
            },
          },
        },
      },
      getProjects,
    );

    protectedRoutes.post(
      "/",
      {
        schema: {
          tags: ["Projects"],
          summary: "Create a new project",
          description:
            "Creates a new project for the authenticated user with specific title, color, and ordering.",
          body: CreateProjectSchema,
          response: {
            201: {
              ...ProjectResponseSchema,
              description: "Project created successfully",
            },
          },
        },
      },
      createProject,
    );

    protectedRoutes.patch(
      "/:id",
      {
        schema: {
          tags: ["Projects"],
          summary: "Update project details",
          description:
            "Updates an existing project's metadata like title, color, or favorite status.",
          params: Type.Object({
            id: Type.String({
              description: "The unique identifier of the project",
            }),
          }),
          body: UpdateProjectSchema,
          response: {
            200: {
              ...ProjectResponseSchema,
              description: "Project updated successfully",
            },
          },
        },
      },
      updateProject,
    );

    protectedRoutes.delete(
      "/:id",
      {
        schema: {
          tags: ["Projects"],
          summary: "Delete project",
          description:
            "Permanently deletes a project and potentially its associated sections and tasks (depending on DB constraints).",
          params: Type.Object({
            id: Type.String({ description: "ID of the project to delete" }),
          }),
          response: {
            204: {
              ...Type.Null(),
              description: "Project deleted successfully",
            },
            401: Type.Object({ error: Type.String() }),
            404: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      deleteProject,
    );
  });
}
