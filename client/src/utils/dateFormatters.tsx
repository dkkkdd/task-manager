import { addDays, differenceInCalendarDays, isWeekend } from "date-fns";
import { nextSaturday, format } from "date-fns";
import type { Locale } from "date-fns";

export const formatDateLabel = (
  dateInput: Date | null,
  locale: Pick<Locale, "options" | "localize" | "formatLong">,
): string => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();
  const diff = differenceInCalendarDays(date, now);

  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";

  if (diff > 1 && diff <= 7) {
    return format(date, "EEEE", { locale });
  }

  return format(date, "d MMMM", { locale });
};

export type DateMeta = {
  color: string;
  icon: string;
};

type SpecialLabel =
  | "today"
  | "tomorrow"
  | "yesterday"
  | "weekend"
  | "next_week";

export const SPECIAL_COLORS: Record<SpecialLabel, DateMeta> = {
  today: {
    color: "rgb(0, 200, 83)",
    icon: "icon-calendar-_2",
  },
  tomorrow: {
    color: "rgb(255, 171, 0)",
    icon: "icon-calendar-_5",
  },
  yesterday: {
    color: "rgb(255, 57, 54)",
    icon: "icon-yesterday",
  },
  weekend: {
    color: "#3b82f6",
    icon: "icon-calendar-_4",
  },

  next_week: {
    color: "rgba(148, 86, 255, 1)",
    icon: "icon-calendar-_3",
  },
};

const DEFAULT_META: DateMeta = {
  color: "#ffffffd9",
  icon: "icon-calendar-_1",
};

export const dateColor = (deadline: Date | null): DateMeta => {
  if (!deadline) return DEFAULT_META;

  const now = new Date();
  const diff = differenceInCalendarDays(deadline, now);

  if (diff === 0) return SPECIAL_COLORS.today;
  if (diff === 1) return SPECIAL_COLORS.tomorrow;
  if (diff === -1) return SPECIAL_COLORS.yesterday;
  if (diff >= 0 && diff <= 8 && isWeekend(deadline)) {
    return SPECIAL_COLORS.weekend;
  }
  if (diff < 0) return SPECIAL_COLORS.yesterday;

  if (diff > 1 && diff <= 7) {
    return SPECIAL_COLORS.next_week;
  }

  return DEFAULT_META;
};

export const formatFullDate = (date: Date | null, locale: Locale) => {
  if (!date) return { label: "", time: "" };
  const diff = differenceInCalendarDays(date, new Date());

  if (diff === 0) return { label: "today", time: format(date, "HH:mm") };
  if (diff === 1) return { label: "tomorrow", time: format(date, "HH:mm") };
  if (diff === -1) return { label: "yesterday", time: format(date, "HH:mm") };

  return {
    label: format(date, "dd MMMM", { locale }),
    time: format(date, "HH:mm"),
  };
};

export const generateDatePresets = () => {
  const now = new Date();
  const nextWeekDate = addDays(now, 7);

  return {
    today: now,
    tomorrow: addDays(now, 1),
    weekend: nextSaturday(now),
    nextWeek: nextWeekDate,
  };
};
