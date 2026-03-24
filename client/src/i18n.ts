import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale";

// Реєстр для динамічно завантажених об'єктів локалей (для використання в компонентах)
export const dateLocales: Record<string, any> = {
  en: enUS,
};

// Карта функцій завантаження для Vite (Code Splitting)
const loadLocale: Record<string, () => Promise<any>> = {
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

    // date-fns v3/v4 використовує іменовані експорти, тому беремо перший доступний об'єкт
    const localeData =
      (localeModule as any).default || Object.values(localeModule)[0];

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
      // Шлях до ваших JSON файлів у папці public
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
    // Ініціалізація локалі при першому запуску
    if (i18n.language) {
      const lang = i18n.language.split("-")[0];
      registerDatePickerLocale(lang);
    }
  });

// Слухач зміни мови
i18n.on("languageChanged", (lng) => {
  const lang = lng.split("-")[0];
  registerDatePickerLocale(lang);
});

export default i18n;
