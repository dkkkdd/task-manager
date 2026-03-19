import { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { localeMap } from "@/i18n";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Task } from "@/types/tasks";
import { ModalPortal } from "@/features/ModalPortal";
import { applyTheme } from "@/utils/userSettings";
import { useAuthState, useAuthActions } from "@/context/AuthProvider";

import { useIsMobile } from "@/hooks/useIsMobile";
import { ConfirmModal } from "@/components/ConfirmModal";
import { UpdateUserInfo } from "@/components/User/UpdateUserInfo/UpdateUserInfo";
import { UserInfoMobile } from "@/components/User/UserInfo/UserInfoMobile";
import { UserInfoDesktop } from "@/components/User/UserInfo/UserInfoDesktop";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useTasksStore } from "@/stores/useTasksStore";

export const UserInfo = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const isMobile = useIsMobile();
  const { t, i18n: i18nInstance } = useTranslation();
  const { logoutUser, deleteUser } = useAuthActions();
  const { user } = useAuthState();
  const projects = useProjectsStore((t) => t.projects);
  const tasks = useTasksStore((s) => s.tasks);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "system",
  );
  const [openComfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openComfirmDelete, setOpenConfirmDelete] = useState(false);

  const currentLocale = useMemo(
    () => localeMap[i18nInstance.language] || enUS,
    [i18nInstance.language],
  );

  const projectsCount = projects.length || 0;
  const isSubModalOpen = openComfirm || openComfirmDelete || openForm;
  const safeTasks = tasks === null ? [] : tasks;
  const undoneTasksCount = useMemo(
    () => safeTasks.filter((t: Task) => !t.isDone).length,
    [tasks],
  );

  const timeAgo = useMemo(
    () =>
      user?.createdAt
        ? formatDistanceToNow(new Date(user.createdAt), {
            addSuffix: true,
            locale: currentLocale,
          })
        : "",
    [user, currentLocale],
  );

  const formattedDate = useMemo(
    () =>
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(i18nInstance.language)
        : "",
    [user, i18nInstance.language],
  );

  const handleLangChange = (langValue: string | number | null) => {
    if (typeof langValue === "string") i18nInstance.changeLanguage(langValue);
  };

  const handleThemeChange = (newTheme: string | number | null) => {
    if (typeof newTheme === "string") {
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    }
  };

  const props = {
    onClose,
    isOpen,
    isSubModalOpen,
    openComfirmDelete,
    setOpenConfirm,
    setOpenForm,
    setOpenConfirmDelete,
    anchorRef,
    projectsCount,
    undoneTasksCount,
    timeAgo,
    formattedDate,
    handleThemeChange,
    handleLangChange,
    currentTheme,
  };

  if (!user) return null;
  return (
    <>
      {isMobile ? (
        <UserInfoMobile {...props} />
      ) : (
        <UserInfoDesktop {...props} />
      )}
      {openComfirm && (
        <ModalPortal>
          <ConfirmModal
            title={t("logout_confirm_title")}
            message={t("logout_confirm_msg")}
            variant="warning"
            cancelText={t("cancel")}
            confirmText={t("logout")}
            onConfirm={logoutUser}
            onClose={() => setOpenConfirm(false)}
          />
        </ModalPortal>
      )}

      {openComfirmDelete && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_confirm_title")}
            message={t("delete_confirm_msg")}
            variant="danger"
            cancelText={t("cancel")}
            confirmText={t("confirm_delete_btn")}
            onConfirm={() => deleteUser()}
            onClose={() => setOpenConfirmDelete(false)}
          />
        </ModalPortal>
      )}

      <ModalPortal>
        <UpdateUserInfo
          anchorRef={anchorRef}
          isOpen={openForm}
          onClose={() => setOpenForm(false)}
        />
      </ModalPortal>
    </>
  );
};
