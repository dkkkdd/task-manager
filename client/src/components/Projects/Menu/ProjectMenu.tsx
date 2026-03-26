import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@/components/Projects/Menu/MenuItem";

interface ProjectMenuProps {
  anchorEl: HTMLElement | null;
  resetMenu: () => void;
  isFavorite: boolean | undefined;
  onToggleFavorite: () => void;
  onEdit: () => void;
  closeMenu: () => void;
  onDelete: () => void;
  additionalItems?: React.ReactNode;
}

export function ProjectMenu({
  anchorEl,
  resetMenu,
  closeMenu,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,

  additionalItems,
}: ProjectMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const { t } = useTranslation();
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: Boolean(anchorEl),
    onOpenChange: (open) => !open && resetMenu(),
    elements: { reference: anchorEl },
    whileElementsMounted: autoUpdate,
    placement: "right-start",
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

  const role = useRole(context, { role: "menu" });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    role,
    listNavigation,
  ]);

  if (!anchorEl) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <ul
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          role="menu"
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? "visible" : "hidden",
          }}
          {...getFloatingProps()}
          className="transition-opacity duration-200 z-[999] pointer-events-auto min-w-[20em] max-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none shadow-black/5 dark:shadow-black/40"
        >
          <MenuItem
            ref={(el) => {
              listRef.current[0] = el;
            }}
            active={activeIndex === 0}
            icon="icon-pencil"
            {...getItemProps({
              onClick: () => {
                onEdit();
                closeMenu();
              },
            })}
          >
            {t("edit")}
          </MenuItem>

          <MenuItem
            ref={(el) => {
              listRef.current[1] = el;
            }}
            active={activeIndex === 1}
            icon="icon-bookmark"
            {...getItemProps({
              onClick: () => {
                onToggleFavorite();
                resetMenu();
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  onEdit();
                  closeMenu();
                }
              },
            })}
          >
            {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
          </MenuItem>

          <MenuItem
            ref={(el) => {
              listRef.current[2] = el;
            }}
            active={activeIndex === 2}
            icon="icon-stats-bars"
            {...getItemProps({ onClick: resetMenu })}
          >
            {t("activity_log")}
          </MenuItem>

          {additionalItems && (
            <div className="border-t border-black/5 dark:border-white/5 my-1 mx-1" />
          )}
          {additionalItems}

          <MenuItem
            ref={(el) => {
              listRef.current[3] = el;
            }}
            active={activeIndex === 3}
            icon="icon-bin"
            variant="danger"
            {...getItemProps({
              onClick: () => {
                onDelete();

                closeMenu();
              },
            })}
          >
            {t("delete")}
          </MenuItem>
        </ul>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
