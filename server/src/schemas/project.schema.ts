import { Type } from "@sinclair/typebox";
export const CreateProjectSchema = Type.Object({
  title: Type.String({
    minLength: 1,
    maxLength: 100,
    errorMessage: { minLength: "errors.title_required" },
  }),
  color: Type.Optional(Type.String({ default: "#8c8c8c" })),
  favorites: Type.Optional(Type.Boolean({ default: false })),
  order: Type.Optional(Type.Number({ default: 0 })),
});

export const ProjectResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  color: Type.String(),
  favorites: Type.Boolean(),
  order: Type.Number(),
  userId: Type.String(),
});

export const UpdateProjectSchema = Type.Partial(CreateProjectSchema);
