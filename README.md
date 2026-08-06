# Zahnarzt Berichte

Web-Anwendung für Zahnarztpraxen, um aus einer lückenlosen Leistungserfassung
professionelle Berichte zu erstellen – z. B. Befund-/Behandlungsberichte für
die Patientenakte oder Berichte an Krankenkassen. Die Texte werden von Claude
(Anthropic) auf Basis der erfassten Leistungen formuliert und müssen vor dem
Versand von einer approbierten Zahnärztin / einem approbierten Zahnarzt
geprüft und freigegeben werden.

## Funktionen

- Registrierung/Login pro Praxis (mehrere Mitarbeiter:innen pro Praxis)
- Patientenverwaltung
- **Leistungserfassung nach dem Opt-out-Prinzip**: Für jeden Sitzungstyp
  (z. B. „Füllungstherapie“, „PZR“, „Kontrolluntersuchung“) zeigt das System
  die vollständige Liste der dafür typischen GOZ-/BEMA-Positionen – alle
  standardmäßig als **erbracht** markiert. Die Praxis muss aktiv streichen,
  was der Arzt/die Ärztin *nicht* gemacht hat, statt einzelne Leistungen
  mühsam anzuhaken. Das verhindert vergessene Einträge (Lückenlosigkeit).
  Der Server erzwingt zusätzlich, dass zu jeder Position der Vorlage eine
  Entscheidung vorliegt und die Liste vor dem Absenden als vollständig
  geprüft bestätigt wurde – unvollständige Erfassungen werden abgelehnt.
- Aus der geprüften Leistungsliste generiert die KI den Berichtstext
  (Befund-/Behandlungsbericht oder Bericht an Krankenkasse)
- Generierten Text bearbeiten, neu generieren, als Entwurf/final markieren
- Export als PDF
- Auf der Berichtsseite bleibt die vollständige Leistungsliste inkl.
  gestrichener Positionen als Prüf-/Audit-Nachweis sichtbar

### Leistungskatalog – wichtiger Hinweis

`prisma/seed.ts` enthält einen **Beispielkatalog** typischer GOZ-/BEMA-
Positionen ohne Punktwerte/Eurobeträge. Ziffern, die nicht eindeutig bekannt
waren, sind bewusst mit „–“ statt einer geratenen Nummer versehen. Dieser
Katalog ist **kein abrechnungsverbindliches Verzeichnis** – vor dem Einsatz
zur echten Abrechnung müssen alle Ziffern gegen das aktuell gültige
offizielle Gebührenverzeichnis (BZÄK/KZBV) geprüft, korrigiert und ergänzt
werden (z. B. über `npx prisma studio` oder direkt in `prisma/seed.ts` +
erneutem `npx prisma db seed`). Eine eigene Verwaltungsoberfläche für den
Katalog gibt es aktuell noch nicht (siehe „Bekannte offene Punkte“).

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

Datenbank einrichten und Leistungskatalog/Vorlagen seeden:

```bash
npx prisma migrate dev
npx prisma db seed
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
  Registrierung, Login, Patient anlegen, Leistungserfassung inkl.
  Vollständigkeits- und Bestätigungsprüfung sowie Bericht-Fehlerfall wurden
  geprüft).
- Leistungskatalog und Sitzungstyp-Vorlagen können aktuell nur über
  `prisma/seed.ts` bzw. `npx prisma studio` gepflegt werden, nicht über die
  Weboberfläche. Eine Verwaltungsseite dafür wäre ein sinnvoller nächster
  Ausbauschritt.
- GOZ-/BEMA-Ziffern im Beispielkatalog sind, wie oben beschrieben, vor dem
  echten Abrechnungseinsatz zu verifizieren.
