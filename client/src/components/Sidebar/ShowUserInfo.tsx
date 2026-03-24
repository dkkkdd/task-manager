import { lazy, useState } from "react";
import { UserBtn } from "../User/UserBtn";
import ModalPortal from "@/features/ModalPortal";
const UserInfo = lazy(() => import("../User/UserInfo/UserInfo"));

const ShowUserInfo = () => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  return (
    <>
      <UserBtn onClick={() => setShowUserInfo(true)} />
      {showUserInfo && (
        <ModalPortal>
          <UserInfo
            isOpen={showUserInfo}
            onClose={() => setShowUserInfo(false)}
          />
        </ModalPortal>
      )}
    </>
  );
};

export default ShowUserInfo;
