import { z } from "zod";

export const CreateSectionSchema = z.object({
  title: z
    .string()
    .min(1, "errors.title_required")
    .max(100, "errors.title_too_long"),
  projectId: z.string().optional(),
  order: z.number().optional(),
});

export const UpdateSectionSchema = CreateSectionSchema.partial();

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;
export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;
