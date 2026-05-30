import { useEffect, useMemo, useState } from "react";

export default function ManagerEditModal({
  open,
  title,
  initialValues,
  fields,
  submitLabel = "Save",
  loading = false,
  message,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    if (open) setValues(initialValues || {});
  }, [open, initialValues]);

  const canSubmit = useMemo(() => {
    // Basic required check: if any field is required, ensure it's non-empty.
    return (fields || []).every((f) => {
      if (!f.required) return true;
      const v = values?.[f.key];
      return v !== undefined && v !== null && String(v).trim() !== "";
    });
  }, [fields, values]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-xl border border-[#283143] bg-[#151a23] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#283143] p-4">
          <h3 className="m-0 text-lg font-semibold text-[#f8fbff]">{title}</h3>
          <button
            type="button"
            className="rounded-lg border border-[#2b3446] bg-[#11161f] px-3 py-1.5 text-sm text-[#f3f6fb] hover:bg-white/5"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSubmit?.(values);
          }}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(fields || []).map((f) => {
              const val = values?.[f.key] ?? "";
              return (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs text-[#9ca6b7]">
                    {f.label}
                    {f.required ? <span className="ml-1 text-rose-400">*</span> : null}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      className="min-h-[90px] rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                      value={val}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                  ) : f.type === "select" ? (
                    <select
                      className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                      value={val}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    >
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none"
                      value={val}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      type={f.type || "text"}
                      min={f.min}
                      step={f.step}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {message ? <p className="mt-3 text-sm text-[#95a2ba]">{message}</p> : null}

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-[10px] border border-[#2b3446] bg-[#11161f] px-4 py-2.5 text-sm text-[#f3f6fb] hover:bg-white/5"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a] disabled:opacity-60"
              disabled={loading || !canSubmit}
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

