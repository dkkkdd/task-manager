import { useAuthState } from "@/context/AuthProvider";

export const UserBtn = ({ onClick }: { onClick: () => void }) => {
  const { user } = useAuthState();
  return (
    <div className="mb-6 font-semibold">
      <span
        className="w-full flex items-center gap-2 cursor-pointer group"
        onClick={onClick}
      >
        <div className="w-10 h-10 bg-[#999] dark:bg-[#333] border border-[#888] dark:border-[#222] rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
          {user?.userName?.charAt(0).toUpperCase() ||
            user?.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-blue-400 truncate">
          {user?.userName || user?.email.split("@")[0]}
        </span>
      </span>
    </div>
  );
};
