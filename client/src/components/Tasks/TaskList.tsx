import { lazy, useEffect, useState } from "react";
import { AddTaskSection } from "./AddTaskSection";
import { EmptyState } from "@/components/Tasks/EmptyState";
import { AppHeader } from "../Header/AppHeader";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { ProjectTitle } from "../Header/ProjectTitle";
import VirtualList from "./VirtualList";
import { useLayout } from "@/context/layoutContext";
const Selector = lazy(() => import("../Selector"));
import { useSelectionStore } from "@/stores/useSelectionStore";
import { TaskListModals } from "../../features/GlobalModals";

export const TaskList = () => {
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);

  const loading = useTasksStore((s) => s.loading);
  const tasksCache = useTasksStore((s) => s.tasksCache);
  const cacheKey = mode === "project" ? `project-${selectedProjectId}` : mode;
  const tasks = tasksCache[cacheKey] || [];
  const selectionMode = useSelectionStore((s) => s.selectionMode);

  const { scrollRef } = useLayout();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handle = () => {
      const el = scrollRef.current;
      if (!el) return;

      const next = el.scrollTop > 25;
      setScroll((prev) => (prev !== next ? next : prev));
    };

    const el = scrollRef.current;
    if (!el) return;

    handle();

    el.addEventListener("scroll", handle);
    return () => el.removeEventListener("scroll", handle);
  }, [scrollRef]);

  return (
    <>
      <AppHeader scroll={scroll} />
      <Selector visible={selectionMode} total={tasks.length} />
      <ProjectTitle scroll={scroll} variant="page" />
      <VirtualList tasks={tasks} />
      {tasks.length > 0 &&
        mode !== "completed" &&
        mode !== "overdue" &&
        !selectionMode && (
          <div className="w-full max-w-[50rem] px-[25px] mx-auto my-2">
            <AddTaskSection />
          </div>
        )}
      <div className="pb-20" />
      <TaskListModals />
      {tasks.length === 0 && !loading && <EmptyState />}
    </>
  );
};
