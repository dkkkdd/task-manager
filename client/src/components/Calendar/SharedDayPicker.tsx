import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { startOfDay } from "date-fns";
import { useTranslation } from "react-i18next";
import { dateLocales } from "@/i18n";
import { enUS } from "date-fns/locale";

import "react-day-picker/dist/style.css";

interface SharedDayPickerProps {
  selected: string | null;
  onSelect: (day: Date | undefined) => void;
  toDate?: Date;
  variant?: "desktop" | "mobile";
  hideCaption?: boolean;
}

export const SharedDayPicker = ({
  selected,
  onSelect,
  toDate,
  variant = "desktop",
  hideCaption = false,
}: SharedDayPickerProps) => {
  const { i18n } = useTranslation();

  const currentLocale = useMemo(
    () => dateLocales[i18n.language] || enUS,
    [i18n.language],
  );

  const today = startOfDay(new Date());

  const wrapperClass = variant === "desktop" ? "w-full" : "w-fit text-sm";

  return (
    <DayPicker
      locale={currentLocale}
      lang={i18n.language}
      mode="single"
      selected={selected ? new Date(selected) : undefined}
      onSelect={onSelect}
      showOutsideDays
      disabled={{ before: today }}
      toDate={toDate}
      className={`
        ${wrapperClass}

        rounded-2xl p-4 shadow-sm
        bg-white text-gray-900
        dark:bg-[#242424] dark:text-white

        ${hideCaption ? "[&_.rdp-caption]:hidden" : ""}
        
        [&_.rdp-caption_label]:text-gray-900
        dark:[&_.rdp-caption_label]:text-white
        [&_.rdp-caption_label]:font-semibold

        [&_.rdp-day]:rounded-full
        [&_.rdp-day]:transition
        [&_.rdp-day]:text-gray-900
        dark:[&_.rdp-day]:text-white

        [&_.rdp-day:hover]:bg-gray-100
        dark:[&_.rdp-day:hover]:bg-white/10

        [&_.rdp-day_selected]:bg-pink-500
        [&_.rdp-day_selected]:text-white
        [&_.rdp-day_selected:hover]:bg-pink-500

        [&_.rdp-day_today]:border
        [&_.rdp-day_today]:border-pink-500
        [&_.rdp-day_today]:text-pink-500

        [&_.rdp-day_disabled]:text-gray-300
        dark:[&_.rdp-day_disabled]:text-white/20
        [&_.rdp-day_disabled]:cursor-not-allowed

        [&_.rdp-day_outside]:text-gray-300
        dark:[&_.rdp-day_outside]:text-white/20
      `}
    />
  );
};
