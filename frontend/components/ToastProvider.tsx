"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
};

type ToastContextValue = {
  show: (message: string, type?: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Toast[]>([]);

  const show = (message: string, type: "success" | "error" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setQueue((prev) => [...prev, { id, message, type }]);
  };

  const current = queue[0] || null;
  const closeCurrent = () => {
    setQueue((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (!current) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCurrent();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.type === "success" ? "Mensaje de éxito" : "Mensaje de error"}
          onClick={closeCurrent}
        >
          <div
            className={`max-w-md w-full rounded-2xl px-5 py-4 text-sm shadow-card ${
              current.type === "success" ? "bg-olive text-cream" : "bg-terracotta text-cream"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p>{current.message}</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeCurrent}
                className="rounded-full border border-cream/60 px-4 py-1 uppercase tracking-[0.2em] text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
