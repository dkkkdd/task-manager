import { useState, useRef, useLayoutEffect } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  initialOpen?: boolean;
  isEmpty?: boolean;
}

export const CollapsibleSection = ({
  title,
  children,
  action,
  initialOpen = true,
  isEmpty = false,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    if (isEmpty) {
      wrapperRef.current.style.maxHeight = "0px";
      return;
    }

    wrapperRef.current.style.maxHeight = isOpen
      ? `${wrapperRef.current.scrollHeight}px`
      : "0px";
  }, [isOpen, isEmpty, children]);

  if (isEmpty && !action) return null;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="text-[12px] font-medium text-gray-400 uppercase tracking-wider select-none">
          {title}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
          >
            <span
              className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634 text-[1.3em] transition-transform duration-300 text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </button>
          {action}
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        {children}
      </div>
    </div>
  );
};
