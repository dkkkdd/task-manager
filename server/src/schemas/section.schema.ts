import { Type } from "@sinclair/typebox";
export const CreateSectionSchema = Type.Object({
  title: Type.String({
    minLength: 1,
    maxLength: 100,
    errorMessage: { minLength: "errors.title_required" },
  }),
  projectId: Type.Optional(Type.String()),
  order: Type.Optional(Type.Number({ default: 0 })),
});

export const SectionResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  order: Type.Number(),
  userId: Type.String(),
});

export const UpdateSectionSchema = Type.Partial(CreateSectionSchema);
