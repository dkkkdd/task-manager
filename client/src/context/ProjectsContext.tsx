import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useLocation, useNavigate } from "react-router-dom";

export type TaskMode =
  | "project"
  | "inbox"
  | "today"
  | "completed"
  | "overdue"
  | "projects";

type ProjectsContextType = ReturnType<typeof useProjects> & {
  selectedProjectId: string | null;
  selectedProject: string | null;
  mode: TaskMode;
  setMode: (mode: TaskMode) => void;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
  changeMode: (newMode: TaskMode, projectId?: string | null) => void;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const projectsData = useProjects();
  const location = useLocation();
  const navigate = useNavigate();

  const mode = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/project/")) return "project";
    if (path === "/today") return "today";
    if (path === "/completed") return "completed";
    if (path === "/overdue") return "overdue";
    if (path === "/projects") return "projects";
    return "inbox";
  }, [location.pathname]);

  const selectedProjectId = useMemo(() => {
    const match = location.pathname.match(/\/project\/([^/]+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  const selectedProject =
    projectsData.projects.find((p) => p.id === selectedProjectId)?.title ||
    null;
  const [showAll, setShowAll] = useState<boolean>(() => {
    return localStorage.getItem("showAll") === "true";
  });
  const changeMode = (newMode: TaskMode, projectId: string | null = null) => {
    if (newMode === "project" && projectId) {
      navigate(`/project/${projectId}`);
    } else if (newMode === "inbox") {
      navigate("/");
    } else {
      navigate(`/${newMode}`);
    }
  };
  const setMode = (m: TaskMode) => changeMode(m);

  useEffect(() => {
    localStorage.setItem("showAll", String(showAll));
  }, [showAll]);
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <ProjectsContext.Provider
      value={{
        ...projectsData,
        selectedProjectId,
        selectedProject,
        mode,
        setMode,
        showAll,
        setShowAll,
        changeMode,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (!context)
    throw new Error("useProjectsContext must be used within ProjectsProvider");
  return context;
};
