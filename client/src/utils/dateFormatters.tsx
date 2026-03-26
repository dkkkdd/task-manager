import {
  addDays,
  differenceInCalendarDays,
  isWeekend,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  endOfDay,
  isValid,
  nextSaturday,
  format,
} from "date-fns";

import type { Locale } from "date-fns";

export const formatDateLabel = (
  dateInput: Date | null,
  locale: Pick<Locale, "options" | "localize" | "formatLong">,
): string => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();
  const diff = differenceInCalendarDays(date, now);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";

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
    icon: "icon-calendar-_4",
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
  if (isBefore(deadline, now)) {
    return SPECIAL_COLORS.yesterday;
  }

  const diff = differenceInCalendarDays(deadline, now);

  if (diff === 0) return SPECIAL_COLORS.today;
  if (diff === 1) return SPECIAL_COLORS.tomorrow;
  if (diff >= 0 && diff <= 8 && isWeekend(deadline)) {
    return SPECIAL_COLORS.weekend;
  }

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

  const toEndOfDay = (d: Date) => {
    const newDate = new Date(d);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  return {
    today: toEndOfDay(now),
    tomorrow: toEndOfDay(addDays(now, 1)),
    weekend: toEndOfDay(nextSaturday(now)),
    nextWeek: toEndOfDay(addDays(now, 7)),
  };
};

export const combineDateAndTime = (
  date: Date | string | null,
  time: string | null,
): string | null => {
  if (!date) return null;

  const dateObj = new Date(date);

  if (!isValid(dateObj)) return null;

  if (!time || time.trim() === "") {
    return endOfDay(dateObj).toISOString();
  }

  const [hours, minutes] = time.split(":").map(Number);

  let combined = setHours(dateObj, hours);
  combined = setMinutes(combined, minutes);
  combined = setSeconds(combined, 0);

  return combined.toISOString();
};

export const getTimeFromISO = (
  isoString: string | null | undefined,
): string | null => {
  if (!isoString) return null;
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return null;

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const isDateToday = (dateStr: string | null) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};
