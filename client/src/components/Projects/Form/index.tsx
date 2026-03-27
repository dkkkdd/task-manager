import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/useIsMobile";
import { OPTIONS } from "@/utils/projectColor";
import type { Project } from "@/types/project";

import { FormContent } from "./FormContent";
import { ActionButtons } from "./ActionButtons";
import { DesktopForm } from "./DesktopForm";
import { MobileForm } from "./MobileForm";

export interface ProjectFormProps {
  mode: "create" | "edit";
  initialProject?: Project;
  open: boolean;
  onSubmit: (data: { title: string; color: string }) => void | Promise<void>;
  onClose: () => void;
}

const ProjectForm = ({
  mode,
  initialProject,
  onSubmit,
  onClose,
  open,
}: ProjectFormProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [color, setColor] = useState(OPTIONS[0]?.value ?? "#8c8c8c");

  useEffect(() => {
    if (open) {
      setName(initialProject?.title ?? "");
      setColor(initialProject?.color ?? OPTIONS[0]?.value ?? "#8c8c8c");
    }
  }, [open, initialProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ title: name, color });
    onClose();
  };

  if (!open) return null;

  const title = mode === "create" ? t("add_project") : t("edit_project");
  const children = (
    <form onSubmit={handleSubmit}>
      <FormContent
        name={name}
        setName={setName}
        color={color}
        setColor={setColor}
      />
      <ActionButtons mode={mode} disabled={!name.trim()} onClose={onClose} />
    </form>
  );

  return isMobile ? (
    <MobileForm open={open} onClose={onClose} title={title}>
      {children}
    </MobileForm>
  ) : (
    <DesktopForm onClose={onClose} title={title}>
      {children}
    </DesktopForm>
  );
};

export default ProjectForm;
