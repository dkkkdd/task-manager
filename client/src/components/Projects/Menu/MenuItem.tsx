import { forwardRef } from "react";

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon: string;
  variant?: "default" | "danger";
  active?: boolean;
}

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      icon,
      onClick,
      children,
      variant = "default",
      active,
      className,
      ...props
    },
    ref,
  ) => (
    <li role="none" className="list-none w-full">
      <button
        ref={ref}
        role="menuitem"
        type="button"
        {...props}
        onClick={onClick}
        className={`
          w-full text-left p-2 cursor-pointer rounded transition-colors 
          flex items-center gap-2 outline-none border-none
          ${active ? "bg-black/5 dark:bg-[#333] ring-1 ring-inset ring-black/5" : "hover:bg-black/5 dark:hover:bg-[#333]"}
          ${variant === "danger" ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-white"}
          ${className || ""}
        `}
      >
        <span className={`${icon} opacity-70`} />
        <span className="truncate flex-1">{children}</span>
      </button>
    </li>
  ),
);
export default MenuItem;
