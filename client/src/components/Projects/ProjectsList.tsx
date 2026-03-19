import { useCallback, useState } from "react";
import type { Project } from "@/types/project";
import { ProjectItem } from "@/components/Projects/ProjectCard";
import { ProjectMenuController } from "@/components/Projects/Menu/ProjectMenuController";

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [menu, setMenu] = useState<{
    anchor: HTMLElement | null;
    projectId: string | null;
  }>({ anchor: null, projectId: null });

  const openMenu = useCallback((el: HTMLElement, projectId: string) => {
    setMenu({ anchor: el, projectId });
  }, []);

  return (
    <>
      <div className="flex flex-col items-start list-none m-0 p-0 w-full">
        {projects.map((p) => (
          <ProjectItem
            key={p.id}
            project={p}
            onOpenMenu={openMenu}
            isMenuOpen={menu.projectId === p.id && !!menu.anchor}
          />
        ))}
      </div>

      <ProjectMenuController
        anchor={menu.anchor}
        projectId={menu.projectId}
        setMenu={setMenu}
        closeMenu={() => setMenu({ anchor: null, projectId: menu.projectId })}
      ></ProjectMenuController>
    </>
  );
}
