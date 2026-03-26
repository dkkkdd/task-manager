export const LANG_OPTIONS = [
  { value: "en", label: "English", icon: "icon-language" },
  { value: "uk", label: "Українська", icon: "icon-language" },
  { value: "ru", label: "Русский", icon: "icon-language" },
  { value: "es", label: "Español", icon: "icon-language" },
  { value: "de", label: "Deutsch", icon: "icon-language" },
  { value: "pl", label: "Polski", icon: "icon-language" },
  { value: "fr", label: "Français", icon: "icon-language" },
];
export const FILTER_OPTIONS = [
  {
    icon: "icon-list",
    value: "true",
    label: "show_all_tasks",
    color: "#4270d1",
  },
  {
    icon: "icon-list2",
    value: "false",
    label: "show_active_tasks",
    color: "#9d174d",
  },
];
export const applyTheme = (theme: string) => {
  const root = window.document.documentElement;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
};

export const THEME_OPTIONS = [
  {
    value: "light",
    label: "theme_light",
    icon: "icon-sun",
    color: "#ffab00",
  },
  {
    value: "dark",
    label: "theme_dark",
    icon: "icon-night",
    color: "#4270d1",
  },
  {
    value: "system",
    label: "theme_system",
    icon: "icon-cog",
    color: "#9e9e9e",
  },
];
