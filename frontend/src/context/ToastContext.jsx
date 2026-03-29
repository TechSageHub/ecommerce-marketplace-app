import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import ToastViewport from "../components/common/ToastViewport";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);
  const timeoutRefs = useRef(new Map());

  const clearToastTimeout = (id) => {
    const timeoutId = timeoutRefs.current.get(id);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
  };

  const dismissToast = (id) => {
    clearToastTimeout(id);
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  const scheduleDismiss = (id, duration) => {
    if (!duration || duration <= 0) {
      return;
    }

    clearToastTimeout(id);

    const timeoutId = window.setTimeout(() => {
      dismissToast(id);
    }, duration);

    timeoutRefs.current.set(id, timeoutId);
  };

  const showToast = ({
    type = "info",
    message,
    title = "",
    duration = DEFAULT_DURATION,
  }) => {
    const id = `toast-${Date.now()}-${idCounter.current++}`;
    const nextToast = { id, type, title, message, duration };

    setToasts((currentToasts) => [...currentToasts, nextToast]);

    if (type !== "loading") {
      scheduleDismiss(id, duration);
    }

    return id;
  };

  const updateToast = (
    id,
    { type, title, message, duration = DEFAULT_DURATION }
  ) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              type: type ?? toast.type,
              title: title ?? toast.title,
              message: message ?? toast.message,
              duration,
            }
          : toast
      )
    );

    if ((type ?? "").toLowerCase() === "loading") {
      clearToastTimeout(id);
      return;
    }

    scheduleDismiss(id, duration);
  };

  const value = useMemo(
    () => ({
      toasts,
      dismissToast,
      showToast,
      showSuccess: (message, title = "Success", duration = DEFAULT_DURATION) =>
        showToast({ type: "success", title, message, duration }),
      showError: (message, title = "Something went wrong", duration = 4000) =>
        showToast({ type: "error", title, message, duration }),
      showLoading: (message, title = "Please wait") =>
        showToast({ type: "loading", title, message, duration: 0 }),
      updateToast,
    }),
    [toasts]
  );

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
