import { memo } from "react";

interface TaskCheckboxProps {
  isDone: boolean;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  priorityColor?: string;
  priorityBg?: string;
  onToggle: (e: React.MouseEvent) => void;
  onSelect?: (e: React.MouseEvent) => void;
}

export const TaskCheckbox = memo(function TaskCheckboxAnimated({
  isDone,
  isSelectionMode,
  isSelected,
  priorityColor,
  priorityBg,
  onToggle,
  onSelect,
}: TaskCheckboxProps) {
  return (
    <span
      onClick={isSelectionMode ? onSelect : onToggle}
      className={`
        relative flex-shrink-0
        w-[18px] h-[18px]
        border rounded-full cursor-pointer 
        flex items-center justify-center 
        transition-all duration-200
        ${
          isSelectionMode
            ? isSelected
              ? "bg-pink-700 border-[#999] text-white"
              : "border-black/30 dark:border-white/30 hover:border-[#9d174d]"
            : ""
        }
        ${isDone ? "shadow-md" : ""}
      `}
      style={
        !isSelectionMode
          ? {
              borderColor: priorityColor,
              borderWidth: isDone ? "2px" : "1.2px",
              backgroundColor: isDone ? priorityColor : priorityBg,
            }
          : undefined
      }
    >
      {!isSelectionMode && isDone && (
        <svg
          viewBox="0 0 24 24"
          className="w-[10px] h-[10px] !hover:scale-105 text-white"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </span>
  );
});
