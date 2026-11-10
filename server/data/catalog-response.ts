import type { CatalogResponse } from '../../shared/types.js';
import { DURATION_UNITS, LIMITS, SPECIALTIES, SYMPTOMS, SYMPTOM_GROUPS, VITALS } from './catalog.js';

/**
 * Single source of truth for the catalogue payload served by `GET /api/catalog`
 * and bundled into the static (GitHub Pages) build.
 */
export function buildCatalog(): CatalogResponse {
  return {
    symptoms: SYMPTOMS,
    symptomGroups: SYMPTOM_GROUPS,
    specialties: SPECIALTIES,
    vitals: VITALS,
    durationUnits: DURATION_UNITS,
    limits: { minAge: LIMITS.minAge, maxAge: LIMITS.maxAge, maxSymptoms: LIMITS.maxSymptoms },
  };
}
