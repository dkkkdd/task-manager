import { useTranslation } from "react-i18next";
import { QuickBtn } from "@/components/Buttons/QuickBtn";
import { format, isSameDay } from "date-fns";
import { dateLocales } from "@/i18n";

interface QuickDateButtonsProps {
  dates: {
    today: Date;
    tomorrow: Date;
    weekend: Date;
    nextWeek: Date;
  };
  currentDate: string | null;
  onDateSelect: (date: Date | null) => void;
  handleClear: () => void;
  onClose?: () => void;

  variant?: "grid" | "vertical";
}

export const QuickDateButtons = ({
  dates,
  currentDate,
  onDateSelect,
  handleClear,
  onClose,
  variant = "grid",
}: QuickDateButtonsProps) => {
  const { i18n, t } = useTranslation();
  const locale = dateLocales[i18n.language];

  const dayName = format(new Date(dates.nextWeek), "EEEE", { locale });
  const nextWeekLabel = t("next_week_label", { day: dayName });
  const handleClick = (date: Date) => {
    onDateSelect(date);
    onClose?.();
  };

  const buttons = [
    {
      label: t("today"),
      icon: "icon-calendar-_2",
      color: "text-[#00c853]",
      value: dates.today,
    },
    {
      label: t("tomorrow"),
      icon: "icon-calendar-_5",
      color: "text-[#ffab00]",
      value: dates.tomorrow,
    },
    {
      label: t("this_weekend"),
      icon: "icon-calendar-_4",
      color: "text-blue-500",
      value: dates.weekend,
    },
    {
      label: nextWeekLabel,
      icon: "icon-calendar-_3",
      color: "text-[#673ab7]",
      value: dates.nextWeek,
    },
  ];

  const containerClass =
    variant === "grid"
      ? "grid grid-cols-2 gap-1"
      : "flex flex-col gap-2 overflow-x-auto px-1";

  return (
    <div className={containerClass}>
      {buttons.map((btn) => (
        <QuickBtn
          key={btn.label}
          label={btn.label}
          icon={btn.icon}
          color={btn.color}
          isActive={currentDate ? isSameDay(currentDate, btn.value) : false}
          onClick={() => handleClick(btn.value)}
        />
      ))}

      {currentDate && (
        <QuickBtn
          icon="icon-icons8-close"
          label={t("delete")}
          color="text-[#ff4444]"
          onClick={() => {
            onDateSelect(null);
            handleClear();
            onClose?.();
          }}
        />
      )}
    </div>
  );
};
