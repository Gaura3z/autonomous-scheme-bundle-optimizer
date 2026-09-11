/**
 * Deterministic Scheme Conflict Detection Engine
 * Evaluates verified incompatibility edges across active eligible schemes.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { Scheme, SchemeConflict } from '../types';
import { MASTER_CONFLICTS } from '../data/conflicts';

export interface ActiveConflict {
  conflict: SchemeConflict;
  schemeA: Scheme;
  schemeB: Scheme;
}

export function detectActiveConflicts(eligibleSchemes: Scheme[]): ActiveConflict[] {
  const eligibleIds = new Set(eligibleSchemes.map(s => s.id));
  const activeConflicts: ActiveConflict[] = [];

  for (const conflict of MASTER_CONFLICTS) {
    if (eligibleIds.has(conflict.schemeIdA) && eligibleIds.has(conflict.schemeIdB)) {
      const schemeA = eligibleSchemes.find(s => s.id === conflict.schemeIdA);
      const schemeB = eligibleSchemes.find(s => s.id === conflict.schemeIdB);

      if (schemeA && schemeB) {
        activeConflicts.push({
          conflict,
          schemeA,
          schemeB
        });
      }
    }
  }

  return activeConflicts;
}

export const detectSchemeConflicts = detectActiveConflicts;

export function areSchemesConflicted(schemeId1: string, schemeId2: string): SchemeConflict | null {
  for (const conflict of MASTER_CONFLICTS) {
    if (
      (conflict.schemeIdA === schemeId1 && conflict.schemeIdB === schemeId2) ||
      (conflict.schemeIdA === schemeId2 && conflict.schemeIdB === schemeId1)
    ) {
      return conflict;
    }
  }
  return null;
}
