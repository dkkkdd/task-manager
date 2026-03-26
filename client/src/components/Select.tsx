import { useState, useEffect, useRef, useMemo } from "react";
import type { Placement } from "@floating-ui/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  size,
  useListNavigation,
  useTypeahead,
  FloatingPortal,
} from "@floating-ui/react";
import { useTranslation } from "react-i18next";

export type Option = {
  value: string | number | null;
  label: string;
  color?: string;
  icon?: string;
};

interface SelectProps {
  symbol?: string;
  value: string | number | null;
  options: Option[];
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  border?: boolean;
  mobile?: boolean;
  position: Placement | undefined;
}

export function Select({
  symbol,
  value,
  options,
  onChange,
  placeholder,
  border,
  mobile = false,
  position,
}: SelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: position,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({ fallbackPlacements: ["top-start", "bottom-end"] }),
      shift({ padding: 10 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const labels = useMemo(() => options.map((o) => o.label), [options]);
  const labelsRef = useRef(labels);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  const selectedIndex = options.findIndex((o) => o.value === value);

  const listNav = useListNavigation(context, {
    listRef: listItemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    selectedIndex: selectedIndex !== -1 ? selectedIndex : null,
    loop: true,
    virtual: true,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "click",
    outsidePress: (event) => {
      event.stopPropagation();
      event.preventDefault();
      return true;
    },
  });

  const role = useRole(context, { role: "listbox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNav, typeahead],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && activeIndex !== null && open) {
      event.preventDefault();
      onChange(options[activeIndex].value);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open && activeIndex !== null && listItemsRef.current[activeIndex]) {
      listItemsRef.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, open]);

  const current = options.find((o) => o.value === value) || null;

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          onKeyDown: handleKeyDown,
          onMouseDown: (e) => e.preventDefault(),
        })}
        type="button"
        className={`
          focus:outline-none relative w-full min-h-[38px]
          flex items-center justify-between gap-2 p-2 pr-7
          rounded cursor-pointer box-border 
          bg-transparent text-gray-700 
          hover:bg-black/5 dark:hover:bg-[#333] m-0
          ${
            border !== false
              ? "border-[0.5px] border-black/20 dark:border-[#444] hover:border-gray-400 dark:hover:border-[#555]"
              : "border-none"
          }
          ${open ? "ring-1 ring-[#ff648b]/30 bg-black/5 dark:bg-[#333]" : ""}
        `}
      >
        <div className="flex items-center justify-start gap-2 overflow-hidden">
          {current ? (
            <>
              {current.icon ? (
                <span
                  className={`${current.icon} shrink-0 opacity-70 text-gray-700 dark:text-white`}
                />
              ) : current.color ? (
                <span
                  className={
                    symbol === "dot"
                      ? "w-2.5 h-2.5 rounded-full shrink-0"
                      : `${symbol} shrink-0 text-xs`
                  }
                  style={{
                    [symbol === "dot" ? "backgroundColor" : "color"]:
                      current.color,
                  }}
                />
              ) : null}
            </>
          ) : null}

          {!mobile && (
            <span className="truncate !text-[0.9em] text-gray-700 dark:text-white">
              {current ? t(current.label) : placeholder}
            </span>
          )}
        </div>
        <span
          className={`absolute top-[35%] right-[10px] transition-transform duration-200 text-[10px] text-gray-700 dark:text-white ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <FloatingPortal>
          <ul
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={{
              ...floatingStyles,

              zIndex: 9999,
            }}
            {...getFloatingProps()}
            className="bg-white dark:!bg-[#232323] border border-black/10 dark:border-[#444] rounded-md list-none p-1 z-[999] pointer-events-auto shadow-2xl overflow-y-auto box-border outline-none min-w-[12em] max-h-[15rem]"
          >
            {options.map((o, index) => (
              <li
                key={String(o.value)}
                ref={(el) => {
                  listItemsRef.current[index] = el;
                }}
                {...getItemProps({
                  onClick() {
                    onChange(o.value);
                    setOpen(false);
                  },
                })}
                className={`py-2 px-3 flex items-center gap-2 rounded cursor-pointer text-sm outline-none transition-colors
                  ${
                    activeIndex === index
                      ? "bg-black/5 dark:bg-[#333] text-black dark:text-white"
                      : "text-gray-700 dark:text-white"
                  }
                  hover:bg-black/5 dark:hover:bg-[#333]
                  ${value === o.value ? "!text-[#9d174d] font-bold" : ""}
                `}
              >
                {o.icon ? (
                  <span className={`${o.icon} shrink-0 text-xs opacity-70`} />
                ) : (
                  o.color && (
                    <span
                      className={
                        symbol === "dot"
                          ? "w-2 h-2 rounded-full shrink-0"
                          : `${symbol} shrink-0`
                      }
                      style={{
                        [symbol === "dot" ? "backgroundColor" : "color"]:
                          o.color,
                      }}
                    />
                  )
                )}
                <span className="truncate">{t(o.label)}</span>
              </li>
            ))}
          </ul>
        </FloatingPortal>
      )}
    </>
  );
}
