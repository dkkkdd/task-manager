import { useCallback, useState } from "react";
import { AddTaskBtn } from "../AddTaskBtn";
import { ModalPortal } from "@/features/ModalPortal";
import { TaskForm } from "../Tasks/TaskForm";

const OpenForm = () => {
  const [openForm, setOpenForm] = useState(false);
  const openFormClick = useCallback(() => {
    setOpenForm(true);
  }, []);

  const closeFormClick = useCallback(() => {
    setOpenForm(false);
  }, []);
  if (!openForm) return;
  return (
    <>
      <div className="flex flex-col items-start justify-center pl-[5px] mb-2">
        <AddTaskBtn onOpenForm={openFormClick} />
      </div>
      {openForm && (
        <ModalPortal>
          <div
            className="fixed inset-0 px-5 pt-[10%] pl-[20%] z-[999] "
            onClick={closeFormClick}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <TaskForm
                openForm={openForm}
                formMode="create"
                onClose={closeFormClick}
              />
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default OpenForm;
