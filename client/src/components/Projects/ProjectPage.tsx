import { lazy, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProjectsSection } from "@/components/Projects/ProjectSection";
import FavoriteProjects from "@/components/Projects/FavoriteProjectsSection";
const UserInfo = lazy(() => import("@/components/User/UserInfo/UserInfo"));
import ModalPortal from "@/features/ModalPortal";
import { UserBtn } from "@/components/User/UserBtn";

export const ProjectPage = () => {
  const isMobile = useIsMobile();
  const [showUserInfo, setShowUserInfo] = useState(false);
  return (
    <>
      {showUserInfo && (
        <ModalPortal>
          <UserInfo
            isOpen={showUserInfo}
            onClose={() => setShowUserInfo(false)}
          />
        </ModalPortal>
      )}

      <div className="py-5">
        <UserBtn
          onClick={() => {
            setShowUserInfo(true);
            (document.activeElement as HTMLElement)?.blur();
          }}
        />
        {isMobile && (
          <UserInfo
            onClose={() => setShowUserInfo(false)}
            isOpen={showUserInfo}
          />
        )}
        <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323] mb-5">
          <FavoriteProjects />
        </div>
        <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323]">
          <ProjectsSection />
        </div>
      </div>
    </>
  );
};
