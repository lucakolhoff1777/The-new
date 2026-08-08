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
- **Logisch aufeinander aufbauende Behandlungsschritte**: Innerhalb einer
  Vorlage können Positionen von anderen abhängen (z. B. Wurzelkanalfüllung
  setzt Wurzelkanalaufbereitung voraus, die wiederum eine Trepanation
  voraussetzt). Wird ein vorausgehender Schritt gestrichen, werden alle
  davon abhängigen Folgeschritte automatisch mitgestrichen und in der
  Oberfläche gesperrt (mit Begründung „Setzt voraus: …“) – sie könnten sonst
  nicht stattgefunden haben. Diese Kaskade wird zusätzlich serverseitig neu
  berechnet, damit ein manipulierter Request sie nicht umgehen kann (siehe
  `lib/serviceDependency.ts`).
- 11 Sitzungstyp-Vorlagen über das übliche Behandlungsspektrum hinweg:
  Kontrolle, Erstuntersuchung, Füllungstherapie, PZR, Chirurgie,
  systematische Parodontitisbehandlung (PAR, siehe unten), Endodontie,
  Prothetik, Individualprophylaxe (Kind/Jugendliche),
  Notfall-/Schmerzbehandlung, Schienentherapie.
- Die **PAR-Vorlage** bildet den vollständigen, seit 2021 gültigen
  BEMA-Pfad der systematischen Parodontitisbehandlung ab (BEVa → BEVb →
  ATG → MHU → AITa → AITb → CPTa/CPTb → UPTa → UPTb → UPTc → UPTd) als
  durchgehende Abhängigkeitskette – ein reales Beispiel für „logisch
  aufeinander aufbauende Behandlungsschritte“.
- Aus der geprüften Leistungsliste generiert die KI den Berichtstext
  (Befund-/Behandlungsbericht oder Bericht an Krankenkasse)
- Generierten Text bearbeiten, neu generieren, als Entwurf/final markieren
- Export als PDF
- Auf der Berichtsseite bleibt die vollständige Leistungsliste inkl.
  gestrichener Positionen als Prüf-/Audit-Nachweis sichtbar
- **Diktierfunktion** beim „Zusätzlichen Kontext“: kurz ins Mikrofon
  sprechen (Button „Diktieren“), der Text erscheint direkt im Feld. Die KI
  formuliert daraus beim Generieren einen etwas ausführlicheren Abschnitt,
  ohne die Berichtsstruktur zu ändern. Nutzt die Web-Speech-API des Browsers
  (am zuverlässigsten in Chrome/Edge; ohne Unterstützung wird ein Hinweis
  statt des Buttons angezeigt).
- **Abrechnungsregeln pro Position** (GOZ/GOÄ/BEMA/BEL-II):
  - **Faktor & Begründungspflicht (§5 GOZ)**: Bei Positionen mit Faktorspanne
    (GOZ/GOÄ) zeigt die Leistungserfassung ein Faktor-Feld. Wird der
    Regelhöchstfaktor (i. d. R. 2,3) überschritten, erscheint automatisch ein
    Pflichtfeld für die schriftliche Begründung. Der Server lehnt Berichte
    ohne diese Begründung sowie Faktoren außerhalb des zulässigen Bereichs
    (1,0–3,5) ab.
  - **Ausschluss-Regeln**: Positionen, die laut Katalog nicht gemeinsam
    abgerechnet werden dürfen (z. B. „Füllung, einflächig“ und „Füllung,
    mehrflächig“ am selben Zahn), werden in der Checkliste live als Konflikt
    markiert; der Server weist widersprüchliche Kombinationen zusätzlich
    zurück.
  - **Gültigkeitszeiträume**: Positionen können ein `gueltigAb`-Datum tragen
    (z. B. die PAR-Positionen ab der Reform vom 1.7.2021).
  - **Kassenart (GKV/PKV)** wird pro Patient erfasst.
  - **Gültigkeitszeiträume werden geprüft**: Liegt das gewählte
    Behandlungsdatum vor `gueltigAb` bzw. nach `gueltigBis` einer Position
    (z. B. eine PAR-Position vor dem 1.7.2021), lehnt der Server den Bericht
    mit einer entsprechenden Fehlermeldung ab.
  - **Frequenzlimits werden geprüft**: Positionen mit hinterlegtem
    `frequenzlimitAnzahl`/`frequenzlimitZeitraumTage` (z. B. „PZR max. 2x pro
    Jahr“ als Praxisbeispiel im Katalog) werden gegen bereits erfasste
    Berichte desselben Patienten geprüft; wird das Limit im Zeitraum
    überschritten, wird der Bericht abgelehnt.
  - **Kassenart-Vorbelegung**: Enthält eine Vorlage dieselbe Leistung doppelt
    als GOZ- und BEMA-Position (z. B. „Eingehende Untersuchung“), wird anhand
    der am Patienten hinterlegten Kassenart (GKV/PKV) automatisch nur die
    passende Position vorbelegt, statt beide als erbracht zu markieren.
  - Diese Regeln sind serverseitig in `lib/serviceRules.ts` implementiert und
    greifen unabhängig vom Client (Defense-in-Depth wie bei den
    Abhängigkeitsketten).
