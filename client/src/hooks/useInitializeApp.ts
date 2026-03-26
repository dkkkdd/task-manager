import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { applyTheme } from "@/utils/userSettings";

export const useInitializeApp = () => {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();

    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (
        localStorage.getItem("theme") === "system" ||
        !localStorage.getItem("theme")
      ) {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [initAuth]);
};
