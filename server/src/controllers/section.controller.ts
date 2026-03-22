import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import {
  UpdateSectionSchema,
  CreateSectionSchema,
} from "../schemas/section.schema";

interface SectionParams {
  id: string;
}

export const createSection = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const validation = CreateSectionSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.format() });
    }
    const { title, projectId, order } = validation.data;
    const userId = request.userId;

    if (!userId) return reply.code(401).send({ error: "Unauthorized" });
    if (!title) return reply.code(400).send({ error: "Title is required" });
    if (!projectId)
      return reply.code(400).send({ error: "Project id is required" });

    const project = await prisma.project.findFirst({
      where: { id: String(projectId), userId },
    });

    if (!project) return reply.code(403).send({ error: "Access denied" });

    const section = await prisma.section.create({
      data: {
        title: title.trim(),
        order: order ?? 0,
        projectId: String(projectId),
        userId,
      },
    });

    return reply.code(201).send(section);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    request.log.error(`CREATE SECTION ERROR: ${message}`);
    return reply.code(500).send({ error: message });
  }
};

export const updateSection = async (
  request: FastifyRequest<{ Params: SectionParams }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { id } = request.params;

    const validation = UpdateSectionSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error.format() });
    }

    const { title, order } = validation.data;
    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    const section = await prisma.section.findFirst({
      where: { id, project: { userId } },
    });

    if (!section) {
      return reply.code(404).send({ error: "Section not found" });
    }

    const updated = await prisma.section.update({
      where: { id, userId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return updated;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to update section" });
  }
};

export const deleteSection = async (
  request: FastifyRequest<{ Params: SectionParams }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { id } = request.params;

    const section = await prisma.section.findFirst({
      where: { id, project: { userId } },
    });

    if (!section) {
      return reply.code(404).send({ error: "Section not found" });
    }

    await prisma.section.delete({
      where: { id, userId },
    });

    return reply.code(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({ error: "Section not found" });
      }
    }
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to delete section" });
  }
};
