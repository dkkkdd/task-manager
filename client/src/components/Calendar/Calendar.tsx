import { useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { addDays, startOfToday } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useClick,
  useDismiss,
  FloatingPortal,
} from "@floating-ui/react";

import { generateTimeOptions } from "../../utils/timeUtils";
import { generateDatePresets } from "../../utils/dateFormatters";
import { formatDateLabel, dateColor } from "../../utils/dateFormatters";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MobileDrawer } from "../../features/MobileDrawer";
import { SharedDayPicker } from "./SharedDayPicker";
import { QuickDateButtons } from "./Quickdatebuttons";
import { TimeSelector } from "./Timeselector";
import { dateLocales } from "@/i18n";
import { enUS } from "date-fns/locale";

interface CalendarProps {
  date: Date | null;
  time: string | null;
  setIsCalOpen?: (val: boolean) => void;
  setDate: (val: Date | null) => void;
  setTime: (val: string | null) => void;
  children?: ReactNode;
}

const STEP = 30;

export const Calendar = (props: CalendarProps) => {
  const isMobile = useIsMobile();
  const { date, time, setDate, setTime, setIsCalOpen, children } = props;
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => {
    return dateLocales[i18n.language] || enUS;
  }, [i18n.language]);

  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      setIsCalOpen?.(value);
    },
    [setIsCalOpen],
  );

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement: "left-end",
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    middleware: [offset(4), flip(), shift({ padding: 10 })],
  });

  const click = useClick(context);

  const dismiss = useDismiss(context, {
    enabled: !isMobile,
    outsidePressEvent: "click",
    outsidePress: (event) => {
      event.stopPropagation();
      event.preventDefault();
      return true;
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const timeOptions = useMemo(() => generateTimeOptions(STEP), []);

  const dates = useMemo(() => generateDatePresets(), []);
  const label = formatDateLabel(date, locale);
  const meta = dateColor(date);

  const handleClearDate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setDate(null);
      setTime(null);
    },
    [setDate, setTime],
  );

  const handleTimeChange = useCallback(
    (newTime: string) => {
      if (!date) {
        setDate(new Date());
      }
      setTime(newTime);
    },
    [date, setDate, setTime],
  );

  const handleDaySelect = useCallback(
    (day: Date | undefined) => {
      if (!day) return;
      setDate(day);
    },
    [setDate],
  );

  const selectedDate = date ? new Date(date) : undefined;
  const minDate = useMemo(() => startOfToday(), []);

  const handleClearTime = useCallback(() => {
    setTime("");
  }, [setTime]);

  const buttonColor = meta.color === "#ffffffd9" ? undefined : meta.color;
  const iconColorClass =
    meta.color === "#ffffffd9"
      ? "text-black/80 dark:text-white/80"
      : meta.color;

  return (
    <>
      {children ? (
        <div
          role="button"
          aria-label="open calendar"
          ref={refs.setReference}
          {...getReferenceProps()}
          className="inline-flex"
        >
          {children}
        </div>
      ) : (
        <button
          aria-label={"clear"}
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setReference}
          {...getReferenceProps()}
          onMouseDown={(e) => e.preventDefault()}
          type="button"
          style={{ color: buttonColor }}
          className="focus:outline-none cursor-pointer bg-transparent min-h-[38px] flex justify-between items-center gap-2 bg-transparent border-[0.5px] border-black/20 dark:border-[#d0d0d05a]/60 rounded px-3 h-[35px] w-fit text-sm hover:border-black/40 dark:hover:border-[#888]"
        >
          <div className="truncate flex gap-2 items-center">
            <span
              className={`${meta.icon} text-[1.5em] opacity-70 ${iconColorClass}`}
              style={iconColorClass ? undefined : { color: meta.color }}
            />
            {(date || time) && `${t(label)} ${time || ""}`}
          </div>
          {date && (
            <div
              onClick={handleClearDate}
              className="icon-icons8-close bg-black/10 dark:bg-[#444] p-1.5 text-black dark:text-white rounded-md hover:bg-black/20 dark:hover:bg-[#555]"
            />
          )}
        </button>
      )}

      {!isMobile && open && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              visibility: isPositioned ? "visible" : "hidden",
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
            className="z-[9999] flex flex-col gap-2 bg-white dark:bg-[#242424] border border-black/10 dark:border-[#d0d0d05a]/60 rounded-xl p-3 shadow-2xl max-w-[400px]"
          >
            <div className="flex justify-center overflow-hidden">
              <SharedDayPicker
                selected={selectedDate}
                onSelect={handleDaySelect}
                variant="desktop"
              />
            </div>

            <QuickDateButtons
              dates={dates}
              onTimeSelect={setTime}
              currentDate={date}
              onDateSelect={setDate}
              onClose={() => setOpen(false)}
              variant="grid"
            />

            <TimeSelector
              time={time}
              timeOptions={timeOptions}
              onTimeChange={handleTimeChange}
              onClearTime={handleClearTime}
              showClearButton={true}
            />
          </div>
        </FloatingPortal>
      )}

      {isMobile && (
        <MobileDrawer
          open={open}
          onClose={() => setOpen(false)}
          drawerTitle={t("calendar_editor")}
          drawerDescription={t("choose_date_and_time")}
        >
          <div className="flex flex-col gap-4">
            <QuickDateButtons
              dates={dates}
              currentDate={date}
              onDateSelect={setDate}
              onTimeSelect={setTime}
              onClose={() => setOpen(false)}
              variant="vertical"
            />

            <div className="overflow-y-auto flex justify-center items-center">
              <SharedDayPicker
                selected={selectedDate}
                onSelect={handleDaySelect}
                toDate={addDays(minDate, 59)}
                variant="mobile"
                hideCaption={true}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("reminder")}
              </span>
              <TimeSelector
                onClearTime={() => setTime("")}
                showClearButton={Boolean(time)}
                time={time}
                timeOptions={timeOptions}
                onTimeChange={handleTimeChange}
              />
            </div>
            <button onClick={() => setOpen(false)}>{t("close")}</button>
          </div>
        </MobileDrawer>
      )}
    </>
  );
};

Calendar.displayName = "Calendar";
