import { useTranslation } from "react-i18next";
import { lazy } from "react";
const Select = lazy(() => import("@/components/Select"));
import { OPTIONS } from "@/utils/projectColor";

interface FormContentProps {
  name: string;
  setName: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
}

export const FormContent = ({
  name,
  setName,
  color,
  setColor,
}: FormContentProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <input
          className="w-full rounded-xl px-4 py-3 bg-black/5 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-400 outline-none border-[0.5px] border-transparent focus:border-[#9d174d] transition-all"
          placeholder={t("project_name_placeholder")}
          value={name}
          maxLength={80}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
        <span
          className="text-[11px] px-1"
          style={{
            color:
              name.length >= 80
                ? "#ff4d4f"
                : name.length > 65
                  ? "#fa8c16"
                  : "#888",
          }}
        >
          {name.length}/80
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 px-1">
          {t("color")}
        </span>
        <Select
          position="bottom-start"
          symbol="dot"
          value={color}
          options={OPTIONS.map((o) => ({
            value: o.value,
            label: t(o.label.toLowerCase()),
            color: o.value,
          }))}
          onChange={(val) => typeof val === "string" && setColor(val)}
        />
      </div>
    </div>
  );
};
