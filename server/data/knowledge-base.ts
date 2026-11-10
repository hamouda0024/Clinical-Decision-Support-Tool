import type { GovernanceSummary } from '../../shared/types.js';
import type { Disease } from '../engine/types.js';
import { SPECIALTIES, SYMPTOMS } from './catalog.js';
import { DISEASE_COURSE } from './course.js';
import { KNOWLEDGE_BASE_SCHEMA_VERSION } from './governance.js';
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

/**
 * Pure integrity checks, exported so governance rules can be tested with
 * fabricated entries without weakening the startup guard.
 */
export function collectKnowledgeBaseProblems(diseases: readonly Disease[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const disease of diseases) {
    if (ids.has(disease.id)) problems.push(`duplicate disease id: ${disease.id}`);
    ids.add(disease.id);

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

    // Governance: an entry may only claim approval with a named reviewer, a
    // valid review date and at least one authoritative reference. This prevents
    // content from appearing clinically validated by accident.
    if (disease.review?.status === 'approved') {
      if (!disease.review.reviewer?.trim()) {
        problems.push(`${disease.id}: approved without a named reviewer`);
      }
      const reviewedAt = disease.review.lastReviewedAt;
      if (!reviewedAt || Number.isNaN(Date.parse(reviewedAt))) {
        problems.push(`${disease.id}: approved without a valid lastReviewedAt date`);
      }
      if (!disease.references || disease.references.length === 0) {
        problems.push(`${disease.id}: approved without at least one reference`);
      }
    }
  }

  for (const id of Object.keys(DISEASE_COURSE)) {
    if (!ids.has(id)) problems.push(`course mapping references unknown disease id: ${id}`);
  }

  return problems;
}

/** Fails fast at startup if the knowledge base is internally inconsistent. */
function validateKnowledgeBase(): void {
  for (const disease of DISEASES) diseasesById.set(disease.id, disease);
  const problems = collectKnowledgeBaseProblems(DISEASES);

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

function reviewStatusOf(disease: Disease) {
  return disease.review?.status ?? 'unreviewed';
}

const REVIEWED_DISEASES = DISEASES.filter((disease) => reviewStatusOf(disease) === 'approved');
const IN_REVIEW_DISEASES = DISEASES.filter((disease) => reviewStatusOf(disease) === 'in_review');
const REVIEWERS = [
  ...new Set(
    REVIEWED_DISEASES.map((disease) => disease.review?.reviewer?.trim()).filter(
      (name): name is string => Boolean(name),
    ),
  ),
];
const REVIEW_DATES = REVIEWED_DISEASES.map((disease) => disease.review?.lastReviewedAt)
  .filter((date): date is string => Boolean(date))
  .sort();

/**
 * Aggregate governance state derived from the entries. A knowledge base is
 * `approved` only when every entry is approved; any partially reviewed content
 * stays `in_review`, and unreviewed content is reported as such.
 */
export const KNOWLEDGE_BASE_GOVERNANCE: GovernanceSummary = {
  schemaVersion: KNOWLEDGE_BASE_SCHEMA_VERSION,
  contentStatus:
    REVIEWED_DISEASES.length === KNOWLEDGE_BASE_SIZE
      ? 'approved'
      : REVIEWED_DISEASES.length > 0 || IN_REVIEW_DISEASES.length > 0
        ? 'in_review'
        : 'unreviewed',
  totalEntries: KNOWLEDGE_BASE_SIZE,
  reviewedEntries: REVIEWED_DISEASES.length,
  reviewer: REVIEWERS.length === 1 ? REVIEWERS[0]! : null,
  lastReviewedAt: REVIEW_DATES.at(-1) ?? null,
  clinicalReviewRequired: REVIEWED_DISEASES.length < KNOWLEDGE_BASE_SIZE,
};
