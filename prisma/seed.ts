import { PrismaClient } from "@prisma/client";
import { serializeDependsOn } from "../lib/serviceDependency";

const prisma = new PrismaClient();

/**
 * Beispielhafter Startkatalog für die Leistungserfassung.
 *
 * WICHTIG: Dies ist bewusst KEIN vollständiger, abrechnungsverbindlicher
 * GOZ-/BEMA-Katalog. Ziffern sind, wo nicht eindeutig bekannt, mit "–"
 * gekennzeichnet und müssen von der Praxis vor dem produktiven
 * Abrechnungseinsatz gegen das aktuell gültige offizielle Gebühren-
 * verzeichnis (BZÄK/KZBV) geprüft, korrigiert und ergänzt werden.
 * Punktwerte/Eurobeträge sind absichtlich nicht enthalten.
 */
type SeedItem = {
  key: string;
  system: "GOZ" | "BEMA" | "SONSTIGES";
  code: string;
  title: string;
  description?: string;
  category: string;
};

const CATALOG: SeedItem[] = [
  { key: "unters_privat", system: "GOZ", code: "0010", title: "Eingehende Untersuchung", description: "Eingehende Untersuchung zur Feststellung von Zahn-, Mund- und Kieferkrankheiten", category: "Diagnostik & Beratung" },
  { key: "unters_gkv", system: "BEMA", code: "01", title: "Eingehende Untersuchung", description: "Eingehende Untersuchung zur Feststellung von Zahn-, Mund- und Kieferkrankheiten sowie Erhebung des Zahnstatus", category: "Diagnostik & Beratung" },
  { key: "beratung_privat", system: "GOZ", code: "–", title: "Eingehende Beratung", description: "Eingehende Beratung, ggf. unter Einbeziehung eines Patientengesprächs zu Befund und Behandlungsplan", category: "Diagnostik & Beratung" },
  { key: "beratung_gkv", system: "BEMA", code: "–", title: "Eingehende Beratung", description: "Eingehende Beratung", category: "Diagnostik & Beratung" },
  { key: "anamnese", system: "SONSTIGES", code: "–", title: "Anamnese erhoben", description: "Allgemeine und zahnmedizinische Anamnese erhoben und dokumentiert", category: "Diagnostik & Beratung" },
  { key: "psi", system: "GOZ", code: "4005", title: "Parodontaler Screening Index (PSI)", description: "Erhebung des Parodontalen Screening Index", category: "Diagnostik & Beratung" },
  { key: "vitalitaet", system: "GOZ", code: "–", title: "Vitalitätsprüfung", description: "Sensibilitäts-/Vitalitätsprüfung eines oder mehrerer Zähne", category: "Diagnostik & Beratung" },
  { key: "aufklaerung_dokumentiert", system: "SONSTIGES", code: "–", title: "Aufklärung dokumentiert", description: "Patient über Befund, Behandlungsalternativen und Risiken aufgeklärt; Einwilligung dokumentiert", category: "Diagnostik & Beratung" },

  { key: "rx_einzelzahn", system: "GOZ", code: "–", title: "Röntgen Einzelzahnaufnahme", description: "Zahnfilm, digitale Einzelzahnaufnahme", category: "Röntgen" },
  { key: "rx_uebersicht", system: "GOZ", code: "–", title: "Röntgen Übersichtsaufnahme (OPG)", description: "Orthopantomogramm / Panoramaschichtaufnahme", category: "Röntgen" },
  { key: "rx_befundung", system: "SONSTIGES", code: "–", title: "Röntgenbild befundet", description: "Röntgenaufnahme angefertigt und befundet", category: "Röntgen" },

  { key: "anaesthesie_infiltration", system: "GOZ", code: "–", title: "Infiltrationsanästhesie", description: "Lokale Infiltrationsanästhesie", category: "Anästhesie" },
  { key: "anaesthesie_leitung", system: "GOZ", code: "–", title: "Leitungsanästhesie", description: "Leitungsanästhesie", category: "Anästhesie" },

  { key: "zst_entfernung", system: "GOZ", code: "1000", title: "Entfernung harter Zahnbeläge", description: "Entfernung harter Zahnbeläge (Zahnstein), unabhängig vom Ausmaß", category: "Prophylaxe" },
  { key: "pzr", system: "GOZ", code: "1040", title: "Professionelle Zahnreinigung", description: "Entfernung weicher Zahnbeläge, Politur und Fluoridierung sämtlicher Zähne", category: "Prophylaxe" },
  { key: "mundhygiene_instruktion", system: "SONSTIGES", code: "–", title: "Mundhygieneinstruktion", description: "Anleitung zur Mundhygiene gegeben", category: "Prophylaxe" },
  { key: "fluoridierung", system: "GOZ", code: "–", title: "Fluoridierung", description: "Lokale Fluoridierung", category: "Prophylaxe" },

  { key: "kariesexkavation", system: "SONSTIGES", code: "–", title: "Kariesexkavation", description: "Entfernung kariösen Zahnschmelzes/-dentins", category: "Füllungstherapie" },
  { key: "fuellung_einflaechig", system: "GOZ", code: "–", title: "Füllung, einflächig", description: "Kompositfüllung, einflächig", category: "Füllungstherapie" },
  { key: "fuellung_mehrflaechig", system: "GOZ", code: "–", title: "Füllung, mehrflächig", description: "Kompositfüllung, mehrflächig", category: "Füllungstherapie" },
  { key: "fuellung_politur", system: "SONSTIGES", code: "–", title: "Füllung poliert", description: "Politur/Ausarbeitung der gelegten Füllung", category: "Füllungstherapie" },
  { key: "unterfuellung", system: "GOZ", code: "–", title: "Unterfüllung / Aufbaufüllung", description: "Unterfüllung bzw. Aufbaufüllung vor definitiver Versorgung", category: "Füllungstherapie" },

  { key: "wurzelkanal_aufbereitung", system: "GOZ", code: "–", title: "Wurzelkanalaufbereitung", description: "Aufbereitung eines Wurzelkanals", category: "Endodontie" },
  { key: "wurzelkanal_fuellung", system: "GOZ", code: "–", title: "Wurzelkanalfüllung", description: "Medikamentöse Einlage und/oder Wurzelfüllung", category: "Endodontie" },
  { key: "trepanation", system: "GOZ", code: "–", title: "Trepanation", description: "Eröffnung der Pulpakammer als Erstmaßnahme", category: "Endodontie" },

  { key: "extraktion", system: "GOZ", code: "–", title: "Zahnextraktion", description: "Entfernung eines Zahnes", category: "Chirurgie" },
  { key: "wundversorgung", system: "SONSTIGES", code: "–", title: "Wundversorgung / Naht", description: "Blutstillung, ggf. Naht nach chirurgischem Eingriff", category: "Chirurgie" },
  { key: "postop_anweisung", system: "SONSTIGES", code: "–", title: "Postoperative Anweisung", description: "Mündliche und/oder schriftliche Verhaltensanweisung nach dem Eingriff gegeben", category: "Chirurgie" },

  { key: "pa_scaling", system: "BEMA", code: "–", title: "Scaling / Wurzelglättung", description: "Subgingivale Zahnstein-/Belagentfernung mit Wurzelglättung", category: "Parodontologie" },
  { key: "pa_nachkontrolle", system: "SONSTIGES", code: "–", title: "PA-Nachkontrolle", description: "Kontrolle des parodontalen Heilverlaufs", category: "Parodontologie" },
  { key: "upt_reevaluation", system: "BEMA", code: "–", title: "Parodontaler Reevaluationsbefund", description: "Erneute Befunderhebung im Rahmen der Nachsorge (UPT)", category: "Parodontologie" },
  { key: "upt_reinigung", system: "BEMA", code: "–", title: "Subgingivale Instrumentierung (UPT)", description: "Professionelle subgingivale Reinigung im Rahmen der Nachsorgesitzung", category: "Parodontologie" },

  { key: "praeparation", system: "GOZ", code: "–", title: "Zahnpräparation", description: "Präparation eines Zahnes zur Aufnahme von Zahnersatz", category: "Prothetik" },
  { key: "abformung", system: "GOZ", code: "–", title: "Abformung", description: "Abformung eines oder beider Kiefer", category: "Prothetik" },
  { key: "provisorium", system: "GOZ", code: "–", title: "Provisorische Versorgung", description: "Eingliederung eines Provisoriums bis zur definitiven Versorgung", category: "Prothetik" },
  { key: "eingliederung_ersatz", system: "GOZ", code: "–", title: "Eingliederung Zahnersatz", description: "Eingliederung von Zahnersatz/Zahnkrone", category: "Prothetik" },

  { key: "ip_mundhygienestatus", system: "BEMA", code: "–", title: "Erhebung Mundhygienestatus", description: "Erhebung des Mundhygienestatus (Plaque-/Gingivitis-Index) bei Kindern/Jugendlichen", category: "Individualprophylaxe" },
  { key: "ip_ernaehrungsberatung", system: "BEMA", code: "–", title: "Ernährungsberatung", description: "Aufklärung über zahngesunde Ernährung", category: "Individualprophylaxe" },
  { key: "fissuren_versiegelung", system: "BEMA", code: "–", title: "Fissurenversiegelung", description: "Versiegelung kariesfreier Fissuren der bleibenden Molaren", category: "Individualprophylaxe" },

  { key: "notfall_diagnostik", system: "SONSTIGES", code: "–", title: "Schmerzdiagnostik", description: "Diagnostik zur Lokalisation der akuten Schmerzursache", category: "Notfallbehandlung" },
  { key: "notfall_akutmassnahme", system: "SONSTIGES", code: "–", title: "Akutmaßnahme zur Schmerzausschaltung", description: "Sofortmaßnahme zur Beseitigung akuter Schmerzen (z. B. Trepanation, Entlastung)", category: "Notfallbehandlung" },
  { key: "notfall_medikation", system: "SONSTIGES", code: "–", title: "Medikamentöse Versorgung", description: "Verordnung/Abgabe von Schmerz- oder Notfallmedikation", category: "Notfallbehandlung" },

  { key: "schiene_bissregistrierung", system: "GOZ", code: "–", title: "Bissregistrierung", description: "Registrierung der Kieferrelation", category: "Schienentherapie" },
  { key: "schiene_eingliederung", system: "GOZ", code: "–", title: "Eingliederung Aufbissschiene", description: "Einsetzen und Anpassen der Aufbissschiene", category: "Schienentherapie" },
  { key: "schiene_einschleifen", system: "SONSTIGES", code: "–", title: "Einschleifen/Kontrolle Schiene", description: "Okklusale Anpassung und Kontrolle der Schiene", category: "Schienentherapie" },
];