- **Berichtsübersicht** (`/reports`): durchsuchbare, nach Status filterbare
  Liste aller Berichte der Praxis, zusätzlich zur „Zuletzt erstellt“-Ansicht
  im Dashboard.
- **Änderungsverlauf bei Berichten**: Vor jedem Überschreiben des bearbeiteten
  Texts wird die bisherige Version als Revision gespeichert (mit Zeitstempel
  und bearbeitender Person) und lässt sich auf der Berichtsseite einsehen und
  bei Bedarf wieder in den Editor laden – Bearbeitungen an der
  Gesundheitsdokumentation gehen dadurch nicht mehr kommentarlos verloren.
- **Zwei-Faktor-Authentifizierung (2FA)**: optional pro Konto unter
  „Sicherheit“ einrichtbar (TOTP, kompatibel mit gängigen Authenticator-Apps
  wie Google Authenticator/Authy). Ist 2FA aktiv, verlangt der Login
  zusätzlich zum Passwort einen 6-stelligen Code.
- **Rate-Limiting** auf Login und Registrierung gegen Brute-Force-Versuche
  (siehe „Bekannte offene Punkte“ zu den Grenzen der aktuellen Umsetzung).

## Für Software-Partner: API-Integration statt PVS-Ersatz

Der deutsche Zahnarzt-PVS-Markt (Charly, Dampsoft, CGM Z1, evident,
Update/Data Care u. a.) ist etabliert, zertifiziert und stark besetzt – dort
als komplette Neuentwicklung anzutreten wäre wenig aussichtsreich. Die
realistische Nische: **dieses System als Zusatzmodul an bestehende PVS-Systeme
andocken**, statt sie zu ersetzen. Die Abrechnungshoheit (KZV-Anbindung)
bleibt beim etablierten System; dieses Projekt liefert die
Opt-out-Lückenlosigkeits-Logik und die KI-Berichtsgenerierung als Service.

Dafür gibt es eine **Partner-API** (`/api/v1/...`, API-Key-Authentifizierung,
60 Anfragen/Minute je Key):

- `GET /api/v1/catalog` – Referenzkatalog & Vorlagen zum Abgleich
- `POST /api/v1/validate` – Faktor-/Ausschluss-/Gültigkeits-/
  Frequenzlimit-Prüfung für vom Partner gelieferte Positionsdaten
- `POST /api/v1/reports/generate` – KI-Berichtstext aus geprüften
  Leistungsdaten

Bewusst **zustandslos**: Patienten-/Praxisdaten des Partners werden nicht
gespeichert, jeder Request wird unabhängig verarbeitet – das reduziert den
DSGVO-Haftungsradius erheblich. Details, curl-Beispiele und die
maschinenlesbare Spezifikation: [`docs/API.md`](docs/API.md) /
[`openapi.yaml`](openapi.yaml). API-Keys werden über
`npm run api:create-client -- "Partnername GmbH"` vergeben (bewusst kein
Self-Service, da Partnerintegrationen ein Vertriebsprozess sind).

**Was diese API technisch liefert vs. was für echte Marktreife zusätzlich
nötig ist** (siehe auch „Bekannte offene Punkte“):

| Bereit (Code) | Braucht externen Prozess (kein Code) |
| --- | --- |
| Validierungs-Engine als API | KZV-/PVS-Zertifizierung für GKV-Abrechnung |
| KI-Berichtsgenerierung als API | TI-/gematik-Zulassung (KIM, ePA, SMC-B) |
| API-Key-Auth, Rate-Limiting | Formale MDR-Einstufung |
| Zustandslos (kein Partner-Datenspeicher) | EU-AI-Act-Konformitätsbewertung |
| OpenAPI-Dokumentation | DSFA, AVV mit Partnern, ggf. ISO 27001 |

Diese rechte Spalte lässt sich nicht durch weiteren Code lösen, sondern
braucht Rechtsberatung, Zertifizierungsstellen und die KZBV/gematik selbst –
das sollte vor jeder kommerziellen Vermarktung eingeplant werden.

### Leistungskatalog – wichtiger Hinweis

