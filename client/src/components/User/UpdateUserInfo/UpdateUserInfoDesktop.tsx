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
    onOpenChange: (open) => {
      if (!open) onClose();
    },
    whileElementsMounted: autoUpdate,
    placement: "bottom",
    middleware: [offset(4), flip(), shift()],
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: "click",
    outsidePress: (event) => {
      event.stopPropagation();
      event.preventDefault();
      return true;
    },
  });

  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);
  useEffect(() => {
    if (anchorRef.current) {
      refs.setReference(anchorRef.current);
    }
  }, [anchorRef, refs]);
  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 2000,
              opacity: isPositioned ? 1 : 0,
              visibility: isPositioned ? "visible" : "hidden",
            }}
            {...getFloatingProps()}
            className="transition-opacity duration-200"
          >
            <div className="bg-white dark:bg-[#242424] w-full min-w-[320px] max-w-[400px] p-6 rounded-lg border border-black/10 dark:border-white/5 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
              <UpdateUserInfoForm onClose={onClose} />
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
