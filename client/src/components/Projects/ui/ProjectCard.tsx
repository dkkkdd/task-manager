import { memo, useCallback, useRef } from "react";
import type { Project } from "@/types/project";
import { useModeStore } from "@/stores/useModesStore";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  onOpenMenu: (el: HTMLElement, projectId: string) => void;
  isMenuOpen: boolean;
}

const ProjectItem = memo(function ProjectItem({
  project,
  onOpenMenu,
  isMenuOpen,
}: ProjectCardProps) {
  const openProject = useModeStore((s) => s.openProject);
  const isActive = useModeStore((s) => s.selectedProjectId === project.id);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMenuAction = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (btnRef.current) {
        onOpenMenu(btnRef.current, project.id);
      }
    },
    [onOpenMenu, project.id],
  );

  return (
    <Link
      to={`/project/${project.id}`}
      onClick={() => openProject(project.id)}
      className={`
        group relative flex items-start justify-between w-full cursor-pointer
        transition-all duration-200 p-2 md:p-0 rounded-lg
        bg-[#eee] dark:bg-[#232323]
        shadow-sm border border-gray-100/50 dark:border-none
        md:items-center md:mb-0 md:bg-transparent md:shadow-none md:border-none
        ${isActive ? "selected !bg-[#9d174d]/15" : "dark:hover:bg-[#363636] hover:bg-[#dedede]"}
        ${isMenuOpen ? "menu-active bg-[#dedede] dark:bg-[#363636]" : ""}
      `}
    >
      <div className="flex items-center gap-4 md:gap-2 truncate flex-1 mr-2">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center">
          <span
            className="icon-heart-svgrepo-com text-xl md:text-base"
            style={{ color: project.color }}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold md:font-normal text-black text-[14px] dark:text-[#dedede] break-words whitespace-normal md:truncate">
            {project.title}
          </span>
        </div>
      </div>

      <div className="relative shrink-0 ml-2 flex items-start md:items-center">
        <button
          data-vaul-no-drag
          ref={btnRef}
          type="button"
          aria-label="Project actions"
          tabIndex={0}
          onClick={handleMenuAction}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleMenuAction(e);
            }
          }}
          className={`
            icon-three-dots-punctuation-sign-svgrepo-com
            rotate-90 flex items-center justify-center
            p-2 md:p-[0.3em] text-[1.4em] md:text-[1.2em] md:mr-2
            rounded-full md:rounded-lg cursor-pointer
            text-gray-600 dark:text-white
            bg-gray-100 dark:bg-[#2c2c2e] md:bg-transparent
            hover:bg-[#82828241] outline-none focus-visible:ring-2 ring-[#9d174d]
            md:opacity-0 md:group-hover:opacity-100 border-none
            ${isMenuOpen ? "md:!opacity-100 md:bg-[#82828241]" : ""}
          `}
        />
      </div>
    </Link>
  );
});

export default ProjectItem;
