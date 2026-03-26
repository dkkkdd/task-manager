import { useState } from "react";
import type { Project } from "@/types/project";
import { useTranslation } from "react-i18next";
import ModalPortal from "@/features/ModalPortal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ProjectForm } from "@/components/Projects/ProjectForm";
import { ProjectMenu } from "@/components/Projects/Menu/ProjectMenu";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { useModeStore } from "@/stores/useModesStore";
import { useNavigate } from "react-router-dom";

type MenuState = {
  anchor: HTMLElement | null;
  projectId: string | null;
};

interface ProjectFormData {
  title?: string;
  description?: string;
  color?: string;
}

export function ProjectMenuController({
  anchor,
  projectId,
  setMenu,
  additionalItems,
  closeMenu,
}: {
  additionalItems?: React.ReactNode;
  anchor: HTMLElement | null;
  projectId: string | null;
  setMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  closeMenu: () => void;
}) {
  const navigate = useNavigate();
  const setMode = useModeStore((s) => s.setMode);
  const projects = useProjectsStore((s) => s.projects);
  const toggleFavorite = useProjectsStore((s) => s.toggleFavorite);
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const updateProject = useProjectsStore((s) => s.updateProject);

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const project = projects.find((p: Project) => p.id === projectId);
  const isFavorite = project?.favorites;

  const onClose = () => {
    setMenu({ anchor: null, projectId: null });
  };
  if (!projectId) return null;

  return (
    <>
      {anchor && projectId && (
        <ModalPortal>
          <ProjectMenu
            anchorEl={anchor}
            // onClose={onClose}
            resetMenu={onClose}
            isFavorite={isFavorite}
            onToggleFavorite={() =>
              project && toggleFavorite(projectId, !project.favorites)
            }
            onEdit={() => setEditing(true)}
            onDelete={() => setConfirmDelete(true)}
            closeMenu={closeMenu}
            additionalItems={additionalItems}
          />
        </ModalPortal>
      )}

      {confirmDelete && project && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_project_title")}
            variant="primary"
            cancelText={t("cancel")}
            confirmText={t("delete_now")}
            message={t("delete_project_confirm", { title: project.title })}
            onConfirm={() => {
              deleteProject(project.id);
              setMode("inbox");
              navigate("/inbox");
              setConfirmDelete(false);
              onClose();
            }}
            onClose={() => setConfirmDelete(false)}
          />
        </ModalPortal>
      )}

      {project && (
        <ModalPortal>
          <ProjectForm
            mode="edit"
            initialProject={project}
            open={editing}
            onSubmit={(data: ProjectFormData) => {
              updateProject(project.id, data);
              setEditing(false);
              onClose();
            }}
            onClose={() => setEditing(false)}
          />
        </ModalPortal>
      )}
    </>
  );
}
