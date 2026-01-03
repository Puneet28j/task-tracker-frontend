import { useState, useEffect } from "react";
import { Calendar, Flag, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/services/task.api";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type Props = {
  onAdd?: (task: Task) => void;
  onSubmit?: (data: FormState) => Promise<Task> | void;
  initial?: Partial<FormState>;
  onCancel?: () => void;
};

type FormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

export const TaskForm = ({ onAdd, onSubmit, initial, onCancel }: Props) => {
  const initialState: FormState = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    dueDate: initial?.dueDate ? initial.dueDate.substring(0, 10) : "",
    priority: (initial?.priority as FormState["priority"]) ?? "Medium",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    // Keep form in sync if `initial` changes
    setForm(initialState);
  }, [
    initial?.title,
    initial?.description,
    initial?.dueDate,
    initial?.priority,
  ]);

  const { addToast } = useToast();
  const isValid = Boolean(form.title && form.dueDate);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(form);
        if (result && onAdd) onAdd(result);
        addToast({ type: "success", title: "Task saved" });
      } else {
        const { data } = await createTask(form);
        setForm({
          title: "",
          description: "",
          dueDate: "",
          priority: "Medium",
        });
        addToast({ type: "success", title: "Task created" });
        if (onAdd) onAdd(data);
      }
    } catch (err: any) {
      addToast({ type: "error", title: "Error", description: err?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityColors = {
    Low: "text-blue-500",
    Medium: "text-amber-500",
    High: "text-red-500",
  };

  return (
    <form
      onSubmit={submit}
      className="group relative flex flex-col w-full rounded-xl border border-slate-200 bg-white p-3 transition-all focus-within:ring-2 focus-within:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:ring-slate-800"
    >
      {/* Primary Input Area */}
      <div className="flex flex-col space-y-1">
        <Input
          placeholder="Task title..."
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="h-9 border-none bg-transparent px-2 text-base font-semibold placeholder:text-slate-400 focus-visible:ring-0"
        />
        <Textarea
          placeholder="Add description..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="min-h-10 resize-none border-none bg-transparent px-2 text-sm text-slate-600 placeholder:text-slate-400 focus-visible:ring-0 dark:text-slate-400"
        />
      </div>

      {/* Utility Bar - Fixed Overflow here */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Due Date Picker - Made width flexible for mobile */}
          <div className="relative flex flex-1 sm:flex-none min-w-32.5">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
              className="h-8 w-full sm:w-40 pl-8 text-[11px] text-slate-600 border-dashed bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900"
            />
          </div>

          {/* Priority Select - Made width flexible for mobile */}
          <Select
            value={form.priority}
            onValueChange={(value) =>
              update("priority", value as FormState["priority"])
            }
          >
            <SelectTrigger className="h-8 flex-1 sm:flex-none sm:min-w-27.5 border-dashed text-[11px] bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900">
              <div className="flex items-center gap-2">
                <Flag
                  className={cn("h-3 w-3", priorityColors[form.priority])}
                />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium Priority</SelectItem>
              <SelectItem value="High">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-9 w-full sm:w-auto px-3 text-xs"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={!isValid || isSubmitting}
            className="h-9 w-full sm:w-auto px-5 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>{onSubmit ? "Save" : "Add Task"}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
