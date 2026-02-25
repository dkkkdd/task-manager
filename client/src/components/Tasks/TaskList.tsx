import { useState, useCallback, useMemo, Fragment } from "react";
import { Trans, useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";
import { useTasksActions, useTasksState } from "@/context/TasksContext";
import { useProjectsContext } from "@/context/ProjectsContext";
import { useFilteredTasks } from "@/hooks/useFilteredTasks";
import { useTaskSelection } from "@/hooks/useTaskSelection";
import { useIsMobile } from "@/hooks/useIsMobile";
import { TaskForm } from "@/components/Tasks/TaskForm";
import { TaskCard } from "@/components/Tasks/TaskCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { AddTaskBtn } from "@/components/AddTaskBtn";
import { EmptyState } from "@/components/EmptyPage";
import { Selector } from "@/components/Selector";
import { TaskListMenu } from "@/components/Tasks/TaskListMenu";
import { TaskLoader } from "@/components/Tasks/TaskLoader";

export const TaskList = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { tasks, ready } = useFilteredTasks();
  const saveTasks = tasks === null ? [] : tasks;
  const { loading } = useTasksState();
  const { mode, selectedProjectId } = useProjectsContext();
  const { deleteTask, updateTask, createTask } = useTasksActions();

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
  );
  console.log("render");
  const showContent = ready && !loading;

  const toggleTask = useCallback((taskId: string) => {
    setExpandedTasks((prev) => {
      const current = prev[taskId] ?? true;
      return { ...prev, [taskId]: !current };
    });
  }, []);

  const handleStartEditing = useCallback((id: string) => {
    setEditingTaskId(id);
    setActiveParentId(null);
    setOpenForm(false);
  }, []);

  const handleStartAddSubtask = useCallback((parentId: string | null) => {
    setActiveParentId(parentId);
    setEditingTaskId(null);
    setOpenForm(false);
  }, []);

  const handleDeleteRequest = useCallback((task: Task) => {
    setTaskToDelete(task);
  }, []);
  const selection = useTaskSelection(saveTasks, () => {
    setOpenForm(false);
    setActiveParentId(null);
    setEditingTaskId(null);
  });
  const handleStartSelection = () => {
    selection.startSelection();
  };
  const shouldShowAddButton = useMemo(
    () =>
      !openForm &&
      mode !== "completed" &&
      mode !== "overdue" &&
      (isMobile || saveTasks.length > 0),
    [openForm, mode, isMobile, saveTasks.length],
  );

  const transComponents = useMemo(
    () => ({
      b: <b className="font-bold text-black dark:text-white" />,
    }),
    [],
  );

  const renderTaskItem = (task: Task) => {
    if (!isMobile && editingTaskId === task.id) {
      return (
        <TaskForm
          key={task.id}
          openForm
          initiaTask={task}
          formMode="edit"
          onClose={() => setEditingTaskId(null)}
          onSubmit={async (data) => {
            await updateTask(task.id, data);
            setEditingTaskId(null);
          }}
        />
      );
    }

    return (
      <Fragment key={task.id}>
        <TaskCard
          key={task.id}
          task={task}
          isMobile={isMobile}
          isEditing={false}
          showSubTasks={expandedTasks[task.id] !== false}
          selectionMode={selection.selectionMode}
          selected={selection.selectedIds.has(task.id)}
          onSelect={() => selection.toggleSelect(task.id)}
          setShowSubTasks={() => toggleTask(task.id)}
          onEdit={() => handleStartEditing(task.id)}
          onDeleteRequest={() => handleDeleteRequest(task)}
          onAddSubtask={
            !!task.parentId ? undefined : () => handleStartAddSubtask(task.id)
          }
        />
        {isMobile && (
          <TaskForm
            key={`edit-${task.id}`}
            openForm={editingTaskId === task.id}
            initiaTask={task}
            onStartAddSubtask={handleStartAddSubtask}
            formMode="edit"
            onClose={() => setEditingTaskId(null)}
            onSubmit={async (data) => {
              await updateTask(task.id, data);
              setEditingTaskId(null);
            }}
          />
        )}
      </Fragment>
    );
  };

  if (!ready) {
    return (
      <div className="w-full max-w-[58rem] mx-auto pt-20 opacity-100 transition-opacity duration-300">
        <TaskLoader />
      </div>
    );
  }

  return (
    <>
      <TaskListMenu
        mode={mode}
        selectedProjectId={selectedProjectId}
        onStartSelection={handleStartSelection}
      />

      <div
        className={`w-full max-w-[58rem] mx-auto pt-20 transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {saveTasks.map((task: Task) => (
          <div key={task.id} className="task-group flex flex-col">
            {renderTaskItem(task)}

            {mode !== "today" && expandedTasks[task.id] !== false && (
              <div
                key={`subtasks-container-${task.id}`}
                className="subtasks-container pl-9 flex flex-col"
              >
                {task.subtasks?.map((sub: Task) => renderTaskItem(sub))}

                <TaskForm
                  openForm={activeParentId === task.id}
                  formMode="create"
                  parentId={task.id}
                  onClose={() => setActiveParentId(null)}
                  onSubmit={async (data) => {
                    await createTask({ ...data, parentId: task.id });
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {shouldShowAddButton && (
          <div className="fixed bottom-[10%] md:static">
            <AddTaskBtn
              showText={!isMobile}
              onOpenForm={() => setOpenForm(true)}
            />
          </div>
        )}
        {!isMobile && openForm && (
          <TaskForm
            openForm={openForm}
            formMode="create"
            onClose={() => setOpenForm(false)}
            onSubmit={async (data) => {
              await createTask(data);
            }}
          />
        )}

        {isMobile && (
          <TaskForm
            openForm={openForm}
            formMode="create"
            onClose={() => setOpenForm(false)}
            onSubmit={async (data) => {
              await createTask(data);
            }}
          />
        )}
      </div>

      {taskToDelete && (
        <ConfirmModal
          title={t("delete_task_title")}
          variant="primary"
          message={
            <Trans
              i18nKey="delete_task_message"
              values={{ title: taskToDelete.title }}
              components={transComponents}
            />
          }
          onConfirm={async () => {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }}
          onClose={() => setTaskToDelete(null)}
          confirmText={t("delete_now")}
          cancelText={t("cancel")}
        />
      )}

      {!openForm && saveTasks.length === 0 && (
        <EmptyState mode={mode} onOpenForm={() => setOpenForm(true)} />
      )}

      <Selector
        visible={selection.selectionMode}
        total={selection.total}
        selectedIds={selection.selectedIds}
        toggleSelectAll={selection.toggleSelectAll}
        onClear={selection.clearSelection}
        onComplete={() => selection.bulkComplete([...selection.selectedIds])}
        onDelete={() => selection.bulkDelete([...selection.selectedIds])}
        onUpdateDeadline={(date: Date | null, time: string | null) =>
          selection.bulkUpdateDeadline([...selection.selectedIds], date, time)
        }
        onSetPriority={(p: number) =>
          selection.openPrioritySheet([...selection.selectedIds], p)
        }
      />
    </>
  );
};
