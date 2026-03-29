import { useModeStore } from "@/stores/useModesStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TaskForm from "./TaskForm/TaskForm";

const EMPTY_STATES_CONFIG = {
  inbox: {
    titleKey: "empty_states.inbox_title",
    descKey: "empty_states.inbox_desc",
    icon: "icon-price-tag",
  },
  today: {
    titleKey: "empty_states.today_title",
    descKey: "empty_states.today_desc",
    icon: "icon-calendar-_1",
  },
  overdue: {
    titleKey: "empty_states.overdue_title",
    descKey: "empty_states.overdue_desc",
    icon: "icon-history",
  },
  completed: {
    titleKey: "empty_states.completed_title",
    descKey: "empty_states.completed_desc",
    icon: "icon-checkmark",
  },
  default: {
    titleKey: "empty_states.default_title",
    descKey: "empty_states.default_desc",
    icon: "icon-heart-svgrepo-com",
  },
} as const;

export const EmptyState = () => {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const [openForm, setOpenForm] = useState(false);

  const config =
    EMPTY_STATES_CONFIG[mode as keyof typeof EMPTY_STATES_CONFIG] ||
    EMPTY_STATES_CONFIG.default;

  if (openForm) {
    return (
      <TaskForm
        openForm={openForm}
        formMode="create"
        onClose={() => setOpenForm(false)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none animate-in fade-in duration-500">
      <div className="bg-black/5 dark:bg-white/5 p-6 rounded-full mb-4">
        <span
          className={`${config.icon} text-[3em] text-[#9d174d] opacity-50`}
        />
      </div>

      <h3 className="text-xl font-semibold text-black/90 dark:text-white/90 mb-1">
        {t(config.titleKey)}
      </h3>

      <p className="text-sm text-black/40 dark:text-white/60 max-w-[200px] leading-relaxed">
        {t(config.descKey)}
      </p>

      {mode !== "completed" && mode !== "overdue" && (
        <button
          onClick={() => setOpenForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/5 mt-3 
                   hover:border-[#9d174d]/50 hover:bg-[#9d174d]/5 transition-all duration-200
                   text-[13px] text-black/40 dark:text-white/60 hover:text-[#9d174d] cursor-pointer"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
          {t("empty_states.add_first_btn")}
        </button>
      )}
    </div>
  );
};
