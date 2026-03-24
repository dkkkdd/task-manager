import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProjectsList } from "@/components/Projects/ProjectsList";

import ShowProjectForm from "./ShowProjectForm";
import { useProjectsStore } from "@/stores/useProjectsStore";

export function ProjectsSection() {
  const { t } = useTranslation();
  const projects = useProjectsStore((s) => s.projects);

  const [showProjects, setShowProjects] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.maxHeight = showProjects
        ? `${wrapperRef.current.scrollHeight}px`
        : "0px";
    }
  }, [showProjects, projects.length]);

  return (
    <div className="py-2 z-999">
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="text-gray-400">{t("projects_count")}</div>

        <div className="flex items-center gap-1">
          <div
            role="button"
            aria-label={"show or hide projects"}
            className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
            onClick={() => setShowProjects(!showProjects)}
          >
            <span
              className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634 text-[1.3em] transition-transform duration-250 ease-in-out text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"
              style={{
                transform: showProjects ? "rotate(90deg)" : "rotate(0deg)",
              }}
            ></span>
          </div>

          <ShowProjectForm />
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
}
