"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PatientOption = { id: string; firstName: string; lastName: string };

export function NewReportForm({
  patients,
  initialPatientId,
}: {
  patients: PatientOption[];
  initialPatientId?: string;
}) {
  const router = useRouter();
  const [patientId, setPatientId] = useState(initialPatientId ?? patients[0]?.id ?? "");
  const [type, setType] = useState<"BEFUND" | "KRANKENKASSE">("BEFUND");
  const [treatmentDate, setTreatmentDate] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId) {
      setError("Bitte einen Patienten auswählen.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        type,
        treatmentDate: treatmentDate || null,
        bulletPoints,
        additionalContext: additionalContext || null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Bericht konnte nicht erstellt werden.");
      return;
    }

    router.push(`/reports/${data.report.id}`);
  }

  if (patients.length === 0) {
    return (
      <div className="card text-sm text-slate-500">
        Bitte legen Sie zuerst einen Patienten an, bevor Sie einen Bericht erstellen.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className="label">Patient</label>
        <select
          className="input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Berichtstyp</label>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as "BEFUND" | "KRANKENKASSE")}
        >
          <option value="BEFUND">Befund-/Behandlungsbericht</option>
          <option value="KRANKENKASSE">Bericht an Krankenkasse</option>
        </select>
      </div>

      <div>
        <label className="label">Behandlungsdatum (optional)</label>
        <input
          type="date"
          className="input"
          value={treatmentDate}
          onChange={(e) => setTreatmentDate(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Stichpunkte zu Befund und Behandlung</label>
        <textarea
          required
          className="input min-h-40 font-mono text-sm"
          placeholder={"z. B.\n- Karies an Zahn 36, tief kariös\n- Lokalanästhesie, Exkavation\n- Füllung in Komposit\n- Patient beschwerdefrei entlassen"}
          value={bulletPoints}
          onChange={(e) => setBulletPoints(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-400">
          Ein Stichpunkt pro Zeile reicht aus – die KI formuliert daraus den Fließtext.
        </p>
      </div>

      <div>
        <label className="label">Zusätzlicher Kontext (optional)</label>
        <textarea
          className="input min-h-20"
          placeholder="z. B. Empfänger, Anlass des Berichts, Besonderheiten"
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Bericht wird generiert…" : "Bericht generieren"}
      </button>
    </form>
  );
}
