import type { UpdateUserInfoProps } from "@/types/updateUserInfo";
import { MobileDrawer } from "@/features/MobileDrawer";
import { UpdateUserInfoForm } from "@/components/User/UpdateUserInfo/UpdateUserForm";

export const UpdateUserInfoMobile = ({
  isOpen,
  onClose,
}: UpdateUserInfoProps) => {
  return (
    <MobileDrawer
      isNested={true}
      onClose={onClose}
      open={isOpen}
      drawerDescription="Edit profile"
      drawerTitle="Update your name, email, and personal details."
    >
      <div className="px-3 pt-2 pb-safe flex flex-col gap-4">
        <UpdateUserInfoForm onClose={onClose} />
      </div>
    </MobileDrawer>
  );
};
