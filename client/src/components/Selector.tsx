import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Select } from "@/components/Select";
import { Calendar } from "@/components/Calendar/Calendar";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useProjectsStore } from "@/stores/useProjectsStore";

type SelectorProps = {
  visible: boolean;
  selectedIds: Set<string>;
  total: number;
  toggleSelectAll: () => void;
  onClear: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onUpdateProject: (val: string | null) => void;
  onUpdateDeadline: (date: string | null, time: string | null) => void;
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
  onUpdateProject,
  onSetPriority,
}: SelectorProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const projects = useProjectsStore((s) => s.projects);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!visible) return null;

  const hasSelected = selectedIds.size > 0;
  const isAllSelected = selectedIds.size === total;

  return (
    <>
      <div
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          z-[1000]
          w-[calc(100%-1.5rem)] max-w-[500px] md:max-w-2xl
          rounded-3xl
          bg-white/70 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl
          border border-black/[0.08] dark:border-white/[0.08]
          shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)]
          p-2 md:p-3
          flex flex-col gap-2
          animate-in fade-in slide-in-from-bottom-8 duration-500
        "
      >
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {selectedIds.size}
            </div>
            <button
              onClick={toggleSelectAll}
              className="text-[13px] font-medium text-black/60 dark:text-white/60 hover:text-blue-500 transition-colors"
            >
              {isAllSelected ? t("deselect_all") : t("select_all")}
            </button>
          </div>

          <button
            onClick={onClear}
            className="text-[13px] font-semibold text-blue-500 hover:opacity-70 transition-opacity"
          >
            {t("cancel")}
          </button>
        </div>

        <div
          className={`
          flex items-center gap-1.5 md:gap-2 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03]
          ${!hasSelected ? "opacity-40 pointer-events-none" : "opacity-100"}
          transition-opacity duration-300
        `}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={onComplete}
              className="group h-10 w-10 flex items-center justify-center rounded-xl hover:bg-emerald-500/10 transition-all"
              title={t("complete")}
            >
              <span className="icon-checkmark text-lg text-black/40 dark:text-white/40 group-hover:text-emerald-500" />
            </button>

            <button
              onClick={() => setConfirmDelete(true)}
              className="group h-10 w-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 transition-all"
              title={t("delete")}
            >
              <span className="icon-bin text-lg text-black/40 dark:text-white/40 group-hover:text-red-500" />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1" />

          <div className="flex  items-center justify-around md:justify-start gap-1 md:gap-3">
            <Select
              value={1}
              mobile={isMobile}
              position="bottom-start"
              symbol="icon-flag"
              options={PRIORITY_OPTIONS.map((o) => ({
                ...o,
                label: t(o.label.toLowerCase()),
              }))}
              onChange={(p) => onSetPriority(Number(p))}
            />

            <Calendar
              date={null}
              setDate={(date) => onUpdateDeadline(date, null)}
            />

            <Select
              value={null}
              position="top-end"
              symbol="icon-heart-svgrepo-com"
              mobile={isMobile}
              placeholder={t("inbox")}
              options={[
                { value: null, label: t("inbox"), icon: "icon-inbox" },
                ...projects.map((p) => ({
                  value: p.id,
                  label: p.title,
                  color: p.color,
                })),
              ]}
              onChange={(val) => {
                onUpdateProject(val as string | null);
              }}
            />
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title={t("delete_task_title")}
          confirmText={t("delete_now")}
          message={t("delete_tasks_message", { count: selectedIds.size })}
          onConfirm={() => {
            onDelete();
            setConfirmDelete(false);
          }}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
};
