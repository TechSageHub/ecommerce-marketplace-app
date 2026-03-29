function ToastIcon({ type }) {
  if (type === "loading") {
    return (
      <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    );
  }

  if (type === "success") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/20 text-xs font-bold text-emerald-200">
        ✓
      </span>
    );
  }

  if (type === "error") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-400/20 text-xs font-bold text-rose-200">
        !
      </span>
    );
  }

  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-400/20 text-xs font-bold text-sky-200">
      i
    </span>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:bottom-auto sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/95 p-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <ToastIcon type={toast.type} />
            </div>

            <div className="min-w-0 flex-1">
              {toast.title ? (
                <p className="text-sm font-semibold text-white">{toast.title}</p>
              ) : null}
              <p className="mt-1 text-sm leading-6 text-slate-200">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full px-2 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>

          {toast.type !== "loading" ? (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-full origin-left rounded-full bg-cyan-300 opacity-80 toast-progress"
                style={{ animationDuration: `${toast.duration || 3200}ms` }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
