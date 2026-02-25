import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";

import { authMiddleware } from "../middleware/auth";
const router = Router();

router.use(authMiddleware);
router.get("/", getProjects);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
