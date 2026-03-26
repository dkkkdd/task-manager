import { memo } from "react";
import { Calendar } from "@/components/Calendar/Calendar";

interface TaskActionsProps {
  isSelectionMode: boolean;
  isMobile?: boolean;
  isMenuOpen: boolean;
  isCalOpen: boolean;
  currentDeadlineStr: string | null;
  onEdit: () => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDateUpdate: (date: string | null) => void;
  setIsCalOpen: (val: boolean) => void;
}

export const TaskActions = memo(function TaskActions({
  isSelectionMode,
  isMobile,
  isMenuOpen,
  isCalOpen,
  currentDeadlineStr,

  onEdit,
  onMenuClick,
  onDateUpdate,

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
          
          ${isSelectionMode ? "!opacity-0 pointer-events-none" : ""}
        `}
      />

      <div
        role="button"
        aria-label="open calendar"
        className={`${isSelectionMode ? "opacity-0 pointer-events-none" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar date={currentDeadlineStr} setDate={onDateUpdate}>
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
         
        `}
      />
    </div>
  );
});
