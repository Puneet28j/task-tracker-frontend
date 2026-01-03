import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ListFilter,
  RotateCcw,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type StatusFilter = "All" | "Pending" | "Completed";
type PriorityFilter = "All" | "Low" | "Medium" | "High";

type Filters = {
  status: StatusFilter;
  priority: PriorityFilter;
  sort: "asc" | "desc";
};

type Props = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  onClear?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const Filters = ({
  filters,
  setFilters,
  onClear,
  disabled = false,
  loading = false,
}: Props) => {
  const update = (partial: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-1">
        {/* Visual Anchor */}
        <div className="flex items-center gap-2 px-2 py-1 text-slate-400 border-r border-slate-100 dark:border-slate-800 mr-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Filter
          </span>
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v as StatusFilter })}
          disabled={disabled}
        >
          <SelectTrigger className="h-8 w-auto gap-2 border-none bg-transparent px-2.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900 focus:ring-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent align="start" className="min-w-35">
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onValueChange={(v) => update({ priority: v as PriorityFilter })}
          disabled={disabled}
        >
          <SelectTrigger className="h-8 w-auto gap-2 border-none bg-transparent px-2.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-900 focus:ring-0">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <SelectValue placeholder="Priority" />
            </div>
          </SelectTrigger>
          <SelectContent align="start" className="min-w-35">
            <SelectItem value="All">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        {/* Sort Toggle */}
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 gap-2 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900",
            loading && "opacity-70"
          )}
          onClick={() =>
            update({ sort: filters.sort === "asc" ? "desc" : "asc" })
          }
          disabled={disabled}
        >
          {loading ? (
            <Spinner size={3} />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            Sort: {filters.sort.toUpperCase()}
          </span>
        </Button>
        {/* Vertical Divider */}
        <div className="mx-1 h-4 w-px bg-slate-100 dark:bg-slate-800" />

        {/* Reset Button */}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => {
            setFilters({ status: "All", priority: "All", sort: "asc" });
            onClear?.();
          }}
          disabled={loading}
          title="Clear Filters"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
