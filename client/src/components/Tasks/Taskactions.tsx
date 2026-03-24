import { memo } from "react";
import { Calendar } from "@/components/Calendar/Calendar";

interface TaskActionsProps {
  isSelectionMode?: boolean;
  isMobile?: boolean;
  isMenuOpen: boolean;
  isCalOpen: boolean;
  currentDeadlineStr: Date | null;
  reminderAt?: string | null;
  onEdit: () => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDateUpdate: (date: Date | null) => void;
  onTimeUpdate: (time: string | null) => void;
  setIsCalOpen: (val: boolean) => void;
}

export const TaskActions = memo(function TaskActions({
  isSelectionMode,
  isMobile,
  isMenuOpen,
  isCalOpen,
  currentDeadlineStr,
  reminderAt,

  onEdit,
  onMenuClick,
  onDateUpdate,
  onTimeUpdate,
  setIsCalOpen,
}: TaskActionsProps) {
  if (isMobile) return null;

  return (
    <div className="flex items-center">
      <button
        aria-label={"edit"}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className={`
          opacity-0 group-hover:opacity-100 
          text-gray-800 dark:text-white icon-pencil 
          p-2 rounded-md cursor-pointer 
          hover:bg-black/5 dark:hover:bg-[#82828241]
          transition-opacity
          ${isSelectionMode ? "!opacity-0 pointer-events-none" : ""}
        `}
      />

      <div
        role="button"
        aria-label="open calendar"
        className={`${isSelectionMode ? "opacity-0 pointer-events-none" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          date={currentDeadlineStr}
          setDate={onDateUpdate}
          time={reminderAt || null}
          setIsCalOpen={setIsCalOpen}
          setTime={onTimeUpdate}
        >
          <button
            onClick={() => setIsCalOpen(true)}
            className={`
              ${
                isCalOpen
                  ? "opacity-100 bg-black/5 dark:bg-[#82828241]"
                  : "opacity-0 group-hover:opacity-100"
              }
              text-gray-800 dark:text-white icon-calendar-_1 
              p-2 rounded-md cursor-pointer 
              hover:bg-black/5 dark:hover:bg-[#82828241]
              transition-all
            `}
          />
        </Calendar>
      </div>

      <button
        aria-label={"menu"}
        onClick={(e) => {
          onMenuClick(e);
          setIsCalOpen(false);
        }}
        className={`
          ${
            isMenuOpen
              ? "opacity-100 bg-black/5 dark:bg-[#82828241]"
              : "opacity-0 group-hover:opacity-100"
          }
          ${isSelectionMode ? "!opacity-0 pointer-events-none" : ""}
          text-gray-800 dark:text-white 
          icon-three-dots-punctuation-sign-svgrepo-com 
          p-2 rounded-md cursor-pointer 
          hover:bg-black/5 dark:hover:bg-[#82828241]
          transition-all
        `}
      />
    </div>
  );
});
