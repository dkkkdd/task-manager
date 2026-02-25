import { createContext, useContext, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";

type UseTasksReturn = ReturnType<typeof useTasks>;
interface TasksState {
  tasks: UseTasksReturn["tasks"];
  loading: UseTasksReturn["loading"];
}
interface TasksProviderProps {
  children: React.ReactNode;
  mode?: string;
  selectedProjectId?: string | null;
}
interface TasksActions {
  createTask: UseTasksReturn["createTask"];
  deleteTask: UseTasksReturn["deleteTask"];
  updateTask: UseTasksReturn["updateTask"];
  updateDone: UseTasksReturn["updateDone"];
}
const TasksStateContext = createContext<TasksState | null>(null);
const TasksActionsContext = createContext<TasksActions | null>(null);

export const useTasksState = () => {
  const context = useContext(TasksStateContext);
  if (!context)
    throw new Error("useTasksState must be used within TasksProvider");
  return context;
};

export const useTasksActions = () => {
  const context = useContext(TasksActionsContext);
  if (!context)
    throw new Error("useTasksActions must be used within TasksProvider");
  return context;
};

export function TasksProvider({
  children,
  mode,
  selectedProjectId,
}: TasksProviderProps) {
  const { user } = useAuth();
  const filters = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    switch (mode) {
      case "project":
        return { projectId: selectedProjectId };
      case "today":
        return { deadline: today };
      case "inbox":
        return { projectId: null };
      case "completed":
        return { isDone: true };
      case "overdue":
        return { deadlineBefore: today, isDone: false };
      default:
        return {};
    }
  }, [mode, selectedProjectId]);
  const { tasks, loading, createTask, deleteTask, updateTask, updateDone } =
    useTasks(user?.id || "", filters);

  const actions = useMemo(
    () => ({
      createTask,
      deleteTask,
      updateTask,
      updateDone,
    }),
    [createTask, deleteTask, updateTask, updateDone],
  );

  const state = useMemo(() => ({ tasks, loading }), [tasks, loading]);

  return (
    <TasksStateContext.Provider value={state}>
      <TasksActionsContext.Provider value={actions}>
        {children}
      </TasksActionsContext.Provider>
    </TasksStateContext.Provider>
  );
}
