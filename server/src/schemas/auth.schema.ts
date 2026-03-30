import { Type } from "@sinclair/typebox";

export const CreateUserSchema = Type.Object({
  userName: Type.String({ minLength: 3, maxLength: 30 }),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});

export const LoginUserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export const UserResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  userName: Type.String(),
});

export const UpdateUserSchema = Type.Partial(CreateUserSchema);
