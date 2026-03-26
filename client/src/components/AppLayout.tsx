import { useState, memo, lazy, createContext, useContext, useRef } from "react";
const Sidebar = lazy(() => import("@/components/Sidebar/Desktop/Sidebar"));
const MobileMenu = lazy(() => import("@/components/Sidebar/Mobile/Sidebar"));

import { useIsMobile } from "@/hooks/useIsMobile";

export const ScrollContext =
  createContext<React.RefObject<HTMLElement | null> | null>(null);

export const useScrollRef = () => useContext(ScrollContext);

const MemoChildren = memo(({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

interface LayoutContextType {
  scrollRef: React.RefObject<HTMLElement | null>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutContext = createContext<LayoutContextType | null>(null);
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutContext");
  return context;
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  return (
    <LayoutContext.Provider value={{ scrollRef, collapsed, setCollapsed }}>
      <div className="flex w-full bg-white dark:bg-[#1f1f1f] transition-colors duration-300 overflow-hidden">
        {isMobile ? <MobileMenu /> : <Sidebar collapsed={collapsed} />}

        <main
          ref={scrollRef}
          className="flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden bg-white dark:bg-[#1f1f1f] text-black dark:text-white"
        >
          <MemoChildren>{children}</MemoChildren>
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
