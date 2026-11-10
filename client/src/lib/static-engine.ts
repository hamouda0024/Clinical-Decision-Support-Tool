import type { AssessmentInput, AssessmentResult, CatalogResponse } from '../../../shared/types';
import { buildCatalog } from '../../../server/data/catalog-response.js';
import { runAssessment } from '../../../server/engine/assessment.js';

/**
 * GitHub Pages build: no Express server is available, so the exact same
 * knowledge base and scoring engine run inside the browser. Nothing leaves the
 * device and no patient data is stored.
 */
export function localCatalog(): CatalogResponse {
  return buildCatalog();
}

export function localAssessment(input: AssessmentInput): AssessmentResult {
  return runAssessment(input);
}
