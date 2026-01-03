import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import { useState } from "react";
import { TaskForm } from "./TaskForm";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  Edit2,
} from "lucide-react";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdate?: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onDelete, onUpdate }: Props) {
  const isCompleted = task.status === "Completed";
  const hasDescription = Boolean(task.description);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <TaskForm
          initial={{
            title: task.title,
            description: task.description ?? "",
            dueDate: task.dueDate,
            priority: task.priority,
          }}
          onSubmit={async (data) => {
            // let parent handle update; construct minimal payload
            const updated: Task = {
              ...task,
              title: data.title,
              description: data.description,
              priority: data.priority,
              dueDate: data.dueDate,
            };
            if (onUpdate) onUpdate(updated);
            setEditing(false);
            return updated;
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  const priorityStyles = {
    High: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",
    Medium:
      "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
    Low: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={task._id}
        className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      >
        {/* ROW */}
        <div className="flex items-start gap-2 px-3 py-2">
          {/* COMPLETE */}
          <button
            onClick={() => onToggle(task)}
            className="mt-1 shrink-0 transition active:scale-90"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-500/10" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            )}
          </button>

          {/* CENTER */}
          <div className="flex-1 min-w-0">
            {/* TITLE */}
            <p
              className={cn(
                "truncate text-sm font-medium",
                isCompleted
                  ? "line-through text-slate-400"
                  : "text-slate-900 dark:text-slate-100"
              )}
            >
              {task.title}
            </p>

            {/* META (MOBILE + DESKTOP) */}
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <Badge
                className={cn(
                  "px-1.5 py-0 text-[10px] font-bold uppercase border-none",
                  priorityStyles[task.priority]
                )}
              >
                {task.priority}
              </Badge>

              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* CHEVRON */}
          {hasDescription && (
            <AccordionTrigger className="mt-1 flex items-center p-0 h-8 w-8 hover:no-underline">
              <ChevronDown className="h-4 w-4 text-slate-400 transition-transform data-[state=open]:rotate-180" />
            </AccordionTrigger>
          )}

          {/* EDIT */}
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 h-8 w-8 text-slate-400 hover:text-slate-700"
            onClick={() => setEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {/* DELETE */}
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => onDelete(task._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* DESCRIPTION */}
        {hasDescription && (
          <AccordionContent className="px-11 pb-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              {task.description}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}
