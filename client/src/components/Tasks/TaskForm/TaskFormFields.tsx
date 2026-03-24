import TextareaAutosize from "react-textarea-autosize";
import { Select } from "@/components/Select";
import { Calendar } from "@/components/Calendar/Calendar";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";
import type { Project } from "@/types/project";
import { useProjectsStore } from "@/stores/useProjectsStore";

interface Props {
  formData: Partial<Task>;
  setFormData: (updater: (prev: Partial<Task>) => Partial<Task>) => void;
  formMode: "create" | "edit";
  isSubTask: boolean;
  titleRef: React.RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;

  onClose: () => void;
}

export const TaskFormFields = ({
  formData,
  formMode,
  setFormData,
  isSubTask,
  titleRef,
  isSubmitting,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  const handleChange = <K extends keyof Task>(field: K, value: Task[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const projects = useProjectsStore((s) => s.projects);
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-black dark:text-white flex items-center gap-4">
          {formMode === "edit" ? t("edit_task") : t("add_task")}
          {formData.isDone && (
            <span className="icon-checkmark p-2 border-[1px] rounded-full text-green-900" />
          )}
        </p>
      </div>

      <div className="flex-1">
        <input
          ref={titleRef}
          value={formData.title ?? ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={t("task_title_placeholder")}
          autoFocus
          className="w-full text-sm py-1.5 mb-1 bg-transparent outline-none text-black dark:text-white"
          maxLength={170}
        />

        <TextareaAutosize
          minRows={2}
          maxRows={5}
          value={formData.comment ?? ""}
          onChange={(e) => handleChange("comment", e.target.value)}
          placeholder={t("comment_placeholder")}
          className="w-full text-xs py-1.5 mb-2 resize-none bg-transparent outline-none text-black dark:text-white"
        />

        <div className="flex gap-2 items-center flex-wrap pb-1">
          <div
            className="w-fit shrink-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Select
              mobile={false}
              position="bottom-start"
              symbol="icon-flag"
              value={formData.priority ?? 1}
              options={PRIORITY_OPTIONS.map((opt) => ({
                ...opt,
                label: t(opt.label.toLowerCase()),
              }))}
              onChange={(value) => handleChange("priority", value as number)}
            />
          </div>

          <div
            className="w-fit shrink-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Calendar
              time={formData.reminderAt ?? null}
              setTime={(val) => handleChange("reminderAt", val)}
              date={formData.deadline ?? null}
              setDate={(val) => handleChange("deadline", val)}
            />
          </div>

          {!isSubTask && (
            <div
              className="w-fit shrink-0"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Select
                mobile={false}
                position="bottom-start"
                symbol="icon-heart-svgrepo-com"
                value={formData.projectId ?? null}
                placeholder={t("inbox")}
                options={[
                  { value: null, label: t("inbox"), icon: "icon-inbox" },
                  ...projects.map((p: Project) => ({
                    value: p.id,
                    label: p.title,
                    color: p.color,
                  })),
                ]}
                onChange={(value) =>
                  handleChange("projectId", value as string | null)
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="py-3 px-5 rounded-xl text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={!formData.title?.trim() || isSubmitting}
          className="py-3 px-5 rounded-xl bg-[#9d174d] text-white disabled:opacity-50"
        >
          {formMode === "create" ? t("add_btn") : t("save_btn")}
        </button>
      </div>
    </>
  );
};

export default TaskFormFields;
