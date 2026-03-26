import { useTranslation } from "react-i18next";

interface TimeSelectorProps {
  time: string | null | undefined;
  showClearButton: boolean;
  timeOptions: Array<{ value: string; label: string }>;
  onTimeChange: (time: string) => void;
  onClearTime: () => void;
}

export const TimeSelector = ({
  time,
  showClearButton = true,
  timeOptions,

  onTimeChange,
  onClearTime,
}: TimeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-2 pt-3 border-t border-black/5 dark:border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40">
          {t("reminder")}
        </span>

        {showClearButton && time && onClearTime && (
          <button
            type="button"
            onClick={onClearTime}
            className="text-[10px] text-[#9d174d] hover:underline"
          >
            {t("remove")}
          </button>
        )}
      </div>

      <select
        value={time ?? ""}
        onChange={(e) => onTimeChange(e.target.value)}
        className="
          w-full
          rounded-xl
          px-4 py-3
          bg-black/5 dark:bg-white/5
          text-black dark:text-white
          outline-none
        "
      >
        <option value="">{t("set_time")}</option>

        {timeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
