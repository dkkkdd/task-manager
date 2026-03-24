import { useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import type { UpdateUserInfoProps } from "@/types/updateUserInfo";
import { UpdateUserInfoForm } from "@/components/User/UpdateUserInfo/UpdateUserForm";

export const UpdateUserInfoDesktop = ({
  isOpen,
  onClose,
  anchorRef,
}: UpdateUserInfoProps) => {
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift({ padding: 10 })],
  });

  useEffect(() => {
    if (anchorRef.current) refs.setReference(anchorRef.current);
  }, [anchorRef, refs]);

  const { getFloatingProps } = useInteractions([
    useDismiss(context),
    useRole(context),
  ]);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={`z-[2000] transition-opacity duration-200 ${isPositioned ? "opacity-100" : "opacity-0"}`}
        >
          <div className="bg-white dark:bg-[#242424] min-w-[320px] max-w-[400px] p-6 rounded-xl border border-black/10 dark:border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <UpdateUserInfoForm onClose={onClose} />
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
