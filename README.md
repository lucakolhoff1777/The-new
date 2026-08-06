# Zahnarzt Berichte

Web-Anwendung für Zahnarztpraxen, um aus kurzen Stichpunkten professionelle
Berichte zu erstellen – z. B. Befund-/Behandlungsberichte für die
Patientenakte oder Berichte an Krankenkassen. Die Texte werden von Claude
(Anthropic) auf Basis der eingegebenen Stichpunkte formuliert und müssen vor
dem Versand von einer approbierten Zahnärztin / einem approbierten Zahnarzt
geprüft und freigegeben werden.

## Funktionen

- Registrierung/Login pro Praxis (mehrere Mitarbeiter:innen pro Praxis)
- Patientenverwaltung
- Bericht anlegen: Stichpunkte + optionaler Kontext → KI-generierter
  Volltext (Befund-/Behandlungsbericht oder Bericht an Krankenkasse)
- Generierten Text bearbeiten, neu generieren, als Entwurf/final markieren
- Export als PDF

## Setup

```bash
npm install
cp .env.example .env
```

`.env` ausfüllen:

- `DATABASE_URL` – für lokale Entwicklung reicht die SQLite-Datei
  (`file:./dev.db`). Für den Produktivbetrieb wird eine echte Datenbank
  (z. B. PostgreSQL) empfohlen; dazu in `prisma/schema.prisma` den
  `provider` anpassen.
- `NEXTAUTH_SECRET` – zufälligen Wert generieren, z. B. mit
  `openssl rand -base64 32`.
- `ANTHROPIC_API_KEY` – API-Key von [console.anthropic.com](https://console.anthropic.com),
  wird für die Berichtsgenerierung benötigt.

Datenbank einrichten:

```bash
npx prisma migrate dev
```

Entwicklungsserver starten:

```bash
npm run dev
```

Anschließend unter `http://localhost:3000` zuerst eine Praxis unter
„Registrieren“ anlegen.

## Wichtige Hinweise zu Gesundheitsdaten & Datenschutz

Diese Anwendung verarbeitet Patientendaten (besondere Kategorien
personenbezogener Daten nach Art. 9 DSGVO). Vor dem Einsatz mit echten
Patientendaten unbedingt beachten:

- **Hosting/Verschlüsselung**: Datenbank und Verbindungen entsprechend
  absichern (Verschlüsselung at rest/in transit, Zugriffskontrollen,
  Backups).
- **Auftragsverarbeitung**: Für die Nutzung der Anthropic-API mit
  Patientendaten wird ein Auftragsverarbeitungsvertrag (AVV) mit Anthropic
  benötigt; ohne AVV keine echten Patientendaten an die API senden.
- **Menschliche Kontrolle**: KI-generierte Berichte sind als Entwürfe zu
  behandeln (im UI entsprechend gekennzeichnet) und müssen vor Freigabe/
  Versand fachlich geprüft werden. Die Software ersetzt keine ärztliche
  Beurteilung.
- Dieses Projekt ist ein funktionaler Prototyp, kein zertifiziertes
  Medizinprodukt.

## Bekannte offene Punkte

- `next@14.2.x` ist die aktuellste Version, die ohne größere Breaking
  Changes läuft; `npm audit` zeigt für diese Linie noch offene High-Severity
  Advisories, die erst mit einem Upgrade auf `next@16` (inkl. Anpassung der
  Route-Handler-Signaturen) vollständig behoben sind. Vor dem produktiven
  Einsatz sollte dieses Upgrade separat geplant werden.
- Kein automatisiertes Test-Suite vorhanden (manueller Rauchtest:
  Registrierung, Login, Patient anlegen, Bericht-API inkl. Fehlerfall
  wurden geprüft).
