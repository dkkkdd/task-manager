import authRoutes from "../routes/auth.routes";
import projectRoutes from "../routes/project.routes";
import taskRoutes from "../routes/task.routes";
import sectionRoutes from "../routes/section.routes";
import { authMiddleware } from "../middleware/auth";
import { FastifyPluginAsync } from "fastify";

const routesPlugin: FastifyPluginAsync = async (app) => {
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
};

export default routesPlugin;
