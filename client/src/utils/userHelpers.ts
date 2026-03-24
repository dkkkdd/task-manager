import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const getLocale = (lang: string) => {
  try {
    return (window as any).__locale_data?.[lang] || enUS;
  } catch {
    return enUS;
  }
};

export const formatUserDate = (
  date: string | Date,
  lang: string,
  localeObj?: any,
) => {
  const d = new Date(date);
  return {
    timeAgo: formatDistanceToNow(d, {
      addSuffix: true,
      locale: localeObj || enUS,
    }),
    fullDate: d.toLocaleDateString(lang),
  };
};
