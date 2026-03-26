import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function MobileDrawer({
  open,
  onClose,
  children,
  drawerTitle,
  isNested,
  drawerDescription,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  drawerTitle: string;
  isNested: boolean;
  drawerDescription: string;
}) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onClose}
      shouldScaleBackground
      nested={isNested}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[1000]" />

        <Drawer.Content
          data-drawer-content
          className="
            fixed inset-x-0 bottom-0 z-[1001]
            bg-white dark:bg-[#1f1f1f]
            rounded-t-[32px]
            max-h-[90dvh]
            flex flex-col
            focus:outline-none
          "
        >
          <VisuallyHidden>
            <Drawer.Title>{drawerTitle}</Drawer.Title>
            <Drawer.Description>{drawerDescription}</Drawer.Description>
          </VisuallyHidden>

          <Drawer.Handle className="mx-auto my-3 h-1.5 w-14 rounded-full bg-black/20 dark:bg-white/20" />

          <div className="flex-1 overflow-y-auto px-6 pb-12 overscroll-contain">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
