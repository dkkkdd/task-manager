import { Request, Response } from "express";
import { prisma } from "../prisma";
import {
  UpdateSectionSchema,
  CreateSectionSchema,
} from "../schemas/section.schema";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function normalizeId(id: string | string[] | undefined): string | undefined {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export async function createSection(req: AuthenticatedRequest, res: Response) {
  try {
    const validation = CreateSectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const { title, projectId, order } = validation.data;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!projectId)
      return res.status(400).json({ error: "Project id is required" });

    const project = await prisma.project.findFirst({
      where: { id: String(projectId), userId },
    });

    if (!project) return res.status(403).json({ error: "Access denied" });

    const section = await prisma.section.create({
      data: {
        title: title.trim(),
        order: order ?? 0,
        projectId: String(projectId),
        userId,
      },
    });

    res.status(201).json(section);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("CREATE SECTION ERROR:", errorMessage);
    res.status(500).json({ error: errorMessage });
  }
}

export async function updateSection(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const id = normalizeId(req.params.id);
    const validation = UpdateSectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const { title, order } = validation.data;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Section id is required" });

    const section = await prisma.section.findFirst({
      where: { id, project: { userId } },
    });

    if (!section) return res.status(404).json({ error: "Section not found" });

    const updated = await prisma.section.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE SECTION ERROR:", error);
    res.status(500).json({ error: "Failed to update section" });
  }
}

export async function deleteSection(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const id = normalizeId(req.params.id);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Section id is required" });

    const section = await prisma.section.findFirst({
      where: { id, project: { userId } },
    });

    if (!section) return res.status(404).json({ error: "Section not found" });

    await prisma.section.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE SECTION ERROR:", error);
    res.status(500).json({ error: "Failed to delete section" });
  }
}
