import { useModeStore } from "@/stores/useModesStore";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useTranslation } from "react-i18next";

interface ProjectTitleProps {
  scroll?: boolean;
  variant?: "header" | "page";
}

export const ProjectTitle = ({
  scroll,
  variant = "header",
}: ProjectTitleProps) => {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const projects = useProjectsStore((s) => s.projects);

  const project = projects.find((p) => p.id === selectedProjectId);
  const title = project?.title || t(mode?.toLowerCase() || "inbox");

  if (variant === "header") {
    return (
      <div
        className={`
          p-1 font-bold transition-all duration-500 ease-in-out
          ${scroll ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
        `}
      >
        {title.toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`
        w-full max-w-[50rem] mx-auto px-4 mb-4 transition-all duration-300
        ${scroll ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}
      `}
    >
      <h1 className="text-[2rem] font-extrabold tracking-tight">
        {title.toUpperCase()}
      </h1>
    </div>
  );
};
