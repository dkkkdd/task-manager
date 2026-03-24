import { useState, memo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
const Sidebar = lazy(() => import("@/components/Sidebar/Desktop/Sidebar"));
const MobileMenu = lazy(() => import("@/components/Sidebar/Mobile/Sidebar"));
import { useModeStore } from "@/stores/useModesStore";
import { useProjectsStore } from "@/stores/useProjectsStore";

// context/ScrollContext.ts
import { createContext, useContext, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ScrollContext =
  createContext<React.RefObject<HTMLElement | null> | null>(null);

export const useScrollRef = () => useContext(ScrollContext);

function AppHeader() {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const projects = useProjectsStore((s) => s.projects);
  const projectTitle = projects.find((p) => p.id === selectedProjectId)?.title;

  return (
    <div className="w-full top-0 p-4 bg-gradient-to-b from-white/90 to-white/0 dark:from-[#1f1f1f]/90 dark:to-[#1f1f1f]/0 absolute">
      <div className="p-3 font-bold">
        {projectTitle?.toUpperCase() || t(mode.toLowerCase()).toUpperCase()}
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const MemoChildren = memo(({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  return (
    <ScrollContext.Provider value={scrollRef}>
      <div className="flex w-full bg-white dark:bg-[#1f1f1f] transition-colors duration-300 overflow-hidden">
        <div
          className={`absolute top-2 z-[999] cursor-pointer hidden md:block 
          flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] 
          hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? "left-2" : "left-[calc(100%-3rem)] sm:left-[16.5em]"}
        `}
          onClick={() => setCollapsed((v) => !v)}
        >
          <span
            className={`text-[1.3em] ${
              collapsed ? "icon-icons8-menu-bar" : "icon-icons8-close"
            }`}
          />
        </div>

        {/* <Sidebar collapsed={collapsed} />

        <MobileMenu /> */}
        <Suspense fallback={<div className="w-[19em]" />}>
          {isMobile ? <MobileMenu /> : <Sidebar collapsed={collapsed} />}
        </Suspense>
        <main
          ref={scrollRef}
          className="flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden p-4 !pt-0 sm:p-[24px] bg-white dark:bg-[#1f1f1f] text-black dark:text-white pb-15"
        >
          <MemoChildren>{children}</MemoChildren>

          <AppHeader />
        </main>
      </div>
    </ScrollContext.Provider>
  );
}
