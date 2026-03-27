import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useModeStore } from "@/stores/useModesStore";
import { applyTheme } from "@/utils/userSettings";
import { useTasksStore } from "@/stores/useTasksStore";

export const useInitializeApp = () => {
  const { initAuth, isAuthenticated } = useAuthStore();
  const fetchProjects = useProjectsStore((s) => s.fetchProjects);
  const fetchTasks = useTasksStore((s) => s.fetchTasks);

  const { mode, selectedProjectId, showDone } = useModeStore();

  useEffect(() => {
    initAuth();

    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (
        !localStorage.getItem("theme") ||
        localStorage.getItem("theme") === "system"
      ) {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, fetchProjects]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, mode, selectedProjectId, showDone, fetchTasks]);
};
