import { lazy } from "react";
import { useModeStore } from "@/stores/useModesStore";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { useTranslation } from "react-i18next";
import { TaskListMenu } from "../Tasks/Menus/TaskListMenu";
const TaskSettingsMenu = lazy(() => import("../Tasks/Menus/TaskSettingsMenu"));
import { ProjectTitle } from "./ProjectTitle";
import { useLayout } from "@/context/layoutContext";
import { useIsMobile } from "@/hooks/useIsMobile";

export function AppHeader({ scroll }: { scroll: boolean }) {
  const { collapsed, setCollapsed } = useLayout();
  const { startSelection, selectionMode, selectedIds } = useSelectionStore();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const mode = useModeStore((s) => s.mode);

  return (
    <div
      className={`sticky top-0 flex justify-between items-center w-full transition-colors duration-300
        border-b ${scroll ? "border-black/10 dark:border-[#252525]" : "border-transparent"} 
        p-2 z-[999] bg-white dark:bg-[#1f1f1f]`}
    >
      {!isMobile && (
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-[#82828241] transition-colors text-black dark:text-white"
          title={collapsed ? t("expand") : t("collapse")}
        >
          <span
            className={`text-[1.3em] ${collapsed ? "icon-icons8-menu-bar" : "icon-icons8-close"}`}
          />
        </button>
      )}

      <ProjectTitle scroll={scroll} variant="header" />

      <div className="flex items-center gap-4">
        <button
          onClick={startSelection}
          className={`p-2 rounded-lg transition-all flex items-center gap-2 outline-none text-black dark:text-white 
            ${
              selectionMode
                ? "bg-blue-500 text-white"
                : "hover:bg-black/5 dark:hover:bg-[#333] text-gray-700 dark:text-white"
            }`}
        >
          <span
            className={`icon-bookmarks text-black dark:text-white  ${selectionMode ? "text-white" : "opacity-70"}`}
          />
          <span className="hidden sm:block text-sm font-medium">
            {selectionMode
              ? `${t("selected")}: ${selectedIds.size}`
              : t("start_selection")}
          </span>
        </button>

        <TaskSettingsMenu />
        <TaskListMenu mode={mode} />
      </div>
    </div>
  );
}
