import { describe, expect, it } from 'vitest';
import type { AssessmentInput } from '../../shared/types.js';
import { buildCatalog } from '../data/catalog-response.js';
import {
  DISEASES,
  KNOWLEDGE_BASE_GOVERNANCE,
  KNOWLEDGE_BASE_SIZE,
  collectKnowledgeBaseProblems,
} from '../data/knowledge-base.js';
import { CLINICAL_LIMITATIONS, MIN_ADULT_AGE } from '../data/governance.js';
import { runAssessment } from './assessment.js';

function makeInput(overrides: Partial<AssessmentInput> = {}): AssessmentInput {
  return {
    age: 45,
    sex: 'male',
    specialty: 'emergency',
    duration: { value: 2, unit: 'hours' },
    symptoms: ['chest_pain'],
    vitals: {
      systolicBP: 125,
      diastolicBP: 80,
      heartRate: 82,
      temperature: 37,
      spo2: 98,
    },
    ...overrides,
  };
}

describe('clinical governance', () => {
  it('reports the knowledge base as unreviewed until every entry is signed off', () => {
    expect(KNOWLEDGE_BASE_GOVERNANCE.totalEntries).toBe(KNOWLEDGE_BASE_SIZE);
    expect(DISEASES.length).toBe(24);
    expect(KNOWLEDGE_BASE_GOVERNANCE.contentStatus).toBe('unreviewed');
    expect(KNOWLEDGE_BASE_GOVERNANCE.reviewedEntries).toBe(0);
    expect(KNOWLEDGE_BASE_GOVERNANCE.reviewer).toBeNull();
    expect(KNOWLEDGE_BASE_GOVERNANCE.clinicalReviewRequired).toBe(true);
    expect(KNOWLEDGE_BASE_GOVERNANCE.schemaVersion).toBe('2.0.0');
  });

  it('rejects an entry that claims approval without reviewer, date and references', () => {
    const base = DISEASES[0]!;
    const problems = collectKnowledgeBaseProblems([
      { ...base, review: { status: 'approved' }, references: undefined },
    ]);
    expect(problems).toContain(`${base.id}: approved without a named reviewer`);
    expect(problems).toContain(`${base.id}: approved without a valid lastReviewedAt date`);
    expect(problems).toContain(`${base.id}: approved without at least one reference`);
  });

  it('accepts a fully traceable approved entry', () => {
    const base = DISEASES[0]!;
    const problems = collectKnowledgeBaseProblems([
      {
        ...base,
        review: {
          status: 'approved',
          reviewer: 'Dr. Example',
          lastReviewedAt: '2026-01-15',
        },
        references: [
          { title: 'Example guideline', organization: 'WHO', year: 2025 },
        ],
      },
    ]);
    // Other entries are intentionally absent from this isolated fixture.
    expect(problems.filter((problem) => problem.startsWith(base.id))).toEqual([]);
  });

  it('exposes governance in the catalogue so the UI can warn before any assessment', () => {
    const catalog = buildCatalog();
    expect(catalog.governance).toEqual(KNOWLEDGE_BASE_GOVERNANCE);
  });
});

describe('assessment limitations and score labelling', () => {
  it('attaches governance and explicit limitations to every result', () => {
    const result = runAssessment(makeInput());
    expect(result.meta.governance).toEqual(KNOWLEDGE_BASE_GOVERNANCE);
    expect(result.meta.limitations).toEqual(
      expect.arrayContaining([...CLINICAL_LIMITATIONS]),
    );
  });

  it('withholds adult differentials and actions below the supported age', () => {
    const child = runAssessment(makeInput({ age: MIN_ADULT_AGE - 1 }));
    expect(child.meta.limitations[0]).toContain(`${MIN_ADULT_AGE}`);
    expect(child.meta.pediatricUnsupported).toBe(true);
    expect(child.differentials).toEqual([]);

    const adult = runAssessment(makeInput({ age: MIN_ADULT_AGE }));
    expect(adult.meta.pediatricUnsupported).toBe(false);
    expect(adult.differentials.length).toBeGreaterThan(0);
    expect(adult.meta.limitations.join(' ')).not.toContain('أقل من');
  });

  it('removes unreviewed medication names and dosages from the API result', () => {
    const result = runAssessment(makeInput());
    expect(result.meta.medicationContentHidden).toBe(true);
    expect(result.differentials.length).toBeGreaterThan(0);
    for (const diagnosis of result.differentials) {
      expect(diagnosis.actions.medications).toEqual([]);
    }
  });

  it('publishes the true maximum of the simplified early-warning score', () => {
    const result = runAssessment(
      makeInput({
        symptoms: ['chest_pain', 'dyspnea'],
        vitals: {
          systolicBP: 70,
          diastolicBP: 40,
          heartRate: 150,
          temperature: 41,
          spo2: 80,
        },
      }),
    );
    expect(result.triage.earlyWarningMax).toBe(11);
    expect(result.triage.earlyWarningScore).toBeLessThanOrEqual(
      result.triage.earlyWarningMax,
    );
  });
});
