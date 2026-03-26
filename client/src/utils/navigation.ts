export const GET_NAV_ITEMS = (t: any) =>
  [
    { id: "inbox", label: t("inbox"), icon: "icon-inbox", path: "/inbox" },
    {
      id: "today",
      label: t("today"),
      icon: "icon-calendar-_1",
      path: "/today",
    },
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
  ] as const;
