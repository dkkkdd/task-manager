import { AnimatePresence, motion } from "framer-motion";
import { Drawer } from "vaul";
import { ProjectPage } from "@/components/Projects/ProjectPage";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useModeStore } from "@/stores/useModesStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { TaskMode } from "../Desktop/SidebarNavigation";

const menuItems: { id: TaskMode; icon: string; path: string }[] = [
  { id: "inbox", icon: "icon-inbox", path: "/" },
  { id: "today", icon: "icon-calendar-_1", path: "/today" },
  { id: "completed", icon: "icon-checkmark", path: "/completed" },
  { id: "overdue", icon: "icon-history", path: "/overdue" },
  { id: "projects", icon: "icon-heart-svgrepo-com", path: "/projects" },
];

export function MobileMenu() {
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] z-50 md:hidden rounded-2xl bg-white/70 dark:bg-[#1f1f1f]/70 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-14 items-center">
          {menuItems.map((item) => {
            const isActive =
              mode === item.id ||
              (mode === "project" && item.id === "projects");

            const content = (
              <>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="ios-glass"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                      className="absolute w-[90%] h-12 rounded-2xl backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                    >
                      <span className="absolute inset-0 rounded-2xl dark:bg-[#272727] bg-gray/20" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`relative text-xl ${item.icon} ${isActive ? "text-[#9d174d]" : "text-black dark:text-white"}`}
                />
              </>
            );

            if (item.id === "projects") {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setShowProjects(true);
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                  className="relative flex-1 h-full flex items-center justify-center"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMode(item.id)}
                className="relative flex-1 h-full flex items-center justify-center"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      <Drawer.Root
        open={showProjects}
        onOpenChange={setShowProjects}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="absolute inset-0 z-40 bg-black/30" />
          <Drawer.Content className="absolute inset-x-0 bottom-0 z-50 bg-white dark:bg-[#1f1f1f] rounded-t-3xl max-h-[90vh] flex flex-col">
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
