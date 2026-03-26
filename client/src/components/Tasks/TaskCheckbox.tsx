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
  if (isSelectionMode) {
    return (
      <div
        onClick={onSelect}
        className={`
           relative min-w-[1.2em] min-h-[1.2em] border rounded-full cursor-pointer 
        flex items-center justify-center 
        transition-all duration-200
        active:scale-90
        hover:scale-110
          ${
            isSelected
              ? "bg-pink-700 border-[#999] text-white scale-95"
              : "border-black/30 dark:border-white/30 hover:border-[#9d174d] dark:hover:border-[#9d174d] hover:scale-105"
          }
        `}
      ></div>
    );
  }

  return (
    <span
      onClick={onToggle}
      className={`
        relative min-w-[1.2em] min-h-[1.2em] border rounded-full cursor-pointer 
        flex items-center justify-center 
        transition-all duration-200
        active:scale-90
        hover:scale-110
        ${isDone ? "shadow-md" : ""}
      `}
      style={{
        borderColor: isDone ? priorityColor : priorityColor,
        borderWidth: isDone ? "2px" : "1.2px",
        backgroundColor: isDone ? priorityColor : priorityBg,
        transform: isDone ? "rotate(0deg)" : "rotate(0deg)",
      }}
    >
      {isDone && (
        <svg
          viewBox="0 0 24 24"
          className="w-[0.9em] h-[0.9em] text-white"
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
          }}
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            style={{
              strokeDasharray: 20,
              strokeDashoffset: isDone ? 0 : 20,
              transition: "stroke-dashoffset 0.3s ease-in-out",
            }}
          />
        </svg>
      )}
    </span>
  );
});

export const checkboxAnimationStyles = `
@keyframes checkmark-stroke {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}
`;
