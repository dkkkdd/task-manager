import { memo } from "react";

interface SubtaskToggleProps {
  subCount: number | null;
  showSubTasks?: boolean;
  mode: string;
  onToggle?: () => void;
}

export const SubtaskToggle = memo(function SubtaskToggle({
  subCount,
  showSubTasks,
  onToggle,
}: SubtaskToggleProps) {
  if (!onToggle) return null;

  return (
    <>
      {subCount !== 0 && subCount && (
        <div
          className="absolute md:left-[-2em] text-gray-800 dark:text-white p-2 rounded-md cursor-pointer 
              hover:bg-black/5 dark:hover:bg-[#82828241] z-[10]
               right-[-0.2em] top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 group/arrow"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span
            className="transition-all duration-200 cursor-pointer p-1.5 rounded-md icon-reshot-icon-arrow-chevron-right-WDGHUKQ634  "
            style={{
              transform: showSubTasks ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      )}
    </>
  );
});
