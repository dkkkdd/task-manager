import { lazy, memo, useState } from "react";
import { AddTaskBtn } from "../Buttons/AddTaskBtn";
const TaskForm = lazy(() => import("./TaskForm/TaskForm"));
import { useIsMobile } from "@/hooks/useIsMobile";

export const AddTaskSection = memo(function AddTaskSection() {
  const isMobile = useIsMobile();
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      {!openForm && (
        <div className="fixed bottom-[10%] md:static">
          <AddTaskBtn
            showText={!isMobile}
            onOpenForm={() => setOpenForm(true)}
          />
        </div>
      )}

      <TaskForm
        openForm={openForm}
        formMode="create"
        onClose={() => setOpenForm(false)}
      />
    </>
  );
});
