import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Select } from "@/components/Select";
import { Calendar } from "@/components/Calendar/Calendar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useModeStore } from "@/stores/useModesStore";
import { useTasksStore } from "@/stores/useTasksStore";

type SelectorProps = {
  visible: boolean;
  selectedIds: Set<string>;
  total: number;
  toggleSelectAll: () => void;
  onClear: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onUpdateDeadline: (date: Date | null, time: string | null) => void;
  onSetPriority: (priority: number) => void;
};

export const Selector = ({
  visible,
  total,
  selectedIds,
  toggleSelectAll,
  onClear,
  onComplete,
  onDelete,
  onUpdateDeadline,
  onSetPriority,
}: SelectorProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const selectedProjectId = useModeStore((s) => s.selectedProjectId);
  const projects = useProjectsStore((s) => s.projects);
  const updateTask = useTasksStore((s) => s.updateTask);
  const [bulkProjectId, setBulkProjectId] = useState<string | null>(
    selectedProjectId,
  );
  const [bulkDate, setBulkDate] = useState<Date | null>(null);
  const [bulkTime, setBulkTime] = useState<string | null>(null);
  const [bulkPriority, setBulkPriority] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);

  if (!visible) return null;

  return (
    <>
      <div
        className="
          fixed bottom-4 left-1/2 -translate-x-1/2
          z-[999]
          w-[calc(100%-2rem)] max-w-5xl
          rounded-2xl
          bg-[#eee] dark:bg-[#232323] backdrop-blur
          border border-white/10
          shadow-2xl
          px-4 py-3
          flex flex-col gap-3
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-black/80 dark:text-white/80">
            {selectedIds.size > 0 && (
              <span className="font-medium">
                {t("selected_count", { count: selectedIds.size })}
              </span>
            )}

            <button
              onClick={toggleSelectAll}
              className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              {selectedIds.size === total ? t("deselect_all") : t("select_all")}
            </button>
          </div>

          <button
            onClick={onClear}
            className="text-sm text-black/50 dark:text-white/50 hover:text-white transition cursor-pointer"
          >
            {t("cancel")}
          </button>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex gap-2 items-center gap-2 justify-start">
            <button
              onClick={() => setConfirmDone(true)}
              className="
          h-10 w-10 rounded-xl
          bg-emerald-500/15 text-emerald-400
          hover:bg-emerald-500/25
          transition
        "
            >
              <span className="icon-checkmark" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="
          h-10 w-10 rounded-xl
          bg-red-500/15 text-red-400
          hover:bg-red-500/25
          transition
        "
            >
              <span className="icon-bin" />
            </button>
            <div className="h-10 ">
              <Select
                position="top-end"
                symbol="icon-flag"
                mobile={isMobile}
                value={bulkPriority}
                options={PRIORITY_OPTIONS.map((o) => ({
                  ...o,
                  label: t(o.label.toLowerCase()),
                }))}
                onChange={(p) => setBulkPriority(typeof p === "number" ? p : 1)}
              />
            </div>

            <div className="h-10 ">
              <Calendar
                date={bulkDate}
                time={bulkTime}
                setDate={setBulkDate}
                setTime={setBulkTime}
              />
            </div>

            <div className="h-10">
              <Select
                position="bottom-start"
                symbol="icon-heart-svgrepo-com"
                mobile={isMobile}
                value={bulkProjectId}
                placeholder={t("inbox")}
                options={[
                  { value: null, label: t("inbox"), icon: "icon-inbox" },
                  ...projects.map((p) => ({
                    value: p.id,
                    label: p.title,
                    color: p.color,
                  })),
                ]}
                onChange={(val) =>
                  setBulkProjectId(typeof val === "string" ? val : null)
                }
              />
            </div>

            {(bulkDate || bulkTime || bulkPriority) && (
              <button
                onClick={async () => {
                  if (bulkProjectId !== null) {
                    await Promise.all(
                      [...selectedIds].map((id) =>
                        updateTask(id, {
                          projectId: bulkProjectId,
                          sectionId: null,
                        }),
                      ),
                    );
                  }
                  onUpdateDeadline(bulkDate, bulkTime);
                  onSetPriority(bulkPriority);
                  setBulkPriority(1);
                }}
                className="
            h-10 px-4 rounded-xl 
            bg-blue-500 text-white
            hover:bg-blue-400
            text-sm font-medium
            transition
          "
              >
                <span className="icon-checkmark" />
              </button>
            )}
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title={t("delete_task_title")}
          confirmText={t("delete_now")}
          message={t("delete_tasks_message")}
          cancelText={t("cancel")}
          onConfirm={() => {
            onDelete();
            setConfirmDelete(false);
          }}
          onClose={() => setConfirmDelete(false)}
        />
      )}

      {confirmDone && (
        <ConfirmModal
          title={t("complete_tasks_title")}
          message={t("complete_tasks_message")}
          confirmText={t("confirm")}
          cancelText={t("cancel")}
          onConfirm={() => {
            onComplete();
            setConfirmDone(false);
          }}
          onClose={() => setConfirmDone(false)}
        />
      )}
    </>
  );
};
