import { useEffect, useState, useCallback, useRef } from "react";
import { TaskForm } from "@/components/TaskForm";
import { fetchTasks, updateStatus, deleteTask } from "@/services/task.api";
import type { Task } from "@/types/task";
import { TaskList } from "@/components/TaskList";
import { Filters } from "@/components/Filters";
import { useToast } from "@/components/Toast";
import { ModeToggle } from "@/components/ModeToggle";

export const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [filters, setFilters] = useState({
    status: "All" as "All" | "Pending" | "Completed",
    priority: "All" as "All" | "Low" | "Medium" | "High",
    sort: "asc" as "asc" | "desc",
  });

  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(false); // immediate fetch flag
  const [showLoading, setShowLoading] = useState(false); // shows spinner after delay
  const loadingTimerRef = useRef<number | null>(null);

  const fetchTasksWithFilters = useCallback(async () => {
    // start fetching
    setIsFetching(true);
    setShowLoading(false);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    // only show loading UI if request takes longer than 200ms
    loadingTimerRef.current = window.setTimeout(
      () => setShowLoading(true),
      200
    );

    try {
      const res = await fetchTasks({
        status: filters.status === "All" ? undefined : filters.status,
        priority: filters.priority === "All" ? undefined : filters.priority,
        sort: filters.sort,
      });
      setTasks(res.data);
    } catch (err: any) {
      console.error(err);
      addToast({
        type: "error",
        title: "Failed to load tasks",
        description: err?.message,
      });
    } finally {
      // clear timer and hide loading flags
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setShowLoading(false);
      setIsFetching(false);
    }
  }, [filters, addToast]);

  const isInitial = useRef(true);

  useEffect(() => {
    // initial fetch immediately
    fetchTasksWithFilters();
    isInitial.current = false;
  }, []);

  // Debounce when filters change to avoid flicker on rapid changes
  useEffect(() => {
    if (isInitial.current) return;
    const id = setTimeout(() => fetchTasksWithFilters(), 300);
    return () => clearTimeout(id);
  }, [filters, fetchTasksWithFilters]);

  const toggle = async (task: Task) => {
    // optimistic update
    const prev = tasks;
    setTasks((p) =>
      p.map((t) =>
        t._id === task._id
          ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" }
          : t
      )
    );

    try {
      const { data } = await updateStatus(
        task._id,
        task.status === "Pending" ? "Completed" : "Pending"
      );
      // replace with server value
      setTasks((p) => p.map((t) => (t._id === data._id ? data : t)));
      addToast({
        type: "success",
        title: "Task updated",
        description: `Status updated to ${data.status}`,
      });
    } catch (err: any) {
      console.error(err);
      setTasks(prev); // revert
      addToast({
        type: "error",
        title: "Error",
        description: err?.message ?? "Failed to update task",
      });
    }
  };

  const remove = async (id: string) => {
    // optimistic remove
    const prev = tasks;
    setTasks((p) => p.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
      addToast({ type: "success", title: "Task deleted" });
    } catch (err: any) {
      console.error(err);
      setTasks(prev); // revert
      addToast({
        type: "error",
        title: "Error",
        description: err?.message ?? "Failed to delete task",
      });
    }
  };

  // Server returns filtered & sorted list based on query params
  const displayedTasks = tasks;

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Showing {tasks.length} tasks
            </p>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>

        <TaskForm onAdd={(task) => setTasks((prev) => [task, ...prev])} />

        <div className="flex items-center justify-between">
          <Filters
            filters={filters}
            setFilters={setFilters}
            disabled={isFetching}
            loading={showLoading}
          />
        </div>

        <TaskList
          tasks={displayedTasks}
          onToggle={toggle}
          onDelete={remove}
          loading={showLoading}
        />
      </div>
    </div>
  );
};
