import { useLayout } from "@/context/layoutContext";
import { useVirtualizer } from "@tanstack/react-virtual";
import RenderTaskItem from "./RenderTaskCard";
import type { Task } from "@/types/tasks";

const VirtualList = ({ tasks }: { tasks: Task[] }) => {
  const { scrollRef } = useLayout();

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 60,
    measureElement: (el) => {
      const height = el.getBoundingClientRect().height;
      return Math.max(height, 20);
    },
    getItemKey: (index) => tasks[index]?.id ?? index,
    overscan: 10,
  });

  return (
    <div
      style={{ height: virtualizer.getTotalSize(), position: "relative" }}
      className="w-full max-w-[50rem] mx-auto "
    >
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <div
          key={virtualItem.key}
          ref={virtualizer.measureElement}
          data-index={virtualItem.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItem.start}px)`,
          }}
        >
          <RenderTaskItem task={tasks[virtualItem.index]} />
        </div>
      ))}
    </div>
  );
};
export default VirtualList;
