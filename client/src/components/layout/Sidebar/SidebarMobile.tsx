import { Drawer } from "vaul";
import { ProjectPage } from "@/components/Projects/ProjectPage";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { SidebarNavigation } from "@/components/layout/Sidebar/SidebarNavigation";

function MobileMenu() {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] z-50 md:hidden rounded-2xl 
        bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center">
          <SidebarNavigation variant="mobile">
            <button
              onClick={() => setShowProjects(true)}
              className="flex-1 flex items-center justify-center h-full text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span className="icon-heart-svgrepo-com text-xl" />
            </button>
          </SidebarNavigation>
        </div>
      </div>

      <Drawer.Root
        open={showProjects}
        onOpenChange={setShowProjects}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="absolute inset-0 z-40 bg-black/30 z-[999]" />
          <Drawer.Content className="z-[1000] absolute inset-x-0 bottom-0 z-50 bg-white dark:bg-[#1f1f1f] rounded-t-3xl max-h-[90vh] flex flex-col">
            <VisuallyHidden>
              <Drawer.Title>Projects Navigation</Drawer.Title>
              <Drawer.Description>
                Select a project to view tasks
              </Drawer.Description>
            </VisuallyHidden>
            <Drawer.Handle className="mx-auto my-3 h-1.5 w-14 rounded-full bg-black/20 dark:bg-white/20" />
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
              <ProjectPage />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
export default MobileMenu;
