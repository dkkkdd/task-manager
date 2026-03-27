export const DesktopForm = ({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) => (
  <div
    className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-[500px] bg-[#f8f8f8] dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-2xl border border-white/10"
    >
      <h2 className="text-xl font-bold text-black dark:text-white mb-6">
        {title}
      </h2>
      {children}
    </div>
  </div>
);
