"use client";

import { useEffect, useMemo, useState } from "react";

type CatalogItem = {
  id: string;
  system: string;
  code: string;
  title: string;
  category: string;
  punktzahl: number | null;
  festbetragCent: number | null;
};

type RowState = { punktzahl: string; festbetrag: string; saving: boolean; saved: boolean; error: string | null };

export function CatalogSettings() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog-items")
      .then((res) => res.json())
      .then((data) => {
        const list: CatalogItem[] = data.items ?? [];
        setItems(list);
        const next: Record<string, RowState> = {};
        for (const item of list) {
          next[item.id] = {
            punktzahl: item.punktzahl != null ? String(item.punktzahl) : "",
            festbetrag: item.festbetragCent != null ? (item.festbetragCent / 100).toString() : "",
            saving: false,
            saved: false,
            error: null,
          };
        }
        setRows(next);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, CatalogItem[]>();
    for (const item of items) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    return Array.from(byCategory.entries());
  }, [items]);

  function updateRow(id: string, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch, saved: false, error: null } }));
  }

  async function saveRow(id: string) {
    const row = rows[id];
    if (!row) return;
    updateRow(id, { saving: true });

    const res = await fetch(`/api/catalog-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        punktzahl: row.punktzahl.trim() !== "" ? Number(row.punktzahl) : null,
        festbetragCent: row.festbetrag.trim() !== "" ? Math.round(Number(row.festbetrag) * 100) : null,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setRows((prev) => ({ ...prev, [id]: { ...prev[id], saving: false, error: data.error ?? "Fehler" } }));
      return;
    }
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], saving: false, saved: true, error: null } }));
  }

  if (loading) return <div className="card text-sm text-slate-500">Lädt…</div>;

  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
        Punktzahl und Festbetrag sind objektive Werte aus dem offiziellen Gebührenverzeichnis
        (GOZ/BEMA/BEL-II) und daher für alle Praxen geteilt, die diesen Referenzkatalog nutzen –
        nicht praxisspezifisch wie der Punktwert unter „Abrechnung“. Bitte gegen das aktuell
        gültige Verzeichnis prüfen, bevor Sie Werte eintragen.
      </p>

      {grouped.map(([category, categoryItems]) => (
        <div key={category} className="card p-0">
          <h2 className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {category}
          </h2>
          <div className="divide-y divide-slate-100">
            {categoryItems.map((item) => {
              const row = rows[item.id];
              if (!row) return null;
              const ref = item.code !== "–" ? `${item.system} ${item.code}` : item.system;
              return (
                <div key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-[220px] flex-1">
                    <div className="text-sm font-medium text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-400">{ref}</div>
                  </div>
                  <div className="w-28">
                    <label className="mb-1 block text-xs text-slate-400">Punktzahl</label>
                    <input
                      className="input py-1 text-xs"
                      type="number"
                      step="0.1"
                      min="0"
                      value={row.punktzahl}
                      onChange={(e) => updateRow(item.id, { punktzahl: e.target.value })}
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs text-slate-400">Festbetrag (EUR)</label>
                    <input
                      className="input py-1 text-xs"
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.festbetrag}
                      onChange={(e) => updateRow(item.id, { festbetrag: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <button
                      type="button"
                      onClick={() => saveRow(item.id)}
                      disabled={row.saving}
                      className="btn-secondary py-1 text-xs"
                    >
                      {row.saving ? "Speichert…" : "Speichern"}
                    </button>
                    {row.saved && <span className="text-xs text-green-700">Gespeichert.</span>}
                    {row.error && <span className="text-xs text-red-700">{row.error}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
