import type { Task } from "@/types/tasks";
import { Fragment } from "react/jsx-runtime";
import { TaskCardLoader } from "./TaskCardLoader";
import { lazy, Suspense } from "react";
const TaskCard = lazy(() => import("@/components/Tasks/TaskCard"));
import { TaskForm } from "./TaskForm";
import { useTaskListLogic } from "@/hooks/useTaskList";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTasksStore } from "@/stores/useTasksStore";
import { useTaskListStore } from "@/stores/useTaskListStore";

export const RenderTaskItem = ({ task }: { task: Task }) => {
  const isMobile = useIsMobile();
  const updateTask = useTasksStore((s) => s.updateTask);
  const handleStartAddSubtask = useTaskListStore(
    (s) => s.handleStartAddSubtask,
  );
  const handleDeleteRequest = useTaskListStore((s) => s.handleDeleteRequest);
  const toggleTask = useTaskListStore((s) => s.toggleTask);
  const editingTaskId = useTaskListStore((s) => s.editingTaskId);
  const expandedTasks = useTaskListStore((s) => s.expandedTasks);

  const setEditingTaskId = useTaskListStore((s) => s.setEditingTaskId);
  const { state } = useTaskListLogic();

  return (
    <Fragment key={task.id}>
      <Suspense fallback={<TaskCardLoader />}>
        <TaskCard
          key={task.id}
          task={task}
          isMobile={isMobile}
          isEditing={false}
          showSubTasks={expandedTasks[task.id] !== false}
          selectionMode={state.selection.selectionMode}
          selected={state.selection.selectedIds.has(task.id)}
          onSelect={() => state.selection.toggleSelect(task.id)}
          setShowSubTasks={() => toggleTask(task.id)}
          // onEdit={() => actions.handleStartEditing(task.id)}
          onDeleteRequest={() => handleDeleteRequest(task.id)}
          onAddSubtask={
            !!task.parentId ? undefined : () => handleStartAddSubtask(task.id)
          }
        />
      </Suspense>
      {isMobile && (
        <TaskForm
          key={task.id}
          openForm={editingTaskId === task.id}
          initiaTask={task}
          onStartAddSubtask={handleStartAddSubtask}
          formMode="edit"
          onClose={() => setEditingTaskId(null)}
        />
      )}
    </Fragment>
  );
};
