import { SidebarActions } from "./SidebarActions";
import FavoriteProjects from "@/components/Projects/FavoriteProjectsSection";
import { ProjectsSection } from "@/components/Projects/ProjectSection";
import { SidebarNavigation } from "@/components/layout/Sidebar/SidebarNavigation";

function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={`
       max-h-[100dvh]
       overflow-y-auto
        relative shrink-0 transition-all duration-350 ease-in-out
        bg-[#eee] dark:bg-[#232323] hidden md:block
    w-full
        ${collapsed ? "max-w-0" : "max-w-[19em]"}
      `}
    >
      <div
        className={`
          h-full w-full p-4  transition-all duration-350 ease-in-out
          ${
            collapsed
              ? "opacity-0 -translate-x-[200%]"
              : "opacity-100 translate-x-0"
          }
        `}
      >
        <SidebarActions />

        <div className="space-y-1">
          <SidebarNavigation />
          <FavoriteProjects />
          <ProjectsSection />
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