type SeedTemplateItem = { key: string; dependsOn?: string[] };

type SeedTemplate = {
  name: string;
  description: string;
  items: SeedTemplateItem[];
};

function it(key: string, dependsOn?: string[]): SeedTemplateItem {
  return { key, dependsOn };
}

const TEMPLATES: SeedTemplate[] = [
  {
    name: "Kontrolluntersuchung",
    description: "Standard-Recall-/Kontrolltermin",
    items: [it("unters_privat"), it("unters_gkv"), it("psi"), it("rx_einzelzahn"), it("beratung_privat"), it("aufklaerung_dokumentiert")],
  },
  {
    name: "Erstuntersuchung / Neupatient",
    description: "Erster Termin bei neuem Patienten",
    items: [it("anamnese"), it("unters_privat"), it("unters_gkv"), it("rx_uebersicht"), it("rx_befundung"), it("psi"), it("beratung_privat"), it("aufklaerung_dokumentiert")],
  },
  {
    name: "Füllungstherapie",
    description: "Kariesbehandlung mit Füllung",
    items: [
      it("unters_privat"),
      it("aufklaerung_dokumentiert"),
      it("anaesthesie_infiltration"),
      it("kariesexkavation"),
      it("unterfuellung", ["kariesexkavation"]),
      it("fuellung_einflaechig", ["kariesexkavation"]),
      it("fuellung_mehrflaechig", ["kariesexkavation"]),
      it("fuellung_politur", ["fuellung_einflaechig", "fuellung_mehrflaechig"]),
    ],
  },
  {
    name: "Professionelle Zahnreinigung (PZR)",
    description: "Prophylaxesitzung",
    items: [it("psi"), it("zst_entfernung"), it("pzr"), it("fluoridierung"), it("mundhygiene_instruktion")],
  },
  {
    name: "Chirurgischer Eingriff (Extraktion)",
    description: "Zahnentfernung",
    items: [
      it("unters_privat"),
      it("aufklaerung_dokumentiert"),
      it("anaesthesie_leitung"),
      it("anaesthesie_infiltration"),
      it("extraktion"),
      it("wundversorgung", ["extraktion"]),
      it("postop_anweisung", ["extraktion"]),
    ],
  },
  {
    name: "Parodontalbehandlung",
    description: "Systematische PA-Behandlung",
    items: [it("psi"), it("aufklaerung_dokumentiert"), it("anaesthesie_infiltration"), it("pa_scaling"), it("mundhygiene_instruktion"), it("pa_nachkontrolle")],
  },
  {
    name: "Unterstützende Parodontitistherapie (UPT)",
    description: "Nachsorgesitzung im Rahmen der PAR-Behandlung",
    items: [
      it("psi"),
      it("upt_reevaluation"),
      it("upt_reinigung", ["upt_reevaluation"]),
      it("mundhygiene_instruktion"),
      it("fluoridierung"),
      it("pa_nachkontrolle", ["upt_reinigung"]),
    ],
  },
  {
    name: "Endodontische Behandlung (Wurzelkanal)",
    description: "Wurzelkanalbehandlung — vier Schritte, jeder baut auf dem vorherigen auf",
    items: [
      it("unters_privat"),
      it("aufklaerung_dokumentiert"),
      it("rx_einzelzahn"),
      it("anaesthesie_leitung"),
      it("vitalitaet"),
      it("trepanation", ["vitalitaet"]),
      it("wurzelkanal_aufbereitung", ["trepanation"]),
      it("wurzelkanal_fuellung", ["wurzelkanal_aufbereitung"]),
    ],
  },
  {
    name: "Prothetische Versorgung",
    description: "Zahnersatz-Termin",
    items: [
      it("unters_privat"),
      it("aufklaerung_dokumentiert"),
      it("praeparation"),
      it("abformung", ["praeparation"]),
      it("provisorium", ["praeparation"]),
      it("eingliederung_ersatz", ["abformung"]),
    ],
  },
  {
    name: "Individualprophylaxe (Kind/Jugendliche)",
    description: "IP-Sitzung für Kinder und Jugendliche",
    items: [it("aufklaerung_dokumentiert"), it("ip_mundhygienestatus"), it("ip_ernaehrungsberatung"), it("mundhygiene_instruktion"), it("fluoridierung"), it("fissuren_versiegelung")],
  },
  {
    name: "Notfallbehandlung / Schmerzbehandlung",
    description: "Akuttermin außerhalb der planmäßigen Behandlung",
    items: [
      it("unters_privat"),
      it("unters_gkv"),
      it("notfall_diagnostik"),
      it("anaesthesie_infiltration"),
      it("notfall_akutmassnahme", ["notfall_diagnostik"]),
      it("notfall_medikation"),
      it("aufklaerung_dokumentiert"),
    ],
  },
  {
    name: "Schienentherapie (Aufbissschiene)",
    description: "Anfertigung und Eingliederung einer Aufbissschiene",
    items: [
      it("unters_privat"),
      it("aufklaerung_dokumentiert"),
      it("abformung"),
      it("schiene_bissregistrierung", ["abformung"]),
      it("schiene_eingliederung", ["schiene_bissregistrierung"]),
      it("schiene_einschleifen", ["schiene_eingliederung"]),
    ],
  },
];

