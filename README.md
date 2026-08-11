# Luca Kolhoff — Privatpraxis für Physiotherapie

Website und internes Praxissystem. Kein Build, kein Framework: HTML, CSS und
Vanilla-JavaScript. Zum Ansehen genügt ein statischer Server.

```bash
python3 -m http.server 8000     # dann http://localhost:8000
```

## Seiten

| Datei | Was |
|---|---|
| `index.html` | Startseite |
| `termin.html` | Online-Buchung mit Echtzeit-Verfügbarkeit |
| `preise.html` | Öffentliche Preisliste |
| `erster-termin.html` | Was mitbringen, was kostet es, Rückrufservice |
| `termin-verwalten.html` | Termin absagen, verschieben, in den eigenen Kalender legen |
| `uebungen.html` | Übungsplan für zwischen den Terminen, mit Wochenkontrolle |
| `en.html` | English information |
| `impressum.html`, `datenschutz.html` | Pflichtseiten |
| `plan.html` | **Interner Bereich** — Tagesplan, Anfragen, Patienten, Berichte, Rezepte, Abrechnung, Team |

### Patientenlinks

`termin-verwalten.html` und `uebungen.html` öffnen sich mit `?c=CODE`. Der Code
steht in `practice-data.js` bei jeder Patientin und jedem Patienten
(`code`). Zum Ausprobieren: **9HHADE**.

Er ersetzt hier ein Login. Für den echten Betrieb gehört pro Termin ein
einmaliger Link verschickt, kein dauerhaft gültiger Code — sonst kommt jeder,
der einmal einen Link bekommen hat, für immer an die Termine dieser Person.

## Daten

`assets/js/practice-data.js` ist die **einzige** Datenquelle. Website, Buchung
und Intranet lesen daraus, damit ein Termin nicht auf einer Seite frei und auf
der anderen belegt sein kann. Darin stehen:

Therapeut:innen · Räume · Schichtpläne · Leistungskatalog mit Preisen ·
Beispielwoche · Anwesenheit je Termin · Abwesenheiten · Raumblocker ·
Verordnungen · Patientenstamm mit Ausfallhistorie · Übungskatalog und
Übungspläne · Behandlungsberichte · Warteliste · Monatsverlauf ·
Bewertungen — dazu die Verfügbarkeitsberechnung und der ICS-Export.

**Alles darin ist Beispieldatenbestand.** Vor dem echten Einsatz ersetzen.

Die Beispielwoche wurde mit einem Generator erzeugt, der Doppelbelegungen von
Raum, Person und Patient ausschließt und die Mittagspause freihält.

## Vor dem Livegang

Diese Liste ist nicht optional. Die ersten drei Punkte sind rechtlich relevant.

### 1. Interner Bereich serverseitig absichern

Die Passwortabfrage in `plan.html` ist eine **Sichtblende, kein Schutz** — das
Passwort steht im Quelltext. Solange das so ist, dürfen dort **keine echten
Patientendaten** stehen: Namen zusammen mit Diagnosen, Behandlungen und
Rechnungsbeträgen sind Gesundheitsdaten nach Art. 9 DSGVO.

Echter Schutz, in aufsteigender Güte:

1. **HTTP-Basic-Auth** beim Hoster — der Block dazu steht auskommentiert in
   `.htaccess`. Reicht für den Anfang, aber alle teilen ein Passwort.
2. **Verzeichnisschutz im Hoster-Panel** — dasselbe, nur klickbar.
3. **Richtiger Login mit Rollen und Server-Backend** — nötig, sobald echte
   Akten gepflegt werden. Dann gehört auch `practice-data.js` hinter eine API
   statt in eine öffentlich abrufbare Datei.

**Prüfen:** `/plan.html` im privaten Fenster öffnen. Wenn nicht *vor* dem
Seitenaufbau nach einem Passwort gefragt wird, ist nichts geschützt.

### 2. Impressum und Datenschutzerklärung ausfüllen

Alle mit gestrichelter Linie markierten Stellen (`[data-placeholder]`) sind
Platzhalter: Anschrift, Telefon, Steuernummer, Berufshaftpflicht, Aufsichts-
behörde. Ein unvollständiges Impressum ist abmahnfähig. Die Datenschutz-
erklärung ist eine sorgfältige Vorlage, aber keine Rechtsberatung — wegen der
Gesundheitsdaten vor dem Livegang prüfen lassen.

### 3. ~~Schriften lokal einbinden~~ — erledigt

