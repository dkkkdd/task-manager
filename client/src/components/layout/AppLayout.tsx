import { useState, useRef } from "react";
import { LayoutContext } from "@/context/layoutContext";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <LayoutContext.Provider value={{ scrollRef, collapsed, setCollapsed }}>
      <div className="flex w-full min-h-screen bg-white dark:bg-[#1f1f1f] transition-colors duration-300 overflow-hidden">
        <Sidebar collapsed={collapsed} />

        <main
          ref={scrollRef}
          className="flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden text-black dark:text-white"
        >
          <Outlet />
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