async function main() {
  console.log("Seede globalen Leistungskatalog…");

  const itemIdByKey = new Map<string, string>();
  for (const item of CATALOG) {
    const existing = await prisma.serviceCatalogItem.findFirst({
      where: { practiceId: null, system: item.system, code: item.code, title: item.title },
    });
    const record =
      existing ??
      (await prisma.serviceCatalogItem.create({
        data: {
          practiceId: null,
          system: item.system,
          code: item.code,
          title: item.title,
          description: item.description,
          category: item.category,
        },
      }));
    itemIdByKey.set(item.key, record.id);
  }

  console.log(`Katalog: ${itemIdByKey.size} Positionen.`);
  console.log("Seede Sitzungstyp-Vorlagen…");

  for (const tpl of TEMPLATES) {
    let template = await prisma.serviceTemplate.findFirst({
      where: { practiceId: null, name: tpl.name },
    });
    if (!template) {
      template = await prisma.serviceTemplate.create({
        data: { practiceId: null, name: tpl.name, description: tpl.description },
      });
    } else {
      await prisma.serviceTemplate.update({ where: { id: template.id }, data: { description: tpl.description } });
    }

    for (let i = 0; i < tpl.items.length; i++) {
      const seedItem = tpl.items[i];
      const catalogItemId = itemIdByKey.get(seedItem.key);
      if (!catalogItemId) continue;
      const dependsOnIds = (seedItem.dependsOn ?? [])
        .map((key) => itemIdByKey.get(key))
        .filter((v): v is string => !!v);

      await prisma.serviceTemplateItem.upsert({
        where: { templateId_catalogItemId: { templateId: template.id, catalogItemId } },
        update: { position: i, dependsOn: serializeDependsOn(dependsOnIds) },
        create: { templateId: template.id, catalogItemId, position: i, dependsOn: serializeDependsOn(dependsOnIds) },
      });
    }
  }

  console.log(`Vorlagen: ${TEMPLATES.length}.`);
  console.log("Fertig.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
