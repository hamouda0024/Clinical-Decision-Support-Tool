import type { Disease } from '../engine/types.js';
import { SPECIALTIES, SYMPTOMS } from './catalog.js';
import { DISEASE_COURSE } from './course.js';
import { CARDIO_RESPIRATORY_DISEASES } from './diseases/cardio-respiratory.js';
import { GASTRO_RENAL_DISEASES } from './diseases/gastro-renal.js';
import { NEURO_ENDOCRINE_DISEASES } from './diseases/neuro-endocrine.js';

/**
 * Mock clinical knowledge base.
 *
 * This is an educational, deliberately simplified knowledge base — it is not a
 * validated clinical guideline and must not be used as the sole basis for care.
 * Extend it only through clinical review (see docs/CLINICAL_LOGIC.md).
 */
export const DISEASES: Disease[] = [
  ...CARDIO_RESPIRATORY_DISEASES,
  ...GASTRO_RENAL_DISEASES,
  ...NEURO_ENDOCRINE_DISEASES,
];

const symptomIds = new Set(SYMPTOMS.map((s) => s.id));
const specialtyIds = new Set(SPECIALTIES.map((s) => s.id));
const diseasesById = new Map<string, Disease>();

/** Fails fast at startup if the knowledge base is internally inconsistent. */
function validateKnowledgeBase(): void {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const disease of DISEASES) {
    if (ids.has(disease.id)) problems.push(`duplicate disease id: ${disease.id}`);
    ids.add(disease.id);
    diseasesById.set(disease.id, disease);

    for (const symptom of disease.symptoms) {
      if (!symptomIds.has(symptom.id)) {
        problems.push(`${disease.id}: unknown symptom "${symptom.id}"`);
      }
    }
    for (const key of disease.keyFindings) {
      if (!symptomIds.has(key)) {
        problems.push(`${disease.id}: unknown key finding "${key}"`);
      }
    }
    for (const specialty of disease.specialties) {
      if (!specialtyIds.has(specialty)) {
        problems.push(`${disease.id}: unknown specialty "${specialty}"`);
      }
    }
    if (disease.symptoms.length === 0) {
      problems.push(`${disease.id}: no symptoms defined`);
    }
    if (!DISEASE_COURSE[disease.id]) {
      problems.push(`${disease.id}: missing clinical course mapping`);
    }
  }

  for (const id of Object.keys(DISEASE_COURSE)) {
    if (!ids.has(id)) problems.push(`course mapping references unknown disease id: ${id}`);
  }

  if (problems.length > 0) {
    throw new Error(`Invalid clinical knowledge base:\n- ${problems.join('\n- ')}`);
  }
}

validateKnowledgeBase();

export function getDiseaseById(id: string): Disease | undefined {
  return diseasesById.get(id);
}

export function listDiseases(): Disease[] {
  return DISEASES;
}

export const KNOWLEDGE_BASE_SIZE = DISEASES.length;
