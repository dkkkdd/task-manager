import { useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
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

import { generateTimeOptions } from "@/utils/timeUtils";
import {
  combineDateAndTime,
  generateDatePresets,
} from "@/utils/dateFormatters";
import { formatDateLabel, dateColor } from "@/utils/dateFormatters";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "@/features/MobileDrawer";
import { SharedDayPicker } from "./SharedDayPicker";
import { QuickDateButtons } from "./Quickdatebuttons";
import { TimeSelector } from "./Timeselector";
import { dateLocales } from "@/i18n";
import { enUS } from "date-fns/locale";

interface CalendarProps {
  date: string | null;
  setDate: (val: string | null) => void;
  setIsCalOpen?: (val: boolean) => void;
  children?: ReactNode;
}

const Calendar = ({ date, setDate, setIsCalOpen, children }: CalendarProps) => {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  // const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const dateObj = useMemo(() => (date ? new Date(date) : null), [date]);
  const [selectedTime, setSelectedTime] = useState<string | null>(() => {
    if (!dateObj) return null;
    const timeStr = dateObj.toTimeString().slice(0, 5);
    return timeStr === "23:59" ? null : timeStr;
  });

  // useEffect(() => {
  //   if (open && dateObj) {
  //     if (!date) setSelectedTime(null);
  //     const timeStr = dateObj.toTimeString().slice(0, 5);
  //     setSelectedTime(timeStr === "23:59" ? null : timeStr);
  //   }
  // }, [open, dateObj, date]);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      setOpen(value);
      setIsCalOpen?.(value);
    },
    [setIsCalOpen],
  );

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
    isPositioned,
  } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement: "left-end",
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    middleware: [offset(4), flip(), shift({ padding: 10 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { enabled: !isMobile });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const timeOptions = useMemo(() => generateTimeOptions(30), []);
  const dates = useMemo(() => generateDatePresets(), []);

  const label = formatDateLabel(dateObj, dateLocales[i18n.language] || enUS);
  const meta = dateColor(dateObj);

  const handleDaySelect = useCallback(
    (day: Date | undefined) => {
      if (!day) return;
      const newDeadline = combineDateAndTime(day, selectedTime);
      setDate(newDeadline);
    },
    [selectedTime, setDate],
  );

  const handleTimeChange = useCallback(
    (newTime: string) => {
      setSelectedTime(newTime);

      if (dateObj) {
        const newDeadline = combineDateAndTime(dateObj, newTime);
        setDate(newDeadline);
        return;
      }

      const now = new Date();
      const [hours, minutes] = newTime.split(":").map(Number);

      const targetDate = new Date();
      targetDate.setHours(hours, minutes, 0, 0);

      if (targetDate < now) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      const newDeadline = combineDateAndTime(targetDate, newTime);
      setDate(newDeadline);
    },
    [dateObj, setDate],
  );

  const handleClearTime = useCallback(() => {
    setSelectedTime(null);
    if (dateObj) {
      const newDeadline = combineDateAndTime(dateObj, null);
      setDate(newDeadline);
    }
  }, [dateObj, setDate]);

  const handleClear = useCallback(() => {
    setDate(null);
    setSelectedTime(null);
  }, [setDate]);

  const displayTime =
    selectedTime && selectedTime !== "23:59" ? ` ${selectedTime}` : "";

  return (
    <>
      {children ? (
        <div
          ref={setReference}
          {...getReferenceProps()}
          className="inline-flex"
        >
          {children}
        </div>
      ) : (
        <button
          ref={setReference}
          {...getReferenceProps()}
          type="button"
          className="focus:outline-none cursor-pointer bg-transparent min-h-[38px] flex justify-between items-center gap-2 border-[0.5px] border-black/20 dark:border-[#d0d0d05a]/60 rounded px-3 h-[35px] w-fit text-sm hover:border-black/40 dark:hover:border-[#888]"
        >
          <div className="truncate flex gap-2 items-center">
            <span
              className={`${meta.icon} text-[1em] opacity-70`}
              style={{ color: meta.color }}
            />
            {dateObj && (
              <span style={{ color: meta.color }}>
                {t(`${label.toLowerCase()}`)}
                {displayTime}
              </span>
            )}
          </div>

          {dateObj && (
            <div
              onClick={handleClear}
              className="icon-icons8-close bg-black/10 dark:bg-[#444] p-1.5 text-black dark:text-white rounded-md hover:bg-black/20 dark:hover:bg-[#555]"
            />
          )}
        </button>
      )}

      {/* Desktop */}
      {!isMobile && open && (
        <FloatingPortal>
          <div
            ref={setFloating}
            style={{
              ...floatingStyles,
              visibility: isPositioned ? "visible" : "hidden",
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
            className="z-[9999] flex flex-col gap-2 bg-white dark:bg-[#242424] border border-black/10 dark:border-[#d0d0d05a]/60 rounded-xl p-3 shadow-2xl max-w-[400px]"
          >
            <SharedDayPicker
              selected={date}
              onSelect={handleDaySelect}
              variant="desktop"
            />

            <QuickDateButtons
              dates={dates}
              currentDate={date}
              handleClear={handleClear}
              onDateSelect={(d) => {
                const newDeadline = combineDateAndTime(d, selectedTime);
                setDate(newDeadline);
              }}
              onClose={() => setOpen(false)}
              variant="grid"
            />

            <TimeSelector
              time={selectedTime}
              timeOptions={timeOptions}
              onTimeChange={handleTimeChange}
              onClearTime={handleClearTime}
              showClearButton={!!selectedTime}
            />
          </div>
        </FloatingPortal>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer
          isNested={true}
          open={open}
          onClose={() => setOpen(false)}
          drawerTitle={t("calendar_editor")}
          drawerDescription={t("choose_date_and_time")}
        >
          <div className="flex flex-col gap-6 p-4 pb-8">
            <QuickDateButtons
              dates={dates}
              currentDate={date}
              handleClear={handleClear}
              onDateSelect={(d) => {
                const newDeadline = combineDateAndTime(d, selectedTime);
                setDate(newDeadline);
              }}
              onClose={() => setOpen(false)}
              variant="grid"
            />

            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-2">
              <SharedDayPicker
                selected={date}
                onSelect={handleDaySelect}
                variant="mobile"
              />
            </div>

            <TimeSelector
              time={selectedTime}
              timeOptions={timeOptions}
              onTimeChange={handleTimeChange}
              onClearTime={handleClearTime}
              showClearButton={!!selectedTime}
            />

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  handleClear();
                  setOpen(false);
                }}
                className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium active:scale-95 transition-transform"
              >
                {t("clear")}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-4 rounded-2xl bg-[#9d174d] text-white font-bold shadow-lg shadow-[#9d174d]/20 active:scale-95 transition-transform"
              >
                {t("done")}
              </button>
            </div>
          </div>
        </MobileDrawer>
      )}
    </>
  );
};

Calendar.displayName = "Calendar";
export default Calendar;
