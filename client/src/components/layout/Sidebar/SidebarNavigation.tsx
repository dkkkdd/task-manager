import { useModeStore } from "@/stores/useModesStore";
import type { TaskMode } from "@/types/navigation";
import { GET_NAV_ITEMS } from "@/utils/navigation";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface NavProps {
  variant?: "sidebar" | "mobile";
  onItemClick?: () => void;
  children?: React.ReactNode;
}

export const SidebarNavigation = ({
  variant = "sidebar",
  onItemClick,
  children,
}: NavProps) => {
  const { t } = useTranslation();
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const items = GET_NAV_ITEMS(t);
  const isMobile = variant === "mobile";

  return (
    <div
      className={isMobile ? "flex h-14 w-full items-center justify-around" : ""}
    >
      {items.map((nav) => {
        const isActive = mode === nav.id;
        return (
          <Link
            key={nav.id}
            to={nav.path}
            onClick={() => {
              setMode(nav.id as TaskMode);
              onItemClick?.();
            }}
            className={`
              relative flex items-center cursor-pointer transition-all
              ${isMobile ? "flex-1 justify-center h-full" : "gap-3 p-2 w-full rounded-lg text-[14px]"}
              ${
                isActive
                  ? "text-[#9d174d] dark:text-white bg-[#9d174d]/10"
                  : "text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-[#363636]"
              }
            `}
          >
            <span
              className={`${nav.icon} ${isMobile ? "text-xl" : "text-base"}`}
            />
            {!isMobile && <span>{nav.label}</span>}

            {isMobile && isActive && (
              <span className="absolute inset-x-1 inset-y-1.5 bg-[#9d174d]/15 rounded-xl -z-10" />
            )}
          </Link>
        );
      })}

      {isMobile && children}
    </div>
  );
};
