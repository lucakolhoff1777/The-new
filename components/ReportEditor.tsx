"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REPORT_TYPE_LABELS } from "@/lib/reportLabels";

interface ReportData {
  id: string;
  type: string;
  status: "ENTWURF" | "FINAL";
  generatedText: string | null;
  editedText: string | null;
  bulletPoints: string;
  additionalContext: string | null;
  patient: { firstName: string; lastName: string };
  author: { name: string };
  createdAt: string;
}

export function ReportEditor({ report }: { report: ReportData }) {
  const router = useRouter();
  const [text, setText] = useState(report.editedText ?? report.generatedText ?? "");
  const [status, setStatus] = useState(report.status);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(newStatus?: "ENTWURF" | "FINAL") {
    setSaving(true);
    setError(null);
    setMessage(null);

    const res = await fetch(`/api/reports/${report.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editedText: text, ...(newStatus ? { status: newStatus } : {}) }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Speichern fehlgeschlagen.");
      return;
    }

    if (newStatus) setStatus(newStatus);
    setMessage("Gespeichert.");
    router.refresh();
  }

  async function regenerate() {
    setRegenerating(true);
    setError(null);
    setMessage(null);

    const res = await fetch(`/api/reports/${report.id}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setRegenerating(false);

    if (!res.ok) {
      setError(data.error ?? "Neu generieren fehlgeschlagen.");
      return;
    }

    setText(data.report.generatedText);
    setMessage("Bericht wurde neu generiert.");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {REPORT_TYPE_LABELS[report.type]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {report.patient.firstName} {report.patient.lastName} · erstellt am{" "}
            {report.createdAt} von {report.author.name}
          </p>
        </div>
        <span
          className={
            status === "FINAL"
              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
          }
        >
          {status === "FINAL" ? "Final" : "Entwurf"}
        </span>
      </div>

      {status === "ENTWURF" && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Dieser Bericht wurde von einer KI erstellt. Bitte prüfen Sie den Inhalt sorgfältig, bevor
          Sie ihn freigeben oder versenden.
        </p>
      )}

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
      )}

      <div className="card mb-4">
        <textarea
          className="min-h-[420px] w-full resize-y border-0 p-0 text-sm leading-relaxed text-slate-800 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status === "FINAL"}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => save()}
          disabled={saving || status === "FINAL"}
          className="btn-secondary"
        >
          {saving ? "Speichert…" : "Änderungen speichern"}
        </button>
        <button
          onClick={regenerate}
          disabled={regenerating || status === "FINAL"}
          className="btn-secondary"
        >
          {regenerating ? "Generiert neu…" : "Neu generieren"}
        </button>
        {status === "ENTWURF" ? (
          <button onClick={() => save("FINAL")} disabled={saving} className="btn-primary">
            Als final freigeben
          </button>
        ) : (
          <button onClick={() => save("ENTWURF")} disabled={saving} className="btn-secondary">
            Wieder als Entwurf markieren
          </button>
        )}
        <a href={`/api/reports/${report.id}/pdf`} className="btn-secondary">
          Als PDF herunterladen
        </a>
      </div>

      <details className="mt-8 text-sm text-slate-500">
        <summary className="cursor-pointer font-medium">Ursprüngliche Stichpunkte anzeigen</summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-xs">
          {report.bulletPoints}
        </pre>
      </details>
    </div>
  );
}
