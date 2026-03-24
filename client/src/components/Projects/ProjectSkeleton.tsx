export const ProjectSkeleton = function ProjectSkeleton() {
  return (
    <div
      className={`
        relative flex items-center justify-between w-full
        p-2 md:p-0 rounded-lg
        bg-black/5 dark:bg-white/5
        animate-pulse
        md:bg-transparent md:shadow-none
      `}
    >
      <div className="flex items-center gap-4 md:gap-2 truncate flex-1 mr-2">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center">
          <div className="w-6 h-6 md:w-4 md:h-4 bg-gray-300 dark:bg-zinc-700 rounded-full" />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="h-4 w-24 md:w-20 bg-gray-300 dark:bg-zinc-700 rounded" />
        </div>
      </div>

      <div className="relative shrink-0 ml-2 flex items-center">
        <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-200 dark:bg-zinc-800 rounded-full md:rounded-lg mr-2" />
      </div>
    </div>
  );
};

ProjectSkeleton.displayName = "ProjectSkeleton";
