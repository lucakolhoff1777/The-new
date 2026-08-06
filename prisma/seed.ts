import { PrismaClient } from "@prisma/client";

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

  { key: "abformung", system: "GOZ", code: "–", title: "Abformung", description: "Abformung eines oder beider Kiefer", category: "Prothetik" },
  { key: "eingliederung_ersatz", system: "GOZ", code: "–", title: "Eingliederung Zahnersatz", description: "Eingliederung von Zahnersatz/Zahnkrone", category: "Prothetik" },

  { key: "aufklaerung_dokumentiert", system: "SONSTIGES", code: "–", title: "Aufklärung dokumentiert", description: "Patient über Befund, Behandlungsalternativen und Risiken aufgeklärt; Einwilligung dokumentiert", category: "Diagnostik & Beratung" },
];

type SeedTemplate = {
  name: string;
  description: string;
  itemKeys: string[];
};

const TEMPLATES: SeedTemplate[] = [
  {
    name: "Kontrolluntersuchung",
    description: "Standard-Recall-/Kontrolltermin",
    itemKeys: ["unters_privat", "unters_gkv", "psi", "rx_einzelzahn", "beratung_privat", "aufklaerung_dokumentiert"],
  },
  {
    name: "Erstuntersuchung / Neupatient",
    description: "Erster Termin bei neuem Patienten",
    itemKeys: ["anamnese", "unters_privat", "unters_gkv", "rx_uebersicht", "rx_befundung", "psi", "beratung_privat", "aufklaerung_dokumentiert"],
  },
  {
    name: "Füllungstherapie",
    description: "Kariesbehandlung mit Füllung",
    itemKeys: ["unters_privat", "aufklaerung_dokumentiert", "anaesthesie_infiltration", "kariesexkavation", "unterfuellung", "fuellung_einflaechig", "fuellung_mehrflaechig", "fuellung_politur"],
  },
  {
    name: "Professionelle Zahnreinigung (PZR)",
    description: "Prophylaxesitzung",
    itemKeys: ["psi", "zst_entfernung", "pzr", "fluoridierung", "mundhygiene_instruktion"],
  },
  {
    name: "Chirurgischer Eingriff (Extraktion)",
    description: "Zahnentfernung",
    itemKeys: ["unters_privat", "aufklaerung_dokumentiert", "anaesthesie_leitung", "anaesthesie_infiltration", "extraktion", "wundversorgung", "postop_anweisung"],
  },
  {
    name: "Parodontalbehandlung",
    description: "Systematische PA-Behandlung",
    itemKeys: ["psi", "aufklaerung_dokumentiert", "anaesthesie_infiltration", "pa_scaling", "mundhygiene_instruktion", "pa_nachkontrolle"],
  },
  {
    name: "Endodontische Behandlung (Wurzelkanal)",
    description: "Wurzelkanalbehandlung",
    itemKeys: ["unters_privat", "aufklaerung_dokumentiert", "rx_einzelzahn", "anaesthesie_leitung", "vitalitaet", "trepanation", "wurzelkanal_aufbereitung", "wurzelkanal_fuellung"],
  },
  {
    name: "Prothetische Versorgung",
    description: "Zahnersatz-Termin",
    itemKeys: ["unters_privat", "aufklaerung_dokumentiert", "abformung", "eingliederung_ersatz"],
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
    }

    for (let i = 0; i < tpl.itemKeys.length; i++) {
      const catalogItemId = itemIdByKey.get(tpl.itemKeys[i]);
      if (!catalogItemId) continue;
      await prisma.serviceTemplateItem.upsert({
        where: { templateId_catalogItemId: { templateId: template.id, catalogItemId } },
        update: { position: i },
        create: { templateId: template.id, catalogItemId, position: i },
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
