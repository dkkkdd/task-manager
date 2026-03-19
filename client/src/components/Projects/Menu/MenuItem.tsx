// export const MenuItem = ({
//   icon,
//   onClick,
//   children,
//   variant = "default",
// }: MenuItemProps) => {
//   return (
//     <li
//       onClick={onClick}
//       className={`w-full text-left p-2 cursor-pointer rounded transition-colors flex items-center gap-2 ${
//         variant === "danger"
//           ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
//           : "hover:bg-black/5 dark:hover:bg-[#333] text-gray-700 dark:text-white"
//       }`}
//     >
//       <span className={`${icon} opacity-[0.7]`} />
//       {children}
//     </li>
//   );
// };

import { forwardRef } from "react";

interface MenuItemProps {
  children: React.ReactNode;
  icon: string;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLLIElement>;
  variant?: string;
  active?: boolean;
}

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  (
    { icon, onClick, onKeyDown, children, variant = "default", active },
    ref,
  ) => {
    return (
      <li
        ref={ref}
        role="menuitem"
        tabIndex={active ? 0 : -1}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`w-full text-left p-2 cursor-pointer rounded transition-colors flex items-center gap-2 focus:outline-none
          ${active ? "bg-black/5 dark:bg-[#333]" : ""}
          ${
            variant === "danger"
              ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
              : "hover:bg-black/5 dark:hover:bg-[#333] text-gray-700 dark:text-white"
          }`}
      >
        <span className={`${icon} opacity-[0.7]`} />
        {children}
      </li>
    );
  },
);
