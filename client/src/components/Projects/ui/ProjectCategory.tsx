import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProjectsList from "./ProjectsList";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { CollapsibleSection } from "@/features/CollapsibleSection";

interface ProjectCategoryProps {
  type: "favorites" | "all";
  titleKey: string;
  action?: React.ReactNode;
}

const ProjectCategory = ({ type, titleKey, action }: ProjectCategoryProps) => {
  const { t } = useTranslation();
  const projects = useProjectsStore((s) => s.projects);

  const filteredProjects = useMemo(() => {
    return type === "favorites"
      ? projects.filter((p) => p.favorites)
      : projects;
  }, [projects, type]);

  return (
    <CollapsibleSection
      title={t(titleKey)}
      isEmpty={filteredProjects.length === 0}
      action={action}
    >
      <ProjectsList projects={filteredProjects} />
    </CollapsibleSection>
  );
};

export default ProjectCategory;
