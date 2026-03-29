import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useModeStore } from "@/stores/useModesStore";
import ModalPortal from "@/features/ModalPortal";

import ProjectMenu from "./ProjectMenu";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import ProjectForm from "../Form";

interface MenuState {
  anchor: HTMLElement | null;
  projectId: string | null;
}

interface ProjectMenuControllerProps {
  anchor: HTMLElement | null;
  projectId: string | null;
  setMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  closeMenu: () => void;
}
function ProjectMenuController({
  anchor,
  projectId,
  setMenu,
  closeMenu,
}: ProjectMenuControllerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);

  const project = useProjectsStore((s) =>
    s.projects.find((p) => p.id === projectId),
  );

  const toggleFavorite = useProjectsStore((s) => s.toggleFavorite);
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const setMode = useModeStore((s) => s.setMode);

  const handleCloseAll = useCallback(() => {
    setModal(null);
    setMenu({ anchor: null, projectId: null });
  }, [setMenu]);

  if (!projectId || !project) return null;

  return (
    <>
      {anchor && (
        <ProjectMenu
          anchorEl={anchor}
          isFavorite={project.favorites}
          onToggleFavorite={() =>
            toggleFavorite(project.id, !project.favorites)
          }
          onEdit={() => setModal("edit")}
          onDelete={() => setModal("delete")}
          resetMenu={handleCloseAll}
          closeMenu={closeMenu}
        />
      )}

      {modal === "delete" && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_project_title")}
            message={t("delete_project_confirm", { title: project.title })}
            confirmText={t("delete_now")}
            onConfirm={() => {
              deleteProject(project.id);
              setMode("inbox");
              navigate("/inbox");
              handleCloseAll();
            }}
            onClose={() => setModal(null)}
          />
        </ModalPortal>
      )}

      {modal === "edit" && (
        <ModalPortal>
          <ProjectForm
            mode="edit"
            initialProject={project}
            open={true}
            onSubmit={(data) => {
              updateProject(project.id, data);
              handleCloseAll();
            }}
            onClose={() => setModal(null)}
          />
        </ModalPortal>
      )}
    </>
  );
}
export default ProjectMenuController;
