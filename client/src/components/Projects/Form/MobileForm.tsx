import { MobileDrawer } from "@/features/MobileDrawer";

export const MobileForm = ({
  children,
  open,
  onClose,
  title,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
}) => {
  return (
    <MobileDrawer
      open={open}
      onClose={onClose}
      drawerTitle={title}
      drawerDescription="Project editor"
      isNested={false}
    >
      <div className="pt-2 pb-6">{children}</div>
    </MobileDrawer>
  );
};
