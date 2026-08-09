export interface DependencyItem {
  id: string;
  dependsOn: string[];
}

export function parseDependsOn(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function serializeDependsOn(ids: string[]): string | null {
  return ids.length ? ids.join(",") : null;
}

/**
 * Resolves which items are effectively performed once dependency chains are
 * taken into account. An item whose prerequisites are not (effectively)
 * performed is forced to false, regardless of its own toggle — it could not
 * logically have happened. Dependencies use OR semantics: any one satisfied
 * prerequisite is enough. Cycle-safe via a resolving guard.
 */
export function computeEffectivePerformed(
  items: DependencyItem[],
  ownPerformed: Record<string, boolean>
): Record<string, boolean> {
  const byId = new Map(items.map((it) => [it.id, it]));
  const memo = new Map<string, boolean>();
  const resolving = new Set<string>();

  function resolve(id: string): boolean {
    if (memo.has(id)) return memo.get(id)!;
    const item = byId.get(id);
    const own = !!ownPerformed[id];
    if (!item || item.dependsOn.length === 0) {
      memo.set(id, own);
      return own;
    }
    if (resolving.has(id)) {
      // dependency cycle guard - treat as unresolved rather than looping
      return false;
    }
    resolving.add(id);
    const parentOk = item.dependsOn.some((pid) => resolve(pid));
    resolving.delete(id);
    const effective = own && parentOk;
    memo.set(id, effective);
    return effective;
  }

  const result: Record<string, boolean> = {};
  items.forEach((it) => {
    result[it.id] = resolve(it.id);
  });
  return result;
}
