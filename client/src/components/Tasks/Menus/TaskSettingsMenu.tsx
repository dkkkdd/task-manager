import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { FILTER_OPTIONS } from "@/utils/userSettings";
import Select from "@/components/Select";
import { useModeStore } from "@/stores/useModesStore";
import { useCallback, useState } from "react";

const OpenSettingsMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
      setIsMenuOpen(true);
    },
    [],
  );

  function onClose() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <button
        className="icon-user bg-transparent p-[0.3em] rounded-[8px] text-[1.3em]
             hover:bg-black/5 dark:hover:bg-[#82828241]
             text-black dark:text-white transition-colors"
        onClick={handleMenuClick}
      ></button>
      <TaskSettingsMenu
        isMenuOpen={isMenuOpen}
        anchorEl={anchorEl}
        onClose={onClose}
      />
    </>
  );
};
const TaskSettingsMenu = ({
  anchorEl,
  isMenuOpen,
  onClose,
}: {
  anchorEl: HTMLButtonElement | null;
  isMenuOpen: boolean;
  onClose: () => void;
}) => {
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isMenuOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "left-end",
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
  const showDone = useModeStore((s) => s.showDone);
  const setShowDone = useModeStore((s) => s.setShowDone);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!isMenuOpen) return null;

  return (
    <FloatingPortal>
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
          className="transition-opacity duration-200 z-[100] min-w-[20em] min-h-[fit-content] max-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none"
        >
          <div className="flex justify-center">
            <Select
              position="right-start"
              border={false}
              symbol="icon-flag"
              value={String(showDone)}
              options={FILTER_OPTIONS}
              onChange={(val) => {
                const isAll = val === "true";
                setShowDone(isAll);
                onClose();
              }}
            />
          </div>
          <div className="border-[0.5px] border-black/10 dark:border-[#444]/80 my-1"></div>
          <p>here will be sorting</p>
          <div className="border-[0.5px] border-black/10 dark:border-[#444]/80 my-1"></div>
          <p>and filters</p>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

export default OpenSettingsMenu;
