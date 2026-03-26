import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { applyTheme } from "@/utils/userSettings";
import { formatUserDate } from "@/utils/userHelpers";
import { useAuthStore } from "@/stores/useAuthStore";

export type ModalType = "logout" | "delete" | "edit" | null;

export const useUserInfoLogic = () => {
  const { i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
    anchorRef,
    activeModal,
    setActiveModal,
    currentTheme,
    handleThemeChange,
    handleLangChange,
    timeAgo,
    formattedDate,
  };
};
