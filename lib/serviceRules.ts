import { parseDependsOn } from "@/lib/serviceDependency";

export interface FaktorRules {
  faktorMin: number | null;
  faktorMax: number | null;
  regelhoechstfaktor: number | null;
  begruendungspflichtAbFaktor: number | null;
}

/**
 * Prüft einen einzelnen Faktor gegen die Regeln einer Gebührenziffer
 * (§5 GOZ-Logik): Faktor muss im erlaubten Bereich liegen, und ab dem
 * Schwellenwert ist eine schriftliche Begründung Pflicht. Gibt eine
 * deutschsprachige Fehlermeldung zurück oder null, wenn alles passt.
 */
export function validateFaktor(
  faktor: number | null | undefined,
  begruendung: string | null | undefined,
  rules: FaktorRules,
  itemLabel: string
): string | null {
  if (faktor == null) return null;

  if (rules.faktorMin != null && faktor < rules.faktorMin) {
    return `Faktor bei "${itemLabel}" liegt unter dem zulässigen Minimum (${rules.faktorMin}).`;
  }
  if (rules.faktorMax != null && faktor > rules.faktorMax) {
    return `Faktor bei "${itemLabel}" liegt über dem zulässigen Maximum (${rules.faktorMax}).`;
  }

  const threshold = rules.begruendungspflichtAbFaktor ?? rules.regelhoechstfaktor;
  if (threshold != null && faktor > threshold && !begruendung?.trim()) {
    return `Bei "${itemLabel}" liegt der Faktor (${faktor}) über dem Regelhöchstfaktor (${threshold}) - dafür ist eine schriftliche Begründung erforderlich.`;
  }

  return null;
}

export interface ExclusionItem {
  id: string;
  title: string;
  ausschlussMit: string[];
}

/**
 * Findet Paare gleichzeitig als erbracht markierter Positionen, die laut
 * Katalog nicht gemeinsam abgerechnet werden dürfen.
 */
export function findExclusionConflicts(
  performedIds: string[],
  itemsById: Map<string, ExclusionItem>
): Array<{ a: ExclusionItem; b: ExclusionItem }> {
  const conflicts: Array<{ a: ExclusionItem; b: ExclusionItem }> = [];
  const performedSet = new Set(performedIds);
  const seen = new Set<string>();

  for (const id of performedIds) {
    const item = itemsById.get(id);
    if (!item) continue;
    for (const excludedId of item.ausschlussMit) {
      if (!performedSet.has(excludedId)) continue;
      const other = itemsById.get(excludedId);
      if (!other) continue;
      const pairKey = [id, excludedId].sort().join("|");
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);
      conflicts.push({ a: item, b: other });
    }
  }

  return conflicts;
}

export interface GueltigkeitRules {
  gueltigAb: Date | null;
  gueltigBis: Date | null;
}

/**
 * Prüft, ob das Behandlungsdatum innerhalb des Gültigkeitszeitraums einer
 * Katalogposition liegt (z. B. PAR-Positionen erst ab der Reform vom
 * 1.7.2021). Ohne Behandlungsdatum wird nicht geprüft.
 */
export function validateGueltigkeit(
  treatmentDate: Date | null,
  rules: GueltigkeitRules,
  itemLabel: string
): string | null {
  if (!treatmentDate) return null;

  if (rules.gueltigAb && treatmentDate < rules.gueltigAb) {
    return `"${itemLabel}" ist erst ab dem ${rules.gueltigAb.toLocaleDateString("de-DE")} gültig - das gewählte Behandlungsdatum liegt davor.`;
  }
  if (rules.gueltigBis && treatmentDate > rules.gueltigBis) {
    return `"${itemLabel}" war nur bis zum ${rules.gueltigBis.toLocaleDateString("de-DE")} gültig - das gewählte Behandlungsdatum liegt danach.`;
  }

  return null;
}

export { parseDependsOn as parseIdList };
