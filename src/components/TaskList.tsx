import type { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Spinner } from "@/components/Spinner";

type Props = {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-md border p-4 bg-white">
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-200 rounded w-1/2" />
  </div>
);

export const TaskList = ({
  tasks,
  onToggle,
  onDelete,
  loading = false,
}: Props) => {
  // If loading and there's no data yet, show skeletons (initial load or empty results)
  if (loading && (!Array.isArray(tasks) || tasks.length === 0)) {
    return (
      <div className="grid gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Guard against unexpected shapes (e.g. API returning object instead of array)
  if (!Array.isArray(tasks) || tasks.length === 0) {
    if (!Array.isArray(tasks))
      console.warn("TaskList: 'tasks' is not an array", tasks);

    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-lg font-medium">No tasks yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first task using the form above 👆
        </p>
      </div>
    );
  }

  const list = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-white/90 rounded-full p-1">
          <Spinner size={4} />
        </div>
      )}

      <div
        className={`grid gap-3 ${
          loading ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        {list.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
