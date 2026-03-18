import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "errors.title_required")
    .max(170, "errors.title_too_long"),
  comment: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  deadline: z.coerce.date().optional().nullable(),
  priority: z.number().optional(),
  reminderAt: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  sectionId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});
export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
