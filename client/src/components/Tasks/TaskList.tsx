import { useEffect } from "react";
import DeleteConfirmWrapper from "../DeleteConfirmWrapper";
import RenderTaskItem from "./RenderTaskCard";
import { AddTaskSection } from "./AddTaskSection";
import { EmptyState } from "@/components/EmptyPage";
// import { Selector } from "@/components/Selector";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollRef } from "../AppLayout";
// import { TaskListMenu } from "@/components/Tasks/TaskListMenu";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
// import { useSelectionStore } from "@/stores/useSelectionStore";
import { TaskLoader } from "./TaskLoader";
// import { TaskListMenu } from "./TaskListMenu";

export const TaskList = () => {
  const tasks = useTasksStore((s) => s.tasks);
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);

  // const {
  //   selectionMode,
  //   selectedIds,
  //   startSelection,
  //   clearSelection,
  //   toggleSelectAll,
  //   bulkComplete,
  //   bulkDelete,
  // } = useSelectionStore();

  const scrollRef = useScrollRef();

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
  const loading = useTasksStore((s) => s.loading);

  const fetchTasks = useTasksStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [mode, selectedProjectId, fetchTasks]);

  if (loading) {
    return (
      <div className="w-full max-w-[58rem] mx-auto pt-20 flex justify-center">
        <TaskLoader />
      </div>
    );
  }

  //     {/* <Selector
  //       visible={selectionMode}
  //       total={total}
  //       selectedIds={selectedIds}
  //       toggleSelectAll={toggleSelectAll}
  //       onClear={clearSelection}
  //       onComplete={() => bulkComplete([...selectedIds])}
  //       onDelete={() => bulkDelete([...selectedIds])}
  //       onUpdateDeadline={(date: Date | null, time: string | null) =>
  //         bulkUpdateDeadline([...selectedIds], date, time)
  //       }
  //       onSetPriority={(p: number) => openPrioritySheet([...selectedIds], p)}
  //     /> */}

  return (
    <>
      {/* <TaskListMenu
        mode={mode}
        selectedProjectId={selectedProjectId}
        // onStartSelection={startSelection}
      /> */}

      <div className="pt-20" />
      <div
        style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        className="w-full max-w-[50rem] mx-auto"
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
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
        <div className="w-full max-w-[58rem] mx-auto my-2">
          <AddTaskSection />
        </div>
      )}
      <div className="pb-20" />
      <DeleteConfirmWrapper />
      {tasks.length === 0 && <EmptyState />}
    </>
  );
};
