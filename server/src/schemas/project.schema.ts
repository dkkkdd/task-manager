import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "errors.title_required")
    .max(100, "errors.title_too_long"),
  color: z.string().optional(),
  favorites: z.boolean().optional(),
  order: z.number().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
