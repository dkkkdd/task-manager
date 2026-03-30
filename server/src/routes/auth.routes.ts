import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import {
  CreateUserSchema,
  LoginUserSchema,
  UpdateUserSchema,
  UserResponseSchema,
} from "../schemas/auth.schema";
import {
  register,
  login,
  deleteAcc,
  getMe,
  updateMe,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Creates a new user account and returns user data. Typically sets an auth cookie.",
        body: CreateUserSchema,
        response: {
          201: {
            ...Type.Object({ user: UserResponseSchema }),
            description: "User successfully registered",
          },
          400: Type.Object({ error: Type.String() }),
          500: Type.Object({ error: Type.String() }),
        },
      },
    },
    register,
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login user",
        description:
          "Authenticates the user and initiates a session via HttpOnly cookies.",
        body: LoginUserSchema,
        response: {
          200: {
            ...Type.Object({ user: UserResponseSchema }),
            description: "Successfully authenticated",
          },
          400: Type.Object({ error: Type.String() }),
          401: Type.Object({ error: Type.String() }),
          500: Type.Object({ error: Type.String() }),
        },
      },
    },
    login,
  );

  fastify.post(
    "/logout",
    {
      schema: {
        tags: ["Auth"],
        summary: "Logout user",
        description:
          "Clears the authentication cookie and ends the current session.",
        response: {
          200: {
            ...Type.Object({ message: Type.String() }),
            description: "Successfully logged out",
          },
        },
      },
    },
    logout,
  );

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", authMiddleware);

    protectedRoutes.get(
      "/me",
      {
        schema: {
          tags: ["Auth"],
          summary: "Get current user profile",
          description:
            "Returns the profile data of the currently authenticated user based on the session cookie.",
          security: [{ cookieAuth: [] }],
          response: {
            200: {
              ...UserResponseSchema,
              description: "User profile data retrieved",
            },
            401: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      getMe,
    );

    protectedRoutes.patch(
      "/me",
      {
        schema: {
          tags: ["Auth"],
          summary: "Update user profile",
          description:
            "Allows the user to update their own profile information (e.g., name or email).",
          security: [{ cookieAuth: [] }],
          body: UpdateUserSchema,
          response: {
            200: {
              ...UserResponseSchema,
              description: "Profile updated successfully",
            },
            400: Type.Object({ error: Type.String() }),
            401: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      updateMe,
    );

    protectedRoutes.delete(
      "/me",
      {
        schema: {
          tags: ["Auth"],
          summary: "Delete account",
          description:
            "Permanently deletes the authenticated user's account and all associated data.",
          security: [{ cookieAuth: [] }],
          response: {
            204: {
              ...Type.Null(),
              description: "Account successfully deleted",
            },
            401: Type.Object({ error: Type.String() }),
            500: Type.Object({ error: Type.String() }),
          },
        },
      },
      deleteAcc,
    );
  });
}
