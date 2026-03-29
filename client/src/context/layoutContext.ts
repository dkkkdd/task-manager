import { createContext, useContext } from "react";

interface LayoutContextType {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutContext");
  return context;
};
