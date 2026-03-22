import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import sectionRoutes from "./routes/section.routes";
import { authMiddleware } from "./middleware/auth";

export const app = fastify({
  logger: true,
  trustProxy: true,
});

app.register(cors, {
  origin: ["https://task-managerr.pp.ua", "http://localhost:5173"],
  credentials: true,
});

app.register(cookie);
app.register(authRoutes, { prefix: "/api/auth" });

app.register(
  async (instance) => {
    instance.addHook("preHandler", authMiddleware);

    instance.register(projectRoutes, { prefix: "/projects" });
    instance.register(taskRoutes, { prefix: "/tasks" });
    instance.register(sectionRoutes, { prefix: "/sections" });
  },
  { prefix: "/api" },
);
