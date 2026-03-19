import { useEffect } from "react";
import type { Task } from "@/types/tasks";
import DeleteConfirmWrapper from "../DeleteConfirmWrapper";
import { RenderTaskItem } from "./RenderTaskCard";
import { AddTaskSection } from "./AddTaskSection";
import { EmptyState } from "@/components/EmptyPage";
import { Selector } from "@/components/Selector";
import { TaskListMenu } from "@/components/Tasks/TaskListMenu";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { TaskLoader } from "./TaskLoader";
import OpenForm from "../Sidebar/OpenForm";

export const TaskList = () => {
  const tasks = useTasksStore((s) => s.tasks);
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);

  const {
    selectionMode,
    selectedIds,
    startSelection,
    clearSelection,
    toggleSelectAll,
    bulkComplete,
    bulkDelete,
  } = useSelectionStore();

  const loading = useTasksStore((s) => s.loading);
  const fetchTasks = useTasksStore((state) => state.fetchTasks);

  // useEffect(() => {
  //   fetchTasks();
  // }, [mode, selectedProjectId]);
  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[58rem] mx-auto pt-20 flex justify-center">
        <TaskLoader />
      </div>
    );
  }
  return (
    <>
      <TaskListMenu
        mode={mode}
        selectedProjectId={selectedProjectId}
        onStartSelection={startSelection}
      />

      <div
        className={`w-full max-w-[58rem] mx-auto pt-20 transition-opacity duration-500 ${
          tasks.length ? "opacity-100" : "opacity-0"
        }`}
      >
        {tasks.map((task: Task) => (
          <div key={task.id} className="task-group flex flex-col">
            <RenderTaskItem key={task.id} task={task} />

            {/* {mode !== "today" && expandedTasks[task.id] !== false && (
              <div
                key={`subtasks-container-${task.id}`}
                className="subtasks-container pl-9 flex flex-col"
              >
                {task.subtasks?.map((sub: Task) => (
                  <RenderTaskItem key={sub.id} task={sub} />
                ))}

                <TaskForm
                  openForm={activeParentId === task.id}
                  formMode="create"
                  parentId={task.id}
                  onClose={() => setActiveParentId(null)}
                />
              </div>
            )} */}
          </div>
        ))}

        {tasks.length > 0 && (mode !== "completed" || "ovedue") && (
          <div className="fixed bottom-[10%] md:static">
            <AddTaskSection />
          </div>
        )}

        <OpenForm />
      </div>

      <DeleteConfirmWrapper />

      {tasks.length === 0 && <EmptyState />}

      {/* <Selector
        visible={selectionMode}
        total={total}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        onClear={clearSelection}
        onComplete={() => bulkComplete([...selectedIds])}
        onDelete={() => bulkDelete([...selectedIds])}
        onUpdateDeadline={(date: Date | null, time: string | null) =>
          bulkUpdateDeadline([...selectedIds], date, time)
        }
        onSetPriority={(p: number) => openPrioritySheet([...selectedIds], p)}
      /> */}
    </>
  );
};
