import { FastifyInstance } from "fastify";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controller";
import { authMiddleware } from "../middleware/auth";
import { Type } from "@sinclair/typebox";
import {
  CreateSectionSchema,
  SectionResponseSchema,
  UpdateSectionSchema,
} from "../schemas/section.schema";

export default async function sectionRoutes(fastify: FastifyInstance) {
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.post(
      "/",
      {
        schema: {
          tags: ["Sections"],
          summary: "Create a new section",
          description:
            "Creates a new section within a specific project for the authenticated user.",
          body: CreateSectionSchema,
          response: {
            201: {
              ...SectionResponseSchema,
              description: "Section successfully created",
            },
          },
        },
      },
      createSection,
    );

    protectedRoutes.patch(
      "/:id",
      {
        schema: {
          tags: ["Sections"],
          summary: "Update section details",
          description:
            "Updates the title or order of an existing section by its ID.",
          params: Type.Object({
            id: Type.String({
              description: "The unique identifier of the section",
            }),
          }),
          body: UpdateSectionSchema,
          response: {
            200: {
              ...SectionResponseSchema,
              description: "Section successfully updated",
            },
          },
        },
      },
      updateSection,
    );

    protectedRoutes.delete(
      "/:id",
      {
        schema: {
          tags: ["Sections"],
          summary: "Delete section",
          description:
            "Removes a section from the database. Note: This might affect associated tasks depending on your database constraints.",
          params: Type.Object({
            id: Type.String({
              description: "The unique identifier of the section to delete",
            }),
          }),
          response: {
            204: {
              ...Type.Null(),
              description: "Section successfully deleted, no content returned",
            },
            401: Type.Object({ error: Type.String() }),
            404: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      deleteSection,
    );
  });
}
