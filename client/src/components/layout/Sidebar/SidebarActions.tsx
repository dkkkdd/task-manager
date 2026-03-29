import { lazy, useState, Suspense } from "react";
import { AddTaskBtn } from "@/components/Buttons/AddTaskBtn";
import { UserBtn } from "@/components/Buttons/UserBtn";
import ModalPortal from "@/features/ModalPortal";

const TaskForm = lazy(() => import("@/components/Tasks/TaskForm/TaskForm"));
const UserInfo = lazy(() => import("@/components/User/UserInfo/UserInfo"));

export const SidebarActions = () => {
  const [activeModal, setActiveModal] = useState<"task" | "user" | null>(null);

  const close = () => setActiveModal(null);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <UserBtn onClick={() => setActiveModal("user")} />

      <div className="pl-[5px]">
        <AddTaskBtn onOpenForm={() => setActiveModal("task")} />
      </div>

      {activeModal && (
        <ModalPortal>
          <Suspense fallback={null}>
            {activeModal === "user" && (
              <UserInfo isOpen={true} onClose={close} />
            )}

            {activeModal === "task" && (
              <div
                className="fixed inset-0 px-5 pt-[10%] md:pl-[20%] z-[999]"
                onClick={close}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <TaskForm openForm={true} formMode="create" onClose={close} />
                </div>
              </div>
            )}
          </Suspense>
        </ModalPortal>
      )}
    </div>
  );
};
