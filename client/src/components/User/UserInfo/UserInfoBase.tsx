import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { UserInfoBaseProps } from "@/types/userInfo";
import { THEME_OPTIONS, LANG_OPTIONS } from "@/utils/userSettings";
import { Select } from "@/components/Select";
import { useAuthStore } from "@/stores/useAuthStore";

export const UserInfoBase = ({
  anchorRef,
  setOpenConfirm,
  setOpenConfirmDelete,
  setOpenForm,
  timeAgo,
  formattedDate,
  handleThemeChange,
  currentTheme,
  handleLangChange,
}: UserInfoBaseProps) => {
  const user = useAuthStore((s) => s.user);
  const isSyncing = useAuthStore((s) => s.isSyncing);
  const { t, i18n } = useTranslation();

  const themeOptions = useMemo(
    () =>
      THEME_OPTIONS.map((opt) => ({
        ...opt,
        label: t(opt.label),
      })),
    [t],
  );

  const CountDisplay = ({ count }: { count: number }) => (
    <span
      className={`text-xl font-bold text-black dark:text-white transition-opacity ${isSyncing ? "opacity-30 animate-pulse" : "opacity-100"}`}
    >
      {isSyncing ? "--" : count}
    </span>
  );

  if (!user) return null;
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-[#333] rounded-lg flex items-center justify-center text-2xl font-bold text-black dark:text-white">
            {user.userName?.charAt(0).toUpperCase() ||
              user.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {user.userName || "User"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            ref={anchorRef}
            onClick={() => setOpenForm(true)}
            className="icon-pencil text-gray-400 p-3 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center">
            <span className="icon-folder-open text-[#4270d1] text-lg mb-1" />
            <CountDisplay count={user._count.projects} />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">
              {t("projects_count")}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg flex flex-col items-center">
            <span className="icon-pushpin text-[#9d174d] text-lg mb-1" />
            <CountDisplay count={user._count.tasks} />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">
              {t("active_tasks_count")}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#2a2a2a] p-3 rounded-lg flex items-center space-x-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <span className="icon-calendar text-[#4270d1]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              {t("joined")}
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-300">
              {timeAgo}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Select
            position="bottom-start"
            symbol={currentTheme === "dark" ? "icon-night" : "icon-sun"}
            value={currentTheme}
            options={themeOptions}
            onChange={handleThemeChange}
            border={false}
          />
          <Select
            position="bottom-start"
            symbol="icon-language"
            value={i18n.resolvedLanguage || null}
            options={LANG_OPTIONS}
            onChange={handleLangChange}
            border={false}
          />
        </div>

        <div className="space-y-2 mt-4">
          <button className="w-full p-3 flex items-center justify-center text-black dark:text-white bg-gray-100 dark:bg-[#333] rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-[#444] transition">
            <span className="icon-prize mr-2" />
            {t("statistics")}
          </button>

          <button
            onClick={() => setOpenConfirm(true)}
            className="w-full p-3 flex items-center justify-center bg-[#4270d1]/10 text-[#4270d1] rounded-lg font-bold hover:bg-[#4270d1] hover:text-white transition"
          >
            <span className="icon-user-minus mr-2" />
            {t("logout")}
          </button>

          <button
            onClick={() => setOpenConfirmDelete(true)}
            className="w-full p-3 flex items-center justify-center bg-[#9d174d]/10 text-[#9d174d] rounded-lg font-bold hover:bg-[#9d174d] hover:text-white transition"
          >
            <span className="icon-bin2 mr-2" />
            {t("delete_account")}
          </button>
        </div>
      </div>
    </>
  );
};
