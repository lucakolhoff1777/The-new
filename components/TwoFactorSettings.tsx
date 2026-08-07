"use client";

import { useState } from "react";

export function TwoFactorSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [setupData, setSetupData] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/2fa/setup", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Setup konnte nicht gestartet werden.");
      return;
    }
    setSetupData(data);
  }

  async function confirmEnable(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/2fa/enable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Code konnte nicht bestätigt werden.");
      return;
    }
    setEnabled(true);
    setSetupData(null);
    setCode("");
    setMessage("Zwei-Faktor-Authentifizierung ist jetzt aktiv.");
  }

  async function disable(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Deaktivieren fehlgeschlagen.");
      return;
    }
    setEnabled(false);
    setPassword("");
    setMessage("Zwei-Faktor-Authentifizierung wurde deaktiviert.");
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium text-slate-900">Zwei-Faktor-Authentifizierung (2FA)</h2>
          <p className="mt-1 text-sm text-slate-500">
            Zusätzlich zum Passwort wird beim Anmelden ein Code aus einer Authenticator-App
            (z. B. Google Authenticator, Authy) verlangt.
          </p>
        </div>
        <span
          className={
            enabled
              ? "shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              : "shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          }
        >
          {enabled ? "Aktiv" : "Inaktiv"}
        </span>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
      )}

      {!enabled && !setupData && (
        <button onClick={startSetup} disabled={loading} className="btn-primary">
          2FA einrichten
        </button>
      )}

      {!enabled && setupData && (
        <form onSubmit={confirmEnable} className="space-y-3">
          <p className="text-sm text-slate-600">
            QR-Code mit der Authenticator-App scannen (oder den Schlüssel manuell eingeben) und
            anschließend den generierten 6-stelligen Code hier bestätigen:
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setupData.qrDataUrl} alt="QR-Code für 2FA-Setup" className="h-40 w-40" />
          <p className="font-mono text-xs text-slate-500 break-all">
            Schlüssel (manuelle Eingabe): {setupData.secret}
          </p>
          <div>
            <label className="label" htmlFor="totp-code">Bestätigungscode</label>
            <input
              id="totp-code"
              className="input"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            2FA aktivieren
          </button>
        </form>
      )}

      {enabled && (
        <form onSubmit={disable} className="space-y-3">
          <div>
            <label className="label" htmlFor="disable-password">
              Passwort zur Bestätigung, um 2FA zu deaktivieren
            </label>
            <input
              id="disable-password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-secondary">
            2FA deaktivieren
          </button>
        </form>
      )}
    </div>
  );
}
