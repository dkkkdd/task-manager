import { useEffect } from "react";
import DeleteConfirmWrapper from "../DeleteConfirmWrapper";
import RenderTaskItem from "./RenderTaskCard";
import { AddTaskSection } from "./AddTaskSection";
import { EmptyState } from "@/components/EmptyPage";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AppHeader } from "../AppHeader";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { ProjectTitle } from "../ProjectTitle";
import { useLayout } from "../AppLayout";
import { Selector } from "../Selector";
import { useSelectionStore } from "@/stores/useSelectionStore";
import type { Task } from "@/types/tasks";
const getAllIds = (tasks: Task[]): string[] => {
  let ids: string[] = [];
  tasks.forEach((task) => {
    ids.push(task.id);
    if (task.subtasks && task.subtasks.length > 0) {
      ids = [...ids, ...getAllIds(task.subtasks)];
    }
  });
  return ids;
};
export const TaskList = () => {
  const mode = useModeStore((s) => s.mode);
  const showDone = useModeStore((s) => s.showDone);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const fetchTasks = useTasksStore((state) => state.fetchTasks);
  const loading = useTasksStore((s) => s.loading);
  const tasksCache = useTasksStore((s) => s.tasksCache);
  const cacheKey = mode === "project" ? `project-${selectedProjectId}` : mode;
  const tasks = tasksCache[cacheKey] || [];
  const selectionMode = useSelectionStore((s) => s.selectionMode);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const toggleSelectAll = useSelectionStore((s) => s.toggleSelectAll);
  const bulkSetPriority = useSelectionStore((s) => s.bulkSetPriority);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const bulkComplete = useSelectionStore((s) => s.bulkComplete);
  const bulkDelete = useSelectionStore((s) => s.bulkDelete);
  const bulkProjectChange = useSelectionStore((s) => s.bulkProjectChange);
  console.log(tasksCache);
  const bulkUpdateDeadline = useSelectionStore((s) => s.bulkUpdateDeadline);
  const allTaskIds = getAllIds(tasks);

  const { scrollRef } = useLayout();

  useEffect(() => {
    fetchTasks();
  }, [mode, selectedProjectId, showDone, fetchTasks]);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => scrollRef?.current ?? null,
    estimateSize: () => 60,
    measureElement: (el) => {
      const height = el.getBoundingClientRect().height;
      return Math.max(height, 20);
    },
    getItemKey: (index) => tasks[index]?.id ?? index,
    overscan: 10,
  });
  const scroll = scrollRef?.current
    ? scrollRef?.current?.scrollTop > 25
    : false;

  return (
    <>
      <AppHeader scroll={scroll} />

      <Selector
        visible={selectionMode}
        total={tasks.length}
        selectedIds={selectedIds}
        toggleSelectAll={() => toggleSelectAll(allTaskIds)}
        onClear={clearSelection}
        onComplete={bulkComplete}
        onDelete={bulkDelete}
        onUpdateProject={bulkProjectChange}
        onUpdateDeadline={bulkUpdateDeadline}
        onSetPriority={bulkSetPriority}
      />

      <ProjectTitle scroll={scroll} variant="page" />
      <div
        style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        className="w-full max-w-[50rem] mx-auto "
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              padding: "0 1em 0 1em",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <RenderTaskItem task={tasks[virtualItem.index]} />
          </div>
        ))}
      </div>

      {tasks.length > 0 && mode !== "completed" && mode !== "overdue" && (
        <div className="w-full max-w-[50rem] px-[25px] mx-auto my-2">
          <AddTaskSection />
        </div>
      )}
      <div className="pb-20" />
      <DeleteConfirmWrapper />
      {tasks.length === 0 && !loading && <EmptyState />}
    </>
  );
};
