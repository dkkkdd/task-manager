import type { UserInfoProps } from "@/types/userInfo";
import { UserInfoBase } from "@/components/User/UserInfo/UserInfoBase";

export const UserInfoDesktop = (props: UserInfoProps) => {
  const { onClose, isOpen, isSubModalOpen } = props;

  return (
    <div
      className={`fixed inset-0 pointer-events-auto z-[1000] flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 visible backdrop-blur-sm bg-black/20"
          : "opacity-0 invisible backdrop-blur-0 bg-black/0"
      }`}
      onClick={() => {
        if (!isSubModalOpen) onClose();
      }}
    >
      <div
        className={`relative z-[100] bg-white dark:bg-[#242424] w-full max-w-[450px] rounded-lg border border-black/5 dark:border-white/5 transform transition-all duration-300 ease-out p-2 shadow-2xl ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className="icon-icons8-close absolute top-3 right-3 flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-colors"
        />

        <UserInfoBase
          anchorRef={props.anchorRef}
          setOpenConfirm={props.setOpenConfirm}
          setOpenConfirmDelete={props.setOpenConfirmDelete}
          setOpenForm={props.setOpenForm}
          timeAgo={props.timeAgo}
          formattedDate={props.formattedDate}
          handleThemeChange={props.handleThemeChange}
          currentTheme={props.currentTheme}
          handleLangChange={props.handleLangChange}
        />
      </div>
    </div>
  );
};
