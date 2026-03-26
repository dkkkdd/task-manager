import ModalPortal from "@/features/ModalPortal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ConfirmModal } from "@/components/ConfirmModal";
import { UpdateUserInfo } from "@/components/User/UpdateUserInfo/UpdateUserInfo";
import { UserInfoMobile } from "@/components/User/UserInfo/UserInfoMobile";
import { UserInfoDesktop } from "@/components/User/UserInfo/UserInfoDesktop";
import { useUserInfoLogic } from "@/hooks/useUserInfoLogic";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";

const UserInfo = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const logic = useUserInfoLogic();
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const deleteUser = useAuthStore((s) => s.deleteUser);

  const commonProps = {
    ...logic,
    isOpen,
    onClose,
    isSubModalOpen: !!logic.activeModal,
    setOpenForm: () => logic.setActiveModal("edit"),
    setOpenConfirm: () => logic.setActiveModal("logout"),
    setOpenConfirmDelete: () => logic.setActiveModal("delete"),
  };

  return (
    <>
      {isMobile ? (
        <UserInfoMobile {...commonProps} />
      ) : (
        <UserInfoDesktop {...commonProps} />
      )}

      {logic.activeModal === "logout" && (
        <ModalPortal>
          <ConfirmModal
            variant="warning"
            onConfirm={logoutUser}
            onClose={() => logic.setActiveModal(null)}
            title={t("logout_confirm_title")}
            message={t("logout_confirm_msg")}
          />
        </ModalPortal>
      )}

      {logic.activeModal === "delete" && (
        <ModalPortal>
          <ConfirmModal
            variant="danger"
            onConfirm={deleteUser}
            onClose={() => logic.setActiveModal(null)}
            title={t("delete_confirm_title")}
            message={t("delete_confirm_msg")}
          />
        </ModalPortal>
      )}

      <ModalPortal>
        <UpdateUserInfo
          anchorRef={logic.anchorRef}
          isOpen={logic.activeModal === "edit"}
          onClose={() => logic.setActiveModal(null)}
        />
      </ModalPortal>
    </>
  );
};
export default UserInfo;
