import { useTranslation } from "react-i18next";

interface ActionButtonsProps {
  mode: "create" | "edit";
  disabled: boolean;
  onClose: () => void;
}

export const ActionButtons = ({
  mode,
  disabled,
  onClose,
}: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-3 rounded-xl text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        {t("cancel")}
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="px-6 py-3 rounded-xl bg-[#9d174d] text-white font-medium hover:bg-[#861442] disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
      >
        {mode === "create" ? t("add_btn") : t("save_btn")}
      </button>
    </div>
  );
};
