export const TaskCardLoader = () => {
  return (
    <div className="animate-pulse flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-6 w-6"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};
