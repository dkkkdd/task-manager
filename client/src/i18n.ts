import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { registerLocale } from "react-datepicker";
import { enUS, type Locale } from "date-fns/locale";

export const dateLocales: Record<string, Locale> = {
  en: enUS,
};

const loadLocale: Record<
  string,
  () => Promise<{ default: Locale } | Record<string, Locale>>
> = {
  uk: () => import("date-fns/locale/uk"),
  ru: () => import("date-fns/locale/ru"),
  es: () => import("date-fns/locale/es"),
  de: () => import("date-fns/locale/de"),
  pl: () => import("date-fns/locale/pl"),
  fr: () => import("date-fns/locale/fr"),
  en: () => import("date-fns/locale/en-US"),
};

export const registerDatePickerLocale = async (lang: string) => {
  const loader = loadLocale[lang];
  if (!loader) return;

  try {
    const localeModule = await loader();
    const localeData =
      (localeModule as { default: Locale }).default ||
      (Object.values(localeModule)[0] as Locale);

    if (localeData) {
      dateLocales[lang] = localeData;
      registerLocale(lang, localeData);
    }
  } catch (e) {
    console.error(`Помилка завантаження локалі date-fns для ${lang}:`, e);
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    if (i18n.language) {
      const lang = i18n.language.split("-")[0];
      registerDatePickerLocale(lang);
    }
  });

i18n.on("languageChanged", (lng) => {
  const lang = lng.split("-")[0];
  registerDatePickerLocale(lang);
});

export default i18n;
