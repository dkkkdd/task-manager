import type { TaskMode } from "@/types/navigation";

type TFunction = (key: string) => string;

interface NavItem {
  id: TaskMode;
  label: string;
  icon: string;
  path: string;
}

export const GET_NAV_ITEMS = (t: TFunction): readonly NavItem[] => [
  { id: "inbox", label: t("inbox"), icon: "icon-inbox", path: "/inbox" },
  { id: "today", label: t("today"), icon: "icon-calendar-_1", path: "/today" },
  {
    id: "completed",
    label: t("completed"),
    icon: "icon-checkmark",
    path: "/completed",
  },
  {
    id: "overdue",
    label: t("overdue"),
    icon: "icon-history",
    path: "/overdue",
  },
];

export function getModeFromPath(): {
  mode: TaskMode;
  selectedProjectId: string | null;
} {
  const path = window.location.pathname;

  if (path.startsWith("/project/")) {
    return { mode: "project", selectedProjectId: path.split("/project/")[1] };
  }
  if (path === "/today") return { mode: "today", selectedProjectId: null };
  if (path === "/completed")
    return { mode: "completed", selectedProjectId: null };
  if (path === "/overdue") return { mode: "overdue", selectedProjectId: null };
  if (path === "/projects")
    return { mode: "projects", selectedProjectId: null };
  return { mode: "inbox", selectedProjectId: null };
}
