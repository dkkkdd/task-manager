import { useTranslation } from "react-i18next";
import type { TaskMode } from "@/types/navigation";
import { useModeStore } from "@/stores/useModesStore";
import { Link } from "react-router-dom";

export const SidebarNavigation = () => {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);

  const setMode = useModeStore((s) => s.setMode);

  const NAV_ITEMS = [
    { id: "inbox", label: t("inbox"), icon: "icon-inbox" },
    { id: "today", label: t("today"), icon: "icon-calendar-_1" },
    { id: "completed", label: t("completed"), icon: "icon-checkmark" },
    { id: "overdue", label: t("overdue"), icon: "icon-history" },
  ] as const;

  return NAV_ITEMS.map((nav) => {
    return (
      <Link
        key={nav.id}
        onClick={() => setMode(nav.id as TaskMode)}
        to={`/${nav.id}`}
        className={`text-[14px] ${mode === nav.id ? "bg-[#9d174d]/15 text-[#9d174d] dark:text-white" : "text-gray-700 dark:text-white/70"} flex items-center gap-3 p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-[#363636] w-full rounded-lg m-0`}
      >
        <span className={nav.icon} />
        {nav.label}
      </Link>
    );
  });
};

// import { useTranslation } from "react-i18next";

// import { useModeStore } from "@/stores/useModesStore";
// import { Link } from "react-router-dom";
// export type TaskMode =
//   | "project"
//   | "inbox"
//   | "today"
//   | "completed"
//   | "overdue"
//   | "projects";
// export const SidebarNavigation = () => {
//   const { t } = useTranslation();
//   const mode = useModeStore((s) => s.mode);

//   const setMode = useModeStore((s) => s.setMode);

//   const NAV_ITEMS = [
//     { id: "inbox", label: t("inbox"), icon: "icon-inbox" },
//     { id: "today", label: t("today"), icon: "icon-calendar-_1" },
//     { id: "completed", label: t("completed"), icon: "icon-checkmark" },
//     { id: "overdue", label: t("overdue"), icon: "icon-history" },
//   ] as const;

//   return NAV_ITEMS.map((nav) => {
//     return (
//       <Link
//         key={nav.id}
//         onClick={() => setMode(nav.id as TaskMode)}
//         to={`/${nav.id}`}
//         className={`text-[14px] ${mode === nav.id ? "bg-[#9d174d]/15 text-[#9d174d] dark:text-white" : "text-gray-700 dark:text-white/70"} flex items-center gap-3 p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-[#363636] w-full rounded-lg m-0`}
//       >
//         <span className={nav.icon} />
//         {nav.label}
//       </Link>
//     );
//   });
// };
