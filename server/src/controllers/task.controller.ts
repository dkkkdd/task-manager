import { Request, Response } from "express";
import { prisma } from "../prisma";
import { UpdateTaskSchema, CreateTaskSchema } from "../schemas/task.schema";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function normalizeId(id: string | string[] | undefined): string | undefined {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { projectId, isDone, deadline, deadlineBefore } = req.query;

    const where: any = {
      userId,
      parentId: null,
    };

    if (projectId === "null") {
      where.projectId = null;
    } else if (projectId) {
      where.projectId = projectId;
    }

    if (isDone !== undefined) {
      where.isDone = isDone === "true";
    }

    if (deadline) {
      const day = new Date(deadline as string);
      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));

      where.deadline = {
        gte: start,
        lte: end,
      };
    }

    if (deadlineBefore) {
      where.deadline = {
        lt: new Date(deadlineBefore as string),
      };
      where.isDone = false;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        subtasks: {
          orderBy: { order: "asc" },
        },
      },
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
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
