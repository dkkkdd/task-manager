import { useIsMobile } from "@/hooks/useIsMobile";
import type { UpdateUserInfoProps } from "@/types/updateUserInfo";
import { UpdateUserInfoDesktop } from "@/components/User/UpdateUserInfo/UpdateUserInfoDesktop";
import { UpdateUserInfoMobile } from "@/components/User/UpdateUserInfo/UpdateUserInfoMobile";

export const UpdateUserInfo = (props: UpdateUserInfoProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <UpdateUserInfoMobile {...props} />
  ) : (
    <UpdateUserInfoDesktop {...props} />
  );
};
