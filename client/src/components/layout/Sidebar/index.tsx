import { useIsMobile } from "@/hooks/useIsMobile";
import { lazy, Suspense } from "react";

const SidebarDesktop = lazy(() => import("./SidebarDesktop"));
const SidebarMobile = lazy(() => import("./SidebarMobile"));

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <SidebarMobile />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-[19em] h-screen bg-[#eee] dark:bg-[#232323] animate-pulse shrink-0" />
      }
    >
      <SidebarDesktop collapsed={collapsed} />
    </Suspense>
  );
};

export default Sidebar;
