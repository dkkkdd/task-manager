import { useTranslation } from "react-i18next";
import { useUpdateUserForm } from "@/hooks/useUpdateUserForm";
import { FloatingLabelInput } from "./FloatingLabelInput";

export const UpdateUserInfoForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { formData, handleChange, handleSubmit } = useUpdateUserForm(onClose);

  return (
    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2 className="font-semibold text-black dark:text-white border-b border-black/10 dark:border-white/10 mb-4 pb-2">
        {t("update_profile")}
      </h2>

      <div className="flex flex-col gap-5 mt-4">
        <FloatingLabelInput
          label={t("your_name")}
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
          autoFocus
        />
        <FloatingLabelInput
          label={t("email_label")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex gap-3 mt-8 justify-end">
        <button type="button" onClick={onClose} className="btn-secondary">
          {t("cancel")}
        </button>
        <button type="submit" className="btn-primary-pink">
          {t("save_changes")}
        </button>
      </div>
    </form>
  );
};
