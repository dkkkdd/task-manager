import { formatDistanceToNow } from "date-fns";
import { dateLocales } from "@/i18n";
import { enUS } from "date-fns/locale";

export const formatUserDate = (date: string | Date, lang: string) => {
  const shortLang = lang.split("-")[0];
  const d = new Date(date);
  return {
    timeAgo: formatDistanceToNow(d, {
      addSuffix: true,
      locale: dateLocales[shortLang] || enUS,
    }),
    fullDate: d.toLocaleDateString(lang),
  };
};
