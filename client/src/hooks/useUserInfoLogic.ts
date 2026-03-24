import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuthState } from "@/context/AuthProvider";
import { applyTheme } from "@/utils/userSettings";
import { formatUserDate } from "@/utils/userHelpers";

export type ModalType = "logout" | "delete" | "edit" | null;

export const useUserInfoLogic = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthState();
  const projectsCount = user?._count.projects;

  const anchorRef = useRef<HTMLButtonElement>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  const tasksCount = user?._count.tasks;

  const { timeAgo, formattedDate } = useMemo(
    () =>
      user?.createdAt
        ? {
            timeAgo: formatUserDate(user.createdAt, i18n.language).timeAgo,
            formattedDate: formatUserDate(user.createdAt, i18n.language)
              .fullDate,
          }
        : { timeAgo: "", formattedDate: "" },
    [user?.createdAt, i18n.language],
  );

  const handleThemeChange = (newTheme: string | number | null) => {
    if (typeof newTheme === "string") {
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    }
  };

  const handleLangChange = (lang: string | number | null) => {
    if (typeof lang === "string") i18n.changeLanguage(lang);
  };

  return {
    user,
    t,
    i18n,
    anchorRef,
    activeModal,
    setActiveModal,
    currentTheme,
    handleThemeChange,
    handleLangChange,
    projectsCount,
    tasksCount,
    timeAgo,
    formattedDate,
  };
};
