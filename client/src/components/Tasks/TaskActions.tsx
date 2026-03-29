import { memo, useState } from "react";
import Calendar from "../Calendar/Calendar";
import { useTaskListStore } from "@/stores/useTaskListStore";
import { useTasksStore } from "@/stores/useTasksStore";
import type { Task } from "@/types/tasks";

interface TaskActionsProps {
  task: Task;
  isSelectionMode: boolean;
  isMobile?: boolean;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TaskActions = memo(function TaskActions({
  task,
  isSelectionMode,
  isMobile,
  onMenuClick,
}: TaskActionsProps) {
  const [isCalOpen, setIsCalOpen] = useState(false);
  const handleStartEditing = useTaskListStore((s) => s.handleStartEditing);
  const updateTask = useTasksStore((s) => s.updateTask);

  const isMenuOpen = useTaskListStore((s) => s.menuTaskId === task.id);

  if (isMobile || isSelectionMode) return null;

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => handleStartEditing(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-800 dark:text-white icon-pencil p-2 rounded-md hover:bg-black/5 dark:hover:bg-[#82828241]"
      />

      <Calendar
        date={task.deadline}
        setDate={(date) => updateTask(task.id, { deadline: date })}
      >
        <button
          onClick={() => setIsCalOpen(true)}
          className={`${isCalOpen ? "opacity-100 bg-black/5" : "opacity-0 group-hover:opacity-100"} text-gray-800 dark:text-white icon-calendar-_1 p-2 rounded-md hover:bg-black/5`}
        />
      </Calendar>

      <button
        onClick={(e) => {
          onMenuClick(e);
          setIsCalOpen(false);
        }}
        className={`${isMenuOpen ? "opacity-100 bg-black/5" : "opacity-0 group-hover:opacity-100"} text-gray-800 dark:text-white icon-three-dots-punctuation-sign-svgrepo-com p-2 rounded-md hover:bg-black/5`}
      />
    </div>
  );
});
