import { Request, Response } from "express";
import { prisma } from "../prisma";
import { UpdateTaskSchema, CreateTaskSchema } from "../schemas/task.schema";
import { Prisma } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  userId: string;
}

function normalizeId(id: string | string[] | undefined): string | undefined {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    console.log("QUERY PARAMS:", req.query);

    const projectId = normalizeId(req.query.projectId as string | string[]);
    const mode = normalizeId(req.query.mode as string | string[]);
    console.log(
      `[DEBUG] Fetching tasks: userId=${userId}, mode=${mode}, projectId=${projectId}`,
    );
    const where: Prisma.TaskWhereInput = { userId, parentId: null };

    switch (mode) {
      case "inbox":
        where.projectId = null;
        break;
      case "project":
        if (!projectId)
          return res.status(400).json({ error: "projectId required" });
        where.projectId = projectId;
        break;
      case "today":
        where.deadline = {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        break;
      case "overdue":
        where.deadline = { lt: new Date() };
        where.isDone = false;
        break;
      case "completed":
        where.isDone = true;
        break;
      case "projects":
        return res.json([]);
      default:
        where.projectId = null;
    }
    const tasks = await prisma.task.findMany({
      where,
      include: { subtasks: { orderBy: { order: "asc" } } },
      orderBy: [{ isDone: "asc" }, { order: "asc" }],
    });

    res.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    const validation = CreateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const {
      title,
      projectId,
      sectionId,
      parentId,
      comment,
      deadline,
      priority,
      reminderAt,
    } = validation.data;

    const lastTask = await prisma.task.findFirst({
      where: {
        userId,
        sectionId: sectionId ?? null,
        parentId: parentId ?? null,
      },
      orderBy: { order: "desc" },
    });

    const nextOrder = (lastTask?.order ?? 0) + 1;

    const task = await prisma.task.create({
      data: {
        title,
        userId,

        projectId: projectId ?? null,
        sectionId: sectionId ?? null,
        parentId: parentId ?? null,

        comment: comment ?? null,
        priority: Number(priority) || 1,
        order: nextOrder,

        deadline: deadline ? new Date(deadline) : null,

        reminderAt: reminderAt ?? null,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    const validation = UpdateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const data = validation.data;
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    }

    if (data.reminderAt !== undefined) {
      data.reminderAt = data.reminderAt;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        ...data,
        ...(data.isDone !== undefined && {
          completedAt: data.isDone ? new Date() : null,
        }),
      },
      include: {
        subtasks: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(404).json({ error: "Task not found" });
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    await prisma.task.deleteMany({
      where: {
        id: taskId,
        userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(404).json({ error: "Task not found" });
  }
}

export async function moveTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    const { toSectionId, toParentId, beforeOrder, afterOrder } = req.body;

    if (beforeOrder == null || afterOrder == null) {
      return res.status(400).json({
        error: "beforeOrder and afterOrder are required",
      });
    }

    const newOrder = (Number(beforeOrder) + Number(afterOrder)) / 2;

    const updated = await prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        sectionId: toSectionId ?? null,
        parentId: toParentId ?? null,
        order: newOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("MOVE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to move task" });
  }
}