`prisma/seed.ts` enthält einen **Beispielkatalog** typischer GOZ-/GOÄ-/BEMA-/
BEL-II-Positionen ohne Punktwerte/Eurobeträge. Ziffern, die nicht eindeutig
bekannt waren, sind bewusst mit „–“ statt einer geratenen Nummer versehen;
`punktzahl`, `punktwertCent` und `festbetragCent` bleiben aus demselben Grund
`null`. Dieser Katalog ist **kein abrechnungsverbindliches Verzeichnis** –
vor dem Einsatz zur echten Abrechnung müssen alle Ziffern und Beträge gegen
das aktuell gültige offizielle Gebührenverzeichnis (BZÄK/KZBV) geprüft,
korrigiert und ergänzt werden (z. B. über `npx prisma studio` oder direkt in
`prisma/seed.ts` + erneutem `npx prisma db seed`). Faktor-Regeln
(`faktorMin`/`faktorMax`/`regelhoechstfaktor`/`begruendungspflichtAbFaktor`)
sind für GOZ/GOÄ-Positionen mit den in der GOZ üblichen Standardwerten
(1,0–3,5, Regelhöchstfaktor 2,3) hinterlegt und ebenfalls vor dem
Produktiveinsatz zu verifizieren. Eine eigene Verwaltungsoberfläche für den
Katalog gibt es aktuell noch nicht (siehe „Bekannte offene Punkte“).

## Setup

```bash
npm install
cp .env.example .env
```

`.env` ausfüllen:

- `DATABASE_URL` – PostgreSQL-Connection-String. Für lokale Entwicklung
  reicht ein lokaler Postgres-Server oder ein kostenloses Projekt bei z. B.
  [neon.tech](https://neon.tech) oder Vercel Postgres. (Bis zu diesem Punkt
  im Projekt lief die Entwicklung auf SQLite; für den Vercel-Deploy wurde auf
  PostgreSQL umgestellt, da Vercels Dateisystem nicht dauerhaft ist.)
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
- **Diktierfunktion**: Die Spracherkennung läuft über die Web-Speech-API des
  Browsers. In Chrome/Edge wird das Audio dafür an Server des jeweiligen
  Browser-Anbieters (i. d. R. Google) übertragen und dort transkribiert –
  das ist ein separater Auftragsverarbeiter neben Anthropic. Ohne
  entsprechende vertragliche Grundlage keine Patientennamen oder sonstige
  identifizierende Angaben hineindiktieren; im Zweifel nur sachliche
  Befund-/Behandlungsstichworte verwenden.
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
- **Automatisierte Tests**: `npm test` (Vitest) deckt die reine Geschäftslogik
  ab (Abhängigkeitskaskaden, Faktor-/Ausschluss-/Gültigkeitsregeln,
  Rate-Limiter). API-Routen und UI werden weiterhin nur manuell/per
  Playwright-Rauchtest geprüft, nicht automatisiert in CI – ein
  DB-gestütztes Integrationstest-Setup wäre ein sinnvoller nächster Schritt.
- **Rate-Limiting ist In-Memory** (`lib/rateLimit.ts`) und läuft daher pro
  Serverprozess; bei mehreren Instanzen (z. B. mehrere Serverless-Kaltstarts)
  ist der Schutz nicht global konsistent. Für den Produktivbetrieb sollte ein
  geteilter Store (z. B. Redis) verwendet werden.
- **2FA-Wiederherstellung**: Es gibt aktuell keine Backup-Codes für den Fall,
  dass der Zugriff auf die Authenticator-App verloren geht – ein Admin müsste
  `totpEnabled`/`totpSecret` direkt in der Datenbank zurücksetzen.
- Leistungskatalog und Sitzungstyp-Vorlagen können aktuell nur über
  `prisma/seed.ts` bzw. `npx prisma studio` gepflegt werden, nicht über die
  Weboberfläche. Eine Verwaltungsseite dafür wäre ein sinnvoller nächster
  Ausbauschritt.
- GOZ-/BEMA-Ziffern im Beispielkatalog sind, wie oben beschrieben, vor dem
  echten Abrechnungseinsatz zu verifizieren; die Frequenzlimit-Beispielwerte
  (PZR, Zahnsteinentfernung) sind Praxisbeispiele zur Veranschaulichung der
  Prüfung, keine verbindlichen Vorgaben.
- **Partner-API**: Es gibt noch keine Admin-Oberfläche zur Verwaltung von
  API-Clients (nur das CLI-Skript `npm run api:create-client`), kein
  Key-Rotation-/Widerruf-Endpunkt und kein Nutzungs-/Abrechnungs-Dashboard
  für Partner. Das Rate-Limiting teilt sich zudem die In-Memory-Umsetzung
  mit dem restlichen System (siehe oben).
