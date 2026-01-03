import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  isClosing?: boolean; // Used for pure CSS exit animations
};

type ToastContextValue = {
  addToast: (t: Omit<Toast, "id">, duration?: number) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    // Set a flag to trigger CSS exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t))
    );
    // Remove from state after animation completes (200ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback(
    (t: Omit<Toast, "id">, duration = 4000) => {
      const id = String(Date.now() + Math.random());
      const toast: Toast = { id, ...t };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* TOAST VIEWPORT */}
      <div className="fixed bottom-0 right-0 z-100 flex flex-col p-4 gap-3 w-full max-w-lg pointer-events-none sm:bottom-4 sm:right-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border p-3 shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-right-5",
              t.isClosing &&
                "animate-out fade-out slide-out-to-right-5 scale-95",
              // Light Mode
              "bg-white border-slate-200 text-slate-900",
              // Dark Mode
              "dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
            )}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">{icons[t.type]}</div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-none mb-1">
                {t.title}
              </h4>
              {t.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.description}
                </p>
              )}
            </div>

            {/* Close Icon */}
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Subtle side accent line */}
            <div
              className={cn(
                "absolute left-0 top-1/4 h-1/2 w-0.5 rounded-r-full",
                t.type === "success" && "bg-emerald-500",
                t.type === "error" && "bg-red-500",
                t.type === "info" && "bg-blue-500"
              )}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
