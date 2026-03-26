import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/types/project";
import { MobileDrawer } from "@/features/MobileDrawer";
import { OPTIONS } from "@/utils/projectColor";
import { Select, type Option } from "@/components/Select";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface ProjectFormProps {
  mode: "create" | "edit";
  initialProject?: Project;
  open: boolean;
  onSubmit: (data: { title: string; color: string }) => void | Promise<void>;
  onClose: () => void;
}

export const ProjectForm = ({
  mode,
  initialProject,
  onSubmit,
  onClose,
  open,
}: ProjectFormProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState(initialProject?.title ?? "");
  const [color, setColor] = useState(
    initialProject?.color ?? OPTIONS[0]?.value ?? "#8c8c8c",
  );
  function handleClear() {
    setColor("#8c8c8c");
    setName("");
  }

  const { t } = useTranslation();
  // const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await onSubmit({ title: name, color });
      onClose();
      handleClear();
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  const count = name.length;

  return (
    <>
      <MobileDrawer
        isNested={false}
        open={open && isMobile}
        onClose={onClose}
        drawerDescription="Create or edit project"
        drawerTitle="Project editor"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              {mode === "create" ? t("add_project") : t("edit_project")}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <input
              className="
        w-full
        rounded-xl
        px-4 py-3
        bg-black/5 dark:bg-white/5
        text-black dark:text-white
        placeholder:text-gray-400
        outline-none
      "
              placeholder={t("project_name_placeholder")}
              value={name}
              maxLength={80}
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />

            <span
              className="text-[11px]"
              style={{
                color:
                  name.length === 80
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("color")}
            </span>

            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="
        w-full
        rounded-xl
        px-4 py-3
        bg-black/5 dark:bg-white/5
        text-black dark:text-white
        outline-none
      "
            >
              {OPTIONS.map((o: Option) => (
                <option key={o.value} value={o.value || undefined}>
                  {t(o.label.toLowerCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
        flex-1
        py-3
        rounded-xl
        text-gray-500 dark:text-gray-400
        bg-black/5 dark:bg-white/5
      "
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="
        flex-1
        py-3
        rounded-xl
        bg-[#9d174d]
        text-white
        disabled:opacity-50
      "
            >
              {mode === "create" ? t("add_btn") : t("save_btn")}
            </button>
          </div>
        </form>
      </MobileDrawer>

      {!isMobile && open && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full w-fit !max-w-[40em] bg-[#eee] dark:bg-[#242424] p-5 rounded-lg shadow-xl"
          >
            <h2 className="text-2 text-black dark:text-white border-b border-black/10 dark:border-[#d0d0d05a]/60 mb-2 pb-2">
              {mode === "create" ? t("add_project") : t("edit_project")}
            </h2>

            <div
              className="absolute top-5 right-5 tip icon-icons8-close text-xl cursor-pointer text-gray-500 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-md p-1"
              onClick={onClose}
            />

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1.5">
                <input
                  className="w-full bg-transparent p-2 h-auto border-[0.5px] border-black/20 dark:border-[#d0d0d05a]/60 outline-none rounded-lg text-black dark:text-white block box-border placeholder:text-black-60"
                  id="project-title"
                  placeholder={t("project_name_placeholder")}
                  autoFocus
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                />
                <span
                  className="text-[11px] self-start"
                  style={{
                    color:
                      count === 80
                        ? "#ff4d4f"
                        : count > 65
                          ? "#fa8c16"
                          : "#888",
                  }}
                >
                  {count}/80
                </span>
              </div>

              <div className="flex flex-col gap-2 items-start text-sm text-gray-500 dark:text-[#888]">
                {t("color")}
                <Select
                  position="bottom-start"
                  symbol="dot"
                  value={color}
                  options={OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label.toLowerCase(),
                    color: o.value,
                  }))}
                  onChange={(value) => {
                    if (typeof value === "string") {
                      setColor(value);
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="cursor-pointer px-6 py-2 bg-[#9d174d] hover:shadow-[0_0_10px_#9d174d] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white transition-all"
                >
                  {mode === "create" ? t("add_btn") : t("save_btn")}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
