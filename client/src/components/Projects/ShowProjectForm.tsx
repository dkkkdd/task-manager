import { useState } from "react";
import { ModalPortal } from "@/features/ModalPortal";
import { ProjectForm } from "./ProjectForm";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useNavigate } from "react-router-dom";
import { useModeStore } from "@/stores/useModesStore";

const ShowProjectForm = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const openProject = useModeStore((s) => s.openProject);
  const createProject = useProjectsStore((s) => s.createProject);

  const handleSubmit = async ({
    title,
    color,
  }: {
    title: string;
    color: string;
  }) => {
    try {
      setShowForm(false);

      const newProject = await createProject(title, color, false);
      console.log("createProject returned ->", newProject);
      console.log("store projects ->", useProjectsStore.getState().projects);

      if (!newProject) return;

      openProject(newProject.id);
      navigate(`/project/${newProject.id}`);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div
        className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
        onClick={() => setShowForm(true)}
      >
        <span className="icon-icons8-close text-lg rotate-45 text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"></span>
      </div>
      <ModalPortal>
        <ProjectForm
          mode="create"
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      </ModalPortal>
    </>
  );
};

export default ShowProjectForm;
