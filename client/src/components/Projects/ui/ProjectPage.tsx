import ProjectCategory from "./ProjectCategory";
import ShowProjectForm from "../Form/ShowProjectForm";
import { useState } from "react";
import { UserBtn } from "@/components/User/UserBtn";
import UserInfo from "@/components/User/UserInfo/UserInfo";

const ProjectPage = () => {
  const [openUserInfo, setOpenUserInfo] = useState(false);
  return (
    <div className="py-5 px-4 space-y-4">
      <UserBtn onClick={() => setOpenUserInfo(true)} />
      <UserInfo isOpen={openUserInfo} onClose={() => setOpenUserInfo(false)} />
      <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323]">
        <ProjectCategory type="favorites" titleKey="favorite_projects" />
      </div>
      <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323]">
        <ProjectCategory
          type="all"
          titleKey="projects_count"
          action={<ShowProjectForm />}
        />
      </div>
    </div>
  );
};
export default ProjectPage;
