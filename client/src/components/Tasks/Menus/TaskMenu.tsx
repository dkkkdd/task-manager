import { lazy, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

import type { Task } from "@/types/tasks";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { generateDatePresets } from "@/utils/dateFormatters";
import { QuickBtn } from "@/components/Buttons/QuickBtn";
const Calendar = lazy(() => import("@/components/Calendar/Calendar"));

import { isSameDay } from "date-fns";
import { useTasksStore } from "@/stores/useTasksStore";

interface GlobalMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  updateDate: (newDate: string | null) => void;
  onAddSubtask?: () => void;
}

const GlobalDropdown = ({
  anchorEl,
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  updateDate,
  onAddSubtask,
}: GlobalMenuProps) => {
  const { t } = useTranslation();
  const updateTask = useTasksStore((s) => s.updateTask);

  const [isCalOpen, setIsCalOpen] = useState(false);

  const {
    refs: { setFloating },
    floatingStyles,
    context,
    isPositioned,
  } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        setIsCalOpen(false);
        onClose();
      }
    },
    elements: { reference: anchorEl },
    whileElementsMounted: autoUpdate,
    placement: "left-end",
    middleware: [offset(4), flip(), shift()],
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: "click",
  });

  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);
  const currentDeadlineStr = task.deadline || null;
  const dates = useMemo(() => generateDatePresets(), []);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={setFloating}
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? "visible" : "hidden",
          }}
          {...getFloatingProps()}
          className="transition-opacity duration-200 min-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-xl p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] outline-none"
        >
          <div
            onClick={() => {
              onEdit();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-2.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white rounded-lg transition-colors"
          >
            <span className="icon-pencil text-lg opacity-60"></span>
            {t("edit")}
          </div>

          {onAddSubtask && (
            <div
              onClick={() => {
                onAddSubtask();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white rounded-lg transition-colors"
            >
              <span className="icon-plus-svgrepo-com-1 text-lg opacity-60"></span>
              {t("add_subtask")}
            </div>
          )}

          <div className="h-[1px] bg-black/5 dark:bg-white/5 my-1 mx-2"></div>

          <div className="my-2 px-3 py-1">
            <span className="text-[12px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">
              {t("due_date")}
            </span>
            <div className="flex gap-1.5 mt-2">
              <QuickBtn
                icon="icon-calendar-_2"
                color="text-[#00c853]"
                onClick={() => {
                  updateDate(dates.today.toISOString());
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_5"
                color="text-[#ffab00]"
                isActive={
                  currentDeadlineStr
                    ? isSameDay(
                        new Date(currentDeadlineStr),
                        new Date(dates.tomorrow),
                      )
                    : false
                }
                onClick={() => {
                  updateDate(dates.tomorrow.toISOString());
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_4"
                color="text-blue-500"
                isActive={
                  currentDeadlineStr
                    ? isSameDay(
                        new Date(currentDeadlineStr),
                        new Date(dates.weekend),
                      )
                    : false
                }
                onClick={() => {
                  updateDate(dates.weekend.toISOString());
                  onClose();
                }}
              />
              {task.deadline && (
                <QuickBtn
                  icon="icon-icons8-close"
                  color="text-[#ff4444]"
                  onClick={() => {
                    updateDate(null);
                    onClose();
                  }}
                />
              )}

              <Calendar
                date={task.deadline}
                setDate={(d) => {
                  updateDate(d);
                  onClose();
                }}
              >
                <button
                  onClick={() => setIsCalOpen(!isCalOpen)}
                  className={`
                    h-9 w-9 flex items-center justify-center rounded-xl transition-all
                    ${isCalOpen ? "bg-blue-500/10 text-blue-500" : "hover:bg-black/5 dark:hover:bg-white/5 text-black/40 dark:text-white/40"}
                  `}
                >
                  <span className="icon-three-dots-punctuation-sign-svgrepo-com text-xl" />
                </button>
              </Calendar>
            </div>
          </div>

          <div className="my-2 text-[12px] px-3 py-1">
            <span className="font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">
              {t("priority")}
            </span>
            <div className="flex mt-2 gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    updateTask(task.id, { priority: p.value });
                    onClose();
                  }}
                  className={`h-9 p-2 flex items-center justify-center rounded-lg transition-all
                    ${p.value === task.priority ? "opacity-100" : "opacity-40 hover:opacity-100 !hover:bg-black/5 !dark:hover:bg-white/5"}
                  `}
                  style={{
                    color: p.color,
                    backgroundColor:
                      p.value === task.priority
                        ? `rgba(${p.color} 0.4)`
                        : undefined,
                  }}
                >
                  <span className="icon-flag text-lg"></span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-black/5 dark:bg-white/5 my-1 mx-2"></div>

          <div
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-2.5 hover:bg-red-500/10 cursor-pointer text-red-400 rounded-lg transition-colors"
          >
            <span className="icon-bin text-lg"></span>
            {t("delete")}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

export default GlobalDropdown;
