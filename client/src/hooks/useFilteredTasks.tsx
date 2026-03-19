// import { useMemo } from "react";
// import { isToday } from "date-fns";
// import type { Task } from "@/types/tasks";
// import { useTasksState } from "@/context/TasksContext";
// import { useModeStore } from "@/stores/useModesStore";

// export function useFilteredTasks() {
//   const { tasks, loading } = useTasksState();
//   const mode = useModeStore((s) => s.mode);
//   const selectedProjectId = useModeStore((s) => s.selectedProjectId);
//   const showAll = useModeStore((s) => s.showAll);

//   const filteredTasks = useMemo(() => {
//     if (!tasks) return null;

//     const now = new Date();
//     if (mode === "projects") return [];

//     const checkDeadline = (task: Task) => {
//       if (!task.deadline) return false;
//       const d = new Date(task.deadline);

//       if (task.reminderAt) {
//         const [h, m] = task.reminderAt.split(":").map(Number);
//         d.setHours(h, m, 0, 0);
//       } else {
//         d.setHours(23, 59, 59, 999);
//       }

//       if (mode === "today") return isToday(new Date(task.deadline));
//       if (mode === "overdue") return d < now && !task.isDone;
//       return false;
//     };

//     const matchesPage = (t: Task) => {
//       if (mode === "inbox") return !t.projectId;
//       if (mode === "project") return t.projectId === selectedProjectId;
//       return true;
//     };

//     if (mode === "today" || mode === "overdue" || mode === "completed") {
//       type FlatTask = Task & {
//         isFlat: boolean;
//         isStandaloneSubtask: boolean;
//         parentName: string | null;
//       };
//       const allItems: FlatTask[] = [];

//       const processTask = (task: Task, parentName?: string) => {
//         let isMatch = false;

//         if (mode === "completed") {
//           isMatch = task.isDone;
//         } else {
//           isMatch = checkDeadline(task) && (showAll || !task.isDone);
//         }

//         if (isMatch) {
//           allItems.push({
//             ...task,
//             subtasks: [],
//             isFlat: true,
//             isStandaloneSubtask: !!parentName,
//             parentName: parentName || null,
//           });
//         }
//       };

//       tasks.forEach((parent: Task) => {
//         processTask(parent);
//         parent.subtasks?.forEach((sub: Task) => processTask(sub, parent.title));
//       });

//       return allItems.sort(
//         (a: Task, b: Task) => Number(a.isDone) - Number(b.isDone),
//       );
//     }

//     const filtered = tasks.filter((t: Task) => {
//       if (!matchesPage(t)) return false;
//       return showAll ? true : !t.isDone;
//     });

//     return filtered.sort(
//       (a: Task, b: Task) => Number(a.isDone) - Number(b.isDone),
//     );
//   }, [tasks, mode, selectedProjectId, loading, showAll]);

//   return { tasks: filteredTasks, ready: tasks !== null };
// }
// useFilteredTasks.ts — отдельный хук с useMemo
import { useMemo } from "react";
import { useTasksStore } from "@/stores/useTasksStore";
import { useModeStore } from "@/stores/useModesStore";
import { isToday } from "date-fns";

export function useFilteredTasks() {
  const tasks = useTasksStore((s) => s.tasks);
  const mode = useModeStore((s) => s.mode);
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const showAll = useModeStore((s) => s.showAll);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    if (mode === "projects") return [];

    if (mode === "today") {
      return tasks.filter((t) => t.deadline && isToday(new Date(t.deadline)));
    }
    if (mode === "overdue") {
      return tasks.filter(
        (t) => t.deadline && new Date(t.deadline) < now && !t.isDone,
      );
    }
    if (mode === "completed") {
      return tasks.filter((t) => t.isDone);
    }
    if (mode === "project") {
      return tasks.filter(
        (t) => t.projectId === selectedProjectId && (showAll || !t.isDone),
      );
    }
    // inbox
    return tasks.filter((t) => !t.projectId && (showAll || !t.isDone));
  }, [tasks, mode, selectedProjectId, showAll]);

  return filteredTasks;
}
