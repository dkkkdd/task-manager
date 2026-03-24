import type { UserInfoProps } from "@/types/UserInfo";
import { MobileDrawer } from "@/features/MobileDrawer";
import { UserInfoBase } from "@/components/User/UserInfo/UserInfoBase";

export const UserInfoMobile = ({ ...props }: UserInfoProps) => {
  return (
    <MobileDrawer
      onClose={props.onClose}
      open={props.isOpen}
      drawerTitle="Profile"
      drawerDescription="Manage your account, preferences, and view your activity."
    >
      <UserInfoBase
        anchorRef={props.anchorRef}
        setOpenConfirm={props.setOpenConfirm}
        setOpenConfirmDelete={props.setOpenConfirmDelete}
        setOpenForm={props.setOpenForm}
        projectsCount={props.projectsCount}
        tasksCount={props.tasksCount}
        timeAgo={props.timeAgo}
        formattedDate={props.formattedDate}
        handleThemeChange={props.handleThemeChange}
        currentTheme={props.currentTheme}
        handleLangChange={props.handleLangChange}
      />
    </MobileDrawer>
  );
};
