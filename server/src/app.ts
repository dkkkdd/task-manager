import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import sectionRoutes from "./routes/section.routes";
import { authMiddleware } from "./middleware/auth";
import cookieParser from "cookie-parser";

export const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["https://task-managerr.pp.ua", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/sections", authMiddleware, sectionRoutes);
