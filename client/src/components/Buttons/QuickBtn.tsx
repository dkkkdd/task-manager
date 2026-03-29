interface QuickBtnProps {
  icon: React.ReactNode;
  label?: string;
  color?: string;
  isActive?: boolean;
  onClick: () => void;
}

export const QuickBtn = ({
  icon,
  label,
  color,
  isActive,
  onClick,
}: QuickBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex items-center gap-2 p-2 text-left rounded-lg cursor-pointer text-xs transition-all 
      hover:bg-black/5 dark:hover:bg-white/5 
      ${
        isActive
          ? "bg-black/10 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10 opacity-100"
          : "bg-transparent opacity-80 hover:opacity-100"
      } 
      ${color}
    `}
  >
    <span className={`${icon} text-[1.8em]`} />
    {label && <span className="font-semibold">{label}</span>}
  </button>
);
