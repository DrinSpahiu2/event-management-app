import { useCallback, useEffect, useState } from "react";
import ManagerEditModal from "./ManagerEditModal.jsx";

const API_BASE = "/api/manager/event-categories";

const inputClass =
  "rounded-[10px] border border-[#272f3d] bg-[#11161f] px-3.5 py-3 text-sm text-slate-100 outline-none";

export default function ManagerEventCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ emertimi: "", pershkrimi: "" });

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editValues, setEditValues] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed");
      setCategories(await res.json());
    } catch {
      setMessage("Nuk u ngarkuan kategoritë.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function createCategory(e) {
    e.preventDefault();
    if (!form.emertimi.trim()) return;
    setMessage("");
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emertimi: form.emertimi.trim(),
          pershkrimi: form.pershkrimi,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setCategories((prev) => [...prev, data].sort((a, b) => a.emertimi.localeCompare(b.emertimi)));
      setForm({ emertimi: "", pershkrimi: "" });
      setMessage("Kategoria u shtua.");
    } catch (err) {
      setMessage(err.message || "Nuk u krijua kategoria.");
    }
  }

  function openEdit(cat) {
    setEditValues({
      id: cat.id,
      emertimi: cat.emertimi,
      pershkrimi: cat.pershkrimi || "",
    });
    setEditMessage("");
    setEditOpen(true);
  }

  async function saveEdit(values) {
    if (!values?.id) return;
    setEditLoading(true);
    setEditMessage("");
    try {
      const res = await fetch(`${API_BASE}/${values.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emertimi: values.emertimi,
          pershkrimi: values.pershkrimi,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gabim");
      setCategories((prev) =>
        prev
          .map((c) => (c.id === values.id ? data : c))
          .sort((a, b) => a.emertimi.localeCompare(b.emertimi)),
      );
      setEditOpen(false);
      setMessage("Kategoria u përditësua.");
    } catch (err) {
      setEditMessage(err.message || "Nuk u përditësua kategoria.");
    } finally {
      setEditLoading(false);
    }
  }

  async function deleteCategory(cat) {
    const ok = window.confirm(`Fshi kategorinë "${cat.emertimi}"?`);
    if (!ok) return;
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/${cat.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gabim");
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setMessage("Kategoria u fshi.");
    } catch (err) {
      setMessage(err.message || "Nuk u fshi kategoria.");
    }
  }

  return (
    <>
      <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Shto kategori</h3>
          <p className="mt-1 text-sm text-[#95a2ba]">
            Klasifikoni eventet (p.sh. Konferencë, Workshop, Networking).
          </p>
          {message ? <p className="mt-2 text-[13px] text-[#95a2ba]">{message}</p> : null}
          <form className="mt-4 grid gap-3" onSubmit={createCategory}>
            <input
              className={inputClass}
              placeholder="Emërtimi *"
              value={form.emertimi}
              onChange={(e) => setForm((p) => ({ ...p, emertimi: e.target.value }))}
              required
            />
            <textarea
              className={inputClass}
              placeholder="Përshkrimi"
              rows={3}
              value={form.pershkrimi}
              onChange={(e) => setForm((p) => ({ ...p, pershkrimi: e.target.value }))}
            />
            <button
              type="submit"
              className="rounded-[10px] bg-[#ff8b0f] px-4 py-2.5 text-sm font-semibold text-[#17120c] hover:bg-[#ff9f1a]"
            >
              Shto kategori
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-4">
          <h3 className="m-0 text-xl text-[#f4f7fb]">Lista e kategorive</h3>
          {loading ? (
            <p className="mt-4 text-[13px] text-[#95a2ba]">Duke ngarkuar...</p>
          ) : categories.length === 0 ? (
            <p className="mt-4 text-[13px] text-[#95a2ba]">Nuk ka kategori ende.</p>
          ) : (
            <ul className="mt-4 flex list-none flex-col gap-3 p-0">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-start justify-between gap-3 rounded-[10px] border border-[#293346] bg-[#161d27] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-[14px] font-medium text-[#f8fbff]">{cat.emertimi}</p>
                    {cat.pershkrimi ? (
                      <p className="mt-1 text-[12px] text-[#95a2ba] line-clamp-2">{cat.pershkrimi}</p>
                    ) : (
                      <p className="mt-1 text-[12px] italic text-[#6b7589]">Pa përshkrim</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className="rounded-[8px] border border-amber-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-amber-100 hover:bg-white/5"
                      onClick={() => openEdit(cat)}
                    >
                      Ndrysho
                    </button>
                    <button
                      type="button"
                      className="rounded-[8px] border border-rose-400/30 bg-[#11161f] px-2.5 py-1.5 text-[12px] text-rose-100 hover:bg-white/5"
                      onClick={() => deleteCategory(cat)}
                    >
                      Fshi
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <ManagerEditModal
        open={editOpen}
        title="Ndrysho kategorinë"
        loading={editLoading}
        message={editMessage}
        initialValues={editValues || {}}
        fields={[
          { key: "emertimi", label: "Emërtimi", required: true, placeholder: "Emërtimi" },
          {
            key: "pershkrimi",
            label: "Përshkrimi",
            type: "textarea",
            placeholder: "Përshkrimi",
          },
        ]}
        submitLabel="Ruaj"
        onClose={() => {
          setEditOpen(false);
          setEditMessage("");
        }}
        onSubmit={saveEdit}
      />
    </>
  );
}
