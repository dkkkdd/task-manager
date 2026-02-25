import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Trans, useTranslation } from "react-i18next";
import type { Task } from "@/types/tasks";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { MobileDrawer } from "@/features/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useProjectsContext } from "@/context/ProjectsContext";
import { Select } from "@/components/Select";
import { Calendar } from "@/components/Calendar/Calendar";
import { useTasksActions } from "@/context/TasksContext";
import { ConfirmModal } from "@/components/ConfirmModal";
import { TaskCard } from "@/components/Tasks/TaskCard";

export interface TaskFormProps {
  formMode: "create" | "edit";
  initiaTask?: Task;
  parentId?: string | null;
  openForm: boolean;
  onSubmit: (data: {
    title: string;
    projectId: string | null;
    deadline?: Date | null;
    reminderAt?: string | null;
    comment?: string | null;
    priority?: number;
    parentId?: string | null;
  }) => void | Promise<void>;
  onClose: () => void;
  onStartAddSubtask?: (parentId: string | null) => void;
}

export const TaskForm = ({
  formMode,
  initiaTask,
  openForm,
  parentId = null,
  onSubmit,
  onStartAddSubtask,
  onClose,
}: TaskFormProps) => {
  // if (!openForm) return null;
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { mode } = useProjectsContext();

  const { selectedProjectId, projects } = useProjectsContext();
  const [name, setName] = useState(initiaTask?.title ?? "");
  const [date, setDate] = useState(initiaTask?.deadline ?? null);
  const [time, setTime] = useState(initiaTask?.reminderAt ?? null);
  const [comment, setComment] = useState(initiaTask?.comment ?? "");
  const { deleteTask } = useTasksActions();
  const [openComfirm, setOpenConfirm] = useState(false);
  const [priority, setPriority] = useState(initiaTask?.priority ?? 1);
  const [projectId, setProjectId] = useState(selectedProjectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);
  const initialSelectedId = useRef(selectedProjectId);

  useEffect(() => {
    if (selectedProjectId !== initialSelectedId.current) {
      onClose();
    }
  }, [selectedProjectId, onClose]);

  useEffect(() => {
    if (mode === "today" && formMode === "create") {
      setDate(new Date());
    }
  }, [mode, formMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const finalDeadline = date;

      await onSubmit({
        title: name,
        projectId,
        priority,
        deadline: finalDeadline,
        reminderAt: time,
        comment: comment,
        parentId: initiaTask?.parentId || parentId,
      });

      if (formMode !== "edit") {
        setName("");
        setComment("");
        setPriority(1);
        setTime(null);

        if (mode === "today") {
          setDate(new Date());
        } else {
          setDate(null);
        }
      }
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubTask = Boolean(initiaTask?.parentId || parentId);

  return (
    <>
      {isMobile && (
        <MobileDrawer
          open={openForm}
          onClose={onClose}
          drawerDescription="Create or edit task"
          drawerTitle="Task editor"
        >
          <>
            <form
              ref={containerRef}
              onSubmit={handleSubmit}
              className="flex flex-col px-3 pt-2 pb-safe"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-black dark:text-white flex items-center gap-4">
                  {formMode === "edit" ? t("edit_task") : t("add_task")}
                  {initiaTask?.isDone ? (
                    <span className="icon-checkmark p-2 border-[1px] rounded-full text-green-900"></span>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <div className="flex-1 ">
                <input
                  // ref={titleRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("task_title_placeholder")}
                  autoFocus
                  className="
        w-full text-sm py-1.5 mb-1
        bg-transparent outline-none
        text-black dark:text-white
      "
                />

                <TextareaAutosize
                  minRows={2}
                  maxRows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("comment_placeholder")}
                  className=" w-full text-xs py-1.5 mb-2 resize-none bg-transparent outline-none text-black dark:text-white"
                />
                <div className=" flex gap-2 items-center flex-wrap pb-1">
                  <div
                    className="w-fit shrink-0"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Select
                      mobile={isMobile}
                      position="bottom-start"
                      key="priority-select"
                      symbol={"icon-flag"}
                      value={priority}
                      options={PRIORITY_OPTIONS.map((opt) => ({
                        ...opt,
                        label: t(opt.label.toLowerCase()),
                      }))}
                      onChange={(value) => {
                        if (typeof value === "number") {
                          setPriority(value);
                        }
                      }}
                    />
                  </div>

                  <div
                    className="w-fit shrink-0"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Calendar
                      time={time}
                      setTime={setTime}
                      date={date}
                      setDate={setDate}
                    />
                  </div>

                  {!isSubTask && (
                    <div
                      className="w-fit shrink-0"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <Select
                        mobile={isMobile}
                        position="bottom-start"
                        key="project-select"
                        symbol={"icon-heart-svgrepo-com"}
                        value={projectId}
                        placeholder={t("inbox")}
                        options={[
                          {
                            value: null,
                            label: t("inbox"),
                            icon: "icon-inbox",
                          },
                          ...projects.map((p) => ({
                            value: p.id,
                            label: p.title,
                            color: p.color,
                          })),
                        ]}
                        onChange={(value) => {
                          if (typeof value === "string") {
                            setProjectId(value);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="
        flex-1
        py-3
        rounded-xl
        text-gray-500 dark:text-gray-400
        bg-black/5 dark:bg-white/5"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  onMouseDown={(e) => e.preventDefault()}
                  className="
        flex-1
        py-3
        rounded-xl
        bg-[#9d174d]
        text-white
        disabled:opacity-50"
                >
                  {isSubmitting
                    ? "…"
                    : formMode === "create"
                      ? t("add_btn")
                      : t("save_btn")}
                </button>
              </div>
            </form>
            {formMode === "edit" && (
              <>
                <button
                  onClick={() => {
                    setOpenConfirm(true);
                  }}
                  className="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-[#333] cursor-pointer text-red-500 dark:text-red-400 rounded"
                >
                  <span className="icon-bin"> </span>
                  {t("delete")}
                </button>

                {formMode === "edit" &&
                  !isSubTask &&
                  initiaTask?.subtasks &&
                  initiaTask.subtasks.length > 0 && (
                    <div className="p-4 mt-1 bg-[#1a1a1a] dark:bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
                      <ul className="flex flex-col">
                        {initiaTask.subtasks.map((sub, index) => (
                          <li
                            key={sub.id}
                            className={`
            relative flex items-center
            ${index !== 0 ? "" : ""}
          `}
                          >
                            <TaskCard
                              task={sub}
                              isMobile={isMobile}
                              isEditing={false}
                              onEdit={() => {}}
                              onDeleteRequest={() => {}}
                            />
                          </li>
                        ))}
                      </ul>

                      {!isSubTask && (
                        <button
                          onClick={() =>
                            onStartAddSubtask?.(initiaTask?.id || null)
                          }
                          className="w-full flex items-center gap-3 p-4 text-white/70 hover:bg-white/5 transition-colors border-t border-white/5"
                        >
                          <span className="icon-plus-svgrepo-com-1 text-lg"></span>
                          <span className="text-[15px] font-medium">
                            {t("add_subtask")}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                {formMode === "edit" &&
                  !isSubTask &&
                  (!initiaTask?.subtasks ||
                    initiaTask.subtasks.length === 0) && (
                    <button
                      onClick={() =>
                        onStartAddSubtask?.(initiaTask?.id || null)
                      }
                      className="mx-3 mt-4 flex items-center gap-3 p-3 text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <span className="icon-plus-svgrepo-com-1 text-lg"></span>
                      <span className="text-[15px] font-medium">
                        {t("add_subtask")}
                      </span>
                    </button>
                  )}
              </>
            )}
          </>
        </MobileDrawer>
      )}

      {openForm && !isMobile && (
        <form
          ref={containerRef}
          className="bg-white dark:bg-[#1f1f1f] mt-1 relative p-5 border-[0.5px] border-black/10 dark:border-[#d0d0d05a]/60 rounded-lg shadow-xl max-w-[864px] max-h-[90vh] overflow-y-auto"
          id="task-form"
          onSubmit={handleSubmit}
        >
          <p className="text-2 text-black dark:text-white border-b border-black/10 dark:border-[#d0d0d05a]/60 mb-2 pb-2">
            {formMode === "edit" ? t("edit_task") : t("add_task")}
          </p>

          <div
            className="absolute top-4 right-4 icon-icons8-close flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-colors"
            onClick={onClose}
          ></div>

          <div>
            <label>
              <input
                // ref={titleRef}
                className="w-full bg-transparent outline-none text-black dark:text-white"
                id="task-title"
                placeholder={t("task_title_placeholder")}
                autoFocus
                value={name}
                maxLength={170}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              <TextareaAutosize
                name="comment"
                placeholder={t("comment_placeholder")}
                minRows={1}
                maxRows={10}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                className="resize-none w-full bg-transparent outline-none text-black dark:text-[#fff] text-[0.9em]"
              />
            </label>

            <div className="flex gap-2 text-[#888] text-[0.8rem] max-w-[100%] sm:max-w-[50%]">
              <div className="flex flex-col items-center gap-2">
                <Select
                  position="bottom-start"
                  key="priority-select"
                  symbol={"icon-flag"}
                  value={priority}
                  options={PRIORITY_OPTIONS.map((opt) => ({
                    ...opt,
                    label: opt.label.toLowerCase(),
                  }))}
                  onChange={(value) => {
                    if (typeof value === "number") {
                      setPriority(value);
                    }
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <Calendar
                  time={time}
                  setTime={setTime}
                  date={date}
                  setDate={setDate}
                />
              </div>

              {!isSubTask && (
                <div className="flex flex-col gap-2">
                  <Select
                    position="bottom-start"
                    key="project-select"
                    symbol={"icon-heart-svgrepo-com"}
                    value={projectId}
                    placeholder={t("inbox")}
                    options={[
                      { value: null, label: t("inbox"), icon: "icon-inbox" },
                      ...projects.map((p) => ({
                        value: p.id,
                        label: p.title,
                        color: p.color,
                      })),
                    ]}
                    onChange={(value) => {
                      if (typeof value === "string") {
                        setProjectId(value);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button
                className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </button>
              <button
                className="focus:outline-none focus:border-[#888] focus:ring-1 focus:ring-white/20 cursor-pointer px-5 py-2 bg-[#9d174d] hover:shadow-[0_0_10px_#9d174d] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white font-medium"
                type="submit"
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting
                  ? "..."
                  : formMode === "create"
                    ? t("add_btn")
                    : t("save_btn")}
              </button>
            </div>
          </div>
        </form>
      )}

      {openComfirm && (
        <ConfirmModal
          title={t("delete_task_title")}
          variant="primary"
          message={
            <Trans
              i18nKey="delete_task_message"
              values={{ title: initiaTask?.title }}
              components={{
                b: <b className="font-bold text-black dark:text-white" />,
              }}
            />
          }
          onConfirm={async () => {
            if (initiaTask?.id) {
              await deleteTask(initiaTask.id);
            }
            setOpenConfirm(false);
          }}
          onClose={() => setOpenConfirm(false)}
          confirmText={t("delete_now")}
          cancelText={t("cancel")}
        />
      )}
    </>
  );
};
