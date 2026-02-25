import { Request, Response } from "express";
import { prisma } from "../prisma";
import {
  UpdateProjectSchema,
  CreateProjectSchema,
} from "../schemas/project.schema";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function requireUser(req: AuthenticatedRequest, res: Response): string | null {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return req.userId;
}

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      sections: { orderBy: { order: "asc" } },
      _count: { select: { tasks: true } },
    },
    orderBy: { order: "asc" },
  });

  res.json(projects);
}

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const validation = CreateProjectSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format() });
  }
  const { title, color, favorites, order } = validation.data;

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      color,
      favorites,
      order,
      userId,
    },
  });

  res.status(201).json(project);
}

export async function updateProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id } = req.params;

  const validation = UpdateProjectSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format() });
  }

  const data = validation.data;

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

    res.json(updated);
  } catch (error) {
    console.error(error);

    return res
      .status(404)
      .json({ error: "Project not found or access denied" });
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id } = req.params;

  try {
    const result = await prisma.project.deleteMany({
      where: {
        id: String(id),
        userId: userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "projects.not_found" });
    }
    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "server_error" });
  }
}
