import { Type, Static } from "@sinclair/typebox";

export const CreateTaskSchema = Type.Object({
  title: Type.String({
    minLength: 1,
    maxLength: 170,
    errorMessage: { minLength: "errors.title_required" },
  }),
  comment: Type.Optional(Type.String()),
  isDone: Type.Optional(Type.Boolean({ default: false })),
  deadline: Type.Optional(
    Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  ),
  priority: Type.Optional(
    Type.Number({
      default: 1,
      minimum: 1,
      maximum: 4,
      errorMessage: {
        minimum: "errors.priority_min",
        maximum: "errors.priority_max",
      },
    }),
  ),
  sectionId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  projectId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  order: Type.Optional(Type.Number({ default: 0 })),
});

export const TaskResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  comment: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  isDone: Type.Boolean(),
  deadline: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  priority: Type.Number(),
  sectionId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  projectId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  order: Type.Number(),
  userId: Type.String(),
  createdAt: Type.String(),
});

export const UpdateTaskSchema = Type.Partial(CreateTaskSchema);
