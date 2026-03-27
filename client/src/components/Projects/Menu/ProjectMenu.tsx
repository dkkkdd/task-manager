import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useListNavigation,
  useTypeahead,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@/components/Projects/Menu/MenuItem";

interface ProjectMenuProps {
  anchorEl: HTMLElement | null;
  resetMenu: () => void;
  isFavorite: boolean | undefined;
  onToggleFavorite: () => void;
  onEdit: () => void;
  closeMenu: () => void;
  onDelete: () => void;
}

function ProjectMenu({
  anchorEl,
  resetMenu,
  closeMenu,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
}: ProjectMenuProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listLabelsRef = useRef<Array<string | null>>([]);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: Boolean(anchorEl),
    onOpenChange: (open) => !open && resetMenu(),
    elements: { reference: anchorEl },
    whileElementsMounted: autoUpdate,
    placement: "right-start",
    middleware: [offset(4), flip(), shift()],
  });

  useEffect(() => {
    listLabelsRef.current = [
      t("edit"),
      isFavorite ? t("remove_from_favorites") : t("add_to_favorites"),
      t("activity_log"),
      t("add_section"),
      t("delete"),
    ];
  }, [t, isFavorite]);

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "pointerdown",
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    useRole(context, { role: "menu" }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      loop: true,
    }),
    useTypeahead(context, {
      listRef: listLabelsRef,
      activeIndex,
      onMatch: setActiveIndex,
    }),
  ]);

  if (!anchorEl) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager
        context={context}
        modal={false}
        initialFocus={0}
        returnFocus={true}
      >
        <ul
          data-vaul-no-drag
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
          }}
          {...getFloatingProps()}
          className="min-w-[18em] pointer-events-auto bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none"
        >
          <MenuItem
            ref={(el) => {
              listRef.current[0] = el;
            }}
            active={activeIndex === 0}
            icon="icon-pencil"
            {...getItemProps({
              onClick: (e) => {
                e.stopPropagation();
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
              onClick: (e) => {
                e.stopPropagation();
                onToggleFavorite();
                resetMenu();
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

          <MenuItem
            ref={(el) => {
              listRef.current[3] = el;
            }}
            active={activeIndex === 3}
            icon="icon-books"
            {...getItemProps({ onClick: resetMenu })}
          >
            {t("add_section")}
          </MenuItem>

          <div className="my-1 border-t border-black/5 dark:border-white/5" />

          <MenuItem
            ref={(el) => {
              listRef.current[4] = el;
            }}
            active={activeIndex === 4}
            icon="icon-bin"
            variant="danger"
            {...getItemProps({
              onClick: (e) => {
                e.stopPropagation();
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
export default ProjectMenu;