Cormorant und Karla liegen unter `assets/fonts/` und werden über
`assets/css/fonts.css` eingebunden. Es geht keine Anfrage mehr an Google, und
die Seite lädt einen Roundtrip zu einem fremden Host weniger. Drei
Variable-Font-Dateien, zusammen 88 KB.

### 4. Eigene Fotos

Die Innenaufnahmen stammen nicht aus dieser Praxis. Sie funktionieren als
Moodboard, müssen aber durch eigene oder lizenzierte Bilder ersetzt werden.
Danach die Bildnachweise im Impressum ergänzen.

### 5. Echte Daten eintragen

Preise, Team, Schichtpläne und Öffnungszeiten in `practice-data.js`;
Adresse, Telefon und Koordinaten in der JSON-LD-Auszeichnung im `<head>` von
`index.html`; die Domain in `sitemap.xml`, `robots.txt` und allen
`canonical`-Angaben.

### 6. Google Business Profile

Anlegen und verifizieren — ohne das findet dich die lokale Suche nicht. Danach
die Beispielbewertungen in `practice-data.js` durch die echten ersetzen. Wer
sie automatisch ziehen will, braucht die Places-API mit Place-ID und einen
kleinen Server-Proxy: der API-Schlüssel darf nicht im Frontend stehen.

## Was noch einen Server braucht

Das Frontend ist fertig, die Logik stimmt — aber diese drei Dinge kann eine
statische Seite grundsätzlich nicht leisten:

- **Buchung verbindlich machen.** Nur ein Server kann einen Termin genau
  einmal vergeben. Aktuell landet eine Anfrage im `localStorage` des Browsers
  und taucht im Intranet unter „Anfragen“ auf — im selben Browser.
- **Erinnerungen wirklich versenden.** Die Liste, wer wann welche Erinnerung
  bekommt, wird korrekt berechnet. Für den Versand braucht es einen Cron-Job
  und einen SMS- oder Mail-Dienstleister (mit Auftragsverarbeitungsvertrag).
- **Rollen absichern.** Leitung, Therapie und Empfang sehen unterschiedlich
  viel. Das ist eine Anzeigelogik, keine Zugriffskontrolle — die entsteht erst
  serverseitig.
- **Berichte dauerhaft speichern.** Ein Behandlungsbericht ist nach § 630f BGB
  zehn Jahre aufzubewahren und muss nachträgliche Änderungen nachvollziehbar
  machen. Beides kann ein `localStorage` nicht: er hängt an einem Browser und
  ist beim nächsten Cache-Leeren weg. Die Eingabemaske stimmt, die Ablage
  gehört auf einen Server mit Änderungshistorie.
- **Absagen und Verschiebungen wirklich eintragen.** Was über
  `termin-verwalten.html` hereinkommt, landet als Anfrage im Intranet und
  verschwindet aus der Terminliste dieses Browsers. Den Kalender ändert es
  nicht — das kann nur ein Server.

## Diktat

Die Berichtsmaske hat neben jedem Feld ein Mikrofon. Es nutzt die
Web-Speech-API des Browsers (`SpeechRecognition`), eingestellt auf Deutsch, mit
Zwischenergebnissen während des Sprechens. Das läuft ohne zusätzlichen Dienst
und ohne Kosten.

Zwei Einschränkungen, die man kennen sollte:

- **Nicht jeder Browser kann es.** Chrome, Edge und Safari ja, Firefox nicht.
  Wo es fehlt, sind die Mikrofone deaktiviert und ein Hinweis steht darüber —
  tippen geht immer.
- **Chrome schickt das Audio zur Erkennung an Google.** Für Diktate über
  Patienten ist das ohne Prüfung heikel. Wer das sauber lösen will, nimmt eine
  lokale Erkennung (z. B. Whisper auf dem eigenen Server) — die Eingabemaske
  bleibt dieselbe, nur die Quelle des Textes ändert sich.

## Deployment

`.htaccess` (Apache), `netlify.toml` und `vercel.json` liegen bei und setzen
Sicherheits-Header, HTTPS-Weiterleitung und `noindex` für den internen
Bereich. Der Passwortschutz ist in allen dreien vorbereitet und
auskommentiert — er muss bewusst aktiviert werden.

## Intranet-Zugänge (Demo)

| Rolle | Passwort | Sieht |
|---|---|---|
| Praxisleitung | `2026` | alles, inklusive Umsatz |
| Therapeut:in | `team26` | eigener Plan, eigene Patienten, kein Umsatz |
| Empfang | `front26` | Termine, Anfragen, Kontaktdaten, kein Umsatz |
