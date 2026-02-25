import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "errors.title_required")
    .max(170, "errors.title_too_long"),
  comment: z.string().optional(),
  isDone: z.boolean().optional(),
  deadline: z.coerce.date().optional(),
  priority: z.number().optional(),
  reminderAt: z.string().optional(),
  projectId: z.string().optional(),
  sectionId: z.string().optional(),
  parentId: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
