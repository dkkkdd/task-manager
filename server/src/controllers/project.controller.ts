import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import {
  UpdateProjectSchema,
  CreateProjectSchema,
} from "../schemas/project.schema";
import { Static } from "@sinclair/typebox";

export const getProjects = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.userId;

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        sections: { orderBy: { order: "asc" } },
        _count: { select: { tasks: true } },
      },
      orderBy: { order: "asc" },
    });

    return projects;
  } catch (error) {
    return reply.code(500).send({ error: "Failed to fetch projects" });
  }
};

export const createProject = async (
  request: FastifyRequest<{ Body: Static<typeof CreateProjectSchema> }>,
  reply: FastifyReply,
) => {
  const userId = request.userId;

  const { title, color, favorites, order } = request.body;

  try {
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        color,
        favorites,
        order,
        userId,
      },
    });

    return reply.code(201).send(project);
  } catch (error) {
    return reply.code(500).send({ error: "Failed to create project" });
  }
};

export const updateProject = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Static<typeof UpdateProjectSchema>;
  }>,
  reply: FastifyReply,
) => {
  const userId = request.userId;
  const { id } = request.params;

  const data = request.body;

  try {
    const updated = await prisma.project.update({
      where: {
        id: String(id),
        userId: userId,
      },
      data: {
        ...(data.title && { title: data.title.trim() }),
        color: data.color,
        favorites: data.favorites,
        order: data.order,
      },
    });

    return updated;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply
          .code(404)
          .send({ error: "Project not found or access denied" });
      }
    }
    console.error(error);
    return reply.code(500).send({ error: "Internal server error" });
  }
};

export const deleteProject = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const userId = request.userId;
  const { id } = request.params;

  try {
    const result = await prisma.project.deleteMany({
      where: {
        id: String(id),
        userId: userId,
      },
    });

    if (result.count === 0) {
      return reply.code(404).send({ error: "projects.not_found" });
    }

    return reply.code(204).send();
  } catch (error) {
    return reply.code(500).send({ error: "server_error" });
  }
};
