import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    document.body.appendChild(el);

    return () => {
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, [el]);

  return createPortal(children, el);
};

export default ModalPortal;
