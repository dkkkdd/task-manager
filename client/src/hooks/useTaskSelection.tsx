import { useMemo, useState } from "react";
import type { Task } from "@/types/tasks";
import { useTasksStore } from "@/stores/useTasksStore";
export function useTaskSelection(
  filteredTasks: Task[],
  onSelectionStart?: () => void,
) {
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const currentIds = useMemo(() => {
    const set = new Set<string>();
    filteredTasks.forEach((t: Task) => {
      set.add(t.id);
      t.subtasks?.forEach((s: Task) => set.add(s.id));
    });
    return set;
  }, [filteredTasks]);

  const total = useMemo(() => {
    return filteredTasks.reduce(
      (acc: number, t: Task) => acc + 1 + (t.subtasks?.length || 0),
      0,
    );
  }, [filteredTasks]);

  const startSelection = () => {
    setSelectionMode(true);
    onSelectionStart?.();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const isAllSelected = prev.size === currentIds.size;
      return isAllSelected ? new Set() : currentIds;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const buildDeadline = (date: Date, time?: string | null) => {
    const d = new Date(date);

    if (time) {
      const [h, m] = time.split(":").map(Number);
      d.setHours(h, m, 0, 0);
    } else {
      d.setHours(23, 59, 59, 999);
    }

    return d;
  };

  const bulkComplete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => updateTask(id, { isDone: true })));
    clearSelection();
  };

  const bulkUpdateDeadline = async (
    ids: string[],
    newDate: Date | null,
    newTime: string | null,
  ) => {
    const deadline = newDate ? buildDeadline(newDate, newTime) : null;
    const reminderAt = newDate ? newTime : null;

    await Promise.all(
      ids.map((id) =>
        updateTask(id, {
          deadline,
          reminderAt,
        }),
      ),
    );

    clearSelection();
  };

  const bulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => deleteTask(id)));
    clearSelection();
  };

  const openPrioritySheet = async (ids: string[], priority: number) => {
    await Promise.all(ids.map((id) => updateTask(id, { priority })));
    clearSelection();
  };

  return {
    selectionMode,
    startSelection,
    selectedIds,
    total,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    bulkComplete,
    bulkUpdateDeadline,
    bulkDelete,
    openPrioritySheet,
  };
}
