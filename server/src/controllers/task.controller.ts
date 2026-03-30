import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { UpdateTaskSchema, CreateTaskSchema } from "../schemas/task.schema";
import { Prisma } from "@prisma/client";
import { Static } from "@sinclair/typebox";

type TaskQuery = {
  projectId?: string;
  mode?: string;
  showDone?: string;
};

type TaskParams = {
  id: string;
};

export const getTasks = async (
  request: FastifyRequest<{ Querystring: TaskQuery }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { projectId, mode, showDone } = request.query;
    const isShowDone = showDone === "true";

    const where: Prisma.TaskWhereInput = { userId };
    const isFlatMode = ["today", "overdue", "completed"].includes(mode || "");

    if (!isFlatMode) {
      where.parentId = null;
    }

    if (!isShowDone && mode !== "completed") {
      where.isDone = false;
    }

    switch (mode) {
      case "inbox":
        where.projectId = null;
        break;

      case "project":
        if (!projectId) {
          return reply.code(400).send({ error: "projectId required" });
        }
        where.projectId = projectId;
        break;

      case "today":
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        where.deadline = { gte: start, lte: end };
        break;

      case "overdue":
        where.deadline = { lt: new Date() };
        break;

      case "completed":
        where.isDone = true;
        break;

      default:
        where.projectId = null;
    }

    const tasks = await prisma.task.findMany({
      where,

      include: isFlatMode
        ? undefined
        : {
            subtasks: {
              orderBy: [{ isDone: "asc" }, { order: "asc" }],
            },
          },
      orderBy: [{ isDone: "asc" }, { order: "asc" }],
    });

    return tasks;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (
  request: FastifyRequest<{ Body: Static<typeof CreateTaskSchema> }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;

    const {
      title,
      comment,
      isDone = false,
      deadline,
      priority = 1,
      sectionId,
      parentId,
      projectId,
    } = request.body;

    const cleanProjectId = projectId && projectId !== "" ? projectId : null;
    const cleanSectionId = sectionId && sectionId !== "" ? sectionId : null;
    const cleanParentId = parentId && parentId !== "" ? parentId : null;

    const lastTask = await prisma.task.findFirst({
      where: {
        userId,
        projectId: cleanProjectId,
        sectionId: cleanSectionId,
        parentId: cleanParentId,
      },
      orderBy: { order: "desc" },
    });

    const nextOrder = (lastTask?.order ?? 0) + 1;

    const task = await prisma.task.create({
      data: {
        title,
        userId,
        projectId: cleanProjectId,
        sectionId: cleanSectionId,
        parentId: cleanParentId,
        comment: comment || null,
        isDone,
        priority: Number(priority) || 1,
        order: nextOrder,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return reply.code(201).send(task);
  } catch (error: any) {
    request.log.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return reply.code(400).send({
          error:
            "Invalid foreign key (projectId/sectionId/parentId). Ensure that these IDs exist.",
        });
      }
    }

    return reply.code(500).send({
      error: "Failed to create task",
      details: error.message,
    });
  }
};

export const updateTask = async (
  request: FastifyRequest<{
    Params: TaskParams;
    Body: Static<typeof UpdateTaskSchema>;
  }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { id: taskId } = request.params;
    const data = request.body;

    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.comment !== undefined) updateData.comment = data.comment ?? null;
    if (data.priority !== undefined) updateData.priority = data.priority;

    if (data.deadline !== undefined) {
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    }

    if (data.isDone !== undefined) {
      updateData.isDone = data.isDone;
      updateData.completedAt = data.isDone ? new Date() : null;
    }

    if (data.projectId !== undefined) {
      updateData.project = data.projectId
        ? { connect: { id: data.projectId } }
        : { disconnect: true };
    }

    if (data.sectionId !== undefined) {
      updateData.section = data.sectionId
        ? { connect: { id: data.sectionId } }
        : { disconnect: true };
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId, userId },
      data: updateData,
      include: {
        subtasks: { orderBy: { order: "asc" } },
      },
    });

    return updatedTask;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.code(404).send({ error: "Task not found" });
    }
    request.log.error(error);
    return reply.code(500).send({ error: "Internal server error" });
  }
};

export const deleteTask = async (
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { id: taskId } = request.params;

    const result = await prisma.task.deleteMany({
      where: { id: taskId, userId },
    });

    if (result.count === 0) {
      return reply.code(404).send({ error: "Task not found" });
    }

    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to delete task" });
  }
};

export const moveTask = async (
  request: FastifyRequest<{ Params: TaskParams }>,
  reply: FastifyReply,
) => {
  try {
    const userId = request.userId;
    const { id: taskId } = request.params;
    const { toSectionId, toParentId, beforeOrder, afterOrder } =
      request.body as any;

    if (beforeOrder == null || afterOrder == null) {
      return reply
        .code(400)
        .send({ error: "beforeOrder and afterOrder are required" });
    }

    const newOrder = (Number(beforeOrder) + Number(afterOrder)) / 2;

    const updated = await prisma.task.update({
      where: { id: taskId, userId },
      data: {
        sectionId: toSectionId ?? null,
        parentId: toParentId ?? null,
        order: newOrder,
      },
    });

    return updated;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Failed to move task" });
  }
};
