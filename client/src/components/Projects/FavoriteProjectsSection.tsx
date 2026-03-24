import { useState, useRef, useLayoutEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProjectsList } from "@/components/Projects/ProjectsList";
import { useProjectsStore } from "@/stores/useProjectsStore";

const FavoriteProjects = () => {
  const { t } = useTranslation();
  const projects = useProjectsStore((s) => s.projects);
  const [showProjects, setShowProjects] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const favProjects = useMemo(
    () => projects.filter((p) => p.favorites),
    [projects],
  );

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    if (favProjects.length === 0) {
      wrapperRef.current.style.maxHeight = "0px";
      return;
    }
    wrapperRef.current.style.maxHeight = showProjects
      ? `${wrapperRef.current.scrollHeight}px`
      : "0px";
  }, [showProjects, favProjects]);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1 px-2">
        <div className=" text-gray-400">{t("favorite_projects")}</div>

        <div className="flex items-center">
          <div
            role="button"
            aria-label={"show or hide projects"}
            className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
            onClick={() => setShowProjects((p) => !p)}
          >
            <span
              className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634 text-[1.3em] transition-transform duration-250 ease-in-out text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"
              style={{
                transform: showProjects ? "rotate(90deg)" : "rotate(0deg)",
              }}
            ></span>
          </div>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <ProjectsList projects={favProjects} />
      </div>
    </div>
  );
};
export default FavoriteProjects;
