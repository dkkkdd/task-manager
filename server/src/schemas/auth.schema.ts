import { z } from "zod";

export const CreateUserSchema = z.object({
  userName: z
    .string()
    .min(3, "errors.title_required")
    .max(30, "errors.title_too_long"),
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  password: z.string().min(8, "errors.password_too_short"),
});

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  password: z.string(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
