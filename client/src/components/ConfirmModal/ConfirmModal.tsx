import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}
const variantStyles = {
  danger: "bg-[#9d174d] hover:shadow-[0_0_15px_rgba(157,23,77,0.4)]",
  primary: "bg-[#4270d1] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
  warning: "bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]",
};
export const ConfirmModal = ({
  onConfirm,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-[15%] z-[1200] pointer-events-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#222] w-full max-w-[400px] p-6 rounded-lg border border-black/5 dark:border-white/5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-black dark:text-white border-b border-black/5 dark:border-white/10 pb-3">
          {title}
        </h2>

        <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {message ||
            t("confirm_proceed_msg", "Are you sure you want to proceed?")}
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            disabled={isLoading}
            className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            {cancelText || t("cancel")}
          </button>

          <button
            disabled={isLoading}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className={`
              cursor-pointer px-6 py-2.5 text-sm font-bold rounded-lg text-white transition-all 
              active:scale-95 disabled:opacity-50 disabled:pointer-events-none
              ${variantStyles[variant]}
            `}
          >
            {isLoading
              ? t("processing", "...")
              : confirmText || t("confirm", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};
